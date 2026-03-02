import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/events
 * List career events for the university.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
    })

    if (!settings) {
      return NextResponse.json({ events: [] })
    }

    const events = await prisma.careerEvent.findMany({
      where: { organizerId: settings.id },
      include: {
        _count: {
          select: {
            rsvps: true,
            slots: true,
          },
        },
        rsvps: {
          select: {
            id: true,
            role: true,
            status: true,
            companyName: true,
            user: {
              select: { firstName: true, lastName: true },
            },
          },
          take: 10,
        },
      },
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json({
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        eventType: e.eventType,
        location: e.location,
        isOnline: e.isOnline,
        startDate: e.startDate,
        endDate: e.endDate,
        status: e.status,
        maxAttendees: e.maxAttendees,
        maxRecruiters: e.maxRecruiters,
        rsvpCount: e._count.rsvps,
        slotCount: e._count.slots,
        recentRsvps: e.rsvps,
        createdAt: e.createdAt,
      })),
    })
  } catch (error) {
    console.error('Events fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/dashboard/university/events
 * Create a new career event.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
    })

    if (!settings) {
      return NextResponse.json({ error: 'University settings not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      title,
      description,
      eventType,
      location,
      isOnline,
      meetingUrl,
      startDate,
      endDate,
      maxAttendees,
      maxRecruiters,
      registrationDeadline,
      requiresApproval,
    } = body

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      )
    }

    const event = await prisma.careerEvent.create({
      data: {
        organizerId: settings.id,
        title,
        description: description || null,
        eventType: eventType || 'CAREER_DAY',
        location: location || null,
        isOnline: isOnline || false,
        meetingUrl: meetingUrl || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxAttendees: maxAttendees || null,
        maxRecruiters: maxRecruiters || null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        requiresApproval: requiresApproval || false,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Event create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
