import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN' && session.user.email?.toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim() || ''
  const role = searchParams.get('role')?.trim() || ''
  const verifiedParam = searchParams.get('verified') || ''
  const includeDemo = searchParams.get('includeDemo') === 'true'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)))
  const sort = searchParams.get('sort') || 'createdAt'
  const dir = searchParams.get('dir') === 'asc' ? 'asc' : 'desc'
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { university: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (role) where.role = role
  if (verifiedParam === 'true') where.emailVerified = true
  if (verifiedParam === 'false') where.emailVerified = false
  // Demo users are filtered out by default — admin views show real-customer
  // data only. Toggle ?includeDemo=true to inspect demo state.
  if (!includeDemo) where.isDemo = false

  const orderBy: Record<string, 'asc' | 'desc'> =
    ['createdAt', 'lastLoginAt', 'email'].includes(sort)
      ? { [sort]: dir }
      : { createdAt: 'desc' }

  const [users, total, roleFacets] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
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
        emailVerified: true,
        profilePublic: true,
        isDemo: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            projects: true,
            applications: true,
            messages: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
    prisma.user.groupBy({
      by: ['role'],
      where: includeDemo ? {} : { isDemo: false },
      _count: { _all: true },
      orderBy: { _count: { role: 'desc' } },
    }),
  ])

  return NextResponse.json({
    rows: users.map(u => ({
      id: u.id,
      email: u.email,
      name: [u.firstName, u.lastName].filter(Boolean).join(' ') || null,
      role: u.role,
      affiliation: u.university || u.company || null,
      jobTitle: u.jobTitle,
      country: u.country,
      subscriptionTier: u.subscriptionTier,
      emailVerified: u.emailVerified,
      profilePublic: u.profilePublic,
      isDemo: u.isDemo,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      projectsCount: u._count.projects,
      applicationsCount: u._count.applications,
      messagesCount: u._count.messages,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    roleFacets: roleFacets.map(f => ({ role: f.role, count: f._count._all })),
  })
}
