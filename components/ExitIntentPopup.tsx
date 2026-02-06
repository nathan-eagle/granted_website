'use client'

import { useEffect, useState, useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const dismiss = useCallback(() => {
    setVisible(false)
    try {
      sessionStorage.setItem('exit_popup_dismissed', '1')
    } catch { /* SSR / private browsing */ }
  }, [])

  const show = useCallback(() => {
    try {
      if (sessionStorage.getItem('exit_popup_dismissed')) return
    } catch { /* SSR / private browsing */ }
    setVisible(true)
    trackEvent('exit_intent_shown')
  }, [])

  useEffect(() => {
    // Already dismissed this session
    try {
      if (sessionStorage.getItem('exit_popup_dismissed')) return
    } catch { return }

    // Desktop: mouse leaves viewport toward top
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) show()
    }

    // Mobile fallback: show after 45 seconds
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) show()
    }, 45_000)

    document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      clearTimeout(timer)
    }
  }, [show])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    trackEvent('email_signup', { source: 'exit_intent' })

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        setTimeout(dismiss, 2500)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-navy border border-white/10 p-8 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 text-white/40 transition hover:text-white/80"
          aria-label="Close"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <p className="text-lg font-semibold text-brand-yellow">Check your inbox!</p>
            <p className="mt-2 text-sm text-white/60">Your checklist is on the way.</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-3">
              Before you go
            </p>
            <h3 className="text-xl font-bold text-white leading-snug">
              Grab our free Federal Grant Writing Checklist
            </h3>
            <p className="mt-2 text-sm text-white/50">
              Used by 500+ organizations. Covers everything from eligibility screening to final submission.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.org"
                className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-yellow/60 focus:ring-1 focus:ring-brand-yellow/40 transition"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-md bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending...' : 'Download Free'}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-400">Something went wrong. Try again.</p>
              )}
            </form>
            <p className="mt-4 text-xs text-white/30 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
