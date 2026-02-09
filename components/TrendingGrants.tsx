import Link from 'next/link'
import Container from '@/components/Container'
import GrantCard from '@/components/GrantCard'
import RevealOnScroll from '@/components/RevealOnScroll'
import type { PublicGrant } from '@/lib/grants'

export default function TrendingGrants({ grants }: { grants: PublicGrant[] }) {
  if (!grants || grants.length === 0) return null

  return (
    <section>
      <Container className="py-28 md:py-32">
        <RevealOnScroll>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow text-center mb-4">
            Trending Grants
          </p>
          <h2 className="heading-lg text-center">
            Closing soon &mdash; don&apos;t miss these deadlines
          </h2>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {grants.map((grant, i) => (
            <RevealOnScroll key={grant.id} delay={i * 80}>
              <GrantCard grant={grant} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={400}>
          <div className="mt-10 text-center">
            <Link
              href="/grants"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-yellow hover:text-brand-gold transition-colors"
            >
              See all grants
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
