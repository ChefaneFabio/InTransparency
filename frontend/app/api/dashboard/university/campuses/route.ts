import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const campusSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().max(50).optional().nullable(),
  city: z.string().min(1).max(200),
  region: z.string().max(200).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  country: z.string().max(10).default('IT'),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(50).optional().nullable(),
  departments: z.array(z.string()).default([]),
})

/**
 * GET /api/dashboard/university/campuses
 * List all campuses for the current university
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify tier
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
        upgradeUrl: '/pricing?for=institutes',
      }, { status: 403 })
    }

    const campuses = await prisma.campus.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ campuses })
  } catch (error) {
    console.error('Error listing campuses:', error)
    return NextResponse.json({ error: 'Failed to list campuses' }, { status: 500 })
  }
}

/**
 * POST /api/dashboard/university/campuses
 * Create a new campus
 */
export async function POST(req: NextRequest) {
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
        upgradeUrl: '/pricing?for=institutes',
      }, { status: 403 })
    }

    const body = await req.json()
    const data = campusSchema.parse(body)

    // Limit to 50 campuses per institution
    const campusCount = await prisma.campus.count({
      where: { userId: session.user.id }
    })

    if (campusCount >= 50) {
      return NextResponse.json({
        error: 'Maximum of 50 campuses allowed',
      }, { status: 400 })
    }

    const campus = await prisma.campus.create({
      data: {
        userId: session.user.id,
        ...data,
      }
    })

    return NextResponse.json({ campus }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating campus:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    // Handle unique constraint violation
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A campus with this name already exists' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Failed to create campus' }, { status: 500 })
  }
}
