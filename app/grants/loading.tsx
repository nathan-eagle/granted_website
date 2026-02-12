import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export default function GrantsLoading() {
  return (
    <>
      <Header />
      <main>
        {/* Hero skeleton */}
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-8 md:py-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 mb-6">
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-10 bg-white/8 rounded w-3/4 mx-auto mb-4 animate-pulse" />
              <div className="h-5 bg-white/5 rounded w-2/3 mx-auto animate-pulse" />
            </div>
          </Container>
        </section>

        {/* Content skeleton */}
        <Container>
          <div className="py-12 md:py-16">
            <div className="max-w-2xl mx-auto">
              <div className="card p-8 md:p-10 animate-pulse">
                <div className="h-6 bg-navy/8 rounded w-1/3 mb-6" />
                <div className="h-12 bg-navy/5 rounded mb-6" />
                <div className="h-6 bg-navy/8 rounded w-1/3 mb-6" />
                <div className="h-12 bg-navy/5 rounded mb-6" />
                <div className="h-12 bg-navy/8 rounded-pill mt-8" />
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
