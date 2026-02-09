import type { ReactNode } from 'react'
import HeroAnimationCombined from '@/components/hero-concepts/HeroAnimationCombined'
import HeroAnimationA from '@/components/hero-concepts/HeroAnimationA'
import HeroAnimationB from '@/components/hero-concepts/HeroAnimationB'
import HeroAnimationC from '@/components/hero-concepts/HeroAnimationC'
import HeroAnimationD from '@/components/hero-concepts/HeroAnimationD'
import HeroAnimationE from '@/components/hero-concepts/HeroAnimationE'

type Concept = {
  id: string
  title: string
  summary: string
  detail: string
  strengths: string[]
  tradeoff: string
  visual: ReactNode
}

const HERO_COPY = {
  eyebrow: 'Grant Discovery + Granted Writing Coach',
  heading: 'Search thousands of grants that fit your mission.',
  body:
    'Start with profile-based discovery, then move from RFP analysis to a submission-ready application with the Granted writing coach.',
}

const CONCEPTS: Concept[] = [
  {
    id: 'A',
    title: 'The Switchboard',
    summary: 'One profile at a time with a complete end-to-end journey.',
    detail:
      'Cycles through distinct user profiles. Every cycle animates search query, grant matches, RFP extraction, and a drafting handoff.',
    strengths: [
      'Most narrative and easiest to understand in 3 seconds',
      'Strong profile conditioning signal without visual clutter',
      'Great for homepage users seeing the product for the first time',
    ],
    tradeoff: 'Shows one user at a time, so it feels less like a multi-user system.',
    visual: <HeroAnimationA />,
  },
  {
    id: 'B',
    title: 'The Cascade',
    summary: 'Live activity stream with multiple profiles progressing in parallel.',
    detail:
      'Looks like an operations feed. Different profile types move through discovery, matching, RFP pass, and drafting in a staggered timeline.',
    strengths: [
      'Conveys scale and momentum immediately',
      'Excellent if you want a real-time product feel',
      'Works well with social-proof messaging nearby',
    ],
    tradeoff: 'Each individual story has less room than in a single-profile concept.',
    visual: <HeroAnimationB />,
  },
  {
    id: 'C',
    title: 'The Dashboard',
    summary: 'Most product-like; feels like a polished in-app screenshot.',
    detail:
      'Left profile panel anchors user context while the main panel transitions search results to RFP coverage and application drafting.',
    strengths: [
      'Best for “this is a real software platform” credibility',
      'Strong discovery-to-application sequencing',
      'Highlights profile metadata clearly',
    ],
    tradeoff: 'Densest layout, so it needs careful scaling at smaller widths.',
    visual: <HeroAnimationC />,
  },
  {
    id: 'D',
    title: 'The Mission Control',
    summary: 'Profile card + guided pipeline with explicit stage progression.',
    detail:
      'A command-center look focused on progression clarity: discover grants, rank fit, map RFP requirements, then draft with the Granted writing coach.',
    strengths: [
      'Best stage clarity and conversion-oriented information hierarchy',
      'Strong “guided workflow” message for first-time grant teams',
      'Makes RFP analysis feel tangible and practical',
    ],
    tradeoff: 'Less ambient than feed-based concepts; more structured and procedural.',
    visual: <HeroAnimationD />,
  },
  {
    id: 'E',
    title: 'The Multi-Track Pipeline',
    summary: 'Three profile lanes advancing across discovery, RFP, and application.',
    detail:
      'Each profile occupies a lane and moves across a four-step track. The active lane story updates as the stage advances.',
    strengths: [
      'Strongest “many user types succeed here” message',
      'Very clear transition from search to application output',
      'Easy to theme with vertical-specific profile presets',
    ],
    tradeoff: 'More abstract than a literal product UI screenshot.',
    visual: <HeroAnimationE />,
  },
]

function ConceptHeroFrame({ concept }: { concept: Concept }) {
  return (
    <section className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[1240px] rounded-[28px] border border-white/10 bg-[#071226] p-7 shadow-2xl md:p-10">
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-brand-yellow/40 bg-brand-yellow/15 px-3 py-1 text-xs font-bold text-brand-yellow">
            Option {concept.id}
          </span>
          <h2 className="heading-lg text-white">{concept.title}</h2>
          <span className="text-sm text-white/45">{concept.summary}</span>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80">
              {HERO_COPY.eyebrow}
            </p>
            <h3 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              {HERO_COPY.heading}
            </h3>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">
              {HERO_COPY.body}
            </p>

            <div className="mt-7 space-y-2 text-sm text-white/65">
              <p>{concept.detail}</p>
              {concept.strengths.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-[2px] text-brand-yellow">+</span>
                  <span>{item}</span>
                </div>
              ))}
              <div className="flex items-start gap-2 text-white/45">
                <span className="mt-[2px]">-</span>
                <span>{concept.tradeoff}</span>
              </div>
            </div>
          </div>

          <div>{concept.visual}</div>
        </div>

        <div className="mt-9">
          <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 md:px-5">
            <div className="flex flex-col gap-2.5 md:flex-row">
              <input
                type="text"
                readOnly
                value="Search thousands of grants for youth mental health, tribal STEM, climate resilience..."
                className="w-full rounded-pill border border-white/15 bg-[#0b1c38] px-5 py-3.5 text-sm text-white/75 outline-none"
              />
              <button
                type="button"
                className="shrink-0 rounded-pill bg-brand-yellow px-7 py-3.5 text-sm font-semibold text-navy"
              >
                Search Grants
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {['Community Nonprofit', 'Research Lab', 'Tribal College', 'Rural Health', 'Education Program'].map((chip) => (
                <span key={chip} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HeroConceptsPage() {
  return (
    <div className="min-h-screen bg-navy text-white noise-overlay">
      <header className="px-6 pt-16 pb-10 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80">
          Discovery-First Hero Concepts
        </p>
        <h1 className="heading-xl text-white">Hero animation concepts</h1>
        <p className="body-lg mx-auto mt-4 max-w-3xl text-white/55">
          Every option keeps the revised message: grants (not just federal), discovery first, and a
          handoff to the AI writing coach. Each concept includes a longer centered search bar below
          the copy and visual.
        </p>
      </header>

      {/* ── Combined concept (A + C + D) — featured ── */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[1240px] rounded-[28px] border-2 border-brand-yellow/30 bg-[#071226] p-7 shadow-2xl md:p-10 ring-1 ring-brand-yellow/10">
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-400">
              Combined A+C+D
            </span>
            <h2 className="heading-lg text-white">The Command Center</h2>
            <span className="text-sm text-white/45">Single-user journey with rich profile sidebar and explicit stage navigation.</span>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_1fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80">
                {HERO_COPY.eyebrow}
              </p>
              <h3 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                {HERO_COPY.heading}
              </h3>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">
                {HERO_COPY.body}
              </p>

              <div className="mt-7 space-y-2 text-sm text-white/65">
                <p>Combines the single-user narrative of A, the product-like profile sidebar of C, and the explicit stage buttons of D. Each persona cycles through Discovery, RFP Analysis, and Application with visible &quot;Analyze RFP&quot; and &quot;Start Application&quot; CTAs.</p>
                <div className="flex items-start gap-2">
                  <span className="mt-[2px] text-brand-yellow">+</span>
                  <span>Rich profile context (org name, type, location, focus areas) always visible</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-[2px] text-brand-yellow">+</span>
                  <span>Explicit stage navigation buttons that light up and feel clickable</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-[2px] text-brand-yellow">+</span>
                  <span>Clear &quot;Analyze RFP&quot; and &quot;Start Application&quot; CTAs between stages</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-[2px] text-brand-yellow">+</span>
                  <span>Full narrative depth: typed search, cascading results, RFP checklist, typewriter draft</span>
                </div>
              </div>
            </div>

            <div><HeroAnimationCombined /></div>
          </div>

          <div className="mt-9">
            <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 md:px-5">
              <div className="flex flex-col gap-2.5 md:flex-row">
                <input
                  type="text"
                  readOnly
                  value="Search thousands of grants for youth mental health, tribal STEM, climate resilience..."
                  className="w-full rounded-pill border border-white/15 bg-[#0b1c38] px-5 py-3.5 text-sm text-white/75 outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-pill bg-brand-yellow px-7 py-3.5 text-sm font-semibold text-navy"
                >
                  Search Grants
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {['Community Nonprofit', 'Research Lab', 'Tribal College', 'Rural Health', 'Education Program'].map((chip) => (
                  <span key={chip} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Original concepts for reference ── */}
      <div className="px-6 pt-8 pb-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-white/30">Original concepts for reference</p>
      </div>

      {CONCEPTS.map((concept) => (
        <ConceptHeroFrame key={concept.id} concept={concept} />
      ))}

      <div className="h-16" />
    </div>
  )
}
