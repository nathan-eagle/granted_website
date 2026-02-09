import Container from '@/components/Container'
import TrendingGrantCard from '@/components/TrendingGrantCard'
import RevealOnScroll from '@/components/RevealOnScroll'
import { ButtonLink } from '@/components/ButtonLink'
import type { PublicGrant } from '@/lib/grants'

export default function TrendingGrants({ grants }: { grants: PublicGrant[] }) {
  if (!grants || grants.length === 0) return null

  return (
    <section>
      <Container className="py-20 md:py-24">
        <RevealOnScroll>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow text-center mb-4">
            Trending Grants
          </p>
          <h2 className="heading-lg text-center text-navy">
            Closing soon &mdash; don&apos;t miss these deadlines
          </h2>
        </RevealOnScroll>

        <div className={`mt-10 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 ${grants.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3 max-w-5xl mx-auto'}`}>
          {grants.map((grant, i) => (
            <RevealOnScroll key={grant.id} delay={i * 80} className="h-full">
              <TrendingGrantCard grant={grant} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={400}>
          <div className="mt-10 text-center">
            <ButtonLink href="/grants" variant="primary" className="cta-shimmer">
              See All Grants &rarr;
            </ButtonLink>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
