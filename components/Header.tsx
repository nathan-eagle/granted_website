'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/tech', label: 'Technology' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
]

export default function Header() {
  const pathname = usePathname()
  return (
    <header className="w-full">
      <div className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-wordmark.png"
            alt="Granted"
            width={150}
            height={53}
            priority
            className="h-auto w-[140px] md:w-[170px]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-[0.02em] transition-colors ${
                pathname === item.href
                  ? 'font-semibold text-slate-900'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="https://app.grantedai.com" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">Login</Link>
        </nav>
      </div>
    </header>
  )
}
