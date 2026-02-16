'use client'

interface DeepResearchToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  compact?: boolean
}

export default function DeepResearchToggle({ enabled, onChange, compact }: DeepResearchToggleProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
      {/* Switch track */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex shrink-0 rounded-full transition-colors duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/40 focus-visible:ring-offset-2
          ${compact ? 'h-5 w-9' : 'h-6 w-11'}
          ${enabled ? 'bg-brand-yellow' : 'bg-navy/15'}
        `}
      >
        {/* Switch knob */}
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out
            ${compact ? 'h-4 w-4 mt-0.5 ml-0.5' : 'h-5 w-5 mt-0.5 ml-0.5'}
            ${enabled ? (compact ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'}
          `}
        />
      </button>

      {/* Label */}
      <span className={`
        font-medium text-navy transition-colors
        ${compact ? 'text-xs' : 'text-sm'}
        ${enabled ? 'text-navy' : 'text-navy-light/60'}
      `}>
        Granted Deep Research
      </span>

      {/* Info tooltip — full mode only */}
      {!compact && (
        <span className="relative group/tip">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-navy-light/30 group-hover/tip:text-navy-light/50 transition-colors"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 text-xs font-normal text-white bg-navy rounded-lg shadow-lg pointer-events-none opacity-0 group-hover/tip:opacity-100 transition-opacity whitespace-normal">
            Enables Granted Deep Research with additional AI providers for more thorough results. Takes longer (~2 min).
          </span>
        </span>
      )}
    </label>
  )
}
