import type { Metadata } from 'next'
import Script from 'next/script'
import { DM_Sans } from 'next/font/google'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import './globals.css'

// ── Analytics IDs ──
// Replace these with your real IDs once created (see MARKETING_PLAN.md prerequisites)
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || ''
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || ''

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' })

export const metadata: Metadata = {
  title: {
    default: 'Granted AI — Find Grants & Draft Proposals with AI',
    template: '%s | Granted AI',
  },
  description: 'Search thousands of federal grants, find matching opportunities, and draft proposals with AI. Free grant finder for nonprofits, researchers, and small businesses.',
  metadataBase: new URL('https://grantedai.com'),
  icons: { icon: '/fav.ico' },
  alternates: {
    canonical: 'https://grantedai.com',
    types: { 'application/rss+xml': 'https://grantedai.com/feed.xml' },
  },
  openGraph: {
    siteName: 'Granted AI',
    type: 'website',
    locale: 'en_US',
    url: 'https://grantedai.com',
    title: 'Granted AI — Find Grants & Draft Proposals with AI',
    description: 'Search thousands of federal grants, find matching opportunities, and draft proposals with AI. Free grant finder for nonprofits, researchers, and small businesses.',
    images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: 'Granted AI — Draft Grant Proposals in Hours' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@GrantedAI',
    images: ['https://grantedai.com/opengraph-image.png'],
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
        {/* ── Google Analytics 4 ── */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        )}
        {/* ── Microsoft Clarity ── */}
        {CLARITY_ID && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/${CLARITY_ID}";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script");
            `}
          </Script>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Granted AI',
              url: 'https://grantedai.com',
              logo: 'https://grantedai.com/fav.ico',
              description: 'AI-powered grant writing tool that drafts NIH, NSF, EPA, USDA, and DARPA proposals in hours.',
              sameAs: [
                'https://twitter.com/GrantedAI',
                'https://www.linkedin.com/company/granted-ai',
                'https://www.instagram.com/granted.ai/',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Granted AI',
              url: 'https://grantedai.com',
              description: 'AI grant writing tool for researchers, nonprofits, and small businesses.',
              publisher: { '@type': 'Organization', name: 'Granted AI' },
            }),
          }}
        />
        {children}
        <ExitIntentPopup />
      </body>
    </html>
  )
}
