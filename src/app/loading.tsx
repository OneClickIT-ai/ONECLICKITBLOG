export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Featured skeleton */}
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="aspect-[16/9] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="flex flex-col gap-6">
          <div className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Posts grid skeleton */}
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[16/9] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
