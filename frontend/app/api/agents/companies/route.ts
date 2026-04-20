import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { agentJson } from '../_lib/response'
import { directoryLimiter, enforceRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/agents/companies
 *
 * Directory of published company profiles, shaped for direct LLM ingestion.
 * Cacheable at the edge — no user context.
 */
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(directoryLimiter, req)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const industry = searchParams.get('industry')?.trim()
  const country = searchParams.get('country')?.trim()
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))

  const where: any = { published: true }
  if (q) {
    where.OR = [
      { companyName: { contains: q, mode: 'insensitive' } },
      { tagline: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (industry) where.industries = { has: industry }
  if (country) where.countries = { has: country }

  const profiles = await prisma.companyProfile.findMany({
    where,
    orderBy: [{ followerCount: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    select: {
      companyName: true,
      slug: true,
      tagline: true,
      industries: true,
      headquarters: true,
      sizeCategory: true,
      foundedYear: true,
      verified: true,
      followerCount: true,
    },
  })

  return agentJson({
    '@type': 'CompanyDirectory',
    query: { q: q ?? null, industry: industry ?? null, country: country ?? null, limit },
    count: profiles.length,
    companies: profiles.map(p => ({
      name: p.companyName,
      slug: p.slug,
      tagline: p.tagline,
      industries: p.industries,
      headquarters: p.headquarters,
      sizeCategory: p.sizeCategory,
      foundedYear: p.foundedYear,
      platformVerified: p.verified,
      followerCount: p.followerCount,
      url: `https://www.in-transparency.com/en/c/${p.slug}`,
      detailEndpoint: `/api/agents/companies/${p.slug}`,
    })),
  })
}
