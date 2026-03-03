import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const VALID_OUTCOMES = ['hired', 'interviewed', 'no_response', 'rejected', 'withdrawn'] as const

/**
 * GET /api/dashboard/recruiter/hiring-outcomes
 * List all contacts with their hiring outcomes for the current recruiter.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const contacts = await prisma.contactUsage.findMany({
      where: { recruiterId: session.user.id },
      include: {
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            university: true,
            degree: true,
          },
        },
      },
      orderBy: { firstContactAt: 'desc' },
    })

    // Aggregate stats
    const total = contacts.length
    const withOutcome = contacts.filter((c) => c.outcome).length
    const hired = contacts.filter((c) => c.outcome === 'hired').length
    const interviewed = contacts.filter((c) => c.outcome === 'interviewed').length
    const noResponse = contacts.filter((c) => c.outcome === 'no_response').length

    return NextResponse.json({
      contacts: contacts.map((c) => ({
        id: c.id,
        recipient: c.recipient,
        firstContactAt: c.firstContactAt.toISOString(),
        outcome: c.outcome,
        outcomeNote: c.outcomeNote,
        outcomeAt: c.outcomeAt?.toISOString() || null,
        hiringPosition: c.hiringPosition,
        responseTimeHours: c.responseTimeHours,
      })),
      stats: {
        total,
        withOutcome,
        hired,
        interviewed,
        noResponse,
        pendingFeedback: total - withOutcome,
        hireRate: total > 0 ? Math.round((hired / total) * 100) : 0,
        responseRate: total > 0 ? Math.round(((total - noResponse) / total) * 100) : 0,
      },
    })
  } catch (error) {
    console.error('Error fetching hiring outcomes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/dashboard/recruiter/hiring-outcomes
 * Update the outcome for a specific contact.
 * Body: { contactId, outcome, outcomeNote?, hiringPosition?, responseTimeHours? }
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { contactId, outcome, outcomeNote, hiringPosition, responseTimeHours } = body

    if (!contactId) {
      return NextResponse.json({ error: 'contactId is required' }, { status: 400 })
    }
    if (!outcome || !VALID_OUTCOMES.includes(outcome)) {
      return NextResponse.json(
        { error: `outcome must be one of: ${VALID_OUTCOMES.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify the contact belongs to this recruiter
    const contact = await prisma.contactUsage.findFirst({
      where: { id: contactId, recruiterId: session.user.id },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const updated = await prisma.contactUsage.update({
      where: { id: contactId },
      data: {
        outcome,
        outcomeNote: outcomeNote || null,
        outcomeAt: new Date(),
        hiringPosition: hiringPosition || null,
        responseTimeHours: responseTimeHours ? parseInt(String(responseTimeHours)) : null,
      },
    })

    return NextResponse.json({ contact: updated })
  } catch (error) {
    console.error('Error updating hiring outcome:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
