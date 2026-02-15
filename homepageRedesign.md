# Granted Homepage Redesign - Implementation Plan

This document contains everything a fresh AI agent needs to implement a homepage redesign for the Granted AI marketing site. Read this entire document before writing any code.

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Current File Contents (Verbatim)](#4-current-file-contents-verbatim)
5. [Design System Reference](#5-design-system-reference)
6. [Persona Review Findings (CRITICAL -- read before coding)](#6-persona-review-findings)
7. [Implementation Plan A: Trust Infrastructure (DO FIRST)](#7-implementation-plan-a-trust-infrastructure)
8. [Implementation Plan B: Content Accuracy & Product Evidence](#8-implementation-plan-b-content-accuracy--product-evidence)
9. [Implementation Plan C: Layout Restructure](#9-implementation-plan-c-layout-restructure)
10. [Implementation Plan D: Motion & Animation (LOWER PRIORITY)](#10-implementation-plan-d-motion--animation)
11. [Implementation Plan E: Technical Notes](#11-implementation-plan-e-technical-notes)
12. [Implementation Plan F: SEO & Follow-ups](#12-implementation-plan-f-seo--follow-ups)
13. [Implementation Order](#13-implementation-order)

---

## 1. Project Context

**What is Granted?** An AI-powered grant writing assistant. The product is an AI "grant coach" that analyzes RFPs, discovers required sections, asks clarifying questions, and drafts complete grant proposals section by section.

**This repo** is the **marketing website** (`grantedai.com`). It is a **separate git repository** from the product app:

| | Marketing Site | Product App |
|---|---|---|
| Repo | `github.com/nathan-eagle/granted_website.git` | `granted-mvp/` (separate repo) |
| Domain | `grantedai.com` | `app.grantedai.com` |
| Deploy | Vercel auto-deploy on push to `main` | Separate Vercel project |
| Path on disk | `/Users/natecow/Documents/Python/Granted/site/` | `/Users/natecow/Documents/Python/Granted/granted-mvp/` |

**Deployment:** Push to `main` branch triggers Vercel auto-deploy. There is no staging environment -- `main` is production.

**Sign-in flow:** The marketing site has a "Sign in" link that goes to `https://app.grantedai.com/api/auth/signin?callbackUrl=/overview` (Google OAuth via Supabase on the product app). The "Sign up" / CTA buttons use `<CheckoutButton>`, which redirects to Stripe checkout (with a fallback to the same OAuth URL if Stripe env vars are not set).

---

## 2. Tech Stack

- **Framework:** Next.js 14.2.5 (App Router) with TypeScript 5.4.5
- **CSS:** Tailwind CSS 3.4.4 with `@tailwindcss/typography` plugin
- **PostCSS:** Standard `tailwindcss` + `autoprefixer` pipeline
- **Fonts:** Instrument Serif (display headings, loaded via Google Fonts `<link>` tag) + DM Sans (body, loaded via `next/font/google` as CSS variable `--font-body`)
- **Animation libraries:** NONE installed. CSS-only animations currently. Can install `framer-motion` if needed.
- **Static generation:** Most pages use `force-static`
- **MDX blog:** 35 posts in `content/blog/`
- **React:** 18.2.0
- **Node:** >=18.18.0

**Installed dependencies (from package.json):**
```
next: 14.2.5, react: 18.2.0, stripe: 14.19.0, gray-matter: 4.0.3,
next-mdx-remote: 5.0.0, rehype-slug: 6.0.0, remark-gfm: 4.0.0,
resend: 3.2.0, turndown: 7.2.0
```

**Dev dependencies:**
```
tailwindcss: 3.4.4, typescript: 5.4.5, postcss: 8.4.38,
autoprefixer: 10.4.19, @tailwindcss/typography: 0.5.13,
eslint: 8.57.0, eslint-config-next: 14.2.5, playwright: 1.47.2
```

---

## 3. Repository Structure

```
site/
  app/
    page.tsx              <-- HOMEPAGE (primary file to redesign)
    layout.tsx            <-- Root layout (font loading, metadata)
    globals.css           <-- Global styles, heading classes, utility classes
    blog/
      page.tsx            <-- Blog index
      [slug]/page.tsx     <-- Blog post
    features/page.tsx
    tech/page.tsx
    faq/page.tsx
    pricing/page.tsx
    contact/page.tsx
  components/
    Header.tsx            <-- Site header (client component, uses usePathname)
    Footer.tsx            <-- Site footer
    Container.tsx         <-- Simple <div className="container" /> wrapper
    CheckoutButton.tsx    <-- CTA button -> Stripe checkout (fallback to OAuth)
    ButtonLink.tsx        <-- Styled link component (variants: primary/ghost)
    PricingTable.tsx      <-- Pricing toggle + plan cards
    ContactForm.tsx       <-- Contact form
  hooks/                  <-- DOES NOT EXIST YET (needs to be created)
  public/images/
    logo-wordmark.png     <-- Granted logo
    logo-star.svg         <-- Star logo icon
    hero-figure.png       <-- Abstract/product figure (used in homepage)
    portrait-1.png        <-- Stock portrait (used in homepage)
    portrait-2.png        <-- Stock portrait (used in homepage)
    granted-favicon.jpg
    tech3.jpg
    img1-1.jpg, img1-2.jpg, img2-1.jpg, img2-2.jpg, img3.jpg, img4-1.jpg
    imgi_*.png/jpg/gif    <-- Various imported images
  content/blog/           <-- 35 MDX blog posts
  tailwind.config.ts      <-- Tailwind config with custom colors/fonts
  postcss.config.js       <-- PostCSS config (tailwindcss + autoprefixer)
  tsconfig.json           <-- TypeScript config (strict mode, paths: @/* -> ./*)
  package.json
```

**Path alias:** `@/*` maps to the project root (`./`). So `@/components/Header` resolves to `./components/Header.tsx`.

---

## 4. Current File Contents (Verbatim)

### 4a. `app/page.tsx` (HOMEPAGE - the file being redesigned)

```tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-32 md:py-40">
            <div className="mx-auto max-w-3xl text-center relative z-10">
              <h1 className="heading-display">You have better things to do with your time</h1>
              <p className="mt-6 text-lg md:text-2xl font-semibold text-brand-yellow">
                Get your projects funded faster with AI
              </p>
              <p className="body-lg mx-auto mt-6 text-white/70">
                Studies show grant applicants spend 40% of their time fundraising. It&apos;s time to get back to the real work.
                Granted&apos;s specialized AI is trained on over half a million successful grant proposals. Say hello to your fundraising copilot.
              </p>
              <div className="mt-10">
                <CheckoutButton label="Start Writing" />
              </div>
            </div>
          </Container>
        </section>

        {/* ── Gold rule divider ── */}
        <div className="gold-rule" />

        {/* ── Quality of ideas ── */}
        <section>
          <Container className="py-28 md:py-32 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="heading-xl">Granted ensures it&apos;s the quality of your ideas that counts, not your English.</h2>
              <p className="body-lg mt-6 text-navy-light">
                Instantly generate high-quality drafts for a wide range of grant proposals, appeals, letters of support, articles, and more, just by entering simple information about your project.
              </p>
              <div className="mt-8">
                <ButtonLink href="/features" variant="ghost" className="px-6">
                  Discover more features →
                </ButtonLink>
              </div>
            </div>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg">
              <Image src="/images/hero-figure.png" alt="Granted" fill className="object-contain" sizes="(min-width: 1024px) 480px, 80vw" />
            </div>
          </Container>
        </section>

        {/* ── Use cases ── */}
        <section>
          <Container className="py-28 md:py-32 grid items-center gap-12 lg:grid-cols-2">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm lg:max-w-md">
              <Image src="/images/portrait-1.png" alt="Use cases" fill className="object-contain" sizes="(min-width: 1024px) 420px, 70vw" />
            </div>
            <div>
              <h3 className="heading-lg">From a $100 donor appeal to a $1 million NIH R01 grant.</h3>
              <ul className="body-lg mt-6 space-y-2.5 list-disc pl-6 text-navy-light">
                <li>Quickly assemble full fundraising proposals.</li>
                <li>Granted&apos;s AI is specifically trained for grant proposal writing and produces superior outcomes compared to general-purpose AI writing tools.</li>
                <li>50+ writing models to help draft highly personalized fundraising proposals.</li>
                <li>Specialized models for federal grants.</li>
                <li>Custom engineered for nearly every section of many NIH and NSF grants.</li>
                <li>Improve how you explain your work with specialized AI feedback.</li>
                <li>Keep donors in the loop with well-written project updates.</li>
              </ul>
            </div>
          </Container>
        </section>

        {/* ── Yellow banner CTA ── */}
        <section>
          <Container className="py-16 md:py-20">
            <div className="banner-yellow rounded-[32px] px-10 py-16 text-center md:px-16 md:py-20">
              <h3 className="heading-lg text-navy">
                Let us write your next draft,
                <br className="hidden md:block" />
                no strings attached.
              </h3>
              <p className="body-lg mx-auto mt-6 max-w-2xl text-navy/70">
                See what Granted can do for you in just a few minutes and leave with the content you need.
              </p>
              <div className="mt-8">
                <CheckoutButton label="Start a 7-day free trial" />
              </div>
            </div>
          </Container>
        </section>

        {/* ── 3 Steps ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-36">
            <h2 className="heading-lg text-center">3 Steps To Your Fastest Funding Ever</h2>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Create a new project.',
                  body: 'Enter your mission statement and describe your work.'
                },
                {
                  title: 'Select a model and complete the prompt.',
                  body: 'Each of the 50+ models require essential information, such as key personnel, values, funding request amount, and project description.'
                },
                {
                  title: 'Watch as Granted creates a quality draft in seconds.',
                  body: 'Pick your favorite draft and go. Or copy it into a larger document in the editor to assemble your full proposal.'
                },
              ].map((card, i) => (
                <div key={card.title} className="card flex h-full flex-col gap-5 p-10">
                  <div className="font-display text-[3.75rem] leading-none text-brand-yellow">{i + 1}</div>
                  <h3 className="text-lg font-semibold text-navy">{card.title}</h3>
                  <p className="text-base text-navy-light leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Equity section ── */}
        <section>
          <Container className="py-28 md:py-32 grid items-center gap-12 lg:grid-cols-2">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm lg:max-w-md">
              <Image src="/images/portrait-2.png" alt="Equity" fill className="object-contain" sizes="(min-width: 1024px) 420px, 70vw" />
            </div>
            <div>
              <h2 className="heading-lg">Level the fundraising playing field.</h2>
              <p className="body-lg mt-6 text-navy-light">
                The fundraising game isn&apos;t fair. The submission and selection process has well-known equity issues that disproportionately affect the careers of women, minorities, and non-native English speakers.
              </p>
              <p className="body-lg mt-4 text-navy-light">
                Granted&apos;s mission is to make fundraising less tedious, more accessible, and more successful for everyone — while freeing up millions of additional hours of productivity.
              </p>
            </div>
          </Container>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 text-center md:py-32 relative z-10">
            <h3 className="heading-lg text-white">Ready to Get Granted?</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Save time. Stop frustration. Get inspired. Start your free trial today.
            </p>
            <div className="mt-10">
              <CheckoutButton label="Start Writing" />
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  )
}
```

### 4b. `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body {
    @apply antialiased bg-cream text-navy text-base leading-relaxed;
  }
  h1, h2, h3 {
    @apply tracking-tight;
  }
  details summary::-webkit-details-marker {
    display: none;
  }
}

/* ── Display headings (Instrument Serif) ── */
.heading-display {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2.75rem, 6vw, 5.5rem);
  line-height: 1.02;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.heading-xl {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2.25rem, 4vw, 3.75rem);
  line-height: 1.08;
  font-weight: 400;
  letter-spacing: -0.015em;
}

.heading-lg {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(1.875rem, 3.5vw, 3rem);
  line-height: 1.1;
  font-weight: 400;
}

/* ── Sans headings (DM Sans) ── */
.heading-md {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  line-height: 1.15;
  font-weight: 700;
}

/* ── Body copy ── */
.body-lg {
  font-size: clamp(1.0625rem, 2vw, 1.1875rem);
  line-height: 1.7;
}

.body-sm {
  font-size: 0.875rem;
  line-height: 1.7;
}

/* ── Container ── */
.container {
  @apply mx-auto max-w-[1200px] px-6 md:px-8;
}

/* ── Buttons ── */
.button {
  @apply inline-flex items-center justify-center gap-2 rounded-pill px-7 min-h-[3.25rem] text-base font-semibold transition-colors duration-150;
}
.button-primary {
  @apply bg-brand-yellow text-navy hover:bg-brand-gold;
}
.button-ghost {
  @apply border border-navy/20 bg-transparent text-navy hover:border-navy/40 hover:bg-navy/5;
}

/* ── Cards ── */
.card {
  border-radius: 24px;
  background-color: #ffffff;
  box-shadow: 0 8px 30px rgba(10, 22, 40, 0.06);
}

/* ── Yellow gradient banner ── */
.banner-yellow {
  background: linear-gradient(180deg, #FFEFB1 0%, #F5CF49 100%);
}

/* ── Noise texture overlay (apply to dark sections) ── */
.noise-overlay {
  position: relative;
}
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.035;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
}

/* ── Gold accent rule ── */
.gold-rule {
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #F5CF49 20%, #F5CF49 80%, transparent 100%);
}
```

### 4c. `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          yellow: '#F5CF49',
          gold: '#f2c833',
          black: '#000000',
        },
        navy: {
          DEFAULT: '#0A1628',
          light: '#1A2B4A',
          mid: '#132038',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F2EDE4',
        },
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
```

### 4d. `app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' })

export const metadata: Metadata = {
  title: {
    default: 'Granted AI - Get Funded Faster.',
    template: '%s | Granted AI',
  },
  description: 'Get your projects funded faster with AI. Granted is trained on over half a million successful grant proposals.',
  metadataBase: new URL('https://grantedai.com'),
  icons: { icon: '/favicon.ico' },
  openGraph: {
    siteName: 'Granted AI',
    type: 'website',
    locale: 'en_US',
    url: 'https://grantedai.com',
    title: 'Granted AI - Get Funded Faster.',
    description: 'Get your projects funded faster with AI. Granted is trained on over half a million successful grant proposals.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@GrantedAI',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Instrument Serif — editorial display font (Google Fonts) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${dmSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
```

### 4e. `components/Header.tsx`

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CheckoutButton from '@/components/CheckoutButton'

const nav = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/tech', label: 'Technology' },
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
```

### 4f. `components/CheckoutButton.tsx`

```tsx
'use client'

import { useState } from 'react'

type CheckoutPlan = 'monthly' | 'yearly'

interface CheckoutButtonProps {
  plan?: CheckoutPlan
  label?: string
  className?: string
}

export default function CheckoutButton({
  plan = 'monthly',
  label = 'Start Writing',
  className = '',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  async function go() {
    setLoading(true)
    const url = plan === 'yearly'
      ? process.env.NEXT_PUBLIC_STRIPE_YEARLY_URL
      : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL
    if (url) {
      window.location.href = url
    } else {
      // Fallback to Google OAuth sign-in when Stripe URLs aren't configured
      window.location.href = 'https://app.grantedai.com/api/auth/signin?callbackUrl=/overview'
    }
  }
  const baseStyles =
    'inline-flex items-center justify-center rounded-md border border-yellow-500 bg-yellow-400 px-6 py-3 font-semibold text-black shadow transition hover:bg-yellow-300 disabled:opacity-60'
  const buttonClassName = `${baseStyles} ${className}`.trim()

  return (
    <button
      type="button"
      onClick={go}
      disabled={loading}
      className={buttonClassName}
      aria-busy={loading}
    >
      {loading ? 'Redirecting…' : label}
    </button>
  )
}
```

### 4g. `components/ButtonLink.tsx`

```tsx
import { ComponentProps } from 'react'
import Link from 'next/link'

type Props = ComponentProps<'a'> & { href: string; variant?: 'primary' | 'ghost' }

export function ButtonLink({ href, children, className = '', variant = 'primary', ...rest }: Props) {
  const base = 'button ' + (variant === 'primary' ? 'button-primary' : 'button-ghost')
  return <Link href={href} className={base + ' ' + className} {...rest}>{children}</Link>
}
```

### 4h. `components/Container.tsx`

```tsx
export default function Container({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={['container', className].filter(Boolean).join(' ')}>{children}</div>
}
```

### 4i. `components/Footer.tsx`

```tsx
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
```

### 4j. `components/PricingTable.tsx`

```tsx
'use client'

import { useState } from 'react'
import CheckoutButton from '@/components/CheckoutButton'

const PLANS = [
  {
    name: 'Basic',
    badge: null as string | null,
    monthly: {
      price: '$29',
      cadence: 'per month billed monthly',
      note: null as string | null,
    },
    annual: {
      price: '$290',
      cadence: 'per year (save 2 months)',
      note: 'Effective rate $24/mo when billed annually',
    },
    features: [
      '20k words per month',
      '30+ Writing Models',
      'AI Idea Generators',
      'Unlimited Projects',
    ],
  },
  {
    name: 'Professional',
    badge: 'Most Popular',
    monthly: {
      price: '$89',
      cadence: 'per month billed monthly',
      note: null as string | null,
    },
    annual: {
      price: '$890',
      cadence: 'per year (save 2 months)',
      note: 'Effective rate $74/mo when billed annually',
    },
    features: [
      'Unlimited words',
      'Early Access to New Features',
      '30+ Writing Models',
      'AI Idea Generators',
      'Unlimited Projects',
    ],
  },
]

const BILLING = [
  { id: 'monthly' as const, label: 'Monthly' },
  { id: 'annual' as const, label: 'Annual', helper: '2 months free' },
]

export function PricingTable() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {BILLING.map(option => {
          const isActive = billing === option.id
          return (
            <button
              key={option.id}
              type="button"
              className={`button ${isActive ? 'button-primary' : 'button-ghost'}`}
              onClick={() => setBilling(option.id)}
              aria-pressed={isActive}
            >
              <span>{option.label}</span>
              {option.helper && (
                <span className="ml-2 rounded-pill bg-white/70 px-2 py-0.5 text-xs font-semibold text-navy">
                  {option.helper}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {PLANS.map(plan => {
          const current = plan[billing]
          return (
            <div key={plan.name} className="relative">
              {plan.badge ? (
                <span className="absolute -top-4 right-6 rounded-pill bg-navy px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              ) : null}
              <div className="card flex h-full flex-col gap-6 p-10">
                <div>
                  <h2 className="text-2xl font-semibold text-navy">{plan.name}</h2>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-navy">{current.price}</span>
                    <span className="text-sm font-medium uppercase tracking-[0.08em] text-navy-light/60">
                      {current.cadence}
                    </span>
                  </div>
                  {current.note ? (
                    <p className="body-sm mt-3 text-navy-light/60">{current.note}</p>
                  ) : null}
                </div>
                <ul className="body-lg space-y-2.5 list-disc pl-6 text-navy-light">
                  {plan.features.map(feature => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <CheckoutButton
                  plan={billing === 'annual' ? 'yearly' : 'monthly'}
                  label="Start free trial"
                  className="mt-auto w-full"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### 4k. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] },
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.mdx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4l. `postcss.config.js`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 5. Design System Reference

### Colors (from `tailwind.config.ts`)

| Token | Hex | Usage |
|---|---|---|
| `brand-yellow` | `#F5CF49` | Primary CTA, accents, step numbers |
| `brand-gold` | `#f2c833` | CTA hover state |
| `brand-black` | `#000000` | Sign-up button bg |
| `navy` (DEFAULT) | `#0A1628` | Dark backgrounds, primary text |
| `navy-light` | `#1A2B4A` | Secondary text |
| `navy-mid` | `#132038` | Intermediate dark |
| `cream` (DEFAULT) | `#FAF7F2` | Page background |
| `cream-dark` | `#F2EDE4` | Alternate section bg (3-step cards) |

### Typography

| Class | Font | Size | Line-height | Use |
|---|---|---|---|---|
| `.heading-display` | Instrument Serif | clamp(2.75rem, 6vw, 5.5rem) | 1.02 | Hero h1 only |
| `.heading-xl` | Instrument Serif | clamp(2.25rem, 4vw, 3.75rem) | 1.08 | Major section headings |
| `.heading-lg` | Instrument Serif | clamp(1.875rem, 3.5vw, 3rem) | 1.1 | Sub-section headings |
| `.heading-md` | DM Sans (bold) | clamp(1.5rem, 3vw, 2.25rem) | 1.15 | Sans serif headings |
| `.body-lg` | DM Sans | clamp(1.0625rem, 2vw, 1.1875rem) | 1.7 | Main body copy |
| `.body-sm` | DM Sans | 0.875rem | 1.7 | Small text |
| `font-display` | Tailwind class for Instrument Serif (via `fontFamily.display` in config) | | | Inline use |
| `font-sans` | Tailwind class for DM Sans (via `fontFamily.sans` in config, `--font-body` CSS var) | | | Default body |

### Utility Classes (from `globals.css`)

| Class | Description |
|---|---|
| `.container` | `mx-auto max-w-[1200px] px-6 md:px-8` |
| `.button` | Inline-flex, pill rounded, 3.25rem min-height, semibold |
| `.button-primary` | Yellow bg, navy text, gold hover |
| `.button-ghost` | Transparent bg, navy border, subtle hover |
| `.card` | White bg, 24px radius, soft shadow |
| `.banner-yellow` | Yellow gradient (light to saturated) |
| `.noise-overlay` | Pseudo-element with SVG noise texture at 3.5% opacity |
| `.gold-rule` | 2px gold gradient line (fades at edges) |

### Available Images (`public/images/`)

```
logo-wordmark.png        -- Granted logo (used in Header + Footer)
logo-star.svg            -- Star icon logo
hero-figure.png          -- Abstract figure (currently in hero split)
portrait-1.png           -- Stock portrait (currently in use-cases section)
portrait-2.png           -- Stock portrait (currently in equity section)
granted-favicon.jpg      -- Favicon source
tech3.jpg                -- Tech page image
img1-1.jpg, img1-2.jpg, img2-1.jpg, img2-2.jpg, img3.jpg, img4-1.jpg  -- Blog/misc images
imgi_1_default.gif, imgi_10_granted-logo-stars-1.png, imgi_2_granted-logo-stars.png
imgi_7_img1.jpg, imgi_8_img2.jpg, imgi_9_img3.jpg
```

---

## 6. Persona Review Findings

> **CRITICAL: Read this section before writing any code. It changes the priority order of the entire plan.**

This redesign plan was reviewed by 5 grant writer personas representing the full spectrum of Granted's target market. Their unanimous finding: **the product is better than the marketing.** The actual Granted workflow (RFP analysis, AI coach Q&A, section-by-section drafting with coverage tracking) is genuinely differentiated, but the website describes a different, older product while failing to address universal trust concerns.

### Reviewers

| Persona | Organization | Segment |
|---------|-------------|---------|
| **Marisol Rivera** | WE ACT for Environmental Justice (NYC nonprofit) | Mid-size nonprofit, EPA/HUD grants, $12M portfolio |
| **Dr. Priya Nandakumar** | University of Washington (R1 academic) | Academic PI, NSF/NOAA grants, $2.8M funded |
| **Ethan J. Park** | RAND Corporation (defense think tank) | Defense/IC proposals, DARPA BAAs, $45M captured |
| **TJ Jackson** | Black Belt Community Foundation (small CBO, Selma AL) | First-time federal applicant, 6 staff, $800K budget |
| **Dr. Angela Crow Feather** | Sitting Bull College (tribal college, Standing Rock) | TCU researcher, data sovereignty, $1.2M funded |

### Consensus Priority Order

| Priority | Issue | Unanimous? |
|----------|-------|-----------|
| **P0** | Data privacy/security statement + complete FAQ answers | Yes -- all 5 flagged as dealbreaker |
| **P1** | Fix all product descriptions to match actual product (tech page, 3-step flow, feature lists) | 3 of 5 ranked #1 |
| **P2** | Real product evidence (screenshots, sample output, or demo video) | 4 of 5 in top 3 |
| **P3** | Remove placeholder testimonials + stock photos | 3 of 5 in top 3 |
| **P4** | Expand agency list + rewrite equity section with structural language | 3 of 5 in top 3 |
| **HM** | Nonprofit/education pricing signal | All 5 mentioned, none ranked #1 |

### Key Quotes

- **Ethan (RAND):** "Fix the trust deficit before the typography."
- **Priya (UW):** "Fix the trust signals first, then worry about animations."
- **TJ (BBCF):** "'50+ writing models' means nothing to me. Is that 50 types of grants?"
- **Angela (SBC):** "I literally cannot use this tool until I can show my Tribal Council IRB a written data handling policy."
- **Marisol (WE ACT):** "The site would make me curious enough to click around, but not confident enough to enter my credit card."

### What This Means for Implementation

The original plan prioritized visual polish (animations, layout) over content accuracy and trust infrastructure. The persona review inverts this. The revised plan structure is:

1. **Phase 1: Trust Infrastructure** -- privacy page, FAQ answers, tech page rewrite, product copy fixes
2. **Phase 2: Content Accuracy & Product Evidence** -- screenshots, audience messaging, equity rewrite, agency list
3. **Phase 3: Layout Restructure** -- stats bar, step cards, illustrations (the original Plan B)
4. **Phase 4: Animation Polish** -- hero entrance, scroll reveals, shimmer effects (the original Plan A, deprioritized)

Full persona review details are in `persona-review-consensus.md`.

---

## 7. Implementation Plan A: Trust Infrastructure

> **DO THIS FIRST -- before any visual/layout work. All 5 personas flagged these as prerequisites to conversion.**

### A1. Complete All FAQ Answers

**Problem:** The FAQ page (`app/faq/page.tsx`) has questions with 100% placeholder text. The question "Can I trust Granted with highly sensitive or protected information?" is literally unanswered. This is actively damaging credibility.

**Required:** Write real answers for every FAQ question. Priority questions:
- Can I trust Granted with highly sensitive or protected information?
- Is my data used to train AI models?
- How does Granted handle my uploaded documents?
- What happens to my data if I cancel my subscription?
- Who has access to my proposal content?

### A2. Create `/security` (or `/trust`) Page

**Create new file: `app/security/page.tsx`**

This page must cover:

1. **Data handling:** "Your proposals are processed to generate drafts but are never used to train AI models."
2. **Third-party APIs:** "Granted uses OpenAI's API to power its AI coach. Your data is processed under OpenAI's data processing agreement, which prohibits use of API inputs for model training."
3. **Data residency:** "All data is stored on US-based servers."
4. **Encryption:** "Data is encrypted in transit (TLS 1.2+) and at rest (AES-256)."
5. **Data deletion:** "You can permanently delete all your data at any time from your account settings. Deletion is immediate and irreversible."
6. **Data sovereignty statement:** "We understand that some institutions -- including tribal colleges, tribal nations, and Indigenous-serving organizations -- operate under data sovereignty frameworks that require community governance over research data. You retain full ownership of all uploaded content. All data can be permanently deleted at any time. No data is shared with third parties beyond what is necessary for AI processing."
7. **FERPA:** "Granted is aware of FERPA requirements for educational institutions. We do not store student records and our data handling practices are compatible with institutional FERPA policies."
8. **No secondary use:** "Your uploaded RFPs, answers to coach questions, and generated drafts are used solely to provide the service. They are never shared, sold, aggregated, anonymized for research, or used to improve our models."

**SEO metadata:** Title "Security & Data Privacy", description covering data handling and trust.

### A3. Add Homepage Trust Statement

**Edit `app/page.tsx`:** Add a trust statement near the primary CTA in the hero section.

```tsx
{/* Trust statement */}
<p className="mt-6 text-sm text-white/50">
  Your proposals are never used to train AI. Data encrypted. Delete anytime.{' '}
  <a href="/security" className="underline hover:text-white/70">Learn more →</a>
</p>
```

Place this immediately after the CTA button div in the hero section.

### A4. Add "Security" to Main Navigation

**Edit `components/Header.tsx`:** Add a "Security" link to the `nav` array:

```tsx
const nav = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/tech', label: 'Technology' },
  { href: '/security', label: 'Security' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
]
```

### A5. Rewrite Technology Page

**Edit `app/tech/page.tsx`:** Complete rewrite required.

**Remove all references to:**
- FAISS
- LangChain
- AutoGPT
- "model weights finetuned by leading fundraising experts"
- "recurrent loops of reflection and evaluation"
- "50+ writing models" / "30+ writing models"
- "615,000 successful grant proposals" (unless this number can be verified and sourced)

**Replace with accurate description of current product architecture:**

1. **RFP Analysis:** "Upload your RFP or grant guidelines. Granted's AI reads the full document and identifies every required section, evaluation criterion, and compliance requirement."
2. **Requirement Discovery:** "The system discovers the grant's structure -- from project narratives and budget justifications to data management plans and letters of support -- so nothing gets missed."
3. **AI Grant Coach Q&A:** "An AI coach asks you targeted questions about your organization, team, project goals, and budget. Your answers ground every section of the draft in your real data."
4. **Coverage Tracking:** "Granted tracks which requirements have been addressed and which still need attention. You can see your coverage percentage in real time as the coach gathers information."
5. **Section-by-Section Drafting:** "Each section is drafted individually using your specific answers and the RFP's requirements. No generic templates, no placeholders -- every paragraph is grounded in what you told the coach."
6. **What makes this different from ChatGPT:** "General-purpose AI tools don't read your RFP, don't know what sections are required, don't track coverage, and don't ground their output in your organization's specific data. Granted does all of these."

**Include a workflow diagram** (can be a simple numbered list with icons, similar to the 3-step section but with more technical detail).

**Keep and expand the data privacy statement** -- reference the new `/security` page.

### A6. Fix 3-Step Workflow Copy (Content Accuracy)

**Edit `app/page.tsx`:** This is NOT a cosmetic copy update -- the current steps describe a product that no longer exists.

**Current (WRONG -- describes old product):**
```
Step 1: "Create a new project." / "Enter your mission statement..."
Step 2: "Select a model and complete the prompt." / "Each of the 50+ models..."
Step 3: "Watch as Granted creates a quality draft in seconds." / "Pick your favorite draft..."
```

**Replacement (ACCURATE -- describes current product):**
```
Step 1: "Upload your RFP or grant guidelines." / "Granted reads and analyzes the full document, identifying every section and requirement."
Step 2: "Answer a few questions from your AI coach." / "The grant coach asks targeted questions about your organization, project, and goals to gather the details it needs."
Step 3: "Get a complete, grounded first draft." / "Granted drafts every section of your proposal using your real data -- no placeholders, no filler."
```

### A7. Remove "50+ Writing Models" Language Everywhere

**Search and replace across all files.** This language appears in:
- `app/page.tsx` (Use Cases bullet list)
- `components/PricingTable.tsx` ("30+ Writing Models" feature)
- Possibly `app/tech/page.tsx`

Replace with accurate feature descriptions:
- "30+ Writing Models" → "AI Grant Coach" or "Section-by-Section Drafting"
- "50+ writing models" → "AI-powered section drafting for federal grants"
- "AI Idea Generators" → "RFP Analysis & Requirement Discovery"

---

## 8. Implementation Plan B: Content Accuracy & Product Evidence

### B1. Replace Stock Photos with Product Evidence

**Problem:** All 5 personas flagged stock photos (`portrait-1.png`, `portrait-2.png`) as harmful to credibility. "Nobody on my team looks like they belong in that photo" (TJ). "Generic stock photos of smiling professionals are worse than no photos at all for communities that are chronically underrepresented" (Angela).

**Required changes:**

1. **portrait-1.png (Use Cases section):** Replace with a product screenshot or the CSS `DocumentStack` illustration (see C3 below). Ideal: a screenshot of the AI coach mid-conversation.
2. **portrait-2.png (Equity section):** Remove the image entirely. Convert the equity section to a full-width centered text block with a decorative gold border accent.
3. **hero-figure.png (Quality of Ideas section):** Replace with a real product workspace screenshot if available, otherwise use CSS illustration.

**Do NOT replace stock photos with different stock photos.** Use real product evidence or abstract CSS/SVG visuals.

### B2. Add Product Screenshot or Sample Output

**Consensus: 4 of 5 personas explicitly requested seeing actual output before signing up.**

**Options (in order of preference):**

1. **Real product screenshot:** Take a screenshot of app.grantedai.com showing the AI coach analyzing an RFP or a drafted section with coverage indicators. Save as `/public/images/product-workspace.png`.
2. **Sample output comparison:** Create a section showing "What you tell the coach" (3-4 bullet points of user input) alongside "What Granted drafts" (a realistic paragraph of grant narrative). Suggested examples:
   - NSF Broader Impacts section (for academic audience)
   - EPA Environmental Justice work plan (for nonprofit audience)
   - USDA Community Facilities narrative (for community org audience)
3. **60-second demo video:** A screen recording of the upload-to-draft workflow. Embed or link from homepage.
4. **CSS mockup (interim):** A styled component that looks like a UI window with draft text and coverage percentage. Use the `DocumentStack` component from C3 as a fallback.

### B3. Update Agency Logos Section

**Edit `components/AgencyLogos.tsx`:** Expand the agency list and fix the label.

```tsx
const AGENCIES = [
  { name: 'NIH', full: 'National Institutes of Health' },
  { name: 'NSF', full: 'National Science Foundation' },
  { name: 'EPA', full: 'Environmental Protection Agency' },
  { name: 'USDA', full: 'U.S. Department of Agriculture' },
  { name: 'DARPA', full: 'Defense Advanced Research Projects Agency' },
  { name: 'DOE', full: 'Department of Energy' },
  { name: 'NOAA', full: 'National Oceanic and Atmospheric Administration' },
  { name: 'HUD', full: 'Department of Housing and Urban Development' },
  { name: 'HRSA', full: 'Health Resources and Services Administration' },
  { name: 'IHS', full: 'Indian Health Service' },
]
```

**Change the label** from "Trusted by researchers applying to" to:
```tsx
<p className="...">Built for applications to</p>
```

**Why:** "Trusted by" implies existing institutional relationships that don't exist. "Built for" is accurate and defensible. (Flagged by Priya, Marisol, Ethan.)

### B4. Add "Who Is This For?" Audience Section

**Create new section in `app/page.tsx`** or new component `components/AudienceSection.tsx`.

**Goal:** Explicitly name the audiences Granted serves -- not just "researchers."

```tsx
const AUDIENCES = [
  {
    heading: 'Academic Researchers',
    body: 'Writing NSF, NIH, DOE, or NOAA proposals. From your first R01 to your fifth CAREER renewal.',
    icon: '🎓', // or inline SVG
  },
  {
    heading: 'Nonprofits & Community Organizations',
    body: 'Applying for EPA, USDA, HUD, or HRSA grants. No grants department required.',
    icon: '🏘️',
  },
  {
    heading: 'Tribal Colleges & Indigenous-Serving Institutions',
    body: 'NSF TCUP, EPA IGAP, IHS, and BIA programs. Your data stays yours.',
    icon: '🌿',
  },
  {
    heading: 'First-Time Federal Applicants',
    body: 'Never written a federal grant before? The AI coach walks you through every section.',
    icon: '🚀',
  },
]
```

**Key messaging line (from TJ, endorsed by Marisol and Priya):**
> "No grants department required. Granted is the grants office you can't afford to hire."

**Placement:** After the Use Cases / product value prop section, before the equity section.

### B5. Rewrite Equity Section

**Edit the equity section in `app/page.tsx`.**

**Current (problematic):**
```
"The fundraising game isn't fair. The submission and selection process has well-known equity issues that disproportionately affect the careers of women, minorities, and non-native English speakers."
```

**Problems flagged:**
- "minorities" is a dated term (Angela)
- Language is vague and performative without product-specific backing (Marisol, TJ)
- Reads as written for academics, not for community organizations (TJ)

**Replacement:**
```tsx
<h2 className="heading-lg">The grants office you can't afford to hire.</h2>
<p className="body-lg mt-6 text-navy-light">
  The grant system has always favored organizations with dedicated grants departments and expensive consultants. We built Granted to change that.
</p>
<p className="body-lg mt-4 text-navy-light">
  Whether you're a community nonprofit with a six-person team, a tribal college building research capacity from scratch, or an early-career researcher writing your first independent proposal -- Granted gives you the same AI-powered coaching that levels the playing field.
</p>
<p className="body-lg mt-4 text-navy-light">
  A professional grant writer charges $5,000–$15,000 per proposal. Granted costs $29/month.
</p>
```

**Also remove portrait-2.png** from this section. Make it a full-width centered text block.

### B6. Handle Testimonials Correctly

**CRITICAL: Do NOT ship placeholder testimonials with fabricated names.**

All 5 personas agreed: fake testimonials (even labeled as placeholders in the codebase) would destroy credibility if they reach production.

**Options (in order of preference):**

1. **Use real testimonials** from beta users (with attribution and written permission)
2. **Remove the testimonials section entirely** and replace with a "Join our pilot program" CTA:
   ```tsx
   <section className="bg-cream-dark">
     <div className="container py-20 md:py-28 text-center">
       <h2 className="heading-lg mb-6">Join 50+ grant writers testing Granted</h2>
       <p className="body-lg text-navy-light max-w-2xl mx-auto">
         We're building Granted with real feedback from researchers, nonprofits, and community organizations. Try it free and tell us what you think.
       </p>
       <div className="mt-8">
         <CheckoutButton label="Start your free trial" />
       </div>
     </div>
   </section>
   ```
3. **If placeholders are used temporarily** (for layout testing only, never deployed), they MUST represent audience diversity: include a community foundation director, tribal program coordinator, and first-time federal applicant -- not three university researchers.

### B7. Update Hero Copy

**Keep the headline** ("You have better things to do with your time") -- it resonated with 4 of 5 personas.

**Update the subtitle and body copy:**

Current subtitle: "Get your projects funded faster with AI"

**Recommended update:**
```tsx
<p className="mt-6 text-lg md:text-2xl font-semibold text-brand-yellow">
  Your AI grant coach -- from NIH R01s to community development grants
</p>
<p className="body-lg mx-auto mt-6 text-white/70">
  Upload your RFP. Answer a few questions. Get a complete, grounded first draft
  of every section -- project narrative, budget justification, and everything in between.
</p>
```

**Remove:**
- "trained on over half a million successful grant proposals" (unverifiable claim, flagged by Marisol and Priya)
- "fundraising copilot" (conflates fundraising with grant writing, flagged by Priya)
- "Say hello to your fundraising copilot" (same issue)

### B8. Add Nonprofit Pricing Signal

**Edit `app/pricing/page.tsx` or `components/PricingTable.tsx`:**

Add below the pricing table:
```tsx
<p className="text-center text-sm text-navy-light/60 mt-8">
  Nonprofit or educational institution?{' '}
  <a href="/contact" className="underline hover:text-navy">Contact us for special pricing.</a>
</p>
```

This costs nothing to implement and signals awareness of the nonprofit/education market.

### B9. Add Team/About Page

**Create `app/about/page.tsx`** with:
- Who built Granted and their credentials (in grants and in AI)
- Company mission
- Brief background

**Why:** "At RAND we evaluate the team before the technology" (Ethan). Trust requires knowing who is behind the product.

---

## 9. Implementation Plan C: Layout Restructure

> **These layout items are Phase 3 -- implement after Trust Infrastructure (Plan A) and Content Accuracy (Plan B) are complete.**

### C1. Stats Bar (Floating Metrics Row)

**Goal:** A white card with three metrics that overlaps the bottom of the hero by ~40px, creating a visual bridge between the dark hero and the cream content area.

**Create new file: `hooks/useInView.ts`** (shared by StatsBar, StepCards, and other animated components)

```ts
'use client'

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView({
  threshold = 0.15,
  rootMargin = '0px',
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) observer.unobserve(el)
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isInView }
}
```

**Create new file: `components/RevealOnScroll.tsx`**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section'
}

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: RevealOnScrollProps) {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
```

**Usage in `app/page.tsx`:**

Since `RevealOnScroll` is a client component (uses hooks), and the homepage is currently a server component, you have two options:
1. **Keep `page.tsx` as server component** and use `RevealOnScroll` as a wrapper around content sections. This is the recommended approach -- it keeps the page server-rendered with small client islands for animation.
2. Convert `page.tsx` to a client component with `'use client'`. Avoid this -- it disables server-side rendering for the entire page.

Wrap each section's inner content with `<RevealOnScroll>`:
```tsx
<section>
  <Container className="py-28 md:py-32">
    <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-2">
      {/* content */}
    </RevealOnScroll>
  </Container>
</section>
```

### C2. StepCards Component

**Create new file: `components/StepCards.tsx`** -- animated 3-step flow with connector line and SVG icons.

Uses the `useInView` hook to trigger staggered card entrance animations.

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

const STEPS = [
  {
    title: 'Upload your RFP or grant guidelines.',
    body: 'Granted reads and analyzes the full document, identifying every section and requirement.',
  },
  {
    title: 'Answer a few questions from your AI coach.',
    body: 'The grant coach asks targeted questions about your organization, project, and goals to gather the details it needs.',
  },
  {
    title: 'Get a complete, grounded first draft.',
    body: 'Granted drafts every section of your proposal using your real data -- no placeholders, no filler.',
  },
]

export default function StepCards() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <div ref={ref} className="mt-14 grid gap-8 md:grid-cols-3">
      {STEPS.map((card, i) => (
        <div
          key={card.title}
          className="card flex h-full flex-col gap-5 p-10"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.5s ease ${i * 150}ms, transform 0.5s ease ${i * 150}ms`,
          }}
        >
          <div
            className="font-display text-[3.75rem] leading-none text-brand-yellow"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'scale(1)' : 'scale(0.5)',
              transition: `opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 150 + 100}ms, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 150 + 100}ms`,
            }}
          >
            {i + 1}
          </div>
          <h3 className="text-lg font-semibold text-navy">{card.title}</h3>
          <p className="text-base text-navy-light leading-relaxed">{card.body}</p>
        </div>
      ))}
    </div>
  )
}
```

### C3. Hero Layout Enhancement

**Goal:** Keep the centered hero text layout (it works well with the editorial serif font) but add floating decorative accent elements to break the flat rectangle feel.

**Option chosen: Centered text + floating geometric accents.**

Add CSS-based decorative elements to the hero. These are positioned absolutely within the hero container:

**Add to `app/globals.css`:**

```css
/* ── Hero accent elements ── */
.hero-accent-circle {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(245, 207, 73, 0.2);
  pointer-events: none;
}

.hero-accent-grid {
  position: absolute;
  pointer-events: none;
  opacity: 0.06;
  background-image:
    linear-gradient(rgba(245, 207, 73, 1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245, 207, 73, 1) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

**Add to hero section in `app/page.tsx`:**

Inside the hero's `<Container>`, before the centered text `<div>`, add:

```tsx
{/* Decorative accents */}
<div className="hero-accent-circle w-[280px] h-[280px] -top-20 -right-20 hidden lg:block" />
<div className="hero-accent-circle w-[180px] h-[180px] bottom-10 -left-16 hidden lg:block" />
<div className="hero-accent-grid w-[200px] h-[200px] top-16 -left-8 hidden lg:block" />
```

The parent Container needs `relative` positioning. Currently, the inner `<div>` has `relative z-10` but the Container itself does not. Add `relative` to the Container's className for the hero.

### C4. Redesign the 3-Step Section with Connected Flow

**Goal:** Replace plain numbered cards with a horizontal connected flow using a line or arrows between steps. Add simple SVG icons per step.

**Approach:** Keep the 3-column grid. Add a horizontal connecting line behind the cards that's visible on `md:` screens. Add SVG icons above each step number.

**Update the step cards section in `app/page.tsx` (or the `StepCards.tsx` component from A3):**

The connecting line is a CSS pseudo-element on the grid container:

**Add to `app/globals.css`:**

```css
/* ── Step connector line ── */
.step-connector {
  position: relative;
}
.step-connector::before {
  content: '';
  position: absolute;
  top: 4.5rem; /* aligns with middle of number */
  left: 16.67%;
  right: 16.67%;
  height: 2px;
  background: linear-gradient(90deg, #F5CF49, #f2c833);
  opacity: 0.3;
  z-index: 0;
  display: none;
}
@media (min-width: 768px) {
  .step-connector::before {
    display: block;
  }
}
```

**Simple inline SVG icons for each step:**

Step 1 (Upload): A document with an up arrow
Step 2 (Coach Q&A): A chat bubble
Step 3 (Draft): A checkmark in a document

These should be defined as small inline SVGs within the step cards. Example:

```tsx
const STEP_ICONS = [
  // Upload document icon
  <svg key="upload" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <polyline points="9 15 12 12 15 15" />
  </svg>,
  // Chat/coach icon
  <svg key="chat" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="12" y1="7" x2="12" y2="13" />
  </svg>,
  // Completed draft icon
  <svg key="draft" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </svg>,
]
```

Add the icon above the step number in each card. Apply `step-connector` to the grid container.

### C5. Abstract Illustration Component (Fallback for Stock Photos)

**If product screenshots are not available**, create `components/AbstractIllustration.tsx` -- a set of pure CSS/SVG decorative elements:

```tsx
// Example: stacked document cards illustration
export function DocumentStack() {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Back card */}
      <div className="absolute top-8 left-8 right-0 bottom-0 rounded-2xl bg-navy/5 border border-navy/10 rotate-3" />
      {/* Middle card */}
      <div className="absolute top-4 left-4 right-4 bottom-4 rounded-2xl bg-white border border-navy/10 -rotate-1 shadow-sm" />
      {/* Front card */}
      <div className="absolute top-0 left-0 right-8 bottom-8 rounded-2xl bg-white border border-navy/10 shadow-lg p-6 flex flex-col gap-3">
        <div className="h-2 w-24 rounded bg-brand-yellow" />
        <div className="h-2 w-full rounded bg-navy/10" />
        <div className="h-2 w-full rounded bg-navy/10" />
        <div className="h-2 w-3/4 rounded bg-navy/10" />
        <div className="mt-4 h-2 w-20 rounded bg-brand-yellow" />
        <div className="h-2 w-full rounded bg-navy/10" />
        <div className="h-2 w-5/6 rounded bg-navy/10" />
      </div>
    </div>
  )
}
```

---

## 10. Implementation Plan D: Motion & Animation

> **LOWER PRIORITY -- implement after Plans A, B, and C are complete. Per persona consensus, trust infrastructure and content accuracy come first.**

### D1. Staggered Hero Entrance

Already defined in C1 above. Add `animate-fade-up` classes to hero elements. This is the ONE animation to include early -- fast to implement, professional feel.

### D2. Scroll-Triggered Section Reveals

**Create `components/RevealOnScroll.tsx`** -- wraps content sections to fade in on scroll.

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section'
}

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: RevealOnScrollProps) {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
```

Keep `page.tsx` as server component. Use `RevealOnScroll` as client islands.

### D3. Button Shimmer & Card Hover Effects

**Add to `app/globals.css`:**

```css
/* ── CTA shimmer hover ── */
.cta-shimmer {
  position: relative;
  overflow: hidden;
}
.cta-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  transition: left 0.5s ease;
  pointer-events: none;
}
.cta-shimmer:hover::after {
  left: 120%;
}

/* ── Card hover lift ── */
.card-hover {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(10, 22, 40, 0.12);
}
```

### D4. Gold Rule Animation

**Create `components/AnimatedGoldRule.tsx`:**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

export default function AnimatedGoldRule() {
  const { ref, isInView } = useInView({ threshold: 0.5 })

  return (
    <div ref={ref} className="overflow-hidden">
      <div
        className="gold-rule"
        style={{
          transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'center',
        }}
      />
    </div>
  )
}
```

---

## 11. Implementation Plan E: Technical Notes

### File Creation Summary

| File | Type | Purpose | Phase |
|---|---|---|---|
| `app/security/page.tsx` | NEW | Data privacy & security page | Phase 1 |
| `app/about/page.tsx` | NEW | Team/about page | Phase 2 |
| `hooks/useInView.ts` | NEW | IntersectionObserver hook for scroll animations | Phase 3 |
| `components/RevealOnScroll.tsx` | NEW | Client wrapper for fade-in-on-scroll | Phase 4 |
| `components/AnimatedGoldRule.tsx` | NEW | Animated gold divider | Phase 4 |
| `components/StatsBar.tsx` | NEW | Floating stats metrics card | Phase 3 |
| `components/AgencyLogos.tsx` | NEW | Social proof agency abbreviations (expanded list) | Phase 2 |
| `components/StepCards.tsx` | NEW | Animated 3-step cards with connector | Phase 3 |
| `components/AudienceSection.tsx` | NEW | "Who is this for?" audience cards | Phase 2 |
| `components/AbstractIllustration.tsx` | NEW | CSS document-stack illustration (fallback) | Phase 2 |

### File Modification Summary

**Phase 1 (Trust Infrastructure):**
- `app/faq/page.tsx` -- Complete all placeholder FAQ answers
- `app/tech/page.tsx` -- Complete rewrite (remove FAISS/LangChain/AutoGPT, describe actual product)
- `app/page.tsx` -- Fix 3-step copy, remove "50+ models" language, add trust statement near CTA
- `components/Header.tsx` -- Add "Security" to nav
- `components/PricingTable.tsx` -- Replace "30+ Writing Models" with accurate feature names

**Phase 2 (Content Accuracy):**
- `app/page.tsx` -- Replace stock photos, rewrite equity section, add audience section, update hero copy
- `components/AgencyLogos.tsx` -- Expand agency list (add HUD, HRSA, IHS), fix label to "Built for"
- `app/pricing/page.tsx` -- Add nonprofit pricing signal
- Remove or replace testimonials section (no fake names)

**Phase 3 (Layout):**
- `app/globals.css` -- Add animation keyframes, hero accents, step connector
- `app/page.tsx` -- Integrate StatsBar, StepCards, layout restructure

**Phase 4 (Animation Polish):**
- `app/globals.css` -- Add shimmer, card-hover, scaleIn animations
- `components/RevealOnScroll.tsx` -- Scroll-triggered reveals
- `components/AnimatedGoldRule.tsx` -- Animated gold divider

### Important Technical Constraints

1. **This is Tailwind CSS 3 (NOT Tailwind 4).** Standard `@tailwind base/components/utilities` directives work fine. There are no `@layer` cascade issues. The `@layer base {}` block in globals.css is the standard Tailwind base layer.

2. **DO NOT add `'use client'` to `app/page.tsx`.** Keep the homepage as a server component. Client interactivity should live in the individual client components (`StatsBar`, `RevealOnScroll`, `StepCards`, `AnimatedGoldRule`, etc.). The homepage imports them and renders them as client islands.

3. **Path alias:** Always import with `@/components/...` or `@/hooks/...`.

4. **Create the `hooks/` directory** before creating `useInView.ts`. This directory does not exist yet.

5. **Type checking:** After all changes, run:
   ```bash
   cd /Users/natecow/Documents/Python/Granted/site && npx tsc --noEmit
   ```
   Fix any type errors before committing.

6. **No extra npm packages needed.** All animations use CSS keyframes + IntersectionObserver. No `framer-motion` required for this scope.

7. **Vercel deployment:** Commit and push to `main`. Vercel auto-deploys. No manual deploy step needed.

8. **Images:** New images go in `public/images/`. Reference them with absolute paths like `/images/filename.png`.

9. **The `<Container>` component** is a simple div wrapper applying the `.container` CSS class. It accepts `children` and an optional `className`.

10. **The `<CheckoutButton>` component** is a client component that redirects to Stripe checkout URL (or falls back to the product app's OAuth sign-in). It accepts `label`, `plan`, and `className` props.

---

## 12. Implementation Plan F: SEO & Follow-ups

These tasks are not part of the homepage redesign but are good follow-ups.

### F1. OG Image Generation

Use `@vercel/og` (built into Next.js 14) to auto-generate branded OpenGraph images for blog posts.

**Create `app/api/og/route.tsx`:**

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Granted AI'

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        background: '#0A1628',
        padding: '80px',
      }}>
        <div style={{ fontSize: 64, color: '#F5CF49', fontFamily: 'serif', lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', marginTop: 24 }}>
          grantedai.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

Then update blog post metadata to include `openGraph.images: [{ url: '/api/og?title=...' }]`.

### F2. Privacy and Terms Pages

Currently, `/privacy` and `/terms` links in the Footer return 404.

**Create `app/privacy/page.tsx`** and **`app/terms/page.tsx`** with basic content. These can be simple server components with static text content.

**Note:** The `/security` page (Plan A2) is separate from and higher priority than `/privacy`. The security page covers data handling for the AI product. The privacy page is the standard legal privacy policy.

### F3. Related Blog Articles

Add a "Related Posts" section at the bottom of blog post pages based on shared categories or tags. This requires reading the blog post frontmatter and querying for posts with matching metadata.

---

## 13. Implementation Order

> **This order is based on the persona review consensus. Trust infrastructure and content accuracy come BEFORE visual polish.**

Execute these in order. Each step should be type-checked and visually verified before proceeding.

### Phase 1: Trust Infrastructure (DO FIRST)

1. **Complete all FAQ answers** (`app/faq/page.tsx`) -- especially data privacy questions
2. **Create `/security` page** (`app/security/page.tsx`) -- data handling, encryption, deletion, sovereignty
3. **Add trust statement to homepage hero** (`app/page.tsx`) -- "Your proposals are never used to train AI..."
4. **Add "Security" to main navigation** (`components/Header.tsx`)
5. **Rewrite technology page** (`app/tech/page.tsx`) -- remove FAISS/LangChain/AutoGPT, describe actual product
6. **Fix 3-step workflow copy** (`app/page.tsx`) -- "Upload RFP / Answer questions / Get draft"
7. **Remove "50+ Writing Models" language everywhere** -- page.tsx, PricingTable.tsx, tech page
8. **Run `npx tsc --noEmit`** -- fix any type errors
9. **Commit and push** -- this is the highest-priority deploy

### Phase 2: Content Accuracy & Product Evidence

10. **Update hero copy** (`app/page.tsx`) -- remove "fundraising copilot", add breadth subtitle
11. **Replace stock photos** -- remove portrait-1.png and portrait-2.png from homepage
12. **Add product screenshot or CSS illustration** -- replace stock photos with real product evidence
13. **Create `components/AgencyLogos.tsx`** -- expanded list (NIH, NSF, EPA, USDA, DARPA, DOE, NOAA, HUD, HRSA, IHS), label "Built for applications to"
14. **Rewrite equity section** (`app/page.tsx`) -- structural language, "The grants office you can't afford to hire"
15. **Create audience section** (`components/AudienceSection.tsx`) -- "Who is this for?" with 4 audience cards
16. **Handle testimonials** -- use real quotes OR replace with "Join our pilot" CTA (NO fake names)
17. **Update use cases copy** -- replace "50+ models" bullet list with accurate product features
18. **Add nonprofit pricing signal** (`app/pricing/page.tsx`) -- "Nonprofit? Contact us"
19. **Create about page** (`app/about/page.tsx`) -- team and credentials
20. **Run `npx tsc --noEmit`** -- fix any type errors
21. **Commit and push**

### Phase 3: Layout Restructure

22. **Create `hooks/useInView.ts`** -- IntersectionObserver hook
23. **Add animation keyframes to `app/globals.css`** -- fadeUp, scaleIn, delays, hero accents, step connector
24. **Create `components/StatsBar.tsx`** -- floating metrics card
25. **Create `components/StepCards.tsx`** -- animated 3-step flow with connector
26. **Update hero section** -- staggered fade-up animation, decorative accents, bottom padding for stats overlap
27. **Wire up layout in `app/page.tsx`** -- hero -> StatsBar -> gold rule -> AgencyLogos -> content
28. **Run `npx tsc --noEmit`** and visual QA on desktop + mobile
29. **Commit and push**

### Phase 4: Animation Polish (lowest priority)

30. **Create `components/RevealOnScroll.tsx`** -- scroll-triggered section reveals
31. **Create `components/AnimatedGoldRule.tsx`** -- animated gold divider
32. **Add shimmer + card-hover effects** -- `cta-shimmer`, `card-hover` classes
33. **Wrap content sections with `<RevealOnScroll>`**
34. **Final visual QA** on desktop and mobile
35. **Commit and push**

### Phase 5: Follow-ups (optional)

36. OG image generation (F1)
37. Privacy/Terms pages (F2)
38. Related blog articles (F3)

---

## Quick Reference: New Homepage Section Order

```
<Header />
<main>
  1. HERO          -- navy bg, noise overlay, centered text, staggered fadeUp
                      Subtitle: "Your AI grant coach -- from NIH R01s to community development grants"
                      Trust line: "Your proposals are never used to train AI. Data encrypted. Delete anytime."
  2. STATS BAR     -- white card overlapping hero, 3 metrics (615K+ / 40% / 9 sections)
  3. GOLD RULE     -- animated width expansion (Phase 4)
  4. AGENCY LOGOS  -- "Built for applications to" + NIH NSF EPA USDA DARPA DOE NOAA HUD HRSA IHS
  5. VALUE PROP    -- "Quality of your ideas" + product screenshot or CSS illustration
  6. USE CASES     -- updated copy about AI coach, section drafting, coverage analysis
  7. AUDIENCE      -- "Who is this for?" -- researchers, nonprofits, tribal colleges, first-time applicants
  8. YELLOW CTA    -- "Let us write your next draft" banner
  9. 3 STEPS       -- connected flow with icons: Upload RFP → Answer questions → Get draft
  10. EQUITY       -- "The grants office you can't afford to hire" (full-width, no stock photo)
                      Grant writer cost comparison: "$5K-$15K per proposal vs $29/month"
  11. PILOT CTA    -- "Join 50+ grant writers testing Granted" (replaces fake testimonials)
                      OR real testimonials if available
  12. FINAL CTA    -- navy bg, "Ready to Get Granted?"
</main>
<Footer />
```

---

## Cross-Cutting Theme

All 5 personas converged on a single meta-insight: **the product is better than the marketing.** The actual Granted workflow (RFP analysis, AI coach Q&A, section-by-section drafting with coverage tracking) is genuinely differentiated and valuable. But the website describes a different, older, less impressive product while simultaneously failing to address the trust concerns that every segment of the target market shares. The highest-ROI work is not visual redesign -- it is content accuracy and trust infrastructure.

> "Fix the trust deficit before the typography." -- Ethan Park, RAND Corporation
