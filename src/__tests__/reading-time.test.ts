import { describe, it, expect } from 'vitest'
import { estimateReadingTime } from '@/lib/reading-time'
import type { PortableTextBlock } from '@portabletext/types'

describe('estimateReadingTime', () => {
  it('returns 0 for undefined body', () => {
    expect(estimateReadingTime(undefined)).toBe(0)
  })

  it('returns 0 for empty body', () => {
    expect(estimateReadingTime([])).toBe(0)
  })

  it('returns at least 1 minute for short content', () => {
    const blocks: PortableTextBlock[] = [
      {
        _type: 'block',
        _key: 'a',
        children: [{ _type: 'span', _key: 'b', text: 'Hello world' }],
      } as PortableTextBlock,
    ]
    expect(estimateReadingTime(blocks)).toBe(1)
  })

  it('estimates longer content correctly', () => {
    // 238 words per minute, so 476 words should be ~2 minutes
    const longText = Array(476).fill('word').join(' ')
    const blocks: PortableTextBlock[] = [
      {
        _type: 'block',
        _key: 'a',
        children: [{ _type: 'span', _key: 'b', text: longText }],
      } as PortableTextBlock,
    ]
    expect(estimateReadingTime(blocks)).toBe(2)
  })

  it('ignores non-block types', () => {
    const blocks: PortableTextBlock[] = [
      { _type: 'image', _key: 'a' } as PortableTextBlock,
    ]
    expect(estimateReadingTime(blocks)).toBe(0)
  })
})
