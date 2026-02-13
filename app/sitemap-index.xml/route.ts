import { getGrantCount } from '@/lib/grants'
import { getFoundationCount } from '@/lib/foundations'

const GRANTS_PER_SITEMAP = 10_000
const FOUNDATIONS_PER_SITEMAP = 10_000

export const revalidate = 3600

export async function GET() {
  const base = 'https://grantedai.com'

  const [grantTotal, foundationTotal] = await Promise.all([
    getGrantCount(true).catch(() => 80_000),
    getFoundationCount().catch(() => 140_000),
  ])

  const grantChunks = Math.max(1, Math.ceil(grantTotal / GRANTS_PER_SITEMAP))
  const foundationChunks = Math.max(1, Math.ceil(foundationTotal / FOUNDATIONS_PER_SITEMAP))

  const sitemaps: string[] = [
    `${base}/sitemap.xml`,
  ]

  for (let i = 0; i < grantChunks; i++) {
    sitemaps.push(`${base}/grants/sitemap/${i}.xml`)
  }
  for (let i = 0; i < foundationChunks; i++) {
    sitemaps.push(`${base}/foundations/sitemap/${i}.xml`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((url) => `  <sitemap>\n    <loc>${url}</loc>\n  </sitemap>`).join('\n')}
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
