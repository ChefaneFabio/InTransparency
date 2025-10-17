import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'


// POST /api/subscriptions/manage - Upgrade, downgrade, or cancel subscription
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, newTier, newInterval } = body

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
    }

    switch (action) {
      case 'cancel':
        return await cancelSubscription(user.stripeSubscriptionId, userId)

      case 'upgrade':
      case 'downgrade':
        if (!newTier || !newInterval) {
          return NextResponse.json({ error: 'Missing tier or interval' }, { status: 400 })
        }
        return await updateSubscription(user.stripeSubscriptionId, userId, newTier, newInterval)

      case 'reactivate':
        return await reactivateSubscription(user.stripeSubscriptionId, userId)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error managing subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Cancel subscription at period end
async function cancelSubscription(subscriptionId: string, userId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  })

  // Update database
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'CANCELED'
    }
  })

  // Record in subscription history
  await prisma.subscription.updateMany({
    where: {
      userId,
      stripeSubscriptionId: subscriptionId,
      endedAt: null
    },
    data: {
      canceledAt: new Date()
    }
  })

  return NextResponse.json({
    success: true,
    message: 'Subscription will be canceled at the end of the billing period',
    cancelAt: subscription.cancel_at
  })
}

// Update subscription to new tier/interval
async function updateSubscription(
  subscriptionId: string,
  userId: string,
  newTier: string,
  newInterval: string
) {
  // Get current subscription
  const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Get new price ID
  const newPriceId = getPriceId(newTier, newInterval)
  if (!newPriceId) {
    return NextResponse.json({ error: 'Invalid tier or interval' }, { status: 400 })
  }

  // Update subscription
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: currentSubscription.items.data[0].id,
        price: newPriceId
      }
    ],
    proration_behavior: 'create_prorations'
  })

  // Update database
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: newTier as any,
      subscriptionStatus: 'ACTIVE'
    }
  })

  return NextResponse.json({
    success: true,
    message: 'Subscription updated successfully',
    subscription: updatedSubscription
  })
}

// Reactivate a canceled subscription
async function reactivateSubscription(subscriptionId: string, userId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false
  })

  // Update database
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'ACTIVE'
    }
  })

  await prisma.subscription.updateMany({
    where: {
      userId,
      stripeSubscriptionId: subscriptionId
    },
    data: {
      canceledAt: null
    }
  })

  return NextResponse.json({
    success: true,
    message: 'Subscription reactivated successfully',
    subscription
  })
}

// Helper function to get price ID
function getPriceId(tier: string, interval: string): string | null {
  const priceMap: Record<string, string> = {
    'STUDENT_PRO_monthly': process.env.STRIPE_STUDENT_PRO_MONTHLY_PRICE_ID || '',
    'STUDENT_PRO_annual': process.env.STRIPE_STUDENT_PRO_ANNUAL_PRICE_ID || '',
    'RECRUITER_STARTER_monthly': process.env.STRIPE_RECRUITER_STARTER_MONTHLY_PRICE_ID || '',
    'RECRUITER_STARTER_annual': process.env.STRIPE_RECRUITER_STARTER_ANNUAL_PRICE_ID || '',
    'RECRUITER_GROWTH_monthly': process.env.STRIPE_RECRUITER_GROWTH_MONTHLY_PRICE_ID || '',
    'RECRUITER_GROWTH_annual': process.env.STRIPE_RECRUITER_GROWTH_ANNUAL_PRICE_ID || '',
    'RECRUITER_PRO_monthly': process.env.STRIPE_RECRUITER_PRO_MONTHLY_PRICE_ID || '',
    'RECRUITER_PRO_annual': process.env.STRIPE_RECRUITER_PRO_ANNUAL_PRICE_ID || ''
  }

  return priceMap[`${tier}_${interval}`] || null
}
