import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope } from '@/lib/rbac/institution-scope'

/**
 * GET /api/institutions/[id]/offers
 * Staff queue of jobs tied to this institution. Query param:
 * - status: DRAFT | PENDING_APPROVAL | ACTIVE | PAUSED | CLOSED | all
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: institutionId } = await params

    const scope = await getUserScope(session.user.id)
    if (!scope || (!scope.isPlatformAdmin && !scope.staffInstitutionIds.includes(institutionId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(req.url)
    const status = url.searchParams.get('status')

    const where: any = { institutionId }
    if (status && status !== 'all') where.status = status

    const jobs = await prisma.job.findMany({
      where,
      select: {
        id: true, title: true, description: true, companyName: true,
        location: true, jobType: true, workLocation: true, requiredSkills: true,
        status: true, offerType: true, createdAt: true, postedAt: true,
        approvedAt: true, conventionId: true,
        convention: { select: { id: true, companyName: true, status: true } },
        recruiter: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    const [pending, active, draft] = await Promise.all([
      prisma.job.count({ where: { institutionId, status: 'PENDING_APPROVAL' } }),
      prisma.job.count({ where: { institutionId, status: 'ACTIVE' } }),
      prisma.job.count({ where: { institutionId, status: 'DRAFT' } }),
    ])

    return NextResponse.json({
      jobs: jobs.map(j => ({
        ...j,
        createdAt: j.createdAt.toISOString(),
        postedAt: j.postedAt?.toISOString() || null,
        approvedAt: j.approvedAt?.toISOString() || null,
      })),
      summary: { pending, active, draft },
    })
  } catch (error) {
    console.error('GET institution offers error:', error)
    return NextResponse.json({ error: 'Failed to load offers' }, { status: 500 })
  }
}
