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
  const isAuthorized =
    session.user.role === 'ADMIN' ||
    session.user.email?.toLowerCase() === FOUNDER_EMAIL
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')?.trim() || ''
  const action = searchParams.get('action')?.trim() || ''
  const role = searchParams.get('role')?.trim() || ''
  const actorId = searchParams.get('actorId')?.trim() || ''
  const dateFrom = searchParams.get('dateFrom') || ''
  const dateTo = searchParams.get('dateTo') || ''
  const includeDemo = searchParams.get('includeDemo') === 'true'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (email) {
    where.actorEmail = { contains: email, mode: 'insensitive' }
  }
  if (action) {
    where.action = action
  }
  if (role) {
    where.actorRole = role
  }
  if (actorId) {
    where.actorId = actorId
  }
  if (dateFrom || dateTo) {
    const range: Record<string, Date> = {}
    if (dateFrom) range.gte = new Date(dateFrom)
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      range.lte = to
    }
    where.createdAt = range
  }

  // Demo filter. AuditLog has no FK to User (actorId is a plain string), so
  // we resolve the demo-user id set up-front and exclude those actorIds.
  // Null-actor events (system actions) are kept regardless.
  if (!includeDemo) {
    const demoUsers = await prisma.user.findMany({
      where: { isDemo: true },
      select: { id: true },
    })
    const demoIds = demoUsers.map(u => u.id)
    if (demoIds.length > 0) {
      where.OR = [
        { actorId: null },
        { actorId: { notIn: demoIds } },
      ]
    }
  }

  const [rows, total, actionFacets, roleFacets] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        actorId: true,
        actorEmail: true,
        actorRole: true,
        action: true,
        targetType: true,
        targetId: true,
        context: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.groupBy({
      by: ['action'],
      _count: { _all: true },
      orderBy: { _count: { action: 'desc' } },
      take: 20,
    }),
    prisma.auditLog.groupBy({
      by: ['actorRole'],
      _count: { _all: true },
      orderBy: { _count: { actorRole: 'desc' } },
    }),
  ])

  return NextResponse.json({
    rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    actionFacets: actionFacets.map(f => ({ action: f.action, count: f._count._all })),
    roleFacets: roleFacets
      .filter(f => f.actorRole)
      .map(f => ({ role: f.actorRole as string, count: f._count._all })),
  })
}
