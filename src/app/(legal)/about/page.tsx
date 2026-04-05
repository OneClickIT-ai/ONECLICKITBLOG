import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${SITE_NAME}.`,
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">About {SITE_NAME}</h1>
      <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
        <p>
          {SITE_NAME} delivers daily tech news digests, in-depth original articles,
          and curated buyer guides to help you make informed technology decisions.
        </p>
        <p>
          Our mission is to cut through the noise and surface the stories, tools,
          and trends that matter most to technology professionals and enthusiasts.
        </p>
        <p>
          Have a tip or want to get in touch? We&apos;d love to hear from you.
        </p>
      </div>
    </div>
  )
}
