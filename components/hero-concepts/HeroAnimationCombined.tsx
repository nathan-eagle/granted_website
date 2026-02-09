'use client'

/**
 * COMBINED CONCEPT: "The Command Center"
 *
 * Merges the best of A, C, and D:
 *  - (A) Single-user cycling narrative with deep content
 *  - (C) Rich split-pane profile sidebar
 *  - (D) Explicit stage navigation with visible action buttons
 *
 * Crown jewel: the matched results panel with prominent
 * "Analyze RFP" and "Start Application" buttons on each card.
 * The discovery panel lingers to let viewers absorb the core value.
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Persona data ── */
const PERSONAS = [
  {
    name: 'Horizon Health Collective',
    type: 'Community Health Nonprofit',
    location: 'Detroit, MI',
    avatar: 'HH',
    focus: ['Health equity', 'Community health workers', 'Urban wellness'],
    accent: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    query: 'community health worker training programs',
    results: [
      { title: 'Community Health Workforce Fund', agency: 'Health Resources Council', match: 95, amount: '$380K', deadline: 'Apr 15, 2026' },
      { title: 'Urban Wellness Innovation Grants', agency: 'Public Health Foundation', match: 88, amount: '$200K', deadline: 'May 1, 2026' },
      { title: 'Health Equity Capacity Building', agency: 'Community Care Initiative', match: 82, amount: '$150K', deadline: 'Jun 30, 2026' },
    ],
    rfpChecks: [
      { label: 'Organizational capacity', status: 'complete' },
      { label: 'Program methodology', status: 'complete' },
      { label: 'Target population data', status: 'complete' },
      { label: 'Budget narrative', status: 'writing' },
    ],
    draftTitle: 'Project Narrative',
    draftSnippet: 'The Horizon Health Collective proposes to train 80 new Community Health Workers across three Detroit neighborhoods with the highest rates of chronic disease and lowest access to primary care. Our evidence-based curriculum integrates motivational interviewing, chronic disease management, and trauma-informed care practices.',
  },
  {
    name: 'Thunderbird Research Lab',
    type: 'Tribal College Research Unit',
    location: 'Fort Berthold, ND',
    avatar: 'TR',
    focus: ['Indigenous data sovereignty', 'Environmental monitoring', 'STEM pipeline'],
    accent: '#60A5FA',
    accentBg: 'rgba(96, 165, 250, 0.12)',
    query: 'indigenous environmental science research',
    results: [
      { title: 'Indigenous Environmental Research Initiative', agency: 'Science & Innovation Council', match: 94, amount: '$520K', deadline: 'Mar 28, 2026' },
      { title: 'Tribal STEM Capacity Building Grants', agency: 'Education Research Board', match: 87, amount: '$350K', deadline: 'Apr 20, 2026' },
      { title: 'Climate Adaptation & Traditional Knowledge', agency: 'Environmental Science Fund', match: 79, amount: '$280K', deadline: 'May 15, 2026' },
    ],
    rfpChecks: [
      { label: 'Research methodology', status: 'complete' },
      { label: 'Tribal consultation plan', status: 'complete' },
      { label: 'Data management plan', status: 'writing' },
      { label: 'Broader impacts', status: 'pending' },
    ],
    draftTitle: 'Research Design',
    draftSnippet: 'Our participatory research design centers tribal elders and knowledge keepers as co-investigators alongside university-trained scientists. We will establish four seasonal monitoring stations integrating Western analytical methods with Traditional Ecological Knowledge, creating a hybrid framework for understanding watershed health.',
  },
  {
    name: 'Bridges Youth Alliance',
    type: 'Workforce Development Nonprofit',
    location: 'Appalachian Region, WV',
    avatar: 'BY',
    focus: ['Youth workforce', 'Rural economic development', 'Digital literacy'],
    accent: '#34D399',
    accentBg: 'rgba(52, 211, 153, 0.12)',
    query: 'rural youth workforce development training',
    results: [
      { title: 'Rural Youth Opportunity Initiative', agency: 'Community Development Corp', match: 91, amount: '$175K', deadline: 'Apr 1, 2026' },
      { title: 'Workforce Innovation for Young Adults', agency: 'Labor & Training Board', match: 85, amount: '$400K', deadline: 'Jun 10, 2026' },
      { title: 'Digital Skills Bridge Program', agency: 'Technology Access Foundation', match: 78, amount: '$125K', deadline: 'May 30, 2026' },
    ],
    rfpChecks: [
      { label: 'Program design & outcomes', status: 'complete' },
      { label: 'Target population data', status: 'complete' },
      { label: 'Partnership commitments', status: 'complete' },
      { label: 'Sustainability plan', status: 'writing' },
    ],
    draftTitle: 'Program Design',
    draftSnippet: 'The program will serve 200 young adults ages 16-24 across three rural counties, providing 12-week cohorts combining technical certification with paid apprenticeships at local employers. Our model integrates digital literacy training, career coaching, and community mentorship to address the unique barriers facing Appalachian youth.',
  },
]

/* ── Stage definitions ── */
const STAGES = [
  { key: 'discover', label: 'Discover' },
  { key: 'rfp', label: 'Analyze RFP' },
  { key: 'apply', label: 'Application' },
] as const

/* ── Timing — discovery phase gets the most time ── */
const CYCLE_MS = 14000

export default function HeroAnimationCombined() {
  const [personaIdx, setPersonaIdx] = useState(0)
  const [phase, setPhase] = useState(0)
  // Phase 0: Profile appears
  // Phase 1: Query types
  // Phase 2: Results cascade in (cards appear)
  // Phase 3: Top card expands — "Analyze RFP" and "Start Application" buttons animate in
  // Phase 4: Buttons visible on all cards — linger here (crown jewel)
  // Phase 5: "Analyze RFP" button highlights/clicks → transition to RFP panel
  // Phase 6: RFP checks animate
  // Phase 7: "Start Application" highlights → transition to draft panel
  // Phase 8: Draft typewriter
  // Phase 9: Complete — hold
  const [typedQuery, setTypedQuery] = useState('')
  const [visibleResults, setVisibleResults] = useState(0)
  const [buttonsRevealed, setButtonsRevealed] = useState(0) // 0, 1, 2, 3 (per card)
  const [activeButton, setActiveButton] = useState<'none' | 'rfp' | 'apply'>('none')
  const [rfpProgress, setRfpProgress] = useState(0)
  const [draftWords, setDraftWords] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const persona = PERSONAS[personaIdx]

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => {
    clearTimers()
    setPhase(0)
    setTypedQuery('')
    setVisibleResults(0)
    setButtonsRevealed(0)
    setActiveButton('none')
    setRfpProgress(0)
    setDraftWords(0)

    const q = persona.query
    const words = persona.draftSnippet.split(' ')

    // Phase 1: Start typing (0.5s)
    timersRef.current.push(setTimeout(() => {
      setPhase(1)
      for (let i = 1; i <= q.length; i++) {
        timersRef.current.push(setTimeout(() => setTypedQuery(q.slice(0, i)), i * 38))
      }
    }, 500))

    // Phase 2: Results cascade (2.3s)
    timersRef.current.push(setTimeout(() => {
      setPhase(2)
      for (let i = 1; i <= 3; i++) {
        timersRef.current.push(setTimeout(() => setVisibleResults(i), i * 300))
      }
    }, 2300))

    // Phase 3: Top card buttons appear (3.6s)
    timersRef.current.push(setTimeout(() => {
      setPhase(3)
      setButtonsRevealed(1)
    }, 3600))

    // Phase 4: All cards get buttons — linger here (4.3s → 6.5s = ~2.2s of crown jewel)
    timersRef.current.push(setTimeout(() => {
      setPhase(4)
      setButtonsRevealed(2)
      timersRef.current.push(setTimeout(() => setButtonsRevealed(3), 350))
    }, 4300))

    // Phase 5: "Analyze RFP" button highlights on top card (6.5s)
    timersRef.current.push(setTimeout(() => {
      setPhase(5)
      setActiveButton('rfp')
    }, 6500))

    // Phase 6: Transition to RFP panel, checks animate (7.2s)
    timersRef.current.push(setTimeout(() => {
      setPhase(6)
      setActiveButton('none')
      for (let i = 1; i <= persona.rfpChecks.length; i++) {
        timersRef.current.push(setTimeout(() => setRfpProgress(i), i * 320))
      }
    }, 7200))

    // Phase 7: "Start Application" highlights (9s)
    timersRef.current.push(setTimeout(() => {
      setPhase(7)
      setActiveButton('apply')
    }, 9000))

    // Phase 8: Draft typewriter (9.6s)
    timersRef.current.push(setTimeout(() => {
      setPhase(8)
      setActiveButton('none')
      for (let i = 1; i <= words.length; i++) {
        timersRef.current.push(setTimeout(() => setDraftWords(i), i * 42))
      }
    }, 9600))

    // Phase 9: Complete (12.5s)
    timersRef.current.push(setTimeout(() => setPhase(9), 12500))

    // Next persona
    timersRef.current.push(setTimeout(() => {
      setPersonaIdx(prev => (prev + 1) % PERSONAS.length)
    }, CYCLE_MS))

    return clearTimers
  }, [personaIdx, clearTimers])

  const draftWordsArr = persona.draftSnippet.split(' ')
  const visibleDraft = draftWordsArr.slice(0, draftWords).join(' ')

  // Sidebar stage logic
  const activeStageIdx = phase <= 5 ? 0 : phase <= 7 ? 1 : 2
  const stageComplete = (idx: number) => {
    if (idx === 0) return phase >= 6
    if (idx === 1) return phase >= 8
    if (idx === 2) return phase >= 9
    return false
  }

  return (
    <div
      className="relative w-full max-w-[660px] mx-auto select-none overflow-hidden"
      style={{ fontFamily: 'var(--font-body), DM Sans, system-ui, sans-serif' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -inset-10 rounded-[30px] blur-[60px] opacity-[0.15] transition-colors duration-1000"
        style={{ backgroundColor: persona.accent }}
      />

      <div className="relative rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-md overflow-hidden shadow-2xl">
        {/* ── Window chrome ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400/40" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/40" />
            <div className="w-2 h-2 rounded-full bg-green-400/40" />
          </div>
          <div className="text-[8px] font-mono text-white/20 tracking-wider uppercase">
            grantedai.com
          </div>
          <div className="flex gap-1.5">
            {PERSONAS.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i === personaIdx ? persona.accent : 'rgba(255,255,255,0.12)',
                  transform: i === personaIdx ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex h-[400px]">
          {/* ── Left: Profile sidebar ── */}
          <AnimatePresence mode="wait">
            <motion.aside
              key={personaIdx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
              className="w-[170px] shrink-0 border-r border-white/[0.05] bg-white/[0.02] p-3.5 flex flex-col"
            >
              {/* Org identity */}
              <div className="mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold mb-2"
                  style={{
                    backgroundColor: persona.accentBg,
                    color: persona.accent,
                    border: `1px solid ${persona.accent}40`,
                  }}
                >
                  {persona.avatar}
                </div>
                <div className="text-[10px] font-semibold text-white/75 leading-tight">
                  {persona.name}
                </div>
                <div className="text-[7.5px] text-white/35 mt-0.5">{persona.type}</div>
                <div className="text-[7px] text-white/25 mt-0.5 flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 8.5a2 2 0 100-4 2 2 0 000 4z" />
                    <path d="M13 6.5c0 4.5-5 8-5 8s-5-3.5-5-8a5 5 0 0110 0z" />
                  </svg>
                  {persona.location}
                </div>
              </div>

              {/* Focus areas */}
              <div className="mb-4">
                <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-1.5">
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-1">
                  {persona.focus.map((f) => (
                    <span
                      key={f}
                      className="px-1.5 py-[3px] rounded text-[6.5px] text-white/45 bg-white/[0.04] border border-white/[0.06]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stage navigation */}
              <div className="mt-auto">
                <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-2">
                  Workflow
                </div>
                <div className="space-y-1.5">
                  {STAGES.map((stage, i) => {
                    const isActive = activeStageIdx === i
                    const isDone = stageComplete(i)
                    return (
                      <div
                        key={stage.key}
                        className="flex items-center gap-2 px-2.5 py-[6px] rounded-lg transition-all duration-400"
                        style={{
                          backgroundColor: isActive
                            ? persona.accentBg
                            : isDone
                            ? 'rgba(52, 211, 153, 0.06)'
                            : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${
                            isActive
                              ? `${persona.accent}40`
                              : isDone
                              ? 'rgba(52, 211, 153, 0.15)'
                              : 'rgba(255,255,255,0.04)'
                          }`,
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                          style={{
                            backgroundColor: isDone
                              ? 'rgba(52, 211, 153, 0.15)'
                              : isActive
                              ? persona.accentBg
                              : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${
                              isDone
                                ? 'rgba(52, 211, 153, 0.3)'
                                : isActive
                                ? `${persona.accent}50`
                                : 'rgba(255,255,255,0.06)'
                            }`,
                          }}
                        >
                          {isDone ? (
                            <svg className="w-2 h-2 text-emerald-400" viewBox="0 0 16 16" fill="none">
                              <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : isActive ? (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: persona.accent,
                                boxShadow: `0 0 6px ${persona.accent}80`,
                              }}
                            />
                          ) : (
                            <div className="w-1 h-1 rounded-full bg-white/15" />
                          )}
                        </div>

                        <span
                          className="text-[8px] font-semibold transition-colors duration-300"
                          style={{
                            color: isDone
                              ? 'rgba(52, 211, 153, 0.7)'
                              : isActive
                              ? persona.accent
                              : 'rgba(255,255,255,0.25)',
                          }}
                        >
                          {stage.label}
                        </span>

                        {isActive && (
                          <motion.svg
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 0.6, x: 0 }}
                            className="w-2 h-2 ml-auto"
                            style={{ color: persona.accent }}
                            viewBox="0 0 8 8"
                            fill="currentColor"
                          >
                            <path d="M2 1l4 3-4 3V1z" />
                          </motion.svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.aside>
          </AnimatePresence>

          {/* ── Right: Main content ── */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">

              {/* ═══════════════════════════════════════════════
                  DISCOVERY PANEL — THE CROWN JEWEL
                  Phases 0-5: search → results → action buttons
                  ═══════════════════════════════════════════════ */}
              {phase >= 0 && phase <= 5 && (
                <motion.div
                  key={`discover-${personaIdx}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 p-4 flex flex-col overflow-hidden"
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: persona.accent }} />
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                        Grant Discovery
                      </span>
                    </div>
                    <span className="text-[7px] font-mono text-white/20">
                      Personalized to profile
                    </span>
                  </div>

                  {/* Search bar */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] mb-3">
                    <svg className="w-3.5 h-3.5 text-white/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <div className="text-[10px] text-white/55 font-mono flex-1 min-h-[1em]">
                      {typedQuery}
                      {phase === 1 && <span className="typewriter-cursor" />}
                    </div>
                  </div>

                  {/* Results with action buttons */}
                  {phase >= 2 && (
                    <div className="space-y-2.5 flex-1">
                      <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
                        {visibleResults} opportunities matched to your profile
                      </div>

                      {persona.results.map((result, i) => {
                        const isVisible = i < visibleResults
                        const hasButtons = i < buttonsRevealed
                        const isTopCard = i === 0
                        const rfpHighlighted = isTopCard && activeButton === 'rfp'
                        const applyHighlighted = isTopCard && activeButton === 'apply'

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: isVisible ? 1 : 0,
                              y: isVisible ? 0 : 10,
                            }}
                            transition={{ duration: 0.35 }}
                            className="rounded-xl border overflow-hidden transition-all duration-400"
                            style={{
                              backgroundColor: isTopCard ? persona.accentBg : 'rgba(255,255,255,0.02)',
                              borderColor: isTopCard ? `${persona.accent}35` : 'rgba(255,255,255,0.05)',
                            }}
                          >
                            {/* Card content */}
                            <div className="px-3 py-2.5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="text-[9.5px] font-semibold text-white/75 leading-snug">
                                    {result.title}
                                  </div>
                                  <div className="text-[7px] text-white/35 mt-0.5">
                                    {result.agency} &middot; {result.deadline} &middot; {result.amount}
                                  </div>
                                </div>
                                <div className="shrink-0 text-right">
                                  <div
                                    className="text-[12px] font-bold tabular-nums"
                                    style={{ color: result.match >= 90 ? persona.accent : 'rgba(255,255,255,0.45)' }}
                                  >
                                    {result.match}%
                                  </div>
                                  <div className="text-[6px] text-white/20 uppercase tracking-wider">fit</div>
                                </div>
                              </div>
                              {/* Match bar */}
                              <div className="mt-1.5 h-[2.5px] rounded-full bg-white/[0.06] overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: persona.accent }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${result.match}%` }}
                                  transition={{ duration: 0.5, delay: 0.15 }}
                                />
                              </div>
                            </div>

                            {/* ── Action buttons row ── */}
                            {hasButtons && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="border-t px-3 py-2 flex items-center gap-2"
                                style={{
                                  borderColor: isTopCard ? `${persona.accent}20` : 'rgba(255,255,255,0.04)',
                                  backgroundColor: isTopCard ? `${persona.accent}08` : 'rgba(255,255,255,0.01)',
                                }}
                              >
                                {/* Analyze RFP button */}
                                <motion.div
                                  animate={{
                                    scale: rfpHighlighted ? 1.05 : 1,
                                    boxShadow: rfpHighlighted
                                      ? `0 0 12px ${persona.accent}50, 0 0 4px ${persona.accent}30`
                                      : '0 0 0px transparent',
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-md text-[8px] font-semibold transition-all cursor-default"
                                  style={{
                                    backgroundColor: rfpHighlighted ? persona.accent : persona.accentBg,
                                    color: rfpHighlighted ? '#0A1628' : persona.accent,
                                    border: `1px solid ${rfpHighlighted ? persona.accent : `${persona.accent}50`}`,
                                  }}
                                >
                                  <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="3" y="2" width="10" height="12" rx="1.5" />
                                    <path d="M6 5h4M6 7.5h4M6 10h2" />
                                  </svg>
                                  Analyze RFP
                                </motion.div>

                                {/* Start Application button */}
                                <motion.div
                                  animate={{
                                    scale: applyHighlighted ? 1.05 : 1,
                                    boxShadow: applyHighlighted
                                      ? `0 0 12px ${persona.accent}50, 0 0 4px ${persona.accent}30`
                                      : '0 0 0px transparent',
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-md text-[8px] font-semibold transition-all cursor-default"
                                  style={{
                                    backgroundColor: applyHighlighted ? persona.accent : 'rgba(255,255,255,0.04)',
                                    color: applyHighlighted ? '#0A1628' : 'rgba(255,255,255,0.45)',
                                    border: `1px solid ${applyHighlighted ? persona.accent : 'rgba(255,255,255,0.08)'}`,
                                  }}
                                >
                                  <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 2h5l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
                                    <path d="M9 2v4h4" />
                                    <path d="M6 9l1.5 2L10 8" />
                                  </svg>
                                  Start Application
                                </motion.div>

                                {/* Deadline badge on top card */}
                                {isTopCard && (
                                  <span className="ml-auto text-[6.5px] font-mono text-white/25 uppercase tracking-wider">
                                    {result.deadline}
                                  </span>
                                )}
                              </motion.div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ RFP Analysis Panel ═══ */}
              {phase >= 6 && phase <= 7 && (
                <motion.div
                  key={`rfp-${personaIdx}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 p-4 flex flex-col"
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: persona.accent }} />
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                        RFP Analysis
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[7px] font-medium truncate max-w-[200px]"
                      style={{ backgroundColor: persona.accentBg, color: persona.accent }}
                    >
                      {persona.results[0].title}
                    </span>
                  </div>

                  {/* RFP checklist */}
                  <div className="space-y-2 flex-1">
                    {persona.rfpChecks.map((check, i) => {
                      const visible = i < rfpProgress
                      const isWriting = visible && check.status === 'writing' && i === rfpProgress - 1
                      const isComplete = visible && check.status === 'complete'

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0.25, x: 6 }}
                          animate={{ opacity: visible ? 1 : 0.25, x: visible ? 0 : 6 }}
                          transition={{ duration: 0.35 }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all"
                          style={{
                            backgroundColor: visible ? 'rgba(255,255,255,0.03)' : 'transparent',
                            borderColor: visible ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
                            style={{
                              border: `1.5px solid ${isComplete ? 'rgba(52, 211, 153, 0.5)' : isWriting ? `${persona.accent}60` : 'rgba(255,255,255,0.12)'}`,
                              backgroundColor: isComplete ? 'rgba(52, 211, 153, 0.1)' : isWriting ? persona.accentBg : 'transparent',
                            }}
                          >
                            {isComplete ? (
                              <svg className="w-2.5 h-2.5 text-emerald-400" viewBox="0 0 16 16" fill="none">
                                <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : isWriting ? (
                              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: persona.accent }} />
                            ) : null}
                          </div>
                          <span className="text-[9px] font-medium text-white/55 flex-1">{check.label}</span>
                          {visible && (
                            <span
                              className="text-[7px] font-mono uppercase tracking-wider"
                              style={{
                                color: isComplete ? 'rgba(52, 211, 153, 0.6)' : isWriting ? persona.accent : 'rgba(255,255,255,0.2)',
                              }}
                            >
                              {isComplete ? 'Mapped' : isWriting ? 'Analyzing...' : 'Pending'}
                            </span>
                          )}
                        </motion.div>
                      )
                    })}

                    {/* Coverage bar */}
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
                          Requirement Coverage
                        </span>
                        <span className="text-[10px] font-bold tabular-nums" style={{ color: persona.accent }}>
                          {Math.round((rfpProgress / persona.rfpChecks.length) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: persona.accent }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(rfpProgress / persona.rfpChecks.length) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>

                    {/* Inline "Start Application" CTA */}
                    {rfpProgress >= persona.rfpChecks.length && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="pt-1"
                      >
                        <div
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[9px] font-semibold"
                          style={{
                            backgroundColor: phase === 7 ? persona.accent : persona.accentBg,
                            border: `1px solid ${persona.accent}50`,
                            color: phase === 7 ? '#0A1628' : persona.accent,
                            boxShadow: phase === 7 ? `0 0 12px ${persona.accent}40` : 'none',
                          }}
                        >
                          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 2h5l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
                            <path d="M9 2v4h4" />
                          </svg>
                          <span>Start Application</span>
                          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 4l4 4-4 4" />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══ Application / Draft Panel ═══ */}
              {phase >= 8 && (
                <motion.div
                  key={`draft-${personaIdx}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 p-4 flex flex-col"
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: persona.accent }} />
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                        AI Writing Coach
                      </span>
                    </div>
                    <span className="text-[8px] font-mono" style={{ color: phase >= 9 ? 'rgba(52, 211, 153, 0.6)' : `${persona.accent}80` }}>
                      {phase >= 9 ? 'Draft ready' : 'Writing...'}
                    </span>
                  </div>

                  {/* RFP section tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {persona.rfpChecks.map((sec, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-[3px] rounded text-[6.5px] font-mono"
                        style={{
                          backgroundColor: 'rgba(52, 211, 153, 0.08)',
                          color: 'rgba(52, 211, 153, 0.55)',
                          border: '1px solid rgba(52, 211, 153, 0.15)',
                        }}
                      >
                        {sec.label}
                      </span>
                    ))}
                  </div>

                  {/* Draft area */}
                  <div className="px-3 py-3 rounded-lg bg-white/[0.02] border border-white/[0.05] flex-1 min-h-[140px]">
                    <div className="text-[10px] font-semibold mb-2" style={{ color: persona.accent }}>
                      {persona.draftTitle}
                    </div>
                    <p className="text-[9px] leading-[1.7] text-white/45 font-mono">
                      {visibleDraft}
                      {phase === 8 && draftWords < draftWordsArr.length && (
                        <span className="typewriter-cursor" />
                      )}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
                        Section Progress
                      </span>
                      <span className="text-[9px] font-bold tabular-nums" style={{ color: persona.accent }}>
                        {Math.min(Math.round((draftWords / draftWordsArr.length) * 100), 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: persona.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((draftWords / draftWordsArr.length) * 100, 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Grounding confirmation */}
                  {phase >= 9 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-400/[0.06] border border-emerald-400/[0.12]"
                    >
                      <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[8px] font-mono text-emerald-400/60">
                        All sections grounded to RFP &middot; Ready for review
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
