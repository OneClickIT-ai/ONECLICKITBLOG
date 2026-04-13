import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/fetch'
import { allPostsPageQuery, allPostsCountQuery } from '@/sanity/lib/queries'
import type { Post } from '@/types/sanity'
import { PostCard } from '@/components/blog/PostCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all articles and guides.',
}

const POSTS_PER_PAGE = 12

interface PostsPageProps {
  searchParams: { page?: string }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10) || 1)
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [posts, totalCount] = await Promise.all([
    sanityFetch<Post[]>({
      query: allPostsPageQuery,
      params: { start, end },
      tags: ['post', 'guide'],
    }),
    sanityFetch<number>({
      query: allPostsCountQuery,
      tags: ['post', 'guide'],
    }),
  ])

  const totalPages = Math.ceil((totalCount || 0) / POSTS_PER_PAGE)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">All Posts</h1>

      {(posts || []).length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(posts || []).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts yet.</p>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          {currentPage > 1 && (
            <Link
              href={`/posts?page=${currentPage - 1}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Previous
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/posts?page=${page}`}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          ))}

          {currentPage < totalPages && (
            <Link
              href={`/posts?page=${currentPage + 1}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
