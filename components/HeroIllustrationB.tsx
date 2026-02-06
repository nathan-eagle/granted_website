'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'

/* ── Variant B: "The Split Screen" ──
   Left pane = uploaded RFP with highlighted requirements.
   Right pane = draft being generated section-by-section.
   Animated connection lines link RFP requirements to draft sections.
   Floating coverage badge. */

const rfpRequirements = [
  { label: 'Environmental justice narrative', color: '#F5CF49' },
  { label: 'Measurable health outcomes', color: '#34D399' },
  { label: 'Community engagement plan', color: '#60A5FA' },
  { label: 'Budget w/ cost principles', color: '#F472B6' },
]

const draftSections = [
  {
    header: 'Project Narrative',
    text: 'Northern Manhattan communities face disproportionate exposure to diesel exhaust and industrial emissions, with asthma hospitalization rates 3x the citywide average.',
    reqIdx: 0,
  },
  {
    header: 'Expected Outcomes',
    text: 'We will reduce PM2.5 exposure by 15% in target census tracts and decrease pediatric asthma ER visits by 20% within 24 months of deployment.',
    reqIdx: 1,
  },
  {
    header: 'Community Engagement',
    text: 'Our Community Health Worker network of 120 trained residents will conduct door-to-door outreach in 14 NYCHA housing developments across the project area.',
    reqIdx: 2,
  },
  {
    header: 'Budget Justification',
    text: 'Personnel ($218,400) includes a Project Director at 0.6 FTE and two Community Coordinators. Equipment ($45,000) covers 40 PurpleAir sensors.',
    reqIdx: 3,
  },
]

export default function HeroIllustrationB() {
  const [step, setStep] = useState(0)
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: false })

  useEffect(() => {
    if (!isInView) {
      setStep(0)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= 12; i++) {
      timers.push(setTimeout(() => setStep(i), i * 400))
    }
    return () => timers.forEach(clearTimeout)
  }, [isInView])

  const fade = (visible: boolean, delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(5px)',
    transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
  })

  // RFP requirement highlights appear at steps 1-4
  const reqVisible = (idx: number) => step >= idx + 1
  // Draft sections appear at steps 3, 5, 7, 9
  const draftVisible = (idx: number) => step >= idx * 2 + 3
  // Connection lines appear one step after the draft section
  const lineVisible = (idx: number) => step >= idx * 2 + 4

  // Coverage percentage animates based on how many drafts are visible
  const visibleDrafts = draftSections.filter((_, i) => draftVisible(i)).length
  const coveragePct = Math.min(Math.round((visibleDrafts / draftSections.length) * 96), 96)

  return (
    <div ref={ref} className="relative w-full max-w-lg mx-auto">
      {/* ── Floating coverage badge ── */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.08] backdrop-blur-sm"
        style={{
          opacity: step >= 4 ? 1 : 0,
          transform: step >= 4 ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)',
          transition: 'all 0.5s ease',
        }}
      >
        <div className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
        <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">
          RFP Coverage
        </span>
        <span className="text-sm font-bold text-brand-yellow tabular-nums">
          {coveragePct}%
        </span>
      </div>

      {/* ── Main split card ── */}
      <div className="relative rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <div className="flex-1 flex justify-center gap-4">
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">
              RFP Source
            </span>
            <span className="text-[9px] text-white/10">|</span>
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">
              Draft Output
            </span>
          </div>
        </div>

        {/* Split content */}
        <div className="flex min-h-[310px]">
          {/* ── LEFT: RFP pane ── */}
          <div className="w-[45%] p-4 border-r border-white/[0.06]">
            <div
              className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-3"
              style={fade(step >= 1)}
            >
              EPA-EJCPS-FY24.pdf
            </div>

            {/* Faux document lines + highlighted requirements */}
            <div className="space-y-3">
              {rfpRequirements.map((req, i) => (
                <div key={i} style={fade(reqVisible(i), 80)}>
                  {/* Fake preceding text lines */}
                  <div className="space-y-1 mb-1.5">
                    <div className="h-[3px] w-full rounded bg-white/[0.06]" />
                    <div className="h-[3px] w-4/5 rounded bg-white/[0.06]" />
                  </div>
                  {/* Highlighted requirement */}
                  <div
                    className="relative px-2 py-1 rounded"
                    style={{
                      backgroundColor: reqVisible(i)
                        ? `${req.color}12`
                        : 'transparent',
                      borderLeft: reqVisible(i)
                        ? `2px solid ${req.color}`
                        : '2px solid transparent',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <span
                      className="text-[8px] leading-snug font-medium"
                      style={{ color: `${req.color}CC` }}
                    >
                      {req.label}
                    </span>
                    {/* Connection dot (left anchor) */}
                    {lineVisible(i) && (
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: req.color,
                          opacity: 0.6,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divider with animated connection traces ── */}
          <div className="relative w-0">
            {rfpRequirements.map((req, i) => (
              <svg
                key={i}
                className="absolute left-0 pointer-events-none"
                width="20"
                height="100%"
                style={{
                  top: 0,
                  opacity: lineVisible(i) ? 0.4 : 0,
                  transition: 'opacity 0.6s ease',
                  overflow: 'visible',
                }}
              >
                <line
                  x1="-2"
                  y1={`${18 + i * 22}%`}
                  x2="2"
                  y2={`${15 + i * 23}%`}
                  stroke={req.color}
                  strokeWidth="1"
                  strokeDasharray="3 2"
                />
              </svg>
            ))}
          </div>

          {/* ── RIGHT: Draft pane ── */}
          <div className="w-[55%] p-4">
            <div
              className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-3"
              style={fade(step >= 2)}
            >
              Generated Draft
            </div>

            <div className="space-y-3">
              {draftSections.map((section, i) => {
                const reqColor = rfpRequirements[section.reqIdx].color
                return (
                  <div key={i} style={fade(draftVisible(i))}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div
                        className="w-1 h-3 rounded-sm"
                        style={{ backgroundColor: reqColor }}
                      />
                      <span className="text-[9px] font-semibold text-white/65 uppercase tracking-wider">
                        {section.header}
                      </span>
                    </div>
                    <p className="text-[8px] leading-relaxed text-white/40 font-mono pl-2.5">
                      {section.text}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Grounding indicator */}
            <div
              className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2"
              style={fade(step >= 11)}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="none"
                className="text-emerald-400/60"
              >
                <path
                  d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-[8px] font-mono text-emerald-400/50">
                All sections grounded to RFP requirements
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar with coverage */}
        <div
          className="px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.02]"
          style={fade(step >= 10)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-mono text-white/25 uppercase tracking-wider">
              Requirement Coverage
            </span>
            <span className="text-[10px] font-bold text-brand-yellow tabular-nums">
              {coveragePct}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-gold"
              style={{
                width: `${coveragePct}%`,
                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
