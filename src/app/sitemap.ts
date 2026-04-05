import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/fetch'
import {
  allPostSlugsQuery,
  allGuideSlugsQuery,
  allDigestSlugsQuery,
  allCategorySlugsQuery,
} from '@/sanity/lib/queries'
import type { SlugItem } from '@/types/sanity'
import { SITE_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, guides, digests, categories] = await Promise.all([
    sanityFetch<SlugItem[]>({ query: allPostSlugsQuery, tags: ['post'] }),
    sanityFetch<SlugItem[]>({ query: allGuideSlugsQuery, tags: ['guide'] }),
    sanityFetch<SlugItem[]>({ query: allDigestSlugsQuery, tags: ['digest'] }),
    sanityFetch<SlugItem[]>({ query: allCategorySlugsQuery, tags: ['category'] }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/trend-radar`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/affiliate-disclosure`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const postPages = (posts || []).map((p) => ({
    url: `${SITE_URL}/post/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const guidePages = (guides || []).map((g) => ({
    url: `${SITE_URL}/post/${g.slug}`,
    lastModified: new Date(g._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const digestPages = (digests || []).map((d) => ({
    url: `${SITE_URL}/digest/${d.slug}`,
    lastModified: new Date(d._updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  const categoryPages = (categories || []).map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(c._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...postPages, ...guidePages, ...digestPages, ...categoryPages]
}
