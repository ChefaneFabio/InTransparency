/**
 * Integration test — engagement features: company follows, notifications.
 * These are the leading indicators of product-market fit.
 */

import { freshDbClient } from '../helpers/db'
const prisma = freshDbClient()

describe('Company follow counter (integration)', () => {
  let profileId: string
  let userId: string

  beforeAll(async () => {
    await prisma.$connect()
    const ts = Date.now()
    const profile = await prisma.companyProfile.create({
      data: {
        companyName: `TestCo ${ts}`,
        slug: `testco-${ts}`,
        published: true,
      },
    })
    profileId = profile.id
    const user = await prisma.user.create({
      data: {
        email: `test-follow-${ts}@intransparency.test`,
        passwordHash: '$2b$10$' + 'x'.repeat(53),
        role: 'STUDENT',
      },
    })
    userId = user.id
  })

  afterAll(async () => {
    await prisma.companyFollow.deleteMany({ where: { companyProfileId: profileId } }).catch(() => {})
    await prisma.companyProfile.delete({ where: { id: profileId } }).catch(() => {})
    await prisma.user.delete({ where: { id: userId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('increments and decrements follower count', async () => {
    // Follow
    await prisma.companyFollow.create({
      data: { companyProfileId: profileId, userId },
    })
    let count = await prisma.companyFollow.count({ where: { companyProfileId: profileId } })
    expect(count).toBe(1)

    // Duplicate follow blocked by unique constraint
    await expect(
      prisma.companyFollow.create({ data: { companyProfileId: profileId, userId } })
    ).rejects.toThrow()

    count = await prisma.companyFollow.count({ where: { companyProfileId: profileId } })
    expect(count).toBe(1)

    // Unfollow
    await prisma.companyFollow.deleteMany({ where: { companyProfileId: profileId, userId } })
    count = await prisma.companyFollow.count({ where: { companyProfileId: profileId } })
    expect(count).toBe(0)
  })
})

describe('Notification creation for matches (integration)', () => {
  let studentId: string

  beforeAll(async () => {
    const student = await prisma.user.create({
      data: {
        email: `test-notif-${Date.now()}@intransparency.test`,
        passwordHash: '$2b$10$' + 'x'.repeat(53),
        role: 'STUDENT',
      },
    })
    studentId = student.id
  })

  afterAll(async () => {
    await prisma.notification.deleteMany({ where: { userId: studentId } }).catch(() => {})
    await prisma.user.delete({ where: { id: studentId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('creates a MATCH_CREATED notification', async () => {
    const notif = await prisma.notification.create({
      data: {
        userId: studentId,
        type: 'MATCH_CREATED',
        title: 'You matched a role',
        body: 'Test body',
        link: '/matches/fake-id/why',
      },
    })
    expect(notif.read).toBe(false)
    expect(notif.type).toBe('MATCH_CREATED')
  })

  it('groupKey allows de-duplication at app-level', async () => {
    await prisma.notification.create({
      data: {
        userId: studentId,
        type: 'MATCH_CREATED',
        title: 'Unique match',
        body: 'Body',
        groupKey: 'match:unique-1',
      },
    })
    const count = await prisma.notification.count({
      where: { userId: studentId, groupKey: 'match:unique-1' },
    })
    expect(count).toBe(1)
  })
})
