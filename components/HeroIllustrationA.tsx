'use client'

import { useEffect, useState } from 'react'

/* ── Variant A: "The Live Draft" ──
   A realistic document editor with actual grant text appearing via typewriter animation.
   Side panel shows RFP requirements being checked off as sections materialize. */

const sections = [
  {
    header: 'Project Narrative',
    lines: [
      'WE ACT for Environmental Justice proposes a comprehensive community-driven',
      'air quality monitoring initiative targeting Northern Manhattan, where PM2.5',
      'levels exceed EPA thresholds by 23% compared to surrounding neighborhoods.',
    ],
  },
  {
    header: 'Specific Aims',
    lines: [
      'Aim 1: Deploy 40 low-cost particulate sensors across Washington Heights,',
      'Inwood, and Harlem to establish hyperlocal pollution basemaps.',
      'Aim 2: Train 120 Community Health Workers in environmental data literacy.',
    ],
  },
  {
    header: 'Budget Justification',
    lines: [
      'Personnel ($218,400): Project Director (0.6 FTE, $78K) will oversee sensor',
      'deployment, community engagement, and EPA reporting requirements.',
    ],
  },
]

const requirements = [
  'Environmental justice narrative',
  'Measurable health outcomes',
  'Community engagement plan',
  'Data management strategy',
  'Budget w/ cost principles',
  'Letters of support',
]

export default function HeroIllustrationA() {
  const [step, setStep] = useState(0)

  // 14 steps total: 0 = mount, then staggered reveals
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= 14; i++) {
      timers.push(setTimeout(() => setStep(i), i * 350))
    }
    return () => timers.forEach(clearTimeout)
  }, [])

  // Section visibility: section 0 at step 1, section 1 at step 5, section 2 at step 9
  const sectionVisible = (idx: number) => step >= idx * 4 + 1
  // Line visibility within a section
  const lineVisible = (sectionIdx: number, lineIdx: number) =>
    step >= sectionIdx * 4 + 2 + lineIdx
  // Requirement check visibility
  const reqChecked = (idx: number) => {
    // stagger checks across the animation
    const thresholds = [2, 4, 6, 8, 10, 13]
    return step >= thresholds[idx]
  }

  const fadeSlide = (visible: boolean, delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(6px)',
    transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
  })

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* ── Side panel: RFP Requirements ── */}
      <div
        className="absolute -top-3 -right-3 w-44 rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-sm p-3 z-10 hidden md:block"
        style={fadeSlide(step >= 1)}
      >
        <div className="text-[9px] font-mono text-brand-yellow/60 uppercase tracking-widest mb-2.5">
          RFP Requirements
        </div>
        <div className="space-y-1.5">
          {requirements.map((req, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5"
              style={fadeSlide(step >= 1, i * 60)}
            >
              <div
                className="mt-0.5 w-3 h-3 rounded-[3px] border flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: reqChecked(i)
                    ? 'rgba(52,211,153,0.7)'
                    : 'rgba(255,255,255,0.15)',
                  backgroundColor: reqChecked(i)
                    ? 'rgba(52,211,153,0.15)'
                    : 'transparent',
                  transition: 'all 0.35s ease',
                }}
              >
                <svg
                  width="7"
                  height="6"
                  viewBox="0 0 8 6"
                  fill="none"
                  style={{
                    opacity: reqChecked(i) ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <path
                    d="M1 3L3 5L7 1"
                    stroke="rgb(52,211,153)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className="text-[8px] leading-tight"
                style={{
                  color: reqChecked(i)
                    ? 'rgba(255,255,255,0.55)'
                    : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.3s ease',
                }}
              >
                {req}
              </span>
            </div>
          ))}
        </div>

        {/* Coverage mini-bar */}
        <div className="mt-3 pt-2 border-t border-white/[0.06]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[7px] font-mono text-white/30 uppercase tracking-wider">
              Coverage
            </span>
            <span
              className="text-[10px] font-bold text-brand-yellow tabular-nums"
              style={{
                opacity: step >= 13 ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            >
              92%
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-gold"
              style={{
                width: step >= 13 ? '92%' : '0%',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Main document editor ── */}
      <div className="relative rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] font-medium text-white/30 tracking-wide">
              EPA-EJCPS-2024-draft.md
            </span>
          </div>
          <div
            className="flex items-center gap-1"
            style={{
              opacity: step >= 2 ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-pulse" />
            <span className="text-[8px] text-emerald-400/60 font-mono">
              writing
            </span>
          </div>
        </div>

        {/* Document content area */}
        <div className="p-5 space-y-4 min-h-[300px]">
          {sections.map((section, sIdx) => (
            <div key={sIdx} style={fadeSlide(sectionVisible(sIdx))}>
              {/* Section header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-4 rounded-sm bg-brand-yellow" />
                <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                  {section.header}
                </span>
              </div>

              {/* Typed lines */}
              <div className="pl-3.5 space-y-1">
                {section.lines.map((line, lIdx) => {
                  const visible = lineVisible(sIdx, lIdx)
                  // Show cursor on the latest visible line of the latest visible section
                  const isLastVisibleLine =
                    visible &&
                    (lIdx === section.lines.length - 1 ||
                      !lineVisible(sIdx, lIdx + 1))
                  const isLatestSection =
                    sectionVisible(sIdx) &&
                    (sIdx === sections.length - 1 ||
                      !sectionVisible(sIdx + 1))

                  return (
                    <div
                      key={lIdx}
                      className="text-[9px] leading-relaxed text-white/45 font-mono"
                      style={fadeSlide(visible, 50)}
                    >
                      {visible && line}
                      {visible &&
                        isLastVisibleLine &&
                        isLatestSection &&
                        step < 14 && (
                          <span className="typewriter-cursor" />
                        )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Bottom status bar */}
          <div
            className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between"
            style={fadeSlide(step >= 12)}
          >
            <div className="flex items-center gap-3">
              <span className="text-[8px] font-mono text-white/25">
                3 sections
              </span>
              <span className="text-[8px] font-mono text-white/25">
                412 words
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    step >= 14
                      ? 'rgba(52,211,153,0.7)'
                      : 'rgba(245,207,73,0.5)',
                  transition: 'background-color 0.3s ease',
                }}
              />
              <span className="text-[8px] font-mono text-white/30">
                {step >= 14 ? 'Draft complete' : 'Generating...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
