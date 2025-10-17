import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

// GET /api/subscriptions - Get user's subscription details
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        premiumUntil: true,
        subscriptionHistory: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get Stripe subscription details if exists
    let stripeSubscription = null
    if (user.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error)
      }
    }

    return NextResponse.json({
      tier: user.subscriptionTier,
      status: user.subscriptionStatus,
      premiumUntil: user.premiumUntil,
      stripeSubscription,
      history: user.subscriptionHistory
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/subscriptions/create - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tier, interval, successUrl, cancelUrl } = body

    if (!tier || !interval) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get price ID based on tier and interval
    const priceId = getPriceId(tier, interval)
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier or interval' }, { status: 400 })
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      })
      customerId = customer.id

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId
        }
      })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      subscription_data: {
        trial_period_days: tier === 'STUDENT_PRO' ? 7 : 0, // 7-day trial for Student Pro
        metadata: {
          userId: user.id,
          tier
        }
      },
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/student-premium?subscription=cancelled`,
      metadata: {
        userId: user.id,
        tier
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to get Stripe price ID
function getPriceId(tier: string, interval: string): string | null {
  const key = `${tier}_${interval.toUpperCase()}` as keyof typeof STRIPE_PRICES
  return STRIPE_PRICES[key] || null
}
