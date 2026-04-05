import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import type { Category } from '@/types/sanity'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="text-sm text-gray-600 transition-colors hover:text-foreground dark:text-gray-400"
              >
                {cat.title}
              </Link>
            ))}
            <Link
              href="/trend-radar"
              className="text-sm text-gray-600 transition-colors hover:text-foreground dark:text-gray-400"
            >
              Trend Radar
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile nav */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
