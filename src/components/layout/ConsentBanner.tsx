'use client'

import { useEffect, useState } from 'react'

const CONSENT_KEY = 'oneclickit-consent'

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We use cookies for analytics and advertising. By continuing to browse, you agree to our{' '}
          <a href="/privacy-policy" className="underline">
            privacy policy
          </a>
          .
        </p>
        <div className="flex gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
