import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <Container className="py-32 text-center md:py-44">
          <p className="text-[8rem] md:text-[12rem] leading-none font-bold tracking-tighter text-navy/5 select-none">
            404
          </p>
          <h1 className="heading-lg -mt-10 md:-mt-16 relative z-10">
            Page not found
          </h1>
          <p className="body-lg text-navy-light mt-4 max-w-md mx-auto">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="button button-primary">
              Go home
            </Link>
            <Link href="/blog" className="button button-ghost">
              Read the blog
            </Link>
          </div>

          <nav className="mt-16 text-sm text-navy-light">
            <p className="font-semibold text-navy mb-3">Popular pages</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link href="/features" className="hover:text-navy transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-navy transition-colors">Pricing</Link>
              <Link href="/faq" className="hover:text-navy transition-colors">FAQ</Link>
              <Link href="/tools/readiness-quiz" className="hover:text-navy transition-colors">Grant Readiness Quiz</Link>
              <Link href="/contact" className="hover:text-navy transition-colors">Contact</Link>
            </div>
          </nav>
        </Container>
      </main>
      <Footer />
    </>
  )
}
