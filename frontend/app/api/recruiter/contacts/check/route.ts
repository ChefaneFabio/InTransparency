import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getPricingTier } from '@/lib/config/pricing'
import { z } from 'zod'

const checkContactSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
})

/**
 * POST /api/recruiter/contacts/check
 * Check if recruiter can contact a specific student
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { studentId } = checkContactSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        subscriptionTier: true,
        premiumUntil: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get pricing tier limits
    const tier = getPricingTier(user.subscriptionTier)
    const contactLimit = tier?.limits.contacts ?? 0

    // Unlimited contacts
    if (contactLimit === -1) {
      return NextResponse.json({
        canContact: true,
        reason: 'unlimited',
      })
    }

    // Zero contacts (free tier)
    if (contactLimit === 0) {
      return NextResponse.json({
        canContact: false,
        reason: 'upgrade_required',
        message: 'Upgrade to a paid plan to contact candidates',
        upgradeUrl: '/pricing?for=recruiters',
      })
    }

    // Determine billing period
    const now = new Date()
    let billingPeriodStart: Date

    if (user.premiumUntil) {
      const premiumDate = new Date(user.premiumUntil)
      const dayOfMonth = premiumDate.getDate()
      billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), dayOfMonth)
      if (billingPeriodStart > now) {
        billingPeriodStart.setMonth(billingPeriodStart.getMonth() - 1)
      }
    } else {
      billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Check if already contacted this student in this period
    const existingContact = await prisma.contactUsage.findUnique({
      where: {
        recruiterId_recipientId_billingPeriodStart: {
          recruiterId: session.user.id,
          recipientId: studentId,
          billingPeriodStart: billingPeriodStart,
        }
      }
    })

    if (existingContact) {
      // Already contacted, doesn't count against limit
      return NextResponse.json({
        canContact: true,
        reason: 'already_contacted',
        message: 'You have already contacted this student this billing period',
      })
    }

    // Count unique contacts in this billing period
    const used = await prisma.contactUsage.count({
      where: {
        recruiterId: session.user.id,
        billingPeriodStart: billingPeriodStart,
      }
    })

    if (used >= contactLimit) {
      return NextResponse.json({
        canContact: false,
        reason: 'limit_reached',
        message: `You have reached your limit of ${contactLimit} contacts for this billing period`,
        upgradeUrl: '/pricing?for=recruiters',
        used,
        limit: contactLimit,
      })
    }

    return NextResponse.json({
      canContact: true,
      reason: 'within_limit',
      used,
      limit: contactLimit,
      remaining: contactLimit - used,
    })
  } catch (error) {
    console.error('Error checking contact:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to check contact availability' },
      { status: 500 }
    )
  }
}
