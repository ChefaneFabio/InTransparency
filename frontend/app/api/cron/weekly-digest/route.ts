import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendWeeklyDigestEmail } from '@/lib/email'

/**
 * POST /api/cron/weekly-digest
 *
 * Cron-callable endpoint that sends weekly digest emails to all active users.
 * Protected by CRON_SECRET header.
 */
export async function POST(req: NextRequest) {
  try {
    const cronSecret = req.headers.get('x-cron-secret')
    if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const users = await prisma.user.findMany({
      where: {
        emailVerified: true,
        lastLoginAt: { gte: thirtyDaysAgo },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
      },
      take: 500,
    })

    let sent = 0
    let skipped = 0

    for (const user of users) {
      try {
        // Count new messages in the past week
        const newMessages = await prisma.message.count({
          where: {
            senderId: user.id,
            createdAt: { gte: oneWeekAgo },
          },
        })

        const stats: Record<string, number> = {}
        if (newMessages > 0) stats.newMessages = newMessages

        // Role-specific stats
        if (user.role === 'RECRUITER') {
          const savedSearchUpdates = await prisma.savedSearch.count({
            where: {
              recruiterId: user.id,
              newMatches: { gt: 0 },
              lastRunAt: { gte: oneWeekAgo },
            },
          }).catch(() => 0)

          if (savedSearchUpdates > 0) stats.savedSearchUpdates = savedSearchUpdates
        }

        if (user.role === 'STUDENT') {
          const newApplications = await prisma.application.count({
            where: {
              applicantId: user.id,
              createdAt: { gte: oneWeekAgo },
            },
          }).catch(() => 0)

          if (newApplications > 0) stats.newApplications = newApplications
        }

        // Only send if there's some activity
        if (Object.keys(stats).length > 0) {
          await sendWeeklyDigestEmail(
            user.email,
            user.firstName || 'there',
            user.role || 'student',
            stats
          )
          sent++
        } else {
          skipped++
        }
      } catch (err) {
        console.error(`Failed to send digest to ${user.email}:`, err)
        skipped++
      }
    }

    return NextResponse.json({
      sent,
      skipped,
      totalUsers: users.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing weekly digest:', error)
    return NextResponse.json({ error: 'Failed to process digest' }, { status: 500 })
  }
}
