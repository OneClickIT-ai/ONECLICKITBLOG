import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { DigestItem } from '@/types/sanity'

const PRIORITY_CONFIG: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  breaking: {
    label: 'BREAKING',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  },
  high: {
    label: 'TOP STORY',
    dot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  },
  medium: {
    label: 'NEWS',
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  },
  low: {
    label: '',
    dot: 'bg-gray-300',
    badge: '',
  },
}

export function DigestItemCard({ item }: { item: DigestItem }) {
  const priority = item.priority ?? 'medium'
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium

  return (
    <div className="border-b border-gray-100 py-5 last:border-0 dark:border-gray-800">
      <div className="flex items-start gap-3">
        {/* Priority dot */}
        <span
          className={`mt-[6px] h-2.5 w-2.5 shrink-0 rounded-full ${config.dot}`}
          aria-hidden="true"
        />

        <div className="flex-1">
          {/* Header row */}
          <div className="flex flex-wrap items-start gap-2">
            {config.label && (
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
                {config.label}
              </span>
            )}
            {item.category && (
              <Link
                href={`/category/${item.category.slug}`}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              >
                {item.category.title}
              </Link>
            )}
          </div>

          {/* Headline */}
          <h3 className="mt-1.5 font-semibold leading-snug text-foreground">
            {item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.headline}
                <ExternalLink size={12} className="mt-1.5 shrink-0 text-gray-400" />
              </a>
            ) : (
              item.headline
            )}
          </h3>

          {/* Source attribution */}
          {item.source && (
            <span className="mt-1 block text-xs text-gray-400">
              via {item.source.name}
            </span>
          )}

          {/* Summary */}
          {item.summary && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {item.summary}
            </p>
          )}

          {/* AI Take — "Why it matters" */}
          {item.aiTake && (
            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-900 dark:bg-blue-950/50">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Why it matters
              </p>
              <p className="mt-0.5 text-sm text-blue-900 dark:text-blue-200">
                {item.aiTake}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
