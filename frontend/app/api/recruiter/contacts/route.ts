import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getPricingTier } from '@/lib/config/pricing'

/**
 * GET /api/recruiter/contacts
 * Returns current contact usage stats for the billing period
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

    // Determine billing period based on premiumUntil or current month
    const now = new Date()
    let billingPeriodStart: Date
    let billingPeriodEnd: Date

    if (user.premiumUntil) {
      // Calculate billing period based on subscription cycle
      const premiumDate = new Date(user.premiumUntil)
      const dayOfMonth = premiumDate.getDate()

      // Current billing period starts on that day of current month
      billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), dayOfMonth)
      if (billingPeriodStart > now) {
        billingPeriodStart.setMonth(billingPeriodStart.getMonth() - 1)
      }
      billingPeriodEnd = new Date(billingPeriodStart)
      billingPeriodEnd.setMonth(billingPeriodEnd.getMonth() + 1)
    } else {
      // Use calendar month for free tier
      billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    }

    // Count unique contacts in this billing period
    const used = await prisma.contactUsage.count({
      where: {
        recruiterId: session.user.id,
        billingPeriodStart: billingPeriodStart,
      }
    })

    const remaining = contactLimit === -1 ? -1 : Math.max(0, contactLimit - used)

    return NextResponse.json({
      used,
      limit: contactLimit,
      remaining,
      billingPeriod: {
        start: billingPeriodStart.toISOString(),
        end: billingPeriodEnd.toISOString(),
      },
      tier: user.subscriptionTier,
    })
  } catch (error) {
    console.error('Error fetching contact usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact usage' },
      { status: 500 }
    )
  }
}
