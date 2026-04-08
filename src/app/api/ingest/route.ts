import { type NextRequest, NextResponse } from 'next/server'
import { runIngestionPipeline } from '@/lib/ingestion'

/**
 * RSS Ingestion API endpoint
 *
 * Called by Vercel Cron (every 30 min) or manually.
 * Pipeline: fetch sources → parse feeds → normalize → dedup → assemble digest
 *
 * Auth: Bearer {CRON_SECRET}
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
    const result = await runIngestionPipeline()

    const status = result.errors.length > 0 && result.itemsNew === 0 ? 207 : 200

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        ...result,
      },
      { status },
    )
  } catch (err) {
    console.error('Ingestion error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message, timestamp: new Date().toISOString() },
      { status: 500 },
    )
  }
}
