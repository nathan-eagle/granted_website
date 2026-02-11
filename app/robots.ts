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
      'https://grantedai.com/grants/sitemap.xml',
      'https://grantedai.com/foundations/sitemap/0.xml',
      'https://grantedai.com/foundations/sitemap/1.xml',
      'https://grantedai.com/foundations/sitemap/2.xml',
    ],
  }
}

