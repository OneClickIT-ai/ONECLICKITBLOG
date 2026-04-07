import clsx, { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function estimateReadingTime(blocks: unknown[]): number {
  if (!blocks) return 1
  const text = blocks
    .filter((b: unknown) => (b as { _type: string })._type === 'block')
    .map((b: unknown) =>
      ((b as { children?: { text?: string }[] }).children || [])
        .map((c) => c.text || '')
        .join(' '),
    )
    .join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 230))
}
