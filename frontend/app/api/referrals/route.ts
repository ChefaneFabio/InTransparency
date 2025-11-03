import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/jwt-verify'

// GET /api/referrals - Get user's referral data
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with referral data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        referralCode: true,
        referralCount: true,
        referralTier: true,
        premiumMonthsEarned: true,
        referredBy: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get referral details
    const referral = await prisma.referral.findUnique({
      where: { referrerId: userId },
      include: {
        referredUsers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            profilePublic: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    // Get leaderboard (top 10 referrers)
    const leaderboard = await prisma.user.findMany({
      where: {
        referralCount: {
          gt: 0
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        university: true,
        referralCount: true
      },
      orderBy: {
        referralCount: 'desc'
      },
      take: 10
    })

    // Calculate next tier
    const tiers = [
      { tier: 'BRONZE', referralsNeeded: 3, reward: '1 month Premium FREE' },
      { tier: 'SILVER', referralsNeeded: 10, reward: '6 months Premium FREE' },
      { tier: 'GOLD', referralsNeeded: 50, reward: 'Lifetime Premium FREE' },
      { tier: 'PLATINUM', referralsNeeded: 100, reward: 'Lifetime Premium + €500 cash' }
    ]

    const nextTier = tiers.find(t => t.referralsNeeded > user.referralCount) || tiers[tiers.length - 1]

    return NextResponse.json({
      referralCode: user.referralCode,
      totalReferrals: user.referralCount,
      activeReferrals: referral?.completedReferrals || 0,
      pendingReferrals: (user.referralCount || 0) - (referral?.completedReferrals || 0),
      currentTier: user.referralTier,
      nextTier,
      premiumMonthsEarned: user.premiumMonthsEarned,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/join?ref=${user.referralCode}`,
      referrals: referral?.referredUsers.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        signupDate: u.createdAt,
        status: u.profilePublic ? 'completed' : 'pending',
        profileCompleted: u.profilePublic
      })) || [],
      leaderboard: leaderboard.map((u, idx) => ({
        rank: idx + 1,
        name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : 'Anonymous',
        university: u.university || 'Not specified',
        referrals: u.referralCount
      }))
    })
  } catch (error) {
    console.error('Error fetching referral data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/referrals/track - Track referral signup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { newUserId, referralCode } = body

    if (!newUserId || !referralCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find referrer by referral code
    const referrer = await prisma.user.findUnique({
      where: { referralCode }
    })

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    // Update new user with referral info
    await prisma.user.update({
      where: { id: newUserId },
      data: {
        referredBy: referralCode
      }
    })

    // Update referrer's count
    await prisma.user.update({
      where: { id: referrer.id },
      data: {
        referralCount: {
          increment: 1
        }
      }
    })

    // Create or update referral record
    const existingReferral = await prisma.referral.findUnique({
      where: { referrerId: referrer.id }
    })

    if (existingReferral) {
      await prisma.referral.update({
        where: { id: existingReferral.id },
        data: {
          totalReferrals: {
            increment: 1
          }
        }
      })
    } else {
      await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referralCode: referrer.referralCode,
          totalReferrals: 1,
          completedReferrals: 0
        }
      })
    }

    // Track analytics event
    await prisma.analytics.create({
      data: {
        userId: referrer.id,
        eventType: 'REFERRAL_SIGNUP',
        eventName: 'referral_signup',
        properties: {
          referredUserId: newUserId,
          referralCode
        }
      }
    })

    // Check and update tier
    await updateReferralTier(referrer.id, referrer.referralCount + 1)

    return NextResponse.json({ success: true, message: 'Referral tracked successfully' })
  } catch (error) {
    console.error('Error tracking referral:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to update referral tier and rewards
async function updateReferralTier(userId: string, totalReferrals: number) {
  let newTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' = 'BRONZE'
  let premiumMonths = 0

  if (totalReferrals >= 100) {
    newTier = 'PLATINUM'
    premiumMonths = 999 // Lifetime
  } else if (totalReferrals >= 50) {
    newTier = 'GOLD'
    premiumMonths = 999 // Lifetime
  } else if (totalReferrals >= 10) {
    newTier = 'SILVER'
    premiumMonths = 6
  } else if (totalReferrals >= 3) {
    newTier = 'BRONZE'
    premiumMonths = 1
  }

  // Update user tier
  await prisma.user.update({
    where: { id: userId },
    data: {
      referralTier: newTier
    }
  })

  // If crossed tier threshold, grant premium
  if (totalReferrals === 3 || totalReferrals === 10 || totalReferrals === 50 || totalReferrals === 100) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user) {
      const currentPremiumUntil = user.premiumUntil || new Date()
      const newPremiumUntil = new Date(currentPremiumUntil)

      if (premiumMonths === 999) {
        // Lifetime premium (100 years from now)
        newPremiumUntil.setFullYear(newPremiumUntil.getFullYear() + 100)
      } else {
        newPremiumUntil.setMonth(newPremiumUntil.getMonth() + premiumMonths)
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          premiumUntil: newPremiumUntil,
          premiumMonthsEarned: {
            increment: premiumMonths
          },
          subscriptionTier: 'STUDENT_PRO',
          subscriptionStatus: 'ACTIVE'
        }
      })

      // Create subscription record
      await prisma.subscription.create({
        data: {
          userId,
          tier: 'STUDENT_PRO',
          status: 'ACTIVE',
          amount: 0, // Free from referral
          currency: 'eur',
          interval: 'referral_reward',
          startedAt: new Date(),
          endedAt: newPremiumUntil
        }
      })
    }
  }
}
