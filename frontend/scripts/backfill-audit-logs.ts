/**
 * Backfill AuditLog with synthetic LOGIN + REGISTER events from User table.
 *
 * Reasoning: audit() calls were added on 2026-05-04. Before that, neither
 * logins nor registrations were recorded. We can reconstruct:
 *   - REGISTER per user from User.createdAt
 *   - last LOGIN per user from User.lastLoginAt (if non-null)
 *
 * Events are tagged with `context.backfilled = true` so they can be told
 * apart from real ones (and re-runs skip already-backfilled rows).
 *
 * Run once:  npx tsx scripts/backfill-audit-logs.ts
 * Dry run:   npx tsx scripts/backfill-audit-logs.ts --dry
 */

import prisma from '../lib/prisma'

async function main() {
  const dryRun = process.argv.includes('--dry')

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
  })

  console.log(`[backfill] found ${users.length} users`)

  // Pre-load existing backfilled rows so we don't double-insert
  const existing = await prisma.auditLog.findMany({
    where: {
      action: { in: ['LOGIN', 'REGISTER'] },
      context: { path: ['backfilled'], equals: true },
    },
    select: { actorId: true, action: true },
  })

  const existingKey = new Set(existing.map(e => `${e.action}::${e.actorId}`))

  let registerToInsert = 0
  let loginToInsert = 0
  const data: Array<{
    actorId: string
    actorEmail: string
    actorRole: string
    action: 'LOGIN' | 'REGISTER'
    context: { backfilled: true; source: string }
    createdAt: Date
  }> = []

  for (const u of users) {
    if (!existingKey.has(`REGISTER::${u.id}`)) {
      data.push({
        actorId: u.id,
        actorEmail: u.email,
        actorRole: u.role,
        action: 'REGISTER',
        context: { backfilled: true, source: 'User.createdAt' },
        createdAt: u.createdAt,
      })
      registerToInsert++
    }

    if (u.lastLoginAt && !existingKey.has(`LOGIN::${u.id}`)) {
      data.push({
        actorId: u.id,
        actorEmail: u.email,
        actorRole: u.role,
        action: 'LOGIN',
        context: { backfilled: true, source: 'User.lastLoginAt' },
        createdAt: u.lastLoginAt,
      })
      loginToInsert++
    }
  }

  console.log(
    `[backfill] would insert ${registerToInsert} REGISTER + ${loginToInsert} LOGIN rows`
  )

  if (dryRun) {
    console.log('[backfill] --dry: no writes performed')
    return
  }

  if (data.length === 0) {
    console.log('[backfill] nothing to insert — already backfilled')
    return
  }

  // Chunk to avoid hitting Postgres parameter limits on big platforms
  const CHUNK = 500
  for (let i = 0; i < data.length; i += CHUNK) {
    const slice = data.slice(i, i + CHUNK)
    await prisma.auditLog.createMany({ data: slice })
    console.log(`[backfill] inserted ${i + slice.length}/${data.length}`)
  }

  console.log('[backfill] done')
}

main()
  .catch(err => {
    console.error('[backfill] failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
