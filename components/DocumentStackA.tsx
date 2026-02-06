'use client'

import { useState, useEffect } from 'react'

const sections = [
  { id: 'narrative', label: 'Project Narrative', page: '1–12' },
  { id: 'aims', label: 'Specific Aims', page: '13–15' },
  { id: 'methods', label: 'Research Methods', page: '16–24' },
  { id: 'budget', label: 'Budget Justification', page: '25–28' },
  { id: 'data', label: 'Data Management Plan', page: '29–31' },
  { id: 'broader', label: 'Broader Impacts', page: '32–35' },
  { id: 'facilities', label: 'Facilities & Equipment', page: '36–37' },
  { id: 'references', label: 'References Cited', page: '38–42' },
]

const bodySnippets = [
  {
    heading: 'Project Narrative',
    lines: [
      'The Mni Wiconi Water Research Lab proposes a',
      'community-based PFAS monitoring program across',
      'twelve Missouri River tributaries on the Standing',
      'Rock Sioux Reservation. This three-year study will',
      'establish baseline contamination data using tribal',
      'environmental knowledge alongside EPA Method 533.',
    ],
  },
  {
    heading: 'Specific Aims',
    lines: [
      'Aim 1: Quantify PFAS concentrations at 48 surface',
      'water sites using LC-MS/MS analysis quarterly.',
      'Aim 2: Train 24 tribal college students in field',
      'sampling protocols and analytical chemistry.',
      'Aim 3: Develop an Indigenous data sovereignty',
      'framework for environmental monitoring data.',
    ],
  },
  {
    heading: 'Research Methods',
    lines: [
      'Water samples will be collected following modified',
      'EPA Method 533 protocols adapted for field use.',
      'Community elders will identify historically significant',
      'waterways for priority sampling. All data will be',
      'governed under the CARE Principles for Indigenous',
      'Data Governance (Collective, Authority, Responsibility).',
    ],
  },
]

export default function DocumentStackA() {
  const [checkedCount, setCheckedCount] = useState(0)
  const [activeSnippet, setActiveSnippet] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timers: NodeJS.Timeout[] = []

    // Stagger checkmarks
    sections.forEach((_, i) => {
      timers.push(
        setTimeout(() => setCheckedCount(i + 1), 600 + i * 350)
      )
    })

    // Cycle body snippets
    timers.push(setTimeout(() => setActiveSnippet(1), 2200))
    timers.push(setTimeout(() => setActiveSnippet(2), 3800))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Shadow card behind */}
      <div
        className="absolute inset-0 rounded-2xl bg-navy/[0.03] border border-navy/[0.06]"
        style={{
          transform: 'translate(8px, 8px) rotate(1.5deg)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          ...(mounted ? {} : { transform: 'translate(8px, 8px) rotate(1.5deg) scale(0.96)', opacity: 0 }),
        }}
      />

      {/* Main document card */}
      <div
        className="relative rounded-2xl bg-white border border-navy/10 shadow-lg overflow-hidden flex h-full"
        style={{
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        {/* Left sidebar — TOC */}
        <div className="w-[38%] border-r border-navy/[0.08] bg-cream-dark/40 p-3 flex flex-col">
          {/* Document title */}
          <div className="mb-3 pb-2 border-b border-navy/[0.08]">
            <div className="text-[7px] font-bold text-navy tracking-wide uppercase">
              NSF TCUP-TIP
            </div>
            <div className="text-[6.5px] text-navy-light mt-0.5 leading-tight">
              Mni Wiconi PFAS<br />Monitoring Program
            </div>
          </div>

          {/* Section list */}
          <div className="flex flex-col gap-[5px] flex-1">
            {sections.map((s, i) => {
              const isChecked = i < checkedCount
              return (
                <div
                  key={s.id}
                  className="flex items-start gap-1.5 group"
                  style={{
                    transition: 'opacity 0.3s ease',
                    opacity: mounted ? 1 : 0,
                    transitionDelay: `${200 + i * 80}ms`,
                  }}
                >
                  {/* Checkmark circle */}
                  <div
                    className="w-[12px] h-[12px] rounded-full flex items-center justify-center flex-shrink-0 mt-[1px]"
                    style={{
                      backgroundColor: isChecked ? '#34d399' : 'transparent',
                      border: isChecked ? 'none' : '1.5px solid rgba(10,22,40,0.15)',
                      transition: 'background-color 0.3s ease, border 0.3s ease',
                    }}
                  >
                    {isChecked && (
                      <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6L5 8.5L9.5 3.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[6px] leading-tight truncate"
                      style={{
                        color: isChecked ? '#0A1628' : '#1A2B4A',
                        fontWeight: isChecked ? 600 : 400,
                        transition: 'color 0.3s, font-weight 0.3s',
                      }}
                    >
                      {s.label}
                    </div>
                    <div className="text-[5px] text-navy-light/60">
                      p. {s.page}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Completion bar at bottom */}
          <div className="mt-2 pt-2 border-t border-navy/[0.08]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[5.5px] text-navy-light font-medium">Complete</span>
              <span className="text-[6px] font-bold" style={{ color: '#34d399' }}>
                {Math.round((checkedCount / sections.length) * 100)}%
              </span>
            </div>
            <div className="h-[4px] w-full rounded-full bg-navy/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(checkedCount / sections.length) * 100}%`,
                  backgroundColor: '#34d399',
                  transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right content — document body */}
        <div className="flex-1 p-3 flex flex-col overflow-hidden">
          {/* Top bar — fake toolbar */}
          <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-navy/[0.06]">
            <div className="w-[6px] h-[6px] rounded-full bg-brand-yellow" />
            <div className="text-[6px] font-semibold text-navy">Draft v3.2</div>
            <div className="ml-auto flex gap-1">
              <div className="w-[14px] h-[6px] rounded-sm bg-navy/[0.06]" />
              <div className="w-[14px] h-[6px] rounded-sm bg-navy/[0.06]" />
            </div>
          </div>

          {/* Body text content — animated snippets */}
          <div className="flex-1 relative">
            {bodySnippets.map((snippet, si) => (
              <div
                key={si}
                className="absolute inset-0 flex flex-col"
                style={{
                  opacity: activeSnippet === si ? 1 : 0,
                  transform: activeSnippet === si ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  pointerEvents: activeSnippet === si ? 'auto' : 'none',
                }}
              >
                <div className="text-[7.5px] font-bold text-navy mb-2">
                  {snippet.heading}
                </div>
                {snippet.lines.map((line, li) => (
                  <div
                    key={li}
                    className="text-[6px] leading-[1.7] text-navy-light"
                    style={{
                      opacity: activeSnippet === si ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      transitionDelay: activeSnippet === si ? `${li * 80}ms` : '0ms',
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Page indicator at bottom */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy/[0.06]">
            <div className="text-[5px] text-navy-light/50">
              42 pages &middot; 11,847 words
            </div>
            <div className="flex gap-[2px]">
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  className="w-[4px] h-[4px] rounded-full"
                  style={{
                    backgroundColor: activeSnippet === d ? '#F5CF49' : 'rgba(10,22,40,0.1)',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
