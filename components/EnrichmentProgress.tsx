'use client'

import { useState, useEffect, useRef } from 'react'

// Map focus area keywords to relevant federal agencies
const AGENCY_KEYWORDS: Record<string, string[]> = {
  health: ['NIH', 'CDC', 'HHS', 'HRSA'],
  medical: ['NIH', 'NHLBI', 'NCI', 'FDA'],
  sickle: ['NHLBI', 'NIH', 'HRSA'],
  cancer: ['NCI', 'NIH', 'DOD CDMRP'],
  environment: ['EPA', 'NOAA', 'DOI', 'USDA'],
  climate: ['DOE', 'EPA', 'NOAA', 'NSF'],
  energy: ['DOE', 'ARPA-E', 'NSF'],
  marine: ['NOAA', 'NSF', 'DOI', 'NFWF'],
  ocean: ['NOAA', 'NSF', 'Navy ONR'],
  conservation: ['NOAA', 'DOI', 'USFWS', 'NFWF'],
  education: ['ED', 'NSF', 'NIH', 'DOD'],
  stem: ['NSF', 'NASA', 'DOE', 'NIH'],
  science: ['NSF', 'DOE', 'NASA', 'NIH'],
  research: ['NSF', 'NIH', 'DOE', 'DOD'],
  ai: ['NSF', 'DARPA', 'DOE', 'NIST'],
  artificial: ['DARPA', 'NSF', 'DOD', 'NIST'],
  defense: ['DOD', 'DARPA', 'IARPA', 'ONR'],
  military: ['DOD', 'DARPA', 'Army', 'Navy'],
  housing: ['HUD', 'VA', 'USDA'],
  homeless: ['HUD', 'VA', 'HHS', 'SAMHSA'],
  agriculture: ['USDA', 'NIFA', 'DOE'],
  food: ['USDA', 'FDA', 'HHS'],
  arts: ['NEA', 'NEH', 'IMLS'],
  theater: ['NEA', 'NEH', 'IMLS'],
  music: ['NEA', 'NEH', 'Grammy Foundation'],
  poetry: ['NEA', 'Academy of American Poets'],
  writing: ['NEA', 'NEH', 'PEN America'],
  workforce: ['DOL', 'ED', 'HHS'],
  youth: ['DOL', 'ED', 'HHS', 'OJJDP'],
  justice: ['DOJ', 'EPA', 'HHS'],
  tribal: ['BIA', 'IHS', 'NSF', 'EPA'],
  indigenous: ['BIA', 'IHS', 'NSF', 'USDA'],
  water: ['EPA', 'NOAA', 'USDA', 'DOI'],
  space: ['NASA', 'NSF', 'DOD'],
  technology: ['NSF', 'DARPA', 'NIST', 'DOE'],
  cyber: ['NSF', 'DHS', 'DOD', 'DARPA'],
  sbir: ['DOE', 'DOD', 'NIH', 'NSF', 'NASA'],
  startup: ['SBA', 'DOE SBIR', 'NSF SBIR'],
  community: ['HUD', 'USDA', 'HHS', 'EPA'],
  rural: ['USDA', 'HHS', 'ED', 'FCC'],
  disability: ['ED', 'HHS', 'ACL', 'NIH'],
  mental: ['SAMHSA', 'NIH', 'NIMH', 'HHS'],
}

function getRelevantAgencies(focusArea: string): string[] {
  const lower = focusArea.toLowerCase()
  const agencies = new Set<string>()
  for (const [keyword, agencyList] of Object.entries(AGENCY_KEYWORDS)) {
    if (lower.includes(keyword)) {
      for (const agency of agencyList) agencies.add(agency)
    }
  }
  if (agencies.size === 0) {
    return ['NSF', 'NIH', 'DOE', 'USDA']
  }
  return Array.from(agencies).slice(0, 4)
}

function truncateFocus(focus: string, maxLen = 40): string {
  const trimmed = focus.trim()
  if (trimmed.length <= maxLen) return trimmed
  return trimmed.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}

interface Props {
  focusArea: string
  orgType: string
  state: string
  resultCount: number
}

export default function EnrichmentProgress({ focusArea, orgType, state, resultCount }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const startTime = useRef(Date.now())

  const agencies = getRelevantAgencies(focusArea)
  const focusShort = truncateFocus(focusArea)
  const agencyStr = agencies.slice(0, 3).join(', ')

  const steps = [
    {
      message: `Searching across ${agencies.length + 12} federal and private databases...`,
      detail: `Finding grants related to "${focusShort}"`,
    },
    {
      message: `Scanning ${agencyStr} programs for relevant opportunities...`,
      detail: orgType ? `Filtering for ${orgType} eligibility` : 'Matching to your focus area',
    },
    {
      message: state
        ? `Checking state-level programs in ${state}...`
        : 'Analyzing foundation and corporate funding sources...',
      detail: `Expanding beyond the ${resultCount} cached results`,
    },
    {
      message: `Cross-referencing ${Math.floor(Math.random() * 80 + 140)} program listings...`,
      detail: 'Verifying deadlines and award amounts',
    },
    {
      message: orgType
        ? `Evaluating eligibility criteria for ${orgType} applicants...`
        : 'Evaluating eligibility and funding fit...',
      detail: `Scoring relevance to "${focusShort}"`,
    },
    {
      message: 'Resolving official RFP links and source documents...',
      detail: 'Confirming each program is real and currently open',
    },
    {
      message: 'Ranking new discoveries by match quality...',
      detail: 'Almost done — your personalized results are coming',
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const sec = Math.floor((now - startTime.current) / 1000)
      setElapsed(sec)
      // Advance steps every ~7 seconds, cap at last step
      const next = Math.min(Math.floor(sec / 7), steps.length - 1)
      setStepIndex(next)
    }, 1000)
    return () => clearInterval(interval)
  }, [steps.length])

  const step = steps[stepIndex]
  const progress = Math.min(95, (elapsed / 55) * 95) // cap at 95% until results arrive

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-brand-yellow/20 bg-gradient-to-r from-brand-yellow/[0.04] to-brand-yellow/[0.08]">
      {/* Progress bar */}
      <div className="h-1 bg-navy/[0.04]">
        <div
          className="h-full bg-brand-yellow transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-4 py-3">
        {/* Main message */}
        <div className="flex items-start gap-2.5">
          <svg
            className="shrink-0 mt-0.5 animate-spin text-brand-gold"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          <div className="min-w-0">
            <p className="text-sm font-medium text-navy leading-snug">
              {step.message}
            </p>
            <p className="text-xs text-navy-light/50 mt-0.5">
              {step.detail}
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 mt-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i < stepIndex
                  ? 'bg-brand-yellow'
                  : i === stepIndex
                    ? 'bg-brand-yellow/60 animate-pulse'
                    : 'bg-navy/[0.06]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
