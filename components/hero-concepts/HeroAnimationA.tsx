'use client'

/**
 * CONCEPT A: "The Switchboard"
 *
 * Shows 3 different user profiles cycling through the full journey:
 * Profile appears → search query types itself → results cascade in →
 * best match highlights → RFP sections extract → draft writes itself
 *
 * The animation runs on a loop, switching personas every ~8 seconds.
 * Each persona has a distinct color accent to differentiate.
 */

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Persona data ── */
const PERSONAS = [
  {
    name: 'Dr. Amara Osei',
    org: 'Pacific Marine Research Institute',
    orgType: 'University Lab',
    avatar: 'AO',
    accent: '#60A5FA',    // blue
    accentBg: 'rgba(96, 165, 250, 0.12)',
    query: 'coral reef restoration monitoring',
    results: [
      { title: 'Ocean Conservation & Restoration Fund', agency: 'Oceanic Research Council', match: 94, deadline: 'Mar 15, 2026', amount: '$350K' },
      { title: 'Marine Ecosystem Resilience Program', agency: 'Coastal Sciences Board', match: 87, deadline: 'Apr 22, 2026', amount: '$500K' },
      { title: 'Coastal Community Adaptation Grants', agency: 'Environmental Protection Fund', match: 72, deadline: 'May 1, 2026', amount: '$200K' },
    ],
    rfpSections: ['Research methodology', 'Measurable outcomes', 'Community impact'],
    draftSnippet: 'Our team will deploy 24 acoustic monitoring stations across three reef zones, using AI-driven species identification to track recovery rates in real-time...',
  },
  {
    name: 'Marcus Williams',
    org: 'Bridges Youth Alliance',
    orgType: 'Community Nonprofit',
    avatar: 'MW',
    accent: '#F59E0B',    // amber
    accentBg: 'rgba(245, 158, 11, 0.12)',
    query: 'youth workforce development rural',
    results: [
      { title: 'Rural Youth Opportunity Initiative', agency: 'Community Development Corp', match: 91, deadline: 'Apr 1, 2026', amount: '$175K' },
      { title: 'Workforce Innovation for Young Adults', agency: 'Labor & Training Board', match: 85, deadline: 'Jun 10, 2026', amount: '$400K' },
      { title: 'Digital Skills Bridge Program', agency: 'Technology Access Foundation', match: 78, deadline: 'May 30, 2026', amount: '$125K' },
    ],
    rfpSections: ['Program design', 'Target population', 'Sustainability plan'],
    draftSnippet: 'The program will serve 200 young adults ages 16-24 in three rural counties, providing 12-week cohorts combining technical certification with paid apprenticeships...',
  },
  {
    name: 'Dr. Priya Chakraborty',
    org: 'Great Plains Health Equity Center',
    orgType: 'Research Center',
    avatar: 'PC',
    accent: '#34D399',    // emerald
    accentBg: 'rgba(52, 211, 153, 0.12)',
    query: 'maternal health disparities tribal communities',
    results: [
      { title: 'Indigenous Health Equity Research Grants', agency: 'National Health Institute', match: 96, deadline: 'Mar 30, 2026', amount: '$450K' },
      { title: 'Maternal & Child Health Innovation Fund', agency: 'Health Resources Council', match: 88, deadline: 'May 15, 2026', amount: '$300K' },
      { title: 'Rural Health Disparities Program', agency: 'Community Health Board', match: 81, deadline: 'Jul 1, 2026', amount: '$250K' },
    ],
    rfpSections: ['Literature review', 'Research design', 'Tribal consultation plan'],
    draftSnippet: 'This mixed-methods study will partner with four tribal nations to co-design culturally grounded prenatal care pathways, integrating traditional birth practices with evidence-based interventions...',
  },
]

/* ── Animation phases ── */
// Phase 0: Profile card appears (0-1s)
// Phase 1: Query types out (1-3s)
// Phase 2: Results cascade (3-5s)
// Phase 3: Top result highlights, RFP extracts (5-6.5s)
// Phase 4: Draft writes (6.5-8s)
// Phase 5: Hold + fade (8-9s)
const PHASE_DURATION = 9000
const PHASE_TIMINGS = [0, 1000, 3000, 5000, 6500, 8000]

export default function HeroAnimationA() {
  const [personaIdx, setPersonaIdx] = useState(0)
  const [phase, setPhase] = useState(0)
  const [typedQuery, setTypedQuery] = useState('')
  const [visibleResults, setVisibleResults] = useState(0)
  const [draftProgress, setDraftProgress] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const persona = PERSONAS[personaIdx]

  // Clear timers helper
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  // Main animation loop
  useEffect(() => {
    clearTimers()
    setPhase(0)
    setTypedQuery('')
    setVisibleResults(0)
    setDraftProgress(0)

    const q = persona.query

    // Phase 1: Start typing
    timersRef.current.push(setTimeout(() => {
      setPhase(1)
      // Type characters
      for (let i = 0; i <= q.length; i++) {
        timersRef.current.push(setTimeout(() => {
          setTypedQuery(q.slice(0, i))
        }, i * 50))
      }
    }, PHASE_TIMINGS[1]))

    // Phase 2: Results cascade
    timersRef.current.push(setTimeout(() => {
      setPhase(2)
      for (let i = 1; i <= 3; i++) {
        timersRef.current.push(setTimeout(() => setVisibleResults(i), i * 300))
      }
    }, PHASE_TIMINGS[2]))

    // Phase 3: Highlight + RFP
    timersRef.current.push(setTimeout(() => setPhase(3), PHASE_TIMINGS[3]))

    // Phase 4: Draft writes
    timersRef.current.push(setTimeout(() => {
      setPhase(4)
      const words = persona.draftSnippet.split(' ')
      for (let i = 0; i <= words.length; i++) {
        timersRef.current.push(setTimeout(() => setDraftProgress(i), i * 60))
      }
    }, PHASE_TIMINGS[4]))

    // Phase 5: Hold then advance
    timersRef.current.push(setTimeout(() => {
      setPhase(5)
    }, PHASE_TIMINGS[5]))

    // Next persona
    timersRef.current.push(setTimeout(() => {
      setPersonaIdx(prev => (prev + 1) % PERSONAS.length)
    }, PHASE_DURATION))

    return clearTimers
  }, [personaIdx])

  const draftWords = persona.draftSnippet.split(' ')
  const visibleDraft = draftWords.slice(0, draftProgress).join(' ')

  return (
    <div className="relative w-full max-w-[520px] mx-auto select-none" style={{ fontFamily: 'var(--font-body), DM Sans, system-ui, sans-serif' }}>
      {/* Glow backdrop */}
      <div
        className="absolute -inset-8 rounded-3xl blur-3xl opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: persona.accent }}
      />

      <div className="relative rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-md overflow-hidden shadow-2xl">
        {/* ── Top bar: Profile chip ── */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <AnimatePresence mode="wait">
            <motion.div
              key={personaIdx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ backgroundColor: persona.accentBg, color: persona.accent, border: `1px solid ${persona.accent}40` }}
              >
                {persona.avatar}
              </div>
              <div>
                <div className="text-[10px] font-semibold text-white/70 leading-none">{persona.name}</div>
                <div className="text-[8px] text-white/35 mt-0.5">{persona.org} &middot; {persona.orgType}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Persona dots */}
          <div className="ml-auto flex gap-1.5">
            {PERSONAS.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i === personaIdx ? persona.accent : 'rgba(255,255,255,0.15)',
                  transform: i === personaIdx ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="px-5 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
            <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <div className="text-[11px] text-white/60 font-mono min-h-[1em] flex items-center">
              {typedQuery}
              {phase >= 1 && phase < 3 && <span className="typewriter-cursor" />}
            </div>
          </div>
        </div>

        {/* ── Results / RFP / Draft area ── */}
        <div className="min-h-[260px] relative">
          {/* Phase 2-3: Search results */}
          {phase >= 2 && phase < 4 && (
            <div className="p-4 space-y-2">
              <div className="text-[8px] font-mono text-white/25 uppercase tracking-wider mb-2">
                {visibleResults} matching opportunities
              </div>
              {persona.results.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: i < visibleResults ? 1 : 0,
                    y: i < visibleResults ? 0 : 8,
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="px-3 py-2.5 rounded-lg border transition-all duration-500"
                  style={{
                    backgroundColor: phase >= 3 && i === 0 ? persona.accentBg : 'rgba(255,255,255,0.03)',
                    borderColor: phase >= 3 && i === 0 ? `${persona.accent}40` : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-white/75 leading-snug">{result.title}</div>
                      <div className="text-[8px] text-white/35 mt-0.5">{result.agency}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className="text-[11px] font-bold tabular-nums"
                        style={{ color: result.match >= 90 ? persona.accent : 'rgba(255,255,255,0.5)' }}
                      >
                        {result.match}%
                      </div>
                      <div className="text-[7px] text-white/30">{result.amount}</div>
                    </div>
                  </div>
                  {/* Match bar */}
                  <div className="mt-1.5 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: persona.accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.match}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                  {phase >= 3 && i === 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.4 }}
                      className="mt-2 pt-2 border-t border-white/[0.05]"
                    >
                      <div className="text-[7px] font-mono text-white/25 uppercase tracking-wider mb-1">RFP Requirements Detected</div>
                      <div className="flex flex-wrap gap-1">
                        {persona.rfpSections.map((sec, j) => (
                          <motion.span
                            key={j}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: j * 0.15 }}
                            className="px-1.5 py-0.5 rounded text-[7px] font-medium"
                            style={{ backgroundColor: persona.accentBg, color: persona.accent, border: `1px solid ${persona.accent}30` }}
                          >
                            {sec}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Phase 4-5: Draft writing */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[8px] font-mono text-white/25 uppercase tracking-wider">
                  Drafting Proposal
                </div>
                <div className="flex-1 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: persona.accent }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min((draftProgress / draftWords.length) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* RFP section badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {persona.rfpSections.map((sec, j) => (
                  <span
                    key={j}
                    className="px-1.5 py-0.5 rounded text-[7px] font-medium"
                    style={{ backgroundColor: persona.accentBg, color: persona.accent, border: `1px solid ${persona.accent}30` }}
                  >
                    {sec}
                  </span>
                ))}
              </div>

              {/* Writing area */}
              <div className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] min-h-[140px]">
                <div className="text-[9px] font-semibold text-white/60 mb-1.5 uppercase tracking-wider"
                  style={{ color: persona.accent }}
                >
                  Project Narrative
                </div>
                <p className="text-[9px] leading-relaxed text-white/50 font-mono">
                  {visibleDraft}
                  {draftProgress < draftWords.length && <span className="typewriter-cursor" />}
                </p>
              </div>

              {/* Grounding badge */}
              {draftProgress >= draftWords.length && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-1.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[8px] font-mono text-emerald-400/60">
                    All sections grounded to RFP requirements
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Phase 0-1: Placeholder shimmer */}
          {phase < 2 && (
            <div className="p-4 space-y-3">
              {[80, 65, 50].map((w, i) => (
                <div key={i} className="space-y-1.5" style={{ opacity: 0.3 - i * 0.08 }}>
                  <div className="h-[6px] rounded bg-white/[0.05]" style={{ width: `${w}%` }} />
                  <div className="h-[4px] rounded bg-white/[0.03]" style={{ width: `${w - 15}%` }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom status bar ── */}
        <div className="px-5 py-2 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {['Discover', 'Analyze', 'Draft'].map((label, i) => {
              const active = (i === 0 && phase >= 1 && phase < 4) || (i === 1 && phase >= 3 && phase < 4) || (i === 2 && phase >= 4)
              const done = (i === 0 && phase >= 3) || (i === 1 && phase >= 4) || (i === 2 && phase >= 5)
              return (
                <div key={label} className="flex items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: done ? '#34D399' : active ? persona.accent : 'rgba(255,255,255,0.15)',
                      boxShadow: active ? `0 0 6px ${persona.accent}60` : 'none',
                    }}
                  />
                  <span
                    className="text-[8px] font-mono uppercase tracking-wider transition-colors duration-300"
                    style={{ color: active || done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="text-[8px] font-mono text-white/20">
            Personalized to profile
          </div>
        </div>
      </div>

      {/* prefers-reduced-motion fallback */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .typewriter-cursor { animation: none !important; opacity: 1; }
        }
      `}</style>
    </div>
  )
}
