import { MetadataRoute } from 'next'

const BASE_URL = 'https://intransparency.eu'

const locales = ['en', 'it'] as const

// All public-facing routes (non-dashboard, non-auth, non-api)
const staticRoutes = [
  '',
  '/about',
  '/features',
  '/pricing',
  '/how-it-works',
  '/mission',
  '/contact',
  '/explore',
  '/faq',
  '/for-universities',
  '/for-its-institutes',
  '/per-universita',
  '/per-its',
  '/orientamento',
  '/demo',
  '/demo/ai-search',
  '/demo/advanced-search',
  '/events',
  '/referrals',
  '/students',
  '/students/explore',
  '/students/featured',
  '/success-stories',
  '/trust',
  '/transparency',
  '/jobs',
  '/legal',
  '/privacy',
  '/terms',
  '/support',
  '/advocacy/alumni-stories',
  '/blog',
  '/certification',
  '/for-engineering',
  '/for-consulting',
  '/per-aziende-pmi',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (let i = 0; i < staticRoutes.length; i++) {
    const route = staticRoutes[i]
    for (let j = 0; j < locales.length; j++) {
      const locale = locales[j]
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/features' || route === '/pricing' ? 0.9 : 0.7,
      })
    }
  }

  return entries
}
