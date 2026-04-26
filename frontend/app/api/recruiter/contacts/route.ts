import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/recruiter/contacts
 * Returns the recruiter's contact-usage state under the freemium model:
 *   - 5 free contacts/month per company domain (FREE / RECRUITER_FREE / legacy
 *     RECRUITER_PAY_PER_CONTACT)
 *   - Unlimited (RECRUITER_ENTERPRISE — covers both €89/mo subscription and
 *     true enterprise tiers until we split them in the schema)
 * Per-contact credit purchases retired 2026-04-25.
 */
export async function GET(_req: NextRequest) {
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
      select: { id: true, email: true, subscriptionTier: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Mirror the gate in /api/messages/route.ts:
    //   corporate domain → 5 free contacts/month (shared across the company)
    //   personal email   → 2 free contacts/month (per user, anti-abuse)
    const FREE_CONTACT_LIMIT_CORPORATE = 5
    const FREE_CONTACT_LIMIT_PERSONAL  = 2
    const isUnlimited = user.subscriptionTier === 'RECRUITER_ENTERPRISE'

    const totalContacted = await prisma.contactUsage.count({
      where: { recruiterId: session.user.id },
    })

    if (isUnlimited) {
      return NextResponse.json({
        model: 'subscription',
        unlimited: true,
        totalContacted,
        tier: user.subscriptionTier,
      })
    }

    // Freemium: count contacts across the company domain this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const emailDomain = user.email.split('@')[1]?.toLowerCase()
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'mail.com', 'protonmail.com']
    const isCompanyDomain = !!emailDomain && !freeProviders.includes(emailDomain)
    const FREE_CONTACT_LIMIT = isCompanyDomain ? FREE_CONTACT_LIMIT_CORPORATE : FREE_CONTACT_LIMIT_PERSONAL

    let monthlyDomainContactCount = 0
    if (isCompanyDomain) {
      const domainRecruiters = await prisma.user.findMany({
        where: { email: { endsWith: `@${emailDomain}` }, role: 'RECRUITER' },
        select: { id: true },
      })
      monthlyDomainContactCount = await prisma.contactUsage.count({
        where: {
          recruiterId: { in: domainRecruiters.map(r => r.id) },
          firstContactAt: { gte: startOfMonth },
        },
      })
    } else {
      monthlyDomainContactCount = await prisma.contactUsage.count({
        where: { recruiterId: session.user.id, firstContactAt: { gte: startOfMonth } },
      })
    }

    return NextResponse.json({
      model: 'freemium',
      unlimited: false,
      tier: user.subscriptionTier,
      emailType: isCompanyDomain ? 'corporate' : 'personal',
      totalContacted,
      monthlyContactsUsed: monthlyDomainContactCount,
      monthlyFreeLimit: FREE_CONTACT_LIMIT,
      monthlyContactsRemaining: Math.max(0, FREE_CONTACT_LIMIT - monthlyDomainContactCount),
      quotaResetsOn: startOfNextMonth.toISOString(),
      upgradeUrl: '/pricing?for=companies&plan=subscription',
    })
  } catch (error) {
    console.error('Error fetching contact usage:', error)
    return NextResponse.json({ error: 'Failed to fetch contact usage' }, { status: 500 })
  }
}
