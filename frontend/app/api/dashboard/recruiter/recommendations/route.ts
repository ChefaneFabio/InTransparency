import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getTopTalentForRecruiter } from '@/lib/cross-segment-connections'

/**
 * GET /api/dashboard/recruiter/recommendations
 * Returns AI-powered talent recommendations based on recruiter's active jobs.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10')
    const recommendations = await getTopTalentForRecruiter(session.user.id, Math.min(limit, 50))

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Recruiter recommendations error:', error)
    return NextResponse.json({ recommendations: [] })
  }
}
