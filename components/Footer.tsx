import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-navy/10">
      <div className="container py-16">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <div className="flex flex-col gap-3">
            <div className="relative w-fit">
              <Image src="/images/logo-wordmark-text.png" alt="Granted" width={180} height={64} className="h-auto w-[160px] md:w-[180px]" />
              <img
                src="/fav.ico"
                alt=""
                aria-hidden
                className="absolute right-[-12px] top-[2px] h-[16px] w-[16px] md:right-[-16px] md:top-[1px] md:h-[22px] md:w-[22px]"
              />
            </div>
            <p className="text-sm text-navy-light max-w-xs leading-relaxed">
              Granted is making fundraising less tedious, more accessible, and more successful for everyone.
            </p>
          </div>
          <nav className="flex gap-16 text-sm text-navy-light">
            <div>
              <p className="font-semibold text-navy mb-4 tracking-tight">Join Us</p>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-navy">Pricing</Link></li>
                <li><Link href="/platform" className="hover:text-navy">Technology</Link></li>
                <li><Link href="/security" className="hover:text-navy">Security</Link></li>
                <li><Link href="/faq" className="hover:text-navy">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-navy">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-navy mb-4 tracking-tight">Solutions</p>
              <ul className="space-y-2">
                <li><Link href="/for/researchers" className="hover:text-navy">For Researchers</Link></li>
                <li><Link href="/for/nonprofits" className="hover:text-navy">For Nonprofits</Link></li>
                <li><Link href="/for/k12" className="hover:text-navy">For K-12 Schools</Link></li>
                <li><Link href="/for/environmental" className="hover:text-navy">For Environmental Orgs</Link></li>
                <li><Link href="/for/sbir" className="hover:text-navy">For SBIR Applicants</Link></li>
                <li><Link href="/for/first-time" className="hover:text-navy">First-Time Applicants</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-navy mb-4 tracking-tight">Free Tools</p>
              <ul className="space-y-2">
                <li><Link href="/grants" className="hover:text-navy">Find Grants</Link></li>
                <li><Link href="/tools/readiness-quiz" className="hover:text-navy">Grant Readiness Quiz</Link></li>
                <li><Link href="/tools/deadlines" className="hover:text-navy">Deadline Calendar</Link></li>
                <li><Link href="/tools/cost-calculator" className="hover:text-navy">Cost Calculator</Link></li>
                <li><Link href="/blog" className="hover:text-navy">Blog</Link></li>
                <li><Link href="/foundations" className="hover:text-navy">Browse Foundations</Link></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-4 text-xs text-navy-light/60 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Granted AI</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-navy">Privacy</Link>
            <Link href="/terms" className="hover:text-navy">Terms</Link>
            <Link href="https://x.com/GrantedAI" className="hover:text-navy">@GrantedAI</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
