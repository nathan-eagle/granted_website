'use client'

/**
 * CONCEPT C: "The Dashboard"
 *
 * A split-pane interface that feels like a real product screenshot.
 * Left side: a compact "profile sidebar" showing the current user's org details.
 * Center: the main discovery → analysis → draft flow as overlapping panels
 * that slide in from right to left as each phase completes.
 *
 * This variant focuses on the PRODUCT feel — making it look like
 * a polished, real application that you want to use. Less abstract,
 * more "here's exactly what you'll see."
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PROFILES = [
  {
    name: 'Horizon Health Collective',
    type: 'Community Health Nonprofit',
    location: 'Detroit, MI',
    focus: ['Health equity', 'Community health workers', 'Urban wellness'],
    color: '#F59E0B',
    colorBg: 'rgba(245, 158, 11, 0.12)',
    query: 'community health worker training programs',
    results: [
      { title: 'Community Health Workforce Development Fund', agency: 'Health Resources Council', score: 95, amount: '$380K', deadline: 'Apr 15' },
      { title: 'Urban Wellness Innovation Grants', agency: 'Public Health Foundation', score: 88, amount: '$200K', deadline: 'May 1' },
      { title: 'Health Equity Capacity Building', agency: 'Community Care Initiative', score: 82, amount: '$150K', deadline: 'Jun 30' },
    ],
    rfpSections: [
      { label: 'Organizational capacity', status: 'complete' },
      { label: 'Program methodology', status: 'complete' },
      { label: 'Target population data', status: 'complete' },
      { label: 'Budget narrative', status: 'writing' },
    ],
    draftTitle: 'Project Narrative',
    draftText: 'The Horizon Health Collective proposes to train 80 new Community Health Workers across three Detroit neighborhoods with the highest rates of chronic disease and lowest access to primary care. Our evidence-based curriculum integrates motivational interviewing, chronic disease management, and trauma-informed care...',
  },
  {
    name: 'Thunderbird Research Lab',
    type: 'Tribal College Research Unit',
    location: 'Fort Berthold, ND',
    focus: ['Indigenous data sovereignty', 'Environmental monitoring', 'STEM pipeline'],
    color: '#60A5FA',
    colorBg: 'rgba(96, 165, 250, 0.12)',
    query: 'indigenous environmental science research',
    results: [
      { title: 'Indigenous Environmental Research Initiative', agency: 'Science & Innovation Council', score: 94, amount: '$520K', deadline: 'Mar 28' },
      { title: 'Tribal STEM Capacity Building Grants', agency: 'Education Research Board', score: 87, amount: '$350K', deadline: 'Apr 20' },
      { title: 'Climate Adaptation & Traditional Knowledge', agency: 'Environmental Science Fund', score: 79, amount: '$280K', deadline: 'May 15' },
    ],
    rfpSections: [
      { label: 'Research methodology', status: 'complete' },
      { label: 'Tribal consultation plan', status: 'complete' },
      { label: 'Data management plan', status: 'writing' },
      { label: 'Broader impacts', status: 'pending' },
    ],
    draftTitle: 'Research Design',
    draftText: 'Our participatory research design centers tribal elders and knowledge keepers as co-investigators alongside university-trained scientists. We will establish four seasonal monitoring stations integrating Western analytical methods with Traditional Ecological Knowledge, creating a hybrid framework for understanding watershed health...',
  },
]

const PANEL_DURATION = 10000 // 10s per profile

export default function HeroAnimationC() {
  const [profileIdx, setProfileIdx] = useState(0)
  const [phase, setPhase] = useState(0) // 0-5
  const [typedQuery, setTypedQuery] = useState('')
  const [visibleResults, setVisibleResults] = useState(0)
  const [draftWords, setDraftWords] = useState(0)
  const [rfpProgress, setRfpProgress] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const profile = PROFILES[profileIdx]

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => {
    clearTimers()
    setPhase(0)
    setTypedQuery('')
    setVisibleResults(0)
    setDraftWords(0)
    setRfpProgress(0)

    const q = profile.query

    // Phase 1: Profile + typing (0.5s)
    timersRef.current.push(setTimeout(() => {
      setPhase(1)
      for (let i = 1; i <= q.length; i++) {
        timersRef.current.push(setTimeout(() => setTypedQuery(q.slice(0, i)), i * 50))
      }
    }, 500))

    // Phase 2: Results (2.5s)
    timersRef.current.push(setTimeout(() => {
      setPhase(2)
      for (let i = 1; i <= 3; i++) {
        timersRef.current.push(setTimeout(() => setVisibleResults(i), i * 250))
      }
    }, 2800))

    // Phase 3: RFP Analysis (4.5s)
    timersRef.current.push(setTimeout(() => {
      setPhase(3)
      for (let i = 1; i <= 4; i++) {
        timersRef.current.push(setTimeout(() => setRfpProgress(i), i * 400))
      }
    }, 4800))

    // Phase 4: Drafting (6.5s)
    timersRef.current.push(setTimeout(() => {
      setPhase(4)
      const words = profile.draftText.split(' ')
      for (let i = 1; i <= words.length; i++) {
        timersRef.current.push(setTimeout(() => setDraftWords(i), i * 50))
      }
    }, 6800))

    // Phase 5: Complete (9s)
    timersRef.current.push(setTimeout(() => setPhase(5), 9200))

    // Next profile
    timersRef.current.push(setTimeout(() => {
      setProfileIdx(prev => (prev + 1) % PROFILES.length)
    }, PANEL_DURATION))

    return clearTimers
  }, [profileIdx, clearTimers])

  const draftWordsArr = profile.draftText.split(' ')
  const visibleDraft = draftWordsArr.slice(0, draftWords).join(' ')

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none" style={{ fontFamily: 'var(--font-body), DM Sans, system-ui, sans-serif' }}>
      {/* Ambient glow */}
      <div className="absolute -inset-10 rounded-3xl blur-[60px] opacity-15 transition-colors duration-1500"
        style={{ backgroundColor: profile.color }}
      />

      <div className="relative rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-md overflow-hidden shadow-2xl">
        {/* ── Title bar ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400/40" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/40" />
            <div className="w-2 h-2 rounded-full bg-green-400/40" />
          </div>
          <div className="text-[8px] font-mono text-white/20">granted.ai</div>
          <div className="flex gap-1">
            {PROFILES.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{ backgroundColor: i === profileIdx ? profile.color : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>
        </div>

        <div className="flex min-h-[320px]">
          {/* ── Left: Profile sidebar ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={profileIdx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
              className="w-[160px] shrink-0 border-r border-white/[0.05] p-3 bg-white/[0.02]"
            >
              {/* Org info */}
              <div className="mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold mb-2"
                  style={{ backgroundColor: profile.colorBg, color: profile.color, border: `1px solid ${profile.color}30` }}
                >
                  {profile.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="text-[9px] font-semibold text-white/70 leading-tight">{profile.name}</div>
                <div className="text-[7px] text-white/30 mt-0.5">{profile.type}</div>
                <div className="text-[7px] text-white/25 mt-0.5">{profile.location}</div>
              </div>

              {/* Focus areas */}
              <div className="mb-3">
                <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-1.5">Focus Areas</div>
                <div className="space-y-1">
                  {profile.focus.map((f, i) => (
                    <div key={i} className="px-1.5 py-0.5 rounded text-[7px] text-white/40 bg-white/[0.03] border border-white/[0.05]">
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-1.5">Journey</div>
                {['Search', 'Match', 'Analyze RFP', 'Draft'].map((step, i) => {
                  const done = phase > i + 1
                  const active = phase === i + 1 || (i === 3 && phase === 4)
                  return (
                    <div key={step} className="flex items-center gap-1.5 py-0.5">
                      <div
                        className="w-[6px] h-[6px] rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: done ? '#34D399' : active ? profile.color : 'rgba(255,255,255,0.08)',
                          boxShadow: active ? `0 0 4px ${profile.color}50` : 'none',
                        }}
                      />
                      <span
                        className="text-[7px] font-mono transition-colors duration-300"
                        style={{ color: done || active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)' }}
                      >
                        {step}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Right: Main content area with sliding panels ── */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Search + Results panel */}
              {phase >= 1 && phase < 3 && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 p-4"
                >
                  {/* Search bar */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] mb-3">
                    <svg className="w-3 h-3 text-white/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <span className="text-[10px] text-white/50 font-mono">
                      {typedQuery}
                      {phase === 1 && <span className="typewriter-cursor" />}
                    </span>
                  </div>

                  {/* Results */}
                  {phase >= 2 && (
                    <div className="space-y-2">
                      <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
                        {visibleResults} opportunities matched to your profile
                      </div>
                      {profile.results.map((r, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: i < visibleResults ? 1 : 0, y: i < visibleResults ? 0 : 6 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between px-3 py-2 rounded-lg border"
                          style={{
                            backgroundColor: i === 0 ? profile.colorBg : 'rgba(255,255,255,0.02)',
                            borderColor: i === 0 ? `${profile.color}30` : 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[9px] font-semibold text-white/70 truncate">{r.title}</div>
                            <div className="text-[7px] text-white/30">{r.agency} &middot; {r.deadline} &middot; {r.amount}</div>
                          </div>
                          <div className="shrink-0 ml-3">
                            <span className="text-[11px] font-bold tabular-nums" style={{ color: r.score >= 90 ? profile.color : 'rgba(255,255,255,0.4)' }}>
                              {r.score}%
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* RFP Analysis panel */}
              {phase === 3 && (
                <motion.div
                  key="rfp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[8px] font-mono text-white/25 uppercase tracking-wider">RFP Requirements Analysis</div>
                    <span className="px-1.5 py-0.5 rounded text-[7px] font-medium"
                      style={{ backgroundColor: profile.colorBg, color: profile.color }}
                    >
                      {profile.results[0].title}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {profile.rfpSections.map((sec, i) => {
                      const visible = i < rfpProgress
                      const isWriting = visible && sec.status === 'writing' && i === rfpProgress - 1
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: visible ? 1 : 0.2, x: visible ? 0 : 8 }}
                          transition={{ duration: 0.35 }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg border"
                          style={{
                            backgroundColor: visible ? 'rgba(255,255,255,0.03)' : 'transparent',
                            borderColor: visible ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-400"
                            style={{
                              backgroundColor: sec.status === 'complete' && visible ? 'rgba(52, 211, 153, 0.15)' : isWriting ? profile.colorBg : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${sec.status === 'complete' && visible ? 'rgba(52, 211, 153, 0.3)' : isWriting ? `${profile.color}30` : 'rgba(255,255,255,0.06)'}`,
                            }}
                          >
                            {sec.status === 'complete' && visible ? (
                              <svg className="w-2.5 h-2.5 text-emerald-400" viewBox="0 0 16 16" fill="none">
                                <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : isWriting ? (
                              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: profile.color }} />
                            ) : (
                              <div className="w-1 h-1 rounded-full bg-white/15" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="text-[9px] font-medium text-white/60">{sec.label}</div>
                          </div>

                          {visible && (
                            <span className="text-[7px] font-mono uppercase tracking-wider"
                              style={{
                                color: sec.status === 'complete' ? 'rgba(52, 211, 153, 0.6)' : isWriting ? profile.color : 'rgba(255,255,255,0.2)',
                              }}
                            >
                              {sec.status === 'complete' ? 'Mapped' : isWriting ? 'Analyzing...' : 'Pending'}
                            </span>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Coverage bar */}
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">Requirement Coverage</span>
                      <span className="text-[9px] font-bold tabular-nums" style={{ color: profile.color }}>
                        {Math.round((rfpProgress / 4) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: profile.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(rfpProgress / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Draft panel */}
              {phase >= 4 && (
                <motion.div
                  key="draft"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[8px] font-mono text-white/25 uppercase tracking-wider">AI Draft</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                      <span className="text-[8px] font-mono text-white/30">
                        {draftWords < draftWordsArr.length ? 'Writing...' : 'Complete'}
                      </span>
                    </div>
                  </div>

                  {/* Section tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.rfpSections.map((sec, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[6px] font-mono"
                        style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: 'rgba(52, 211, 153, 0.6)', border: '1px solid rgba(52, 211, 153, 0.2)' }}
                      >
                        {sec.label}
                      </span>
                    ))}
                  </div>

                  {/* Draft area */}
                  <div className="px-3 py-3 rounded-lg bg-white/[0.02] border border-white/[0.05] min-h-[180px]">
                    <div className="text-[10px] font-semibold mb-2" style={{ color: profile.color }}>
                      {profile.draftTitle}
                    </div>
                    <p className="text-[9px] leading-[1.65] text-white/45 font-mono">
                      {visibleDraft}
                      {draftWords < draftWordsArr.length && <span className="typewriter-cursor" />}
                    </p>
                  </div>

                  {/* Grounding status */}
                  {phase >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-400/[0.06] border border-emerald-400/[0.12]"
                    >
                      <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[8px] font-mono text-emerald-400/60">
                        All sections grounded &middot; Ready for review
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
