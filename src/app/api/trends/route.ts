import { type NextRequest, NextResponse } from 'next/server'

/**
 * Trend Discovery API endpoint
 *
 * This endpoint is called by a daily cron job to discover trending topics
 * and create/update trend_radar documents in Sanity.
 *
 * Authentication: Bearer token via CRON_SECRET env var
 *
 * Future implementation:
 * 1. Fetch demand signals from trend APIs (Google Trends, etc.)
 * 2. Cross-reference with existing content coverage
 * 3. Score opportunities by volume, competition, and fit
 * 4. Create/update trend_radar document in Sanity
 * 5. Optionally trigger AI outline generation for high-scoring topics
 */
function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return cronSecret && authHeader === `Bearer ${cronSecret}`
}

export async function GET(req: NextRequest) {
  return handleTrends(req)
}

export async function POST(req: NextRequest) {
  return handleTrends(req)
}

async function handleTrends(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // TODO: Implement trend discovery pipeline
    // const signals = await fetchTrendSignals()
    // const scored = scoreOpportunities(signals)
    // await upsertTrendRadar(scored)

    return NextResponse.json({
      success: true,
      message: 'Trend discovery endpoint ready. Implementation pending.',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Trend discovery error:', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
