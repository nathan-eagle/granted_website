'use client'

import { useEffect, useState } from 'react'

/* ── Animated proposal builder that shows text appearing line by line ── */
export default function HeroIllustration() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1400),
      setTimeout(() => setStep(4), 1900),
      setTimeout(() => setStep(5), 2400),
      setTimeout(() => setStep(6), 2900),
      setTimeout(() => setStep(7), 3400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const lineStyle = (i: number) => ({
    opacity: step >= i ? 1 : 0,
    transform: step >= i ? 'translateX(0)' : 'translateX(-8px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  })

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Floating RFP document behind */}
      <div
        className="absolute -top-4 -right-4 w-48 h-56 rounded-xl border border-brand-yellow/15 bg-navy-light/60 p-4 rotate-3 hidden md:block"
        style={{
          opacity: step >= 1 ? 0.7 : 0,
          transition: 'opacity 0.8s ease 0.2s',
        }}
      >
        <div className="text-[8px] font-mono text-brand-yellow/40 uppercase tracking-wider mb-2">RFP uploaded</div>
        <div className="space-y-1.5">
          <div className="h-1 w-full rounded-full bg-white/10" />
          <div className="h-1 w-3/4 rounded-full bg-white/10" />
          <div className="h-1 w-full rounded-full bg-white/10" />
          <div className="h-1 w-5/6 rounded-full bg-white/10" />
          <div className="h-1 w-2/3 rounded-full bg-white/10" />
        </div>
        <div className="mt-3 text-[8px] font-mono text-brand-yellow/40 uppercase tracking-wider mb-1">Requirements found</div>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-emerald-400/40" />
            <div className="h-1 w-16 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-emerald-400/40" />
            <div className="h-1 w-12 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-white/10" />
            <div className="h-1 w-14 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Main proposal card */}
      <div className="relative rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] font-medium text-white/30 tracking-wide">proposal-draft.md</span>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-4 min-h-[280px]">
          {/* Section: Project Narrative */}
          <div style={lineStyle(1)}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 rounded-sm bg-brand-yellow" />
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Project Narrative</span>
            </div>
            <div className="pl-3.5 space-y-1.5">
              <div className="h-[5px] w-full rounded bg-white/12" />
              <div className="h-[5px] w-11/12 rounded bg-white/12" />
              <div className="h-[5px] w-4/5 rounded bg-white/12" />
            </div>
          </div>

          {/* Section: Specific Aims */}
          <div style={lineStyle(3)}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 rounded-sm bg-brand-yellow" />
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Specific Aims</span>
            </div>
            <div className="pl-3.5 space-y-1.5">
              <div className="h-[5px] w-full rounded bg-white/12" />
              <div className="h-[5px] w-10/12 rounded bg-white/12" />
              <div className="h-[5px] w-3/4 rounded bg-white/12" />
            </div>
          </div>

          {/* Section: Budget Justification */}
          <div style={lineStyle(5)}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 rounded-sm bg-brand-yellow" />
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Budget Justification</span>
            </div>
            <div className="pl-3.5 space-y-1.5">
              <div className="h-[5px] w-full rounded bg-white/12" />
              <div className="h-[5px] w-5/6 rounded bg-white/12" />
            </div>
          </div>

          {/* Coverage tracker */}
          <div
            className="mt-4 pt-4 border-t border-white/10"
            style={lineStyle(6)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">RFP Coverage</span>
              <span
                className="text-sm font-bold text-brand-yellow tabular-nums"
                style={{
                  opacity: step >= 7 ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              >
                94%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-gold"
                style={{
                  width: step >= 7 ? '94%' : '0%',
                  transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
