'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    trackEvent('email_signup', { source: 'homepage' })

    try {
      const res = await fetch('/api/subscribe', {
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

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-xl text-center py-8">
        <p className="text-lg font-semibold text-brand-yellow">You&apos;re in!</p>
        <p className="mt-2 text-white/60 text-sm">Check your inbox for grant writing tips.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@organization.org"
        className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-yellow/60 focus:ring-1 focus:ring-brand-yellow/40 transition"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-md bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60 shrink-0"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 sm:absolute sm:bottom-0 sm:translate-y-full sm:pt-1">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  )
}
