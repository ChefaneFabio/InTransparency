/**
 * Backfill AuditLog with synthetic events reconstructed from other tables.
 *
 * Reasoning: audit() calls were added on 2026-05-04. Before that, audit
 * events weren't recorded. But Project/Job/Application/Message/User all
 * keep their own createdAt — so we can synthesize past activity rows
 * from those.
 *
 * Sources used:
 *   - REGISTER              ← User.createdAt
 *   - LOGIN (last only)     ← User.lastLoginAt
 *   - PROJECT_CREATED       ← Project.createdAt + userId
 *   - JOB_POSTED            ← Job.createdAt + recruiterId
 *   - APPLICATION_SUBMITTED ← Application.createdAt + applicantId
 *   - CONTACT_STUDENT       ← Message.createdAt + senderId + recipientId
 *
 * Cannot be recovered (never written anywhere):
 *   - SEARCH_CANDIDATES / SEARCH_JOBS
 *   - LOGIN history beyond the most recent
 *   - VIEW_PROFILE in prod (ProfileView only populated by demo seeds)
 *
 * Every backfilled row is tagged `context.backfilled = true` and
 * `context.source = '<source description>'` so:
 *   - You can tell synthetic rows from real ones in the dashboard.
 *   - Re-runs are idempotent (we skip rows that already exist by
 *     (action, actorId, source)).
 *
 * Usage:
 *   npx tsx scripts/backfill-audit-logs.ts                # all history
 *   npx tsx scripts/backfill-audit-logs.ts --since=30d    # last 30 days
 *   npx tsx scripts/backfill-audit-logs.ts --since=2026-04-01
 *   npx tsx scripts/backfill-audit-logs.ts --dry          # preview only
 */

import prisma from '../lib/prisma'

type SyntheticRow = {
  actorId: string
  actorEmail: string | null
  actorRole: string | null
  action:
    | 'REGISTER'
    | 'LOGIN'
    | 'PROJECT_CREATED'
    | 'JOB_POSTED'
    | 'APPLICATION_SUBMITTED'
    | 'CONTACT_STUDENT'
  targetType?: string
  targetId?: string
  context: Record<string, unknown>
  createdAt: Date
}

function parseSince(): Date | null {
  const arg = process.argv.find(a => a.startsWith('--since='))
  if (!arg) return null
  const value = arg.slice('--since='.length)
  // shorthand like 30d / 7d / 24h
  const m = /^(\d+)([dhw])$/.exec(value)
  if (m) {
    const n = parseInt(m[1], 10)
    const unitMs = m[2] === 'h' ? 3600_000 : m[2] === 'w' ? 7 * 86400_000 : 86400_000
    return new Date(Date.now() - n * unitMs)
  }
  // ISO date
  const d = new Date(value)
  if (isNaN(d.getTime())) {
    throw new Error(`--since: cannot parse "${value}". Use 30d, 7d, 24h, or ISO date.`)
  }
  return d
}

async function main() {
  const dryRun = process.argv.includes('--dry')
  const since = parseSince()
  const sinceFilter = since ? { gte: since } : undefined

  console.log(
    `[backfill] window: ${since ? `since ${since.toISOString()}` : 'all time'}` +
      (dryRun ? ' (dry run)' : '')
  )

  // Pre-load every existing backfilled row keyed by (action, actorId, source)
  // so re-runs are idempotent regardless of whether window expanded.
  const existing = await prisma.auditLog.findMany({
    where: { context: { path: ['backfilled'], equals: true } },
    select: { action: true, actorId: true, targetId: true, context: true },
  })

  const existingKey = new Set<string>(
    existing.map(e => {
      const ctx = e.context as { source?: string } | null
      return `${e.action}::${e.actorId ?? ''}::${e.targetId ?? ''}::${ctx?.source ?? ''}`
    })
  )

  const rows: SyntheticRow[] = []
  const dedupePush = (r: SyntheticRow) => {
    const key = `${r.action}::${r.actorId}::${r.targetId ?? ''}::${r.context.source ?? ''}`
    if (existingKey.has(key)) return
    existingKey.add(key)
    rows.push(r)
  }

  // 1. Users → REGISTER + LOGIN
  const users = await prisma.user.findMany({
    where: sinceFilter ? { createdAt: sinceFilter } : undefined,
    select: { id: true, email: true, role: true, createdAt: true, lastLoginAt: true },
  })
  for (const u of users) {
    dedupePush({
      actorId: u.id,
      actorEmail: u.email,
      actorRole: u.role,
      action: 'REGISTER',
      targetType: 'User',
      targetId: u.id,
      context: { backfilled: true, source: 'User.createdAt' },
      createdAt: u.createdAt,
    })
    if (u.lastLoginAt && (!since || u.lastLoginAt >= since)) {
      dedupePush({
        actorId: u.id,
        actorEmail: u.email,
        actorRole: u.role,
        action: 'LOGIN',
        context: { backfilled: true, source: 'User.lastLoginAt' },
        createdAt: u.lastLoginAt,
      })
    }
  }

  // Also pull lastLoginAt for users registered before the window
  if (since) {
    const recentLogins = await prisma.user.findMany({
      where: { createdAt: { lt: since }, lastLoginAt: sinceFilter },
      select: { id: true, email: true, role: true, lastLoginAt: true },
    })
    for (const u of recentLogins) {
      if (!u.lastLoginAt) continue
      dedupePush({
        actorId: u.id,
        actorEmail: u.email,
        actorRole: u.role,
        action: 'LOGIN',
        context: { backfilled: true, source: 'User.lastLoginAt' },
        createdAt: u.lastLoginAt,
      })
    }
  }

  // 2. Projects → PROJECT_CREATED
  const projects = await prisma.project.findMany({
    where: sinceFilter ? { createdAt: sinceFilter } : undefined,
    select: {
      id: true,
      title: true,
      discipline: true,
      createdAt: true,
      user: { select: { id: true, email: true, role: true } },
    },
  })
  for (const p of projects) {
    if (!p.user) continue
    dedupePush({
      actorId: p.user.id,
      actorEmail: p.user.email,
      actorRole: p.user.role,
      action: 'PROJECT_CREATED',
      targetType: 'Project',
      targetId: p.id,
      context: { backfilled: true, source: 'Project.createdAt', title: p.title, discipline: p.discipline },
      createdAt: p.createdAt,
    })
  }

  // 3. Jobs → JOB_POSTED
  const jobs = await prisma.job.findMany({
    where: sinceFilter ? { createdAt: sinceFilter } : undefined,
    select: {
      id: true,
      title: true,
      companyName: true,
      createdAt: true,
      recruiter: { select: { id: true, email: true, role: true } },
    },
  })
  for (const j of jobs) {
    if (!j.recruiter) continue
    dedupePush({
      actorId: j.recruiter.id,
      actorEmail: j.recruiter.email,
      actorRole: j.recruiter.role,
      action: 'JOB_POSTED',
      targetType: 'Job',
      targetId: j.id,
      context: { backfilled: true, source: 'Job.createdAt', title: j.title, companyName: j.companyName },
      createdAt: j.createdAt,
    })
  }

  // 4. Applications → APPLICATION_SUBMITTED
  const applications = await prisma.application.findMany({
    where: sinceFilter ? { createdAt: sinceFilter } : undefined,
    select: {
      id: true,
      jobId: true,
      createdAt: true,
      applicant: { select: { id: true, email: true, role: true } },
      job: { select: { title: true, companyName: true } },
    },
  })
  for (const a of applications) {
    if (!a.applicant) continue
    dedupePush({
      actorId: a.applicant.id,
      actorEmail: a.applicant.email,
      actorRole: a.applicant.role,
      action: 'APPLICATION_SUBMITTED',
      targetType: 'Job',
      targetId: a.jobId,
      context: {
        backfilled: true,
        source: 'Application.createdAt',
        applicationId: a.id,
        jobTitle: a.job?.title,
        companyName: a.job?.companyName,
      },
      createdAt: a.createdAt,
    })
  }

  // 5. Messages with internal recipient → CONTACT_STUDENT
  const messages = await prisma.message.findMany({
    where: {
      recipientId: { not: null },
      ...(sinceFilter ? { createdAt: sinceFilter } : {}),
    },
    select: {
      id: true,
      subject: true,
      threadId: true,
      recipientId: true,
      recipientEmail: true,
      createdAt: true,
      sender: { select: { id: true, email: true, role: true } },
    },
  })
  for (const m of messages) {
    if (!m.sender || !m.recipientId) continue
    dedupePush({
      actorId: m.sender.id,
      actorEmail: m.sender.email,
      actorRole: m.sender.role,
      action: 'CONTACT_STUDENT',
      targetType: 'User',
      targetId: m.recipientId,
      context: {
        backfilled: true,
        source: 'Message.createdAt',
        messageId: m.id,
        threadId: m.threadId,
        subject: m.subject,
        recipientEmail: m.recipientEmail,
      },
      createdAt: m.createdAt,
    })
  }

  // Summary
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.action] = (acc[r.action] ?? 0) + 1
    return acc
  }, {})
  console.log('[backfill] would insert:')
  for (const [action, n] of Object.entries(counts).sort()) {
    console.log(`  ${action.padEnd(24)} ${n}`)
  }
  console.log(`  ${'TOTAL'.padEnd(24)} ${rows.length}`)

  if (dryRun) {
    console.log('[backfill] --dry: no writes')
    return
  }
  if (rows.length === 0) {
    console.log('[backfill] nothing to insert (already backfilled or no source data)')
    return
  }

  // Chunk to avoid Postgres parameter limits
  const CHUNK = 500
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK)
    await prisma.auditLog.createMany({
      data: slice.map(r => ({
        actorId: r.actorId,
        actorEmail: r.actorEmail,
        actorRole: r.actorRole,
        action: r.action,
        targetType: r.targetType ?? null,
        targetId: r.targetId ?? null,
        context: r.context as object,
        createdAt: r.createdAt,
      })),
    })
    console.log(`[backfill] inserted ${i + slice.length}/${rows.length}`)
  }
  console.log('[backfill] done')
}

main()
  .catch(err => {
    console.error('[backfill] failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
