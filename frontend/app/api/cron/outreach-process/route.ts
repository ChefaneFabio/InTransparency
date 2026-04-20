import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/cron/outreach-process
 * Processes all ACTIVE outreach sequences whose nextSendAt <= now.
 * For each, creates a Message (step content), advances currentStepIdx,
 * sets the next nextSendAt based on the next step's delayDays, or marks
 * the sequence COMPLETED if no steps remain.
 *
 * Auth: requires CRON_SECRET in the Authorization header (`Bearer <secret>`).
 * Vercel cron should hit this every N minutes.
 */

interface TemplateStep {
  type: 'intro' | 'followUp' | 'final'
  subject?: string
  body: string
  delayDays?: number
}

function renderTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

async function processDue(req: NextRequest) {
  // Auth: CRON_SECRET or Vercel's built-in cron signature.
  // Vercel's own cron invocations send `x-vercel-cron: 1` from a trusted source; we
  // still require a matching bearer token if CRON_SECRET is configured, to keep the
  // endpoint safe when crons are disabled.
  const authHeader = req.headers.get('authorization') || ''
  const vercelCron = req.headers.get('x-vercel-cron') === '1'
  const secret = process.env.CRON_SECRET || ''
  const authorized = (secret && authHeader === `Bearer ${secret}`) || vercelCron
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const due = await prisma.outreachSequence.findMany({
    where: { status: 'ACTIVE', nextSendAt: { lte: now } },
    include: {
      recruiter: { select: { id: true, firstName: true, lastName: true, email: true } },
      candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
    take: 200,
  })

  let sent = 0
  let completed = 0
  const errors: Array<{ sequenceId: string; error: string }> = []

  for (const seq of due) {
    try {
      const steps = (seq.steps as unknown) as TemplateStep[] | null
      if (!steps || !Array.isArray(steps) || seq.currentStepIdx >= steps.length) {
        await prisma.outreachSequence.update({
          where: { id: seq.id },
          data: { status: 'COMPLETED' },
        })
        completed++
        continue
      }

      const step = steps[seq.currentStepIdx]
      const vars: Record<string, string> = {
        candidateFirstName: seq.candidate.firstName || '',
        candidateLastName: seq.candidate.lastName || '',
        candidateName: [seq.candidate.firstName, seq.candidate.lastName].filter(Boolean).join(' ') || 'there',
        recruiterFirstName: seq.recruiter.firstName || '',
        recruiterLastName: seq.recruiter.lastName || '',
        recruiterName: [seq.recruiter.firstName, seq.recruiter.lastName].filter(Boolean).join(' '),
      }
      const subject = step.subject ? renderTemplate(step.subject, vars) : undefined
      const body = renderTemplate(step.body, vars)

      const message = await prisma.message.create({
        data: {
          senderId: seq.recruiterId,
          recipientId: seq.candidateId,
          recipientEmail: seq.candidate.email,
          subject: subject || null,
          content: body,
          threadId: seq.id, // thread sequence messages by sequence id
        },
      })

      const nextIdx = seq.currentStepIdx + 1
      const nextStep = steps[nextIdx]
      const isLast = !nextStep
      const nextSendAt = nextStep
        ? new Date(now.getTime() + Math.max(0, (nextStep.delayDays ?? 0)) * 86400_000)
        : null

      const events = Array.isArray(seq.events) ? (seq.events as any[]) : []
      events.push({ stepIdx: seq.currentStepIdx, sentAt: now.toISOString(), messageId: message.id })

      await prisma.outreachSequence.update({
        where: { id: seq.id },
        data: {
          currentStepIdx: nextIdx,
          status: isLast ? 'COMPLETED' : 'ACTIVE',
          lastSentAt: now,
          nextSendAt,
          events: events as any,
        },
      })

      sent++
      if (isLast) completed++
    } catch (err: any) {
      errors.push({ sequenceId: seq.id, error: err?.message || 'unknown' })
    }
  }

  return NextResponse.json({
    processed: due.length,
    sent,
    completed,
    errors,
  })
}

export async function GET(req: NextRequest) {
  return processDue(req)
}

export async function POST(req: NextRequest) {
  return processDue(req)
}
