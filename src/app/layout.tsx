import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ConsentBanner } from '@/components/layout/ConsentBanner'
import { sanityFetch } from '@/sanity/fetch'
import { allCategoriesQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { Category, SiteSettings } from '@/types/sanity'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Tech news, buyer guides, and trend analysis delivered daily.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: 'Tech news, buyer guides, and trend analysis delivered daily.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [categories, settings] = await Promise.all([
    sanityFetch<Category[]>({ query: allCategoriesQuery, tags: ['category'] }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
  ])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Header categories={categories || []} />
          <main className="min-h-screen">{children}</main>
          <Footer settings={settings} />
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}
