import type { DigestItem } from '@/types/sanity'

export function DigestItemCard({ item }: { item: DigestItem }) {
  return (
    <div className="border-b border-gray-100 py-5 last:border-0 dark:border-gray-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">
            {item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.headline}
              </a>
            ) : (
              item.headline
            )}
          </h3>
          {item.source && (
            <span className="mt-1 inline-block text-xs text-gray-500">
              via {item.source.name}
            </span>
          )}
          {item.summary && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.summary}</p>
          )}
          {item.aiTake && (
            <div className="mt-2 rounded-md bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-200">
              <span className="font-medium">AI Take:</span> {item.aiTake}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
