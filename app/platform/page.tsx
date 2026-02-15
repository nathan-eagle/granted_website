import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'

export const metadata: Metadata = {
  title: 'Platform — AI Search Architecture & Grant Discovery Engine',
  description:
    'Hybrid retrieval, 5-provider federated search, learned scoring model, and 12-source data pipeline. See the infrastructure behind Granted.',
  alternates: { canonical: 'https://grantedai.com/platform' },
}

/* ── Pipeline Stages ── */
const pipelineStages = [
  {
    number: '01',
    title: 'Full-Text Search',
    description:
      'PostgreSQL ts_rank over indexed grant titles, descriptions, and eligibility criteria. Sub-millisecond candidate retrieval from 67,000+ opportunities.',
    stat: '<1ms',
    statLabel: 'query time',
  },
  {
    number: '02',
    title: 'Query Expansion',
    description:
      'LLM-generated synonym sets and domain-specific rewrites broaden recall without sacrificing precision. A query for "youth STEM" also surfaces "K-12 science education" and "after-school technology programs."',
    stat: '3\u00d7',
    statLabel: 'recall lift',
  },
  {
    number: '03',
    title: 'Embedding kNN',
    description:
      'Dense vector search with pgvector finds semantically similar grants that keyword matching misses. Captures conceptual overlap across different funding vocabularies.',
    stat: '768-d',
    statLabel: 'vectors',
  },
  {
    number: '04',
    title: 'Cross-Encoder Reranking',
    description:
      'A fine-tuned cross-encoder jointly attends to the full query\u2013document pair, producing calibrated relevance scores that outperform bi-encoder similarity alone.',
    stat: '60.3%',
    statLabel: 'P@5',
  },
]

/* ── Data Sources ── */
const dataSources = [
  'Grants.gov',
  'SAM.gov',
  'NSF',
  'SBIR.gov',
  'NIH RePORTER',
  'Commerce.gov',
  'USDA NIFA',
  'ED.gov',
  'EPA Grants',
  'HUD Exchange',
  'State SFAs',
  'Foundation RFPs',
]

/* ── Provider list ── */
const providers = [
  { name: 'Gemini', detail: 'Google Search index' },
  { name: 'GPT-4.1', detail: 'Bing/OpenAI index' },
  { name: 'Claude', detail: 'Anthropic web search' },
  { name: 'Grok', detail: 'X/Twitter + web index' },
  { name: 'Perplexity', detail: 'Independent web index' },
]

/* ── Feature categories ── */
const featureCategories = [
  {
    label: 'Text',
    features: ['BM25', 'TF-IDF overlap', 'Title match'],
    color: 'bg-blue-500',
  },
  {
    label: 'Semantic',
    features: ['Cosine similarity', 'Cross-encoder score', 'Query expansion hits'],
    color: 'bg-violet-500',
  },
  {
    label: 'Metadata',
    features: ['Agency match', 'Category alignment', 'Eligibility fit'],
    color: 'bg-emerald-500',
  },
  {
    label: 'Freshness',
    features: ['Days to deadline', 'Posted recency', 'Update frequency'],
    color: 'bg-amber-500',
  },
  {
    label: 'Penalty',
    features: ['Expired flag', 'Duplicate detection', 'Low-quality signals'],
    color: 'bg-red-500',
  },
]

/* ── Workflow Steps (preserved from original /tech page) ── */
const workflowSteps = [
  {
    number: '01',
    title: 'RFP Analysis',
    description:
      'Upload your RFP or grant guidelines. Granted\u2019s AI reads the full document and identifies every required section, evaluation criterion, and compliance requirement.',
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
      'The system discovers the grant\u2019s full structure\u2014from project narratives and budget justifications to data management plans and letters of support.',
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
    title: 'Grant Writing Coach Q&A',
    description:
      'A grant writing coach asks targeted questions about your organization, team qualifications, project goals, and budget. Your answers ground every section in your real data.',
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
      'Track which requirements have been addressed and which need attention. See coverage percentage in real time as the coach gathers information.',
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
      'Each section is drafted individually using your specific answers and the RFP\u2019s requirements. No generic templates, no placeholders.',
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
      'General-purpose AI doesn\u2019t read your RFP, track coverage, or ground output in your data. Granted does\u2014because it was built for this one job.',
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

/* ── Comparison Table ── */
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

export default function PlatformPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36 text-center">
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Platform</p>
              <h1 className="heading-xl mt-6 text-white">
                Built for Grant Discovery at Scale
              </h1>
              <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-200">
                Hybrid retrieval, federated multi-provider search, and a learned scoring model&mdash;engineered to surface the right grants from 67,000+ opportunities in under 200ms.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <ButtonLink
                  href="/papers/granted-search-architecture-2026-02.pdf"
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the Technical Paper
                </ButtonLink>
                <CheckoutButton label="Try It Now" />
              </div>
            </div>
          </Container>
        </section>

        {/* ── Section 1: Search Architecture ── */}
        <Container className="py-28 md:py-32">
          <p className="text-sm uppercase tracking-[0.35em] text-navy/50 text-center">Search Architecture</p>
          <h2 className="heading-lg text-center mt-4">
            Four-Stage Hybrid Retrieval
          </h2>
          <p className="body-lg mx-auto mt-4 max-w-3xl text-center text-navy-light">
            Every query passes through a cascading pipeline that combines lexical precision with semantic understanding. Each stage narrows and reranks candidates until only the most relevant grants remain.
          </p>

          {/* Stats bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '67,000+', label: 'grants indexed' },
              { value: '12', label: 'data sources' },
              { value: '<200ms', label: 'scoring latency' },
              { value: '$0.003', label: 'per query' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-navy">{s.value}</p>
                <p className="mt-1 text-sm text-navy-light">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Pipeline cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pipelineStages.map((stage) => (
              <div key={stage.number} className="card p-8 flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-brand-yellow text-sm font-bold">
                    {stage.number}
                  </span>
                  <div className="text-right ml-auto">
                    <p className="text-xl font-bold text-navy">{stage.stat}</p>
                    <p className="text-xs text-navy-light">{stage.statLabel}</p>
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-navy">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-light flex-1">{stage.description}</p>
              </div>
            ))}
          </div>
        </Container>

        {/* ── Section 2: Multi-Provider Fusion ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <p className="text-sm uppercase tracking-[0.35em] text-navy/50 text-center">Federated Search</p>
            <h2 className="heading-lg text-center mt-4">
              Five Providers, Five Web Indices
            </h2>
            <p className="body-lg mx-auto mt-4 max-w-3xl text-center text-navy-light">
              For open-web grant discovery, we query five LLM providers simultaneously&mdash;each backed by a distinct search index. Results are fused under a single learned scoring function that ignores every model&apos;s self-reported relevance score.
            </p>

            <div className="mt-14 mx-auto max-w-3xl grid gap-4 sm:grid-cols-5">
              {providers.map((p) => (
                <div key={p.name} className="card p-5 text-center">
                  <p className="text-lg font-bold text-navy">{p.name}</p>
                  <p className="mt-1 text-xs text-navy-light leading-snug">{p.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 mx-auto max-w-2xl">
              <div className="card p-6 md:p-8 bg-navy text-white">
                <p className="text-sm uppercase tracking-[0.25em] text-white/50">Key Insight</p>
                <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-200">
                  We discard every model&apos;s self-reported confidence score and re-evaluate all candidates through our own 15-feature scoring function&mdash;trained on 1,034 labeled query&ndash;grant pairs.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Section 3: Learned Relevance Model ── */}
        <Container className="py-28 md:py-32">
          <p className="text-sm uppercase tracking-[0.35em] text-navy/50 text-center">Scoring Model</p>
          <h2 className="heading-lg text-center mt-4">
            15-Feature Learned Relevance
          </h2>
          <p className="body-lg mx-auto mt-4 max-w-3xl text-center text-navy-light">
            A gradient-boosted model scores every candidate grant across five feature categories. Trained on 1,034 labeled queries, validated at 60.3% Precision@5&mdash;then distilled into a lightweight scorer for sub-200ms inference.
          </p>

          {/* Feature categories */}
          <div className="mt-14 mx-auto max-w-4xl grid gap-4 sm:grid-cols-5">
            {featureCategories.map((cat) => (
              <div key={cat.label} className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`h-3 w-3 rounded-full ${cat.color}`} />
                  <p className="text-sm font-bold text-navy">{cat.label}</p>
                </div>
                <ul className="space-y-1">
                  {cat.features.map((f) => (
                    <li key={f} className="text-xs text-navy-light">{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Distillation callout */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '1,034', label: 'labeled queries' },
              { value: '15', label: 'scoring features' },
              { value: '60.3%', label: 'Precision@5' },
              { value: '~0ms', label: 'distilled inference' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-navy">{s.value}</p>
                <p className="mt-1 text-sm text-navy-light">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>

        {/* ── Section 4: Data Pipeline ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <p className="text-sm uppercase tracking-[0.35em] text-navy/50 text-center">Data Pipeline</p>
            <h2 className="heading-lg text-center mt-4">
              12 Sources, Real-Time Ingestion
            </h2>
            <p className="body-lg mx-auto mt-4 max-w-3xl text-center text-navy-light">
              We ingest grant data from 12 federal and institutional sources, normalize schemas, deduplicate listings, and maintain freshness with daily sync jobs. 99.98% of opportunities are fully tagged with eligibility, category, and deadline metadata.
            </p>

            <div className="mt-14 mx-auto max-w-3xl grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {dataSources.map((src) => (
                <div
                  key={src}
                  className="rounded-xl border border-navy/10 bg-white px-4 py-3 text-center text-sm font-medium text-navy shadow-sm"
                >
                  {src}
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { value: '67,000+', label: 'opportunities' },
                { value: '99.98%', label: 'fully tagged' },
                { value: 'Daily', label: 'sync cadence' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold tracking-tight text-navy">{s.value}</p>
                  <p className="mt-1 text-sm text-navy-light">{s.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Section 5: Grant Writing Engine (workflow) ── */}
        <Container className="py-28 md:py-32">
          <p className="text-sm uppercase tracking-[0.35em] text-navy/50 text-center">Grant Writing Engine</p>
          <h2 className="heading-lg text-center mt-4">
            Six Steps from RFP to Polished Draft
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

        {/* ── Section 6: Research Paper CTA ── */}
        <section className="bg-cream-dark">
          <Container className="py-20 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full border border-navy/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-navy/70 shadow-sm">
                For submission to NeurIPS 2026
              </span>
              <h2 className="heading-md mt-6 text-navy">Read the Technical Paper</h2>
              <p className="body-lg mt-4 text-navy-light">
                Full methodology, ablation studies, and benchmark results for the hybrid retrieval pipeline and knowledge-distilled scoring model.
              </p>
              <div className="mt-8">
                <ButtonLink
                  href="/papers/granted-search-architecture-2026-02.pdf"
                  variant="primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Section 7: Comparison Table ── */}
        <Container className="py-28 md:py-32">
          <h2 className="heading-lg text-center">What Makes This Different</h2>
          <p className="body-lg mx-auto mt-4 max-w-3xl text-center text-navy-light">
            ChatGPT, Claude, and other general-purpose AI tools are powerful writers&mdash;but they weren&apos;t designed for grant proposals. Here&apos;s what Granted does that they don&apos;t.
          </p>

          <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-[24px] bg-white shadow-[0_8px_30px_rgba(10,22,40,0.06)]">
            <div className="grid grid-cols-[1fr_100px_100px] items-center border-b border-navy/10 bg-navy px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white md:grid-cols-[1fr_140px_140px] md:px-8">
              <span className="text-left">Capability</span>
              <span>Granted</span>
              <span>Generic AI</span>
            </div>

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
                <ButtonLink href="/contact" variant="ghost" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30">
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
