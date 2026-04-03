import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * PATCH /api/dashboard/university/partnerships/[id]
 * Accept, reject, or update a partnership.
 * Body: { status: 'ACTIVE' | 'EXPIRED' | 'REVOKED', notes?: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: partnershipId } = await params

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
    })
    if (!settings) {
      return NextResponse.json({ error: 'University settings not found' }, { status: 404 })
    }

    // Verify partnership involves this institution
    const existing = await prisma.institutionPartnership.findFirst({
      where: {
        id: partnershipId,
        OR: [
          { institutionAId: settings.id },
          { institutionBId: settings.id },
        ],
      },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Partnership not found' }, { status: 404 })
    }

    const body = await request.json()
    const { status, notes, maxStudents } = body

    const data: Record<string, any> = {}
    if (status !== undefined && ['PENDING', 'ACTIVE', 'EXPIRED', 'REVOKED'].includes(status)) {
      data.status = status
    }
    if (notes !== undefined) data.notes = notes
    if (maxStudents !== undefined) data.maxStudents = maxStudents

    const partnership = await prisma.institutionPartnership.update({
      where: { id: partnershipId },
      data,
    })

    return NextResponse.json({ partnership })
  } catch (error) {
    console.error('Partnership update error:', error)
    return NextResponse.json({ error: 'Failed to update partnership' }, { status: 500 })
  }
}

/**
 * DELETE /api/dashboard/university/partnerships/[id]
 * Remove a partnership.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: partnershipId } = await params

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
    })
    if (!settings) {
      return NextResponse.json({ error: 'University settings not found' }, { status: 404 })
    }

    const existing = await prisma.institutionPartnership.findFirst({
      where: {
        id: partnershipId,
        OR: [
          { institutionAId: settings.id },
          { institutionBId: settings.id },
        ],
      },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Partnership not found' }, { status: 404 })
    }

    await prisma.institutionPartnership.delete({ where: { id: partnershipId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Partnership delete error:', error)
    return NextResponse.json({ error: 'Failed to delete partnership' }, { status: 500 })
  }
}
