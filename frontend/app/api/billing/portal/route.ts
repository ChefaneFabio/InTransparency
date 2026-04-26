import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { STRIPE_CONFIG } from '@/lib/config/pricing'

export const maxDuration = 15

/**
 * GET /api/billing/portal
 *
 * Resolves the right Stripe customer for the caller (user-owned subscription
 * for students/recruiters, Institution.stripeCustomerId for institution
 * admins) and 303-redirects to a hosted Stripe Customer Portal session.
 * The portal handles cancellation, payment-method update, invoices, and
 * upcoming-invoice preview — we don't need to duplicate that UI.
 *
 * If the caller has no Stripe customer yet (never subscribed), redirects
 * back to /pricing with a soft hint.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl, 303)
  }

  if (!STRIPE_CONFIG.secretKey) {
    return NextResponse.redirect(new URL('/pricing?stripe=not_configured', req.url), 303)
  }

  const userId = session.user.id
  let customerId: string | null = null

  // Institution admin first — their billing is the org, not them personally.
  const adminStaff = await prisma.institutionStaff.findFirst({
    where: { userId, role: 'INSTITUTION_ADMIN' },
    include: { institution: { select: { stripeCustomerId: true } } },
  })
  if (adminStaff?.institution.stripeCustomerId) {
    customerId = adminStaff.institution.stripeCustomerId
  } else {
    // Fall back to user-owned customer (student / recruiter / non-admin).
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    })
    customerId = user?.stripeCustomerId ?? null
  }

  if (!customerId) {
    // Nothing to manage yet — send to pricing.
    return NextResponse.redirect(new URL('/pricing', req.url), 303)
  }

  const stripe = new Stripe(STRIPE_CONFIG.secretKey, { apiVersion: '2025-09-30.clover' })
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${new URL(req.url).origin}/dashboard/subscription`,
  })

  return NextResponse.redirect(portal.url, 303)
}
