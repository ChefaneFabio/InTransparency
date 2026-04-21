import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * PATCH /api/dashboard/university/internship-pipeline/deals/[id]
 * Update an InternshipDeal. Used by drag-and-drop to change `stage`,
 * and by the edit form to update everything else.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const existing = await prisma.internshipDeal.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    if (existing.ownerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const data: any = {}
    const allowedStages = ['LEAD', 'CONVENZIONE', 'MATCHING', 'ATTIVO', 'COMPLETATO', 'ASSUNTO', 'LOST']

    if ('stage' in body && allowedStages.includes(body.stage)) {
      data.stage = body.stage
      if (body.stage !== existing.stage) data.stageChangedAt = new Date()
    }
    if ('studentId' in body) data.studentId = body.studentId || null
    if ('companyName' in body && body.companyName?.trim()) data.companyName = body.companyName.trim()
    if ('contactName' in body) data.contactName = body.contactName?.trim() || null
    if ('contactEmail' in body) data.contactEmail = body.contactEmail?.trim() || null
    if ('role' in body) data.role = body.role?.trim() || null
    if ('industry' in body) data.industry = body.industry?.trim() || null
    if ('tutorName' in body) data.tutorName = body.tutorName?.trim() || null
    if ('tutorEmail' in body) data.tutorEmail = body.tutorEmail?.trim() || null
    if ('salaryAmount' in body) data.salaryAmount = typeof body.salaryAmount === 'number' ? body.salaryAmount : null
    if ('notes' in body) data.notes = body.notes?.trim() || null
    if ('startDate' in body) data.startDate = body.startDate ? new Date(body.startDate) : null
    if ('endDate' in body) data.endDate = body.endDate ? new Date(body.endDate) : null

    const deal = await prisma.internshipDeal.update({ where: { id }, data })
    return NextResponse.json({ deal })
  } catch (error) {
    console.error('InternshipDeal patch error:', error)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}

/**
 * DELETE /api/dashboard/university/internship-pipeline/deals/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const existing = await prisma.internshipDeal.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    if (existing.ownerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.internshipDeal.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('InternshipDeal delete error:', error)
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}
