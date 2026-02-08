import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/students
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const major = searchParams.get('major') || ''
    const year = searchParams.get('year') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {
      university: universityName,
      role: 'STUDENT',
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (major) where.degree = major
    if (year) where.graduationYear = year

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          degree: true,
          graduationYear: true,
          gpa: true,
          photo: true,
          profilePublic: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: {
              projects: true,
              applications: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    // Get aggregate stats
    const totalStudents = await prisma.user.count({
      where: { university: universityName, role: 'STUDENT' },
    })
    const verifiedStudents = await prisma.user.count({
      where: { university: universityName, role: 'STUDENT', emailVerified: true },
    })
    const activeProfiles = await prisma.user.count({
      where: { university: universityName, role: 'STUDENT', profilePublic: true },
    })

    // Get unique degrees for filter options
    const degrees = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT', degree: { not: null } },
      select: { degree: true },
      distinct: ['degree'],
    })

    const formattedStudents = students.map(s => ({
      id: s.id,
      name: [s.firstName, s.lastName].filter(Boolean).join(' ') || s.email,
      email: s.email,
      major: s.degree || '',
      year: s.graduationYear || '',
      gpa: s.gpa ? parseFloat(s.gpa) : null,
      projects: s._count.projects,
      applications: s._count.applications,
      verified: s.emailVerified,
      profilePublic: s.profilePublic,
      lastActive: s.lastLoginAt?.toISOString() || null,
      joinedAt: s.createdAt.toISOString(),
      avatar: s.firstName && s.lastName
        ? `${s.firstName[0]}${s.lastName[0]}`
        : s.email[0].toUpperCase(),
      photo: s.photo,
    }))

    return NextResponse.json({
      students: formattedStudents,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalStudents,
        verifiedStudents,
        activeProfiles,
      },
      filters: {
        degrees: degrees.map(d => d.degree).filter(Boolean),
      },
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
