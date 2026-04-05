import { PostCard } from './PostCard'
import type { Post } from '@/types/sanity'

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
      <h2 className="mb-6 text-xl font-bold">Related Posts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  )
}
