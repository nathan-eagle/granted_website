import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: [
      'https://grantedai.com/sitemap.xml',
      // Grants: ~70K pages across 2 chunks of 50K
      'https://grantedai.com/grants/sitemap/0.xml',
      'https://grantedai.com/grants/sitemap/1.xml',
      // Foundations: ~133K pages across 3 chunks of 50K
      'https://grantedai.com/foundations/sitemap/0.xml',
      'https://grantedai.com/foundations/sitemap/1.xml',
      'https://grantedai.com/foundations/sitemap/2.xml',
    ],
  }
}
