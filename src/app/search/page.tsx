import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/fetch'
import { searchQuery } from '@/sanity/lib/queries'
import type { Post } from '@/types/sanity'
import { PostCard } from '@/components/blog/PostCard'
import { SearchForm } from '@/components/blog/SearchForm'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search articles, guides, and digests.',
}

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || ''

  let results: Post[] = []
  if (query.length >= 2) {
    results =
      (await sanityFetch<Post[]>({
        query: searchQuery,
        params: { term: `${query}*` },
        tags: ['post', 'guide'],
      })) || []
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <SearchForm initialQuery={query} />

      {query.length >= 2 && (
        <p className="mb-6 text-sm text-gray-500">
          {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : query.length >= 2 ? (
        <p className="text-gray-500">No results found. Try a different search term.</p>
      ) : null}
    </div>
  )
}
