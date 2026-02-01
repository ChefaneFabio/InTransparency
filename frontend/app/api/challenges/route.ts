import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)
}

/**
 * GET /api/challenges
 * List challenges with filters
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)

    const status = searchParams.get('status')
    const discipline = searchParams.get('discipline')
    const type = searchParams.get('type')
    const recruiterId = searchParams.get('recruiterId')
    const universityId = searchParams.get('universityId')
    const isPublic = searchParams.get('isPublic')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}

    // Recruiters see their own challenges
    if (session?.user?.role === 'RECRUITER') {
      where.recruiterId = session.user.id
    } else if (isPublic === 'true') {
      where.isPublic = true
      where.status = { in: ['ACTIVE', 'IN_PROGRESS'] }
    }

    if (status) where.status = status
    if (discipline) where.discipline = discipline
    if (type) where.challengeType = type
    if (recruiterId && session?.user?.role === 'ADMIN') where.recruiterId = recruiterId

    // University filter - show challenges targeting their university
    if (universityId) {
      where.OR = [
        { targetUniversities: { isEmpty: true } },
        { targetUniversities: { has: universityId } }
      ]
    }

    const [challenges, total] = await Promise.all([
      prisma.companyChallenge.findMany({
        where,
        include: {
          recruiter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              company: true
            }
          },
          _count: {
            select: {
              submissions: true,
              universityApprovals: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.companyChallenge.count({ where })
    ])

    return NextResponse.json({
      challenges,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/challenges
 * Create a new challenge
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const {
      title,
      description,
      problemStatement,
      expectedOutcome,
      challengeType,
      discipline,
      requiredSkills,
      tools,
      teamSizeMin,
      teamSizeMax,
      estimatedDuration,
      startDate,
      endDate,
      applicationDeadline,
      targetCourses,
      targetSemesters,
      creditWorth,
      targetUniversities,
      maxSubmissions,
      mentorshipOffered,
      compensation,
      equipmentProvided,
      companyName,
      companyLogo,
      companyIndustry
    } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Get company info from user profile if not provided
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { company: true }
    })

    const challenge = await prisma.companyChallenge.create({
      data: {
        recruiterId: session.user.id,
        title,
        description,
        problemStatement,
        expectedOutcome,
        challengeType: challengeType || 'CAPSTONE',
        discipline: discipline || 'TECHNOLOGY',
        requiredSkills: requiredSkills || [],
        tools: tools || [],
        teamSizeMin: teamSizeMin || 1,
        teamSizeMax: teamSizeMax || 4,
        estimatedDuration,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        targetCourses: targetCourses || [],
        targetSemesters: targetSemesters || [],
        creditWorth,
        targetUniversities: targetUniversities || [],
        maxSubmissions: maxSubmissions || 10,
        mentorshipOffered: mentorshipOffered || false,
        compensation,
        equipmentProvided,
        companyName: companyName || user?.company || 'Company',
        companyLogo,
        companyIndustry,
        slug: generateSlug(title),
        status: 'DRAFT'
      },
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        }
      }
    })

    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}
