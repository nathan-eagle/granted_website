'use client'

import { useState, useEffect } from 'react'

interface FormatCard {
  type: 'DOCX' | 'PDF' | 'EDITOR'
  label: string
  color: string
  bgTint: string
  heading: string
  lines: string[]
  rotation: number
  offsetX: number
  offsetY: number
}

const formats: FormatCard[] = [
  {
    type: 'DOCX',
    label: 'Word Document',
    color: '#2B5797',
    bgTint: 'rgba(43,87,151,0.04)',
    heading: 'Budget Justification',
    lines: [
      'Personnel: PI (Dr. A. Crow Feather), 3 mo. summer',
      'salary at $9,420/mo = $28,260. Two graduate RAs at',
      '$24,000/yr each for field sampling and LC-MS/MS',
      'analysis. Tribal elder consultants (6) at $200/day',
      'for 15 days each = $18,000 total honoraria.',
    ],
    rotation: -4,
    offsetX: -6,
    offsetY: 8,
  },
  {
    type: 'PDF',
    label: 'PDF Export',
    color: '#D4342A',
    bgTint: 'rgba(212,52,42,0.03)',
    heading: 'Data Management Plan',
    lines: [
      'All environmental monitoring data will be stored in',
      'a tribally-governed repository at Sitting Bull College.',
      'Data access follows CARE Principles for Indigenous',
      'Data Governance. External researchers must obtain',
      'tribal IRB approval before accessing raw datasets.',
    ],
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
  },
  {
    type: 'EDITOR',
    label: 'Inline Editor',
    color: '#F5CF49',
    bgTint: 'rgba(245,207,73,0.04)',
    heading: 'Broader Impacts',
    lines: [
      'This project directly serves the Standing Rock Sioux',
      'community by training 24 tribal students in analytical',
      'chemistry and field methods. Community water quality',
      'reports will be published in Lakota and English.',
      'Results inform tribal environmental policy decisions.',
    ],
    rotation: 3,
    offsetX: 6,
    offsetY: 4,
  },
]

export default function DocumentStackB() {
  const [revealedCards, setRevealedCards] = useState(0)
  const [fanned, setFanned] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timers: NodeJS.Timeout[] = []

    // Reveal cards one by one (stacked)
    timers.push(setTimeout(() => setRevealedCards(1), 400))
    timers.push(setTimeout(() => setRevealedCards(2), 800))
    timers.push(setTimeout(() => setRevealedCards(3), 1200))

    // Fan them out
    timers.push(setTimeout(() => setFanned(true), 1800))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square flex items-center justify-center">
      {/* Title badge */}
      <div
        className="absolute top-2 left-1/2 z-20"
        style={{
          transform: 'translateX(-50%)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.5s ease 0.3s',
        }}
      >
        <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-navy/[0.08]">
          <div className="w-[6px] h-[6px] rounded-full bg-brand-yellow" />
          <span className="text-[7px] font-semibold text-navy tracking-wide">
            EXPORT FORMATS
          </span>
        </div>
      </div>

      {/* Cards container */}
      <div className="relative w-[75%] h-[72%]">
        {formats.map((fmt, i) => {
          const isRevealed = i < revealedCards
          const zIndex = fanned ? (i === 1 ? 12 : 10) : 10 + i

          // Fan-out transforms
          const stackedTransform = `rotate(0deg) translate(0, 0) scale(${1 - i * 0.02})`
          const fannedTransform = `rotate(${fmt.rotation}deg) translate(${fmt.offsetX}px, ${fmt.offsetY}px)`

          return (
            <div
              key={fmt.type}
              className="absolute inset-0 rounded-2xl bg-white border border-navy/10 shadow-lg overflow-hidden flex flex-col"
              style={{
                zIndex,
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? (fanned ? fannedTransform : stackedTransform) : 'scale(0.92) translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                background: `linear-gradient(135deg, white 0%, ${fmt.bgTint} 100%)`,
              }}
            >
              {/* Header bar */}
              <div
                className="flex items-center gap-2 px-3 py-2 border-b border-navy/[0.06]"
                style={{ backgroundColor: `${fmt.color}08` }}
              >
                {/* File type icon */}
                <div
                  className="w-[18px] h-[22px] rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: fmt.color }}
                >
                  <span className="text-[5.5px] font-bold text-white leading-none">
                    {fmt.type === 'EDITOR' ? 'ED' : fmt.type.slice(0, 3)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[7px] font-semibold text-navy truncate">
                    {fmt.label}
                  </div>
                  <div className="text-[5.5px] text-navy-light/60">
                    Mni_Wiconi_PFAS_Proposal.{fmt.type === 'EDITOR' ? 'draft' : fmt.type.toLowerCase()}
                  </div>
                </div>
                {/* Status dot */}
                <div className="flex items-center gap-1">
                  <div className="w-[5px] h-[5px] rounded-full bg-emerald-400" />
                  <span className="text-[5px] text-emerald-600 font-medium">Ready</span>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1 p-3 flex flex-col">
                {/* Section heading */}
                <div className="text-[8px] font-bold text-navy mb-1.5">
                  {fmt.heading}
                </div>

                {/* Decorative gold rule */}
                <div
                  className="h-[1.5px] w-12 rounded-full mb-2"
                  style={{
                    background: 'linear-gradient(90deg, #F5CF49, transparent)',
                  }}
                />

                {/* Body lines */}
                {fmt.lines.map((line, li) => (
                  <div
                    key={li}
                    className="text-[6px] leading-[1.7] text-navy-light"
                    style={{
                      opacity: fanned ? 1 : (isRevealed ? 0.4 : 0),
                      transition: 'opacity 0.4s ease',
                      transitionDelay: fanned ? `${li * 60}ms` : '0ms',
                    }}
                  >
                    {line}
                  </div>
                ))}

                {/* Editor-specific UI extras */}
                {fmt.type === 'EDITOR' && fanned && (
                  <div className="mt-auto flex items-center gap-2 pt-2 border-t border-navy/[0.04]">
                    <div className="flex gap-[3px]">
                      {['B', 'I', 'U'].map((btn) => (
                        <div
                          key={btn}
                          className="w-[14px] h-[12px] rounded-sm bg-navy/[0.05] flex items-center justify-center"
                        >
                          <span className="text-[5px] font-bold text-navy/40">
                            {btn}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="h-[8px] w-[1px] bg-navy/[0.08]" />
                    <div className="text-[5px] text-navy-light/50">
                      Section 6 of 8
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-3 py-1.5 border-t border-navy/[0.06] flex items-center justify-between">
                <span className="text-[5px] text-navy-light/40">
                  NSF TCUP-TIP &middot; FY2025
                </span>
                <span className="text-[5px] text-navy-light/40">
                  Sitting Bull College
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom file count indicator */}
      <div
        className="absolute bottom-3 left-1/2 z-20"
        style={{
          transform: 'translateX(-50%)',
          opacity: fanned ? 1 : 0,
          transition: 'opacity 0.5s ease 0.3s',
        }}
      >
        <div className="flex items-center gap-3">
          {formats.map((fmt, i) => (
            <div key={fmt.type} className="flex items-center gap-1">
              <div
                className="w-[6px] h-[6px] rounded-sm"
                style={{ backgroundColor: fmt.color }}
              />
              <span className="text-[6px] font-medium text-navy/50">
                {fmt.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
