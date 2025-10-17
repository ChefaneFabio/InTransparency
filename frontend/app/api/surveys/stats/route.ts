import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const surveyType = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause
    const where: any = {}
    if (surveyType) {
      where.surveyType = surveyType
    }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Get statistics
    const [
      totalResponses,
      studentCount,
      companyCount,
      universityCount,
      recentResponses,
      averageCompletionTime
    ] = await Promise.all([
      // Total responses
      prisma.surveyResponse.count({ where }),

      // Count by type
      prisma.surveyResponse.count({
        where: { ...where, surveyType: 'student' }
      }),
      prisma.surveyResponse.count({
        where: { ...where, surveyType: 'company' }
      }),
      prisma.surveyResponse.count({
        where: { ...where, surveyType: 'university' }
      }),

      // Recent responses (last 5)
      prisma.surveyResponse.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          surveyType: true,
          createdAt: true,
          completionTime: true
        }
      }),

      // Average completion time
      prisma.surveyResponse.aggregate({
        where: {
          ...where,
          completionTime: { not: null }
        },
        _avg: {
          completionTime: true
        }
      })
    ])

    // Get response rate by date (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const responsesByDate = await prisma.surveyResponse.groupBy({
      by: ['surveyType'],
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      _count: {
        _all: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        total: totalResponses,
        byType: {
          student: studentCount,
          company: companyCount,
          university: universityCount
        },
        recentResponses,
        averageCompletionTime: averageCompletionTime._avg.completionTime
          ? Math.round(averageCompletionTime._avg.completionTime / 1000)
          : null, // Convert to seconds
        responsesByType: responsesByDate.map((item: any) => ({
          type: item.surveyType,
          count: item._count._all
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching survey stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}