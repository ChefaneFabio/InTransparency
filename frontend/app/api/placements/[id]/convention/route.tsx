import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { checkPlacementAccess, audit } from '@/lib/rbac/institution-scope'
import { checkPremium } from '@/lib/rbac/plan-check'
import { renderToBuffer } from '@react-pdf/renderer'
import { ConventionPdfDocument, ConventionData } from '@/lib/conventions/build-convention-pdf'

/**
 * GET /api/placements/[id]/convention
 *
 * Convention Builder — returns an Italian "convenzione di tirocinio"
 * draft PDF filled with the placement's known data. Staff reviews the
 * draft, tweaks what's needed, and downloads. No digital signature in
 * v1 — staff prints, counter-signs, or pushes through their existing
 * e-sign flow.
 *
 * Access model:
 *   - Must be institution staff of the placement's institution, OR
 *     platform admin. (Students / tutors / companies don't generate
 *     the convention — they receive it.)
 *   - PREMIUM-gated (same plan-check pattern as M4 placement writes,
 *     since convention generation is a workspace write-class action).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params

    const access = await checkPlacementAccess(session.user.id, id)
    if (!access.canView) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (access.role !== 'INSTITUTION_STAFF' && access.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { error: 'Only institution staff can generate conventions' },
        { status: 403 }
      )
    }

    const placement = await prisma.placement.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            degree: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
            legalName: true,
            vatNumber: true,
            city: true,
          },
        },
        academicTutor: { select: { firstName: true, lastName: true, email: true } },
        companyTutor: { select: { firstName: true, lastName: true, email: true } },
      },
    })

    if (!placement) {
      return NextResponse.json({ error: 'Placement not found' }, { status: 404 })
    }

    if (placement.institutionId && access.role !== 'PLATFORM_ADMIN') {
      const gate = await checkPremium(placement.institutionId, 'convention.generate')
      if (gate) return gate
    }

    const fullName = (u?: { firstName: string | null; lastName: string | null } | null) =>
      u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : ''

    const data: ConventionData = {
      placementId: placement.id,
      generatedAt: new Date(),
      institution: {
        name: placement.institution?.name || placement.universityName,
        // Institution schema has legalName (the org's legal entity name),
        // not a signatory representative — staff fills the rep at sign time.
        legalRepresentative: null,
        address: placement.institution?.city || null,
        vatNumber: placement.institution?.vatNumber || null,
        city: placement.institution?.city || null,
      },
      company: {
        name: placement.companyName,
        industry: placement.companyIndustry,
      },
      student: {
        firstName: placement.student.firstName || '',
        lastName: placement.student.lastName || '',
        taxCode: null,       // Not tracked on User yet; staff fills before sending
        degree: placement.student.degree,
        studentId: null,     // Matricola — not tracked on User yet
      },
      placement: {
        jobTitle: placement.jobTitle,
        offerType: placement.offerType,
        startDate: placement.startDate,
        endDate: placement.endDate,
        plannedHours: placement.plannedHours,
        weeklyHours: null,
        locationAddress: null,
        compensation: {
          amount: placement.salaryAmount,
          currency: placement.salaryCurrency,
          period: placement.salaryPeriod,
        },
      },
      academicTutor: placement.academicTutor
        ? { name: fullName(placement.academicTutor), email: placement.academicTutor.email }
        : null,
      companyTutor: placement.companyTutor
        ? { name: fullName(placement.companyTutor), email: placement.companyTutor.email }
        : null,
    }

    // react-pdf's renderToBuffer typing is stricter than necessary (expects
    // a specific Document element shape); our top-level component returns a
    // Document. Cast to satisfy TS.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(<ConventionPdfDocument data={data} /> as any)

    await audit({
      actorId: session.user.id,
      actorRole: access.role,
      action: 'convention.generate',
      entityType: 'Placement',
      entityId: id,
      institutionId: placement.institutionId ?? undefined,
    })

    const safeCompany = placement.companyName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
    const safeStudent = `${placement.student.firstName || ''}-${placement.student.lastName || ''}`
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
    const filename = `convenzione-${safeCompany}-${safeStudent}.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Convention build error:', error)
    return NextResponse.json({ error: 'Failed to build convention' }, { status: 500 })
  }
}
