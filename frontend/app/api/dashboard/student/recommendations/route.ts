import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getTopJobsForStudent } from '@/lib/cross-segment-connections'

/**
 * GET /api/dashboard/student/recommendations
 * Returns personalized job recommendations based on student's skills and projects.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10')
    const recommendations = await getTopJobsForStudent(session.user.id, Math.min(limit, 50))

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Student recommendations error:', error)
    return NextResponse.json({ recommendations: [] })
  }
}
