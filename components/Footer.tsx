import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-slate-200">
      <div className="container py-16">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <div className="flex flex-col gap-3">
            <Image src="/images/logo-wordmark.png" alt="Granted" width={180} height={64} className="h-auto w-[160px] md:w-[180px]" />
            <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
              Granted is making fundraising less tedious, more accessible, and more successful for everyone.
            </p>
          </div>
          <nav className="flex gap-16 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-900 mb-4 tracking-tight">Join Us</p>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-slate-900">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-slate-900">Features</Link></li>
                <li><Link href="/tech" className="hover:text-slate-900">Technology</Link></li>
                <li><Link href="/faq" className="hover:text-slate-900">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900">Contact</Link></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>© {new Date().getFullYear()} Granted AI</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            <Link href="https://x.com/GrantedAI" className="hover:text-slate-700">@GrantedAI</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
