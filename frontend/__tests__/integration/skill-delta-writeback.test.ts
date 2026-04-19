/**
 * Integration test — exercises the SkillDelta writeback pipeline against the
 * real Neon database. Creates an ephemeral test student + stage, calls the
 * writeback helper, asserts the deltas are persisted correctly, then cleans up.
 *
 * Run: npm run test:integration
 */

import { freshDbClient } from '../helpers/db'
import { writeStageDeltas, getCurrentSkillGraph } from '@/lib/skill-delta'
import libPrisma from '@/lib/prisma'

// The library internally uses the singleton at @/lib/prisma — we connect both
// so the test-owned client and the library-owned client are both live.
const prisma = freshDbClient()

describe('Stage → SkillDelta writeback (integration)', () => {
  let studentId: string
  let stageId: string

  beforeAll(async () => {
    await Promise.all([prisma.$connect(), libPrisma.$connect()])
    // Create ephemeral student
    const student = await prisma.user.create({
      data: {
        email: `test-skill-delta-${Date.now()}@intransparency.test`,
        passwordHash: '$2b$10$' + 'x'.repeat(53), // bcrypt-shaped string
        role: 'STUDENT',
        firstName: 'Test',
        lastName: 'SkillDelta',
        university: 'Test University',
      },
    })
    studentId = student.id

    const stage = await prisma.stageExperience.create({
      data: {
        studentId,
        universityName: 'Test University',
        companyName: 'Test Corp',
        role: 'Test Intern',
        startDate: new Date(),
        stageType: 'CURRICULARE',
        status: 'ACTIVE',
      },
    })
    stageId = stage.id
  })

  afterAll(async () => {
    // Best-effort cleanup
    await prisma.skillDelta.deleteMany({ where: { studentId } }).catch(() => {})
    await prisma.stageExperience.deleteMany({ where: { studentId } }).catch(() => {})
    await prisma.user.delete({ where: { id: studentId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('writes one SkillDelta per rated competency', async () => {
    const result = await writeStageDeltas({
      stageId,
      studentId,
      supervisorCompetencies: [
        { skill: 'Python', rating: 4 }, // Advanced
        { skill: 'Teamwork', rating: 5 }, // Expert
        { skill: 'Communication', rating: 3 }, // Intermediate
      ],
      supervisorName: 'Dr. Test',
      companyName: 'Test Corp',
      overallRating: 4,
    })
    expect(result.deltasCreated).toBe(3)
    expect(result.deltasSkipped).toBe(0)

    const deltas = await prisma.skillDelta.findMany({
      where: { studentId, source: 'STAGE', sourceId: stageId },
      orderBy: { skillTerm: 'asc' },
    })
    expect(deltas).toHaveLength(3)
    const python = deltas.find(d => d.skillTerm === 'Python')
    expect(python?.afterLevel).toBe(3) // rating 4 → Advanced
    expect(python?.evaluatorType).toBe('SUPERVISOR')
    expect(python?.confidence).toBeGreaterThanOrEqual(0.8)
  })

  it('is idempotent — re-running does not duplicate', async () => {
    const result = await writeStageDeltas({
      stageId,
      studentId,
      supervisorCompetencies: [
        { skill: 'Python', rating: 4 },
        { skill: 'Teamwork', rating: 5 },
      ],
      companyName: 'Test Corp',
    })
    expect(result.deltasCreated).toBe(0)
    expect(result.deltasSkipped).toBe(2)
  })

  it('resolves ESCO URIs for seeded skills (python)', async () => {
    const python = await prisma.skillDelta.findFirst({
      where: { studentId, skillTerm: 'Python' },
      select: { escoUri: true },
    })
    expect(python?.escoUri).toMatch(/^http:\/\/data\.europa\.eu\/esco\//)
  })

  it('getCurrentSkillGraph returns aggregated proficiency', async () => {
    const graph = await getCurrentSkillGraph(studentId)
    expect(graph.length).toBeGreaterThanOrEqual(3)
    const python = graph.find(g => g.skillTerm === 'Python')
    expect(python?.currentLevel).toBe(3)
    expect(python?.sourceCount).toBeGreaterThanOrEqual(1)
  })
})
