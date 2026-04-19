/**
 * Speed benchmarks against the live Neon production DB.
 * These measure the critical-path queries that sit behind every user interaction.
 *
 * Targets (competitive goals):
 *   - Skill graph aggregation:   < 500ms P95
 *   - Skills gap computation:    < 1500ms P95
 *   - Match explanation read:    < 200ms P95
 *   - ESCO resolution (cache):   < 100ms P95
 *   - CompanyProfile directory:  < 800ms P95
 *
 * Run: npm run test:bench
 */

import { freshDbClient } from '../helpers/db'
import { getCurrentSkillGraph } from '@/lib/skill-delta'
import { resolveEscoUri } from '@/lib/esco'
import libPrisma from '@/lib/prisma'

const prisma = freshDbClient()

interface Timing {
  name: string
  samples: number[]
}

const timings: Timing[] = []

function record(name: string, ms: number) {
  let entry = timings.find(t => t.name === name)
  if (!entry) {
    entry = { name, samples: [] }
    timings.push(entry)
  }
  entry.samples.push(ms)
}

async function time<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now()
  try {
    return await fn()
  } finally {
    record(name, Date.now() - start)
  }
}

function summarize(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b)
  const mean = sorted.reduce((s, x) => s + x, 0) / sorted.length
  const p50 = sorted[Math.floor(sorted.length * 0.5)]
  const p95 = sorted[Math.floor(sorted.length * 0.95)]
  const max = sorted[sorted.length - 1]
  return { mean, p50, p95, max }
}

describe('DB speed benchmarks', () => {
  beforeAll(async () => {
    await Promise.all([prisma.$connect(), libPrisma.$connect()])
  })

  afterAll(async () => {
    // Print summary table
    const rows = timings.map(t => {
      const s = summarize(t.samples)
      return `  ${t.name.padEnd(40)} n=${t.samples.length}  mean=${s.mean.toFixed(0)}ms  p50=${s.p50}ms  p95=${s.p95}ms  max=${s.max}ms`
    })
    console.log('\n=== BENCHMARK RESULTS ===')
    for (const r of rows) console.log(r)
    console.log('=========================\n')
    await prisma.$disconnect()
    await libPrisma.$disconnect()
  })

  it('ESCO URI resolution — 10 samples', async () => {
    const terms = ['python', 'java', 'sql', 'teamwork', 'machine learning', 'figma', 'docker', 'aws', 'react', 'leadership']
    for (const term of terms) {
      await time('escoResolve', () => resolveEscoUri(term))
    }
    const s = summarize(timings.find(t => t.name === 'escoResolve')!.samples)
    expect(s.p95).toBeLessThan(500) // generous first-hit allowance
  })

  it('SkillMapping count (scanning ESCO coverage) — 5 samples', async () => {
    for (let i = 0; i < 5; i++) {
      await time('skillMapping.count', () =>
        prisma.skillMapping.count({ where: { escoUri: { not: null } } })
      )
    }
    const s = summarize(timings.find(t => t.name === 'skillMapping.count')!.samples)
    expect(s.p95).toBeLessThan(1000)
  })

  it('User lookup by id — 10 samples (hot path for auth)', async () => {
    // Use a known user id — seed user, or skip if none. We just need a user row.
    const someUser = await prisma.user.findFirst({ select: { id: true } })
    if (!someUser) {
      console.warn('No users in DB — skipping user lookup bench')
      return
    }
    for (let i = 0; i < 10; i++) {
      await time('user.findUnique', () =>
        prisma.user.findUnique({ where: { id: someUser.id } })
      )
    }
    const s = summarize(timings.find(t => t.name === 'user.findUnique')!.samples)
    expect(s.p95).toBeLessThan(300)
  })

  it('CompanyProfile directory query — 5 samples', async () => {
    for (let i = 0; i < 5; i++) {
      await time('companyProfile.findMany', () =>
        prisma.companyProfile.findMany({
          where: { published: true },
          orderBy: { followerCount: 'desc' },
          take: 50,
        })
      )
    }
    const s = summarize(timings.find(t => t.name === 'companyProfile.findMany')!.samples)
    expect(s.p95).toBeLessThan(800)
  })

  it('Skill graph aggregation for a user — 5 samples', async () => {
    const student = await prisma.user.findFirst({
      where: { role: 'STUDENT' },
      select: { id: true },
    })
    if (!student) {
      console.warn('No students in DB — skipping skill graph bench')
      return
    }
    for (let i = 0; i < 5; i++) {
      await time('getCurrentSkillGraph', () => getCurrentSkillGraph(student.id))
    }
    const s = summarize(timings.find(t => t.name === 'getCurrentSkillGraph')!.samples)
    expect(s.p95).toBeLessThan(1500)
  })

  it('MatchExplanation read — 10 samples (cold + warm)', async () => {
    const expl = await prisma.matchExplanation.findFirst({ select: { id: true } })
    if (!expl) {
      console.warn('No MatchExplanations in DB — skipping read bench')
      return
    }
    for (let i = 0; i < 10; i++) {
      await time('matchExplanation.findUnique', () =>
        prisma.matchExplanation.findUnique({ where: { id: expl.id } })
      )
    }
    const s = summarize(timings.find(t => t.name === 'matchExplanation.findUnique')!.samples)
    expect(s.p95).toBeLessThan(300)
  })

  it('Active jobs scan (Talent Match candidate pool) — 3 samples', async () => {
    for (let i = 0; i < 3; i++) {
      await time('job.findMany_active', () =>
        prisma.job.findMany({
          where: { status: 'ACTIVE' },
          select: { id: true, requiredSkills: true },
          take: 200,
        })
      )
    }
    const s = summarize(timings.find(t => t.name === 'job.findMany_active')!.samples)
    expect(s.p95).toBeLessThan(2000)
  })
})
