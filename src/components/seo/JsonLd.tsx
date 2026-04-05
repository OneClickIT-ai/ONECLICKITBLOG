import { SITE_NAME, SITE_URL } from '@/lib/constants'

interface ArticleJsonLdProps {
  title: string
  description?: string
  publishedAt?: string
  authorName?: string
  imageUrl?: string
  slug: string
  type?: 'Article' | 'NewsArticle'
}

export function ArticleJsonLd({
  title,
  description,
  publishedAt,
  authorName,
  imageUrl,
  slug,
  type = 'Article',
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description: description || '',
    image: imageUrl || '',
    datePublished: publishedAt || '',
    author: {
      '@type': 'Person',
      name: authorName || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/post/${slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ProductListJsonLdProps {
  title: string
  description?: string
  products: { name: string; price?: string; rating?: number }[]
  slug: string
}

export function ProductListJsonLd({
  title,
  description,
  products,
  slug,
}: ProductListJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: description || '',
    url: `${SITE_URL}/post/${slug}`,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        ...(p.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: p.rating,
            bestRating: 5,
          },
        }),
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
