import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * PUT /api/dashboard/recruiter/saved-candidates/[id]
 * Update saved candidate (folder, notes, rating, tags)
 * [id] is the SavedCandidate record ID
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const userId = session.user.id
    const body = await req.json()
    const { folder, notes, rating, tags } = body

    // Verify the saved candidate belongs to this recruiter
    const existing = await prisma.savedCandidate.findUnique({
      where: { id },
      select: { recruiterId: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Saved candidate not found' },
        { status: 404 }
      )
    }

    if (existing.recruiterId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Build update data - only include fields that were provided
    const updateData: Record<string, unknown> = {}
    if (folder !== undefined) updateData.folder = folder
    if (notes !== undefined) updateData.notes = notes
    if (rating !== undefined) updateData.rating = rating
    if (tags !== undefined) updateData.tags = tags

    const updated = await prisma.savedCandidate.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ savedCandidate: updated })
  } catch (error) {
    console.error('Error updating saved candidate:', error)
    return NextResponse.json(
      { error: 'Failed to update saved candidate' },
      { status: 500 }
    )
  }
}
