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
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg">
          <Image src="/images/logo-star.svg" alt="Granted" width={20} height={20} />
          <span>Granted</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map(item => (
            <Link key={item.href} href={item.href} className={
              `text-[15px] ${pathname === item.href ? 'font-semibold' : 'text-slate-700 hover:text-slate-900'}`
            }>{item.label}</Link>
          ))}
          <Link href="https://app.grantedai.com" className="text-[15px]">Login</Link>
        </nav>
      </div>
    </header>
  )
}
