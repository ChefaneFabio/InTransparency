import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'

/**
 * POST /api/leads/[id]/activities
 * Body: { type: NOTE|EMAIL|CALL|MEETING|DOCUMENT, content, attachments? }
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

    const lead = await prisma.companyLead.findUnique({ where: { id } })
    if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!scope.isPlatformAdmin && !scope.staffInstitutionIds.includes(lead.institutionId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const { type, content, attachments } = body
    if (!type || !['NOTE','EMAIL','CALL','MEETING','DOCUMENT','STAGE_CHANGE'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    if (!content?.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 })
    }

    const activity = await prisma.pipelineActivity.create({
      data: {
        leadId: id,
        staffId: session.user.id,
        type,
        content: content.trim(),
        attachments: attachments ?? null,
      },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'lead.activity.log',
      entityType: 'PipelineActivity',
      entityId: activity.id,
      payload: { leadId: id, type },
      institutionId: lead.institutionId,
    })

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error('Lead activity error:', error)
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 })
  }
}
