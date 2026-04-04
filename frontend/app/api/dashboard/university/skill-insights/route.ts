import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getSkillGapInsights } from '@/lib/cross-segment-connections'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/skill-insights
 * Returns skill gap insights comparing student skills vs market demand.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get university name from settings
    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
      select: { name: true },
    })

    const universityName = settings?.name || ''
    if (!universityName) {
      return NextResponse.json({ insights: [], message: 'Set up your institution profile first.' })
    }

    const insights = await getSkillGapInsights(universityName)

    return NextResponse.json({ insights, universityName })
  } catch (error) {
    console.error('Skill insights error:', error)
    return NextResponse.json({ insights: [] })
  }
}
