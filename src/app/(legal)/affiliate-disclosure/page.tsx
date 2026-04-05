import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Affiliate Disclosure</h1>
      <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
        <p>
          {SITE_NAME} participates in various affiliate programs. This means we may
          earn a commission when you click on or make purchases through links on our
          site, at no additional cost to you.
        </p>
        <p>
          Our editorial content is not influenced by affiliate partnerships. Product
          recommendations and reviews are based on our independent analysis and research.
        </p>
        <p>
          Affiliate links are clearly marked in our buyer guides. We only recommend
          products and services we believe provide genuine value to our readers.
        </p>
        <p>
          Thank you for supporting {SITE_NAME} through these links. Your support helps
          us continue creating quality content.
        </p>
      </div>
    </div>
  )
}
