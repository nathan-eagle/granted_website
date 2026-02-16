'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CheckoutButton from '@/components/CheckoutButton'
import { trackEvent } from '@/lib/analytics'
import { isSignedIn, getUserName, clearAuthCookies } from '@/lib/auth-status'

const nav = [
  { href: '/grants', label: 'Grants' },
  { href: '/foundations', label: 'Foundations' },
  { href: '/pricing', label: 'Pricing' },
]

const SIGN_IN_URL = 'https://app.grantedai.com/auth/login'

const DASHBOARD_URL = 'https://app.grantedai.com/overview'

export default function Header() {
  const pathname = usePathname()
  const [signedIn, setSignedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    setSignedIn(isSignedIn())
    setUserName(getUserName())
  }, [])

  const handleSignOut = () => {
    clearAuthCookies()
    setSignedIn(false)
    setUserName(null)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-gray-200">
      {/* Gold accent stripe */}
      <div className="h-[3px] bg-gradient-to-r from-brand-yellow via-yellow-300 to-brand-yellow" />

      <div className="container relative h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          onClick={() => trackEvent('header_logo_click', { location: pathname })}
          className="flex items-center shrink-0"
        >
          <Image
            src="/images/logo-wordmark-text.png"
            alt="Granted"
            width={170}
            height={53}
            priority
            className="h-auto w-[120px] md:w-[150px]"
          />
        </Link>

        {/* Center: Nav links — desktop only, absolutely centered */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
        </nav>

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          {signedIn ? (
            <>
              <Link
                href={DASHBOARD_URL}
                className="px-4 py-2 text-sm font-semibold bg-brand-yellow text-navy hover:bg-brand-gold rounded-pill transition-colors"
              >
                Dashboard
              </Link>
              {userName && (
                <span className="text-sm font-medium text-navy truncate max-w-[120px] md:max-w-[160px] hidden sm:inline">
                  {userName}
                </span>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm font-medium text-navy-light/60 hover:text-navy transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href={SIGN_IN_URL}
                onClick={() => trackEvent('sign_in_click', { location: 'header' })}
                className="text-sm font-semibold text-navy-light transition-colors hover:text-navy"
              >
                Sign in
              </Link>
              <CheckoutButton
                label="Sign up"
                eventName="sign_up_click_header"
                className="px-4 py-2 text-sm font-semibold border-black bg-black text-white hover:bg-black/90"
              />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
