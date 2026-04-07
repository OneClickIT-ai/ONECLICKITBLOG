import { createHash } from 'crypto'
import type { ParsedFeedItem, NormalizedItem, IngestionSource } from './types'

/**
 * Generate a stable hash for deduplication.
 * Uses the item's guid (or link as fallback) to create a SHA-256 hash.
 */
export function hashItem(item: ParsedFeedItem): string {
  const input = item.guid || item.link
  return createHash('sha256').update(input).digest('hex').slice(0, 16)
}

/**
 * Normalize parsed feed items and attach source metadata.
 */
export function normalizeItems(
  items: ParsedFeedItem[],
  source: IngestionSource,
): NormalizedItem[] {
  return items.map((item) => ({
    headline: item.title,
    sourceUrl: item.link,
    sourceRef: source._id,
    sourceName: source.name,
    summary: item.summary,
    publishedAt: item.publishedAt,
    hash: hashItem(item),
    categoryRef: source.category?._id,
  }))
}

/**
 * Remove items whose URLs already exist in recent digests.
 * Uses a Set of known URLs for O(1) lookup.
 */
export function deduplicateItems(
  items: NormalizedItem[],
  existingUrls: string[],
): { newItems: NormalizedItem[]; duplicateCount: number } {
  const seen = new Set(existingUrls)
  const unique: NormalizedItem[] = []
  let duplicateCount = 0

  for (const item of items) {
    if (seen.has(item.sourceUrl)) {
      duplicateCount++
      continue
    }
    seen.add(item.sourceUrl)
    unique.push(item)
  }

  return { newItems: unique, duplicateCount }
}

/**
 * Score items by recency. More recent items get higher scores.
 * Returns items sorted by score descending.
 */
export function scoreByRecency(items: NormalizedItem[]): NormalizedItem[] {
  const now = Date.now()
  return [...items].sort((a, b) => {
    const ageA = now - new Date(a.publishedAt).getTime()
    const ageB = now - new Date(b.publishedAt).getTime()
    return ageA - ageB // newer first
  })
}
