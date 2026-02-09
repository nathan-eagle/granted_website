'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const TRACKS = [
  {
    id: 'research',
    initials: 'NO',
    profile: 'Academic Lab',
    org: 'Northfield Oceanography Lab',
    accent: '#60A5FA',
    query: 'microplastics monitoring grants in coastal estuaries',
    grant: 'Blue Planet Research Accelerator',
    rfp: 'Methods + data sharing requirements extracted',
    application: 'Narrative draft + bibliography scaffolded',
  },
  {
    id: 'nonprofit',
    initials: 'TB',
    profile: 'Community Nonprofit',
    org: 'Turning Bridge Youth Services',
    accent: '#F59E0B',
    query: 'after school mental health program grants',
    grant: 'Youth Resilience Partnership Grants',
    rfp: 'Eligibility + budget caps mapped to profile',
    application: 'Outcomes matrix inserted into draft',
  },
  {
    id: 'tribal',
    initials: 'SK',
    profile: 'Tribal College',
    org: 'Sky River Tribal College',
    accent: '#34D399',
    query: 'indigenous STEM pathway grants for first year students',
    grant: 'Indigenous STEM Capacity Building Fund',
    rfp: 'Letters, timeline, and reviewer criteria mapped',
    application: 'Submission checklist + final package prepared',
  },
]

const STAGES = ['Discovery', 'Best Match', 'RFP Analysis', 'Application']
const STAGGER_MS = 2100
const CYCLE_MS = 12500

export default function HeroAnimationE() {
  const [progress, setProgress] = useState<number[]>(TRACKS.map(() => 0))
  const [tick, setTick] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    setProgress(TRACKS.map(() => 0))

    TRACKS.forEach((_, index) => {
      const delay = index * STAGGER_MS

      timersRef.current.push(setTimeout(() => {
        setProgress((prev) => prev.map((value, idx) => (idx === index ? 1 : value)))
      }, delay + 450))

      timersRef.current.push(setTimeout(() => {
        setProgress((prev) => prev.map((value, idx) => (idx === index ? 2 : value)))
      }, delay + 2300))

      timersRef.current.push(setTimeout(() => {
        setProgress((prev) => prev.map((value, idx) => (idx === index ? 3 : value)))
      }, delay + 4100))

      timersRef.current.push(setTimeout(() => {
        setProgress((prev) => prev.map((value, idx) => (idx === index ? 4 : value)))
      }, delay + 5900))
    })

    timersRef.current.push(setTimeout(() => setTick((prev) => prev + 1), CYCLE_MS))

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [tick])

  const activeIndex = useMemo(() => {
    const highest = Math.max(...progress)
    const idx = progress.findIndex((value) => value === highest)
    return idx === -1 ? 0 : idx
  }, [progress])

  const activeTrack = TRACKS[activeIndex]
  const activeProgress = progress[activeIndex]

  return (
    <div className="relative mx-auto w-full max-w-[560px] select-none" style={{ fontFamily: 'var(--font-body), DM Sans, system-ui, sans-serif' }}>
      <div className="absolute -inset-12 rounded-[32px] bg-gradient-to-r from-[#0B2A5B] via-[#0E3A7D] to-[#0A1D42] opacity-35 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] shadow-2xl backdrop-blur-md">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono uppercase tracking-wider text-white/28">Profile-Conditioned Pipeline</span>
            <span className="text-[8px] font-mono text-white/25">{TRACKS.length} live tracks</span>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {STAGES.map((stage) => (
              <div key={stage} className="rounded-md border border-white/[0.08] bg-white/[0.02] px-1.5 py-1 text-center">
                <span className="text-[7px] font-mono uppercase tracking-wider text-white/45">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 p-3.5">
          {TRACKS.map((track, index) => {
            const value = progress[index]
            const position = Math.max(0, Math.min(3, value - 1))
            const isComplete = value >= 4

            return (
              <div key={track.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold"
                    style={{ backgroundColor: `${track.accent}1C`, color: track.accent, border: `1px solid ${track.accent}4A` }}
                  >
                    {track.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-semibold text-white/72">{track.org}</p>
                    <p className="text-[7px] text-white/36">{track.profile}</p>
                  </div>
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-[7px] font-semibold uppercase tracking-wide"
                    style={{
                      color: isComplete ? '#34D399' : track.accent,
                      backgroundColor: isComplete ? 'rgba(52,211,153,0.13)' : `${track.accent}1A`,
                      border: `1px solid ${isComplete ? 'rgba(52,211,153,0.45)' : `${track.accent}4A`}`,
                    }}
                  >
                    {isComplete ? 'Ready to submit' : STAGES[Math.max(0, value - 1)] || 'Waiting'}
                  </span>
                </div>

                <div className="relative h-9 rounded-md border border-white/[0.06] bg-[#071226]/75 px-2">
                  <motion.div
                    className="absolute top-1.5 h-6 rounded-md border px-2 py-1"
                    style={{
                      borderColor: `${track.accent}60`,
                      backgroundColor: `${track.accent}1A`,
                      width: '36%',
                    }}
                    animate={{ left: `${position * 21.3 + 2}%` }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  >
                    <span className="block truncate text-[7px] font-semibold text-white/72">
                      {value <= 1 && track.query}
                      {value === 2 && track.grant}
                      {value === 3 && track.rfp}
                      {value >= 4 && track.application}
                    </span>
                  </motion.div>
                </div>
              </div>
            )
          })}

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[7px] font-mono uppercase tracking-wider text-white/26">Active Story</span>
              <span className="text-[7px] font-mono text-white/28">{activeTrack.profile}</span>
            </div>
            <p className="text-[8px] text-white/62">
              <span className="font-semibold text-white/72">{activeTrack.org}:</span>{' '}
              {activeProgress <= 1 && `Searching grants for: "${activeTrack.query}".`}
              {activeProgress === 2 && `Best-fit grant selected: ${activeTrack.grant}.`}
              {activeProgress === 3 && `RFP pass complete: ${activeTrack.rfp}.`}
              {activeProgress >= 4 && `Application assembled with Granted writing coach: ${activeTrack.application}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
