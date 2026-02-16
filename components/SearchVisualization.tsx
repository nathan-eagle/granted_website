'use client'

import { useEffect, useRef, useState } from 'react'
import type { Opportunity } from '@/hooks/useGrantSearch'
import type { VizMode, VizGrant, VizConfig, SearchVisualization as ISearchVisualization, StreamEnvelope } from '@/lib/viz/types'
import { createAdapter, toVizGrant } from '@/lib/viz/adapter'

interface Props {
  mode: VizMode
  focusArea: string
  orgType: string
  state: string
  /** Whether visualization is actively receiving streaming data */
  enriching: boolean
  /** Full opportunities list — used for static rendering when not enriching */
  opportunities: Opportunity[]
  /** Callback when user clicks a grant in the visualization */
  onGrantSelect?: (grant: VizGrant) => void
  /** Called with processEnvelope function when engine is ready — wire this to onEnvelope */
  onReady?: (processEnvelope: (envelope: StreamEnvelope) => void) => void
  /** Called when engine is destroyed (parent should stop sending envelopes) */
  onTeardown?: () => void
  className?: string
}

export default function SearchVisualization({
  mode,
  focusArea,
  orgType,
  state,
  enriching,
  opportunities,
  onGrantSelect,
  onReady,
  onTeardown,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<ISearchVisualization | null>(null)
  const adapterRef = useRef<ReturnType<typeof createAdapter> | null>(null)
  const [loading, setLoading] = useState(true)
  const modeRef = useRef(mode)
  modeRef.current = mode
  const enrichingRef = useRef(enriching)
  enrichingRef.current = enriching

  // Keep callbacks in refs to avoid re-initializing engine on callback changes
  const onGrantSelectRef = useRef(onGrantSelect)
  onGrantSelectRef.current = onGrantSelect
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const onTeardownRef = useRef(onTeardown)
  onTeardownRef.current = onTeardown

  // Initialize engine on mount / mode change
  useEffect(() => {
    if (!containerRef.current) return

    let destroyed = false
    setLoading(true)

    const initEngine = async () => {
      // Clean up previous engine
      engineRef.current?.destroy()
      engineRef.current = null
      adapterRef.current = null

      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }

      const config: VizConfig = {
        focusArea,
        orgType,
        state,
      }

      try {
        if (modeRef.current === 'discovery-map') {
          const [{ default: DiscoveryMapEngine }, d3] = await Promise.all([
            import('@/lib/viz/engine-d'),
            import('d3'),
          ])
          if (destroyed) return
          const engine = new DiscoveryMapEngine() as ISearchVisualization
          engine.init(containerRef.current!, config, d3)
          engine.onGrantSelect((g: VizGrant) => onGrantSelectRef.current?.(g))
          engineRef.current = engine
        } else {
          const { default: RisingStakesEngine } = await import('@/lib/viz/engine-e')
          if (destroyed) return
          const engine = new RisingStakesEngine() as ISearchVisualization
          engine.init(containerRef.current!, config)
          engine.onGrantSelect((g: VizGrant) => onGrantSelectRef.current?.(g))
          engineRef.current = engine
        }

        // If currently enriching, load existing grants then wire up streaming
        // IMPORTANT: Only wire up adapter for NEW envelopes — don't replay buffer
        // because loadAll already rendered the existing opportunities
        if (enrichingRef.current && engineRef.current) {
          const adapter = createAdapter(engineRef.current)
          adapterRef.current = adapter
          if (opportunities.length > 0) {
            const vizGrants = opportunities.map(toVizGrant)
            engineRef.current.loadAll(vizGrants)
            // Tell adapter about these grants so it skips them in future addBatch calls
            adapter.markSeen(vizGrants)
          }
          onReadyRef.current?.((envelope: StreamEnvelope) => {
            adapter.processEnvelope(envelope)
          })
        }
        // If NOT enriching (switching back to viz after search is done), load all grants statically
        else if (!enrichingRef.current && engineRef.current && opportunities.length > 0) {
          const vizGrants = opportunities.map(toVizGrant)
          engineRef.current.loadAll(vizGrants)
        }

        setLoading(false)
      } catch (err) {
        console.error('[SearchVisualization] Failed to load engine:', err)
        setLoading(false)
      }
    }

    initEngine()

    return () => {
      destroyed = true
      engineRef.current?.destroy()
      engineRef.current = null
      adapterRef.current = null
      onTeardownRef.current?.()
    }
  }, [mode, focusArea, orgType, state]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`relative ${className}${loading ? ' min-h-[60vh]' : ''}`}>
      {/* Loading overlay — absolute so it doesn't stack above engine container */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
            <p className="text-sm text-navy-light/50">
              Loading {mode === 'discovery-map' ? 'Discovery Map' : 'Rising Stakes'}...
            </p>
          </div>
        </div>
      )}

      {/* Engine container */}
      <div
        ref={containerRef}
        className="search-viz-container w-full"
      />
    </div>
  )
}
