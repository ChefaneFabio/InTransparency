import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { sendEventInviteEmail } from '@/lib/email'
import { createNotification } from '@/lib/notifications'

/**
 * POST /api/dashboard/university/events/[id]/invite
 *
 * Invites companies / recruiters to a career-day event by email. Looks up
 * each recipient by email; if a User exists, creates a pending EventRSVP
 * and a notification. Sends an invite email regardless (so we can invite
 * cold contacts who'll claim later via signup).
 *
 * Body: { emails: string[], note?: string }
 */

const bodySchema = z.object({
  emails: z.array(z.string().email()).min(1).max(200),
  note: z.string().max(2000).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id: eventId } = await params

  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await request.json())
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const settings = await prisma.universitySettings.findUnique({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  })
  if (!settings) return NextResponse.json({ error: 'University settings not found' }, { status: 404 })

  const event = await prisma.careerEvent.findFirst({
    where: { id: eventId, organizerId: settings.id },
  })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  // Dedup, normalize.
  const uniqueEmails = Array.from(new Set(body.emails.map(e => e.trim().toLowerCase())))

  // Resolve which emails belong to existing users.
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: uniqueEmails, mode: 'insensitive' } },
    select: { id: true, email: true, role: true },
  })
  const userByEmail = new Map(existingUsers.map(u => [u.email.toLowerCase(), u]))

  let invitedExisting = 0
  let invitedExternal = 0
  let failed = 0

  for (const email of uniqueEmails) {
    try {
      const user = userByEmail.get(email)
      if (user) {
        await prisma.eventRSVP.upsert({
          where: { eventId_userId: { eventId, userId: user.id } },
          update: {},
          create: {
            eventId,
            userId: user.id,
            role: user.role === 'STUDENT' ? 'STUDENT' : 'RECRUITER',
            status: 'PENDING',
          },
        })
        await createNotification({
          userId: user.id,
          type: 'EVENT_RSVP',
          title: settings.name
            ? `Invito da ${settings.name}: ${event.title}`
            : `Invito a un evento: ${event.title}`,
          body: body.note ?? `Sei stato invitato all'evento "${event.title}".`,
          link: `/events/${eventId}`,
        })
        invitedExisting++
      } else {
        invitedExternal++
      }

      await sendEventInviteEmail(
        email,
        event.title,
        event.startDate,
        event.location ?? (event.isOnline ? 'Online' : ''),
        settings.name ?? 'InTransparency',
        body.note,
        eventId
      )
    } catch (err) {
      failed++
      console.error('[events/invite] failed for', email, err)
    }
  }

  return NextResponse.json({
    requested: uniqueEmails.length,
    invitedExisting,
    invitedExternal,
    failed,
  })
}
