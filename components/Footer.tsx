import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-navy/10">
      <div className="container py-16">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <div className="flex flex-col gap-3">
            <Image src="/images/logo-wordmark.png" alt="Granted" width={180} height={64} className="h-auto w-[160px] md:w-[180px]" />
            <p className="text-sm text-navy-light max-w-xs leading-relaxed">
              Granted is making fundraising less tedious, more accessible, and more successful for everyone.
            </p>
          </div>
          <nav className="flex gap-16 text-sm text-navy-light">
            <div>
              <p className="font-semibold text-navy mb-4 tracking-tight">Join Us</p>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-navy">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-navy">Features</Link></li>
                <li><Link href="/tech" className="hover:text-navy">Technology</Link></li>
                <li><Link href="/faq" className="hover:text-navy">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-navy">Contact</Link></li>
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
