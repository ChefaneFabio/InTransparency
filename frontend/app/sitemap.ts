import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

/**
 * Dynamic sitemap — includes static marketing pages, public discovery surfaces,
 * published CompanyProfiles, and active Jobs. Regenerated at build time by Next.js.
 */

const BASE_URL = 'https://www.in-transparency.com'
const LOCALES = ['en', 'it'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static marketing + public pages
  const staticPages: Array<{ path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '', priority: 1, freq: 'daily' },
    { path: '/about', priority: 0.7, freq: 'monthly' },
    { path: '/pricing', priority: 0.8, freq: 'weekly' },
    { path: '/contact', priority: 0.6, freq: 'monthly' },
    { path: '/legal', priority: 0.3, freq: 'monthly' },

    // Segment landing pages
    { path: '/for-students', priority: 0.9, freq: 'weekly' },
    { path: '/for-companies', priority: 0.9, freq: 'weekly' },
    { path: '/for-universities', priority: 0.9, freq: 'weekly' },
    { path: '/for-its-students', priority: 0.8, freq: 'weekly' },
    { path: '/for-its-institutes', priority: 0.8, freq: 'weekly' },
    { path: '/for-high-school-students', priority: 0.8, freq: 'weekly' },
    { path: '/for-high-schools', priority: 0.8, freq: 'weekly' },
    { path: '/for-startups', priority: 0.8, freq: 'weekly' },
    { path: '/for-sme', priority: 0.8, freq: 'weekly' },
    { path: '/for-enterprise', priority: 0.9, freq: 'weekly' },
    { path: '/for-agencies', priority: 0.8, freq: 'weekly' },
    { path: '/for-techparks', priority: 0.8, freq: 'weekly' },

    // Public discovery surfaces
    { path: '/discover', priority: 0.9, freq: 'daily' },
    { path: '/explore', priority: 0.8, freq: 'daily' },
    { path: '/algorithm-registry', priority: 0.7, freq: 'monthly' },
    { path: '/self-discovery', priority: 0.7, freq: 'monthly' },
    { path: '/why-now', priority: 0.85, freq: 'monthly' },
    { path: '/compare/platforms', priority: 0.8, freq: 'monthly' },
    { path: '/glossary', priority: 0.75, freq: 'monthly' },
    { path: '/facts', priority: 0.75, freq: 'monthly' },
    { path: '/changelog', priority: 0.85, freq: 'daily' },
    { path: '/integrations/agents', priority: 0.85, freq: 'weekly' },
    { path: '/integrations/ats', priority: 0.85, freq: 'weekly' },
    { path: '/eu-compliance', priority: 0.9, freq: 'weekly' },
    { path: '/for-public-sector', priority: 0.85, freq: 'weekly' },
    { path: '/demo/ai-search', priority: 0.6, freq: 'weekly' },

    // Auth (low priority)
    { path: '/auth/login', priority: 0.4, freq: 'monthly' },
    { path: '/auth/register', priority: 0.5, freq: 'monthly' },
  ]

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    staticPages.map(page => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: now,
      changeFrequency: page.freq,
      priority: page.priority,
    }))
  )

  // Dynamic: published company profiles (public /c/[slug])
  const companies = await prisma.companyProfile
    .findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      take: 5000, // Vercel sitemap limit is 50k URLs
    })
    .catch(() => [])

  const companyEntries: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    companies.map(c => ({
      url: `${BASE_URL}/${locale}/c/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  // Dynamic: active jobs
  const jobs = await prisma.job
    .findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, updatedAt: true },
      take: 5000,
    })
    .catch(() => [])

  const jobEntries: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    jobs.map(j => ({
      url: `${BASE_URL}/${locale}/explore/jobs/${j.id}`,
      lastModified: j.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [...staticEntries, ...companyEntries, ...jobEntries]
}
