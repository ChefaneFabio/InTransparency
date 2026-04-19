import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { directoryLimiter, enforceRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/companies/directory
 * Public listing of published CompanyProfiles with optional search + industry filter.
 */
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(directoryLimiter, req)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const industry = searchParams.get('industry')?.trim()
  const country = searchParams.get('country')?.trim()

  const where: any = { published: true }
  if (q) {
    where.OR = [
      { companyName: { contains: q, mode: 'insensitive' } },
      { tagline: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (industry && industry !== 'ALL') {
    where.industries = { has: industry }
  }
  if (country && country !== 'ALL') {
    where.countries = { has: country }
  }

  const profiles = await prisma.companyProfile.findMany({
    where,
    orderBy: [{ followerCount: 'desc' }, { createdAt: 'desc' }],
    take: 100,
    select: {
      id: true,
      companyName: true,
      slug: true,
      logoUrl: true,
      tagline: true,
      industries: true,
      sizeCategory: true,
      headquarters: true,
      verified: true,
      followerCount: true,
    },
  })

  // Pull distinct industry/country values for the filter sidebar
  const all = await prisma.companyProfile.findMany({
    where: { published: true },
    select: { industries: true, countries: true },
  })
  const industrySet = new Set<string>()
  const countrySet = new Set<string>()
  for (const p of all) {
    for (const i of p.industries) industrySet.add(i)
    for (const c of p.countries) countrySet.add(c)
  }

  return NextResponse.json({
    profiles,
    filters: {
      industries: Array.from(industrySet).sort(),
      countries: Array.from(countrySet).sort(),
    },
    total: profiles.length,
  })
}
