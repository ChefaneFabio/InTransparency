import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/student/challenges
 * Browse available challenges for students
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'STUDENT' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const discipline = searchParams.get('discipline')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const studentUniversity = session.user.university

    // Build where clause - show active challenges from approved universities
    const where: Record<string, unknown> = {
      status: { in: ['ACTIVE', 'APPROVED'] },
      isPublic: true,
      applicationDeadline: {
        OR: [
          { equals: null },
          { gte: new Date() }
        ]
      }
    }

    // Filter by student's university (if set) or show all
    if (studentUniversity) {
      where.OR = [
        { targetUniversities: { isEmpty: true } },
        { targetUniversities: { has: studentUniversity } }
      ]
    }

    if (discipline) where.discipline = discipline
    if (type) where.challengeType = type

    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { companyName: { contains: search, mode: 'insensitive' } }
          ]
        }
      ]
    }

    const [challenges, total] = await Promise.all([
      prisma.companyChallenge.findMany({
        where,
        include: {
          recruiter: {
            select: {
              id: true,
              company: true
            }
          },
          universityApprovals: studentUniversity ? {
            where: {
              universityId: studentUniversity,
              status: 'APPROVED'
            },
            select: {
              courseName: true,
              courseCode: true,
              semester: true
            }
          } : false,
          submissions: {
            where: { studentId: session.user.id },
            select: {
              id: true,
              status: true
            }
          },
          _count: {
            select: { submissions: true }
          }
        },
        orderBy: [
          { applicationDeadline: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.companyChallenge.count({ where })
    ])

    // Format for frontend
    const formattedChallenges = challenges.map(c => ({
      ...c,
      hasApplied: c.submissions.length > 0,
      mySubmission: c.submissions[0] || null,
      spotsRemaining: c.maxSubmissions - c._count.submissions,
      isApprovedByMyUniversity: (c.universityApprovals as Array<unknown>)?.length > 0
    }))

    return NextResponse.json({
      challenges: formattedChallenges,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching student challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}
