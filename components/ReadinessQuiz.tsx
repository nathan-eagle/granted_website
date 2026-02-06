'use client'

import { useState, useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'
import CheckoutButton from '@/components/CheckoutButton'

/* ── Question definitions ── */

interface Question {
  id: string
  text: string
  subtext: string
  weight: number
  category: 'legal' | 'financial' | 'registration' | 'strategic' | 'partnerships'
  yesRecommendation: string
  noRecommendation: string
}

const QUESTIONS: Question[] = [
  {
    id: 'nonprofit',
    text: 'Does your organization have 501(c)(3) status or equivalent?',
    subtext: 'Tax-exempt status is required by most federal and foundation funders.',
    weight: 15,
    category: 'legal',
    yesRecommendation: 'Your tax-exempt status qualifies you for the broadest range of grants.',
    noRecommendation: 'Apply for 501(c)(3) status or find a fiscal sponsor. Many grants require tax-exempt status.',
  },
  {
    id: 'prior_grants',
    text: 'Have you applied for federal grants before?',
    subtext: 'Prior experience demonstrates institutional capacity to reviewers.',
    weight: 10,
    category: 'strategic',
    yesRecommendation: 'Your track record strengthens future applications and shows capacity.',
    noRecommendation: 'Start with smaller foundation or state grants to build a track record before pursuing federal funding.',
  },
  {
    id: 'audited_financials',
    text: 'Do you have audited financials from the last two years?',
    subtext: 'Most federal grants above $750K require a single audit (2 CFR 200).',
    weight: 12,
    category: 'financial',
    yesRecommendation: 'Audited financials demonstrate fiscal responsibility and transparency.',
    noRecommendation: 'Engage a CPA firm for an audit. Federal awards above $750K trigger single-audit requirements.',
  },
  {
    id: 'uei',
    text: 'Do you have a UEI number (formerly DUNS)?',
    subtext: 'A Unique Entity Identifier is required for all federal grant applications.',
    weight: 12,
    category: 'registration',
    yesRecommendation: 'Your UEI is active and ready for federal applications.',
    noRecommendation: 'Register for a UEI at SAM.gov immediately. It is free but can take 7-10 business days.',
  },
  {
    id: 'sam',
    text: 'Are you registered and active in SAM.gov?',
    subtext: 'SAM.gov registration must be active (renewed annually) to receive federal awards.',
    weight: 12,
    category: 'registration',
    yesRecommendation: 'Ensure your SAM.gov registration stays current. It must be renewed annually.',
    noRecommendation: 'Register at SAM.gov now. Processing takes 7-10 business days and must be renewed every year.',
  },
  {
    id: 'strategic_plan',
    text: 'Do you have a strategic plan or theory of change?',
    subtext: 'Reviewers look for alignment between your mission, goals, and the proposed project.',
    weight: 10,
    category: 'strategic',
    yesRecommendation: 'A strategic plan helps you articulate clear alignment between your mission and the funder\'s goals.',
    noRecommendation: 'Develop a 3-5 year strategic plan. Even a lean version dramatically strengthens proposals.',
  },
  {
    id: 'matching_funds',
    text: 'Do you have matching funds or cost-sharing capability?',
    subtext: 'Many grants require a 1:1 or percentage match from non-federal sources.',
    weight: 10,
    category: 'financial',
    yesRecommendation: 'Documented matching funds make your application more competitive.',
    noRecommendation: 'Identify potential match sources: in-kind contributions, partner funds, or state/local funding.',
  },
  {
    id: 'letters_of_support',
    text: 'Do you have letters of support from partners or stakeholders?',
    subtext: 'Collaboration evidence is scored in most federal review criteria.',
    weight: 8,
    category: 'partnerships',
    yesRecommendation: 'Strong partnership letters demonstrate community buy-in and project viability.',
    noRecommendation: 'Begin outreach to potential partners now. Securing letters can take weeks.',
  },
  {
    id: 'data_plan',
    text: 'Do you have a data management or evaluation plan?',
    subtext: 'NSF, NIH, and many agencies require detailed data and evaluation strategies.',
    weight: 6,
    category: 'strategic',
    yesRecommendation: 'A data management plan shows you can measure impact and manage information responsibly.',
    noRecommendation: 'Draft a basic data management plan. NSF and NIH templates are available online for reference.',
  },
  {
    id: 'identified_opportunities',
    text: 'Have you identified specific grant opportunities to pursue?',
    subtext: 'Targeted applications aligned to your mission outperform scattershot approaches.',
    weight: 5,
    category: 'strategic',
    yesRecommendation: 'Targeted pursuit of aligned opportunities is the highest-ROI grant strategy.',
    noRecommendation: 'Use Grants.gov, Foundation Directory Online, or Granted to find opportunities aligned to your mission.',
  },
]

const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + q.weight, 0)

const CATEGORY_LABELS: Record<Question['category'], string> = {
  legal: 'Legal Status',
  financial: 'Financial Readiness',
  registration: 'Federal Registration',
  strategic: 'Strategic Planning',
  partnerships: 'Partnerships & Support',
}

const CATEGORY_ICONS: Record<Question['category'], string> = {
  legal: '\u2696',       // scales of justice
  financial: '\u2261',   // triple bar (ledger)
  registration: '\u2611',// ballot box with check
  strategic: '\u272A',   // star
  partnerships: '\u2764',// heart
}

/* ── Tier logic ── */

function getTier(pct: number): { label: string; color: string; message: string } {
  if (pct >= 85) return {
    label: 'Highly Ready',
    color: '#22c55e',
    message: 'Your organization is in excellent shape to pursue competitive grants. Focus on refining your narratives and targeting the right opportunities.',
  }
  if (pct >= 60) return {
    label: 'Mostly Ready',
    color: '#F5CF49',
    message: 'You have a solid foundation but a few gaps that could cost you points in competitive reviews. Address these before your next deadline.',
  }
  if (pct >= 35) return {
    label: 'Getting There',
    color: '#f97316',
    message: 'You have some pieces in place but significant gaps remain. Prioritize the items below before submitting major applications.',
  }
  return {
    label: 'Early Stage',
    color: '#ef4444',
    message: 'Your organization is in the early stages of grant readiness. The good news: every item below is fixable, and most are free.',
  }
}

/* ── Component ── */

type Phase = 'intro' | 'quiz' | 'results' | 'full-results'

export default function ReadinessQuiz() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  /* Score calc */
  const score = QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ? q.weight : 0), 0)
  const pct = Math.round((score / MAX_SCORE) * 100)
  const tier = getTier(pct)

  const noRecommendations = QUESTIONS.filter(q => answers[q.id] === false)
  const yesItems = QUESTIONS.filter(q => answers[q.id] === true)

  /* Handlers */
  const handleStart = useCallback(() => {
    trackEvent('quiz_start', { quiz: 'readiness' })
    setPhase('quiz')
  }, [])

  const handleAnswer = useCallback((answer: boolean) => {
    const q = QUESTIONS[currentQ]
    setAnswers(prev => ({ ...prev, [q.id]: answer }))
    trackEvent('quiz_answer', { question: q.id, answer: String(answer) })

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      trackEvent('quiz_complete', { quiz: 'readiness', score: String(pct) })
      setPhase('results')
    }
  }, [currentQ, pct])

  const handleBack = useCallback(() => {
    if (currentQ > 0) setCurrentQ(prev => prev - 1)
  }, [currentQ])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    trackEvent('quiz_email_submit', { quiz: 'readiness', score: String(pct) })

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'readiness-quiz', score: pct }),
      })
      if (res.ok) {
        setEmailStatus('success')
        setPhase('full-results')
        trackEvent('quiz_email_success', { quiz: 'readiness' })
      } else {
        setEmailStatus('error')
      }
    } catch {
      setEmailStatus('error')
    }
  }

  /* ── Radial progress ring ── */
  const RING_SIZE = 180
  const STROKE = 10
  const RADIUS = (RING_SIZE - STROKE) / 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const strokeOffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE

  /* ── Intro ── */
  if (phase === 'intro') {
    return (
      <div className="text-center max-w-2xl mx-auto">
        {/* Decorative shield icon */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-brand-yellow/10 border-2 border-brand-yellow/30 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F5CF49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>

        <h2 className="heading-lg text-navy">How ready is your organization to win grants?</h2>
        <p className="body-lg text-navy-light mt-4 max-w-xl mx-auto">
          Answer 10 quick yes-or-no questions and get a personalized readiness score with
          actionable recommendations in under 2 minutes.
        </p>

        {/* What you will get */}
        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { icon: '\u{1F3AF}', label: 'Readiness Score', desc: 'See exactly where you stand' },
            { icon: '\u{1F4CB}', label: 'Gap Analysis', desc: 'Know what to fix first' },
            { icon: '\u{1F680}', label: 'Action Plan', desc: 'Personalized next steps' },
          ].map((item) => (
            <div key={item.label} className="card p-5 text-center">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <p className="font-semibold text-navy text-sm">{item.label}</p>
              <p className="text-xs text-navy-light mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-pill px-8 min-h-[3.25rem] text-base font-semibold bg-brand-yellow text-navy hover:bg-brand-gold transition-colors duration-150"
        >
          Start the Assessment
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <p className="mt-4 text-sm text-navy-light/60">
          Free &middot; No account required &middot; Takes ~2 minutes
        </p>
      </div>
    )
  }

  /* ── Quiz questions ── */
  if (phase === 'quiz') {
    const q = QUESTIONS[currentQ]
    const progress = ((currentQ) / QUESTIONS.length) * 100

    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-navy-light/60 uppercase tracking-wider">
              Question {currentQ + 1} of {QUESTIONS.length}
            </span>
            <span className="text-xs font-semibold text-brand-yellow">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="h-2 bg-navy/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-yellow to-brand-gold rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-yellow/10 text-navy border border-brand-yellow/20">
            <span>{CATEGORY_ICONS[q.category]}</span>
            {CATEGORY_LABELS[q.category]}
          </span>
        </div>

        {/* Question card */}
        <div className="card p-8 md:p-10">
          <h3 className="heading-md text-navy leading-snug">{q.text}</h3>
          <p className="body-sm text-navy-light mt-3">{q.subtext}</p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 group relative overflow-hidden rounded-2xl border-2 border-navy/10 bg-white p-5 text-center font-semibold text-navy transition-all duration-200 hover:border-green-400 hover:bg-green-50 hover:shadow-lg active:scale-[0.98]"
            >
              <span className="block text-2xl mb-1">&#10003;</span>
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 group relative overflow-hidden rounded-2xl border-2 border-navy/10 bg-white p-5 text-center font-semibold text-navy transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:shadow-lg active:scale-[0.98]"
            >
              <span className="block text-2xl mb-1">&#10007;</span>
              No
            </button>
          </div>
        </div>

        {/* Back button */}
        {currentQ > 0 && (
          <button
            onClick={handleBack}
            className="mt-6 text-sm font-medium text-navy-light/60 hover:text-navy transition-colors flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Previous question
          </button>
        )}
      </div>
    )
  }

  /* ── Results (gated) ── */
  if (phase === 'results') {
    const teaserRecs = noRecommendations.slice(0, 3)

    return (
      <div className="max-w-3xl mx-auto">
        {/* Score ring */}
        <div className="text-center mb-10">
          <div className="inline-block relative">
            <svg width={RING_SIZE} height={RING_SIZE} className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="#0A1628"
                strokeOpacity="0.06"
                strokeWidth={STROKE}
              />
              {/* Score ring */}
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={tier.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-5xl font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: tier.color }}>
                {pct}%
              </span>
              <span className="text-xs font-semibold text-navy-light/60 uppercase tracking-wider mt-1">
                Grant Ready
              </span>
            </div>
          </div>

          <div className="mt-6">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: tier.color + '18', color: tier.color }}
            >
              {tier.label}
            </span>
          </div>
          <p className="body-lg text-navy-light mt-4 max-w-xl mx-auto">{tier.message}</p>
        </div>

        {/* Category breakdown */}
        <div className="card p-6 md:p-8 mb-8">
          <h3 className="text-sm font-semibold text-navy uppercase tracking-wider mb-5">Category Breakdown</h3>
          <div className="space-y-4">
            {(Object.keys(CATEGORY_LABELS) as Question['category'][]).map(cat => {
              const catQs = QUESTIONS.filter(q => q.category === cat)
              const catMax = catQs.reduce((s, q) => s + q.weight, 0)
              const catScore = catQs.reduce((s, q) => s + (answers[q.id] ? q.weight : 0), 0)
              const catPct = Math.round((catScore / catMax) * 100)
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-navy flex items-center gap-2">
                      <span>{CATEGORY_ICONS[cat]}</span>
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: catPct >= 75 ? '#22c55e' : catPct >= 40 ? '#F5CF49' : '#ef4444' }}>
                      {catPct}%
                    </span>
                  </div>
                  <div className="h-2 bg-navy/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${catPct}%`,
                        backgroundColor: catPct >= 75 ? '#22c55e' : catPct >= 40 ? '#F5CF49' : '#ef4444',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Teaser recommendations */}
        {teaserRecs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4">Top Priorities</h3>
            <div className="space-y-3">
              {teaserRecs.map((q) => (
                <div key={q.id} className="card p-5 flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{q.text}</p>
                    <p className="text-sm text-navy-light mt-1">{q.noRecommendation}</p>
                  </div>
                </div>
              ))}
            </div>
            {noRecommendations.length > 3 && (
              <p className="text-sm text-navy-light/60 mt-3 text-center">
                + {noRecommendations.length - 3} more recommendations available
              </p>
            )}
          </div>
        )}

        {/* Email gate */}
        <div className="card overflow-hidden">
          <div className="bg-navy p-8 text-center noise-overlay">
            <div className="relative z-10">
              <h3 className="heading-md text-white">Get Your Full Readiness Report</h3>
              <p className="text-white/60 mt-2 text-sm max-w-md mx-auto">
                Enter your email to unlock all {noRecommendations.length} personalized recommendations,
                a prioritized action plan, and grant-readiness tips.
              </p>

              <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organization.org"
                  className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-yellow/60 focus:ring-1 focus:ring-brand-yellow/40 transition"
                />
                <button
                  type="submit"
                  disabled={emailStatus === 'loading'}
                  className="rounded-md bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60 shrink-0"
                >
                  {emailStatus === 'loading' ? 'Sending...' : 'Get Full Report'}
                </button>
              </form>
              {emailStatus === 'error' && (
                <p className="text-xs text-red-400 mt-2">Something went wrong. Please try again.</p>
              )}
              <p className="mt-3 text-xs text-white/30">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-navy-light mb-4">
            Already grant-ready? Granted can draft your next proposal.
          </p>
          <CheckoutButton label="Try Granted Free" eventName="quiz_cta_trial" />
        </div>
      </div>
    )
  }

  /* ── Full results (post-email) ── */
  return (
    <div className="max-w-3xl mx-auto">
      {/* Score ring (compact) */}
      <div className="text-center mb-10">
        <div className="inline-block relative">
          <svg width={RING_SIZE} height={RING_SIZE} className="transform -rotate-90">
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#0A1628"
              strokeOpacity="0.06"
              strokeWidth={STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={tier.color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-5xl font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: tier.color }}>
              {pct}%
            </span>
            <span className="text-xs font-semibold text-navy-light/60 uppercase tracking-wider mt-1">
              Grant Ready
            </span>
          </div>
        </div>

        <div className="mt-6">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ backgroundColor: tier.color + '18', color: tier.color }}
          >
            {tier.label}
          </span>
        </div>
        <p className="body-lg text-navy-light mt-4 max-w-xl mx-auto">{tier.message}</p>
      </div>

      {/* Full action items */}
      {noRecommendations.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Action Items ({noRecommendations.length})
          </h3>
          <div className="space-y-3">
            {noRecommendations.map((q, i) => (
              <div key={q.id} className="card p-5 flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-sm font-bold text-red-500">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{q.text}</p>
                  <p className="text-sm text-navy-light mt-1">{q.noRecommendation}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-navy-light/50">
                    <span>{CATEGORY_ICONS[q.category]}</span>
                    {CATEGORY_LABELS[q.category]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {yesItems.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Your Strengths ({yesItems.length})
          </h3>
          <div className="space-y-3">
            {yesItems.map((q) => (
              <div key={q.id} className="card p-5 flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{q.text}</p>
                  <p className="text-sm text-navy-light mt-1">{q.yesRecommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      <div className="card p-6 md:p-8 mb-10">
        <h3 className="text-sm font-semibold text-navy uppercase tracking-wider mb-5">Category Breakdown</h3>
        <div className="space-y-4">
          {(Object.keys(CATEGORY_LABELS) as Question['category'][]).map(cat => {
            const catQs = QUESTIONS.filter(q => q.category === cat)
            const catMax = catQs.reduce((s, q) => s + q.weight, 0)
            const catScore = catQs.reduce((s, q) => s + (answers[q.id] ? q.weight : 0), 0)
            const catPct = Math.round((catScore / catMax) * 100)
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-navy flex items-center gap-2">
                    <span>{CATEGORY_ICONS[cat]}</span>
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: catPct >= 75 ? '#22c55e' : catPct >= 40 ? '#F5CF49' : '#ef4444' }}>
                    {catPct}%
                  </span>
                </div>
                <div className="h-2 bg-navy/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${catPct}%`,
                      backgroundColor: catPct >= 75 ? '#22c55e' : catPct >= 40 ? '#F5CF49' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Yellow banner CTA */}
      <div className="banner-yellow paper-texture rounded-[32px] px-8 py-12 md:px-12 md:py-16 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="heading-lg text-navy">Ready to write your next proposal?</h3>
          <p className="body-lg text-navy/70 mt-4 max-w-xl mx-auto">
            Upload your RFP and let Granted draft a complete, grounded proposal.
            Your 7-day free trial includes every feature.
          </p>
          <div className="mt-8">
            <CheckoutButton label="Draft Your First Proposal" eventName="quiz_cta_banner" />
          </div>
        </div>
      </div>
    </div>
  )
}
