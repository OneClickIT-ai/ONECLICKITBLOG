import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/fetch'
import { allDigestsQuery } from '@/sanity/lib/queries'
import { formatDate } from '@/lib/utils'

interface DigestSummary {
  _id: string
  title: string
  slug: string
  summary?: string
  publishedAt?: string
  itemCount: number
}

export const metadata: Metadata = {
  title: 'Daily Brief Archive',
  description: 'Browse all past editions of the OneClickIT Daily Brief.',
  alternates: { canonical: '/digest' },
  openGraph: {
    title: 'Daily Brief Archive',
    description: 'Browse all past editions of the OneClickIT Daily Brief.',
  },
}

export default async function DigestArchivePage() {
  const digests = await sanityFetch<DigestSummary[] | null>({
    query: allDigestsQuery,
    tags: ['digest'],
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Daily Brief Archive</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Every edition of the daily tech brief, from newest to oldest.
        </p>
      </header>

      {digests && digests.length > 0 ? (
        <div className="space-y-4">
          {digests.map((digest) => (
            <Link
              key={digest._id}
              href={`/digest/${digest.slug}`}
              className="block rounded-lg border border-gray-200 p-5 transition-all hover:border-brand-accent hover:shadow-sm dark:border-gray-800 dark:hover:border-brand-light"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">{digest.title}</h2>
                  {digest.summary && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {digest.summary}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  {digest.publishedAt && (
                    <time className="text-xs text-gray-500">
                      {formatDate(digest.publishedAt)}
                    </time>
                  )}
                  <p className="mt-0.5 text-xs text-gray-400">
                    {digest.itemCount} stories
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No digests published yet.</p>
      )}
    </div>
  )
}
