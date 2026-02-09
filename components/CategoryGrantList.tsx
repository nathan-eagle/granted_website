'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import GrantCard from '@/components/GrantCard'
import type { GrantCategory, PublicGrant } from '@/lib/grants'

type Props = {
  category: GrantCategory
  grants: PublicGrant[]
}

type StatusFilter = 'all' | 'active' | 'upcoming' | 'closed'

const VISIBLE_LIMIT = 10

function hasUnlockCookie(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('gf_unlocked=1')
}

function setUnlockCookie() {
  if (typeof document === 'undefined') return
  document.cookie = 'gf_unlocked=1; max-age=2592000; path=/; SameSite=Lax'
}

export default function CategoryGrantList({ category, grants }: Props) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    setUnlocked(hasUnlockCookie())
  }, [])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return grants.filter((grant) => {
      const matchesStatus =
        statusFilter === 'all' ? true : grant.status === statusFilter

      if (!matchesStatus) return false
      if (!normalizedQuery) return true

      const haystack = [
        grant.name,
        grant.funder,
        grant.summary ?? '',
        grant.eligibility ?? '',
        grant.amount ?? '',
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [grants, query, statusFilter])

  const visibleGrants = unlocked ? filtered : filtered.slice(0, VISIBLE_LIMIT)
  const hiddenCount = Math.max(filtered.length - visibleGrants.length, 0)

  async function handleUnlock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return

    setEmailStatus('loading')
    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          search_query: {
            source: 'category_page',
            category: category.slug,
            query: query.trim() || null,
            status_filter: statusFilter,
          },
        }),
      })

      if (!res.ok) {
        setEmailStatus('error')
        return
      }

      setUnlockCookie()
      setUnlocked(true)
      setEmailStatus('success')
    } catch {
      setEmailStatus('error')
    }
  }

  return (
    <>
      <div className="card p-5 md:p-6 mb-8">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${category.name.toLowerCase()} by keyword...`}
            className="rounded-md border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-navy-light/40 outline-none focus:border-brand-yellow/60 transition"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-navy-light/50">
          {filtered.length} matching grants
        </p>
      </div>

      {visibleGrants.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGrants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card">
          <p className="heading-md text-navy/70">No grants match this filter</p>
          <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
            Try a broader keyword or switch to a different status.
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
                Unlock {hiddenCount} more grants
              </h3>
              <p className="text-white/60 mt-2 text-sm max-w-md mx-auto">
                Enter your email to see the full list, including summaries,
                eligibility details, and source links.
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
                  Unlocked. You can now view all grants on this page.
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
