import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'

const workflowSteps = [
  {
    number: '01',
    title: 'RFP Analysis',
    description:
      'Upload your RFP or grant guidelines. Granted\u2019s AI reads the full document and identifies every required section, evaluation criterion, and compliance requirement\u2014so you start with a complete picture of what the funder expects.',
    icon: (
      <svg aria-hidden className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="3" width="20" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M11 10h10M11 15h10M11 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 3V1M14 3V1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Requirement Discovery',
    description:
      'The system discovers the grant\u2019s full structure\u2014from project narratives and budget justifications to data management plans and letters of support. Every component is cataloged so nothing gets missed.',
    icon: (
      <svg aria-hidden className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 14h6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'AI Grant Coach Q&A',
    description:
      'An AI coach asks you targeted questions about your organization, team qualifications, project goals, and budget. Your answers ground every section of the draft in your real data\u2014not generic boilerplate.',
    icon: (
      <svg aria-hidden className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M8 18v4l5-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="10" width="15" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M24 21v3l-4-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Coverage Tracking',
    description:
      'Granted tracks which requirements have been addressed and which still need attention. You can see your coverage percentage in real time as the coach gathers information, so you know exactly where you stand before a single word is drafted.',
    icon: (
      <svg aria-hidden className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
        <path d="M16 8v8l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 4a12 12 0 0 1 10.4 6" stroke="#F5CF49" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Section-by-Section Drafting',
    description:
      'Each section is drafted individually using your specific answers and the RFP\u2019s requirements. No generic templates, no placeholders\u2014every paragraph is grounded in what you told the coach and what the funder asked for.',
    icon: (
      <svg aria-hidden className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="3" width="20" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M11 10h10M11 15h10M11 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 22l4 4M22 26l4-4" stroke="#F5CF49" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Purpose-Built, Not General-Purpose',
    description:
      'General-purpose AI tools don\u2019t read your RFP, don\u2019t know what sections are required, don\u2019t track coverage, and don\u2019t ground their output in your organization\u2019s specific data. Granted does all of these\u2014because it was built for this one job.',
    icon: (
      <svg aria-hidden className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="6" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="18" y="6" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M6 11h4M6 15h4M6 19h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 11h4M22 15h4M22 19h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 13h4M14 19h4" stroke="#F5CF49" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const comparisonRows = [
  { capability: 'Reads and parses your full RFP', granted: true, generic: false },
  { capability: 'Identifies every required section automatically', granted: true, generic: false },
  { capability: 'Asks targeted questions about your organization', granted: true, generic: false },
  { capability: 'Tracks requirement coverage in real time', granted: true, generic: false },
  { capability: 'Grounds every paragraph in your specific data', granted: true, generic: false },
  { capability: 'Produces section-by-section drafts, not one-shot output', granted: true, generic: false },
  { capability: 'Knows the structure of grant proposals', granted: true, generic: false },
]

function CheckMark() {
  return (
    <svg aria-hidden className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10.5l3.5 3L15 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XMark() {
  return (
    <svg aria-hidden className="h-5 w-5 text-red-400/70" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function TechPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36 text-center">
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Technology</p>
              <h1 className="heading-xl mt-6 text-white">How Granted Works</h1>
              <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-200">
                Granted is purpose-built AI for grant writing. It reads your RFP, learns about your organization, tracks every requirement, and drafts each section grounded in your real data.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <CheckoutButton label="Draft Your First Proposal" />
                <ButtonLink href="/features" variant="ghost" className="text-white">
                  See all features
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Workflow Steps ── */}
        <Container className="py-28 md:py-32">
          <h2 className="heading-lg text-center">
            Six steps from RFP to polished draft
          </h2>
          <p className="body-lg mx-auto mt-4 max-w-3xl text-center text-navy-light">
            Every grant has unique requirements. Granted&apos;s workflow ensures each one is identified, addressed, and woven into a draft that speaks directly to your funder.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {workflowSteps.map((step) => (
              <div key={step.number} className="card p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-brand-yellow">
                    {step.icon}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest text-navy/40">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-navy">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-navy-light">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>

        {/* ── Comparison Table ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <h2 className="heading-lg text-center">What Makes This Different</h2>
            <p className="body-lg mx-auto mt-4 max-w-3xl text-center text-navy-light">
              ChatGPT, Claude, and other general-purpose AI tools are powerful writers&mdash;but they weren&apos;t designed for grant proposals. Here&apos;s what Granted does that they don&apos;t.
            </p>

            <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-[24px] bg-white shadow-[0_8px_30px_rgba(10,22,40,0.06)]">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_100px] items-center border-b border-navy/10 bg-navy px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white md:grid-cols-[1fr_140px_140px] md:px-8">
                <span className="text-left">Capability</span>
                <span>Granted</span>
                <span>Generic AI</span>
              </div>

              {/* Table rows */}
              {comparisonRows.map((row, i) => (
                <div
                  key={row.capability}
                  className={[
                    'grid grid-cols-[1fr_100px_100px] items-center px-6 py-4 text-sm md:grid-cols-[1fr_140px_140px] md:px-8 md:text-base',
                    i < comparisonRows.length - 1 ? 'border-b border-navy/5' : '',
                  ].join(' ')}
                >
                  <span className="text-navy">{row.capability}</span>
                  <span className="flex justify-center">{row.granted ? <CheckMark /> : <XMark />}</span>
                  <span className="flex justify-center">{row.generic ? <CheckMark /> : <XMark />}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Privacy Callout ── */}
        <Container className="py-28 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-navy">
              <svg aria-hidden className="h-7 w-7 text-brand-yellow" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="12" width="16" height="13" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M10 12V9a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h2 className="heading-md text-navy">Your Data Stays Yours</h2>
            <p className="body-lg mt-4 text-navy-light">
              Everything you upload to Granted&mdash;your RFP, your coach answers, your drafts&mdash;is private to your account. We never use your data to train models, and we never share it with third parties.
            </p>
            <div className="mt-8">
              <ButtonLink href="/security" variant="ghost">Read our security policy</ButtonLink>
            </div>
          </div>
        </Container>

        {/* ── Bottom CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 md:py-32 text-center">
            <div className="relative z-10">
              <h2 className="heading-lg text-white">Start winning grants today</h2>
              <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-200">
                Stop wrestling with blank pages and generic AI output. Upload your RFP and let Granted build a proposal that&apos;s grounded in your work.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <CheckoutButton label="Draft Your First Proposal" />
                <ButtonLink href="/contact" variant="ghost" className="text-white">
                  Talk to sales
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
