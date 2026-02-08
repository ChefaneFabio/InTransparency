import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth/jwt-verify'
import prisma from '@/lib/prisma'
import { STRIPE_PRICE_IDS, STRIPE_CONFIG } from '@/lib/config/pricing'

// Lazy initialize Stripe to avoid build-time errors
function getStripe() {
  return new Stripe(STRIPE_CONFIG.secretKey, {
    apiVersion: '2025-09-30.clover'
  })
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()

    // Get authenticated user ID
    const userId = await requireAuth(req)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await req.json()
    const { priceId, tier, interval, credits } = body

    // For contact credit purchases, mode is 'payment'; otherwise 'subscription'
    const isContactCredits = priceId === STRIPE_PRICE_IDS.CONTACT_CREDITS

    if (!priceId || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, tier' },
        { status: 400 }
      )
    }

    if (!isContactCredits && !interval) {
      return NextResponse.json(
        { error: 'Missing required field: interval (for subscriptions)' },
        { status: 400 }
      )
    }

    // Validate price ID matches known prices
    const validPriceIds = Object.values(STRIPE_PRICE_IDS)
    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          username: user.username || '',
          role: user.role
        }
      })
      customerId = customer.id

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    if (isContactCredits) {
      // One-time payment for contact credits
      const creditCount = credits || 1

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: creditCount,
          }
        ],
        success_url: `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}&credits=${creditCount}`,
        cancel_url: STRIPE_CONFIG.cancelUrl,
        metadata: {
          userId: user.id,
          tier,
          type: 'contact_credits',
          credits: String(creditCount),
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
      })

      return NextResponse.json({
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
      })
    }

    // Subscription checkout (STUDENT_PREMIUM, RECRUITER_ENTERPRISE, INSTITUTION_ENTERPRISE)
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        userId: user.id,
        tier,
        interval
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier,
          interval
        },
        trial_period_days: user.subscriptionTier === 'FREE' ? 14 : undefined
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
