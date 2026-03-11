import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const updatePositionSchema = z.object({
  status: z.enum(['CANCELLED']).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
})

/**
 * GET /api/position-listing/[id]
 * Returns details of a specific position listing
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const listing = await prisma.positionListing.findUnique({
      where: { id },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Position listing not found' }, { status: 404 })
    }

    // Only allow the owner or admin to view
    if (listing.recruiterId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if expired and update status
    const now = new Date()
    if (listing.status === 'ACTIVE' && listing.expiresAt && listing.expiresAt < now) {
      await prisma.positionListing.update({
        where: { id },
        data: { status: 'EXPIRED' },
      })
      listing.status = 'EXPIRED'
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error('Error fetching position listing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch position listing' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/position-listing/[id]
 * Update a position listing (e.g., cancel, update title/description)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const updates = updatePositionSchema.parse(body)

    const listing = await prisma.positionListing.findUnique({
      where: { id },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Position listing not found' }, { status: 404 })
    }

    if (listing.recruiterId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only allow cancelling active or pending positions
    if (updates.status === 'CANCELLED') {
      if (listing.status !== 'ACTIVE' && listing.status !== 'PENDING_PAYMENT') {
        return NextResponse.json(
          { error: 'Can only cancel active or pending positions' },
          { status: 400 }
        )
      }
    }

    const data: Record<string, unknown> = {}
    if (updates.status) data.status = updates.status
    if (updates.title) data.title = updates.title
    if (updates.description !== undefined) data.description = updates.description

    const updated = await prisma.positionListing.update({
      where: { id },
      data,
    })

    return NextResponse.json({ listing: updated })
  } catch (error) {
    console.error('Error updating position listing:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update position listing' },
      { status: 500 }
    )
  }
}
