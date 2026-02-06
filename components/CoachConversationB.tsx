'use client'

import { useState, useEffect } from 'react'

interface Requirement {
  id: string
  label: string
  question: string
  status: 'pending' | 'active' | 'complete'
}

const requirements: Requirement[] = [
  {
    id: 'gap',
    label: 'Research Gap',
    question: 'What monitoring limitation does your acoustic approach overcome?',
    status: 'pending',
  },
  {
    id: 'method',
    label: 'Methodology',
    question: 'Describe your multi-frequency array design and field validation plan.',
    status: 'pending',
  },
  {
    id: 'impact',
    label: 'Broader Impacts',
    question: 'How does this reach beyond your lab to communities and practitioners?',
    status: 'pending',
  },
  {
    id: 'timeline',
    label: 'Timeline & Milestones',
    question: 'What are your Year 1 deliverables and go/no-go criteria?',
    status: 'pending',
  },
  {
    id: 'data',
    label: 'Data Management',
    question: 'Where will acoustic datasets and firmware be archived for reuse?',
    status: 'pending',
  },
]

export default function CoachConversationB() {
  const [reqStates, setReqStates] = useState<Requirement['status'][]>(
    requirements.map(() => 'pending')
  )
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)
  const [coverage, setCoverage] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let completedCount = 0

    requirements.forEach((req, i) => {
      // Activate requirement
      timers.push(
        setTimeout(() => {
          setReqStates((prev) => {
            const next = [...prev]
            next[i] = 'active'
            return next
          })
          setActiveQuestion(req.question)
        }, 800 + i * 1000)
      )

      // Complete requirement
      timers.push(
        setTimeout(() => {
          completedCount++
          setReqStates((prev) => {
            const next = [...prev]
            next[i] = 'complete'
            return next
          })
          setCoverage(Math.round((completedCount / requirements.length) * 100))
          if (i === requirements.length - 1) {
            setActiveQuestion(null)
          }
        }, 800 + i * 1000 + 600)
      )
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  const completedCount = reqStates.filter((s) => s === 'complete').length

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-white border border-navy/10 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-navy/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-yellow to-brand-gold flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy leading-tight">Requirement Mapper</p>
              <p className="text-[11px] text-navy-light/60 leading-tight">NSF CAREER - NOAA Marine Debris</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-brand-gold tabular-nums">
            {completedCount}/{requirements.length}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {/* Requirement tags */}
          <div className="flex flex-wrap gap-2">
            {requirements.map((req, i) => {
              const state = reqStates[i]
              return (
                <div
                  key={req.id}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-400 border"
                  style={{
                    background:
                      state === 'complete'
                        ? 'rgba(245, 207, 73, 0.12)'
                        : state === 'active'
                          ? 'rgba(245, 207, 73, 0.06)'
                          : 'rgba(10, 22, 40, 0.02)',
                    borderColor:
                      state === 'complete'
                        ? 'rgba(242, 200, 51, 0.4)'
                        : state === 'active'
                          ? 'rgba(242, 200, 51, 0.3)'
                          : 'rgba(10, 22, 40, 0.08)',
                    color:
                      state === 'complete'
                        ? '#8B7A1A'
                        : state === 'active'
                          ? '#0A1628'
                          : 'rgba(10, 22, 40, 0.4)',
                  }}
                >
                  {state === 'complete' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B7A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : state === 'active' ? (
                    <span
                      className="w-2 h-2 rounded-full bg-brand-yellow"
                      style={{
                        animation: 'subtlePulse 1.2s ease-in-out infinite',
                      }}
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-navy/15" />
                  )}
                  {req.label}
                </div>
              )
            })}
          </div>

          {/* Active question panel */}
          <div
            className="rounded-xl border border-navy/5 bg-navy/[0.02] px-4 py-3 min-h-[64px] flex items-start gap-2.5 transition-all duration-300"
            style={{
              opacity: activeQuestion ? 1 : 0.4,
            }}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-yellow to-brand-gold flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="text-[13px] text-navy/80 leading-snug flex-1">
              {activeQuestion || (
                <span className="text-navy/40 italic">All requirements addressed</span>
              )}
            </p>
          </div>

          {/* Coverage bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-medium text-navy/50 uppercase tracking-wider">
                RFP Coverage
              </span>
              <span className="font-bold text-brand-gold tabular-nums">{coverage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-navy/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${coverage}%`,
                  background: 'linear-gradient(90deg, #F5CF49, #f2c833)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
