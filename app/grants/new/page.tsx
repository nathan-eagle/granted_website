import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCard from '@/components/GrantCard'
import GrantCTA from '@/components/GrantCTA'
import GrantFinderCTA from '@/components/GrantFinderCTA'
import { getNewGrants } from '@/lib/grants'

export const revalidate = 86400

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function generateMetadata(): Metadata {
  const now = new Date()
  const monthName = MONTH_NAMES[now.getMonth()]
  const year = now.getFullYear()
  return {
    title: `New Grants — ${monthName} ${year} | Granted`,
    description: `Grant opportunities added in ${monthName} ${year}. Stay current with the latest federal and foundation funding.`,
    alternates: { canonical: 'https://grantedai.com/grants/new' },
    openGraph: {
      title: `New Grants — ${monthName} ${year} | Granted`,
      description: `Grant opportunities added in ${monthName} ${year}.`,
      url: 'https://grantedai.com/grants/new',
      siteName: 'Granted AI',
      type: 'website',
      images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: 'New Grants This Month' }],
    },
  }
}

export default async function NewGrantsPage() {
  const grants = await getNewGrants().catch(() => [])
  const now = new Date()
  const monthName = MONTH_NAMES[now.getMonth()]
  const year = now.getFullYear()

  return (
    <>
      <Header />
      <main>
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-20 md:py-28 relative z-10">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Recently Added
              </p>
              <h1 className="heading-xl text-white max-w-2xl">
                New Grants — {monthName} {year}
              </h1>
              <p className="body-lg mt-4 text-white/50 max-w-xl">
                {grants.length > 0
                  ? `${grants.length} new grant${grants.length === 1 ? '' : 's'} added this month.`
                  : 'No new grants added yet this month. Check back soon.'}
              </p>
            </RevealOnScroll>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {grants.length > 0 ? (
            <RevealOnScroll>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grants.map((g) => (
                  <GrantCard key={g.id} grant={g} />
                ))}
              </div>
            </RevealOnScroll>
          ) : (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">Check back soon</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  New grants are added regularly. Use our grant finder to discover opportunities now.
                </p>
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={160}>
            <div className="mt-10">
              <GrantFinderCTA />
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="mt-16">
              <GrantCTA />
            </div>
          </RevealOnScroll>
        </Container>
      </main>
      <Footer />
    </>
  )
}
