import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantsLoadingBody from '@/components/GrantsLoadingBody'

export default function GrantsLoading() {
  return (
    <>
      <Header />
      <main>
        {/* Hero — real content, not skeleton */}
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-8 md:py-12 relative z-10">
            <RevealOnScroll>
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 mb-6">
                  <span className="text-sm font-semibold text-brand-yellow">
                    1,000+ Opportunities
                  </span>
                </div>
                <h1 className="heading-xl text-white">
                  Find the right grant for your organization
                </h1>
                <p className="body-lg mt-4 text-white/50 max-w-2xl mx-auto">
                  Search federal, foundation, and corporate grants with AI &mdash; or browse by agency, topic, and state.
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        <Container>
          <Suspense>
            <GrantsLoadingBody />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  )
}
