'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import type { Category } from '@/types/sanity'

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <nav className="mx-auto max-w-6xl px-4 py-4">
            <ul className="space-y-3">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="block text-sm text-gray-600 transition-colors hover:text-foreground dark:text-gray-400"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/trend-radar"
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-blue-600 dark:text-blue-400"
                >
                  Trend Radar
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
