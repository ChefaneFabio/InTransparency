import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { STRIPE_PRICE_IDS, STRIPE_CONFIG } from '@/lib/config/pricing'
import { isStudentPremium } from '@/lib/entitlements'

export const maxDuration = 15

/**
 * GET /api/checkout/student-premium?plan=monthly|annual
 *
 * Friendly redirect entry-point for the student upgrade page. Skips Stripe
 * entirely when the student is already Premium (personal OR sponsored) —
 * sends them back to their dashboard instead of a payment form.
 *
 * Otherwise creates a Stripe Checkout Session and issues a 303 redirect
 * to the hosted Stripe page. 14-day trial is included for first-time
 * subscribers.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl, 303)
  }

  const userId = session.user.id

  // Already entitled (personal or institutional sponsorship) — skip Stripe
  if (await isStudentPremium(userId)) {
    return NextResponse.redirect(new URL('/dashboard/student/upgrade', req.url), 303)
  }

  const url = new URL(req.url)
  const plan = url.searchParams.get('plan') ?? 'monthly'
  const priceId =
    plan === 'annual'
      ? STRIPE_PRICE_IDS.STUDENT_PREMIUM_ANNUAL
      : STRIPE_PRICE_IDS.STUDENT_PREMIUM_MONTHLY

  // Configuration guard — fail gracefully if the Stripe price hasn't been
  // wired yet. Tell the user, don't 500.
  if (!priceId || !STRIPE_CONFIG.secretKey) {
    const back = new URL('/dashboard/student/upgrade', req.url)
    back.searchParams.set('error', 'stripe_not_configured')
    return NextResponse.redirect(back, 303)
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, username: true, stripeCustomerId: true },
  })
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', req.url), 303)
  }

  const stripe = new Stripe(STRIPE_CONFIG.secretKey, { apiVersion: '2025-09-30.clover' })

  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId, username: user.username || '' },
    })
    customerId = customer.id
    await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } })
  }

  const origin = new URL(req.url).origin
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/student/upgrade?success=1`,
    cancel_url: `${origin}/dashboard/student/upgrade?canceled=1`,
    subscription_data: {
      trial_period_days: 30,
      metadata: { userId, tier: 'STUDENT_PREMIUM', plan: `student_premium_${plan}` },
    },
    // tier key is required by the Stripe webhook handler at
    // /api/webhooks/stripe/route.ts (looks at session.metadata.tier).
    metadata: { userId, tier: 'STUDENT_PREMIUM', plan: `student_premium_${plan}` },
    allow_promotion_codes: true,
  })

  return NextResponse.redirect(checkoutSession.url!, 303)
}
