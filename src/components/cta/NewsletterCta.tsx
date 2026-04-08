'use client'

import { useState, type FormEvent } from 'react'

export function NewsletterCta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Thanks for subscribing!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="rounded-xl bg-brand-accent/10 p-8 text-center dark:bg-brand/30">
      <h3 className="text-xl font-bold">Stay in the loop</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Get the daily brief and top picks delivered to your inbox.
      </p>

      {status === 'success' ? (
        <p className="mt-4 font-medium text-green-600">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex justify-center gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-accent focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-lg bg-brand-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
    </section>
  )
}
