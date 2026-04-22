import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'
import { checkPremium } from '@/lib/rbac/plan-check'

/**
 * POST /api/leads — create a new company lead in the pipeline.
 * Body: { institutionId, externalName, externalDomain?, sector?, sizeRange?,
 *         region?, city?, source?, primaryContactName?, primaryContactEmail?,
 *         primaryContactPhone?, stageId?, ownerStaffId?, nextActionAt? }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const {
      institutionId, externalName, externalDomain, sector, sizeRange, region, city,
      source, primaryContactName, primaryContactEmail, primaryContactPhone,
      stageId, ownerStaffId, nextActionAt,
    } = body

    if (!institutionId || !externalName?.trim()) {
      return NextResponse.json({ error: 'institutionId and externalName required' }, { status: 400 })
    }

    const scope = await getUserScope(session.user.id)
    if (!scope || (!scope.isPlatformAdmin && !scope.staffInstitutionIds.includes(institutionId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!scope.isPlatformAdmin) {
      const gate = await checkPremium(institutionId, 'lead.create')
      if (gate) return gate
    }

    // Default to first stage (LEAD type) if not specified
    let targetStageId = stageId
    if (!targetStageId) {
      const firstStage = await prisma.pipelineStage.findFirst({
        where: { institutionId, archived: false },
        orderBy: { order: 'asc' },
        select: { id: true },
      })
      targetStageId = firstStage?.id
      if (!targetStageId) {
        return NextResponse.json({ error: 'No pipeline stages configured' }, { status: 400 })
      }
    }

    const lead = await prisma.companyLead.create({
      data: {
        institutionId,
        externalName: externalName.trim(),
        externalDomain: externalDomain?.trim() || null,
        sector: sector?.trim() || null,
        sizeRange: sizeRange || null,
        region: region?.trim() || null,
        city: city?.trim() || null,
        source: source?.trim() || null,
        primaryContactName: primaryContactName?.trim() || null,
        primaryContactEmail: primaryContactEmail?.trim() || null,
        primaryContactPhone: primaryContactPhone?.trim() || null,
        currentStageId: targetStageId,
        ownerStaffId: ownerStaffId || session.user.id,
        nextActionAt: nextActionAt ? new Date(nextActionAt) : null,
      },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'lead.create',
      entityType: 'CompanyLead',
      entityId: lead.id,
      institutionId,
    })

    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    console.error('Create lead error:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
