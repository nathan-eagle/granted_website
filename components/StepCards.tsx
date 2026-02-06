'use client'

import { useInView } from '@/hooks/useInView'

const STEP_ICONS = [
  // Upload document icon
  <svg key="upload" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <polyline points="9 15 12 12 15 15" />
  </svg>,
  // Chat/coach icon
  <svg key="chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="12" y1="7" x2="12" y2="13" />
  </svg>,
  // Completed draft icon
  <svg key="draft" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </svg>,
]

const STEPS = [
  {
    title: 'Upload your RFP or grant guidelines.',
    body: 'Granted reads and analyzes the full document, identifying every section, evaluation criterion, and compliance requirement.',
  },
  {
    title: 'Answer a few questions from your AI coach.',
    body: 'The grant coach asks targeted questions about your organization, project, and goals to gather the details it needs.',
  },
  {
    title: 'Get a complete, grounded first draft.',
    body: 'Granted drafts every section of your proposal using your real data \u2014 with real-time coverage tracking so nothing gets missed.',
  },
]

export default function StepCards() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <div ref={ref} className="mt-14 relative">
      {/* Timeline connector path */}
      <div className="timeline-path">
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((card, i) => (
            <div
              key={card.title}
              className="relative z-10"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${i * 200}ms, transform 0.6s ease ${i * 200}ms`,
              }}
            >
              {/* Timeline node */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl bg-navy/5 border-2 border-brand-yellow/20 flex items-center justify-center"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'scale(1)' : 'scale(0.5)',
                    transition: `opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 200 + 100}ms, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 200 + 100}ms`,
                  }}
                >
                  {STEP_ICONS[i]}
                </div>
              </div>

              {/* Card */}
              <div className="card card-hover flex flex-col gap-4 p-8 text-center">
                <div
                  className="font-display text-5xl leading-none text-brand-yellow/30"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 200 + 200}ms`,
                  }}
                >
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-navy">{card.title}</h3>
                <p className="text-base text-navy-light leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
