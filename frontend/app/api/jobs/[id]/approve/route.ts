import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'
import { checkPremium } from '@/lib/rbac/plan-check'

/**
 * POST /api/jobs/[id]/approve
 * Staff of the tied institution can approve a PENDING_APPROVAL job,
 * transitioning it to ACTIVE and making it visible to students.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const scope = await getUserScope(session.user.id)
    if (!scope) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const job = await prisma.job.findUnique({ where: { id }, select: { institutionId: true, status: true } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!job.institutionId) {
      return NextResponse.json({ error: 'Job not tied to any institution' }, { status: 400 })
    }
    if (!scope.isPlatformAdmin && !scope.staffInstitutionIds.includes(job.institutionId)) {
      return NextResponse.json({ error: 'Not staff of this institution' }, { status: 403 })
    }
    if (job.status !== 'PENDING_APPROVAL') {
      return NextResponse.json({ error: 'Job not in PENDING_APPROVAL' }, { status: 400 })
    }

    if (!scope.isPlatformAdmin) {
      const gate = await checkPremium(job.institutionId, 'job.approve')
      if (gate) return gate
    }

    const now = new Date()
    const updated = await prisma.job.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        isPublic: true,
        approvedByStaffId: session.user.id,
        approvedAt: now,
        postedAt: now,
      },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'job.approve',
      entityType: 'Job',
      entityId: id,
      institutionId: job.institutionId,
    })

    return NextResponse.json({ job: updated })
  } catch (error) {
    console.error('Approve job error:', error)
    return NextResponse.json({ error: 'Failed to approve' }, { status: 500 })
  }
}
