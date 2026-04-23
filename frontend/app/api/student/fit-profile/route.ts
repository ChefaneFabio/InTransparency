import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { emptyFitProfile, type FitProfile } from '@/lib/fit-profile'

/**
 * GET /api/student/fit-profile
 * Returns the authenticated student's fit profile (or an empty skeleton).
 *
 * PUT /api/student/fit-profile
 * Upsert the profile. Body accepts a partial FitProfile — merges with existing.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fitProfile: true, fitProfileUpdatedAt: true },
  })

  const profile = (user?.fitProfile as FitProfile | null) ?? emptyFitProfile()
  return NextResponse.json({
    profile,
    updatedAt: user?.fitProfileUpdatedAt?.toISOString() ?? null,
  })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as { profile?: Partial<FitProfile> }
  if (!body.profile || typeof body.profile !== 'object') {
    return NextResponse.json({ error: 'profile required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fitProfile: true },
  })
  const current = (existing?.fitProfile as FitProfile | null) ?? emptyFitProfile()
  const merged: FitProfile = {
    ...current,
    ...body.profile,
    // Arrays: if client sent them, replace — otherwise keep existing
    wishes: body.profile.wishes ?? current.wishes,
    dealBreakers: body.profile.dealBreakers ?? current.dealBreakers,
    motivations: body.profile.motivations ?? current.motivations,
    cultureFit: body.profile.cultureFit ?? current.cultureFit,
    positionTypes: body.profile.positionTypes ?? current.positionTypes,
    companySizes: body.profile.companySizes ?? current.companySizes,
    industries: body.profile.industries ?? current.industries,
    geographies: body.profile.geographies ?? current.geographies,
  }

  // Recompute completion: 8 core axes. Count axes that have ≥1 value (or non-empty string for goal/scope).
  const axes = [
    merged.goal.trim().length > 0,
    merged.scope.trim().length > 0,
    merged.motivations.length > 0,
    merged.cultureFit.length > 0,
    merged.positionTypes.length > 0,
    merged.companySizes.length > 0,
    merged.industries.length > 0,
    merged.geographies.length > 0,
  ]
  merged.completion = axes.filter(Boolean).length / axes.length

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      fitProfile: merged as any,
      fitProfileUpdatedAt: new Date(),
    },
  })

  return NextResponse.json({ profile: merged, updatedAt: new Date().toISOString() })
}
