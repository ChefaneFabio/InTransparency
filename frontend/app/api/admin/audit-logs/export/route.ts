import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  const s = typeof value === 'string' ? value : JSON.stringify(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN' && session.user.email?.toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')?.trim() || ''
  const action = searchParams.get('action')?.trim() || ''
  const dateFrom = searchParams.get('dateFrom') || ''
  const dateTo = searchParams.get('dateTo') || ''

  const where: Record<string, unknown> = {}
  if (email) where.actorEmail = { contains: email, mode: 'insensitive' }
  if (action) where.action = action
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

  const rows = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 10000,
    select: {
      createdAt: true,
      actorEmail: true,
      actorRole: true,
      action: true,
      targetType: true,
      targetId: true,
      context: true,
    },
  })

  const header = ['createdAt', 'actorEmail', 'actorRole', 'action', 'targetType', 'targetId', 'context']
  const lines = [header.join(',')]
  for (const row of rows) {
    lines.push([
      row.createdAt.toISOString(),
      csvEscape(row.actorEmail),
      csvEscape(row.actorRole),
      csvEscape(row.action),
      csvEscape(row.targetType),
      csvEscape(row.targetId),
      csvEscape(row.context),
    ].join(','))
  }

  const filename = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
