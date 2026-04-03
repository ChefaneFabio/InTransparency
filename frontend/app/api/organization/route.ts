import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/organization
 * Returns the current user's organization (if any), with members.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true, orgRole: true },
    })

    if (!user?.organizationId) {
      return NextResponse.json({ organization: null })
    }

    const org = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      include: {
        members: {
          select: {
            id: true, firstName: true, lastName: true, email: true, photo: true,
            orgRole: true, jobTitle: true, lastLoginAt: true,
          },
          orderBy: { orgRole: 'asc' },
        },
        subdivisions: {
          select: { id: true, name: true, city: true, _count: { select: { members: true } } },
          orderBy: { name: 'asc' },
        },
        owner: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    })

    return NextResponse.json({ organization: org, userRole: user.orgRole })
  } catch (error) {
    console.error('Error fetching organization:', error)
    return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 })
  }
}

/**
 * POST /api/organization
 * Create a new organization. Only RECRUITER and TECHPARK roles can create orgs.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userRole = session.user.role
    if (userRole !== 'RECRUITER' && userRole !== 'TECHPARK' && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Only companies and tech parks can create organizations' }, { status: 403 })
    }

    // Check user doesn't already belong to an org
    const existing = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    })
    if (existing?.organizationId) {
      return NextResponse.json({ error: 'You already belong to an organization' }, { status: 400 })
    }

    const { name, type, logo, website, industry, description, city, region, size } = await req.json()
    if (!name) return NextResponse.json({ error: 'Organization name is required' }, { status: 400 })

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)

    const orgType = userRole === 'TECHPARK' ? 'TECHPARK' : (type === 'AGENCY' ? 'AGENCY' : 'COMPANY')

    const org = await prisma.organization.create({
      data: {
        name, slug, type: orgType,
        logo, website, industry, description, city, region, size,
        ownerId: session.user.id,
      },
    })

    // Link user to org as OWNER
    await prisma.user.update({
      where: { id: session.user.id },
      data: { organizationId: org.id, orgRole: 'OWNER' },
    })

    return NextResponse.json({ organization: org }, { status: 201 })
  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
  }
}

/**
 * PUT /api/organization
 * Update organization settings. Requires OWNER or ADMIN org role.
 */
export async function PUT(req: NextRequest) {
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

    const { name, logo, website, industry, description, city, region, size } = await req.json()

    const data: Record<string, any> = {}
    if (name !== undefined) data.name = name
    if (logo !== undefined) data.logo = logo
    if (website !== undefined) data.website = website
    if (industry !== undefined) data.industry = industry
    if (description !== undefined) data.description = description
    if (city !== undefined) data.city = city
    if (region !== undefined) data.region = region
    if (size !== undefined) data.size = size

    const org = await prisma.organization.update({
      where: { id: user.organizationId },
      data,
    })

    return NextResponse.json({ organization: org })
  } catch (error) {
    console.error('Error updating organization:', error)
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 })
  }
}
