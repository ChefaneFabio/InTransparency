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

  const includeDemo = new URL(req.url).searchParams.get('includeDemo') === 'true'

  // Demo filter — same pattern as /api/admin/audit-logs. Resolve demo user
  // ids and exclude them; preserve null-actor system events.
  let demoFilter: Record<string, unknown> = {}
  if (!includeDemo) {
    const demoUsers = await prisma.user.findMany({
      where: { isDemo: true },
      select: { id: true },
    })
    const demoIds = demoUsers.map(u => u.id)
    if (demoIds.length > 0) {
      demoFilter = {
        OR: [
          { actorId: null },
          { actorId: { notIn: demoIds } },
        ],
      }
    }
  }

  const now = new Date()
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [logins24h, logins7d, searches24h, searches7d, uniqueUsers7d] = await Promise.all([
    prisma.auditLog.count({ where: { action: 'LOGIN', createdAt: { gte: dayAgo }, ...demoFilter } }),
    prisma.auditLog.count({ where: { action: 'LOGIN', createdAt: { gte: weekAgo }, ...demoFilter } }),
    prisma.auditLog.count({
      where: {
        action: { in: ['SEARCH_CANDIDATES', 'SEARCH_JOBS'] },
        createdAt: { gte: dayAgo },
        ...demoFilter,
      },
    }),
    prisma.auditLog.count({
      where: {
        action: { in: ['SEARCH_CANDIDATES', 'SEARCH_JOBS'] },
        createdAt: { gte: weekAgo },
        ...demoFilter,
      },
    }),
    prisma.auditLog.findMany({
      where: { action: 'LOGIN', createdAt: { gte: weekAgo }, ...demoFilter },
      distinct: ['actorEmail'],
      select: { actorEmail: true },
    }),
  ])

  return NextResponse.json({
    logins24h,
    logins7d,
    searches24h,
    searches7d,
    uniqueUsers7d: uniqueUsers7d.length,
  })
}
