export function DocumentStack() {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Back card */}
      <div className="absolute top-8 left-8 right-0 bottom-0 rounded-2xl bg-navy/5 border border-navy/10 rotate-3" />
      {/* Middle card */}
      <div className="absolute top-4 left-4 right-4 bottom-4 rounded-2xl bg-white border border-navy/10 -rotate-1 shadow-sm" />
      {/* Front card */}
      <div className="absolute top-0 left-0 right-8 bottom-8 rounded-2xl bg-white border border-navy/10 shadow-lg p-6 flex flex-col gap-3">
        <div className="h-2 w-24 rounded bg-brand-yellow" />
        <div className="h-2 w-full rounded bg-navy/10" />
        <div className="h-2 w-full rounded bg-navy/10" />
        <div className="h-2 w-3/4 rounded bg-navy/10" />
        <div className="mt-4 h-2 w-20 rounded bg-brand-yellow" />
        <div className="h-2 w-full rounded bg-navy/10" />
        <div className="h-2 w-5/6 rounded bg-navy/10" />
        <div className="mt-4 h-2 w-16 rounded bg-brand-yellow" />
        <div className="h-2 w-full rounded bg-navy/10" />
        <div className="h-2 w-2/3 rounded bg-navy/10" />
      </div>
    </div>
  )
}

export function CoachConversation() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-white border border-navy/10 shadow-lg p-6 flex flex-col gap-4">
        {/* Coach message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-brand-yellow" />
          </div>
          <div className="flex-1">
            <div className="h-2 w-full rounded bg-navy/10" />
            <div className="h-2 w-4/5 rounded bg-navy/10 mt-2" />
          </div>
        </div>
        {/* User response */}
        <div className="flex gap-3 justify-end">
          <div className="bg-navy/5 rounded-xl px-4 py-3 max-w-[80%]">
            <div className="h-2 w-full rounded bg-navy/15" />
            <div className="h-2 w-3/4 rounded bg-navy/15 mt-2" />
          </div>
        </div>
        {/* Coach follow-up */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-brand-yellow" />
          </div>
          <div className="flex-1">
            <div className="h-2 w-full rounded bg-navy/10" />
            <div className="h-2 w-5/6 rounded bg-navy/10 mt-2" />
            <div className="h-2 w-2/3 rounded bg-navy/10 mt-2" />
          </div>
        </div>
        {/* Coverage bar */}
        <div className="mt-2 pt-4 border-t border-navy/10">
          <div className="flex items-center justify-between text-xs text-navy-light mb-1">
            <span className="font-medium">Coverage</span>
            <span className="font-semibold text-brand-gold">73%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-navy/10">
            <div className="h-2 w-[73%] rounded-full bg-brand-yellow" />
          </div>
        </div>
      </div>
    </div>
  )
}
