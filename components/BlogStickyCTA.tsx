'use client'

import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function BlogStickyCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    function onScroll() {
      if (dismissed) return
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setVisible(scrollPct > 0.3)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  if (dismissed || !visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-yellow-500/30 bg-navy/95 backdrop-blur-sm px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <p className="text-sm font-medium text-white/90 sm:text-base">
          Draft your next grant proposal with AI
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://app.grantedai.com/api/auth/signin?callbackUrl=/overview"
            onClick={() => trackEvent('cta_click_blog_sticky')}
            className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            Start Free Trial
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-white/50 transition hover:text-white/80"
            aria-label="Dismiss"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
