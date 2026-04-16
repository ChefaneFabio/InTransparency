import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/consent/[token] — public, token-based
export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const consent = await prisma.parentalConsent.findUnique({
      where: { token: params.token },
    })

    if (!consent) {
      return NextResponse.json({ error: 'Consent request not found' }, { status: 404 })
    }

    // Fetch student name
    const student = await prisma.user.findUnique({
      where: { id: consent.studentId },
      select: { firstName: true, lastName: true, university: true },
    })

    return NextResponse.json({
      consentType: consent.consentType,
      status: consent.status,
      studentName: student ? `${student.firstName || ''} ${student.lastName || ''}`.trim() : 'Studente',
      schoolName: student?.university || 'Istituto',
      requestedAt: consent.requestedAt,
      expiresAt: consent.expiresAt,
      isExpired: new Date() > consent.expiresAt,
      alreadyResponded: consent.status !== 'PENDING',
    })
  } catch (error) {
    console.error('Consent token GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/consent/[token] — parent responds
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const consent = await prisma.parentalConsent.findUnique({
      where: { token: params.token },
    })

    if (!consent) {
      return NextResponse.json({ error: 'Consent request not found' }, { status: 404 })
    }

    if (consent.status !== 'PENDING') {
      return NextResponse.json({ error: 'This consent request has already been responded to' }, { status: 400 })
    }

    if (new Date() > consent.expiresAt) {
      await prisma.parentalConsent.update({
        where: { token: params.token },
        data: { status: 'EXPIRED' },
      })
      return NextResponse.json({ error: 'This consent request has expired' }, { status: 400 })
    }

    const body = await req.json()
    const { response } = body

    if (response !== 'grant' && response !== 'deny') {
      return NextResponse.json({ error: 'Response must be "grant" or "deny"' }, { status: 400 })
    }

    const updated = await prisma.parentalConsent.update({
      where: { token: params.token },
      data: {
        status: response === 'grant' ? 'GRANTED' : 'DENIED',
        respondedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, status: updated.status })
  } catch (error) {
    console.error('Consent token POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
