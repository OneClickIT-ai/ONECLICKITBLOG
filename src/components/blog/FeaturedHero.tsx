import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { urlFor } from '@/sanity/image'
import type { Post } from '@/types/sanity'

export function FeaturedHero({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  const [main, ...rest] = posts

  return (
    <section className="mb-12">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Main featured */}
        <Link href={`/post/${main.slug}`} className="group">
          {main.mainImage?.asset && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
              <Image
                src={urlFor(main.mainImage).width(800).height(450).url()}
                alt={main.mainImage.alt || main.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}
          <div className="mt-3">
            {main.categories?.[0] && (
              <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {main.categories[0].title}
              </span>
            )}
            <h2 className="mt-1 text-2xl font-bold leading-tight text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {main.title}
            </h2>
            {main.excerpt && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">{main.excerpt}</p>
            )}
            {main.publishedAt && (
              <time className="mt-2 block text-sm text-gray-500">
                {formatDate(main.publishedAt)}
              </time>
            )}
          </div>
        </Link>

        {/* Secondary featured */}
        <div className="flex flex-col gap-6">
          {rest.map((post) => (
            <Link key={post._id} href={`/post/${post.slug}`} className="group flex gap-4">
              {post.mainImage?.asset && (
                <div className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={urlFor(post.mainImage).width(288).height(192).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="144px"
                  />
                </div>
              )}
              <div>
                {post.categories?.[0] && (
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {post.categories[0].title}
                  </span>
                )}
                <h3 className="mt-0.5 font-semibold leading-snug text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {post.title}
                </h3>
                {post.publishedAt && (
                  <time className="mt-1 block text-xs text-gray-500">
                    {formatDate(post.publishedAt)}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
