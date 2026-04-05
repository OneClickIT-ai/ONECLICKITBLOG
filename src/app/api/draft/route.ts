import { type NextRequest, NextResponse } from 'next/server'

/**
 * AI Article Drafting API endpoint
 *
 * This endpoint is called to generate draft articles from trend radar
 * opportunities or editorial briefs. It creates draft original_post or
 * buyer_guide documents in Sanity.
 *
 * Authentication: Bearer token via CRON_SECRET env var
 *
 * Future implementation:
 * 1. Accept a trend item or editorial brief as input
 * 2. Generate an outline using AI
 * 3. Expand the outline into a full draft
 * 4. Structure output to match Sanity schema (portable text blocks)
 * 5. Create a draft document in Sanity with status "drafted"
 * 6. Notify editor for review
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // TODO: Implement AI drafting pipeline
    // const brief = await req.json()
    // const outline = await generateOutline(brief)
    // const draft = await expandDraft(outline)
    // const doc = await createDraftInSanity(draft)

    return NextResponse.json({
      success: true,
      message: 'Draft generation endpoint ready. Implementation pending.',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Draft generation error:', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
