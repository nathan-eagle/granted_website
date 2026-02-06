import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'
import DeadlineCalendar from '@/components/DeadlineCalendar'

export const metadata: Metadata = {
  title: '2026 Federal Grant Deadline Calendar — Never Miss a Deadline',
  description:
    'Free searchable calendar of federal grant deadlines for 2026. Filter by agency, grant type, and eligibility. Get email reminders before deadlines close.',
  alternates: { canonical: 'https://grantedai.com/tools/deadlines' },
}

const highlights = [
  {
    stat: '30',
    label: 'Tracked deadlines',
    detail: 'Major federal funding opportunities for 2026',
  },
  {
    stat: '8',
    label: 'Federal agencies',
    detail: 'NIH, NSF, EPA, USDA, DOD, DARPA, HUD, DOE',
  },
  {
    stat: '6',
    label: 'Grant categories',
    detail: 'Research, SBIR, community dev, environment, education, infrastructure',
  },
]

export default function DeadlinesPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Free Tool
              </p>
              <h1 className="heading-xl">
                2026 Federal Grant Deadline Calendar
              </h1>
              <p className="body-lg mt-6 text-white/70 max-w-2xl mx-auto">
                Search and filter every major federal funding opportunity for 2026.
                Never miss a deadline again &mdash; sign up for free email reminders.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <ButtonLink
                  href="#calendar"
                  variant="primary"
                  className="bg-brand-yellow border-brand-yellow text-navy font-semibold hover:bg-yellow-300"
                >
                  Browse Deadlines
                </ButtonLink>
                <ButtonLink
                  href="/features"
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  See how Granted works &rarr;
                </ButtonLink>
              </div>
            </div>

            {/* Stats row */}
            <RevealOnScroll>
              <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-3">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center"
                  >
                    <p className="text-3xl font-display font-normal text-brand-yellow">
                      {h.stat}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{h.label}</p>
                    <p className="mt-1 text-xs text-white/40">{h.detail}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Calendar section ── */}
        <section id="calendar" className="bg-cream-dark/40">
          <DeadlineCalendar />
        </section>

        {/* ── How Granted helps ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                Beyond the deadline
              </p>
              <h2 className="heading-lg text-center max-w-3xl mx-auto">
                Found a deadline? Granted writes the proposal.
              </h2>
              <p className="body-lg mt-4 text-navy-light text-center max-w-2xl mx-auto">
                Upload any federal NOFO or RFP. Granted reads the full document, coaches you
                through every section, and drafts a polished proposal in hours &mdash; not weeks.
              </p>
            </RevealOnScroll>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Upload your RFP',
                  body: 'Drop in the NOFO or solicitation. Granted parses every requirement, evaluation criterion, and formatting rule.',
                },
                {
                  step: '02',
                  title: 'Get coached through each section',
                  body: 'An AI grant writing coach asks targeted questions about your organization, project, and community impact.',
                },
                {
                  step: '03',
                  title: 'Export a polished draft',
                  body: 'Section-by-section drafts grounded in your real details. Review, refine, and export to .docx in minutes.',
                },
              ].map((item, i) => (
                <RevealOnScroll key={item.step} delay={i * 120}>
                  <div className="card p-8 h-full">
                    <span className="text-3xl font-display font-normal text-brand-yellow">
                      {item.step}
                    </span>
                    <h3 className="heading-md mt-4 text-lg">{item.title}</h3>
                    <p className="body-lg mt-3 text-navy-light">{item.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-24 text-center md:py-32 relative z-10">
            <h3 className="heading-lg text-white">
              Stop searching. Start writing.
            </h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              You found the deadline. Granted handles the rest. Draft stronger federal
              proposals with AI coaching, real-time coverage tracking, and section-by-section drafting.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <CheckoutButton label="Draft Your First Proposal" />
              <ButtonLink
                href="/contact"
                variant="ghost"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
              >
                Talk to sales
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
