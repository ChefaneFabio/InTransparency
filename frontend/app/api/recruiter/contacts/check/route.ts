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
        subscriptionTier: true,
        contactBalance: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // RECRUITER_ENTERPRISE: unlimited contacts
    if (user.subscriptionTier === 'RECRUITER_ENTERPRISE') {
      return NextResponse.json({
        canContact: true,
        reason: 'unlimited',
        model: 'enterprise',
      })
    }

    // RECRUITER_FREE or FREE: no contacts
    if (user.subscriptionTier === 'RECRUITER_FREE' || user.subscriptionTier === 'FREE') {
      return NextResponse.json({
        canContact: false,
        reason: 'upgrade_required',
        message: 'Upgrade to a paid plan to contact candidates',
        upgradeUrl: '/pricing?for=recruiters',
        model: 'free',
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

      if (existingContact) {
        return NextResponse.json({
          canContact: true,
          reason: 'already_contacted',
          message: 'You have already contacted this student — no additional charge',
          model: 'pay_per_contact',
          balance: user.contactBalance,
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
        })
      }

      return NextResponse.json({
        canContact: true,
        reason: 'has_credits',
        model: 'pay_per_contact',
        balance: user.contactBalance,
        costPerContact: 1000,
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
