'use client'

import { useEffect, useState, useCallback } from 'react'
import { isSignedIn } from '@/lib/auth-status'

const APP_SIGNIN_BASE = 'https://app.grantedai.com/api/auth/signin'

export default function BookmarkButton({
  slug,
  size = 'md',
}: {
  slug: string
  size?: 'sm' | 'md'
}) {
  const [authed, setAuthed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const signedIn = isSignedIn()
    setAuthed(signedIn)
    if (signedIn) {
      fetch(`/api/saved-grants?slug=${encodeURIComponent(slug)}`)
        .then((r) => r.json())
        .then((d) => setSaved(!!d.saved))
        .catch(() => {})
    }
  }, [slug])

  const toggle = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/saved-grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (res.ok) setSaved(data.saved)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [slug, loading])

  // Not signed in — redirect to app sign-in with save callback
  const saveUrl = `${APP_SIGNIN_BASE}?callbackUrl=${encodeURIComponent(`/saved-grants?save=${slug}`)}`

  const icon = (
    <svg
      width={size === 'sm' ? 14 : 16}
      height={size === 'sm' ? 14 : 16}
      viewBox="0 0 24 24"
      fill={saved ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )

  if (size === 'sm') {
    if (authed) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggle()
          }}
          disabled={loading}
          title={saved ? 'Remove from saved' : 'Save for later'}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-md border transition-colors ${
            saved
              ? 'border-brand-yellow/40 text-brand-gold bg-brand-yellow/10'
              : 'border-navy/10 text-navy-light/40 hover:text-brand-gold hover:border-brand-yellow/40 hover:bg-brand-yellow/5'
          } ${loading ? 'opacity-50' : ''}`}
        >
          {icon}
        </button>
      )
    }
    return (
      <a
        href={saveUrl}
        title="Save for later"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-navy/10 text-navy-light/40 hover:text-brand-gold hover:border-brand-yellow/40 hover:bg-brand-yellow/5 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {icon}
      </a>
    )
  }

  // size === 'md'
  if (authed) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
          saved
            ? 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-gold'
            : 'border-navy/15 bg-white text-navy hover:border-brand-yellow/40 hover:bg-brand-yellow/5'
        } ${loading ? 'opacity-50' : ''}`}
      >
        {icon}
        {saved ? 'Saved' : 'Save'}
      </button>
    )
  }

  return (
    <a
      href={saveUrl}
      className="inline-flex items-center gap-2 rounded-md border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:border-brand-yellow/40 hover:bg-brand-yellow/5 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {icon}
      Save
    </a>
  )
}
