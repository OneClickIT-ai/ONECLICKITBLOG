import { type NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { revalidateTag } from 'next/cache'
import { getWriteClient } from '@/lib/ingestion/sanity-write-client'

const MIN_ITEMS_TO_PUBLISH = 3

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return cronSecret && authHeader === `Bearer ${cronSecret}`
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
    const now = new Date()
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayEnd = new Date(dayStart.getTime() + 86_400_000)

    // Find today's draft digest
    const draft = await client.fetch<{
      _id: string
      title: string
      itemCount: number
    } | null>(
      groq`*[
        _type == "news_digest"
        && status == "draft"
        && publishedAt > $dayStart
        && publishedAt < $dayEnd
      ][0] {
        _id,
        title,
        "itemCount": count(items)
      }`,
      {
        dayStart: dayStart.toISOString(),
        dayEnd: dayEnd.toISOString(),
      },
    )

    if (!draft) {
      return NextResponse.json(
        { success: false, message: 'No draft digest found for today' },
        { status: 200 },
      )
    }

    if (draft.itemCount < MIN_ITEMS_TO_PUBLISH) {
      return NextResponse.json(
        {
          success: false,
          message: `Draft has only ${draft.itemCount} items (minimum: ${MIN_ITEMS_TO_PUBLISH}). Skipping publish.`,
          digestId: draft._id,
        },
        { status: 200 },
      )
    }

    // Publish: set status → "published"
    await client
      .patch(draft._id)
      .set({ status: 'published' })
      .commit()

    // Trigger ISR revalidation for digest and homepage caches
    revalidateTag('digest')
    revalidateTag('post')

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      digestId: draft._id,
      title: draft.title,
      itemCount: draft.itemCount,
    })
  } catch (err) {
    console.error('Publish digest error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
