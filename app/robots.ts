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
      'https://grantedai.com/sitemap-index.xml',
      'https://grantedai.com/news-sitemap.xml',
    ],
  }
}
