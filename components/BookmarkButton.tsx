'use client'

const APP_SIGNIN_BASE = 'https://app.grantedai.com/api/auth/signin'

export default function BookmarkButton({
  slug,
  size = 'md',
}: {
  slug: string
  size?: 'sm' | 'md'
}) {
  const saveUrl = `${APP_SIGNIN_BASE}?callbackUrl=${encodeURIComponent(`/saved-grants?save=${slug}`)}`

  if (size === 'sm') {
    return (
      <a
        href={saveUrl}
        title="Save for later"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-navy/10 text-navy-light/40 hover:text-brand-gold hover:border-brand-yellow/40 hover:bg-brand-yellow/5 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </a>
    )
  }

  return (
    <a
      href={saveUrl}
      className="inline-flex items-center gap-2 rounded-md border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:border-brand-yellow/40 hover:bg-brand-yellow/5 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      Save
    </a>
  )
}
