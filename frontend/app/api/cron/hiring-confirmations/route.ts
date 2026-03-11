import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/cron/hiring-confirmations
 * Cron job: finds ContactUsage records older than 60 days that don't have
 * a HiringConfirmation yet, creates PROMPTED HiringConfirmation records,
 * and creates a notification for each student.
 *
 * Secured via CRON_SECRET header.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    // Find ContactUsage records older than 60 days without a HiringConfirmation
    const eligibleContacts = await prisma.contactUsage.findMany({
      where: {
        firstContactAt: { lte: sixtyDaysAgo },
        outcome: null, // No outcome set yet by recruiter
        hiringConfirmations: { none: {} },
      },
      include: {
        recruiter: {
          select: { id: true, company: true, firstName: true, lastName: true },
        },
        recipient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    let created = 0

    for (const contact of eligibleContacts) {
      const companyName = contact.recruiter.company ||
        `${contact.recruiter.firstName || ''} ${contact.recruiter.lastName || ''}`.trim() ||
        'Unknown Company'

      // Create the HiringConfirmation
      await prisma.hiringConfirmation.create({
        data: {
          contactUsageId: contact.id,
          studentId: contact.recipientId,
          recruiterId: contact.recruiterId,
          companyName,
          status: 'PROMPTED',
          contactDate: contact.firstContactAt,
          promptSentAt: new Date(),
        },
      })

      // Create a notification for the student
      await prisma.notification.create({
        data: {
          userId: contact.recipientId,
          type: 'HIRING_CONFIRMATION',
          title: 'Did you get hired?',
          body: `It's been 60 days since ${companyName} contacted you. Did you receive an offer?`,
          link: '/dashboard/student',
        },
      })

      created++
    }

    return NextResponse.json({
      success: true,
      created,
      message: `Created ${created} hiring confirmation prompts`,
    })
  } catch (error) {
    console.error('Error running hiring confirmations cron:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
