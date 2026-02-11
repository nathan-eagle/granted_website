'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { supabase } from '@/lib/supabase'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.grantedai.com'

export const ORG_TYPES = [
  'Nonprofit',
  'University',
  'Small Business',
  'Tribal',
  'Government',
  'Other',
] as const

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
  'District of Columbia', 'Puerto Rico', 'Guam', 'US Virgin Islands',
  'American Samoa', 'Northern Mariana Islands',
]

export interface Opportunity {
  name: string
  funder: string
  deadline: string
  amount: string
  fit_score: number
  summary: string
  eligibility: string
  rfp_url?: string
  google_url?: string
  verified?: boolean
  source_provider?: string
  slug?: string
  match_reasons?: string[]
  last_verified_at?: string
  staleness_bucket?: string
  quality_score?: number
  created_at?: string
}

export const SOURCE_LABELS: Record<string, string> = {
  grants_gov: 'Grants.gov',
  sam_assistance: 'SAM.gov',
  nih_guide: 'NIH',
  nsf_funding: 'NSF',
  nih_weekly_index: 'NIH',
  nsf_upcoming: 'NSF',
  ca_grants_portal: 'CA Grants Portal',
  pnd_rfps: 'PND',
}

export const OFFICIAL_SOURCES = new Set([
  'grants_gov',
  'sam_assistance',
  'nih_guide',
  'nsf_funding',
  'nih_weekly_index',
  'nsf_upcoming',
  'ca_grants_portal',
])

export type Phase = 'form' | 'loading' | 'results'

const APPLY_CALLBACK_PATH = '/opportunities'

function getSearchCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem('gf_searches')
    return raw ? parseInt(raw, 10) : 0
  } catch { return 0 }
}

function incrementSearchCount(): number {
  const next = getSearchCount() + 1
  try { localStorage.setItem('gf_searches', String(next)) } catch {}
  return next
}

function isUnlockedCheck(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('gf_unlocked=1')
}

function setUnlockedCookie() {
  document.cookie = 'gf_unlocked=1; max-age=2592000; path=/; SameSite=Lax'
}

export function relativeTime(isoDate: string): string {
  const ms = Date.now() - Date.parse(isoDate)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  if (days < 1) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

export function buildApplyUrl(opportunity: Opportunity): string {
  const grantName = encodeURIComponent(opportunity.name)
  const callback = encodeURIComponent(`${APPLY_CALLBACK_PATH}?source=public-grant-finder&grant=${grantName}`)
  return `${API_URL}/api/auth/signin?callbackUrl=${callback}`
}

export function summarizeTerm(input: string): string {
  const normalized = input.trim().replace(/\s+/g, ' ')
  if (!normalized) return ''
  return normalized.length > 140 ? `${normalized.slice(0, 140)}...` : normalized
}

export function useGrantSearch(onPhaseChange?: (phase: Phase) => void) {
  const [phase, setPhase] = useState<Phase>('form')
  const [orgType, setOrgType] = useState('')
  const [focusArea, setFocusArea] = useState('')
  const [state, setState] = useState('')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [gateRequired, setGateRequired] = useState(false)
  const [broadened, setBroadened] = useState(false)
  const [searchSaved, setSearchSaved] = useState(false)

  const searchParams = useSearchParams()
  const autoSearchedQueryRef = useRef<string | null>(null)
  const profileFetched = useRef(false)

  useEffect(() => {
    setUnlocked(isUnlockedCheck())
  }, [])

  useEffect(() => {
    onPhaseChange?.(phase)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Prepopulate from app profile if logged in
  useEffect(() => {
    if (profileFetched.current) return
    profileFetched.current = true

    fetch(`${API_URL}/api/public/profile-summary`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data?.authenticated || !data.profile) return
        if (data.profile.org_type && !orgType) setOrgType(data.profile.org_type)
        if (data.profile.state && !state) setState(data.profile.state)
      })
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const doSearch = useCallback(async (searchOrgType: string, searchFocusArea: string, searchState: string): Promise<Opportunity[]> => {
    const res = await fetch(`${API_URL}/api/public/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_type: searchOrgType || undefined,
        focus_area: searchFocusArea,
        state: searchState || undefined,
      }),
    })

    if (res.status === 429) {
      setError('You have reached the daily search limit. Enter your email below for unlimited access, or try again tomorrow.')
      setPhase('form')
      setGateRequired(true)
      return []
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Search failed')
    }

    const data = await res.json()
    return data.opportunities || []
  }, [])

  const runSearch = useCallback(async (
    searchOrgType: string,
    searchFocusArea: string,
    searchState: string,
    source: 'manual' | 'url' = 'manual',
  ) => {
    const normalizedFocus = searchFocusArea.trim()
    if (!normalizedFocus) return

    setError('')
    setBroadened(false)
    setGateRequired(false)

    const currentlyUnlocked = isUnlockedCheck()
    setUnlocked(currentlyUnlocked)

    if (!currentlyUnlocked && getSearchCount() >= 3) {
      setGateRequired(true)
      trackEvent('grant_finder_gate', { reason: source === 'url' ? 'search_limit_url' : 'search_limit' })
      return
    }

    trackEvent('grant_finder_search', {
      org_type: searchOrgType || 'any',
      state: searchState || 'any',
      focus_area: summarizeTerm(normalizedFocus),
      focus_area_length: normalizedFocus.length,
      source,
    })
    setPhase('loading')

    try {
      let results = await doSearch(searchOrgType, normalizedFocus, searchState)
      let broadenedSearch = false

      if (results.length === 0 && (searchOrgType || searchState)) {
        if (searchState) {
          results = await doSearch(searchOrgType, normalizedFocus, '')
        }
        if (results.length === 0 && searchOrgType) {
          results = await doSearch('', normalizedFocus, '')
        }
        if (results.length > 0) {
          broadenedSearch = true
          setBroadened(true)
        }
      }

      // Match slugs from public_grants table
      if (supabase && results.length > 0) {
        try {
          const names = results.map(r => r.name)
          const { data: matches } = await supabase
            .from('public_grants')
            .select('name, slug')
            .in('name', names)

          if (matches) {
            const slugMap = new Map(matches.map(m => [m.name, m.slug]))
            for (const r of results) {
              const slug = slugMap.get(r.name)
              if (slug) r.slug = slug
            }
          }
        } catch {}
      }

      results.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))

      setOpportunities(results)
      incrementSearchCount()
      setPhase('results')
      trackEvent('grant_finder_results', {
        count: String(results.length),
        broadened: String(broadenedSearch),
        source,
        focus_area: summarizeTerm(normalizedFocus),
        top_grant: results[0]?.name ?? '',
      })
    } catch (err) {
      trackEvent('grant_finder_search_error', {
        source,
        message: err instanceof Error ? err.message : 'unknown_error',
      })
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPhase('form')
    }
  }, [doSearch])

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await runSearch(orgType, focusArea, state, 'manual')
  }, [orgType, focusArea, state, runSearch])

  const handleBackToBrowsing = useCallback(() => {
    setPhase('form')
    autoSearchedQueryRef.current = null
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    window.history.replaceState({}, '', url.pathname + url.search)
  }, [])

  // Auto-run search from URL query string
  useEffect(() => {
    const q = searchParams.get('q')?.trim() ?? ''

    if (!q) {
      autoSearchedQueryRef.current = null
      return
    }

    if (!focusArea) {
      setFocusArea(q)
    }

    if (autoSearchedQueryRef.current === q) {
      return
    }

    autoSearchedQueryRef.current = q
    void runSearch(orgType, q, state, 'url')
  }, [searchParams, focusArea, orgType, state, runSearch])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    trackEvent('grant_finder_email_submit', {
      org_type: orgType || 'any',
      state: state || 'any',
      focus_area: summarizeTerm(focusArea),
      result_count: opportunities.length,
    })

    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          search_query: { org_type: orgType, focus_area: focusArea, state },
        }),
      })

      if (res.ok) {
        setEmailStatus('success')
        setUnlocked(true)
        setUnlockedCookie()
        document.cookie = `gf_email=${encodeURIComponent(email)}; max-age=2592000; path=/; SameSite=Lax`
        setGateRequired(false)
        trackEvent('grant_finder_email_success', {
          org_type: orgType || 'any',
          state: state || 'any',
          focus_area: summarizeTerm(focusArea),
          result_count: opportunities.length,
        })
      } else {
        setEmailStatus('error')
        trackEvent('grant_finder_email_error', { status: String(res.status) })
      }
    } catch {
      setEmailStatus('error')
      trackEvent('grant_finder_email_error', { status: 'network_error' })
    }
  }

  const handleSaveSearch = async () => {
    const emailValue = email || (document.cookie.match(/gf_email=([^;]+)/)?.[1] ?? '')
    if (!emailValue) {
      document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    try {
      const res = await fetch('/api/searches/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue,
          search_params: { org_type: orgType, focus_area: focusArea, state },
          label: focusArea,
        }),
      })
      if (res.ok) {
        setSearchSaved(true)
        trackEvent('grant_finder_search_saved', {
          focus_area: summarizeTerm(focusArea),
          org_type: orgType || 'any',
        })
      }
    } catch {}
  }

  return {
    // State
    phase,
    orgType,
    focusArea,
    state,
    opportunities,
    error,
    unlocked,
    email,
    emailStatus,
    gateRequired,
    broadened,
    searchSaved,
    // Setters
    setOrgType,
    setFocusArea,
    setState,
    setEmail,
    // Actions
    handleSearch,
    handleBackToBrowsing,
    handleEmailSubmit,
    handleSaveSearch,
  }
}
