import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
          '/professor/',
          '/matches/', // Per-subject pages; require auth anyway
          '/credentials/verify/', // Tokenized — don't let crawlers accidentally hit
        ],
      },
    ],
    sitemap: 'https://www.in-transparency.com/sitemap.xml',
  }
}
