import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { getExplanationForSubject } from '@/lib/match-explanation'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/match/[id]/why — student-facing "why was I matched?"
// AI Act Art. 86 + GDPR Art. 22 right-to-explanation endpoint
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const explanation = await getExplanationForSubject(id, session.user.id)
  if (!explanation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ explanation })
}
