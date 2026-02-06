const AGENCIES = [
  { name: 'NIH', full: 'National Institutes of Health' },
  { name: 'NSF', full: 'National Science Foundation' },
  { name: 'EPA', full: 'Environmental Protection Agency' },
  { name: 'USDA', full: 'U.S. Department of Agriculture' },
  { name: 'DARPA', full: 'Defense Advanced Research Projects Agency' },
  { name: 'DOE', full: 'Department of Energy' },
  { name: 'NOAA', full: 'National Oceanic and Atmospheric Administration' },
  { name: 'HUD', full: 'Department of Housing and Urban Development' },
  { name: 'HRSA', full: 'Health Resources and Services Administration' },
  { name: 'IHS', full: 'Indian Health Service' },
]

export default function AgencyLogos() {
  return (
    <section>
      <div className="container py-16 md:py-20">
        <p className="text-center text-sm font-medium uppercase tracking-[0.12em] text-navy-light/50 mb-8">
          Built for applications to
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-10">
          {AGENCIES.map((agency) => (
            <span
              key={agency.name}
              title={agency.full}
              className="text-sm md:text-base font-semibold tracking-wide text-navy/40 hover:text-navy/70 transition-colors cursor-default"
            >
              {agency.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
