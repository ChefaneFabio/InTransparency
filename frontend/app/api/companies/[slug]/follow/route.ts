import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ slug: string }>
}

// POST /api/companies/[slug]/follow — student follows a company
export async function POST(_req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await ctx.params
  const profile = await prisma.companyProfile.findUnique({ where: { slug } })
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.companyFollow.upsert({
    where: {
      companyProfileId_userId: {
        companyProfileId: profile.id,
        userId: session.user.id,
      },
    },
    create: { companyProfileId: profile.id, userId: session.user.id },
    update: {},
  })

  const followerCount = await prisma.companyFollow.count({
    where: { companyProfileId: profile.id },
  })

  await prisma.companyProfile.update({
    where: { id: profile.id },
    data: { followerCount },
  })

  return NextResponse.json({ following: true, followerCount })
}

// DELETE /api/companies/[slug]/follow — unfollow
export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await ctx.params
  const profile = await prisma.companyProfile.findUnique({ where: { slug } })
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.companyFollow.deleteMany({
    where: { companyProfileId: profile.id, userId: session.user.id },
  })

  const followerCount = await prisma.companyFollow.count({
    where: { companyProfileId: profile.id },
  })

  await prisma.companyProfile.update({
    where: { id: profile.id },
    data: { followerCount },
  })

  return NextResponse.json({ following: false, followerCount })
}
