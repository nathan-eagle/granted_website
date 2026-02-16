'use client'

import { useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'
import type { VizMode } from '@/lib/viz/types'

const STORAGE_KEY = 'granted_viz_mode'

interface Props {
  mode: VizMode
  onChange: (mode: VizMode) => void
  className?: string
}

/** Read persisted viz mode from localStorage, with URL param override */
export function getPersistedVizMode(): VizMode {
  if (typeof window === 'undefined') return 'list'

  // URL param override: ?viz=d or ?viz=e or ?viz=list
  const params = new URLSearchParams(window.location.search)
  const vizParam = params.get('viz')
  if (vizParam === 'd') return 'discovery-map'
  if (vizParam === 'e') return 'rising-stakes'
  if (vizParam === 'list') return 'list'

  // localStorage persistence
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'discovery-map' || stored === 'rising-stakes' || stored === 'list') return stored
  } catch {}

  // Default: list view for all devices
  return 'list'
}

/** Persist viz mode to localStorage */
export function persistVizMode(mode: VizMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {}
}

export default function VizToggle({ mode, onChange, className = '' }: Props) {
  const handleToggle = useCallback((newMode: VizMode) => {
    if (newMode === mode) return
    onChange(newMode)
    persistVizMode(newMode)
    trackEvent('viz_mode_change', { mode: newMode })
  }, [mode, onChange])

  return (
    <div className={`inline-flex items-center gap-1 rounded-lg border border-navy/10 bg-white p-0.5 ${className}`}>
      <button
        type="button"
        onClick={() => handleToggle('discovery-map')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
          mode === 'discovery-map'
            ? 'bg-brand-yellow/15 text-navy border border-brand-yellow/30'
            : 'text-navy-light/60 hover:text-navy hover:bg-navy/[0.03] border border-transparent'
        }`}
        title="Discovery Map (force graph)"
      >
        {/* Graph icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3" />
          <circle cx="5" cy="19" r="3" />
          <circle cx="19" cy="19" r="3" />
          <line x1="12" y1="8" x2="5" y2="16" />
          <line x1="12" y1="8" x2="19" y2="16" />
        </svg>
        <span className="hidden sm:inline">Map</span>
      </button>
      <button
        type="button"
        onClick={() => handleToggle('rising-stakes')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
          mode === 'rising-stakes'
            ? 'bg-brand-yellow/15 text-navy border border-brand-yellow/30'
            : 'text-navy-light/60 hover:text-navy hover:bg-navy/[0.03] border border-transparent'
        }`}
        title="Rising Stakes (bento grid)"
      >
        {/* Grid icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        type="button"
        onClick={() => handleToggle('list')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
          mode === 'list'
            ? 'bg-brand-yellow/15 text-navy border border-brand-yellow/30'
            : 'text-navy-light/60 hover:text-navy hover:bg-navy/[0.03] border border-transparent'
        }`}
        title="List view"
      >
        {/* List icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  )
}
