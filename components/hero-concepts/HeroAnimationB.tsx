'use client'

/**
 * CONCEPT B: "The Cascade"
 *
 * A vertical, timeline-based animation that shows the full journey
 * as a continuous scroll-like flow. Three users appear as "cards"
 * stacked along a glowing timeline. As each user's journey progresses,
 * their card expands to show: search → match → RFP analysis → draft snippet.
 *
 * The visual metaphor is a notification feed / activity stream —
 * familiar from Slack/GitHub, feels alive and real-time.
 */

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const USERS = [
  {
    name: 'Sarah Chen',
    role: 'Research Director',
    org: 'Cascadia Conservation Trust',
    avatar: 'SC',
    color: '#60A5FA',
    query: 'salmon habitat restoration Pacific Northwest',
    match: { title: 'Aquatic Ecosystem Recovery Fund', agency: 'Wildlife Conservation Board', score: 93, amount: '$280K' },
    rfpTag: 'Environmental Impact Assessment',
    draft: 'The project will restore 12 miles of riparian corridor along the Nooksack River watershed, removing three fish passage barriers...',
  },
  {
    name: 'James Blackwater',
    role: 'Grants Manager',
    org: 'Standing Rock Education Foundation',
    avatar: 'JB',
    color: '#F59E0B',
    query: 'STEM education tribal college students',
    match: { title: 'Indigenous STEM Pathways Initiative', agency: 'National Science Council', score: 96, amount: '$425K' },
    rfpTag: 'Institutional Capacity Building',
    draft: 'Our program will establish a peer mentorship network connecting 150 tribal college students with Indigenous scientists working in federal labs...',
  },
  {
    name: 'Dr. Elena Vasquez',
    role: 'PI, Environmental Health',
    org: 'Rio Grande Public Health Institute',
    avatar: 'EV',
    color: '#34D399',
    query: 'air quality monitoring underserved communities',
    match: { title: 'Community Environmental Health Grants', agency: 'Environmental Justice Office', score: 91, amount: '$340K' },
    rfpTag: 'Health Outcomes Methodology',
    draft: 'We will deploy a network of 60 low-cost air quality sensors across three environmental justice communities in the Lower Rio Grande Valley...',
  },
]

type Phase = 'idle' | 'searching' | 'matched' | 'analyzing' | 'drafting' | 'complete'

interface UserState {
  phase: Phase
  typedChars: number
  draftWords: number
}

export default function HeroAnimationB() {
  const [states, setStates] = useState<UserState[]>(
    USERS.map(() => ({ phase: 'idle', typedChars: 0, draftWords: 0 }))
  )
  const [cycle, setCycle] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const updateUser = (idx: number, update: Partial<UserState>) => {
    setStates(prev => prev.map((s, i) => i === idx ? { ...s, ...update } : s))
  }

  useEffect(() => {
    clearTimers()

    // Reset all
    setStates(USERS.map(() => ({ phase: 'idle', typedChars: 0, draftWords: 0 })))

    // Stagger user animations: user 0 at 0ms, user 1 at 2500ms, user 2 at 5000ms
    USERS.forEach((user, idx) => {
      const offset = idx * 2500

      // Start searching
      timersRef.current.push(setTimeout(() => {
        updateUser(idx, { phase: 'searching' })
        const q = user.query
        for (let i = 1; i <= q.length; i++) {
          timersRef.current.push(setTimeout(() => updateUser(idx, { typedChars: i }), i * 45))
        }
      }, offset + 500))

      // Match found
      timersRef.current.push(setTimeout(() => {
        updateUser(idx, { phase: 'matched' })
      }, offset + 2500))

      // Analyzing RFP
      timersRef.current.push(setTimeout(() => {
        updateUser(idx, { phase: 'analyzing' })
      }, offset + 4000))

      // Drafting
      timersRef.current.push(setTimeout(() => {
        updateUser(idx, { phase: 'drafting' })
        const words = user.draft.split(' ')
        for (let i = 1; i <= words.length; i++) {
          timersRef.current.push(setTimeout(() => updateUser(idx, { draftWords: i }), i * 55))
        }
      }, offset + 5500))

      // Complete
      timersRef.current.push(setTimeout(() => {
        updateUser(idx, { phase: 'complete' })
      }, offset + 8000))
    })

    // Restart cycle
    timersRef.current.push(setTimeout(() => setCycle(c => c + 1), 14000))

    return clearTimers
  }, [cycle])

  return (
    <div className="relative w-full max-w-[520px] mx-auto select-none" style={{ fontFamily: 'var(--font-body), DM Sans, system-ui, sans-serif' }}>
      {/* Outer container */}
      <div className="relative rounded-2xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Live Activity</span>
          </div>
          <div className="text-[8px] font-mono text-white/20">3 active users</div>
        </div>

        {/* Timeline feed */}
        <div className="relative px-4 py-3">
          {/* Vertical timeline line */}
          <div className="absolute left-[29px] top-3 bottom-3 w-[1.5px] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

          <div className="space-y-3">
            {USERS.map((user, idx) => {
              const state = states[idx]
              const isActive = state.phase !== 'idle'
              const query = user.query.slice(0, state.typedChars)
              const draftText = user.draft.split(' ').slice(0, state.draftWords).join(' ')

              return (
                <motion.div
                  key={idx}
                  layout
                  className="relative pl-8"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isActive ? 1 : 0.4 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[22px] top-3 w-[15px] h-[15px] rounded-full border-2 transition-all duration-500 z-10"
                    style={{
                      borderColor: isActive ? user.color : 'rgba(255,255,255,0.1)',
                      backgroundColor: state.phase === 'complete' ? user.color : isActive ? `${user.color}20` : 'rgba(255,255,255,0.03)',
                      boxShadow: isActive ? `0 0 8px ${user.color}40` : 'none',
                    }}
                  >
                    {state.phase === 'complete' && (
                      <svg className="w-full h-full p-[2px] text-navy" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  {/* User card */}
                  <div
                    className="rounded-xl border transition-all duration-500 overflow-hidden"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                      borderColor: isActive ? `${user.color}20` : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    {/* User header */}
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                        style={{ backgroundColor: `${user.color}18`, color: user.color, border: `1px solid ${user.color}30` }}
                      >
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-semibold text-white/65 leading-none">{user.name}</div>
                        <div className="text-[7px] text-white/30 mt-0.5 truncate">{user.role}, {user.org}</div>
                      </div>
                      <PhaseLabel phase={state.phase} color={user.color} />
                    </div>

                    {/* Expandable content */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-2.5 space-y-2">
                            {/* Search query */}
                            {state.phase !== 'idle' && (
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05]">
                                <svg className="w-2.5 h-2.5 text-white/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                </svg>
                                <span className="text-[8px] text-white/45 font-mono">
                                  {query}
                                  {state.phase === 'searching' && <span className="typewriter-cursor" style={{ height: '0.8em' }} />}
                                </span>
                              </div>
                            )}

                            {/* Match result */}
                            {(state.phase === 'matched' || state.phase === 'analyzing' || state.phase === 'drafting' || state.phase === 'complete') && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between px-2 py-1.5 rounded-md border"
                                style={{ backgroundColor: `${user.color}08`, borderColor: `${user.color}20` }}
                              >
                                <div className="min-w-0">
                                  <div className="text-[8px] font-semibold text-white/65 truncate">{user.match.title}</div>
                                  <div className="text-[7px] text-white/30">{user.match.agency}</div>
                                </div>
                                <div className="shrink-0 ml-2 text-right">
                                  <span className="text-[10px] font-bold tabular-nums" style={{ color: user.color }}>
                                    {user.match.score}%
                                  </span>
                                  <div className="text-[7px] text-white/30">{user.match.amount}</div>
                                </div>
                              </motion.div>
                            )}

                            {/* RFP tag */}
                            {(state.phase === 'analyzing' || state.phase === 'drafting' || state.phase === 'complete') && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1.5"
                              >
                                <span className="text-[7px] text-white/25 font-mono uppercase tracking-wider">RFP:</span>
                                <span className="px-1.5 py-0.5 rounded text-[7px] font-medium"
                                  style={{ backgroundColor: `${user.color}15`, color: user.color, border: `1px solid ${user.color}25` }}
                                >
                                  {user.rfpTag}
                                </span>
                              </motion.div>
                            )}

                            {/* Draft snippet */}
                            {(state.phase === 'drafting' || state.phase === 'complete') && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="px-2 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.04]"
                              >
                                <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-1">Draft</div>
                                <p className="text-[8px] leading-relaxed text-white/40 font-mono">
                                  {draftText}
                                  {state.phase === 'drafting' && state.draftWords < user.draft.split(' ').length && (
                                    <span className="typewriter-cursor" style={{ height: '0.7em' }} />
                                  )}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
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

function PhaseLabel({ phase, color }: { phase: Phase; color: string }) {
  const labels: Record<Phase, string> = {
    idle: '',
    searching: 'Searching...',
    matched: 'Match found',
    analyzing: 'Reading RFP',
    drafting: 'Drafting',
    complete: 'Ready',
  }

  if (phase === 'idle') return null

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="shrink-0 px-1.5 py-0.5 rounded text-[7px] font-medium"
      style={{
        backgroundColor: phase === 'complete' ? 'rgba(52, 211, 153, 0.12)' : `${color}15`,
        color: phase === 'complete' ? '#34D399' : color,
        border: `1px solid ${phase === 'complete' ? 'rgba(52, 211, 153, 0.25)' : `${color}25`}`,
      }}
    >
      {labels[phase]}
    </motion.span>
  )
}
