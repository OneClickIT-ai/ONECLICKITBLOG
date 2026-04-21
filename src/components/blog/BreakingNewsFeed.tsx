import Link from 'next/link'
import { Zap } from 'lucide-react'
import type { BreakingDigestSlice } from '@/types/sanity'

const PRIORITY_BADGE: Record<string, { label: string; cls: string }> = {
  breaking: { label: 'BREAKING', cls: 'bg-red-600 text-white' },
  high: { label: 'TOP STORY', cls: 'bg-orange-500 text-white' },
}

interface Props {
  slices: BreakingDigestSlice[]
}

export function BreakingNewsFeed({ slices }: Props) {
  const items = slices
    .flatMap((s) => s.items.map((item) => ({ ...item, digestSlug: s.digestSlug })))
    .filter((item) => item.headline)
    .slice(0, 6)

  if (items.length === 0) return null

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <Zap size={16} className="text-red-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
          Breaking &amp; Top Stories
        </h2>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
      </div>

      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {items.map((item, i) => {
          const badge = PRIORITY_BADGE[item.priority ?? 'high']
          return (
            <div key={i} className="flex items-start gap-3 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900">
              {badge && (
                <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
              <div className="min-w-0 flex-1">
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold leading-snug text-foreground hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {item.headline}
                  </a>
                ) : (
                  <span className="text-sm font-semibold leading-snug text-foreground">
                    {item.headline}
                  </span>
                )}
                {item.source && (
                  <span className="ml-2 text-xs text-gray-400">via {item.source.name}</span>
                )}
                {item.aiTake && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {item.aiTake}
                  </p>
                )}
              </div>
              {item.category && (
                <Link
                  href={`/category/${item.category.slug}`}
                  className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                >
                  {item.category.title}
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {slices[0]?.digestSlug && (
        <p className="mt-2 text-right text-xs text-gray-400">
          <Link href={`/digest/${slices[0].digestSlug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
            Full daily brief &rarr;
          </Link>
        </p>
      )}
    </section>
  )
}
