import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/types/sanity'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/icon.svg"
              alt="OneClickIT"
              width={36}
              height={36}
              className="dark:brightness-150"
            />
            <span className="text-lg font-bold">
              <span className="text-[#1a3a4a] dark:text-gray-100">OneClick</span>
              <span className="text-[#1a3a4a] dark:text-gray-100">IT</span>
              <span className="text-[#2b7a8e]">.</span>
              <span className="text-[#2b7a8e]">blog</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="text-sm text-gray-600 transition-colors hover:text-[#2b7a8e] dark:text-gray-400 dark:hover:text-[#5ba8b8]"
              >
                {cat.title}
              </Link>
            ))}
            <Link
              href="/trend-radar"
              className="text-sm text-gray-600 transition-colors hover:text-[#2b7a8e] dark:text-gray-400 dark:hover:text-[#5ba8b8]"
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
