'use client'

import { useEffect, useRef, useState } from 'react'
import type { VizMode, VizGrant, VizConfig, SearchVisualization as ISearchVisualization, StreamEnvelope } from '@/lib/viz/types'
import { createAdapter } from '@/lib/viz/adapter'

interface Props {
  mode: VizMode
  focusArea: string
  orgType: string
  state: string
  /** Whether visualization is actively receiving data */
  active: boolean
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
  active,
  onGrantSelect,
  onReady,
  onTeardown,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<ISearchVisualization | null>(null)
  const adapterRef = useRef<ReturnType<typeof createAdapter> | null>(null)
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const modeRef = useRef(mode)
  modeRef.current = mode

  // Keep callbacks in refs to avoid re-initializing engine on callback changes
  const onGrantSelectRef = useRef(onGrantSelect)
  onGrantSelectRef.current = onGrantSelect
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const onTeardownRef = useRef(onTeardown)
  onTeardownRef.current = onTeardown

  // Initialize engine on mount / mode change
  useEffect(() => {
    if (!containerRef.current || !active) return

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
        soundEnabled,
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

        // Create adapter that routes envelopes to engine
        if (engineRef.current) {
          const adapter = createAdapter(engineRef.current)
          adapterRef.current = adapter

          // Notify parent that engine is ready — parent wires this to the stream hook
          onReadyRef.current?.((envelope: StreamEnvelope) => {
            adapter.processEnvelope(envelope)
          })
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
  }, [mode, active, focusArea, orgType, state]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`relative ${className}`}>
      {/* Sound toggle */}
      {active && !loading && (
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full border border-navy/10 bg-white/90 backdrop-blur flex items-center justify-center text-sm text-navy-light/60 hover:text-navy transition-colors"
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? '\u{1F50A}' : '\u{1F507}'}
        </button>
      )}

      {/* Loading state while engine initializes */}
      {loading && active && (
        <div className="flex items-center justify-center h-[60vh]">
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
        style={{
          minHeight: active ? '70vh' : '0',
          display: active ? 'block' : 'none',
        }}
      />
    </div>
  )
}
