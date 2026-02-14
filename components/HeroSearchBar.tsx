'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { US_STATES, ORG_TYPES } from '@/hooks/useGrantSearch'

/* ── State data grouped by region ── */
const STATES_BY_REGION: Record<string, { name: string; abbr: string }[]> = {
  Northeast: [
    { name: 'Connecticut', abbr: 'CT' }, { name: 'Delaware', abbr: 'DE' },
    { name: 'Maine', abbr: 'ME' }, { name: 'Maryland', abbr: 'MD' },
    { name: 'Massachusetts', abbr: 'MA' }, { name: 'New Hampshire', abbr: 'NH' },
    { name: 'New Jersey', abbr: 'NJ' }, { name: 'New York', abbr: 'NY' },
    { name: 'Pennsylvania', abbr: 'PA' }, { name: 'Rhode Island', abbr: 'RI' },
    { name: 'Vermont', abbr: 'VT' },
  ],
  Southeast: [
    { name: 'Alabama', abbr: 'AL' }, { name: 'Arkansas', abbr: 'AR' },
    { name: 'Florida', abbr: 'FL' }, { name: 'Georgia', abbr: 'GA' },
    { name: 'Kentucky', abbr: 'KY' }, { name: 'Louisiana', abbr: 'LA' },
    { name: 'Mississippi', abbr: 'MS' }, { name: 'North Carolina', abbr: 'NC' },
    { name: 'South Carolina', abbr: 'SC' }, { name: 'Tennessee', abbr: 'TN' },
    { name: 'Virginia', abbr: 'VA' }, { name: 'West Virginia', abbr: 'WV' },
  ],
  Midwest: [
    { name: 'Illinois', abbr: 'IL' }, { name: 'Indiana', abbr: 'IN' },
    { name: 'Iowa', abbr: 'IA' }, { name: 'Kansas', abbr: 'KS' },
    { name: 'Michigan', abbr: 'MI' }, { name: 'Minnesota', abbr: 'MN' },
    { name: 'Missouri', abbr: 'MO' }, { name: 'Nebraska', abbr: 'NE' },
    { name: 'North Dakota', abbr: 'ND' }, { name: 'Ohio', abbr: 'OH' },
    { name: 'South Dakota', abbr: 'SD' }, { name: 'Wisconsin', abbr: 'WI' },
  ],
  Southwest: [
    { name: 'Arizona', abbr: 'AZ' }, { name: 'New Mexico', abbr: 'NM' },
    { name: 'Oklahoma', abbr: 'OK' }, { name: 'Texas', abbr: 'TX' },
  ],
  West: [
    { name: 'Alaska', abbr: 'AK' }, { name: 'California', abbr: 'CA' },
    { name: 'Colorado', abbr: 'CO' }, { name: 'Hawaii', abbr: 'HI' },
    { name: 'Idaho', abbr: 'ID' }, { name: 'Montana', abbr: 'MT' },
    { name: 'Nevada', abbr: 'NV' }, { name: 'Oregon', abbr: 'OR' },
    { name: 'Utah', abbr: 'UT' }, { name: 'Washington', abbr: 'WA' },
    { name: 'Wyoming', abbr: 'WY' },
  ],
  Territories: [
    { name: 'District of Columbia', abbr: 'DC' }, { name: 'Puerto Rico', abbr: 'PR' },
    { name: 'Guam', abbr: 'GU' }, { name: 'US Virgin Islands', abbr: 'VI' },
    { name: 'American Samoa', abbr: 'AS' }, { name: 'Northern Mariana Islands', abbr: 'MP' },
  ],
}

/* ── Smart detection: state names in free-text query ── */
const STATE_PATTERN = new RegExp(
  `\\b(?:in|from|for)\\s+(${US_STATES.join('|')})\\b`,
  'i'
)

/* ── Pin icon ── */
function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

/* ── Org icon ── */
function OrgIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

/* ── Caret icon ── */
function Caret({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12">
      <path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Dropdown component for state/org selection ── */
function FilterDropdown({
  open,
  onClose,
  type,
  onSelect,
  selectedValue,
  stateFilter,
  setStateFilter,
}: {
  open: boolean
  onClose: () => void
  type: 'state' | 'org'
  onSelect: (value: string) => void
  selectedValue: string
  stateFilter: string
  setStateFilter: (v: string) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open, onClose])

  if (!open) return null

  if (type === 'org') {
    return (
      <div
        ref={panelRef}
        className="absolute top-full mt-2 left-0 w-[240px] z-50 rounded-2xl border border-white/10 bg-[#0e1d33] shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] animate-[dropIn_0.18s_ease-out]"
      >
        <div className="max-h-[260px] overflow-y-auto p-1.5 scrollbar-thin">
          <button
            type="button"
            onClick={() => onSelect('')}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] text-white/40 italic hover:bg-white/[0.06] hover:text-white/60 transition-colors text-left"
          >
            <span className="w-5 text-center text-[11px] font-semibold text-white/20">&mdash;</span>
            Any Type
          </button>
          {ORG_TYPES.map(org => (
            <button
              type="button"
              key={org}
              onClick={() => onSelect(org)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] transition-colors text-left ${
                selectedValue === org
                  ? 'bg-brand-yellow/10 text-brand-yellow'
                  : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <span className={`w-5 text-center text-[9px] ${selectedValue === org ? 'text-brand-yellow/50' : 'text-white/20'}`}>&bull;</span>
              {org}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // State dropdown with search + region grouping
  const q = stateFilter.toLowerCase()
  return (
    <div
      ref={panelRef}
      className="absolute top-full mt-2 left-0 w-[280px] z-50 rounded-2xl border border-white/10 bg-[#0e1d33] shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden animate-[dropIn_0.18s_ease-out]"
    >
      <input
        type="text"
        value={stateFilter}
        onChange={e => setStateFilter(e.target.value)}
        placeholder="Search states..."
        className="w-full px-4 py-3 bg-white/[0.04] border-b border-white/[0.06] text-[13px] text-white placeholder:text-white/30 outline-none font-[inherit]"
        autoFocus
      />
      <div className="max-h-[260px] overflow-y-auto p-1.5 scrollbar-thin">
        {!q && (
          <button
            type="button"
            onClick={() => onSelect('')}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] text-white/40 italic hover:bg-white/[0.06] hover:text-white/60 transition-colors text-left"
          >
            <span className="w-6 text-center text-[11px] font-semibold text-white/20">&mdash;</span>
            All States
          </button>
        )}
        {Object.entries(STATES_BY_REGION).map(([region, states]) => {
          const filtered = states.filter(
            s => s.name.toLowerCase().includes(q) || s.abbr.toLowerCase().includes(q)
          )
          if (filtered.length === 0) return null
          return (
            <div key={region}>
              {!q && (
                <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold tracking-[0.12em] uppercase text-white/20">
                  {region}
                </div>
              )}
              {filtered.map(s => (
                <button
                  type="button"
                  key={s.abbr}
                  onClick={() => onSelect(s.name)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] transition-colors text-left ${
                    selectedValue === s.name
                      ? 'bg-brand-yellow/10 text-brand-yellow'
                      : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span className={`w-6 text-center text-[11px] font-semibold ${
                    selectedValue === s.name ? 'text-brand-yellow/50' : 'text-white/25'
                  }`}>{s.abbr}</span>
                  {s.name}
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function HeroSearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('')
  const [openDropdown, setOpenDropdown] = useState<'state' | 'org' | null>(null)
  const [stateFilter, setStateFilter] = useState('')
  const [detectedState, setDetectedState] = useState('')
  const router = useRouter()

  // Smart detection: detect state name in the query text
  useEffect(() => {
    // Don't detect if user already explicitly selected a state
    if (selectedState) {
      setDetectedState('')
      return
    }
    const match = query.match(STATE_PATTERN)
    if (match) {
      const found = US_STATES.find(s => s.toLowerCase() === match[1].toLowerCase())
      setDetectedState(found || '')
    } else {
      setDetectedState('')
    }
  }, [query, selectedState])

  // The effective state is either the explicit selection or the detected one
  const effectiveState = selectedState || detectedState

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return

    trackEvent('hero_search_submit', {
      query: normalizedQuery,
      query_length: normalizedQuery.length,
      state: effectiveState || 'any',
      org_type: selectedOrg || 'any',
      state_source: selectedState ? 'explicit' : detectedState ? 'detected' : 'none',
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
    })

    const params = new URLSearchParams()
    params.set('q', normalizedQuery)
    if (effectiveState) params.set('state', effectiveState)
    if (selectedOrg) params.set('org_type', selectedOrg)

    router.push(`/grants?${params.toString()}`)
  }

  function handleStateSelect(value: string) {
    setSelectedState(value)
    setOpenDropdown(null)
    setStateFilter('')
    trackEvent('hero_filter_change', { filter: 'state', value: value || 'any' })
  }

  function handleOrgSelect(value: string) {
    setSelectedOrg(value)
    setOpenDropdown(null)
    trackEvent('hero_filter_change', { filter: 'org_type', value: value || 'any' })
  }

  function clearDetectedState() {
    setDetectedState('')
    // Remove the state phrase from the query
    setQuery(prev => prev.replace(STATE_PATTERN, '').replace(/\s{2,}/g, ' ').trim())
  }

  return (
    <div className={className ?? 'mt-10 max-w-2xl'}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g., community garden in Detroit, AI safety research..."
          className="hero-search-input flex-1 rounded-pill px-5 py-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-all"
        />
        <button
          type="submit"
          className="shrink-0 rounded-pill bg-brand-yellow px-6 py-3.5 text-sm font-semibold text-navy hover:bg-brand-gold transition-colors"
        >
          Find Grants
        </button>
      </form>

      {/* Smart detection tags */}
      {detectedState && !selectedState && (
        <div className="flex flex-wrap gap-1.5 mt-2.5 animate-[tagAppear_0.25s_ease-out]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-yellow/[0.08] text-brand-yellow border border-brand-yellow/15">
            <PinIcon className="w-2.5 h-2.5 opacity-60" />
            {detectedState}
            <button
              type="button"
              onClick={clearDetectedState}
              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-brand-yellow/50 hover:bg-brand-yellow/15 hover:text-brand-yellow transition-colors ml-0.5"
              aria-label="Remove state filter"
            >
              &times;
            </button>
          </span>
        </div>
      )}

      {/* Filter chips row — state & org type selectors */}
      <div className="flex flex-wrap items-center gap-2 mt-3.5">
        {/* State selector chip */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenDropdown(openDropdown === 'state' ? null : 'state')
              setStateFilter('')
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              selectedState
                ? 'bg-brand-yellow/[0.08] text-brand-yellow border-brand-yellow/20 hover:bg-brand-yellow/[0.12]'
                : 'bg-white/[0.08] text-white/55 border-white/10 hover:bg-white/[0.12] hover:text-white/75 hover:border-white/[0.18]'
            }`}
          >
            <PinIcon className="w-3 h-3 opacity-60" />
            <span>{selectedState || 'All States'}</span>
            <Caret className={`w-2.5 h-2.5 opacity-40 transition-transform ${openDropdown === 'state' ? 'rotate-180' : ''}`} />
          </button>
          <FilterDropdown
            open={openDropdown === 'state'}
            onClose={() => { setOpenDropdown(null); setStateFilter('') }}
            type="state"
            onSelect={handleStateSelect}
            selectedValue={selectedState}
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
          />
        </div>

        {/* Org type selector chip */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'org' ? null : 'org')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              selectedOrg
                ? 'bg-white/[0.08] text-white/85 border-white/20 hover:bg-white/[0.12]'
                : 'bg-transparent text-white/35 border-white/[0.06] hover:bg-white/[0.04] hover:text-white/55 hover:border-white/[0.12]'
            }`}
          >
            <OrgIcon className="w-3 h-3 opacity-50" />
            <span>{selectedOrg || 'Org Type'}</span>
            <Caret className={`w-2.5 h-2.5 opacity-40 transition-transform ${openDropdown === 'org' ? 'rotate-180' : ''}`} />
          </button>
          <FilterDropdown
            open={openDropdown === 'org'}
            onClose={() => setOpenDropdown(null)}
            type="org"
            onSelect={handleOrgSelect}
            selectedValue={selectedOrg}
            stateFilter=""
            setStateFilter={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
