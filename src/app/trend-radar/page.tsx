import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/fetch'
import { trendRadarQuery } from '@/sanity/lib/queries'
import type { TrendRadar } from '@/types/sanity'
import { formatDate } from '@/lib/utils'
import { TrendingUp, Minus, TrendingDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Trend Radar',
  description: 'Discover emerging tech trends, rising topics, and what to watch.',
  alternates: { canonical: '/trend-radar' },
  openGraph: {
    title: 'Trend Radar',
    description: 'Discover emerging tech trends, rising topics, and what to watch.',
  },
}

const momentumIcon = {
  rising: <TrendingUp size={16} className="text-green-500" />,
  stable: <Minus size={16} className="text-yellow-500" />,
  declining: <TrendingDown size={16} className="text-red-500" />,
}

export default async function TrendRadarPage() {
  const radar = await sanityFetch<TrendRadar | null>({
    query: trendRadarQuery,
    tags: ['trend'],
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Trend Radar</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {radar?.description || 'Emerging topics and demand signals across the tech landscape.'}
        </p>
        {radar?.publishedAt && (
          <time className="mt-1 block text-sm text-gray-500">
            Updated {formatDate(radar.publishedAt)}
          </time>
        )}
      </header>

      {radar?.trends && radar.trends.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {radar.trends.map((trend, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md dark:border-gray-800"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{trend.title}</h3>
                {trend.momentum && momentumIcon[trend.momentum]}
              </div>
              {trend.category && (
                <Link
                  href={`/category/${trend.category.slug}`}
                  className="mt-1 inline-block text-xs text-blue-600 dark:text-blue-400"
                >
                  {trend.category.title}
                </Link>
              )}
              {trend.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {trend.description}
                </p>
              )}
              {trend.relatedPosts && trend.relatedPosts.length > 0 && (
                <div className="mt-3 border-t border-gray-100 pt-2 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Related:</span>
                  <ul className="mt-1 space-y-1">
                    {trend.relatedPosts.map((post) => (
                      <li key={post._id}>
                        <Link
                          href={`/post/${post.slug}`}
                          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No trend data available yet.</p>
      )}
    </div>
  )
}
