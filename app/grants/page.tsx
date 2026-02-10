import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCard from '@/components/GrantCard'
import GrantCTA from '@/components/GrantCTA'
import { getAllGrants, getClosingSoonGrants, getNewGrants, GRANT_CATEGORIES, GRANT_US_STATES } from '@/lib/grants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Grant Database | Granted',
  description:
    'Browse the world\'s largest continuously updated grant database. Explore active opportunities and start your AI-powered proposal today.',
  alternates: { canonical: 'https://grantedai.com/grants' },
  openGraph: {
    title: 'Grant Database | Granted',
    description:
      'Browse the world\'s largest continuously updated grant database.',
    url: 'https://grantedai.com/grants',
    siteName: 'Granted AI',
    type: 'website',
    images: [
      {
        url: 'https://grantedai.com/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Browse Federal Grants',
      },
    ],
  },
}

const agencyCategories = GRANT_CATEGORIES.filter((c) => c.type === 'agency')
const audienceCategories = GRANT_CATEGORIES.filter((c) => c.type === 'audience')
const topicCategories = GRANT_CATEGORIES.filter((c) => c.type === 'topic')

export default async function GrantsIndex() {
  const [grants, closingSoon, newGrants] = await Promise.all([
    getAllGrants().catch(() => []),
    getClosingSoonGrants(30).catch(() => []),
    getNewGrants().catch(() => []),
  ])
  const activeGrants = grants.filter((g) => g.status === 'active')
  const upcomingGrants = grants.filter((g) => g.status === 'upcoming')

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-20 md:py-28 relative z-10">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Grant Discovery
              </p>
              <h1 className="heading-xl text-white max-w-2xl">
                Grant Database
              </h1>
              <p className="body-lg mt-4 text-white/50 max-w-xl">
                Explore active funding opportunities from across agencies and
                funder types. Find the right grant and start your AI-powered
                proposal.
              </p>
            </RevealOnScroll>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {/* ── Category quick-links ── */}
          <RevealOnScroll>
            <div className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4">
                By Agency
              </h2>
              <div className="flex flex-wrap gap-2">
                {agencyCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/grants/${c.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {c.name.replace(' Grants', '')}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">
                By Audience
              </h2>
              <div className="flex flex-wrap gap-2">
                {audienceCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/grants/${c.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">
                By Topic
              </h2>
              <div className="flex flex-wrap gap-2">
                {topicCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/grants/${c.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {c.name.replace(' Grants', '')}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">
                By State
              </h2>
              <div className="flex flex-wrap gap-2">
                {GRANT_US_STATES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/grants/state/${s.slug}`}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {s.abbreviation}
                  </Link>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* ── Closing soon ── */}
          {closingSoon.length > 0 && (
            <RevealOnScroll delay={50}>
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-lg text-navy">Closing Soon</h2>
                  <Link href="/grants/closing-soon" className="text-sm font-semibold text-brand-gold hover:underline">
                    View all
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {closingSoon.slice(0, 3).map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* ── New this month ── */}
          {newGrants.length > 0 && (
            <RevealOnScroll delay={75}>
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-lg text-navy">New This Month</h2>
                  <Link href="/grants/new" className="text-sm font-semibold text-brand-gold hover:underline">
                    View all
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {newGrants.slice(0, 3).map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* ── Active grants grid ── */}
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

          {/* ── Upcoming grants ── */}
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

          {/* ── Empty state ── */}
          {grants.length === 0 && (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">No grants matched right now</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  New grants are added continuously. Try a broader search, or
                  start drafting your next proposal with Granted AI.
                </p>
              </div>
            </RevealOnScroll>
          )}

          {/* ── Bottom CTA ── */}
          <RevealOnScroll delay={300}>
            <div className="mt-20">
              <GrantCTA />
            </div>
          </RevealOnScroll>
        </Container>
      </main>
      <Footer />
    </>
  )
}
