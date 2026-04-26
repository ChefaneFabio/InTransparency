import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { STRIPE_PRICE_IDS, STRIPE_CONFIG, INSTITUTIONAL_TIERS } from '@/lib/config/pricing'

export const maxDuration = 15

/**
 * GET /api/checkout/institutional-premium?plan=monthly|annual
 *
 * Entry-point for institutional Premium upgrade (€39/mo · €390/yr, 30-day trial).
 *
 * Resolves the institution from the signed-in user's INSTITUTION_ADMIN
 * staff role (or the institution's primaryAdminId), creates a Stripe
 * Checkout subscription session keyed to the institution, and 303-redirects
 * to the hosted Stripe page. The webhook at /api/webhooks/stripe flips
 * Institution.plan to PREMIUM on checkout.session.completed.
 *
 * Skips Stripe entirely if the institution is already PREMIUM — sends the
 * admin back to the institution dashboard instead of a payment form.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl, 303)
  }

  const userId = session.user.id

  // Resolve the institution this user can pay for. Admin role on the
  // InstitutionStaff join is the canonical owner; fall back to primaryAdminId
  // for legacy single-admin setups.
  const adminStaff = await prisma.institutionStaff.findFirst({
    where: { userId, role: 'INSTITUTION_ADMIN' },
    include: { institution: true },
  })
  const fallbackInstitution = adminStaff
    ? null
    : await prisma.institution.findFirst({ where: { primaryAdminId: userId } })
  const institution = adminStaff?.institution ?? fallbackInstitution

  if (!institution) {
    const back = new URL('/dashboard', req.url)
    back.searchParams.set('error', 'not_institution_admin')
    return NextResponse.redirect(back, 303)
  }

  // Already entitled — skip Stripe.
  if (institution.plan === 'PREMIUM') {
    return NextResponse.redirect(new URL('/dashboard/university', req.url), 303)
  }

  const url = new URL(req.url)
  const plan = url.searchParams.get('plan') === 'annual' ? 'annual' : 'monthly'
  const priceId =
    plan === 'annual'
      ? STRIPE_PRICE_IDS.INSTITUTIONAL_PREMIUM_ANNUAL
      : STRIPE_PRICE_IDS.INSTITUTIONAL_PREMIUM_MONTHLY

  // Configuration guard — fail gracefully if the Stripe price hasn't been
  // wired yet. Tell the admin, don't 500.
  if (!priceId || !STRIPE_CONFIG.secretKey) {
    const back = new URL('/pricing', req.url)
    back.searchParams.set('for', 'institutions')
    back.searchParams.set('error', 'stripe_not_configured')
    return NextResponse.redirect(back, 303)
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, username: true },
  })
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', req.url), 303)
  }

  const stripe = new Stripe(STRIPE_CONFIG.secretKey, { apiVersion: '2025-09-30.clover' })

  // Reuse the institution's Stripe customer if one exists; otherwise create
  // a new one keyed to the institution (not the user — ownership is the org).
  let customerId = institution.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: institution.name,
      metadata: {
        institutionId: institution.id,
        institutionSlug: institution.slug,
        purchasedByUserId: userId,
      },
    })
    customerId = customer.id
    await prisma.institution.update({
      where: { id: institution.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const trialDays = INSTITUTIONAL_TIERS.PREMIUM.trialDays ?? 30
  const origin = new URL(req.url).origin
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/university?upgrade=success`,
    cancel_url: `${origin}/pricing?for=institutions&canceled=1`,
    subscription_data: {
      trial_period_days: trialDays,
      metadata: {
        type: 'institutional_premium',
        institutionId: institution.id,
        institutionSlug: institution.slug,
        purchasedByUserId: userId,
        plan: `institutional_premium_${plan}`,
      },
    },
    // Top-level metadata is what the webhook reads on checkout.session.completed.
    metadata: {
      type: 'institutional_premium',
      institutionId: institution.id,
      institutionSlug: institution.slug,
      purchasedByUserId: userId,
      plan: `institutional_premium_${plan}`,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    // Capture VAT/Tax IDs for B2B customers — required so EU institutions
    // can issue compliant invoices and apply reverse-charge where eligible.
    tax_id_collection: { enabled: true },
    customer_update: { name: 'auto', address: 'auto' },
  })

  return NextResponse.redirect(checkoutSession.url!, 303)
}
