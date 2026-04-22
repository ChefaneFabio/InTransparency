import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'

/**
 * POST /api/jobs/[id]/reject
 * Body: { reason }
 * Staff rejects a PENDING_APPROVAL offer. Job status returns to DRAFT
 * so the recruiter can address and resubmit.
 */
export async function POST(
  req: NextRequest,
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
    if (!job.institutionId || (!scope.isPlatformAdmin && !scope.staffInstitutionIds.includes(job.institutionId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (job.status !== 'PENDING_APPROVAL') {
      return NextResponse.json({ error: 'Job not in PENDING_APPROVAL' }, { status: 400 })
    }

    const body = await req.json().catch(() => ({}))
    const { reason } = body
    if (!reason?.trim()) {
      return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })
    }

    const updated = await prisma.job.update({
      where: { id },
      data: { status: 'DRAFT', isPublic: false },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'job.reject',
      entityType: 'Job',
      entityId: id,
      payload: { reason: reason.trim() },
      institutionId: job.institutionId,
    })

    return NextResponse.json({ job: updated })
  } catch (error) {
    console.error('Reject job error:', error)
    return NextResponse.json({ error: 'Failed to reject' }, { status: 500 })
  }
}
