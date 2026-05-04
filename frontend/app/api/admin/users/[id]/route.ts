import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN' && session.user.email?.toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')?.trim() || ''
  const eventLimit = Math.min(500, Math.max(1, parseInt(searchParams.get('eventLimit') || '200', 10)))

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      university: true,
      company: true,
      jobTitle: true,
      country: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      emailVerified: true,
      emailVerifiedAt: true,
      profilePublic: true,
      createdAt: true,
      lastLoginAt: true,
      photo: true,
      _count: {
        select: {
          projects: true,
          applications: true,
          messages: true,
          jobs: true,
          referrals: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const eventWhere: Record<string, unknown> = { actorId: id }
  if (action) eventWhere.action = action

  const [events, eventTotal, actionFacets] = await Promise.all([
    prisma.auditLog.findMany({
      where: eventWhere,
      orderBy: { createdAt: 'desc' },
      take: eventLimit,
      select: {
        id: true,
        action: true,
        targetType: true,
        targetId: true,
        context: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.count({ where: { actorId: id } }),
    prisma.auditLog.groupBy({
      by: ['action'],
      where: { actorId: id },
      _count: { _all: true },
      orderBy: { _count: { action: 'desc' } },
    }),
  ])

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
      role: user.role,
      affiliation: user.university || user.company || null,
      jobTitle: user.jobTitle,
      country: user.country,
      photo: user.photo,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      profilePublic: user.profilePublic,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      counts: user._count,
    },
    events,
    eventTotal,
    actionFacets: actionFacets.map(f => ({ action: f.action, count: f._count._all })),
  })
}
