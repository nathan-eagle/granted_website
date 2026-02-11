'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import GrantFinder, { type Phase } from '@/components/GrantFinder'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCard from '@/components/GrantCard'
import GrantCTA from '@/components/GrantCTA'
import { GRANT_CATEGORIES, GRANT_US_STATES, type PublicGrant } from '@/lib/grants'

const agencyCategories = GRANT_CATEGORIES.filter((c) => c.type === 'agency')
const audienceCategories = GRANT_CATEGORIES.filter((c) => c.type === 'audience')
const topicCategories = GRANT_CATEGORIES.filter((c) => c.type === 'topic')

const STATS = [
  { stat: '20 hrs', label: 'avg. weekly search time saved' },
  { stat: '85%', label: 'of grants won by matched orgs' },
  { stat: '30 sec', label: 'to find grants with Granted' },
]

interface Props {
  closingSoon: PublicGrant[]
  newGrants: PublicGrant[]
  activeGrants: PublicGrant[]
  upcomingGrants: PublicGrant[]
  totalGrantCount: number
}

export default function GrantsPageClient({
  closingSoon,
  newGrants,
  activeGrants,
  upcomingGrants,
  totalGrantCount,
}: Props) {
  const [phase, setPhase] = useState<Phase>('form')

  return (
    <>
      {/* Grant Finder — always visible */}
      <div className="py-12 md:py-16">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto">
            <div className="card p-8 md:p-10 animate-pulse">
              <div className="h-6 bg-navy/8 rounded w-1/3 mb-6" />
              <div className="h-12 bg-navy/5 rounded mb-6" />
              <div className="h-6 bg-navy/8 rounded w-1/3 mb-6" />
              <div className="h-12 bg-navy/5 rounded mb-6" />
              <div className="h-12 bg-navy/8 rounded-pill mt-8" />
            </div>
          </div>
        }>
          <GrantFinder onPhaseChange={setPhase} />
        </Suspense>
      </div>

      {/* Stats bar */}
      {phase === 'form' && (
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {STATS.map((item) => (
            <div key={item.stat} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/8 border border-brand-yellow/15">
              <span className="text-sm font-bold text-navy" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                {item.stat}
              </span>
              <span className="text-xs text-navy-light">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Browse sections — visible only in form phase */}
      {phase === 'form' && (
        <>
          {/* Category quick-links */}
          <RevealOnScroll>
            <div className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4">By Agency</h2>
              <div className="flex flex-wrap gap-2">
                {agencyCategories.map((c) => (
                  <Link key={c.slug} href={`/grants/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
                    {c.name.replace(' Grants', '')}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">By Audience</h2>
              <div className="flex flex-wrap gap-2">
                {audienceCategories.map((c) => (
                  <Link key={c.slug} href={`/grants/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
                    {c.name}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">By Topic</h2>
              <div className="flex flex-wrap gap-2">
                {topicCategories.map((c) => (
                  <Link key={c.slug} href={`/grants/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
                    {c.name.replace(' Grants', '')}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">By State</h2>
              <div className="flex flex-wrap gap-2">
                {GRANT_US_STATES.map((s) => (
                  <Link key={s.slug} href={`/grants/state/${s.slug}`} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
                    {s.abbreviation}
                  </Link>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Closing soon */}
          {closingSoon.length > 0 && (
            <RevealOnScroll delay={50}>
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-lg text-navy">Closing Soon</h2>
                  <Link href="/grants/closing-soon" className="text-sm font-semibold text-brand-gold hover:underline">View all</Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {closingSoon.slice(0, 3).map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* New this month */}
          {newGrants.length > 0 && (
            <RevealOnScroll delay={75}>
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-lg text-navy">New This Month</h2>
                  <Link href="/grants/new" className="text-sm font-semibold text-brand-gold hover:underline">View all</Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {newGrants.slice(0, 3).map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* Active grants */}
          {activeGrants.length > 0 && (
            <RevealOnScroll delay={100}>
              <h2 className="heading-lg text-navy mb-8">Active Grants</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeGrants.map((g) => (
                  <GrantCard key={g.id} grant={g} />
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* Upcoming grants */}
          {upcomingGrants.length > 0 && (
            <RevealOnScroll delay={200}>
              <h2 className="heading-lg text-navy mb-8 mt-16">Upcoming Grants</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingGrants.map((g) => (
                  <GrantCard key={g.id} grant={g} />
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* Empty state */}
          {totalGrantCount === 0 && (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">No grants matched right now</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  New grants are added continuously. Try a broader search, or start drafting your next proposal with Granted AI.
                </p>
              </div>
            </RevealOnScroll>
          )}

          {/* Bottom CTA */}
          <RevealOnScroll delay={300}>
            <div className="mt-20">
              <GrantCTA />
            </div>
          </RevealOnScroll>
        </>
      )}
    </>
  )
}
