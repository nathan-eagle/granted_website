import Link from 'next/link'

type Crumb = { label: string; href?: string }

export default function GrantBreadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const items = [{ label: 'Home', href: '/' }, { label: 'Grants', href: '/grants' }, ...crumbs]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `https://grantedai.com${c.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-navy-light/50 mb-6">
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href ? (
              <Link href={c.href} className="hover:text-navy transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className="text-navy font-medium">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
