import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/techpark/stats
 * Returns high-level stats for the tech park dashboard.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'TECHPARK' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [settings, totalStudents, recruiterActivity, placements] = await Promise.all([
      prisma.techParkSettings.findUnique({ where: { userId } }),
      prisma.user.count({ where: { role: 'STUDENT', profilePublic: true } }),
      prisma.contactUsage.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.placement.count({ where: { status: 'CONFIRMED' } }),
    ])

    return NextResponse.json({
      parkName: settings?.parkName || '',
      memberCompanyCount: settings?.memberCompanyCount || 0,
      totalStudents,
      recruiterActivity,
      placements,
    })
  } catch (error) {
    console.error('Error fetching techpark stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
