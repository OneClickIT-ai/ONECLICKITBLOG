import { sanityFetch } from '@/sanity/fetch'
import { groq } from 'next-sanity'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

interface FeedPost {
  title: string
  slug: string
  excerpt?: string
  publishedAt: string
  _type: string
}

const feedQuery = groq`*[_type in ["original_post", "buyer_guide", "news_digest"] && defined(publishedAt)] | order(publishedAt desc)[0...20] {
  title, "slug": slug.current, excerpt, publishedAt, _type
}`

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function postUrl(post: FeedPost): string {
  const prefix = post._type === 'news_digest' ? 'digest' : 'post'
  return `${SITE_URL}/${prefix}/${post.slug}`
}

export async function GET() {
  const posts = await sanityFetch<FeedPost[]>({
    query: feedQuery,
    tags: ['post', 'guide', 'digest'],
  })

  const items = (posts || [])
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl(post)}</link>
      <guid isPermaLink="true">${postUrl(post)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>${post.excerpt ? `\n      <description>${escapeXml(post.excerpt)}</description>` : ''}
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>Tech news, buyer guides, and trend analysis delivered daily.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
