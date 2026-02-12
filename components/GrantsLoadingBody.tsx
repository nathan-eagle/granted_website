'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const LOADING_MESSAGES = [
  'Cross-referencing program listings...',
  'Scanning federal, foundation, and corporate databases...',
  'Verifying deadlines and award amounts...',
  'Matching eligibility criteria to your search...',
  'Ranking opportunities by fit score...',
  'Checking recently posted and updated opportunities...',
  'Evaluating funding patterns from active funders...',
  'Building your shortlist of best-fit grants...',
]

function SearchLoadingAnimation({ query }: { query: string }) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Query echo */}
        <div className="text-center mb-6">
          <p className="text-sm text-navy-light/60">
            Searching for <span className="font-semibold text-navy">&ldquo;{query}&rdquo;</span>
          </p>
        </div>

        {/* Spinner + rotating message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20">
            <svg className="animate-spin h-4 w-4 text-brand-yellow" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-navy">
              {LOADING_MESSAGES[msgIndex]}
            </span>
          </div>
        </div>

        {/* Skeleton result cards */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="h-5 bg-navy/8 rounded w-3/4 mb-3" />
              <div className="h-4 bg-navy/5 rounded w-1/2 mb-4" />
              <div className="flex gap-4">
                <div className="h-4 bg-navy/5 rounded w-24" />
                <div className="h-4 bg-navy/5 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 md:p-10">
          <div className="space-y-6">
            <div>
              <div className="block text-sm font-semibold text-navy mb-2">Organization type</div>
              <div className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy/30">
                Select type (optional)
              </div>
            </div>
            <div>
              <div className="block text-sm font-semibold text-navy mb-2">
                Focus area <span className="text-red-400">*</span>
              </div>
              <div className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy/30">
                e.g. youth mental health, clean energy, marine conservation
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-sm font-semibold text-navy mb-2">State / Territory</div>
                <div className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy/30">
                  Select state (optional)
                </div>
              </div>
              <div>
                <div className="block text-sm font-semibold text-navy mb-2">Funding Amount</div>
                <div className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy/30">
                  Any amount
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-pill min-h-[3.25rem] text-base font-semibold bg-brand-yellow/50 text-navy/50 cursor-default">
            Find Matching Grants
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-sm text-navy-light/60 text-center">
          Free &middot; No account required &middot; Powered by AI across the world&apos;s largest grants + funders database
        </p>
        <p className="mt-1.5 text-xs text-navy-light/40 text-center">
          Currently focused on US federal, state, and foundation grants.
        </p>
      </div>
    </div>
  )
}

export default function GrantsLoadingBody() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')?.trim()

  if (query) {
    return <SearchLoadingAnimation query={query} />
  }

  return <FormSkeleton />
}
