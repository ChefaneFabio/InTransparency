import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { checkPlacementAccess, audit } from '@/lib/rbac/institution-scope'

/**
 * GET /api/placements/[id]  — role-scoped detail
 * PATCH /api/placements/[id] — update (staff + tutors with edit rights only)
 * DELETE /api/placements/[id] — staff/admin only
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const access = await checkPlacementAccess(session.user.id, id)
    if (!access.canView) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const placement = await prisma.placement.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true, degree: true, photo: true } },
        academicTutor: { select: { id: true, firstName: true, lastName: true, email: true } },
        companyTutor:  { select: { id: true, firstName: true, lastName: true, email: true } },
        currentStage:  true,
        convention:    { select: { id: true, companyName: true, status: true, signedAt: true, expiresAt: true } },
        evaluations:   {
          orderBy: { submittedAt: 'desc' },
          include: { submittedBy: { select: { id: true, firstName: true, lastName: true } } },
        },
        deadlines:     { orderBy: { dueAt: 'asc' } },
        hoursLogs:     { orderBy: { periodStart: 'desc' }, take: 20 },
      },
    })

    // Also return the list of stages for this institution so the UI can render the pipeline
    const stages = placement?.institutionId
      ? await prisma.placementStage.findMany({
          where: { institutionId: placement.institutionId, archived: false },
          orderBy: { order: 'asc' },
          select: { id: true, name: true, order: true, type: true },
        })
      : []

    return NextResponse.json({ placement, viewerRole: access.role, canEdit: access.canEdit, stages })
  } catch (error) {
    console.error('GET placement error:', error)
    return NextResponse.json({ error: 'Failed to load placement' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const access = await checkPlacementAccess(session.user.id, id)
    if (!access.canEdit) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json().catch(() => ({}))
    const data: any = {}

    // Allowed fields vary by role — tutors can edit limited fields, staff can edit all
    const isStaffOrAdmin = access.role === 'INSTITUTION_STAFF' || access.role === 'PLATFORM_ADMIN'

    if (isStaffOrAdmin) {
      if ('companyName' in body) data.companyName = body.companyName?.trim()
      if ('jobTitle' in body) data.jobTitle = body.jobTitle?.trim()
      if ('offerType' in body) data.offerType = body.offerType
      if ('startDate' in body) data.startDate = body.startDate ? new Date(body.startDate) : undefined
      if ('endDate' in body) data.endDate = body.endDate ? new Date(body.endDate) : null
      if ('plannedHours' in body) data.plannedHours = body.plannedHours ?? null
      if ('academicTutorId' in body) data.academicTutorId = body.academicTutorId || null
      if ('companyTutorUserId' in body) data.companyTutorUserId = body.companyTutorUserId || null
      if ('conventionId' in body) data.conventionId = body.conventionId || null
      if ('outcome' in body) data.outcome = body.outcome
      if ('outcomeNotes' in body) data.outcomeNotes = body.outcomeNotes?.trim() || null
    }

    // Tutors can update notes/outcome
    if ('outcomeNotes' in body && !isStaffOrAdmin && (access.role === 'ACADEMIC_TUTOR' || access.role === 'COMPANY_TUTOR')) {
      data.outcomeNotes = body.outcomeNotes?.trim() || null
    }

    const placement = await prisma.placement.update({ where: { id }, data })

    await audit({
      actorId: session.user.id,
      actorRole: access.role || 'UNKNOWN',
      action: 'placement.update',
      entityType: 'Placement',
      entityId: id,
      payload: { fields: Object.keys(data) },
      institutionId: placement.institutionId || undefined,
    })

    return NextResponse.json({ placement })
  } catch (error) {
    console.error('PATCH placement error:', error)
    return NextResponse.json({ error: 'Failed to update placement' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const access = await checkPlacementAccess(session.user.id, id)
    if (access.role !== 'INSTITUTION_STAFF' && access.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const placement = await prisma.placement.findUnique({ where: { id }, select: { institutionId: true } })
    await prisma.placement.delete({ where: { id } })

    await audit({
      actorId: session.user.id,
      actorRole: access.role,
      action: 'placement.delete',
      entityType: 'Placement',
      entityId: id,
      institutionId: placement?.institutionId || undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE placement error:', error)
    return NextResponse.json({ error: 'Failed to delete placement' }, { status: 500 })
  }
}
