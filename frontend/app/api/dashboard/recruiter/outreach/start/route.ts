import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * POST /api/dashboard/recruiter/outreach/start
 * Kick off an outreach sequence for a candidate using an existing template.
 * Body: { candidateId: string, templateId: string }
 *
 * The first step is delivered immediately (nextSendAt = now). Subsequent steps
 * are scheduled via each step's `delayDays`. The cron endpoint walks the
 * schedule and creates a Message per step.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { candidateId, templateId } = await req.json()
    if (!candidateId || !templateId) {
      return NextResponse.json({ error: 'candidateId and templateId are required' }, { status: 400 })
    }

    const [template, candidate, existing] = await Promise.all([
      prisma.outreachTemplate.findFirst({
        where: { id: templateId, recruiterId: session.user.id },
      }),
      prisma.user.findUnique({
        where: { id: candidateId },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
      }),
      prisma.outreachSequence.findFirst({
        where: { recruiterId: session.user.id, candidateId, status: 'ACTIVE' },
      }),
    ])

    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    if (!candidate || candidate.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }
    if (existing) {
      return NextResponse.json({ error: 'An active sequence already exists for this candidate' }, { status: 409 })
    }

    const steps = Array.isArray(template.steps) ? template.steps : []
    if (steps.length === 0) {
      return NextResponse.json({ error: 'Template has no steps' }, { status: 400 })
    }

    const sequence = await prisma.outreachSequence.create({
      data: {
        recruiterId: session.user.id,
        candidateId,
        templateId: template.id,
        templateName: template.name,
        steps: template.steps as any,
        currentStepIdx: 0,
        status: 'ACTIVE',
        nextSendAt: new Date(), // first step fires immediately on next cron tick
      },
    })

    return NextResponse.json({ sequence }, { status: 201 })
  } catch (error) {
    console.error('Error starting outreach sequence:', error)
    return NextResponse.json({ error: 'Failed to start sequence' }, { status: 500 })
  }
}
