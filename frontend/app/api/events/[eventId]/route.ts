import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/events/[eventId]
 *
 * Public event detail. Visible if PUBLISHED, or to anyone holding the
 * direct link (we don't gate non-published events because invitees may
 * receive a link before the event flips to PUBLISHED — they can preview
 * the page but RSVP will be blocked by /api/events/[eventId]/rsvp).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params

  const event = await prisma.careerEvent.findUnique({
    where: { id: eventId },
    include: {
      organizer: {
        select: { name: true, logo: true, website: true },
      },
      _count: {
        select: { rsvps: true, slots: true },
      },
    },
  })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (event.status === 'DRAFT' || event.status === 'CANCELLED') {
    return NextResponse.json({ error: 'Event not available' }, { status: 404 })
  }

  return NextResponse.json({
    event: {
      id: event.id,
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      location: event.location,
      isOnline: event.isOnline,
      meetingUrl: event.isOnline ? event.meetingUrl : null,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      timezone: event.timezone,
      status: event.status,
      maxAttendees: event.maxAttendees,
      maxRecruiters: event.maxRecruiters,
      registrationDeadline: event.registrationDeadline?.toISOString() ?? null,
      requiresApproval: event.requiresApproval,
      organizer: event.organizer?.name ?? 'InTransparency',
      organizerLogo: event.organizer?.logo ?? null,
      organizerWebsite: event.organizer?.website ?? null,
      attendeeCount: event._count.rsvps,
      slotCount: event._count.slots,
      spotsLeft: event.maxAttendees ? Math.max(0, event.maxAttendees - event._count.rsvps) : null,
    },
  })
}
