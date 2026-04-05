import { type NextRequest, NextResponse } from 'next/server'

/**
 * RSS Ingestion API endpoint
 *
 * This endpoint is called by a cron job or external worker to trigger
 * RSS feed ingestion. It reads from configured sources, normalizes items,
 * deduplicates, and creates draft digest entries in Sanity.
 *
 * Authentication: Bearer token via CRON_SECRET env var
 *
 * Future implementation:
 * 1. Fetch active sources from Sanity
 * 2. Poll each source's RSS feed
 * 3. Normalize and deduplicate items
 * 4. Score and categorize items
 * 5. Create draft news_digest with digestItems in Sanity
 */
function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return cronSecret && authHeader === `Bearer ${cronSecret}`
}

export async function GET(req: NextRequest) {
  return handleIngest(req)
}

export async function POST(req: NextRequest) {
  return handleIngest(req)
}

async function handleIngest(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // TODO: Implement RSS ingestion pipeline
    // const sources = await sanityFetch({ query: activeSourcesQuery })
    // for (const source of sources) {
    //   const feed = await parseFeed(source.url)
    //   const items = deduplicateItems(feed.items)
    //   await createDraftDigest(items)
    // }

    return NextResponse.json({
      success: true,
      message: 'Ingestion endpoint ready. Implementation pending.',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Ingestion error:', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
