import { listPublishedStories } from '@/lib/newsjack'

export const revalidate = 900 // 15 min ISR

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const base = 'https://grantedai.com'
  const stories = await listPublishedStories(50).catch(() => [])

  // Google News sitemaps should only include articles from the last 48 hours
  const cutoff = Date.now() - 48 * 60 * 60 * 1000
  const recent = stories.filter(
    (s) => s.published_at && new Date(s.published_at).getTime() > cutoff,
  )

  const items = recent
    .map(
      (s) => `  <url>
    <loc>${base}/blog/news/${s.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Granted AI</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(s.published_at).toISOString()}</news:publication_date>
      <news:title>${escapeXml(s.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900, s-maxage=900',
    },
  })
}
