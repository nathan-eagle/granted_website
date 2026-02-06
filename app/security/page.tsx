import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'

export const metadata: Metadata = {
  title: 'Security — How Granted AI Protects Your Grant Data',
  description:
    'Granted AI security practices: AES-256 encryption, TLS 1.2+, no AI training on your data, SOC 2 compliance details.',
  alternates: { canonical: 'https://grantedai.com/security' },
}

const sections = [
  {
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M9 12h6m-3-3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Data Handling',
    body: 'Your proposals are processed to generate drafts but are never used to train AI models. Your uploaded RFPs, answers to coach questions, and generated drafts are used solely to provide the service.',
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Third-Party AI Processing',
    body: "Granted uses OpenAI\u2019s API to power its grant writing coach. Your data is processed under OpenAI\u2019s data processing agreement, which prohibits use of API inputs for model training.",
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Data Residency',
    body: 'All data is stored on US-based servers.',
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: 'Encryption',
    body: 'Data is encrypted in transit (TLS 1.2+) and at rest (AES-256).',
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M4 7h16M10 11h4M6 15h12M8 19h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 4l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Data Deletion',
    body: 'You can permanently delete all your data at any time from your account settings. Deletion is immediate and irreversible.',
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M3 21V5a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Data Sovereignty',
    body: 'We understand that some institutions\u2014including tribal colleges, tribal nations, and Indigenous-serving organizations\u2014operate under data sovereignty frameworks that require community governance over research data. You retain full ownership of all uploaded content. All data can be permanently deleted at any time. No data is shared with third parties beyond what is necessary for AI processing.',
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 7h8M8 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'FERPA Compliance',
    body: 'Granted is aware of FERPA requirements for educational institutions. We do not store student records and our data handling practices are compatible with institutional FERPA policies.',
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12l4-4 4 4M8 12l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'No Secondary Use',
    body: 'Your uploaded RFPs, answers to coach questions, and generated drafts are used solely to provide the service. They are never shared, sold, aggregated, anonymized for research, or used to improve our models.',
  },
]

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36 text-center relative z-10">
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">
              Trust &amp; Transparency
            </p>
            <h1 className="heading-xl mt-6 text-white">Security &amp; Data Privacy</h1>
            <p className="body-lg mx-auto mt-5 max-w-2xl text-slate-200">
              Your grant data is sensitive. We treat it that way. Granted encrypts everything,
              never trains on your content, and lets you delete it all at any time.
            </p>
          </Container>
        </section>

        <div className="gold-rule" />

        {/* ── Trust statement + card grid ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            {/* Summary trust banner */}
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="heading-lg">Your data belongs to you &mdash; full stop.</h2>
              <p className="body-lg mt-4 text-navy-light">
                Every piece of information you share with Granted &mdash; RFPs, coach answers,
                drafts &mdash; is used only to serve you. It&apos;s never sold, never shared, never
                used to train models.
              </p>
            </div>

            {/* 2-column card grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {sections.map((section) => (
                <div key={section.title} className="card p-8 md:p-10 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/20 text-navy">
                      {section.icon}
                    </span>
                    <h3 className="heading-md !text-xl font-semibold tracking-tight text-navy">
                      {section.title}
                    </h3>
                  </div>
                  <p className="body-lg text-navy-light leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 md:py-32 relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="heading-lg text-white">Have questions about how we handle your data?</h3>
              <p className="body-lg mt-4 text-white/60">
                We&apos;re happy to walk through our security practices in detail. Reach out and
                we&apos;ll respond within one business day.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <ButtonLink href="/contact">Contact Us</ButtonLink>
                <ButtonLink href="/faq" variant="ghost" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                  Read the FAQ
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
