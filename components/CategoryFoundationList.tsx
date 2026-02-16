'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import FoundationCard from '@/components/FoundationCard'
import type { Foundation } from '@/lib/foundations'
import { trackEvent } from '@/lib/analytics'

type Props = {
  categoryLabel: string
  categorySlug: string
  foundations: Foundation[]
}

const VISIBLE_LIMIT = 30

function hasUnlockCookie(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('gf_unlocked=1')
}

function setUnlockCookie() {
  if (typeof document === 'undefined') return
  document.cookie = 'gf_unlocked=1; max-age=2592000; path=/; SameSite=Lax'
}

export default function CategoryFoundationList({ categoryLabel, categorySlug, foundations }: Props) {
  const [query, setQuery] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    setUnlocked(hasUnlockCookie())
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      trackEvent('foundation_category_filter_change', {
        category_slug: categorySlug,
        query: query.trim() || undefined,
      })
    }, 400)
    return () => window.clearTimeout(timeout)
  }, [categorySlug, query])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return foundations

    return foundations.filter((f) => {
      const haystack = [f.name, f.city ?? '', f.state ?? '']
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [foundations, query])

  const visibleFoundations = unlocked ? filtered : filtered.slice(0, VISIBLE_LIMIT)
  const hiddenCount = Math.max(filtered.length - visibleFoundations.length, 0)

  async function handleUnlock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return

    setEmailStatus('loading')
    trackEvent('foundation_unlock_submit', {
      category_slug: categorySlug,
      query: query.trim() || undefined,
      hidden_count: hiddenCount,
    })
    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          search_query: {
            source: 'foundation_category',
            category: categorySlug,
            query: query.trim() || null,
          },
        }),
      })

      if (!res.ok) {
        setEmailStatus('error')
        trackEvent('foundation_unlock_error', {
          category_slug: categorySlug,
          status: String(res.status),
        })
        return
      }

      setUnlockCookie()
      setUnlocked(true)
      setEmailStatus('success')
      trackEvent('foundation_unlock_success', {
        category_slug: categorySlug,
        query: query.trim() || undefined,
      })
    } catch {
      setEmailStatus('error')
      trackEvent('foundation_unlock_error', {
        category_slug: categorySlug,
        status: 'network_error',
      })
    }
  }

  return (
    <>
      <div className="card p-5 md:p-6 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${categoryLabel.toLowerCase()} foundations by name or city...`}
          className="w-full rounded-md border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-navy-light/40 outline-none focus:border-brand-yellow/60 transition"
        />
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-navy-light/50">
          {filtered.length.toLocaleString()} matching foundations
        </p>
      </div>

      {visibleFoundations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleFoundations.map((f) => (
            <FoundationCard key={f.id} foundation={f} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card">
          <p className="heading-md text-navy/70">No foundations match this filter</p>
          <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
            Try a broader keyword or check your spelling.
          </p>
        </div>
      )}

      {!unlocked && hiddenCount > 0 && (
        <section className="card overflow-hidden mt-8">
          <div className="bg-navy p-8 text-center noise-overlay">
            <div className="relative z-10">
              <h3
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Unlock {hiddenCount.toLocaleString()} more foundations
              </h3>
              <p className="text-white/60 mt-2 text-sm max-w-md mx-auto">
                Enter your email to see the full list, including assets,
                locations, and category details.
              </p>

              <form
                onSubmit={handleUnlock}
                className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
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
                  disabled={emailStatus === 'loading'}
                  className="rounded-md bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60 shrink-0"
                >
                  {emailStatus === 'loading' ? 'Unlocking...' : 'Unlock'}
                </button>
              </form>

              {emailStatus === 'error' && (
                <p className="text-xs text-red-400 mt-2">
                  Something went wrong. Please try again.
                </p>
              )}
              {emailStatus === 'success' && (
                <p className="text-xs text-emerald-300 mt-2">
                  Unlocked. You can now view all foundations on this page.
                </p>
              )}
              <p className="mt-3 text-xs text-white/30">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
