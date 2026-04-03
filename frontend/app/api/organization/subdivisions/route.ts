import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/organization/subdivisions
 * List subdivisions of a tech park organization.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    })
    if (!user?.organizationId) return NextResponse.json({ subdivisions: [] })

    const subdivisions = await prisma.organization.findMany({
      where: { parentId: user.organizationId },
      include: {
        _count: { select: { members: true } },
        members: {
          select: { id: true, firstName: true, lastName: true, email: true, orgRole: true },
          take: 5,
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ subdivisions })
  } catch (error) {
    console.error('Error fetching subdivisions:', error)
    return NextResponse.json({ error: 'Failed to fetch subdivisions' }, { status: 500 })
  }
}

/**
 * POST /api/organization/subdivisions
 * Create a subdivision under the current tech park organization.
 * Body: { name, city?, region?, description?, industry? }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true, orgRole: true },
    })
    if (!user?.organizationId) return NextResponse.json({ error: 'Not in an organization' }, { status: 400 })
    if (user.orgRole !== 'OWNER' && user.orgRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Verify parent is a TECHPARK
    const parent = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { type: true },
    })
    if (parent?.type !== 'TECHPARK') {
      return NextResponse.json({ error: 'Subdivisions are only available for tech parks' }, { status: 400 })
    }

    const { name, city, region, description, industry } = await req.json()
    if (!name) return NextResponse.json({ error: 'Subdivision name is required' }, { status: 400 })

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)

    const subdivision = await prisma.organization.create({
      data: {
        name, slug, type: 'SUBDIVISION',
        city, region, description, industry,
        parentId: user.organizationId,
        ownerId: session.user.id,
      },
    })

    return NextResponse.json({ subdivision }, { status: 201 })
  } catch (error) {
    console.error('Error creating subdivision:', error)
    return NextResponse.json({ error: 'Failed to create subdivision' }, { status: 500 })
  }
}
