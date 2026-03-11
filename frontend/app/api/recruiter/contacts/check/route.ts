import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
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
        email: true,
        subscriptionTier: true,
        contactBalance: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check for active position listings (Pay-Per-Position model)
    const activePositionListing = await prisma.positionListing.findFirst({
      where: {
        recruiterId: session.user.id,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
      orderBy: { expiresAt: 'asc' },
    })

    if (activePositionListing) {
      // Check if already contacted this student
      const existingContact = await prisma.contactUsage.findFirst({
        where: {
          recruiterId: session.user.id,
          recipientId: studentId,
        }
      })

      return NextResponse.json({
        canContact: true,
        reason: existingContact ? 'already_contacted' : 'position_listing',
        message: existingContact
          ? 'You have already contacted this student — no additional charge'
          : 'Contact included with your active position listing',
        model: 'pay_per_position',
        positionListing: {
          id: activePositionListing.id,
          title: activePositionListing.title,
          expiresAt: activePositionListing.expiresAt,
          contactsUsed: activePositionListing.contactsUsed,
        },
      })
    }

    // RECRUITER_ENTERPRISE: unlimited contacts
    if (user.subscriptionTier === 'RECRUITER_ENTERPRISE') {
      return NextResponse.json({
        canContact: true,
        reason: 'unlimited',
        model: 'enterprise',
      })
    }

    // RECRUITER_FREE or FREE: allow first 5 unique contacts per company domain
    const FREE_CONTACT_LIMIT = 5
    if (user.subscriptionTier === 'RECRUITER_FREE' || user.subscriptionTier === 'FREE') {
      // Check if this specific user already contacted this student (dedup)
      const existingContact = await prisma.contactUsage.findFirst({
        where: { recruiterId: session.user.id, recipientId: studentId },
      })

      if (existingContact) {
        return NextResponse.json({
          canContact: true,
          reason: 'already_contacted',
          message: 'You have already contacted this student — no additional charge',
          model: 'free',
        })
      }

      // Count free contacts across the entire company domain
      const emailDomain = user.email.split('@')[1]?.toLowerCase()
      const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'mail.com', 'protonmail.com']
      const isCompanyDomain = emailDomain && !freeProviders.includes(emailDomain)

      let domainContactCount = 0
      if (isCompanyDomain) {
        // Find all recruiters with the same company email domain
        const domainRecruiters = await prisma.user.findMany({
          where: {
            email: { endsWith: `@${emailDomain}` },
            role: 'RECRUITER',
          },
          select: { id: true },
        })
        const domainRecruiterIds = domainRecruiters.map(r => r.id)

        // Count unique contacts across all recruiters from this domain
        domainContactCount = await prisma.contactUsage.count({
          where: { recruiterId: { in: domainRecruiterIds } },
        })
      } else {
        // Personal email — count only this user's contacts
        domainContactCount = await prisma.contactUsage.count({
          where: { recruiterId: session.user.id },
        })
      }

      if (domainContactCount >= FREE_CONTACT_LIMIT) {
        return NextResponse.json({
          canContact: false,
          reason: 'free_limit_reached',
          message: isCompanyDomain
            ? `Your company (${emailDomain}) has used all ${FREE_CONTACT_LIMIT} free contacts. Purchase credits or open a position to continue.`
            : `You've used all ${FREE_CONTACT_LIMIT} free contacts. Purchase credits or open a position to continue.`,
          upgradeUrl: '/pricing?for=recruiters',
          model: 'free',
          freeContactsUsed: domainContactCount,
          freeContactLimit: FREE_CONTACT_LIMIT,
          companyDomain: isCompanyDomain ? emailDomain : undefined,
        })
      }

      return NextResponse.json({
        canContact: true,
        reason: 'free_contacts',
        message: `Free contact (${domainContactCount + 1} of ${FREE_CONTACT_LIMIT})`,
        model: 'free',
        freeContactsUsed: domainContactCount,
        freeContactLimit: FREE_CONTACT_LIMIT,
        freeContactsRemaining: FREE_CONTACT_LIMIT - domainContactCount - 1,
        companyDomain: isCompanyDomain ? emailDomain : undefined,
      })
    }

    // RECRUITER_PAY_PER_CONTACT: check balance and dedup
    if (user.subscriptionTier === 'RECRUITER_PAY_PER_CONTACT') {
      // Check if already contacted this student (any time, not just this period)
      const existingContact = await prisma.contactUsage.findFirst({
        where: {
          recruiterId: session.user.id,
          recipientId: studentId,
        }
      })

      // Count recent contacts (last 30 days) for smart upsell
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentContactCount = await prisma.contactUsage.count({
        where: {
          recruiterId: session.user.id,
          createdAt: { gte: thirtyDaysAgo },
        }
      })

      // Build upsell data when recruiter has made 3+ contacts recently
      const POSITION_PRICE = 4900 // €49
      const CONTACT_PRICE = 1000  // €10
      const spentRecently = recentContactCount * CONTACT_PRICE
      const positionUpsell = recentContactCount >= 3 ? {
        show: true,
        recentContacts: recentContactCount,
        spentRecently, // in cents
        positionPrice: POSITION_PRICE,
        savings: spentRecently - POSITION_PRICE, // how much they'd have saved
        message: `You've contacted ${recentContactCount} candidates recently (€${recentContactCount * 10}). For €49 you get unlimited contacts for 30 days.`,
      } : recentContactCount >= 1 ? {
        show: false,
        recentContacts: recentContactCount,
        spentRecently,
        positionPrice: POSITION_PRICE,
        contactsUntilUpsell: 3 - recentContactCount,
      } : undefined

      if (existingContact) {
        return NextResponse.json({
          canContact: true,
          reason: 'already_contacted',
          message: 'You have already contacted this student — no additional charge',
          model: 'pay_per_contact',
          balance: user.contactBalance,
          positionUpsell,
        })
      }

      // New contact — check balance
      if (user.contactBalance < 1000) {
        return NextResponse.json({
          canContact: false,
          reason: 'insufficient_credits',
          message: 'Not enough contact credits. Purchase more to contact this candidate.',
          upgradeUrl: '/pricing?for=recruiters',
          model: 'pay_per_contact',
          balance: user.contactBalance,
          costPerContact: 1000,
          positionUpsell,
        })
      }

      return NextResponse.json({
        canContact: true,
        reason: 'has_credits',
        model: 'pay_per_contact',
        balance: user.contactBalance,
        costPerContact: 1000,
        positionUpsell,
      })
    }

    // Fallback for any other tier
    return NextResponse.json({
      canContact: false,
      reason: 'upgrade_required',
      message: 'Upgrade to contact candidates',
      upgradeUrl: '/pricing?for=recruiters',
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
