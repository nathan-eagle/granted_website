'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CheckoutButton from '@/components/CheckoutButton'
import { trackEvent } from '@/lib/analytics'

const nav = [
  { href: '/grants', label: 'Grants' },
  { href: '/foundations', label: 'Foundations' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
]

const resourceLinks = [
  { href: '/tech', label: 'Technology' },
  { href: '/security', label: 'Security' },
  { href: '/faq', label: 'FAQ' },
  { href: '/tools/readiness-quiz', label: 'Grant Readiness Quiz' },
  { href: '/tools/deadlines', label: 'Deadline Calendar' },
  { href: '/tools/cost-calculator', label: 'Cost Calculator' },
]

const SIGN_IN_URL = 'https://app.grantedai.com/api/auth/signin?callbackUrl=/overview'

export default function Header() {
  const pathname = usePathname()
  return (
    <header className="w-full">
      <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            onClick={() => trackEvent('header_logo_click', { location: pathname })}
            className="relative flex items-center"
          >
            <Image
              src="/images/logo-wordmark-text.png"
              alt="Granted"
              width={170}
              height={53}
              priority
              className="h-auto w-[140px] md:w-[170px]"
            />
            <img
              src="/fav.ico"
              alt=""
              aria-hidden
              className="absolute right-[-14px] top-[2px] h-[16px] w-[16px] md:right-[-18px] md:top-[1px] md:h-[20px] md:w-[20px]"
            />
          </Link>

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href={SIGN_IN_URL}
              onClick={() => trackEvent('sign_in_click', { location: 'header_mobile' })}
              className="text-sm font-semibold text-navy-light transition-colors hover:text-navy"
            >
              Sign in
            </Link>
            <CheckoutButton
              label="Sign up"
              eventName="sign_up_click_header"
              className="px-4 py-2 text-sm font-semibold border-black bg-black text-white hover:bg-black/90"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() =>
                trackEvent('header_nav_click', {
                  label: item.label,
                  href: item.href,
                  location: pathname,
                })
              }
              className={`text-sm tracking-[0.02em] transition-colors ${
                pathname === item.href
                  ? 'font-semibold text-navy'
                  : 'font-medium text-slate-600 hover:text-navy'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Resources dropdown */}
          <div className="relative nav-dropdown-trigger">
            <button
              className="text-sm font-medium text-slate-600 hover:text-navy tracking-[0.02em] transition-colors flex items-center gap-1"
              aria-haspopup="true"
            >
              Resources
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="nav-dropdown absolute top-full right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-navy/5 py-2 z-50">
              {resourceLinks.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    trackEvent('header_resources_click', {
                      label: item.label,
                      href: item.href,
                      location: pathname,
                    })
                  }
                  className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-cream hover:text-navy transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={SIGN_IN_URL}
            onClick={() => trackEvent('sign_in_click', { location: 'header_desktop' })}
            className="text-sm font-semibold text-navy-light transition-colors hover:text-navy"
          >
            Sign in
          </Link>
          <CheckoutButton
            label="Sign up"
            eventName="sign_up_click_header"
            className="px-4 py-2 text-sm font-semibold border-black bg-black text-white hover:bg-black/90"
          />
        </nav>
      </div>
    </header>
  )
}
