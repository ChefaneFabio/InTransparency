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
  const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') || '7', 10)))
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const rows = await prisma.auditLog.findMany({
    where: {
      action: { in: ['SEARCH_CANDIDATES', 'SEARCH_JOBS'] },
      createdAt: { gte: since },
    },
    select: { action: true, context: true, actorEmail: true },
    take: 5000,
    orderBy: { createdAt: 'desc' },
  })

  const counts = new Map<string, { query: string; action: string; count: number; users: Set<string> }>()
  for (const row of rows) {
    const ctx = (row.context ?? {}) as { query?: { naturalLanguage?: string; search?: string } }
    const q = ctx.query?.naturalLanguage || ctx.query?.search
    if (!q || typeof q !== 'string' || q.trim().length === 0) continue
    const key = `${row.action}::${q.trim().toLowerCase()}`
    const entry = counts.get(key)
    if (entry) {
      entry.count++
      if (row.actorEmail) entry.users.add(row.actorEmail)
    } else {
      counts.set(key, {
        query: q.trim(),
        action: row.action,
        count: 1,
        users: new Set(row.actorEmail ? [row.actorEmail] : []),
      })
    }
  }

  const top = Array.from(counts.values())
    .map(e => ({ query: e.query, action: e.action, count: e.count, uniqueUsers: e.users.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30)

  return NextResponse.json({ days, top })
}
