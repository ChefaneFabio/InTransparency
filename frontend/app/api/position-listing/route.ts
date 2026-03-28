import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/position-listing
 * Return all position listings for the authenticated recruiter.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const listings = await prisma.positionListing.findMany({
      where: { recruiterId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      listings: listings.map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        jobId: l.jobId,
        price: l.price,
        currency: l.currency,
        status: l.status,
        contactsUsed: l.contactsUsed,
        durationDays: l.durationDays,
        activatedAt: l.activatedAt?.toISOString() ?? null,
        expiresAt: l.expiresAt?.toISOString() ?? null,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching position listings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/position-listing
 * Create a new position listing. Status defaults to PENDING_PAYMENT.
 * Body: { title: string, description?: string, price?: number, durationDays?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, price, durationDays } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const listing = await prisma.positionListing.create({
      data: {
        recruiterId: session.user.id,
        title: title.trim(),
        description: description?.trim() ?? null,
        price: typeof price === 'number' ? price : 4900, // default to 49 EUR
        currency: 'eur',
        durationDays: typeof durationDays === 'number' ? durationDays : 30,
        status: 'PENDING_PAYMENT',
      },
    })

    return NextResponse.json({
      listing: {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currency: listing.currency,
        status: listing.status,
        durationDays: listing.durationDays,
        createdAt: listing.createdAt.toISOString(),
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating position listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
