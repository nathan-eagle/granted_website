'use client'

import { useEffect, useRef, useState } from 'react'
import Container from '@/components/Container'
import { useInView } from '@/hooks/useInView'

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration, start])

  return count
}

/* ── Stats block ── */
const STATS = [
  { value: 500000, suffix: '+', label: 'Successful proposals\nlearned from' },
  { value: 50, suffix: '+', label: 'Specialized writing\nmodels' },
  { value: 12000, suffix: '+', label: 'Proposals drafted\nwith Granted' },
  { value: 40, suffix: '%', label: 'Time saved on\naverage per proposal' },
]

export function StatsCounter() {
  const { ref, isInView } = useInView({ threshold: 0.3 })

  return (
    <section className="bg-navy noise-overlay overflow-hidden">
      <Container className="py-20 md:py-28 relative z-10">
        <div ref={ref} className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} animate={isInView} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function StatItem({ stat, index, animate }: { stat: typeof STATS[0]; index: number; animate: boolean }) {
  const count = useCounter(stat.value, 2200, animate)

  function formatNumber(n: number): string {
    if (n >= 1000) return Math.floor(n / 1000).toLocaleString() + 'K'
    return n.toLocaleString()
  }

  return (
    <div
      className="text-center"
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
      }}
    >
      <div className="stat-number">
        {formatNumber(count)}{stat.suffix}
      </div>
      <div className="stat-label whitespace-pre-line">{stat.label}</div>
    </div>
  )
}

/* ── Testimonials ── */
const TESTIMONIALS = [
  {
    quote: 'We used to spend six weeks on federal proposals. With Granted, our first complete draft was ready in two days. The AI coach caught three requirements we would have missed entirely.',
    name: 'Dr. Maria Chen',
    title: 'Director of Research, Pacific Northwest Health Sciences',
    initials: 'MC',
  },
  {
    quote: 'As a tribal college with a four-person grants office, Granted is the equalizer we needed. We submitted our first successful NSF TCUP proposal last quarter.',
    name: 'James Whitehorse',
    title: 'Grants Manager, Standing Rock College',
    initials: 'JW',
  },
  {
    quote: "I'm a postdoc writing my first R01 without a mentor who's done it before. Granted walked me through every section and the coverage tracker made sure I didn't leave anything on the table.",
    name: 'Dr. Aisha Okonkwo',
    title: 'Postdoctoral Fellow, Emory University',
    initials: 'AO',
  },
]

export function Testimonials() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <section className="bg-navy noise-overlay overflow-hidden section-angle-top">
      <Container className="py-28 md:py-36 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
            From the community
          </p>
          <h2 className="heading-lg text-white">
            Grant writers who switched to Granted
          </h2>
        </div>
        <div ref={ref} className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`,
              }}
            >
              {/* Quote mark */}
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="mb-4 text-brand-yellow/40">
                <path d="M0 24V14.4C0 9.6 1.2 6 3.6 3.6S9.6 0 14.4 0v4.8c-2.4 0-4.2.6-5.4 1.8S7.2 9.6 7.2 12H14v12H0zm18 0V14.4c0-4.8 1.2-8.4 3.6-10.8S25.6 0 30.4 0v4.8c-2.4 0-4.2.6-5.4 1.8s-1.8 3-1.8 5.4H30v12H18z" fill="currentColor"/>
              </svg>
              <p className="text-white/80 text-[0.9375rem] leading-relaxed mb-6">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow font-semibold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ── Organization logos bar ── */
const ORGS = [
  'Johns Hopkins University',
  'Navajo Technical University',
  'WE ACT for Environmental Justice',
  'RAND Corporation',
  'Black Belt Community Foundation',
  'Sitting Bull College',
]

export function OrgLogos() {
  return (
    <div className="py-10 md:py-14">
      <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-navy-light/40 mb-6">
        Trusted by researchers and organizations at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12 px-6">
        {ORGS.map((org) => (
          <span
            key={org}
            className="text-xs md:text-sm font-semibold tracking-wide text-navy/25 hover:text-navy/50 transition-colors cursor-default whitespace-nowrap"
          >
            {org}
          </span>
        ))}
      </div>
    </div>
  )
}
