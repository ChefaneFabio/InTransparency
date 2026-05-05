import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

/**
 * PATCH /api/dashboard/university/events/[id]/rsvps/[rsvpId]
 *
 * Staff override for RSVP status. Used at the door (CONFIRMED = checked in)
 * and for waitlist promotion.
 *
 * Body: { status: 'CONFIRMED' | 'DECLINED' | 'WAITLISTED' | 'CANCELLED' }
 */

const bodySchema = z.object({
  status: z.enum(['CONFIRMED', 'PENDING', 'DECLINED', 'WAITLISTED', 'CANCELLED']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; rsvpId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id: eventId, rsvpId } = await params

  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await request.json())
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const settings = await prisma.universitySettings.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })
  if (!settings) return NextResponse.json({ error: 'University settings not found' }, { status: 404 })

  const rsvp = await prisma.eventRSVP.findFirst({
    where: { id: rsvpId, eventId, event: { organizerId: settings.id } },
  })
  if (!rsvp) return NextResponse.json({ error: 'RSVP not found' }, { status: 404 })

  const updated = await prisma.eventRSVP.update({
    where: { id: rsvpId },
    data: { status: body.status },
  })

  return NextResponse.json({ rsvp: updated })
}
