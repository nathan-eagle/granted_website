import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const sitemaps = ['https://grantedai.com/sitemap.xml']

  // Grants: ~70K pages across 7 chunks of 10K
  for (let i = 0; i < 7; i++) {
    sitemaps.push(`https://grantedai.com/grants/sitemap/${i}.xml`)
  }

  // Foundations: ~133K pages across 14 chunks of 10K
  for (let i = 0; i < 14; i++) {
    sitemaps.push(`https://grantedai.com/foundations/sitemap/${i}.xml`)
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: sitemaps,
  }
}
