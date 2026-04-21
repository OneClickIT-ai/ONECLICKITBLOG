import { getWriteClient } from './sanity-write-client'
import { parseFeed } from './feed-parser'
import { normalizeItems, deduplicateItems, scoreByRecency } from './dedup'
import { assembleDigest } from './digest-assembler'
import { enrichItems } from './ai-summarizer'
import { activeSourcesQuery, existingHashesQuery, todayDraftDigestQuery } from './queries'
import type { IngestionSource, IngestionResult } from './types'

const MAX_DIGEST_ITEMS = 30

/**
 * Run the full RSS ingestion pipeline:
 *
 * 1. Fetch active sources from Sanity
 * 2. Parse each source's RSS feed in parallel
 * 3. Normalize and flatten all items
 * 4. Deduplicate against recent digests
 * 5. Score and rank by recency
 * 6. Assemble into a draft news_digest (create or append)
 */
export async function runIngestionPipeline(): Promise<IngestionResult> {
  const client = getWriteClient()
  const errors: string[] = []

  // 1. Fetch active sources
  const sources = await client.fetch<IngestionSource[]>(activeSourcesQuery)

  if (!sources || sources.length === 0) {
    return {
      sourcesProcessed: 0,
      itemsFetched: 0,
      itemsNew: 0,
      itemsDuplicate: 0,
      digestCreated: false,
      errors: ['No active sources found. Add sources in Sanity Studio.'],
    }
  }

  // 2. Parse all feeds in parallel
  const feedResults = await Promise.all(
    sources
      .filter((s) => s.type === 'rss')
      .map(async (source) => {
        const result = await parseFeed(source)
        if (result.error) errors.push(result.error)
        return { source, items: result.items }
      }),
  )

  // 3. Normalize and flatten
  const allItems = feedResults.flatMap(({ source, items }) =>
    normalizeItems(items, source),
  )

  if (allItems.length === 0) {
    return {
      sourcesProcessed: sources.length,
      itemsFetched: 0,
      itemsNew: 0,
      itemsDuplicate: 0,
      digestCreated: false,
      errors: errors.length
        ? errors
        : ['All feeds returned 0 items.'],
    }
  }

  // 4. Deduplicate against items from the last 3 days
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  const existingUrls = await client.fetch<string[]>(existingHashesQuery, {
    since: threeDaysAgo.toISOString(),
  }) || []

  const { newItems, duplicateCount } = deduplicateItems(allItems, existingUrls)

  if (newItems.length === 0) {
    return {
      sourcesProcessed: sources.length,
      itemsFetched: allItems.length,
      itemsNew: 0,
      itemsDuplicate: duplicateCount,
      digestCreated: false,
      errors,
    }
  }

  // 5. Score, cap, then AI-enrich (priority + aiTake)
  const scored = scoreByRecency(newItems).slice(0, MAX_DIGEST_ITEMS)
  const ranked = await enrichItems(scored)

  // 6. Check for today's existing draft, then assemble
  const now = new Date()
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayEnd = new Date(dayStart.getTime() + 86_400_000)

  const existingDraft = await client.fetch<{ _id: string } | null>(
    todayDraftDigestQuery,
    {
      dayStart: dayStart.toISOString(),
      dayEnd: dayEnd.toISOString(),
    },
  )

  const { digestId, itemCount } = await assembleDigest(
    ranked,
    existingDraft?._id,
  )

  return {
    sourcesProcessed: sources.length,
    itemsFetched: allItems.length,
    itemsNew: itemCount,
    itemsDuplicate: duplicateCount,
    digestCreated: !existingDraft,
    digestId,
    errors,
  }
}
