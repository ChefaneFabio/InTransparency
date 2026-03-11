import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/recruiter/contacts
 * Returns contact usage stats based on the recruiter's pricing model
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
        email: true,
        subscriptionTier: true,
        contactBalance: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Count total unique contacts ever made
    const totalContacted = await prisma.contactUsage.count({
      where: {
        recruiterId: session.user.id,
      }
    })

    // Return response based on tier model
    if (user.subscriptionTier === 'RECRUITER_ENTERPRISE') {
      return NextResponse.json({
        model: 'enterprise',
        unlimited: true,
        totalContacted,
        tier: user.subscriptionTier,
      })
    }

    if (user.subscriptionTier === 'RECRUITER_PAY_PER_CONTACT') {
      const credits = Math.floor(user.contactBalance / 1000)
      return NextResponse.json({
        model: 'pay_per_contact',
        balance: user.contactBalance,
        credits,
        costPerContact: 1000,
        totalContacted,
        tier: user.subscriptionTier,
      })
    }

    // RECRUITER_FREE or other — show free contact usage per company domain
    const FREE_CONTACT_LIMIT = 5
    const emailDomain = user.email.split('@')[1]?.toLowerCase()
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'mail.com', 'protonmail.com']
    const isCompanyDomain = emailDomain && !freeProviders.includes(emailDomain)

    let domainContactCount = totalContacted
    if (isCompanyDomain) {
      const domainRecruiters = await prisma.user.findMany({
        where: {
          email: { endsWith: `@${emailDomain}` },
          role: 'RECRUITER',
        },
        select: { id: true },
      })
      const domainRecruiterIds = domainRecruiters.map(r => r.id)
      domainContactCount = await prisma.contactUsage.count({
        where: { recruiterId: { in: domainRecruiterIds } },
      })
    }

    return NextResponse.json({
      model: 'free',
      balance: 0,
      credits: 0,
      totalContacted,
      domainContactCount,
      freeContactLimit: FREE_CONTACT_LIMIT,
      freeContactsRemaining: Math.max(0, FREE_CONTACT_LIMIT - domainContactCount),
      companyDomain: isCompanyDomain ? emailDomain : undefined,
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
