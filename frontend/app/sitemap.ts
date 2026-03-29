import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://in-transparency.vercel.app'
  const locales = ['en', 'it']
  const lastModified = new Date()
  const pages = [
    { path: '', priority: 1, freq: 'daily' },
    { path: '/for-students', priority: 0.9, freq: 'weekly' },
    { path: '/for-companies', priority: 0.9, freq: 'weekly' },
    { path: '/for-universities', priority: 0.9, freq: 'weekly' },
    { path: '/about', priority: 0.7, freq: 'monthly' },
    { path: '/pricing', priority: 0.8, freq: 'weekly' },
    { path: '/explore', priority: 0.8, freq: 'daily' },
    { path: '/demo/ai-search', priority: 0.7, freq: 'weekly' },
    { path: '/contact', priority: 0.6, freq: 'monthly' },
    { path: '/legal', priority: 0.3, freq: 'monthly' },
    { path: '/auth/login', priority: 0.5, freq: 'monthly' },
    { path: '/auth/register', priority: 0.6, freq: 'monthly' },
  ]
  return locales.flatMap(locale =>
    pages.map(page => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified,
      changeFrequency: page.freq as any,
      priority: page.priority,
    }))
  )
}
