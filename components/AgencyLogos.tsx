import Link from 'next/link'

const AGENCIES: {
  name: string
  full: string
  color: string
  slug: string
  sealType: 'cross' | 'globe' | 'leaf' | 'wheat' | 'star' | 'atom' | 'wave' | 'building' | 'heart' | 'feather'
}[] = [
  { name: 'NIH', full: 'National Institutes of Health', color: '#1A4480', slug: 'nih', sealType: 'cross' },
  { name: 'NSF', full: 'National Science Foundation', color: '#003087', slug: 'nsf', sealType: 'globe' },
  { name: 'EPA', full: 'Environmental Protection Agency', color: '#205040', slug: 'epa', sealType: 'leaf' },
  { name: 'USDA', full: 'U.S. Department of Agriculture', color: '#205B2E', slug: 'usda', sealType: 'wheat' },
  { name: 'DARPA', full: 'Defense Advanced Research Projects Agency', color: '#1B2A3D', slug: 'darpa', sealType: 'star' },
  { name: 'DOE', full: 'Department of Energy', color: '#2D5A27', slug: 'doe', sealType: 'atom' },
  { name: 'NOAA', full: 'National Oceanic and Atmospheric Administration', color: '#003366', slug: 'noaa', sealType: 'wave' },
  { name: 'HUD', full: 'Department of Housing and Urban Development', color: '#003049', slug: 'hud', sealType: 'building' },
  { name: 'HRSA', full: 'Health Resources and Services Administration', color: '#5C1A3A', slug: 'hrsa', sealType: 'heart' },
  { name: 'IHS', full: 'Indian Health Service', color: '#5A3A1A', slug: 'ihs', sealType: 'feather' },
]

function SealInterior({ type, color }: { type: string; color: string }) {
  const c = color
  switch (type) {
    case 'cross':
      return (
        <>
          <line x1="24" y1="18" x2="24" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="24" x2="30" y2="24" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )
    case 'globe':
      return (
        <>
          <circle cx="24" cy="24" r="6.5" stroke={c} strokeWidth="1.5" fill="none" />
          <ellipse cx="24" cy="24" rx="3" ry="6.5" stroke={c} strokeWidth="1" fill="none" />
          <line x1="17.5" y1="24" x2="30.5" y2="24" stroke={c} strokeWidth="1" />
        </>
      )
    case 'leaf':
      return (
        <path
          d="M24 18c-4 2-6 6-6 10 2-1 4-1.5 6-1.5s4 .5 6 1.5c0-4-2-8-6-10z"
          stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round"
        />
      )
    case 'wheat':
      return (
        <>
          <line x1="24" y1="18" x2="24" y2="30" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 20c-2-1-4 0-4 2s2 2 4 1" stroke={c} strokeWidth="1.2" fill="none" />
          <path d="M24 20c2-1 4 0 4 2s-2 2-4 1" stroke={c} strokeWidth="1.2" fill="none" />
          <path d="M24 24c-2-1-4 0-4 2s2 2 4 1" stroke={c} strokeWidth="1.2" fill="none" />
          <path d="M24 24c2-1 4 0 4 2s-2 2-4 1" stroke={c} strokeWidth="1.2" fill="none" />
        </>
      )
    case 'star':
      return (
        <polygon
          points="24,17 25.8,22 31,22 26.8,25.5 28.2,30.5 24,27.5 19.8,30.5 21.2,25.5 17,22 22.2,22"
          stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"
        />
      )
    case 'atom':
      return (
        <>
          <circle cx="24" cy="24" r="2" fill={c} />
          <ellipse cx="24" cy="24" rx="8" ry="3" stroke={c} strokeWidth="1" fill="none" transform="rotate(0 24 24)" />
          <ellipse cx="24" cy="24" rx="8" ry="3" stroke={c} strokeWidth="1" fill="none" transform="rotate(60 24 24)" />
          <ellipse cx="24" cy="24" rx="8" ry="3" stroke={c} strokeWidth="1" fill="none" transform="rotate(-60 24 24)" />
        </>
      )
    case 'wave':
      return (
        <path
          d="M16 22c2-2 4-2 6 0s4 2 6 0M16 26c2-2 4-2 6 0s4 2 6 0"
          stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"
        />
      )
    case 'building':
      return (
        <>
          <rect x="20" y="20" width="8" height="10" stroke={c} strokeWidth="1.3" fill="none" rx="0.5" />
          <line x1="24" y1="17" x2="24" y2="20" stroke={c} strokeWidth="1.5" />
          <polygon points="18,20 24,16 30,20" stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
          <rect x="22.5" y="25" width="3" height="5" stroke={c} strokeWidth="1" fill="none" />
        </>
      )
    case 'heart':
      return (
        <path
          d="M24 29 C20 25 16 22 16 20 C16 17 19 16 21 17.5 C22.5 18.5 23.5 19.5 24 20 C24.5 19.5 25.5 18.5 27 17.5 C29 16 32 17 32 20 C32 22 28 25 24 29Z"
          stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"
        />
      )
    case 'feather':
      return (
        <>
          <path
            d="M24 30 C24 30 21 24 21 20 C21 17 22.5 16 24 16 C25.5 16 27 17 27 20 C27 24 24 30 24 30Z"
            stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"
          />
          <line x1="24" y1="18" x2="24" y2="28" stroke={c} strokeWidth="1" />
        </>
      )
    default:
      return <circle cx="24" cy="24" r="4" stroke={c} strokeWidth="1.5" fill="none" />
  }
}

export default function AgencyLogos() {
  return (
    <section>
      <div className="container py-10 md:py-14">
        <p className="text-center text-sm font-medium uppercase tracking-[0.12em] text-navy-light/70 mb-8">
          Built for applications to
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {AGENCIES.map((agency) => (
            <Link
              key={agency.name}
              href={`/grants/${agency.slug}`}
              title={agency.full}
              className="flex flex-col items-center w-[68px] group"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                className="block transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              >
                {/* Outer ring */}
                <circle cx="24" cy="24" r="22" fill="none" stroke={agency.color} strokeWidth="1" opacity="0.2" />
                {/* Dashed decorative ring */}
                <circle cx="24" cy="24" r="20" fill="none" stroke={agency.color} strokeWidth="0.5" opacity="0.15" strokeDasharray="2.5 2.5" />
                {/* Inner fill */}
                <circle cx="24" cy="24" r="19" fill={agency.color} opacity="0.06" />
                {/* Inner decorative ring */}
                <circle cx="24" cy="24" r="14" fill="none" stroke={agency.color} strokeWidth="0.6" opacity="0.18" />
                {/* Agency symbol */}
                <g opacity="0.7">
                  <SealInterior type={agency.sealType} color={agency.color} />
                </g>
              </svg>
              <span
                className="block text-center text-[11px] font-bold tracking-[0.08em] uppercase mt-1.5 transition-opacity duration-300 opacity-80 group-hover:opacity-100"
                style={{ color: agency.color }}
              >
                {agency.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
