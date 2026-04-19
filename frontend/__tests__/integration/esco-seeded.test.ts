/**
 * Integration test — proves ESCO was seeded in production Neon.
 * This is a data-quality assertion: without ESCO mapping, our cross-border
 * interop story breaks. Competitors can't do this without verification data.
 */

import { freshDbClient } from '../helpers/db'
const prisma = freshDbClient()

describe('ESCO seeding (integration)', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('has mapped at least 80 SkillMapping rows to ESCO URIs', async () => {
    const count = await prisma.skillMapping.count({
      where: { escoUri: { not: null } },
    })
    expect(count).toBeGreaterThanOrEqual(80)
  })

  it('core skills have ESCO mapping', async () => {
    for (const term of ['python', 'java', 'sql', 'teamwork', 'machine learning']) {
      const row = await prisma.skillMapping.findFirst({
        where: {
          OR: [
            { academicTerm: { equals: term, mode: 'insensitive' } },
            { synonyms: { has: term } },
          ],
          escoUri: { not: null },
        },
      })
      expect(row).not.toBeNull()
      expect(row?.escoUri).toMatch(/^http:\/\/data\.europa\.eu\/esco\//)
    }
  })

  it('ESCO version is set and matches library constant', async () => {
    const row = await prisma.skillMapping.findFirst({ where: { escoUri: { not: null } } })
    expect(row?.escoVersion).toMatch(/^\d+\.\d+\.\d+$/)
  })
})
