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
  'Individual',
  'HBCU',
  'Tribal',
  'FFRDC',
  'For-profit / SBIR',
  'Government',
  'Other',
] as const

export type AmountRangeKey = '' | 'lt50k' | '50k-250k' | '250k-1m' | 'gt1m'

export const AMOUNT_RANGES: { key: AmountRangeKey; label: string; min?: number; max?: number }[] = [
  { key: '', label: 'Any amount' },
  { key: 'lt50k', label: 'Under $50K', max: 50_000 },
  { key: '50k-250k', label: '$50K – $250K', min: 50_000, max: 250_000 },
  { key: '250k-1m', label: '$250K – $1M', min: 250_000, max: 1_000_000 },
  { key: 'gt1m', label: 'Over $1M', min: 1_000_000 },
]

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

export function isPastDeadline(deadline: string | undefined): boolean {
  if (!deadline || deadline.toLowerCase() === 'rolling') return false
  const parsed = Date.parse(deadline)
  if (isNaN(parsed)) return false
  return parsed < Date.now()
}

/** Returns urgency label like "Closing today!" or "Closing in 3 days" if deadline is within 14 days */
export function deadlineUrgency(deadline: string | undefined): string | null {
  if (!deadline || deadline.toLowerCase() === 'rolling') return null
  const parsed = Date.parse(deadline)
  if (isNaN(parsed)) return null
  const daysLeft = Math.ceil((parsed - Date.now()) / (1000 * 60 * 60 * 24))
  if (daysLeft < 0) return null
  if (daysLeft === 0) return 'Closing today!'
  if (daysLeft === 1) return 'Closing tomorrow!'
  if (daysLeft <= 14) return `Closing in ${daysLeft} days`
  return null
}

/** Deduplicate grants by normalized name, keeping the one with the higher fit_score */
export function deduplicateOpportunities(opps: Opportunity[]): Opportunity[] {
  const seen = new Map<string, Opportunity>()
  for (const opp of opps) {
    const key = opp.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    const existing = seen.get(key)
    if (!existing || (opp.fit_score || 0) > (existing.fit_score || 0)) {
      seen.set(key, opp)
    }
  }
  return Array.from(seen.values())
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
  const [amountRange, setAmountRange] = useState<AmountRangeKey>('')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [gateRequired, setGateRequired] = useState(false)
  const [broadened, setBroadened] = useState(false)
  const [searchSaved, setSearchSaved] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [enrichedNames, setEnrichedNames] = useState<Set<string>>(new Set())

  const searchParams = useSearchParams()
  const autoSearchedQueryRef = useRef<string | null>(null)
  const profileFetched = useRef(false)
  const enrichPollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup enrichment poll on unmount
  useEffect(() => {
    return () => {
      if (enrichPollRef.current) clearTimeout(enrichPollRef.current)
    }
  }, [])

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

  const doSearch = useCallback(async (
    searchOrgType: string,
    searchFocusArea: string,
    searchState: string,
    poll = false,
    searchAmountRange?: AmountRangeKey,
  ): Promise<{ opportunities: Opportunity[]; dbOnly: boolean }> => {
    const amountDef = AMOUNT_RANGES.find(r => r.key === (searchAmountRange ?? ''))
    const res = await fetch(`${API_URL}/api/public/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_type: searchOrgType || undefined,
        focus_area: searchFocusArea,
        state: searchState || undefined,
        ...(poll ? { poll: true } : {}),
        ...(amountDef?.min ? { amount_min: amountDef.min } : {}),
        ...(amountDef?.max ? { amount_max: amountDef.max } : {}),
      }),
    })

    if (res.status === 429) {
      setError('You have reached the daily search limit. Enter your email below for unlimited access, or try again tomorrow.')
      setPhase('form')
      setGateRequired(true)
      return { opportunities: [], dbOnly: false }
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Search failed')
    }

    const data = await res.json()
    return {
      opportunities: data.opportunities || [],
      dbOnly: Boolean(data.db_only),
    }
  }, [])

  const matchSlugs = useCallback(async (results: Opportunity[]) => {
    if (!supabase || results.length === 0) return
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
  }, [])

  const startEnrichmentPoll = useCallback((
    searchOrgType: string,
    searchFocusArea: string,
    searchState: string,
    initialNames: Set<string>,
    searchAmountRange?: AmountRangeKey,
  ) => {
    let attempts = 0
    const maxAttempts = 12 // 12 * 5s = 60s max

    const poll = async () => {
      attempts++
      if (attempts > maxAttempts) {
        setEnriching(false)
        return
      }

      try {
        const result = await doSearch(searchOrgType, searchFocusArea, searchState, true, searchAmountRange)

        if (!result.dbOnly && result.opportunities.length > 0) {
          const dedupedEnriched = deduplicateOpportunities(result.opportunities)
          await matchSlugs(dedupedEnriched)
          // Server returns grants in reranked order — preserve that order

          // Identify new grants from LLM enrichment (post-dedup to avoid count mismatch)
          const newNames = new Set<string>()
          for (const opp of dedupedEnriched) {
            if (!initialNames.has(opp.name.toLowerCase())) {
              newNames.add(opp.name)
            }
          }

          setOpportunities(dedupedEnriched)
          setEnrichedNames(newNames)
          setEnriching(false)

          trackEvent('grant_finder_enriched', {
            new_count: String(newNames.size),
            total_count: String(result.opportunities.length),
            poll_attempts: String(attempts),
          })

          return
        }
      } catch {
        // Silently retry on next poll
      }

      enrichPollRef.current = setTimeout(poll, 5000)
    }

    enrichPollRef.current = setTimeout(poll, 5000)
  }, [doSearch, matchSlugs])

  const runSearch = useCallback(async (
    searchOrgType: string,
    searchFocusArea: string,
    searchState: string,
    source: 'manual' | 'url' = 'manual',
    searchAmountRange?: AmountRangeKey,
  ) => {
    const normalizedFocus = searchFocusArea.trim()
    if (!normalizedFocus) return

    setError('')
    setBroadened(false)
    setGateRequired(false)

    // Cancel any in-flight enrichment poll from previous search
    if (enrichPollRef.current) {
      clearTimeout(enrichPollRef.current)
      enrichPollRef.current = null
    }
    setEnriching(false)
    setEnrichedNames(new Set())

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
      let result = await doSearch(searchOrgType, normalizedFocus, searchState, false, searchAmountRange)
      let broadenedSearch = false
      let finalSearchOrgType = searchOrgType
      let finalSearchState = searchState

      if (result.opportunities.length === 0 && (searchOrgType || searchState)) {
        if (searchState) {
          result = await doSearch(searchOrgType, normalizedFocus, '', false, searchAmountRange)
          finalSearchState = ''
        }
        if (result.opportunities.length === 0 && searchOrgType) {
          result = await doSearch('', normalizedFocus, '', false, searchAmountRange)
          finalSearchOrgType = ''
        }
        if (result.opportunities.length > 0) {
          broadenedSearch = true
          setBroadened(true)
        }
      }

      const deduped = deduplicateOpportunities(result.opportunities)
      await matchSlugs(deduped)
      setOpportunities(deduped)
      incrementSearchCount()
      setPhase('results')
      trackEvent('grant_finder_results', {
        count: String(deduped.length),
        broadened: String(broadenedSearch),
        db_only: String(result.dbOnly),
        source,
        focus_area: summarizeTerm(normalizedFocus),
        top_grant: deduped[0]?.name ?? '',
      })

      // If response was db_only, poll for LLM-enriched results in background
      if (result.dbOnly && deduped.length > 0) {
        const initialNames = new Set(deduped.map((r: Opportunity) => r.name.toLowerCase()))
        setEnriching(true)
        startEnrichmentPoll(finalSearchOrgType, normalizedFocus, finalSearchState, initialNames, searchAmountRange)
      }
    } catch (err) {
      trackEvent('grant_finder_search_error', {
        source,
        message: err instanceof Error ? err.message : 'unknown_error',
      })
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPhase('form')
    }
  }, [doSearch, matchSlugs, startEnrichmentPoll])

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await runSearch(orgType, focusArea, state, 'manual', amountRange)
  }, [orgType, focusArea, state, amountRange, runSearch])

  const handleBackToBrowsing = useCallback(() => {
    if (enrichPollRef.current) {
      clearTimeout(enrichPollRef.current)
      enrichPollRef.current = null
    }
    setEnriching(false)
    setEnrichedNames(new Set())
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
    void runSearch(orgType, q, state, 'url', amountRange)
  }, [searchParams, focusArea, orgType, state, amountRange, runSearch])

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
    amountRange,
    opportunities,
    error,
    unlocked,
    email,
    emailStatus,
    gateRequired,
    broadened,
    searchSaved,
    enriching,
    enrichedNames,
    // Setters
    setOrgType,
    setFocusArea,
    setState,
    setAmountRange,
    setEmail,
    // Actions
    handleSearch,
    handleBackToBrowsing,
    handleEmailSubmit,
    handleSaveSearch,
  }
}
