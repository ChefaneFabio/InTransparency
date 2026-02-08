import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const updateCampusSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().max(50).optional().nullable(),
  city: z.string().min(1).max(200).optional(),
  region: z.string().max(200).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  country: z.string().max(10).optional(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(50).optional().nullable(),
  departments: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

/**
 * PUT /api/dashboard/university/campuses/[id]
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, subscriptionTier: true }
    })

    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (user.subscriptionTier !== 'INSTITUTION_ENTERPRISE' && user.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Multi-campus support requires an Enterprise subscription',
      }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const data = updateCampusSchema.parse(body)

    // Verify ownership
    const existing = await prisma.campus.findFirst({
      where: { id, userId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Campus not found' }, { status: 404 })
    }

    const campus = await prisma.campus.update({
      where: { id },
      data,
    })

    return NextResponse.json({ campus })
  } catch (error: any) {
    console.error('Error updating campus:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to update campus' }, { status: 500 })
  }
}

/**
 * DELETE /api/dashboard/university/campuses/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existing = await prisma.campus.findFirst({
      where: { id, userId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Campus not found' }, { status: 404 })
    }

    await prisma.campus.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting campus:', error)
    return NextResponse.json({ error: 'Failed to delete campus' }, { status: 500 })
  }
}
