import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/followers
 * Returns the students who have followed the recruiter's CompanyProfile.
 * This is the inbound-interest signal that turns discovery into leads.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const companyName = user.company
  if (!companyName) {
    return NextResponse.json({
      followers: [],
      total: 0,
      newThisWeek: 0,
      profile: null,
    })
  }

  const profile = await prisma.companyProfile.findUnique({
    where: { companyName },
    select: { id: true, companyName: true, slug: true, followerCount: true, published: true },
  })

  if (!profile) {
    return NextResponse.json({
      followers: [],
      total: 0,
      newThisWeek: 0,
      profile: null,
    })
  }

  const follows = await prisma.companyFollow.findMany({
    where: { companyProfileId: profile.id },
    orderBy: { followedAt: 'desc' },
    take: 200,
  })

  const userIds = follows.map(f => f.userId)
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      photo: true,
      university: true,
      degree: true,
      graduationYear: true,
      location: true,
      skills: true,
      role: true,
    },
  })
  const userMap = new Map(users.map(u => [u.id, u]))

  const weekAgo = Date.now() - 7 * 86400000
  const newThisWeek = follows.filter(f => f.followedAt.getTime() >= weekAgo).length

  return NextResponse.json({
    followers: follows.map(f => {
      const u = userMap.get(f.userId)
      return {
        id: f.id,
        userId: f.userId,
        name: u ? [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email : 'Unknown',
        email: u?.email,
        photo: u?.photo,
        university: u?.university,
        degree: u?.degree,
        graduationYear: u?.graduationYear,
        location: u?.location,
        topSkills: u?.skills?.slice(0, 5) ?? [],
        role: u?.role,
        followedAt: f.followedAt.toISOString(),
        daysSinceFollow: Math.floor((Date.now() - f.followedAt.getTime()) / 86400000),
      }
    }),
    total: follows.length,
    newThisWeek,
    profile,
  })
}
