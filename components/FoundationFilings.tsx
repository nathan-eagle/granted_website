'use client'

import type { FoundationFiling } from '@/lib/foundations'

type Props = {
  filings: FoundationFiling[]
  ein: string
}

export default function FoundationFilings({ filings, ein }: Props) {
  if (filings.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="heading-md text-navy text-2xl font-bold mb-6">990-PF Filings</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy/10 bg-cream-dark/50">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">
                Tax Period
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">
                Return Type
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {filings.map((f) => {
              const taxPeriodLabel = f.tax_period
                ? `${f.tax_period.slice(0, 4)}-${f.tax_period.slice(4)}`
                : String(f.fiscal_year)

              return (
                <tr key={f.id} className="border-b border-navy/5 hover:bg-navy/[0.02]">
                  <td className="py-3 px-4 text-navy font-medium tabular-nums">
                    {taxPeriodLabel}
                  </td>
                  <td className="py-3 px-4 text-navy-light">
                    {f.return_type || '990PF'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {f.pdf_url && (
                      <a
                        href={f.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:underline"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                          <path d="M16 13H8" />
                          <path d="M16 17H8" />
                          <path d="M10 9H8" />
                        </svg>
                        View Filing
                      </a>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-navy-light/40 mt-3">
        Filings sourced from IRS e-file index.{' '}
        <a
          href={`https://projects.propublica.org/nonprofits/organizations/${ein.replace(/-/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold hover:underline"
        >
          View all on ProPublica
        </a>
      </p>
    </section>
  )
}
