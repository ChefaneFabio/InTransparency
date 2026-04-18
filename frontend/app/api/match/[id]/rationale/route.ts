import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { getExplanationForRecruiter } from '@/lib/match-explanation'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/match/[id]/rationale — recruiter-facing evidence-based rationale
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const explanation = await getExplanationForRecruiter(id, session.user.id)
  if (!explanation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ explanation })
}
