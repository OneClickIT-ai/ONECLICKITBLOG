'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const elements = document.querySelectorAll('article h2, article h3')
    const items: TocItem[] = []

    elements.forEach((el) => {
      const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''
      if (!el.id) el.id = id
      items.push({
        id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      })
    })

    setHeadings(items)
  }, [])

  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' },
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        On this page
      </h4>
      <ul className="space-y-1.5">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: level === 3 ? '1rem' : 0 }}>
            <a
              href={`#${id}`}
              className={`block text-sm transition-colors ${
                activeId === id
                  ? 'font-medium text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-foreground dark:text-gray-400'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
