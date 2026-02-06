'use client'

import { useState, useEffect } from 'react'
import { useInView } from '@/hooks/useInView'

interface Requirement {
  id: string
  rfpText: string
  section: string
  status: 'covered' | 'partial' | 'missing'
}

const requirements: Requirement[] = [
  {
    id: 'r1',
    rfpText: 'Community-based research methodology',
    section: 'Project Narrative, §2.1',
    status: 'covered',
  },
  {
    id: 'r2',
    rfpText: 'Student training & mentorship plan',
    section: 'Broader Impacts, §6.2',
    status: 'covered',
  },
  {
    id: 'r3',
    rfpText: 'Data management & sovereignty framework',
    section: 'Data Management Plan, §5',
    status: 'covered',
  },
  {
    id: 'r4',
    rfpText: 'Institutional capacity building',
    section: 'Facilities & Equipment, §7',
    status: 'covered',
  },
  {
    id: 'r5',
    rfpText: 'Environmental monitoring protocols',
    section: 'Research Methods, §3.1',
    status: 'covered',
  },
  {
    id: 'r6',
    rfpText: 'Tribal IRB and ethics compliance',
    section: 'Supplementary Docs',
    status: 'partial',
  },
  {
    id: 'r7',
    rfpText: 'External evaluation plan',
    section: 'Not yet addressed',
    status: 'missing',
  },
  {
    id: 'r8',
    rfpText: 'Sustainability beyond grant period',
    section: 'Project Narrative, §2.4',
    status: 'covered',
  },
]

const statusConfig = {
  covered: { color: '#34d399', bg: 'rgba(52,211,153,0.08)', label: 'Covered', icon: '✓' },
  partial: { color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', label: 'Partial', icon: '◐' },
  missing: { color: '#F87171', bg: 'rgba(248,113,113,0.08)', label: 'Missing', icon: '—' },
}

export default function DocumentStackC() {
  const [checkedItems, setCheckedItems] = useState(0)
  const [showChart, setShowChart] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: false })

  const coveredCount = requirements.filter((r) => r.status === 'covered').length
  const partialCount = requirements.filter((r) => r.status === 'partial').length
  const totalScore = Math.round(((coveredCount + partialCount * 0.5) / requirements.length) * 100)

  useEffect(() => {
    if (!isInView) {
      setCheckedItems(0)
      setShowChart(false)
      setMounted(false)
      return
    }

    setMounted(true)
    const timers: NodeJS.Timeout[] = []

    // Stagger requirement checks
    requirements.forEach((_, i) => {
      timers.push(
        setTimeout(() => setCheckedItems(i + 1), 500 + i * 300)
      )
    })

    // Show chart after all items
    timers.push(
      setTimeout(() => setShowChart(true), 500 + requirements.length * 300 + 200)
    )

    return () => timers.forEach(clearTimeout)
  }, [isInView])

  // Radial progress SVG parameters
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const visibleScore = showChart ? totalScore : 0

  return (
    <div ref={ref} className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Main card */}
      <div
        className="absolute inset-0 rounded-2xl bg-white border border-navy/10 shadow-lg overflow-hidden flex flex-col"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="px-3 py-2.5 border-b border-navy/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[7px] h-[7px] rounded-full bg-brand-yellow" />
            <span className="text-[7.5px] font-bold text-navy tracking-wide">
              RFP COVERAGE ANALYSIS
            </span>
          </div>
          <div className="text-[6px] text-navy-light/50 font-medium">
            NSF 24-534 TCUP-TIP
          </div>
        </div>

        {/* Body — split layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left — requirements checklist */}
          <div className="flex-1 p-2.5 overflow-hidden flex flex-col">
            <div className="text-[6px] font-semibold text-navy/40 uppercase tracking-wider mb-2">
              Requirements Traced
            </div>

            <div className="flex flex-col gap-[4px] flex-1">
              {requirements.map((req, i) => {
                const isVisible = i < checkedItems
                const cfg = statusConfig[req.status]

                return (
                  <div
                    key={req.id}
                    className="flex items-start gap-1.5 rounded-lg px-1.5 py-[3px]"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-8px)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      backgroundColor: isVisible ? cfg.bg : 'transparent',
                    }}
                  >
                    {/* Status indicator */}
                    <div
                      className="w-[10px] h-[10px] rounded-full flex items-center justify-center flex-shrink-0 mt-[1px]"
                      style={{
                        backgroundColor: isVisible ? cfg.color : 'transparent',
                        border: isVisible ? 'none' : '1px solid rgba(10,22,40,0.1)',
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      {isVisible && (
                        <span className="text-[5.5px] text-white font-bold leading-none">
                          {cfg.icon}
                        </span>
                      )}
                    </div>

                    {/* Requirement text */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[5.5px] leading-tight text-navy font-medium truncate">
                        {req.rfpText}
                      </div>
                      <div className="text-[4.5px] text-navy-light/50 truncate mt-[1px]">
                        → {req.section}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right — radial chart + stats */}
          <div className="w-[38%] border-l border-navy/[0.06] p-2.5 flex flex-col items-center justify-center gap-3">
            {/* Radial progress */}
            <div className="relative">
              <svg width="76" height="76" viewBox="0 0 76 76">
                {/* Background track */}
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="none"
                  stroke="rgba(10,22,40,0.06)"
                  strokeWidth="5"
                />
                {/* Covered arc — green */}
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference - (circumference * (coveredCount / requirements.length) * (showChart ? 1 : 0))
                  }
                  style={{
                    transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '38px 38px',
                  }}
                />
                {/* Partial arc — yellow */}
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference -
                    (circumference * (partialCount / requirements.length) * (showChart ? 1 : 0))
                  }
                  style={{
                    transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                    transform: `rotate(${-90 + (coveredCount / requirements.length) * 360}deg)`,
                    transformOrigin: '38px 38px',
                  }}
                />
              </svg>
              {/* Center percentage */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-[16px] font-bold text-navy leading-none"
                  style={{
                    opacity: showChart ? 1 : 0,
                    transition: 'opacity 0.5s ease 0.5s',
                  }}
                >
                  {visibleScore}%
                </span>
                <span
                  className="text-[5px] text-navy-light/50 mt-0.5"
                  style={{
                    opacity: showChart ? 1 : 0,
                    transition: 'opacity 0.5s ease 0.7s',
                  }}
                >
                  coverage
                </span>
              </div>
            </div>

            {/* Legend */}
            <div
              className="flex flex-col gap-[4px] w-full"
              style={{
                opacity: showChart ? 1 : 0,
                transition: 'opacity 0.5s ease 0.6s',
              }}
            >
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const count = requirements.filter((r) => r.status === key).length
                return (
                  <div key={key} className="flex items-center gap-1.5">
                    <div
                      className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: cfg.color }}
                    />
                    <span className="text-[5.5px] text-navy-light flex-1">
                      {cfg.label}
                    </span>
                    <span className="text-[6px] font-bold text-navy">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Action nudge */}
            <div
              className="w-full rounded-lg px-2 py-1.5 mt-1"
              style={{
                backgroundColor: 'rgba(248,113,113,0.06)',
                border: '1px solid rgba(248,113,113,0.12)',
                opacity: showChart ? 1 : 0,
                transition: 'opacity 0.5s ease 0.9s',
              }}
            >
              <div className="text-[5px] text-red-500 font-semibold">
                1 requirement needs attention
              </div>
              <div className="text-[4.5px] text-navy-light/50 mt-[1px]">
                External evaluation plan not addressed
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-1.5 border-t border-navy/[0.06] flex items-center justify-between">
          <span className="text-[5px] text-navy-light/40">
            Mni Wiconi PFAS Monitoring &middot; Sitting Bull College
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-[5px] h-[5px] rounded-full"
              style={{
                backgroundColor: totalScore >= 80 ? '#34d399' : '#FBBF24',
              }}
            />
            <span className="text-[5.5px] font-medium text-navy/60">
              {totalScore >= 80 ? 'Strong Coverage' : 'Review Needed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
