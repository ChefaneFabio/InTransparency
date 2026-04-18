import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getExplanationForAudit } from '@/lib/match-explanation'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/match/[id]/audit — university/admin fairness audit view
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await ctx.params
  const explanation = await getExplanationForAudit(id)
  if (!explanation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Universities can only audit explanations for their own students
  if (user.role === 'UNIVERSITY') {
    const subject = await prisma.user.findUnique({
      where: { id: (await prisma.matchExplanation.findUnique({ where: { id } }))!.subjectId },
      select: { university: true },
    })
    if (subject?.university !== user.company) {
      return NextResponse.json({ error: 'Not your institution' }, { status: 403 })
    }
  }

  return NextResponse.json({ explanation })
}

// PATCH /api/match/[id]/audit — record human oversight decision
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await ctx.params
  const { reviewOutcome, reviewNotes } = await req.json()
  if (!['CONFIRMED', 'OVERRIDDEN', 'FLAGGED'].includes(reviewOutcome)) {
    return NextResponse.json({ error: 'Invalid reviewOutcome' }, { status: 400 })
  }

  await prisma.matchExplanation.update({
    where: { id },
    data: {
      reviewed: true,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
      reviewOutcome,
      reviewNotes: reviewNotes ?? null,
    },
  })

  return NextResponse.json({ success: true })
}
