import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, placementWhereForUser, audit } from '@/lib/rbac/institution-scope'

export const maxDuration = 15

/**
 * GET /api/placements
 *   Role-scoped list — same endpoint for student, tutor, staff, company.
 *   Query params:
 *     - institutionId (staff only): narrow to one institution
 *     - stage: filter to a specific PlacementStage id
 *     - offerType: filter by OfferType
 *     - status: pending | active | overdue (derived)
 *     - limit / offset
 *
 * POST /api/placements
 *   Staff-only (or platform admin). Create a new placement, usually linked
 *   to an Application that's been accepted.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const stage = url.searchParams.get('stage')
    const offerType = url.searchParams.get('offerType')
    const institutionIdFilter = url.searchParams.get('institutionId')
    const limit = Math.min(200, Number(url.searchParams.get('limit')) || 100)
    const offset = Number(url.searchParams.get('offset')) || 0

    const where: any = await placementWhereForUser(session.user.id)
    if (stage) where.currentStageId = stage
    if (offerType) where.offerType = offerType
    if (institutionIdFilter) where.institutionId = institutionIdFilter

    const placements = await prisma.placement.findMany({
      where,
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true, degree: true, photo: true },
        },
        academicTutor: { select: { id: true, firstName: true, lastName: true, email: true } },
        companyTutor:  { select: { id: true, firstName: true, lastName: true, email: true } },
        currentStage:  { select: { id: true, name: true, order: true, type: true } },
        convention:    { select: { id: true, companyName: true, status: true } },
        _count: { select: { evaluations: true, hoursLogs: true, deadlines: true } },
      },
      orderBy: [{ startDate: 'desc' }],
      take: limit,
      skip: offset,
    })

    const now = Date.now()
    const shaped = placements.map(p => {
      const totalLogged = p.completedHours || 0
      const planned = p.plannedHours || 0
      const hoursPct = planned > 0 ? Math.min(100, Math.round((totalLogged / planned) * 100)) : null
      const daysSinceHours = p.lastHoursLoggedAt
        ? Math.floor((now - p.lastHoursLoggedAt.getTime()) / 86_400_000)
        : null
      return {
        id: p.id,
        student: p.student
          ? {
              id: p.student.id,
              name: [p.student.firstName, p.student.lastName].filter(Boolean).join(' ') || p.student.email,
              email: p.student.email,
              degree: p.student.degree,
              photo: p.student.photo,
            }
          : null,
        companyName: p.companyName,
        jobTitle: p.jobTitle,
        offerType: p.offerType,
        stage: p.currentStage,
        stageEnteredAt: p.stageEnteredAt?.toISOString() || null,
        startDate: p.startDate.toISOString(),
        endDate: p.endDate?.toISOString() || null,
        academicTutor: p.academicTutor
          ? { id: p.academicTutor.id, name: [p.academicTutor.firstName, p.academicTutor.lastName].filter(Boolean).join(' ') }
          : null,
        companyTutor: p.companyTutor
          ? { id: p.companyTutor.id, name: [p.companyTutor.firstName, p.companyTutor.lastName].filter(Boolean).join(' ') }
          : null,
        plannedHours: planned || null,
        completedHours: totalLogged,
        hoursPct,
        daysSinceHoursLogged: daysSinceHours,
        convention: p.convention,
        counts: p._count,
        outcome: p.outcome,
        status: p.status,
      }
    })

    return NextResponse.json({ placements: shaped, total: shaped.length })
  } catch (error) {
    console.error('GET /api/placements error:', error)
    return NextResponse.json({ error: 'Failed to load placements' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const {
      studentId, institutionId, companyName, jobTitle, offerType,
      startDate, endDate, plannedHours,
      academicTutorId, companyTutorUserId, conventionId,
      applicationId, source,
    } = body

    if (!studentId || !institutionId || !companyName || !jobTitle || !startDate) {
      return NextResponse.json({ error: 'studentId, institutionId, companyName, jobTitle, startDate are required' }, { status: 400 })
    }

    // Only institution staff for that institution or platform admin can create
    const scope = await getUserScope(session.user.id)
    if (!scope) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const allowed = scope.isPlatformAdmin || scope.staffInstitutionIds.includes(institutionId)
    if (!allowed) return NextResponse.json({ error: 'Not a staff member of this institution' }, { status: 403 })

    // Default to the first stage of that institution
    const firstStage = await prisma.placementStage.findFirst({
      where: { institutionId, archived: false },
      orderBy: { order: 'asc' },
      select: { id: true },
    })

    const placement = await prisma.placement.create({
      data: {
        studentId,
        institutionId,
        universityName: '', // legacy field kept nullable via default
        companyName,
        jobTitle,
        offerType: offerType || 'TIROCINIO_CURRICULARE',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        plannedHours: plannedHours || null,
        academicTutorId: academicTutorId || null,
        companyTutorUserId: companyTutorUserId || null,
        conventionId: conventionId || null,
        applicationId: applicationId || null,
        source: source || 'platform',
        currentStageId: firstStage?.id || null,
        stageEnteredAt: new Date(),
      },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'placement.create',
      entityType: 'Placement',
      entityId: placement.id,
      institutionId,
    })

    return NextResponse.json({ placement }, { status: 201 })
  } catch (error) {
    console.error('POST /api/placements error:', error)
    return NextResponse.json({ error: 'Failed to create placement' }, { status: 500 })
  }
}
