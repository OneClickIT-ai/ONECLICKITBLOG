export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-3 h-10 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-4 flex gap-4">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-6 aspect-[16/9] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
            style={{ width: `${70 + Math.random() * 30}%` }}
          />
        ))}
      </div>
    </div>
  )
}
