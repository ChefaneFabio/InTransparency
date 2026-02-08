import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/search/students
 * Search students with filters: search, university, skills, gpaMin, minProjects,
 * graduationYear, location, major. Supports pagination via page & limit.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const university = searchParams.get('university') || ''
    const skillsParam = searchParams.get('skills') || ''
    const gpaMinParam = searchParams.get('gpaMin') || ''
    const minProjectsParam = searchParams.get('minProjects') || ''
    const graduationYear = searchParams.get('graduationYear') || ''
    const location = searchParams.get('location') || ''
    const major = searchParams.get('major') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const skip = (page - 1) * limit

    // Parse skills into array
    const skills: string[] = skillsParam
      ? skillsParam.split(',').map(s => s.trim()).filter(Boolean)
      : []

    const gpaMin = gpaMinParam ? parseFloat(gpaMinParam) : null

    const minProjects = minProjectsParam ? parseInt(minProjectsParam, 10) : null

    // Build the where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      role: 'STUDENT',
      profilePublic: true,
    }

    // Text search across name/email/bio
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ]
    }

    // University filter (contains match)
    if (university) {
      where.university = { contains: university, mode: 'insensitive' }
    }

    // Major / degree filter (contains match)
    if (major) {
      where.degree = { contains: major, mode: 'insensitive' }
    }

    // Graduation year (exact match)
    if (graduationYear) {
      where.graduationYear = graduationYear
    }

    // Location filter - search across university field as proxy for location
    if (location) {
      // Location can be in the university field or the bio
      if (!where.OR) {
        where.university = { contains: location, mode: 'insensitive' }
      }
    }

    // Skills filter: find students who have projects with matching skills/technologies
    if (skills.length > 0) {
      where.projects = {
        some: {
          isPublic: true,
          OR: [
            { skills: { hasSome: skills } },
            { technologies: { hasSome: skills } },
          ],
        },
      }
    }

    // minProjects: filter users where project count >= minProjects
    if (minProjects !== null && minProjects > 0) {
      // We handle this with a having clause by fetching then filtering,
      // or by using a nested count condition
      if (!where.projects) {
        where.projects = {}
      }
      // Prisma doesn't support _count in where directly, so we'll post-filter
    }

    // For gpaMin, we'll also need to post-filter since gpa is stored as String
    // First, get a larger set if we need post-filtering
    const needsPostFilter = (gpaMin !== null) || (minProjects !== null && minProjects > 0)

    // If we need post-filtering, fetch more to compensate for filtered-out results
    const fetchLimit = needsPostFilter ? limit * 5 : limit
    const fetchSkip = needsPostFilter ? 0 : skip

    const [students, totalRaw] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          university: true,
          degree: true,
          graduationYear: true,
          gpa: true,
          gpaPublic: true,
          bio: true,
          tagline: true,
          photo: true,
          createdAt: true,
          subscriptionTier: true,
          _count: {
            select: { projects: true },
          },
          projects: {
            where: { isPublic: true },
            select: {
              id: true,
              title: true,
              technologies: true,
              skills: true,
              innovationScore: true,
            },
            orderBy: { innovationScore: 'desc' },
            take: 3,
          },
        },
        orderBy: [
          { projects: { _count: 'desc' } },
          { createdAt: 'desc' },
        ],
        take: needsPostFilter ? fetchLimit : limit,
        skip: fetchSkip,
      }),
      prisma.user.count({ where }),
    ])

    // Sort STUDENT_PREMIUM users first for priority in search results
    students.sort((a: any, b: any) => {
      const aPremium = a.subscriptionTier === 'STUDENT_PREMIUM' ? 1 : 0
      const bPremium = b.subscriptionTier === 'STUDENT_PREMIUM' ? 1 : 0
      if (bPremium !== aPremium) return bPremium - aPremium
      return 0
    })

    // Post-filter for gpaMin and minProjects
    let filtered = students

    if (gpaMin !== null) {
      filtered = filtered.filter(s => {
        if (!s.gpa) return false
        const gpaValue = parseFloat(s.gpa)
        return !isNaN(gpaValue) && gpaValue >= gpaMin
      })
    }

    if (minProjects !== null && minProjects > 0) {
      filtered = filtered.filter(s => s._count.projects >= minProjects)
    }

    // Calculate total after post-filtering
    let total = totalRaw
    if (needsPostFilter) {
      // For post-filtered queries, we need to estimate the total
      // If we post-filtered, count how many passed from our larger fetch
      const passRate = students.length > 0 ? filtered.length / students.length : 0
      total = Math.round(totalRaw * passRate)
    }

    // Apply pagination to post-filtered results
    const paginatedResults = needsPostFilter
      ? filtered.slice(skip, skip + limit)
      : filtered

    // Format the response
    const formattedStudents = paginatedResults.map(s => ({
      id: s.id,
      name: [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Anonymous',
      initials: getInitials(s.firstName, s.lastName),
      email: s.email,
      university: s.university || null,
      degree: s.degree || null,
      graduationYear: s.graduationYear || null,
      gpa: s.gpaPublic && s.gpa ? parseFloat(s.gpa) : null,
      bio: s.bio || null,
      tagline: s.tagline || null,
      photo: s.photo || null,
      projectCount: s._count.projects,
      isPremium: s.subscriptionTier === 'STUDENT_PREMIUM',
      topProjects: s.projects.map(p => ({
        id: p.id,
        title: p.title,
        technologies: p.technologies,
        innovationScore: p.innovationScore,
      })),
    }))

    return NextResponse.json({
      students: formattedStudents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error searching students:', error)
    return NextResponse.json(
      { error: 'Failed to search students' },
      { status: 500 }
    )
  }
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return (first + last).toUpperCase() || 'U'
}
