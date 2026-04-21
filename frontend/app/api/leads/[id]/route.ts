import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'

/**
 * GET/PATCH/DELETE a CompanyLead. Staff-only on the lead's institution.
 */
async function authorize(userId: string, leadId: string) {
  const scope = await getUserScope(userId)
  if (!scope) return { ok: false, lead: null, scope: null }
  const lead = await prisma.companyLead.findUnique({ where: { id: leadId } })
  if (!lead) return { ok: false, lead: null, scope }
  const ok = scope.isPlatformAdmin || scope.staffInstitutionIds.includes(lead.institutionId)
  return { ok, lead, scope }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const { ok, scope } = await authorize(session.user.id, id)
    if (!ok || !scope) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const lead = await prisma.companyLead.findUnique({
      where: { id },
      include: {
        ownerStaff: { select: { id: true, firstName: true, lastName: true, email: true } },
        currentStage: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: { staff: { select: { id: true, firstName: true, lastName: true } } },
        },
        transitions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            fromStage: { select: { id: true, name: true } },
            toStage: { select: { id: true, name: true } },
            staff: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    })
    if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('GET lead error:', error)
    return NextResponse.json({ error: 'Failed to load lead' }, { status: 500 })
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

    const { ok, lead } = await authorize(session.user.id, id)
    if (!ok || !lead) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json().catch(() => ({}))
    const data: any = {}
    for (const k of ['externalName','externalDomain','sector','sizeRange','region','city','source','primaryContactName','primaryContactEmail','primaryContactPhone','lostReason']) {
      if (k in body) data[k] = body[k]?.toString().trim() || null
    }
    if ('ownerStaffId' in body) data.ownerStaffId = body.ownerStaffId || null
    if ('nextActionAt' in body) data.nextActionAt = body.nextActionAt ? new Date(body.nextActionAt) : null

    const updated = await prisma.companyLead.update({ where: { id }, data })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'lead.update',
      entityType: 'CompanyLead',
      entityId: id,
      payload: { fields: Object.keys(data) },
      institutionId: lead.institutionId,
    })

    return NextResponse.json({ lead: updated })
  } catch (error) {
    console.error('PATCH lead error:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
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

    const { ok, lead } = await authorize(session.user.id, id)
    if (!ok || !lead) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await prisma.companyLead.delete({ where: { id } })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'lead.delete',
      entityType: 'CompanyLead',
      entityId: id,
      institutionId: lead.institutionId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE lead error:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
