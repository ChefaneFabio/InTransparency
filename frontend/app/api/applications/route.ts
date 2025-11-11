import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/applications
 * List all applications (filtered by user role)
 * - Students see their own applications
 * - Recruiters see applications to their jobs
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const jobId = searchParams.get('jobId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause based on user role
    const where: any = {}

    if (session.user.role === 'STUDENT') {
      // Students see only their own applications
      where.applicantId = session.user.id
    } else if (session.user.role === 'RECRUITER') {
      // Recruiters see applications to their jobs
      where.job = {
        recruiterId: session.user.id
      }
    } else if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Invalid user role' },
        { status: 403 }
      )
    }

    // Add filters
    if (status) {
      where.status = status
    }

    if (jobId) {
      where.jobId = jobId
    }

    // Get applications with pagination
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              companyName: true,
              companyLogo: true,
              jobType: true,
              workLocation: true,
              location: true,
            }
          },
          applicant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              photo: true,
              university: true,
              degree: true,
              gpa: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where })
    ])

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error: any) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
