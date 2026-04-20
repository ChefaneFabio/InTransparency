import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/outreach/sequences
 * List outreach sequences for the current recruiter, optionally filtered by status.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const statusParam = searchParams.get('status')
    const allowedStatuses = ['ACTIVE', 'PAUSED', 'COMPLETED', 'REPLIED', 'BOUNCED'] as const
    const status = allowedStatuses.includes(statusParam as any) ? (statusParam as any) : undefined

    const where: any = { recruiterId: session.user.id }
    if (status) where.status = status

    const sequences = await prisma.outreachSequence.findMany({
      where,
      include: {
        candidate: {
          select: { id: true, firstName: true, lastName: true, email: true, photo: true, university: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ sequences })
  } catch (error) {
    console.error('Error listing outreach sequences:', error)
    return NextResponse.json({ error: 'Failed to list sequences' }, { status: 500 })
  }
}

/**
 * PATCH /api/dashboard/recruiter/outreach/sequences
 * Pause, resume, or cancel a sequence.
 * Body: { sequenceId: string, action: 'pause' | 'resume' | 'cancel' }
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { sequenceId, action } = await req.json()
    if (!sequenceId || !['pause', 'resume', 'cancel'].includes(action)) {
      return NextResponse.json({ error: 'sequenceId and valid action required' }, { status: 400 })
    }

    const seq = await prisma.outreachSequence.findFirst({
      where: { id: sequenceId, recruiterId: session.user.id },
    })
    if (!seq) return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })

    const nextStatus = action === 'pause' ? 'PAUSED' : action === 'resume' ? 'ACTIVE' : 'COMPLETED'
    const updated = await prisma.outreachSequence.update({
      where: { id: sequenceId },
      data: { status: nextStatus },
    })

    return NextResponse.json({ sequence: updated })
  } catch (error) {
    console.error('Error updating outreach sequence:', error)
    return NextResponse.json({ error: 'Failed to update sequence' }, { status: 500 })
  }
}
