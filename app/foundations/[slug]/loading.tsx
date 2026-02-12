import Header from '@/components/Header'
import Container from '@/components/Container'

export default function FoundationLoading() {
  return (
    <>
      <Header />
      <main>
        <Container className="py-12 md:py-16">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-16 bg-navy/5 rounded animate-pulse" />
            <span className="text-navy-light/20">/</span>
            <div className="h-4 w-24 bg-navy/5 rounded animate-pulse" />
            <span className="text-navy-light/20">/</span>
            <div className="h-4 w-40 bg-navy/5 rounded animate-pulse" />
          </div>

          {/* Location + heading skeleton */}
          <div className="h-4 w-32 bg-navy/5 rounded animate-pulse mb-3" />
          <div className="h-10 w-96 max-w-full bg-navy/8 rounded animate-pulse" />

          {/* Quick Facts skeleton */}
          <div className="mt-10 bg-cream-dark rounded-[20px] border-l-4 border-brand-yellow/30 p-8">
            <div className="h-5 w-28 bg-navy/8 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-20 bg-navy/5 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-navy/8 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Metric cards skeleton */}
          <div className="mt-12">
            <div className="h-7 w-48 bg-navy/8 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-5 text-center">
                  <div className="h-3 w-16 bg-navy/5 rounded animate-pulse mx-auto mb-3" />
                  <div className="h-7 w-24 bg-navy/8 rounded animate-pulse mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Chart skeleton */}
          <div className="mt-10 card p-6 md:p-8">
            <div className="h-3 w-36 bg-navy/5 rounded animate-pulse mb-6" />
            <div className="flex items-end gap-1.5 h-48">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end">
                  <div
                    className="w-full bg-navy/5 rounded-t animate-pulse"
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                  <div className="h-3 w-4 bg-navy/5 rounded animate-pulse mt-1.5" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </>
  )
}
