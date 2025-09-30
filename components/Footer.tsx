import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-24 border-t">
      <div className="container py-10">
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <Image src="/images/logo-star.svg" alt="Granted" width={20} height={20} />
            <div>
              <p className="font-semibold">Granted</p>
              <p className="text-sm text-slate-600 max-w-sm">
                Granted is making fundraising less tedious, more accessible, and more successful for everyone.
              </p>
            </div>
          </div>
          <nav className="flex gap-10 text-sm">
            <div>
              <p className="font-semibold mb-3">Join Us</p>
              <ul className="space-y-2">
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/tech">Technology</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="mt-10 flex items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Granted AI</p>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="https://x.com/GrantedAI">@GrantedAI</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
