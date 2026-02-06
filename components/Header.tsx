'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CheckoutButton from '@/components/CheckoutButton'

const nav = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/tech', label: 'Technology' },
  { href: '/security', label: 'Security' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
]

const SIGN_IN_URL = 'https://app.grantedai.com/api/auth/signin?callbackUrl=/overview'

export default function Header() {
  const pathname = usePathname()
  return (
    <header className="w-full">
      <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
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

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href={SIGN_IN_URL}
              className="text-sm font-semibold text-navy-light transition-colors hover:text-navy"
            >
              Sign in
            </Link>
            <CheckoutButton
              label="Sign up"
              className="px-4 py-2 text-sm font-semibold border-black bg-black text-white hover:bg-black/90"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-[0.02em] transition-colors ${
                pathname === item.href
                  ? 'font-semibold text-navy'
                  : 'font-medium text-slate-600 hover:text-navy'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={SIGN_IN_URL}
            className="text-sm font-semibold text-navy-light transition-colors hover:text-navy"
          >
            Sign in
          </Link>
          <CheckoutButton
            label="Sign up"
            className="px-4 py-2 text-sm font-semibold border-black bg-black text-white hover:bg-black/90"
          />
        </nav>
      </div>
    </header>
  )
}
