import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import type { SiteSettings } from '@/types/sanity'

export function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-bold">{settings?.title || SITE_NAME}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {settings?.description || 'Tech news, guides, and trend analysis.'}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase text-gray-500">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-foreground dark:text-gray-400">About</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-foreground dark:text-gray-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-foreground dark:text-gray-400">Terms</Link></li>
              <li><Link href="/affiliate-disclosure" className="text-gray-600 hover:text-foreground dark:text-gray-400">Affiliate Disclosure</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase text-gray-500">Connect</h4>
            <div className="flex gap-4">
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-foreground dark:text-gray-400">
                  Twitter
                </a>
              )}
              {settings?.socialLinks?.github && (
                <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-foreground dark:text-gray-400">
                  GitHub
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-foreground dark:text-gray-400">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-800">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
