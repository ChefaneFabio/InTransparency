import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

/**
 * GET /api/admin/access-grants/lookups
 * Returns the data the admin UI needs to populate the create-grant form:
 *   - institutions: every Institution in alphabetical order
 *   - companies: distinct (companyName, count) drawn from existing recruiter
 *     User.company values + any CompanyProfile rows. Helps the admin pick a
 *     real company instead of typo'ing the name (which would silently fail
 *     the membership check).
 */
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (
    session.user.role !== 'ADMIN' &&
    session.user.email?.toLowerCase() !== FOUNDER_EMAIL
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(_req.url)
  const includeDemo = searchParams.get('includeDemo') === 'true'

  const [institutions, profiles, recruiterCompanies] = await Promise.all([
    prisma.institution.findMany({
      where: includeDemo ? {} : { isDemo: false },
      select: { id: true, name: true, slug: true, type: true, country: true, isDemo: true },
      orderBy: { name: 'asc' },
    }),
    prisma.companyProfile.findMany({
      select: { id: true, companyName: true, slug: true, logoUrl: true },
      orderBy: { companyName: 'asc' },
    }),
    prisma.user.groupBy({
      by: ['company'],
      where: { role: 'RECRUITER', company: { not: null } },
      _count: { _all: true },
    }),
  ])

  const recruiterCompanyMap = new Map<string, number>()
  for (const r of recruiterCompanies) {
    if (!r.company) continue
    const key = r.company.trim()
    if (!key) continue
    recruiterCompanyMap.set(key, (recruiterCompanyMap.get(key) ?? 0) + r._count._all)
  }

  // Merge profile-only companies + recruiter-only companies into one list.
  const merged = new Map<
    string,
    { name: string; profileId: string | null; slug: string | null; logoUrl: string | null; recruiterCount: number }
  >()
  for (const p of profiles) {
    merged.set(p.companyName.toLowerCase(), {
      name: p.companyName,
      profileId: p.id,
      slug: p.slug,
      logoUrl: p.logoUrl,
      recruiterCount: recruiterCompanyMap.get(p.companyName) ?? 0,
    })
  }
  Array.from(recruiterCompanyMap.entries()).forEach(([name, count]) => {
    const key = name.toLowerCase()
    if (merged.has(key)) {
      merged.get(key)!.recruiterCount = count
    } else {
      merged.set(key, { name, profileId: null, slug: null, logoUrl: null, recruiterCount: count })
    }
  })

  const companies = Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name))

  return NextResponse.json({ institutions, companies })
}
