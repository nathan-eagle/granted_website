'use client'

import { useMemo } from 'react'
import type { FoundationGrantee } from '@/lib/foundations'
import {
  formatAssets,
  computeGrantStats,
  computeGivingByYear,
  computeStateDistribution,
  computeNewGranteeRate,
} from '@/lib/foundations'

/* ── US state tile grid positions (row, col) ── */
const STATE_GRID: Record<string, [number, number]> = {
  AK: [0, 0], ME: [0, 10],
  VT: [1, 9], NH: [1, 10],
  WA: [2, 0], ID: [2, 1], MT: [2, 2], ND: [2, 3], MN: [2, 4], WI: [2, 5], MI: [2, 7], NY: [2, 8], MA: [2, 9], CT: [2, 10], RI: [2, 11],
  OR: [3, 0], NV: [3, 1], WY: [3, 2], SD: [3, 3], IA: [3, 4], IL: [3, 5], IN: [3, 6], OH: [3, 7], PA: [3, 8], NJ: [3, 9],
  CA: [4, 0], UT: [4, 1], CO: [4, 2], NE: [4, 3], MO: [4, 4], KY: [4, 5], WV: [4, 6], VA: [4, 7], MD: [4, 8], DE: [4, 9], DC: [4, 10],
  AZ: [5, 1], NM: [5, 2], KS: [5, 3], AR: [5, 4], TN: [5, 5], NC: [5, 6], SC: [5, 7],
  OK: [6, 3], LA: [6, 4], MS: [6, 5], AL: [6, 6], GA: [6, 7], FL: [6, 8],
  HI: [7, 0], TX: [7, 3],
}

const GRID_ROWS = 8
const GRID_COLS = 12

type Props = {
  grantees: FoundationGrantee[]
}

export default function FoundationInsights({ grantees }: Props) {
  const stats = useMemo(() => computeGrantStats(grantees), [grantees])
  const givingByYear = useMemo(() => computeGivingByYear(grantees), [grantees])
  const stateDistribution = useMemo(() => computeStateDistribution(grantees), [grantees])
  const newGranteeInfo = useMemo(() => computeNewGranteeRate(grantees), [grantees])

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
            Total Giving by Year
          </h3>
          <div className="flex items-end gap-[3px] md:gap-1.5 h-48">
            {givingByYear.map((y) => {
              const pct = (y.total / maxYearTotal) * 100
              return (
                <div key={y.year} className="flex-1 flex flex-col items-center group relative min-w-0">
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
          {/* Tile grid map */}
          <div
            className="mx-auto"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              gap: '2px',
              maxWidth: '480px',
              aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
            }}
          >
            {Object.entries(STATE_GRID).map(([abbrev, [row, col]]) => {
              const data = stateMap.get(abbrev)
              const intensity = data ? Math.max(0.15, data.total / maxStateDist) : 0
              return (
                <div
                  key={abbrev}
                  className="relative group rounded-sm flex items-center justify-center transition-transform hover:scale-110 hover:z-10"
                  style={{
                    gridRow: row + 1,
                    gridColumn: col + 1,
                    backgroundColor: data
                      ? `rgba(245, 207, 73, ${intensity})`
                      : 'rgba(10, 22, 40, 0.04)',
                    border: data ? '1px solid rgba(245, 207, 73, 0.3)' : '1px solid rgba(10, 22, 40, 0.06)',
                  }}
                >
                  <span className={`text-[8px] md:text-[10px] font-semibold ${data ? 'text-navy' : 'text-navy/20'}`}>
                    {abbrev}
                  </span>
                  {data && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-navy text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      {abbrev}: {formatAssets(data.total)} ({data.count})
                    </div>
                  )}
                </div>
              )
            })}
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
