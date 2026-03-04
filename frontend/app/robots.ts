import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/auth/',
          '/onboarding/',
          '/embed/',
          '/test-chat/',
          '/validation/',
          '/unauthorized/',
        ],
      },
    ],
    sitemap: 'https://intransparency.eu/sitemap.xml',
  }
}
