import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['400','500','600','700','800'] })

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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
