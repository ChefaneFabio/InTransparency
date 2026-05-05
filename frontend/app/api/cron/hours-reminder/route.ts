import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendHoursReminderEmail } from '@/lib/email'
import { createNotification } from '@/lib/notifications'

/**
 * GET/POST /api/cron/hours-reminder
 *
 * Fires every Monday morning. For every student with an active placement
 * (status=CONFIRMED, started, not yet ended) whose hours log is stale —
 * either no log in 7+ days, or never logged but the placement has been
 * running for 7+ days — sends an email + creates an in-app notification.
 *
 * Idempotency comes from the cron cadence itself: weekly run, so each
 * student gets at most one nudge per week. As soon as they log hours,
 * lastHoursLoggedAt updates and they fall out of the next week's cohort.
 *
 * Auth: Vercel cron (`x-vercel-cron: 1`) or Bearer CRON_SECRET for
 * manual triggers.
 */

async function runReminders(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const vercelCron = req.headers.get('x-vercel-cron') === '1'
  const secret = process.env.CRON_SECRET || ''
  const authorized = (secret && authHeader === `Bearer ${secret}`) || vercelCron
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const placements = await prisma.placement.findMany({
    where: {
      status: 'CONFIRMED',
      startDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gt: now } }],
      AND: [
        {
          OR: [
            { lastHoursLoggedAt: { lt: sevenDaysAgo } },
            { AND: [{ lastHoursLoggedAt: null }, { startDate: { lt: sevenDaysAgo } }] },
          ],
        },
      ],
    },
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      lastHoursLoggedAt: true,
      startDate: true,
      student: {
        select: {
          id: true,
          email: true,
          firstName: true,
          isDemo: true,
        },
      },
      institution: {
        select: { country: true },
      },
    },
    take: 1000,
  })

  let sent = 0
  let skipped = 0
  const errors: Array<{ placementId: string; reason: string }> = []

  for (const p of placements) {
    if (p.student.isDemo) {
      skipped++
      continue
    }
    if (!p.student.email) {
      skipped++
      continue
    }

    const reference = p.lastHoursLoggedAt ?? p.startDate
    const daysSince = Math.max(7, Math.floor((now.getTime() - reference.getTime()) / (24 * 60 * 60 * 1000)))
    const country = p.institution?.country ?? 'IT'
    const locale: 'en' | 'it' = country === 'IT' ? 'it' : 'en'

    try {
      await sendHoursReminderEmail(
        p.student.email,
        p.student.firstName ?? '',
        p.companyName,
        p.jobTitle,
        daysSince,
        locale
      )
      await createNotification({
        userId: p.student.id,
        type: 'GENERAL',
        title: locale === 'it' ? 'Registra le ore di tirocinio' : 'Log your placement hours',
        body:
          locale === 'it'
            ? `Sono passati ${daysSince} giorni dall'ultima registrazione per ${p.companyName}.`
            : `It's been ${daysSince} days since your last hours log for ${p.companyName}.`,
        link: '/dashboard/student/placements',
        groupKey: `hours-reminder:${p.id}`,
      })
      sent++
    } catch (err) {
      errors.push({ placementId: p.id, reason: (err as Error).message ?? 'unknown' })
      console.error('[cron/hours-reminder] failed for placement', p.id, err)
    }
  }

  return NextResponse.json({
    candidates: placements.length,
    sent,
    skipped,
    errors: errors.slice(0, 20),
    timestamp: now.toISOString(),
  })
}

export async function GET(req: NextRequest) {
  return runReminders(req)
}

export async function POST(req: NextRequest) {
  return runReminders(req)
}
