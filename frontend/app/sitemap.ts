import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { getPostSlugs } from '@/lib/blog'

/**
 * Dynamic sitemap — includes static marketing pages, public discovery surfaces,
 * published CompanyProfiles, and active Jobs. Regenerated at build time.
 *
 * 2026-04-28: every entry now declares hreflang alternates so Google can pair
 * /it/X and /en/X as translations rather than flagging them as duplicates.
 * x-default points to /en (the global English fallback).
 */

const BASE_URL = 'https://www.in-transparency.com'
const LOCALES = ['en', 'it'] as const

/**
 * Build the hreflang alternates block for a given locale-less path.
 * Each sitemap entry must list every locale variant (including itself)
 * for Google to pair them — see https://developers.google.com/search/docs/specialty/international/localized-versions.
 */
function localeAlternates(path: string): { languages: Record<string, string> } {
  return {
    languages: {
      en: `${BASE_URL}/en${path}`,
      it: `${BASE_URL}/it${path}`,
      'x-default': `${BASE_URL}/en${path}`,
    },
  }
}

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
    { path: '/integrations', priority: 0.85, freq: 'weekly' },
    { path: '/integrations/agents', priority: 0.85, freq: 'weekly' },
    { path: '/integrations/ats', priority: 0.85, freq: 'weekly' },
    { path: '/decision-pack', priority: 0.85, freq: 'weekly' },
    { path: '/skill-extraction', priority: 0.85, freq: 'weekly' },
    { path: '/blog', priority: 0.8, freq: 'daily' },
    { path: '/eu-compliance', priority: 0.9, freq: 'weekly' },
    { path: '/for-public-sector', priority: 0.85, freq: 'weekly' },
    { path: '/demo/ai-search', priority: 0.6, freq: 'weekly' },

    // Auth (low priority — these are hubs that redirect to specific signup
    // routes when ?role= is set; without ?role= they render the chooser)
    { path: '/auth/login', priority: 0.3, freq: 'monthly' },
    { path: '/auth/register', priority: 0.4, freq: 'monthly' },
  ]

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    staticPages.map(page => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: now,
      changeFrequency: page.freq,
      priority: page.priority,
      alternates: localeAlternates(page.path),
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
      alternates: localeAlternates(`/c/${c.slug}`),
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
      alternates: localeAlternates(`/explore/jobs/${j.id}`),
    }))
  )

  // Blog posts — each slug is locale-specific (EN and IT slugs differ),
  // so we list each post as a standalone entry without hreflang alternates.
  // The /blog index page above carries the locale alternates.
  const blogEntries: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    getPostSlugs(locale).map(slug => ({
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticEntries, ...companyEntries, ...jobEntries, ...blogEntries]
}
