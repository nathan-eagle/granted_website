'use client'

import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import type { FoundationGrantee } from '@/lib/foundations'
import {
  formatAssets,
  computeGrantStats,
  computeGivingByYear,
  computeStateDistribution,
  computeNewGranteeRate,
} from '@/lib/foundations'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

/* FIPS code → state abbreviation */
const FIPS_TO_STATE: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY',
}

type Props = {
  grantees: FoundationGrantee[]
}

export default function FoundationInsights({ grantees }: Props) {
  const stats = useMemo(() => computeGrantStats(grantees), [grantees])
  const givingByYearRaw = useMemo(() => computeGivingByYear(grantees), [grantees])
  // Filter out years with no actual dollar amounts
  const givingByYear = useMemo(
    () => givingByYearRaw.filter((y) => y.total > 0),
    [givingByYearRaw],
  )
  const stateDistribution = useMemo(() => computeStateDistribution(grantees), [grantees])
  const newGranteeInfo = useMemo(() => computeNewGranteeRate(grantees), [grantees])
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null)

  // Nothing to show if no grantee data
  if (!stats || grantees.length === 0) return null

  const maxYearTotal = Math.max(...givingByYear.map((y) => y.total), 1)
  const maxStateDist = Math.max(...stateDistribution.map((s) => s.total), 1)

  // Build state lookup for map
  const stateMap = new Map(stateDistribution.map((s) => [s.state, s]))

  return (
    <section className="mt-12 space-y-10">
      <h2 className="heading-md text-navy text-2xl font-bold">Grantmaking Insights</h2>

      {/* ── Key Metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Grants" value={stats.totalGrants.toLocaleString()} />
        <MetricCard label="Total Giving" value={formatAssets(stats.totalGiving)} />
        <MetricCard label="Average Grant" value={formatAssets(stats.averageGrant)} />
        <MetricCard label="Median Grant" value={formatAssets(stats.medianGrant)} />
      </div>

      {/* ── Giving by Year ── */}
      {givingByYear.length >= 2 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
            Grant Disbursements by Year
          </h3>
          <div className="flex gap-[3px] md:gap-1.5 h-48">
            {givingByYear.map((y) => {
              const pct = (y.total / maxYearTotal) * 100
              return (
                <div key={y.year} className="flex-1 flex flex-col items-center justify-end group relative min-w-0">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {formatAssets(y.total)} ({y.count} grants)
                  </div>
                  <div
                    className="w-full bg-brand-yellow/80 hover:bg-brand-yellow rounded-t transition-colors min-h-[4px]"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  />
                  <span className="text-[10px] md:text-xs text-navy-light/40 mt-1.5 tabular-nums">
                    {String(y.year).slice(-2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Grant Range ── */}
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
            Grant Range
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50 block">Min</span>
                <span className="text-lg font-bold text-navy tabular-nums">{formatAssets(stats.minGrant)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50 block">Max</span>
                <span className="text-lg font-bold text-navy tabular-nums">{formatAssets(stats.maxGrant)}</span>
              </div>
            </div>
            {/* Range bar with median marker */}
            <div className="relative">
              <div className="h-3 bg-navy/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-yellow/40 via-brand-yellow to-brand-gold rounded-full" />
              </div>
              {stats.maxGrant > stats.minGrant && (
                <div
                  className="absolute top-0 w-0.5 h-5 bg-navy -translate-y-1"
                  style={{
                    left: `${((stats.medianGrant - stats.minGrant) / (stats.maxGrant - stats.minGrant)) * 100}%`,
                  }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-navy whitespace-nowrap">
                    Median: {formatAssets(stats.medianGrant)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-navy-light/50">
              <span>Smallest grant</span>
              <span>Largest grant</span>
            </div>
          </div>
        </div>

        {/* ── Openness to New Grantees ── */}
        {newGranteeInfo && (
          <div className="card p-6 md:p-8 flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
              Openness to New Grantees ({newGranteeInfo.year})
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-navy/5"
                  />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${newGranteeInfo.rate * 327} 327`}
                    className="text-brand-yellow"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-navy tabular-nums">
                    {Math.round(newGranteeInfo.rate * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-navy-light/60 mt-4 text-center max-w-[200px]">
                of {newGranteeInfo.year} grantees were first-time recipients
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Geographic Distribution ── */}
      {stateDistribution.length > 0 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
            Geographic Distribution of Grants
          </h3>
          {/* Choropleth US map */}
          <div className="relative mx-auto max-w-[600px]">
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{ scale: 900 }}
              width={800}
              height={500}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const abbrev = FIPS_TO_STATE[geo.id]
                    const data = abbrev ? stateMap.get(abbrev) : undefined
                    const intensity = data ? Math.max(0.15, data.total / maxStateDist) : 0
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={data ? `rgba(245, 181, 30, ${0.2 + intensity * 0.8})` : '#f0f0f0'}
                        stroke="#fff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', fill: data ? 'rgb(212, 155, 20)' : '#e5e5e5' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={(e) => {
                          if (!abbrev) return
                          const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect()
                          if (!rect) return
                          setTooltip({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top - 10,
                            label: data
                              ? `${abbrev}: ${formatAssets(data.total)} (${data.count} grants)`
                              : `${abbrev}: No grants`,
                          })
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>
            {tooltip && (
              <div
                className="absolute pointer-events-none bg-navy text-white text-xs px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap z-20 -translate-x-1/2 -translate-y-full"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                {tooltip.label}
              </div>
            )}
          </div>
          {/* Top states list */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
            {stateDistribution.slice(0, 6).map((s) => (
              <div key={s.state} className="flex items-center justify-between text-sm">
                <span className="text-navy font-medium">{s.state}</span>
                <span className="text-navy-light/50 tabular-nums">{formatAssets(s.total)} ({s.count})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-2">{label}</p>
      <p className="text-xl md:text-2xl font-bold text-navy tabular-nums">{value}</p>
    </div>
  )
}
