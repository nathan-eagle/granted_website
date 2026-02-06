'use client'

import { useState, useEffect } from 'react'
import { useInView } from '@/hooks/useInView'

interface ProposalSection {
  title: string
  preview: string
  status: 'empty' | 'filling' | 'complete'
}

const sections: ProposalSection[] = [
  {
    title: 'Specific Aims',
    preview:
      'We propose to develop multi-frequency acoustic arrays capable of resolving sub-30cm marine debris aggregations...',
    status: 'empty',
  },
  {
    title: 'Research Strategy',
    preview:
      'Paired ROV validation dives across three Puget Sound transects will establish detection sensitivity baselines...',
    status: 'empty',
  },
  {
    title: 'Broader Impacts',
    preview:
      'Open-source firmware for NOAA monitoring vessels and training partnerships with tribal fisheries staff...',
    status: 'empty',
  },
  {
    title: 'Data Management',
    preview:
      'All acoustic datasets archived via NOAA NCEI with CC-BY licensing. Firmware hosted on GitHub under MIT...',
    status: 'empty',
  },
]

const coachMessages = [
  'What debris sizes can current sonar detect?',
  'How will you validate field accuracy?',
  'Who benefits outside your lab?',
  'Where will data be archived?',
]

export default function CoachConversationC() {
  const [sectionStates, setSectionStates] = useState<ProposalSection['status'][]>(
    sections.map(() => 'empty')
  )
  const [activeCoachMsg, setActiveCoachMsg] = useState(-1)
  const [showCoach, setShowCoach] = useState(false)
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: false })

  useEffect(() => {
    if (!isInView) {
      setSectionStates(sections.map(() => 'empty'))
      setActiveCoachMsg(-1)
      setShowCoach(false)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    // Show coach sidebar after a brief pause
    timers.push(
      setTimeout(() => {
        setShowCoach(true)
      }, 400)
    )

    sections.forEach((_, i) => {
      // Coach asks question
      timers.push(
        setTimeout(() => {
          setActiveCoachMsg(i)
        }, 900 + i * 1100)
      )

      // Section starts filling
      timers.push(
        setTimeout(() => {
          setSectionStates((prev) => {
            const next = [...prev]
            next[i] = 'filling'
            return next
          })
        }, 900 + i * 1100 + 400)
      )

      // Section completes
      timers.push(
        setTimeout(() => {
          setSectionStates((prev) => {
            const next = [...prev]
            next[i] = 'complete'
            return next
          })
        }, 900 + i * 1100 + 800)
      )
    })

    return () => timers.forEach(clearTimeout)
  }, [isInView])

  const completedCount = sectionStates.filter((s) => s === 'complete').length
  const progress = Math.round((completedCount / sections.length) * 100)

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-white border border-navy/10 shadow-lg overflow-hidden">
        {/* Header bar */}
        <div className="px-5 py-3 border-b border-navy/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-amber-400/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
          </div>
          <p className="text-[11px] font-medium text-navy/40">
            NSF_CAREER_Draft.granted
          </p>
          <span className="text-[11px] font-bold text-brand-gold tabular-nums">
            {progress}%
          </span>
        </div>

        <div className="flex min-h-[300px]">
          {/* Proposal outline - left side */}
          <div className="flex-1 p-4 flex flex-col gap-2.5">
            {sections.map((section, i) => {
              const state = sectionStates[i]
              return (
                <div
                  key={i}
                  className="rounded-lg border px-3 py-2.5 transition-all duration-500"
                  style={{
                    borderColor:
                      state === 'complete'
                        ? 'rgba(242, 200, 51, 0.35)'
                        : state === 'filling'
                          ? 'rgba(242, 200, 51, 0.2)'
                          : 'rgba(10, 22, 40, 0.06)',
                    background:
                      state === 'complete'
                        ? 'rgba(245, 207, 73, 0.06)'
                        : state === 'filling'
                          ? 'rgba(245, 207, 73, 0.03)'
                          : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {state === 'complete' ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B7A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : state === 'filling' ? (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-brand-yellow"
                        style={{
                          animation: 'subtlePulse 0.8s ease-in-out infinite',
                        }}
                      />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-navy/15" />
                    )}
                    <span
                      className="text-[12px] font-semibold transition-colors duration-300"
                      style={{
                        color:
                          state === 'complete'
                            ? '#0A1628'
                            : state === 'filling'
                              ? '#0A1628'
                              : 'rgba(10, 22, 40, 0.3)',
                      }}
                    >
                      {section.title}
                    </span>
                  </div>

                  {/* Content preview or placeholder */}
                  {state === 'empty' ? (
                    <div className="flex flex-col gap-1 ml-[20px]">
                      <div className="h-1.5 w-full rounded bg-navy/[0.04]" />
                      <div className="h-1.5 w-3/4 rounded bg-navy/[0.04]" />
                    </div>
                  ) : (
                    <p
                      className="text-[11px] leading-relaxed ml-[20px] transition-all duration-500"
                      style={{
                        color:
                          state === 'complete'
                            ? 'rgba(10, 22, 40, 0.6)'
                            : 'rgba(10, 22, 40, 0.35)',
                        opacity: state === 'filling' ? 0.6 : 1,
                      }}
                    >
                      {section.preview}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Coach sidebar - right side */}
          <div
            className="w-[140px] border-l border-navy/[0.06] bg-navy/[0.015] p-3 flex flex-col gap-2 transition-all duration-500"
            style={{
              opacity: showCoach ? 1 : 0,
              transform: showCoach ? 'translateX(0)' : 'translateX(8px)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-brand-yellow to-brand-gold flex items-center justify-center">
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-navy/50 uppercase tracking-wider">
                Coach
              </span>
            </div>

            {coachMessages.map((msg, i) => (
              <div
                key={i}
                className="rounded-lg px-2.5 py-2 text-[10px] leading-snug transition-all duration-400 border"
                style={{
                  opacity: i <= activeCoachMsg ? 1 : 0.25,
                  borderColor:
                    i === activeCoachMsg
                      ? 'rgba(242, 200, 51, 0.3)'
                      : i < activeCoachMsg
                        ? 'rgba(10, 22, 40, 0.06)'
                        : 'transparent',
                  background:
                    i === activeCoachMsg
                      ? 'rgba(245, 207, 73, 0.08)'
                      : 'transparent',
                  color:
                    i === activeCoachMsg
                      ? '#0A1628'
                      : i < activeCoachMsg
                        ? 'rgba(10, 22, 40, 0.45)'
                        : 'rgba(10, 22, 40, 0.25)',
                  transform:
                    i <= activeCoachMsg
                      ? 'translateY(0)'
                      : 'translateY(4px)',
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="px-4 py-2.5 border-t border-navy/[0.06]">
          <div className="h-1.5 w-full rounded-full bg-navy/[0.04] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #F5CF49, #f2c833)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
