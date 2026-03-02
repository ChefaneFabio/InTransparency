import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

/**
 * GET /api/events/[eventId]/rsvp
 * Get RSVP status for a specific event (for current user).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await params

    const rsvp = await prisma.eventRSVP.findUnique({
      where: {
        eventId_userId: { eventId, userId: session.user.id },
      },
    })

    const event = await prisma.careerEvent.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        maxAttendees: true,
        maxRecruiters: true,
        status: true,
        _count: { select: { rsvps: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({
      rsvp: rsvp || null,
      event: {
        ...event,
        rsvpCount: event._count.rsvps,
      },
    })
  } catch (error) {
    console.error('RSVP fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/events/[eventId]/rsvp
 * Create or update RSVP for an event.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await params
    const body = await request.json()
    const { companyName, boothRequest, notes } = body

    // Verify event exists and is published
    const event = await prisma.careerEvent.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { rsvps: true },
        },
        organizer: {
          select: { userId: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Event is not open for registration' }, { status: 400 })
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 })
    }

    // Determine role from user role
    const role = session.user.role === 'RECRUITER' ? 'RECRUITER' : 'STUDENT'

    // Check capacity
    if (role === 'RECRUITER' && event.maxRecruiters) {
      const recruiterCount = await prisma.eventRSVP.count({
        where: { eventId, role: 'RECRUITER', status: { in: ['CONFIRMED', 'PENDING'] } },
      })
      if (recruiterCount >= event.maxRecruiters) {
        return NextResponse.json({ error: 'Recruiter capacity reached' }, { status: 409 })
      }
    }

    if (role === 'STUDENT' && event.maxAttendees) {
      const studentCount = await prisma.eventRSVP.count({
        where: { eventId, role: 'STUDENT', status: { in: ['CONFIRMED', 'PENDING'] } },
      })
      if (studentCount >= event.maxAttendees) {
        return NextResponse.json({ error: 'Event is at full capacity' }, { status: 409 })
      }
    }

    const status = event.requiresApproval ? 'PENDING' : 'CONFIRMED'

    const rsvp = await prisma.eventRSVP.upsert({
      where: {
        eventId_userId: { eventId, userId: session.user.id },
      },
      update: {
        status,
        companyName: companyName || null,
        boothRequest: boothRequest || false,
        notes: notes || null,
      },
      create: {
        eventId,
        userId: session.user.id,
        role,
        status,
        companyName: companyName || null,
        boothRequest: boothRequest || false,
        notes: notes || null,
      },
    })

    // Notify event organizer
    if (event.organizer.userId) {
      await createNotification({
        userId: event.organizer.userId,
        type: 'EVENT_RSVP',
        title: 'New RSVP',
        body: `${session.user.name || 'Someone'} registered for "${event.title}"`,
        link: `/dashboard/university/events`,
      })
    }

    return NextResponse.json({ rsvp }, { status: 201 })
  } catch (error) {
    console.error('RSVP create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/events/[eventId]/rsvp
 * Cancel RSVP for an event.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await params

    const existing = await prisma.eventRSVP.findUnique({
      where: {
        eventId_userId: { eventId, userId: session.user.id },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 })
    }

    await prisma.eventRSVP.update({
      where: { id: existing.id },
      data: { status: 'CANCELLED' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('RSVP cancel error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
