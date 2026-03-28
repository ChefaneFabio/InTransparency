import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const feedbackSchema = z.object({
  contactUsageId: z.string(),
  rating: z.number().min(1).max(5),
  matchedExpectations: z.boolean(),
  comment: z.string().max(1000).optional(),
})

/**
 * GET /api/dashboard/student/hiring-feedback
 * Returns contacts where the student was hired but hasn't given feedback yet.
 *
 * POST /api/dashboard/student/hiring-feedback
 * Submit feedback on a hiring experience.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find contacts where this student was hired
    const hiredContacts = await prisma.contactUsage.findMany({
      where: {
        recipientId: session.user.id,
        outcome: 'hired',
      },
      select: {
        id: true,
        hiringPosition: true,
        outcomeAt: true,
        recruiter: {
          select: { company: true },
        },
      },
      orderBy: { outcomeAt: 'desc' },
    })

    // Check which ones already have feedback (store in notes field for now)
    const pendingFeedback = hiredContacts.filter(c => !c.hiringPosition?.includes('[feedback:'))
    const completedFeedback = hiredContacts.filter(c => c.hiringPosition?.includes('[feedback:'))

    return NextResponse.json({
      pending: pendingFeedback.map(c => ({
        id: c.id,
        company: c.recruiter?.company || 'Unknown',
        hiredAt: c.outcomeAt?.toISOString() || null,
      })),
      completed: completedFeedback.length,
      total: hiredContacts.length,
    })
  } catch (error) {
    console.error('Hiring feedback error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { contactUsageId, rating, matchedExpectations, comment } = feedbackSchema.parse(body)

    // Verify this contact belongs to the student
    const contact = await prisma.contactUsage.findFirst({
      where: {
        id: contactUsageId,
        recipientId: session.user.id,
        outcome: 'hired',
      },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Store feedback in hiringPosition field (append)
    const feedbackData = `[feedback:${rating}/5,matched:${matchedExpectations},comment:${comment || 'none'}]`
    await prisma.contactUsage.update({
      where: { id: contactUsageId },
      data: {
        hiringPosition: contact.hiringPosition
          ? `${contact.hiringPosition} ${feedbackData}`
          : feedbackData,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Hiring feedback error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
