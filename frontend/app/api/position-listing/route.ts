import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { STRIPE_PRICE_IDS, STRIPE_CONFIG } from '@/lib/config/pricing'
import { z } from 'zod'

// Lazy initialize Stripe to avoid build-time errors
function getStripe() {
  return new Stripe(STRIPE_CONFIG.secretKey, {
    apiVersion: '2025-09-30.clover'
  })
}

const createPositionSchema = z.object({
  title: z.string().min(1, 'Position title is required').max(200),
  description: z.string().optional(),
  jobId: z.string().optional(),
  price: z.number().int().min(4900).max(9900).default(4900), // €49-€99 in cents
  durationDays: z.number().int().min(7).max(90).default(30),
})

/**
 * GET /api/position-listing
 * Returns active/past position listings for the current recruiter
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // ACTIVE, EXPIRED, PENDING_PAYMENT, CANCELLED
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const where: Record<string, unknown> = {
      recruiterId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    const [listings, total] = await Promise.all([
      prisma.positionListing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.positionListing.count({ where }),
    ])

    // Check for expired listings and update them
    const now = new Date()
    const expiredIds: string[] = []
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i]
      if (listing.status === 'ACTIVE' && listing.expiresAt && listing.expiresAt < now) {
        expiredIds.push(listing.id)
        listings[i] = { ...listing, status: 'EXPIRED' }
      }
    }

    // Batch update expired listings
    if (expiredIds.length > 0) {
      await prisma.positionListing.updateMany({
        where: { id: { in: expiredIds } },
        data: { status: 'EXPIRED' },
      })
    }

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching position listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch position listings' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/position-listing
 * Creates a new position listing and initiates Stripe checkout
 */
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, jobId, price, durationDays } = createPositionSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        stripeCustomerId: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          username: user.username || '',
          role: user.role,
        }
      })
      customerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Create the position listing record (pending payment)
    const positionListing = await prisma.positionListing.create({
      data: {
        recruiterId: user.id,
        title,
        description: description || null,
        jobId: jobId || null,
        price,
        durationDays,
        status: 'PENDING_PAYMENT',
      },
    })

    // Create Stripe checkout session for one-time payment
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: price,
            product_data: {
              name: `Position Listing: ${title}`,
              description: `${durationDays}-day position listing with unlimited candidate contacts`,
            },
          },
          quantity: 1,
        }
      ],
      success_url: `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}&type=position_listing&position_id=${positionListing.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || ''}/dashboard/recruiter/positions?cancelled=true`,
      metadata: {
        userId: user.id,
        type: 'position_listing',
        positionListingId: positionListing.id,
        tier: 'RECRUITER_PAY_PER_CONTACT',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    // Update position listing with Stripe session ID
    await prisma.positionListing.update({
      where: { id: positionListing.id },
      data: { stripeSessionId: checkoutSession.id },
    })

    return NextResponse.json({
      positionListing,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error('Error creating position listing:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create position listing' },
      { status: 500 }
    )
  }
}
