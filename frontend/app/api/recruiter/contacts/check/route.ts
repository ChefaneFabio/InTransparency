import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * POST /api/recruiter/contacts/check
 * Check if the recruiter has already contacted a specific candidate.
 * Body: { candidateId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { candidateId } = body

    if (!candidateId || typeof candidateId !== 'string') {
      return NextResponse.json(
        { error: 'candidateId is required' },
        { status: 400 }
      )
    }

    // Find the most recent contact between this recruiter and candidate
    const contact = await prisma.contactUsage.findFirst({
      where: {
        recruiterId: session.user.id,
        recipientId: candidateId,
      },
      orderBy: { firstContactAt: 'desc' },
      select: {
        id: true,
        firstContactAt: true,
        outcome: true,
      },
    })

    if (contact) {
      return NextResponse.json({
        contacted: true,
        contactDate: contact.firstContactAt.toISOString(),
        outcome: contact.outcome ?? null,
      })
    }

    return NextResponse.json({
      contacted: false,
    })
  } catch (error) {
    console.error('Error checking contact status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
