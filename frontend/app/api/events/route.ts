import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/events
 * Public endpoint: list published upcoming events.
 * Optional query params: type, search, page, limit
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || undefined
    const search = url.searchParams.get('search') || undefined
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)

    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
      endDate: { gte: new Date() },
    }

    if (type) {
      where.eventType = type
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [events, total] = await Promise.all([
      prisma.careerEvent.findMany({
        where: where as any,
        include: {
          organizer: {
            select: {
              name: true,
              logo: true,
            },
          },
          _count: {
            select: {
              rsvps: true,
              slots: true,
            },
          },
        },
        orderBy: { startDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.careerEvent.count({ where: where as any }),
    ])

    return NextResponse.json({
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        eventType: e.eventType,
        location: e.location,
        isOnline: e.isOnline,
        meetingUrl: e.isOnline ? e.meetingUrl : null,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate.toISOString(),
        timezone: e.timezone,
        maxAttendees: e.maxAttendees,
        registrationDeadline: e.registrationDeadline?.toISOString() || null,
        organizer: e.organizer?.name || 'Unknown',
        organizerLogo: e.organizer?.logo || null,
        attendeeCount: e._count.rsvps,
        slotCount: e._count.slots,
        spotsLeft: e.maxAttendees ? Math.max(0, e.maxAttendees - e._count.rsvps) : null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
