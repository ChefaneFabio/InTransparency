import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { generateDecisionPack } from '@/lib/decision-pack'

/**
 * POST /api/decision-pack/compare
 * Generates decision packs for multiple candidates for side-by-side comparison.
 * RECRUITER auth required. Max 3 candidates.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!user?.id || user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { candidateIds, jobId } = body

    if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
      return NextResponse.json(
        { error: 'candidateIds must be a non-empty array' },
        { status: 400 }
      )
    }

    if (candidateIds.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 candidates for comparison' },
        { status: 400 }
      )
    }

    // Generate packs in parallel
    const packs = await Promise.all(
      candidateIds.map((id: string) =>
        generateDecisionPack(user.id!, id, jobId).catch(() => null)
      )
    )

    const results = packs
      .filter((p) => p !== null)
      .map((pack) => ({
        ...pack,
      }))

    return NextResponse.json({ candidates: results })
  } catch (error) {
    console.error('Decision pack compare error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
