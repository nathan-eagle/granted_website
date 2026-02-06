'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'
import CheckoutButton from '@/components/CheckoutButton'

/* ── Types ── */
type GrantType =
  | 'federal_research'
  | 'sbir_phase_i'
  | 'sbir_phase_ii'
  | 'foundation'
  | 'state_local'
  | 'community_dev'

type ProposalSize = 'small' | 'medium' | 'large' | 'complex'
type Complexity = 'standard' | 'technical' | 'collaborative'
type Timeline = 'standard' | 'expedited' | 'rush'

/* ── Lookup tables ── */
const GRANT_LABELS: Record<GrantType, string> = {
  federal_research: 'Federal Research',
  sbir_phase_i: 'SBIR Phase I',
  sbir_phase_ii: 'SBIR Phase II',
  foundation: 'Foundation',
  state_local: 'State / Local',
  community_dev: 'Community Development',
}

const SIZE_LABELS: Record<ProposalSize, string> = {
  small: 'Small (5\u201310 pages)',
  medium: 'Medium (15\u201325 pages)',
  large: 'Large (30\u201350 pages)',
  complex: 'Complex (50+ pages)',
}

const COMPLEXITY_LABELS: Record<Complexity, string> = {
  standard: 'Standard',
  technical: 'Technical / Scientific',
  collaborative: 'Multi-partner / Collaborative',
}

const TIMELINE_LABELS: Record<Timeline, string> = {
  standard: 'Standard (6\u20138 weeks)',
  expedited: 'Expedited (3\u20134 weeks)',
  rush: 'Rush (1\u20132 weeks)',
}

/* ── Cost calculation constants ── */
const HOURLY_RATE: Record<Complexity, [number, number]> = {
  standard: [75, 120],
  technical: [100, 150],
  collaborative: [90, 140],
}

const HOURS: Record<ProposalSize, [number, number]> = {
  small: [30, 50],
  medium: [60, 100],
  large: [100, 160],
  complex: [160, 250],
}

const RUSH_MULTIPLIER: Record<Timeline, number> = {
  standard: 1,
  expedited: 1.25,
  rush: 1.5,
}

const GRANTED_MONTHLY = 29

/* ── Helpers ── */
function calcCost(size: ProposalSize, complexity: Complexity, timeline: Timeline) {
  const [rLo, rHi] = HOURLY_RATE[complexity]
  const [hLo, hHi] = HOURS[size]
  const mult = RUSH_MULTIPLIER[timeline]
  const lo = Math.round(rLo * hLo * mult)
  const hi = Math.round(rHi * hHi * mult)
  return {
    rateLo: rLo,
    rateHi: rHi,
    hoursLo: Math.round(hLo * mult),
    hoursHi: Math.round(hHi * mult),
    costLo: lo,
    costHi: hi,
    rushMultiplier: mult,
  }
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

/* ── Animated counter ── */
function useAnimatedCounter(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

/* ── Select input component ── */
function SelectField<T extends string>({
  label,
  id,
  value,
  onChange,
  options,
}: {
  label: string
  id: string
  value: T
  onChange: (v: T) => void
  options: Record<T, string>
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold tracking-wide text-navy">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none rounded-xl border border-navy/12 bg-white px-4 py-3.5 pr-10 text-sm font-medium text-navy shadow-sm outline-none transition focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/30"
        >
          {(Object.entries(options) as [T, string][]).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  )
}

/* ── Cost bar visual ── */
function CostBar({ label, amount, max, color, delay }: { label: string; amount: number; max: number; color: string; delay: number }) {
  const pct = Math.max((amount / max) * 100, 6)
  const animated = useAnimatedCounter(amount)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-navy">{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{fmt(animated)}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-navy/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  )
}

/* ── Main calculator component ── */
export default function CostCalculator() {
  const [grantType, setGrantType] = useState<GrantType>('federal_research')
  const [size, setSize] = useState<ProposalSize>('medium')
  const [complexity, setComplexity] = useState<Complexity>('standard')
  const [timeline, setTimeline] = useState<Timeline>('standard')
  const [computed, setComputed] = useState(false)

  /* Email capture state */
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const cost = calcCost(size, complexity, timeline)
  const annualProposals = 3.5
  const annualConsultantLo = Math.round(cost.costLo * annualProposals)
  const annualConsultantHi = Math.round(cost.costHi * annualProposals)
  const annualGranted = GRANTED_MONTHLY * 12
  const savingsLo = annualConsultantLo - annualGranted
  const savingsHi = annualConsultantHi - annualGranted
  const avgSavings = Math.round((savingsLo + savingsHi) / 2)
  const barMax = annualConsultantHi * 1.1

  const animatedSavings = useAnimatedCounter(computed ? avgSavings : 0, 1200)

  const resultsRef = useRef<HTMLDivElement>(null)

  const handleCalculate = useCallback(() => {
    setComputed(true)
    trackEvent('cost_calculator_submit', {
      grant_type: grantType,
      size,
      complexity,
      timeline,
    })
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [grantType, size, complexity, timeline])

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    trackEvent('cost_calculator_email', {
      source: 'cost_calculator',
      grant_type: grantType,
      size,
      complexity,
      timeline,
    })
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setEmailStatus('success')
        setEmail('')
      } else {
        setEmailStatus('error')
      }
    } catch {
      setEmailStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* ── Input panel ── */}
      <div className="card p-8 md:p-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField<GrantType>
            label="Grant Type"
            id="grant-type"
            value={grantType}
            onChange={setGrantType}
            options={GRANT_LABELS}
          />
          <SelectField<ProposalSize>
            label="Proposal Size"
            id="proposal-size"
            value={size}
            onChange={setSize}
            options={SIZE_LABELS}
          />
          <SelectField<Complexity>
            label="Complexity Level"
            id="complexity"
            value={complexity}
            onChange={setComplexity}
            options={COMPLEXITY_LABELS}
          />
          <SelectField<Timeline>
            label="Timeline Urgency"
            id="timeline"
            value={timeline}
            onChange={setTimeline}
            options={TIMELINE_LABELS}
          />
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-navy-light active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
              <path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M4 8h12M8 8v8" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="6" cy="6" r="1" fill="#F5CF49" />
              <circle cx="10" cy="6" r="1" fill="#F5CF49" />
              <circle cx="14" cy="6" r="1" fill="#F5CF49" />
            </svg>
            Calculate My Savings
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      {computed && (
        <div
          ref={resultsRef}
          className="mt-10 scroll-mt-8"
          style={{
            animation: 'fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          {/* ── Savings headline ── */}
          <div className="banner-yellow paper-texture rounded-[32px] p-8 md:p-12 text-center relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-navy/60 mb-2">
              Your estimated annual savings
            </p>
            <p className="heading-display text-navy" style={{ lineHeight: 1.1 }}>
              {fmt(animatedSavings)}
            </p>
            <p className="body-lg mt-2 text-navy/70">
              saved per year by switching from consultants to Granted
            </p>
          </div>

          {/* ── Comparison cards ── */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Consultant card */}
            <div className="card p-7 md:p-8 border-2 border-transparent">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2v16M2 10h16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" transform="rotate(45 10 10)" />
                  </svg>
                </span>
                <h3 className="heading-md text-navy" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}>
                  Hiring a Consultant
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm border-b border-navy/8 pb-3">
                  <span className="text-navy/60">Hourly rate</span>
                  <span className="font-semibold text-navy">{fmt(cost.rateLo)}&ndash;{fmt(cost.rateHi)}/hr</span>
                </div>
                <div className="flex justify-between text-sm border-b border-navy/8 pb-3">
                  <span className="text-navy/60">Estimated hours</span>
                  <span className="font-semibold text-navy">{cost.hoursLo}&ndash;{cost.hoursHi} hours</span>
                </div>
                {cost.rushMultiplier > 1 && (
                  <div className="flex justify-between text-sm border-b border-navy/8 pb-3">
                    <span className="text-navy/60">Rush premium</span>
                    <span className="font-semibold text-red-600">+{Math.round((cost.rushMultiplier - 1) * 100)}%</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-b border-navy/8 pb-3">
                  <span className="text-navy/60">Cost per proposal</span>
                  <span className="font-bold text-navy">{fmt(cost.costLo)}&ndash;{fmt(cost.costHi)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-navy">Annual cost (3&ndash;4 proposals)</span>
                  <span className="font-bold text-red-600 text-lg">{fmt(annualConsultantLo)}&ndash;{fmt(annualConsultantHi)}</span>
                </div>
              </div>
            </div>

            {/* Granted card */}
            <div className="card p-7 md:p-8 border-2 border-brand-yellow/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 rounded-bl-xl bg-brand-yellow px-3 py-1">
                <span className="text-xs font-bold text-navy uppercase tracking-wider">Recommended</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/20">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10.5L8 14.5L16 5.5" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="heading-md text-navy" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}>
                  Granted AI
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm border-b border-navy/8 pb-3">
                  <span className="text-navy/60">Monthly subscription</span>
                  <span className="font-semibold text-navy">{fmt(GRANTED_MONTHLY)}/mo</span>
                </div>
                <div className="flex justify-between text-sm border-b border-navy/8 pb-3">
                  <span className="text-navy/60">Proposals included</span>
                  <span className="font-semibold text-navy">Unlimited</span>
                </div>
                <div className="flex justify-between text-sm border-b border-navy/8 pb-3">
                  <span className="text-navy/60">Turnaround time</span>
                  <span className="font-semibold text-navy">Hours, not weeks</span>
                </div>
                <div className="flex justify-between text-sm border-b border-navy/8 pb-3">
                  <span className="text-navy/60">Revision rounds</span>
                  <span className="font-semibold text-navy">Unlimited</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-navy">Annual cost</span>
                  <span className="font-bold text-navy text-lg">{fmt(annualGranted)}/year</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Annual cost comparison bars ── */}
          <div className="card mt-8 p-7 md:p-8">
            <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy/50 mb-6">
              Annual Cost Comparison
            </h4>
            <div className="space-y-5">
              <CostBar
                label="Consultant (3\u20134 proposals/yr)"
                amount={Math.round((annualConsultantLo + annualConsultantHi) / 2)}
                max={barMax}
                color="#DC2626"
                delay={0}
              />
              <CostBar
                label="Granted AI (unlimited proposals)"
                amount={annualGranted}
                max={barMax}
                color="#F5CF49"
                delay={200}
              />
            </div>
            <div className="mt-6 rounded-xl bg-navy/[0.03] p-4 text-center">
              <p className="text-sm text-navy/60">
                That&apos;s a <span className="font-bold text-navy">{Math.round(((annualConsultantLo + annualConsultantHi) / 2 - annualGranted) / ((annualConsultantLo + annualConsultantHi) / 2) * 100)}% reduction</span> in your grant writing costs
              </p>
            </div>
          </div>

          {/* ── Email capture for detailed report ── */}
          <div className="mt-8 card p-7 md:p-8 bg-navy text-white">
            <div className="mx-auto max-w-lg text-center">
              <h4 className="heading-md text-white mb-2" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}>
                Get Your Detailed Comparison Report
              </h4>
              <p className="body-sm text-white/60 mb-6">
                Receive a personalized PDF breakdown with your exact cost savings, ROI analysis, and a side-by-side feature comparison.
              </p>

              {emailStatus === 'success' ? (
                <div className="py-4">
                  <p className="text-lg font-semibold text-brand-yellow">Report is on its way!</p>
                  <p className="mt-2 text-white/60 text-sm">Check your inbox for the full breakdown.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organization.org"
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-yellow/60 focus:ring-1 focus:ring-brand-yellow/40 transition"
                  />
                  <button
                    type="submit"
                    disabled={emailStatus === 'loading'}
                    className="rounded-xl bg-brand-yellow px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-brand-gold disabled:opacity-60 shrink-0"
                  >
                    {emailStatus === 'loading' ? 'Sending...' : 'Send My Report'}
                  </button>
                </form>
              )}
              {emailStatus === 'error' && (
                <p className="mt-2 text-xs text-red-400">Something went wrong. Please try again.</p>
              )}
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div className="mt-12 text-center">
            <p className="body-lg text-navy-light mb-6">
              Ready to cut your grant writing costs by {Math.round(((annualConsultantLo + annualConsultantHi) / 2 - annualGranted) / ((annualConsultantLo + annualConsultantHi) / 2) * 100)}%?
            </p>
            <CheckoutButton label="Start Your Free 7-Day Trial" eventName="cost_calculator_trial_click" />
            <p className="body-sm mt-3 text-navy/40">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      )}

      {/* Keyframe for results reveal */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
