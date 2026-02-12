import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'

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

        {/* Search form skeleton — matches GrantFinder layout */}
        <Container>
          <div className="py-12 md:py-16">
            <div className="max-w-2xl mx-auto">
              <div className="card p-8 md:p-10">
                <div className="space-y-6">
                  {/* Org type */}
                  <div>
                    <div className="block text-sm font-semibold text-navy mb-2">Organization type</div>
                    <div className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy/30">
                      Select type (optional)
                    </div>
                  </div>

                  {/* Focus area */}
                  <div>
                    <div className="block text-sm font-semibold text-navy mb-2">
                      Focus area <span className="text-red-400">*</span>
                    </div>
                    <div className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy/30">
                      e.g. youth mental health, clean energy, marine conservation
                    </div>
                  </div>

                  {/* State + Amount row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="block text-sm font-semibold text-navy mb-2">State / Territory</div>
                      <div className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy/30">
                        Select state (optional)
                      </div>
                    </div>
                    <div>
                      <div className="block text-sm font-semibold text-navy mb-2">Funding Amount</div>
                      <div className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy/30">
                        Any amount
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search button */}
                <div className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-pill min-h-[3.25rem] text-base font-semibold bg-brand-yellow/50 text-navy/50 cursor-default">
                  Find Matching Grants
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-sm text-navy-light/60 text-center">
                Free &middot; No account required &middot; Powered by AI across the world&apos;s largest grants + funders database
              </p>
              <p className="mt-1.5 text-xs text-navy-light/40 text-center">
                Currently focused on US federal, state, and foundation grants.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
