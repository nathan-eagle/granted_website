'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { supabase } from '@/lib/supabase'
import {
  ORG_TYPES,
  AMOUNT_RANGES,
  type AmountRangeKey,
  type Opportunity,
  type Phase,
  deduplicateOpportunities,
  summarizeTerm,
  buildApplyUrl,
  isPastDeadline,
  deadlineUrgency,
  relativeTime,
} from './useGrantSearch'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.grantedai.com'

type ProviderName =
  | 'gemini'
  | 'perplexity_sonar_pro'
  | 'openai_gpt5'
  | 'claude_sonnet'
  | 'perplexity_reasoning'
  | 'grok'

type ProviderStatus = {
  provider: ProviderName
  status: 'pending' | 'success' | 'error'
  resultCount?: number
}

type StreamEnvelope =
  | { type: 'db_results'; opportunities: Opportunity[]; count: number }
  | { type: 'model_batch'; provider: ProviderName; opportunities: Opportunity[]; newCount: number; totalCount: number }
  | { type: 'model_error'; provider: ProviderName; error: string }
  | { type: 'reranked'; opportunities: Opportunity[]; totalCount: number }
  | { type: 'complete'; summary: { totalCount: number; providerResults: ProviderStatus[]; totalDurationMs: number } }
  | { type: 'heartbeat' }

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

export function useGrantSearchStream(onPhaseChange?: (phase: Phase) => void) {
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
  const [providers, setProviders] = useState<Map<ProviderName, ProviderStatus>>(new Map())

  const searchParams = useSearchParams()
  const autoSearchedQueryRef = useRef<string | null>(null)
  const profileFetched = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
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

  const doStreamSearch = useCallback(async (
    searchOrgType: string,
    searchFocusArea: string,
    searchState: string,
    searchAmountRange?: AmountRangeKey,
  ): Promise<{ opportunities: Opportunity[]; streamed: boolean }> => {
    // Abort any previous stream
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const amountDef = AMOUNT_RANGES.find(r => r.key === (searchAmountRange ?? ''))

    const res = await fetch(`${API_URL}/api/public/discover-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_type: searchOrgType || undefined,
        focus_area: searchFocusArea,
        state: searchState || undefined,
        ...(amountDef?.min ? { amount_min: amountDef.min } : {}),
        ...(amountDef?.max ? { amount_max: amountDef.max } : {}),
      }),
      signal: controller.signal,
    })

    if (res.status === 429) {
      setError('You have reached the daily search limit. Enter your email below for unlimited access, or try again tomorrow.')
      setPhase('form')
      setGateRequired(true)
      return { opportunities: [], streamed: false }
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Search failed')
    }

    // Check if response is JSON (cache hit) or NDJSON (stream)
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await res.json()
      return {
        opportunities: data.opportunities || [],
        streamed: false,
      }
    }

    // NDJSON streaming response
    const reader = res.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''
    const dbNames = new Set<string>()
    let allOpps: Opportunity[] = []
    const localEnrichedNames = new Set<string>()

    setEnriching(true)

    const processLine = (line: string) => {
      if (!line.trim()) return

      let envelope: StreamEnvelope
      try {
        envelope = JSON.parse(line) as StreamEnvelope
      } catch {
        return
      }

      switch (envelope.type) {
        case 'db_results': {
          allOpps = [...envelope.opportunities]
          for (const opp of envelope.opportunities) {
            dbNames.add(opp.name.toLowerCase())
          }
          const deduped = deduplicateOpportunities(allOpps)
          deduped.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))
          setOpportunities(deduped)
          setPhase('results')
          break
        }

        case 'model_batch': {
          // Track new names for "AI Found" badges (local set avoids stale closure)
          for (const opp of envelope.opportunities) {
            if (!dbNames.has(opp.name.toLowerCase())) {
              localEnrichedNames.add(opp.name)
            }
            allOpps.push(opp)
          }
          setEnrichedNames(new Set(localEnrichedNames))

          const deduped = deduplicateOpportunities(allOpps)
          deduped.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))
          setOpportunities(deduped)

          // Update provider status
          setProviders(prev => {
            const next = new Map(prev)
            next.set(envelope.provider, {
              provider: envelope.provider,
              status: 'success',
              resultCount: envelope.newCount,
            })
            return next
          })
          break
        }

        case 'model_error': {
          setProviders(prev => {
            const next = new Map(prev)
            next.set(envelope.provider, {
              provider: envelope.provider,
              status: 'error',
            })
            return next
          })
          break
        }

        case 'reranked': {
          allOpps = [...envelope.opportunities]
          const deduped = deduplicateOpportunities(allOpps)
          deduped.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))
          setOpportunities(deduped)
          break
        }

        case 'complete': {
          setEnriching(false)
          trackEvent('grant_finder_stream_complete', {
            total_count: String(envelope.summary.totalCount),
            duration_ms: String(envelope.summary.totalDurationMs),
            providers_success: String(
              envelope.summary.providerResults.filter(p => p.status === 'success').length
            ),
            providers_error: String(
              envelope.summary.providerResults.filter(p => p.status === 'error').length
            ),
          })
          break
        }

        case 'heartbeat':
          // Ignore — keeps connection alive
          break
      }
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        // Keep last (potentially incomplete) line in buffer
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          processLine(line)
        }
      }
      // Process any remaining data
      if (buffer.trim()) {
        processLine(buffer)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Search was cancelled, expected
      } else {
        throw err
      }
    } finally {
      setEnriching(false)
      reader.releaseLock()
    }

    return { opportunities: allOpps, streamed: true }
  }, [])

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
    setEnriching(false)
    setEnrichedNames(new Set())
    setProviders(new Map())

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
      mode: 'stream',
    })
    setPhase('loading')

    try {
      let result = await doStreamSearch(searchOrgType, normalizedFocus, searchState, searchAmountRange)
      let broadenedSearch = false

      // Broaden if no results
      if (result.opportunities.length === 0 && (searchOrgType || searchState)) {
        if (searchState) {
          result = await doStreamSearch(searchOrgType, normalizedFocus, '', searchAmountRange)
        }
        if (result.opportunities.length === 0 && searchOrgType) {
          result = await doStreamSearch('', normalizedFocus, '', searchAmountRange)
        }
        if (result.opportunities.length > 0) {
          broadenedSearch = true
          setBroadened(true)
        }
      }

      // For non-streamed (cached) responses, update state normally
      if (!result.streamed) {
        const deduped = deduplicateOpportunities(result.opportunities)
        await matchSlugs(deduped)
        deduped.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))
        setOpportunities(deduped)
        setPhase('results')
      } else {
        // For streamed responses, matchSlugs on final results
        await matchSlugs(result.opportunities)
      }

      incrementSearchCount()
      if (phase !== 'results') setPhase('results')

      trackEvent('grant_finder_results', {
        count: String(result.opportunities.length),
        broadened: String(broadenedSearch),
        streamed: String(result.streamed),
        source,
        focus_area: summarizeTerm(normalizedFocus),
        top_grant: result.opportunities[0]?.name ?? '',
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      trackEvent('grant_finder_search_error', {
        source,
        message: err instanceof Error ? err.message : 'unknown_error',
      })
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPhase('form')
    }
  }, [doStreamSearch, matchSlugs, phase])

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await runSearch(orgType, focusArea, state, 'manual', amountRange)
  }, [orgType, focusArea, state, amountRange, runSearch])

  const handleBackToBrowsing = useCallback(() => {
    abortRef.current?.abort()
    setEnriching(false)
    setEnrichedNames(new Set())
    setProviders(new Map())
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
    providers,
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

// Re-export types and utilities from useGrantSearch for backward compat
export {
  ORG_TYPES,
  AMOUNT_RANGES,
  US_STATES,
  SOURCE_LABELS,
  OFFICIAL_SOURCES,
  buildApplyUrl,
  isPastDeadline,
  deadlineUrgency,
  relativeTime,
  deduplicateOpportunities,
  summarizeTerm,
} from './useGrantSearch'
export type { Opportunity, Phase, AmountRangeKey } from './useGrantSearch'
