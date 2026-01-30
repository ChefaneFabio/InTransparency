import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/university/students - List students for a university
export async function GET(request: NextRequest) {
  try {
    // Get university from API key or session
    const apiKey = request.headers.get('x-api-key')
    const universityId = request.headers.get('x-university-id')

    let university

    if (apiKey) {
      university = await prisma.university.findUnique({
        where: { apiKey }
      })
    } else if (universityId) {
      university = await prisma.university.findUnique({
        where: { id: universityId }
      })
    }

    if (!university) {
      return NextResponse.json(
        { error: 'University not authenticated' },
        { status: 401 }
      )
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const program = searchParams.get('program') || ''

    // Build where clause
    const where: any = {
      universityId: university.id
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.status = status
    }

    if (program) {
      where.program = { contains: program, mode: 'insensitive' }
    }

    // Query students
    const [students, total] = await Promise.all([
      prisma.universityStudent.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          studentId: true,
          email: true,
          firstName: true,
          lastName: true,
          program: true,
          department: true,
          year: true,
          status: true,
          userId: true,
          claimedAt: true,
          verifiedAt: true,
          createdAt: true
        }
      }),
      prisma.universityStudent.count({ where })
    ])

    // Get stats
    const stats = await prisma.universityStudent.groupBy({
      by: ['status'],
      where: { universityId: university.id },
      _count: { status: true }
    })

    const statusCounts = stats.reduce((acc, s) => {
      acc[s.status] = s._count.status
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        total,
        imported: statusCounts['IMPORTED'] || 0,
        invited: statusCounts['INVITED'] || 0,
        claimed: statusCounts['CLAIMED'] || 0,
        verified: statusCounts['VERIFIED'] || 0,
        inactive: statusCounts['INACTIVE'] || 0
      }
    })

  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST /api/university/students - Add a single student
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const universityId = request.headers.get('x-university-id')

    let university

    if (apiKey) {
      university = await prisma.university.findUnique({
        where: { apiKey }
      })
    } else if (universityId) {
      university = await prisma.university.findUnique({
        where: { id: universityId }
      })
    }

    if (!university) {
      return NextResponse.json(
        { error: 'University not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, firstName, lastName, studentId, program, department, year } = body

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'email, firstName, and lastName are required' },
        { status: 400 }
      )
    }

    // Check if already exists
    const existing = await prisma.universityStudent.findFirst({
      where: {
        universityId: university.id,
        OR: [{ email }, { studentId: studentId || '' }]
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Student with this email or ID already exists' },
        { status: 409 }
      )
    }

    const crypto = require('crypto')
    const inviteToken = crypto.randomBytes(16).toString('hex')

    const student = await prisma.universityStudent.create({
      data: {
        universityId: university.id,
        email,
        firstName,
        lastName,
        studentId: studentId || email.split('@')[0],
        program,
        department,
        year: year ? parseInt(year) : null,
        inviteToken,
        status: 'IMPORTED'
      }
    })

    // Update count
    await prisma.university.update({
      where: { id: university.id },
      data: { studentCount: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      message: 'Student added successfully',
      student: {
        id: student.id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        status: student.status
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding student:', error)
    return NextResponse.json(
      { error: 'Failed to add student' },
      { status: 500 }
    )
  }
}
