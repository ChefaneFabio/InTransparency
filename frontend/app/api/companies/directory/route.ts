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

  // Pull distinct industry/country values for the filter sidebar via
  // UNNEST + DISTINCT — scales with distinct values, not row count.
  const [industryRows, countryRows] = await Promise.all([
    prisma.$queryRaw<Array<{ value: string }>>`
      SELECT DISTINCT UNNEST(industries) AS value
      FROM "CompanyProfile"
      WHERE published = true
      ORDER BY value
    `,
    prisma.$queryRaw<Array<{ value: string }>>`
      SELECT DISTINCT UNNEST(countries) AS value
      FROM "CompanyProfile"
      WHERE published = true
      ORDER BY value
    `,
  ])

  return NextResponse.json(
    {
      profiles,
      filters: {
        industries: industryRows.map(r => r.value),
        countries: countryRows.map(r => r.value),
      },
      total: profiles.length,
    },
    {
      headers: {
        // 60s fresh, stale-while-revalidate for 5 min — directory doesn't need
        // real-time freshness, and this dramatically lowers Neon load.
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
