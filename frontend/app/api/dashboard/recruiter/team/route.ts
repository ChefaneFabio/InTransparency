import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

/**
 * GET /api/dashboard/recruiter/team
 * Lists team members for the authenticated recruiter's organization.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: { include: { members: true, owner: true } } },
  })
  if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!user.organization) {
    return NextResponse.json({ organization: null, members: [] })
  }

  const o = user.organization
  return NextResponse.json({
    organization: {
      id: o.id,
      name: o.name,
      slug: o.slug,
      billingPlan: o.billingPlan,
      seatLimit: o.seatLimit,
      seatsUsed: o.members.length,
      trialEndsAt: o.trialEndsAt?.toISOString() ?? null,
    },
    members: o.members.map(m => ({
      id: m.id,
      email: m.email,
      firstName: m.firstName,
      lastName: m.lastName,
      jobTitle: m.jobTitle,
      orgRole: m.orgRole,
      isOwner: m.id === o.ownerId,
    })),
  })
}

/**
 * POST /api/dashboard/recruiter/team
 * Invite a new member to the organization. Enforces seat limit.
 * Body: { email, firstName?, lastName?, orgRole? }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: { include: { _count: { select: { members: true } } } } },
  })
  if (!user?.organization) {
    return NextResponse.json({ error: 'You are not part of an organization' }, { status: 400 })
  }
  // Only owner + admins of the org can invite
  if (user.orgRole !== 'ADMIN' && user.organization.ownerId !== user.id) {
    return NextResponse.json({ error: 'Only organization admins can invite' }, { status: 403 })
  }

  const body = await req.json()
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  // Enforce seat limit
  const currentSeats = user.organization._count.members
  const limit = user.organization.seatLimit
  if (typeof limit === 'number' && currentSeats >= limit) {
    return NextResponse.json(
      {
        error: `Seat limit reached (${limit}). Upgrade your plan to add more members.`,
        currentSeats,
        seatLimit: limit,
      },
      { status: 402 } // Payment Required — appropriate for plan-gated feature
    )
  }

  // Create user + add to org
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing && existing.organizationId) {
    return NextResponse.json(
      { error: 'User already belongs to an organization' },
      { status: 409 }
    )
  }

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        organizationId: user.organization.id,
        orgRole: body.orgRole ?? 'MEMBER',
      },
    })
    return NextResponse.json({ invited: true, existingUser: true, userId: existing.id })
  }

  // Invite new user with temp password — they set real one on first login
  const passwordHash = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10)
  const created = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'RECRUITER',
      firstName: body.firstName ?? null,
      lastName: body.lastName ?? null,
      organizationId: user.organization.id,
      orgRole: body.orgRole ?? 'MEMBER',
      company: user.organization.name,
    },
  })

  return NextResponse.json({
    invited: true,
    existingUser: false,
    userId: created.id,
    message:
      'Member added. Send them the signup link so they can set their own password — invite emails are handled by a separate flow.',
  })
}

/**
 * DELETE /api/dashboard/recruiter/team?memberId=...
 * Remove a member from the organization. Can't remove the owner.
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true },
  })
  if (!user?.organization) {
    return NextResponse.json({ error: 'No organization' }, { status: 400 })
  }
  if (user.orgRole !== 'ADMIN' && user.organization.ownerId !== user.id) {
    return NextResponse.json({ error: 'Only admins can remove members' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const memberId = searchParams.get('memberId')
  if (!memberId) return NextResponse.json({ error: 'memberId required' }, { status: 400 })

  const target = await prisma.user.findUnique({ where: { id: memberId } })
  if (!target || target.organizationId !== user.organization.id) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }
  if (target.id === user.organization.ownerId) {
    return NextResponse.json({ error: 'Cannot remove the owner' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: memberId },
    data: { organizationId: null, orgRole: 'MEMBER' },
  })

  return NextResponse.json({ removed: true })
}
