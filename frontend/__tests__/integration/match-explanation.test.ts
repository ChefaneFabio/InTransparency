/**
 * Integration test — MatchExplanation persistence.
 * Proves we can audit every match (AI Act requirement).
 */

import { freshDbClient } from '../helpers/db'
import { persistMatchExplanation, getExplanationForSubject } from '@/lib/match-explanation'

// Integration test uses an explicit client so Neon's serverless pooler doesn't
// drop the connection between unrelated suites.
const prisma = freshDbClient()

describe('MatchExplanation persistence (integration)', () => {
  let studentId: string
  let recruiterId: string
  let explanationId: string

  beforeAll(async () => {
    const ts = Date.now()
    const student = await prisma.user.create({
      data: {
        email: `test-match-student-${ts}@intransparency.test`,
        passwordHash: '$2b$10$' + 'x'.repeat(53),
        role: 'STUDENT',
        firstName: 'Test',
        lastName: 'Student',
      },
    })
    const recruiter = await prisma.user.create({
      data: {
        email: `test-match-recruiter-${ts}@intransparency.test`,
        passwordHash: '$2b$10$' + 'x'.repeat(53),
        role: 'RECRUITER',
        company: 'Test Hiring Co',
      },
    })
    studentId = student.id
    recruiterId = recruiter.id
  })

  afterAll(async () => {
    await prisma.matchExplanation.deleteMany({
      where: { OR: [{ subjectId: studentId }, { counterpartyId: recruiterId }] },
    }).catch(() => {})
    await prisma.user.delete({ where: { id: studentId } }).catch(() => {})
    await prisma.user.delete({ where: { id: recruiterId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('persists a match with all factors', async () => {
    const result = await persistMatchExplanation({
      subjectId: studentId,
      subjectType: 'STUDENT',
      counterpartyId: recruiterId,
      counterpartyType: 'RECRUITER',
      contextType: 'GENERIC',
      matchScore: 85,
      factors: [
        {
          name: 'requiredSkills',
          category: 'skills',
          weight: 40,
          value: '3 of 3 matched',
          contribution: 40,
          evidence: [{ type: 'skill', label: 'Python' }],
          humanReason: 'All required skills matched',
        },
      ],
      inputSnapshot: { requiredSkills: ['Python', 'SQL', 'React'] },
    })
    explanationId = result.id
    expect(result.matchScore).toBe(85)
    expect(result.decisionLabel).toBe('STRONG_MATCH')
    expect(result.modelVersion).toMatch(/talent-match-v/)
  })

  it('retrieves explanation for the subject (right-to-explanation)', async () => {
    const viewed = await getExplanationForSubject(explanationId, studentId)
    expect(viewed).not.toBeNull()
    expect(viewed!.matchScore).toBe(85)
    expect(viewed!.factors).toHaveLength(1)
  })

  it('marks subjectViewed on first read', async () => {
    const record = await prisma.matchExplanation.findUnique({ where: { id: explanationId } })
    expect(record?.subjectViewed).toBe(true)
    expect(record?.subjectViewedAt).not.toBeNull()
  })

  it('refuses to return explanation for a different subject', async () => {
    const notForUs = await getExplanationForSubject(explanationId, recruiterId)
    expect(notForUs).toBeNull()
  })
})
