'use client'

import { Share2, ExternalLink } from 'lucide-react'

export function ShareBar({ title, slug }: { title: string; slug: string }) {
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/post/${slug}`
    : ''

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
        aria-label="Share on Twitter"
      >
        <ExternalLink size={16} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
        aria-label="Share on LinkedIn"
      >
        <ExternalLink size={16} />
      </a>
      <button
        onClick={() => navigator.clipboard?.writeText(url)}
        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
        aria-label="Copy link"
      >
        <Share2 size={16} />
      </button>
    </div>
  )
}
