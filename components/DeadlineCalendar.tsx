'use client'

import { useState, useMemo } from 'react'
import { trackEvent } from '@/lib/analytics'

/* ────────────────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────────────────── */

type Agency = 'NIH' | 'NSF' | 'EPA' | 'USDA' | 'DOD' | 'DARPA' | 'HUD' | 'DOE'
type GrantType =
  | 'Research'
  | 'SBIR/STTR'
  | 'Community Development'
  | 'Environmental'
  | 'Education'
  | 'Infrastructure'
type Eligibility =
  | 'Nonprofits'
  | 'Universities'
  | 'Small Businesses'
  | 'Tribal Organizations'
  | 'State/Local Government'

interface GrantDeadline {
  id: number
  name: string
  agency: Agency
  deadline: string // YYYY-MM-DD
  amount: string
  grantType: GrantType
  eligibility: Eligibility[]
  description: string
  foaNumber: string
}

/* ────────────────────────────────────────────────────────────────────────────
   Data — ~30 realistic federal grant deadlines for 2026
   ──────────────────────────────────────────────────────────────────────────── */

const DEADLINES: GrantDeadline[] = [
  {
    id: 1,
    name: 'NIH R01 Research Project Grant (PA-26-183)',
    agency: 'NIH',
    deadline: '2026-02-05',
    amount: '$250K–$500K/yr',
    grantType: 'Research',
    eligibility: ['Universities', 'Nonprofits'],
    description:
      'Support for health-related research projects across all NIH institutes. Standard investigator-initiated research.',
    foaNumber: 'PA-26-183',
  },
  {
    id: 2,
    name: 'NSF Computer & Information Science & Engineering (CISE) Core',
    agency: 'NSF',
    deadline: '2026-02-20',
    amount: '$200K–$600K',
    grantType: 'Research',
    eligibility: ['Universities', 'Nonprofits'],
    description:
      'Fundamental research in computing, networking, and cyber-physical systems.',
    foaNumber: 'NSF 26-502',
  },
  {
    id: 3,
    name: 'EPA Environmental Justice Collaborative Problem-Solving (EJCPS)',
    agency: 'EPA',
    deadline: '2026-03-10',
    amount: '$150K–$500K',
    grantType: 'Environmental',
    eligibility: ['Nonprofits', 'Tribal Organizations'],
    description:
      'Supports community-based organizations addressing local environmental and public health issues in underserved communities.',
    foaNumber: 'EPA-I-OECA-26-01',
  },
  {
    id: 4,
    name: 'USDA Community Facilities Direct Loan & Grant Program',
    agency: 'USDA',
    deadline: '2026-03-15',
    amount: '$50K–$2.5M',
    grantType: 'Community Development',
    eligibility: ['Nonprofits', 'Tribal Organizations', 'State/Local Government'],
    description:
      'Funds essential community facilities in rural areas, including healthcare, public safety, and educational facilities.',
    foaNumber: 'USDA-RD-CF-26-01',
  },
  {
    id: 5,
    name: 'DOD Congressionally Directed Medical Research Programs (CDMRP)',
    agency: 'DOD',
    deadline: '2026-03-22',
    amount: '$100K–$1.5M',
    grantType: 'Research',
    eligibility: ['Universities', 'Nonprofits', 'Small Businesses'],
    description:
      'Peer-reviewed medical research funding across cancer, PTSD, traumatic brain injury, and other areas of military relevance.',
    foaNumber: 'W81XWH-26-CDMRP',
  },
  {
    id: 6,
    name: 'NSF SBIR Phase I',
    agency: 'NSF',
    deadline: '2026-04-02',
    amount: '$275K',
    grantType: 'SBIR/STTR',
    eligibility: ['Small Businesses'],
    description:
      'Phase I feasibility studies for innovative technology with commercial potential and societal benefit.',
    foaNumber: 'NSF 26-514',
  },
  {
    id: 7,
    name: 'NIH SBIR/STTR Omnibus (Parent R43/R44)',
    agency: 'NIH',
    deadline: '2026-04-05',
    amount: '$150K–$1M',
    grantType: 'SBIR/STTR',
    eligibility: ['Small Businesses'],
    description:
      'Biomedical technology commercialization funding for small businesses partnered with research institutions.',
    foaNumber: 'PA-26-259',
  },
  {
    id: 8,
    name: 'HUD Community Development Block Grant (CDBG)',
    agency: 'HUD',
    deadline: '2026-04-15',
    amount: '$500K–$5M',
    grantType: 'Community Development',
    eligibility: ['State/Local Government', 'Nonprofits'],
    description:
      'Flexible funding for housing, anti-poverty programs, and infrastructure development for low- and moderate-income communities.',
    foaNumber: 'FR-6600-N-26',
  },
  {
    id: 9,
    name: 'DOE Advanced Research Projects Agency-Energy (ARPA-E)',
    agency: 'DOE',
    deadline: '2026-04-28',
    amount: '$500K–$5M',
    grantType: 'Research',
    eligibility: ['Universities', 'Small Businesses', 'Nonprofits'],
    description:
      'High-risk, high-reward energy technology research for transformational breakthroughs.',
    foaNumber: 'DE-FOA-0003126',
  },
  {
    id: 10,
    name: 'DARPA Young Faculty Award (YFA)',
    agency: 'DARPA',
    deadline: '2026-05-01',
    amount: '$500K over 2 years',
    grantType: 'Research',
    eligibility: ['Universities'],
    description:
      'Supports untenured faculty pursuing high-risk defense research in science and engineering.',
    foaNumber: 'DARPA-RA-26-01',
  },
  {
    id: 11,
    name: 'EPA Indian Environmental General Assistance Program (GAP)',
    agency: 'EPA',
    deadline: '2026-05-12',
    amount: '$75K–$300K',
    grantType: 'Environmental',
    eligibility: ['Tribal Organizations'],
    description:
      'Assists tribal governments in building environmental program capacity for solid waste, water quality, and air monitoring.',
    foaNumber: 'EPA-I-OITA-26-03',
  },
  {
    id: 12,
    name: 'NIH R21 Exploratory/Developmental Research Grant',
    agency: 'NIH',
    deadline: '2026-06-16',
    amount: '$275K over 2 years',
    grantType: 'Research',
    eligibility: ['Universities', 'Nonprofits'],
    description:
      'Supports early-stage exploratory research projects that may lead to breakthroughs in biomedical and behavioral science.',
    foaNumber: 'PA-26-195',
  },
  {
    id: 13,
    name: 'NSF Tribal Colleges and Universities Program (TCUP)',
    agency: 'NSF',
    deadline: '2026-06-01',
    amount: '$200K–$750K',
    grantType: 'Education',
    eligibility: ['Tribal Organizations', 'Universities'],
    description:
      'Strengthens STEM education and research capacity at Tribal Colleges and Universities.',
    foaNumber: 'NSF 26-540',
  },
  {
    id: 14,
    name: 'USDA Rural Business Development Grant (RBDG)',
    agency: 'USDA',
    deadline: '2026-06-15',
    amount: '$10K–$500K',
    grantType: 'Community Development',
    eligibility: ['Nonprofits', 'Tribal Organizations', 'State/Local Government'],
    description:
      'Supports targeted technical assistance, training, and economic development in rural areas.',
    foaNumber: 'USDA-RD-RBCS-26-02',
  },
  {
    id: 15,
    name: 'DARPA Information Innovation Office (I2O) Broad Agency Announcement',
    agency: 'DARPA',
    deadline: '2026-06-30',
    amount: '$1M–$10M',
    grantType: 'Research',
    eligibility: ['Universities', 'Small Businesses', 'Nonprofits'],
    description:
      'Open solicitation for AI, cybersecurity, and information systems research supporting national defense.',
    foaNumber: 'HR001126S0001',
  },
  {
    id: 16,
    name: 'DOE Weatherization Assistance Program (WAP)',
    agency: 'DOE',
    deadline: '2026-07-01',
    amount: '$100K–$3M',
    grantType: 'Infrastructure',
    eligibility: ['State/Local Government', 'Nonprofits', 'Tribal Organizations'],
    description:
      'Reduces energy costs for low-income households through improved energy efficiency and weatherization.',
    foaNumber: 'DE-FOA-0003201',
  },
  {
    id: 17,
    name: 'HUD Choice Neighborhoods Implementation Grant',
    agency: 'HUD',
    deadline: '2026-07-15',
    amount: '$5M–$35M',
    grantType: 'Infrastructure',
    eligibility: ['State/Local Government', 'Nonprofits'],
    description:
      'Transforms distressed public and assisted housing into mixed-income neighborhoods with integrated community improvements.',
    foaNumber: 'FR-6700-N-26',
  },
  {
    id: 18,
    name: 'NSF Engineering Research Center (ERC)',
    agency: 'NSF',
    deadline: '2026-07-22',
    amount: '$3.5M/yr for 7 years',
    grantType: 'Research',
    eligibility: ['Universities'],
    description:
      'Large-scale convergent research centers integrating engineering and science with societal needs.',
    foaNumber: 'NSF 26-560',
  },
  {
    id: 19,
    name: 'DOD Defense Established Program to Stimulate Competitive Research (DEPSCoR)',
    agency: 'DOD',
    deadline: '2026-08-01',
    amount: '$200K–$750K',
    grantType: 'Research',
    eligibility: ['Universities'],
    description:
      'Builds defense research capacity at universities in underrepresented states and territories.',
    foaNumber: 'W911NF-26-S-0001',
  },
  {
    id: 20,
    name: 'EPA Brownfields Assessment Grant',
    agency: 'EPA',
    deadline: '2026-08-15',
    amount: '$300K–$2M',
    grantType: 'Environmental',
    eligibility: ['State/Local Government', 'Nonprofits', 'Tribal Organizations'],
    description:
      'Funds environmental site assessments, planning, and community involvement for contaminated properties.',
    foaNumber: 'EPA-OLEM-OBLR-26-05',
  },
  {
    id: 21,
    name: 'NIH R15 Academic Research Enhancement Award (AREA)',
    agency: 'NIH',
    deadline: '2026-09-07',
    amount: '$300K over 3 years',
    grantType: 'Research',
    eligibility: ['Universities'],
    description:
      'Stimulates research at educational institutions that have not been major recipients of NIH funding.',
    foaNumber: 'PA-26-210',
  },
  {
    id: 22,
    name: 'USDA Sustainable Agriculture Research & Education (SARE)',
    agency: 'USDA',
    deadline: '2026-09-15',
    amount: '$30K–$300K',
    grantType: 'Research',
    eligibility: ['Universities', 'Nonprofits'],
    description:
      'Competitive grants advancing sustainable farming and ranching practices through research and education.',
    foaNumber: 'USDA-NIFA-SARE-26-01',
  },
  {
    id: 23,
    name: 'DOE Solar Energy Technologies Office (SETO) Funding Program',
    agency: 'DOE',
    deadline: '2026-09-30',
    amount: '$500K–$5M',
    grantType: 'Research',
    eligibility: ['Universities', 'Small Businesses', 'Nonprofits'],
    description:
      'Accelerates solar energy innovation across photovoltaics, concentrating solar power, and systems integration.',
    foaNumber: 'DE-FOA-0003285',
  },
  {
    id: 24,
    name: 'NSF Improving Undergraduate STEM Education (IUSE)',
    agency: 'NSF',
    deadline: '2026-10-01',
    amount: '$100K–$2M',
    grantType: 'Education',
    eligibility: ['Universities'],
    description:
      'Supports projects that develop and implement innovative approaches to undergraduate STEM instruction.',
    foaNumber: 'NSF 26-575',
  },
  {
    id: 25,
    name: 'HUD Continuum of Care (CoC) Program',
    agency: 'HUD',
    deadline: '2026-10-15',
    amount: '$200K–$5M',
    grantType: 'Community Development',
    eligibility: ['Nonprofits', 'State/Local Government'],
    description:
      'Promotes community-wide commitment to ending homelessness through shelter, housing, and supportive services.',
    foaNumber: 'FR-6800-N-26',
  },
  {
    id: 26,
    name: 'DARPA Biological Technologies Office (BTO) Broad Agency Announcement',
    agency: 'DARPA',
    deadline: '2026-10-30',
    amount: '$500K–$5M',
    grantType: 'Research',
    eligibility: ['Universities', 'Small Businesses'],
    description:
      'Research in biosecurity, synthetic biology, neurotechnology, and human performance for defense applications.',
    foaNumber: 'HR001126S0005',
  },
  {
    id: 27,
    name: 'EPA Community Change Grant Program',
    agency: 'EPA',
    deadline: '2026-11-01',
    amount: '$10M–$20M',
    grantType: 'Environmental',
    eligibility: ['Nonprofits', 'Tribal Organizations', 'State/Local Government'],
    description:
      'Large-scale investments in environmental justice and climate resilience for disadvantaged communities.',
    foaNumber: 'EPA-I-OEJECR-26-02',
  },
  {
    id: 28,
    name: 'DOD Multidisciplinary University Research Initiative (MURI)',
    agency: 'DOD',
    deadline: '2026-11-15',
    amount: '$1M–$1.5M/yr for 5 years',
    grantType: 'Research',
    eligibility: ['Universities'],
    description:
      'Supports large multidisciplinary teams addressing complex defense research problems that span traditional disciplines.',
    foaNumber: 'W911NF-26-S-0010',
  },
  {
    id: 29,
    name: 'DOE Building Technologies Office (BTO) Emerging Tech',
    agency: 'DOE',
    deadline: '2026-12-01',
    amount: '$250K–$3M',
    grantType: 'Infrastructure',
    eligibility: ['Small Businesses', 'Universities', 'Nonprofits'],
    description:
      'Develops next-generation building energy technologies including HVAC, lighting, and building envelope systems.',
    foaNumber: 'DE-FOA-0003340',
  },
  {
    id: 30,
    name: 'USDA Rural Energy for America Program (REAP)',
    agency: 'USDA',
    deadline: '2026-12-15',
    amount: '$20K–$1M',
    grantType: 'Infrastructure',
    eligibility: ['Small Businesses', 'Nonprofits'],
    description:
      'Helps rural small businesses and agricultural producers install renewable energy systems and make energy efficiency improvements.',
    foaNumber: 'USDA-RD-RBS-26-REAP',
  },
]

/* ────────────────────────────────────────────────────────────────────────────
   Filter constants
   ──────────────────────────────────────────────────────────────────────────── */

const AGENCIES: Agency[] = ['NIH', 'NSF', 'EPA', 'USDA', 'DOD', 'DARPA', 'HUD', 'DOE']

const GRANT_TYPES: GrantType[] = [
  'Research',
  'SBIR/STTR',
  'Community Development',
  'Environmental',
  'Education',
  'Infrastructure',
]

const ELIGIBILITIES: Eligibility[] = [
  'Nonprofits',
  'Universities',
  'Small Businesses',
  'Tribal Organizations',
  'State/Local Government',
]

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────────── */

const AGENCY_COLORS: Record<Agency, string> = {
  NIH: 'bg-blue-600',
  NSF: 'bg-indigo-600',
  EPA: 'bg-emerald-600',
  USDA: 'bg-green-700',
  DOD: 'bg-slate-600',
  DARPA: 'bg-violet-600',
  HUD: 'bg-sky-600',
  DOE: 'bg-amber-600',
}

function daysUntil(dateStr: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function urgencyClass(dateStr: string): { border: string; badge: string; badgeText: string } {
  const days = daysUntil(dateStr)
  if (days < 0)
    return {
      border: 'border-slate-200/60',
      badge: 'bg-slate-200 text-slate-500',
      badgeText: 'Closed',
    }
  if (days <= 30)
    return {
      border: 'border-red-300',
      badge: 'bg-red-100 text-red-700',
      badgeText: `${days}d left`,
    }
  if (days <= 90)
    return {
      border: 'border-amber-300',
      badge: 'bg-amber-100 text-amber-700',
      badgeText: `${days}d left`,
    }
  return {
    border: 'border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800',
    badgeText: `${days}d left`,
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/* ────────────────────────────────────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────────────────────────────────────── */

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function FilterDropdown<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: readonly T[]
  selected: Set<T>
  onToggle: (v: T) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm transition hover:border-navy/30 hover:shadow"
      >
        {label}
        {selected.size > 0 && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-[11px] font-bold text-navy">
            {selected.size}
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-navy/40" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 w-60 rounded-2xl border border-navy/10 bg-white p-2 shadow-xl">
            {options.map((opt) => {
              const isSelected = selected.has(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onToggle(opt)
                    trackEvent('deadline_filter_toggle', { filter: label, value: opt })
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? 'bg-brand-yellow/15 font-semibold text-navy'
                      : 'text-navy/70 hover:bg-cream-dark'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                      isSelected
                        ? 'border-brand-yellow bg-brand-yellow text-navy'
                        : 'border-navy/20 bg-white'
                    }`}
                  >
                    {isSelected && '\u2713'}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────────────────────────────────────── */

export default function DeadlineCalendar() {
  const [search, setSearch] = useState('')
  const [agencies, setAgencies] = useState<Set<Agency>>(new Set())
  const [grantTypes, setGrantTypes] = useState<Set<GrantType>>(new Set())
  const [eligibility, setEligibility] = useState<Set<Eligibility>>(new Set())

  // Email capture
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function toggle<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    return next
  }

  const activeFilterCount = agencies.size + grantTypes.size + eligibility.size

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return DEADLINES.filter((d) => {
      if (q && !d.name.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q) && !d.agency.toLowerCase().includes(q) && !d.foaNumber.toLowerCase().includes(q)) {
        return false
      }
      if (agencies.size > 0 && !agencies.has(d.agency)) return false
      if (grantTypes.size > 0 && !grantTypes.has(d.grantType)) return false
      if (eligibility.size > 0 && !d.eligibility.some((e) => eligibility.has(e))) return false
      return true
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  }, [search, agencies, grantTypes, eligibility])

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    trackEvent('deadline_reminder_signup', { source: 'deadlines_page' })

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'deadline_reminders' }),
      })
      if (res.ok) {
        setEmailStatus('success')
        setEmail('')
      } else {
        setEmailStatus('error')
      }
    } catch {
      setEmailStatus('error')
    }
  }

  function clearFilters() {
    setSearch('')
    setAgencies(new Set())
    setGrantTypes(new Set())
    setEligibility(new Set())
    trackEvent('deadline_filters_cleared')
  }

  return (
    <div>
      {/* ── Sticky email capture bar ── */}
      <div className="sticky top-0 z-30 border-b border-navy/10 bg-[#0A1628]/95 backdrop-blur-md">
        <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-white tracking-tight">
            Get deadline reminders before applications close
          </p>
          {emailStatus === 'success' ? (
            <p className="text-sm font-semibold text-brand-yellow">
              You&apos;re subscribed — we&apos;ll remind you before deadlines close.
            </p>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.org"
                className="w-56 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-brand-yellow/50 focus:ring-1 focus:ring-brand-yellow/30"
              />
              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="shrink-0 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-navy transition hover:bg-yellow-300 disabled:opacity-60"
              >
                {emailStatus === 'loading' ? 'Subscribing...' : 'Get Reminders'}
              </button>
            </form>
          )}
          {emailStatus === 'error' && (
            <p className="text-xs text-red-400">Something went wrong. Try again.</p>
          )}
        </div>
      </div>

      {/* ── Search & filters ── */}
      <div className="container py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                trackEvent('deadline_search', { query: e.target.value })
              }}
              placeholder="Search grants, agencies, FOA numbers..."
              className="w-full rounded-xl border border-navy/10 bg-white py-3 pl-10 pr-4 text-sm text-navy shadow-sm outline-none transition placeholder:text-navy/40 focus:border-brand-yellow/50 focus:ring-2 focus:ring-brand-yellow/20"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Agency"
              options={AGENCIES}
              selected={agencies}
              onToggle={(v) => setAgencies(toggle(agencies, v))}
            />
            <FilterDropdown
              label="Grant Type"
              options={GRANT_TYPES}
              selected={grantTypes}
              onToggle={(v) => setGrantTypes(toggle(grantTypes, v))}
            />
            <FilterDropdown
              label="Eligibility"
              options={ELIGIBILITIES}
              selected={eligibility}
              onToggle={(v) => setEligibility(toggle(eligibility, v))}
            />
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="mt-6 text-sm text-navy-light">
          Showing <span className="font-semibold text-navy">{filtered.length}</span> of{' '}
          {DEADLINES.length} deadlines
          {activeFilterCount > 0 && (
            <span className="text-navy/40">
              {' '}&middot; {activeFilterCount} filter{activeFilterCount !== 1 && 's'} active
            </span>
          )}
        </p>

        {/* ── Deadline cards ── */}
        {filtered.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-navy/15 py-16 text-center">
            <p className="text-lg font-semibold text-navy/60">No deadlines match your filters</p>
            <p className="mt-2 text-sm text-navy-light">Try broadening your search or removing some filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-full bg-navy/5 px-5 py-2 text-sm font-medium text-navy transition hover:bg-navy/10"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((d) => {
              const urgency = urgencyClass(d.deadline)
              const isPast = daysUntil(d.deadline) < 0
              return (
                <div
                  key={d.id}
                  className={`group relative flex flex-col rounded-3xl border-2 ${urgency.border} bg-white p-6 shadow-sm transition hover:shadow-lg ${isPast ? 'opacity-60' : ''}`}
                >
                  {/* Top row: agency badge + urgency */}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white ${AGENCY_COLORS[d.agency]}`}
                    >
                      {d.agency}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${urgency.badge}`}
                    >
                      {urgency.badgeText}
                    </span>
                  </div>

                  {/* Grant name */}
                  <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-navy">
                    {d.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-light">
                    {d.description}
                  </p>

                  {/* Meta row */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-navy/5 pt-4 text-xs text-navy/60">
                    <span className="font-semibold text-navy">
                      {formatDate(d.deadline)}
                    </span>
                    <span>{d.amount}</span>
                    <span className="rounded-full bg-navy/5 px-2 py-0.5 font-medium text-navy/70">
                      {d.grantType}
                    </span>
                  </div>

                  {/* Eligibility tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {d.eligibility.map((e) => (
                      <span
                        key={e}
                        className="rounded-full border border-navy/8 bg-cream-dark/60 px-2 py-0.5 text-[11px] font-medium text-navy/60"
                      >
                        {e}
                      </span>
                    ))}
                  </div>

                  {/* FOA number */}
                  <p className="mt-2 text-[11px] font-mono text-navy/30">{d.foaNumber}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
