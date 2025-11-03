import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth/jwt-verify'
import prisma from '@/lib/prisma'
import { STRIPE_CONFIG } from '@/lib/config/pricing'

const stripe = new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: '2024-12-18.acacia'
})

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please subscribe first.' },
        { status: 400 }
      )
    }

    // Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: STRIPE_CONFIG.customerPortalUrl
    })

    return NextResponse.json({
      url: portalSession.url
    })
  } catch (error: any) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
