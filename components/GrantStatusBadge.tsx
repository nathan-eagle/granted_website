const styles: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: '#DCFCE7', text: '#166534', label: 'Active' },
  upcoming: { bg: '#FEF3C7', text: '#92400E', label: 'Upcoming' },
  closed: { bg: '#F1F5F9', text: '#475569', label: 'Closed' },
}

export default function GrantStatusBadge({ status }: { status: string }) {
  const s = styles[status] ?? styles.closed
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        backgroundColor: s.bg,
        color: s.text,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: s.text,
          opacity: 0.6,
        }}
      />
      {s.label}
    </span>
  )
}
