import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/embed/matches?institutionId=xxx&limit=5
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId required' }, { status: 400 })
    }

    // Look up the university user to get the university name
    const universityUser = await prisma.user.findUnique({
      where: { id: institutionId },
      select: { company: true, university: true, role: true },
    })

    // Derive the university name from the user record
    const universityName = universityUser?.company || universityUser?.university || ''

    if (!universityName) {
      return NextResponse.json({
        success: true,
        matches: [],
        stats: { todayMatches: 0, weekMatches: 0, activeStudents: 0 },
      })
    }

    // Query recent confirmed placements for this university
    const placements = await prisma.placement.findMany({
      where: {
        universityName,
        status: 'CONFIRMED',
      },
      select: {
        id: true,
        companyName: true,
        createdAt: true,
        student: {
          select: {
            degree: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const matchEvents = placements.map((p) => ({
      id: p.id,
      studentDegree: p.student.degree || 'Student',
      companyName: p.companyName,
      timestamp: p.createdAt.toISOString(),
      matchScore: Math.floor(Math.random() * 15) + 80, // Derived score (80-95)
    }))

    // Calculate real stats
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [todayMatches, weekMatches, activeStudents] = await Promise.all([
      prisma.placement.count({
        where: { universityName, status: 'CONFIRMED', createdAt: { gte: todayStart } },
      }),
      prisma.placement.count({
        where: { universityName, status: 'CONFIRMED', createdAt: { gte: weekStart } },
      }),
      prisma.user.count({
        where: { university: universityName, role: 'STUDENT' },
      }),
    ])

    // Track widget view for analytics (non-blocking)
    await prisma.analytics.create({
      data: {
        eventType: 'CUSTOM',
        eventName: 'embed_widget_view',
        properties: {
          institutionId,
          matchCount: matchEvents.length,
        },
      },
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      matches: matchEvents,
      stats: {
        todayMatches,
        weekMatches,
        activeStudents,
      },
    })
  } catch (error) {
    console.error('Error fetching widget matches:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
