import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendEndorsementExpiryReminderEmail, sendEndorsementExpiryNoticeEmail } from '@/lib/email'
import { createNotification } from '@/lib/notifications'

/**
 * POST /api/cron/endorsement-reminders
 *
 * Sends reminder emails for endorsements expiring in ~2 days (created 5 days ago).
 * Protected by CRON_SECRET header. Idempotent: only targets the 5-6 day window.
 */
export async function POST(req: NextRequest) {
  try {
    const cronSecret = req.headers.get('x-cron-secret')
    if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find endorsements created between 5 and 6 days ago (1-day window for idempotency)
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)

    const expiringEndorsements = await prisma.professorEndorsement.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          gte: sixDaysAgo,
          lte: fiveDaysAgo,
        },
      },
      include: {
        project: { select: { id: true, title: true } },
        student: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    })

    let professorReminders = 0
    let studentNotices = 0

    for (const endorsement of expiringEndorsements) {
      // Send reminder to professor
      if (endorsement.verificationToken) {
        try {
          await sendEndorsementExpiryReminderEmail(
            endorsement.professorEmail,
            endorsement.professorName,
            `${endorsement.student.firstName} ${endorsement.student.lastName}`,
            endorsement.project.title,
            endorsement.verificationToken
          )
          professorReminders++
        } catch (err) {
          console.error(`Failed to send reminder to ${endorsement.professorEmail}:`, err)
        }
      }

      // Notify student that their request is about to expire
      if (endorsement.student.email) {
        try {
          await sendEndorsementExpiryNoticeEmail(
            endorsement.student.email,
            endorsement.student.firstName || 'Student',
            endorsement.professorName,
            endorsement.project.title
          )
          studentNotices++
        } catch (err) {
          console.error(`Failed to send expiry notice to ${endorsement.student.email}:`, err)
        }

        await createNotification({
          userId: endorsement.student.id,
          type: 'ENDORSEMENT_EXPIRING',
          title: 'Endorsement Request Expiring',
          body: `Your endorsement request to Prof. ${endorsement.professorName} for "${endorsement.project.title}" expires in 2 days`,
          link: '/dashboard/student/projects',
        })
      }
    }

    return NextResponse.json({
      found: expiringEndorsements.length,
      professorReminders,
      studentNotices,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing endorsement reminders:', error)
    return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 })
  }
}
