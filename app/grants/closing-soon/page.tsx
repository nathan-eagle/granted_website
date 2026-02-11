import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCard from '@/components/GrantCard'
import GrantCTA from '@/components/GrantCTA'
import GrantFinderCTA from '@/components/GrantFinderCTA'
import { getClosingSoonGrants } from '@/lib/grants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Grants Closing Soon | Granted',
  description:
    'Federal and foundation grants with deadlines in the next 30 days. Apply before time runs out.',
  alternates: { canonical: 'https://grantedai.com/grants/closing-soon' },
  openGraph: {
    title: 'Grants Closing Soon | Granted',
    description: 'Federal and foundation grants with deadlines in the next 30 days.',
    url: 'https://grantedai.com/grants/closing-soon',
    siteName: 'Granted AI',
    type: 'website',
    images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: 'Grants Closing Soon' }],
  },
}

export default async function ClosingSoonPage() {
  const grants = await getClosingSoonGrants(30).catch(() => [])

  return (
    <>
      <Header />
      <main>
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-20 md:py-28 relative z-10">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Deadline Alert
              </p>
              <h1 className="heading-xl text-white max-w-2xl">
                Grants Closing Soon
              </h1>
              <p className="body-lg mt-4 text-white/50 max-w-xl">
                {grants.length > 0
                  ? `${grants.length} grant${grants.length === 1 ? '' : 's'} with deadlines in the next 30 days.`
                  : 'No grants with imminent deadlines right now. Check back soon.'}
              </p>
            </RevealOnScroll>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {grants.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grants.map((g, i) => (
                <RevealOnScroll key={g.id} delay={Math.min(i * 30, 300)}>
                  <GrantCard grant={g} />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">No imminent deadlines</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  There are no grants with deadlines in the next 30 days. Use our grant
                  finder to discover upcoming opportunities.
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
