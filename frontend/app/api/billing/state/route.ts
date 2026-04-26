import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/billing/state
 *
 * Returns the caller's billing snapshot for /dashboard/subscription.
 * Branches on role:
 *   - INSTITUTION_ADMIN  → Institution-level subscription
 *   - any other user     → user-owned subscription (student / recruiter)
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  // Institution admin path
  const adminStaff = await prisma.institutionStaff.findFirst({
    where: { userId, role: 'INSTITUTION_ADMIN' },
    include: {
      institution: {
        select: {
          name: true,
          plan: true,
          subscriptionStatus: true,
          premiumUntil: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
        },
      },
    },
  })
  if (adminStaff) {
    const inst = adminStaff.institution
    return NextResponse.json({
      kind: 'institution',
      name: inst.name,
      tier: inst.plan,                                  // 'CORE' | 'PREMIUM'
      tierLabel: inst.plan === 'PREMIUM' ? 'Institutional Premium' : 'Free Core',
      status: inst.subscriptionStatus,                  // SubscriptionStatus enum
      renewsOrEndsOn: inst.premiumUntil?.toISOString() ?? null,
      hasStripeCustomer: !!inst.stripeCustomerId,
      hasActiveSubscription: !!inst.stripeSubscriptionId,
      upgradeUrl: '/api/checkout/institutional-premium?plan=monthly',
      portalUrl: '/api/billing/portal',
    })
  }

  // User-owned path (student / recruiter)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      subscriptionStatus: true,
      premiumUntil: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      role: true,
    },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const isStudent = user.role === 'STUDENT'
  const upgradeUrl = isStudent
    ? '/api/checkout/student-premium?plan=monthly'
    : '/pricing?for=companies&plan=subscription'

  const tierLabel = (() => {
    switch (user.subscriptionTier) {
      case 'STUDENT_PREMIUM':           return 'Student Premium'
      case 'RECRUITER_PAY_PER_CONTACT': return 'Company Subscription'
      case 'RECRUITER_ENTERPRISE':      return 'Company Enterprise'
      case 'RECRUITER_FREE':
      case 'FREE':
      default:                          return isStudent ? 'Free' : 'Company Free'
    }
  })()

  return NextResponse.json({
    kind: 'user',
    role: user.role,
    tier: user.subscriptionTier,
    tierLabel,
    status: user.subscriptionStatus,
    renewsOrEndsOn: user.premiumUntil?.toISOString() ?? null,
    hasStripeCustomer: !!user.stripeCustomerId,
    hasActiveSubscription: !!user.stripeSubscriptionId,
    upgradeUrl,
    portalUrl: '/api/billing/portal',
  })
}
