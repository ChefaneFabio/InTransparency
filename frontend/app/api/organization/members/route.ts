import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * POST /api/organization/members
 * Invite a user to the organization by email.
 * Body: { email: string, role?: 'ADMIN' | 'MANAGER' | 'MEMBER' }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const inviter = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true, orgRole: true },
    })
    if (!inviter?.organizationId) return NextResponse.json({ error: 'Not in an organization' }, { status: 400 })
    if (inviter.orgRole !== 'OWNER' && inviter.orgRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Only owners and admins can invite members' }, { status: 403 })
    }

    const { email, role } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const targetRole = role && ['ADMIN', 'MANAGER', 'MEMBER'].includes(role) ? role : 'MEMBER'

    // Find user by email
    const targetUser = await prisma.user.findUnique({ where: { email } })
    if (!targetUser) {
      return NextResponse.json({ error: 'No user found with this email. They must register first.' }, { status: 404 })
    }
    if (targetUser.organizationId) {
      return NextResponse.json({ error: 'This user already belongs to an organization' }, { status: 400 })
    }

    // Add to organization
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { organizationId: inviter.organizationId, orgRole: targetRole },
    })

    return NextResponse.json({
      success: true,
      member: {
        id: targetUser.id,
        email: targetUser.email,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        orgRole: targetRole,
      },
    })
  } catch (error) {
    console.error('Error inviting member:', error)
    return NextResponse.json({ error: 'Failed to invite member' }, { status: 500 })
  }
}

/**
 * PATCH /api/organization/members
 * Update a member's role. Body: { userId: string, role: OrgRole }
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true, orgRole: true },
    })
    if (!admin?.organizationId || (admin.orgRole !== 'OWNER' && admin.orgRole !== 'ADMIN')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { userId, role } = await req.json()
    if (!userId || !role || !['ADMIN', 'MANAGER', 'MEMBER'].includes(role)) {
      return NextResponse.json({ error: 'Valid userId and role required' }, { status: 400 })
    }

    // Verify target is in same org
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true, orgRole: true },
    })
    if (target?.organizationId !== admin.organizationId) {
      return NextResponse.json({ error: 'User not in your organization' }, { status: 404 })
    }
    if (target.orgRole === 'OWNER') {
      return NextResponse.json({ error: 'Cannot change the owner role' }, { status: 400 })
    }

    await prisma.user.update({ where: { id: userId }, data: { orgRole: role } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating member role:', error)
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}

/**
 * DELETE /api/organization/members
 * Remove a member from the organization. Body: { userId: string }
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true, orgRole: true },
    })
    if (!admin?.organizationId || (admin.orgRole !== 'OWNER' && admin.orgRole !== 'ADMIN')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 })
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true, orgRole: true },
    })
    if (target?.organizationId !== admin.organizationId) {
      return NextResponse.json({ error: 'User not in your organization' }, { status: 404 })
    }
    if (target.orgRole === 'OWNER') {
      return NextResponse.json({ error: 'Cannot remove the owner' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { organizationId: null, orgRole: 'MEMBER' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}
