import type { PortableTextBlock } from '@portabletext/types'

const WORDS_PER_MINUTE = 238

/**
 * Extracts plain text from Portable Text blocks and estimates reading time.
 */
export function estimateReadingTime(body?: PortableTextBlock[]): number {
  if (!body || body.length === 0) return 0

  let wordCount = 0
  for (const block of body) {
    if (block._type === 'block' && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child.text === 'string') {
          wordCount += child.text.split(/\s+/).filter(Boolean).length
        }
      }
    }
  }

  if (wordCount === 0) return 0
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}
