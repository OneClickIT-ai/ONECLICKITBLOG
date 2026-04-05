'use client'

import { useState, type FormEvent } from 'react'

export function NewsletterCta({ endpoint }: { endpoint?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!endpoint || !email) return

    setStatus('loading')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="rounded-xl bg-blue-50 p-8 text-center dark:bg-blue-950">
      <h3 className="text-xl font-bold">Stay in the loop</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Get the daily brief and top picks delivered to your inbox.
      </p>

      {status === 'success' ? (
        <p className="mt-4 font-medium text-green-600">Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex justify-center gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </section>
  )
}
