import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { onHiringConfirmed } from '@/lib/cross-segment-connections'

/**
 * GET /api/hiring-confirmation
 * Returns pending/prompted hiring confirmations for the logged-in student.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const confirmations = await prisma.hiringConfirmation.findMany({
      where: {
        studentId: session.user.id,
        status: { in: ['PROMPTED', 'PENDING'] },
      },
      orderBy: { contactDate: 'desc' },
    })

    return NextResponse.json({
      confirmations: confirmations.map((c) => ({
        id: c.id,
        companyName: c.companyName,
        contactDate: c.contactDate.toISOString(),
        status: c.status,
        promptSentAt: c.promptSentAt?.toISOString() || null,
      })),
    })
  } catch (error) {
    console.error('Error fetching hiring confirmations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/hiring-confirmation
 * Student responds to a hiring confirmation prompt.
 * Body: { confirmationId, confirmedHired, jobTitle?, startDate?, feedback? }
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { confirmationId, confirmedHired, jobTitle, startDate, feedback } = body

    if (!confirmationId) {
      return NextResponse.json({ error: 'confirmationId is required' }, { status: 400 })
    }

    if (typeof confirmedHired !== 'boolean') {
      return NextResponse.json({ error: 'confirmedHired must be a boolean' }, { status: 400 })
    }

    // Verify the confirmation belongs to this student
    const confirmation = await prisma.hiringConfirmation.findFirst({
      where: { id: confirmationId, studentId: session.user.id },
      include: { contactUsage: true },
    })

    if (!confirmation) {
      return NextResponse.json({ error: 'Confirmation not found' }, { status: 404 })
    }

    if (confirmation.status === 'CONFIRMED_HIRED' || confirmation.status === 'CONFIRMED_NOT_HIRED') {
      return NextResponse.json({ error: 'Already responded' }, { status: 400 })
    }

    const newStatus = confirmedHired ? 'CONFIRMED_HIRED' : 'CONFIRMED_NOT_HIRED'

    // Update the confirmation record
    const updated = await prisma.hiringConfirmation.update({
      where: { id: confirmationId },
      data: {
        status: newStatus,
        confirmedHired,
        jobTitle: confirmedHired ? (jobTitle || null) : null,
        startDate: confirmedHired && startDate ? new Date(startDate) : null,
        feedback: feedback || null,
        respondedAt: new Date(),
      },
    })

    // If confirmed hired, create a Placement and update ContactUsage outcome
    if (confirmedHired) {
      const student = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { university: true },
      })

      await prisma.placement.create({
        data: {
          studentId: session.user.id,
          universityName: student?.university || 'Unknown',
          companyName: confirmation.companyName,
          jobTitle: jobTitle || 'Not specified',
          jobType: 'FULL_TIME',
          startDate: startDate ? new Date(startDate) : new Date(),
          status: 'CONFIRMED',
          source: 'platform',
        },
      })

      await prisma.contactUsage.update({
        where: { id: confirmation.contactUsageId },
        data: {
          outcome: 'hired',
          outcomeAt: new Date(),
          hiringPosition: jobTitle || null,
        },
      })

      // Cross-segment: notify university, update placement pipeline
      onHiringConfirmed(
        session.user.id,
        confirmation.contactUsage?.recruiterId || '',
        jobTitle || 'Not specified',
        confirmation.companyName
      ).catch(err => console.error('Hiring notification failed:', err))
    }

    return NextResponse.json({ confirmation: updated })
  } catch (error) {
    console.error('Error updating hiring confirmation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
