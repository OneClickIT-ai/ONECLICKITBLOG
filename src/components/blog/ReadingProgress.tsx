'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const article = document.querySelector('article')
      if (!article) return
      const rect = article.getBoundingClientRect()
      const total = article.scrollHeight - window.innerHeight
      const scrolled = -rect.top
      setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  if (progress <= 0) return null

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-0.5">
      <div
        className="h-full bg-brand-accent transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
