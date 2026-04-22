import { type NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { getWriteClient } from '@/lib/ingestion/sanity-write-client'

/**
 * Auto-publish cron endpoint.
 *
 * Called daily at 20:00 UTC by Vercel Cron.
 * Finds draft digests that have accumulated enough stories and publishes them.
 * A digest is "ready" when it has >= MIN_ITEMS items.
 *
 * Auth: Bearer {CRON_SECRET}
 */

const MIN_ITEMS = 10

const draftsReadyQuery = groq`*[
  _type == "news_digest"
  && status == "draft"
  && count(items) >= ${MIN_ITEMS}
] {
  _id,
  title,
  "itemCount": count(items)
}`

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  return Boolean(secret && auth === `Bearer ${secret}`)
}

export async function GET(req: NextRequest) {
  return handlePublish(req)
}

export async function POST(req: NextRequest) {
  return handlePublish(req)
}

async function handlePublish(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const client = getWriteClient()
    const drafts =
      (await client.fetch<
        { _id: string; title: string; itemCount: number }[]
      >(draftsReadyQuery)) || []

    if (drafts.length === 0) {
      return NextResponse.json({
        success: true,
        published: 0,
        message: `No draft digests with >= ${MIN_ITEMS} items.`,
      })
    }

    type DigestRow = { _id: string; title: string; itemCount: number }

    await Promise.all(
      (drafts as DigestRow[]).map((d) =>
        client.patch(d._id).set({ status: 'published' }).commit(),
      ),
    )

    return NextResponse.json({
      success: true,
      published: drafts.length,
      digests: (drafts as DigestRow[]).map((d) => ({
        id: d._id,
        title: d.title,
        itemCount: d.itemCount,
      })),
    })
  } catch (err) {
    console.error('Digest publish error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}
