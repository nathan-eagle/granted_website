'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const JOURNEYS = [
  {
    initials: 'LH',
    name: 'Lena Howard',
    org: 'Blue Harbor Community Foundation',
    profile: 'Local nonprofit · Coastal resilience',
    accent: '#60A5FA',
    query: 'coastal resilience grants for small fishing communities',
    matches: [
      { title: 'Resilient Waterfront Communities Fund', source: 'Tides Foundation', fit: 96 },
      { title: 'Climate Ready Small Ports Program', source: 'MarinaWorks Trust', fit: 89 },
      { title: 'Community Shoreline Protection Grants', source: 'Coastal Impact Network', fit: 81 },
    ],
    rfpChecks: ['Eligibility confirmed', 'Outcomes section extracted', 'Budget constraints mapped', 'Letters required'],
    coachLine: 'Drafting a two-phase workplan and budget narrative tailored to your eligibility profile.',
  },
  {
    initials: 'MR',
    name: 'Miguel Reyes',
    org: 'Southwest Workforce Collective',
    profile: 'Workforce nonprofit · Youth pathways',
    accent: '#F59E0B',
    query: 'skills training grants for first generation college youth',
    matches: [
      { title: 'Career Bridge Community Accelerator', source: 'Pathway Futures Fund', fit: 94 },
      { title: 'Regional Apprenticeship Equity Grants', source: 'Workrise Collaborative', fit: 86 },
      { title: 'Digital Career Onramp Initiative', source: 'BrightStart Foundation', fit: 79 },
    ],
    rfpChecks: ['Target population fields extracted', 'Partner match requirement flagged', 'Milestone schedule drafted', 'Evaluation rubric linked'],
    coachLine: 'Building your narrative from outcomes backward, with milestones aligned to reviewer criteria.',
  },
  {
    initials: 'AK',
    name: 'Amina Khan',
    org: 'Prairie Health Research Alliance',
    profile: 'Research institute · Maternal health',
    accent: '#34D399',
    query: 'maternal health innovation grants for rural clinics',
    matches: [
      { title: 'Rural Maternal Outcomes Innovation Award', source: 'Health Equity Funders', fit: 95 },
      { title: 'Family Health Systems Challenge Grants', source: 'FutureCare Trust', fit: 88 },
      { title: 'Community Care Access Grant Program', source: 'Wellbeing Ventures', fit: 80 },
    ],
    rfpChecks: ['Methodology requirements mapped', 'Data collection sections outlined', 'Compliance language inserted', 'Submission checklist assembled'],
    coachLine: 'Composing your project design section with evidence references and reviewer-friendly structure.',
  },
]

const CYCLE_MS = 11200

export default function HeroAnimationD() {
  const [journeyIndex, setJourneyIndex] = useState(0)
  const [stage, setStage] = useState(0)
  const [typedLength, setTypedLength] = useState(0)
  const [visibleMatches, setVisibleMatches] = useState(0)
  const [checked, setChecked] = useState(0)
  const [coachWords, setCoachWords] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const journey = JOURNEYS[journeyIndex]

  useEffect(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    setStage(0)
    setTypedLength(0)
    setVisibleMatches(0)
    setChecked(0)
    setCoachWords(0)

    const query = journey.query
    const coachParts = journey.coachLine.split(' ')

    timersRef.current.push(setTimeout(() => {
      setStage(1)
      for (let i = 1; i <= query.length; i += 1) {
        timersRef.current.push(setTimeout(() => setTypedLength(i), i * 32))
      }
    }, 500))

    timersRef.current.push(setTimeout(() => {
      setStage(2)
      for (let i = 1; i <= journey.matches.length; i += 1) {
        timersRef.current.push(setTimeout(() => setVisibleMatches(i), i * 260))
      }
    }, 2600))

    timersRef.current.push(setTimeout(() => {
      setStage(3)
      for (let i = 1; i <= journey.rfpChecks.length; i += 1) {
        timersRef.current.push(setTimeout(() => setChecked(i), i * 330))
      }
    }, 4700))

    timersRef.current.push(setTimeout(() => {
      setStage(4)
      for (let i = 1; i <= coachParts.length; i += 1) {
        timersRef.current.push(setTimeout(() => setCoachWords(i), i * 54))
      }
    }, 6900))

    timersRef.current.push(setTimeout(() => setStage(5), 9400))
    timersRef.current.push(setTimeout(() => setJourneyIndex((prev) => (prev + 1) % JOURNEYS.length), CYCLE_MS))

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [journey, journeyIndex])

  const steps = ['Discover', 'Profile Match', 'RFP Map', 'Application']
  const visibleCoach = journey.coachLine.split(' ').slice(0, coachWords).join(' ')

  return (
    <div className="relative mx-auto w-full max-w-[560px] select-none" style={{ fontFamily: 'var(--font-body), DM Sans, system-ui, sans-serif' }}>
      <div className="absolute -inset-10 rounded-[30px] blur-3xl opacity-20" style={{ backgroundColor: journey.accent }} />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400/40" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/40" />
            <div className="h-2 w-2 rounded-full bg-green-400/40" />
          </div>
          <span className="text-[8px] font-mono uppercase tracking-wider text-white/25">Discovery Flow</span>
          <div className="flex gap-1">
            {JOURNEYS.map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-full transition-all duration-500"
                style={{ backgroundColor: index === journeyIndex ? journey.accent : 'rgba(255,255,255,0.14)' }}
              />
            ))}
          </div>
        </div>

        <div className="grid min-h-[325px] grid-cols-[168px_1fr]">
          <AnimatePresence mode="wait">
            <motion.aside
              key={journeyIndex}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.35 }}
              className="border-r border-white/[0.05] bg-white/[0.02] p-3"
            >
              <div
                className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg text-[10px] font-bold"
                style={{ backgroundColor: `${journey.accent}1F`, color: journey.accent, border: `1px solid ${journey.accent}50` }}
              >
                {journey.initials}
              </div>
              <p className="text-[10px] font-semibold leading-tight text-white/72">{journey.org}</p>
              <p className="mt-1 text-[8px] text-white/34">{journey.profile}</p>

              <div className="mt-3 space-y-1">
                {steps.map((step, index) => {
                  const active = stage >= index + 1
                  return (
                    <div key={step} className="flex items-center gap-1.5 py-0.5">
                      <span
                        className="h-[7px] w-[7px] rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: active ? journey.accent : 'rgba(255,255,255,0.14)',
                          boxShadow: active ? `0 0 7px ${journey.accent}` : 'none',
                        }}
                      />
                      <span className="text-[7px] font-mono uppercase tracking-wide text-white/45">{step}</span>
                    </div>
                  )
                })}
              </div>
            </motion.aside>
          </AnimatePresence>

          <div className="space-y-2 p-3.5">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
              <div className="mb-1.5 text-[7px] font-mono uppercase tracking-wider text-white/28">Grant Search</div>
              <div className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-1.5">
                <svg className="h-3 w-3 shrink-0 text-white/28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span className="text-[9px] font-mono text-white/52">
                  {journey.query.slice(0, typedLength)}
                  {stage === 1 && <span className="typewriter-cursor" />}
                </span>
              </div>
            </div>

            {(stage >= 2) && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="mb-1.5 text-[7px] font-mono uppercase tracking-wider text-white/28">
                  Matched Grants
                </div>
                <div className="space-y-1.5">
                  {journey.matches.map((match, index) => (
                    <motion.div
                      key={match.title}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: index < visibleMatches ? 1 : 0, y: index < visibleMatches ? 0 : 5 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center justify-between rounded-md border px-2 py-1.5"
                      style={{
                        backgroundColor: index === 0 ? `${journey.accent}14` : 'rgba(255,255,255,0.02)',
                        borderColor: index === 0 ? `${journey.accent}40` : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[8px] font-semibold text-white/70">{match.title}</p>
                        <p className="text-[7px] text-white/34">{match.source}</p>
                      </div>
                      <p className="ml-2 text-[10px] font-bold tabular-nums" style={{ color: journey.accent }}>{match.fit}%</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {(stage >= 3) && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="mb-1.5 text-[7px] font-mono uppercase tracking-wider text-white/28">RFP Coverage Map</div>
                <div className="space-y-1">
                  {journey.rfpChecks.map((check, index) => {
                    const complete = index < checked
                    return (
                      <div key={check} className="flex items-center gap-2 text-[8px] text-white/54">
                        <span
                          className="flex h-3.5 w-3.5 items-center justify-center rounded border"
                          style={{
                            borderColor: complete ? `${journey.accent}AA` : 'rgba(255,255,255,0.2)',
                            backgroundColor: complete ? `${journey.accent}22` : 'transparent',
                          }}
                        >
                          {complete ? (
                            <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
                              <path d="M2.2 6.2L4.8 8.8L9.8 3.2" stroke={journey.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : null}
                        </span>
                        {check}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {(stage >= 4) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[7px] font-mono uppercase tracking-wider text-white/28">Granted Writing Coach</span>
                  <span className="text-[7px] font-mono text-emerald-300/70">Application in progress</span>
                </div>
                <p className="min-h-[30px] text-[8px] leading-relaxed text-white/62">{visibleCoach}</p>
                <div className="mt-2.5 h-1.5 rounded-full bg-white/[0.08]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: journey.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: stage === 5 ? '100%' : '78%' }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
