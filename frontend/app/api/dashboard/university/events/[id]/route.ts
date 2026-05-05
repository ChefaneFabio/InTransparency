import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { sendEventCancellationEmail } from '@/lib/email'
import { createNotification } from '@/lib/notifications'

/**
 * GET /api/dashboard/university/events/[id]
 * Full event detail + complete RSVP list, scoped to organizer.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id: eventId } = await params

  const settings = await prisma.universitySettings.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })
  if (!settings) return NextResponse.json({ error: 'University settings not found' }, { status: 404 })

  const event = await prisma.careerEvent.findFirst({
    where: { id: eventId, organizerId: settings.id },
    include: {
      rsvps: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, role: true, company: true },
          },
        },
      },
    },
  })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  return NextResponse.json({ event })
}

/**
 * PUT /api/dashboard/university/events/[id]
 * Update a career event (title, description, status, dates, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: eventId } = await params

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
    })
    if (!settings) {
      return NextResponse.json({ error: 'University settings not found' }, { status: 404 })
    }

    // Verify event belongs to this university
    const existing = await prisma.careerEvent.findFirst({
      where: { id: eventId, organizerId: settings.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      title, description, eventType, location, isOnline, meetingUrl,
      startDate, endDate, status, maxAttendees, maxRecruiters,
      registrationDeadline, requiresApproval, cancellationReason,
    } = body

    const data: Record<string, any> = {}
    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (eventType !== undefined) data.eventType = eventType
    if (location !== undefined) data.location = location
    if (isOnline !== undefined) data.isOnline = isOnline
    if (meetingUrl !== undefined) data.meetingUrl = meetingUrl
    if (startDate !== undefined) data.startDate = new Date(startDate)
    if (endDate !== undefined) data.endDate = new Date(endDate)
    if (status !== undefined) data.status = status
    if (maxAttendees !== undefined) data.maxAttendees = maxAttendees
    if (maxRecruiters !== undefined) data.maxRecruiters = maxRecruiters
    if (registrationDeadline !== undefined) data.registrationDeadline = registrationDeadline ? new Date(registrationDeadline) : null
    if (requiresApproval !== undefined) data.requiresApproval = requiresApproval

    const event = await prisma.careerEvent.update({
      where: { id: eventId },
      data,
    })

    // Status flipped to CANCELLED — notify everyone who was holding a spot.
    // Cancel each affected RSVP so they don't show as expecting attendees.
    if (status === 'CANCELLED' && existing.status !== 'CANCELLED') {
      const affected = await prisma.eventRSVP.findMany({
        where: {
          eventId,
          status: { in: ['PENDING', 'CONFIRMED', 'WAITLISTED'] },
        },
        include: {
          user: { select: { id: true, email: true, firstName: true } },
        },
      })

      const organizerName = settings.name ?? 'InTransparency'

      await prisma.eventRSVP.updateMany({
        where: { eventId, status: { in: ['PENDING', 'CONFIRMED', 'WAITLISTED'] } },
        data: { status: 'CANCELLED' },
      })

      for (const rsvp of affected) {
        if (!rsvp.user.email) continue
        try {
          await sendEventCancellationEmail(
            rsvp.user.email,
            event.title,
            event.startDate,
            organizerName,
            typeof cancellationReason === 'string' ? cancellationReason : undefined,
            'it'
          )
        } catch (err) {
          console.error('[events/cancel] email failed for', rsvp.user.email, err)
        }
        await createNotification({
          userId: rsvp.user.id,
          type: 'EVENT_RSVP',
          title: `Evento annullato: ${event.title}`,
          body: typeof cancellationReason === 'string' && cancellationReason
            ? cancellationReason
            : `${organizerName} ha annullato l'evento.`,
          link: `/events/${eventId}`,
        })
      }
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Event update error:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

/**
 * DELETE /api/dashboard/university/events/[id]
 * Delete a career event.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: eventId } = await params

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
    })
    if (!settings) {
      return NextResponse.json({ error: 'University settings not found' }, { status: 404 })
    }

    const existing = await prisma.careerEvent.findFirst({
      where: { id: eventId, organizerId: settings.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    await prisma.careerEvent.delete({ where: { id: eventId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event delete error:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
