import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/internship-tracker
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId') || undefined
    const dateFrom = searchParams.get('dateFrom') || undefined
    const dateTo = searchParams.get('dateTo') || undefined
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    // Build where clause
    const where: Record<string, unknown> = { universityId: user.id }
    if (studentId) where.studentId = studentId
    if (status) where.status = status
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom)
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo)
    }

    const logs = await prisma.internshipLog.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 200,
    })

    // Enrich with student names
    const studentIds = Array.from(new Set(logs.map((l) => l.studentId)))
    const students = studentIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: studentIds } },
          select: { id: true, firstName: true, lastName: true },
        })
      : []
    const studentMap = new Map(students.map((s) => [s.id, s]))

    let enrichedLogs = logs.map((log) => {
      const student = studentMap.get(log.studentId)
      return {
        ...log,
        studentName: student ? `${student.firstName || ''} ${student.lastName || ''}`.trim() : 'Sconosciuto',
      }
    })

    // Client-side search by student name
    if (search) {
      const q = search.toLowerCase()
      enrichedLogs = enrichedLogs.filter((l) => l.studentName.toLowerCase().includes(q))
    }

    // Summary stats
    const allLogs = await prisma.internshipLog.findMany({
      where: { universityId: user.id },
      select: { hoursWorked: true, status: true, supervisorRating: true, studentId: true },
    })

    const totalHours = allLogs.reduce((sum, l) => sum + l.hoursWorked, 0)
    const uniqueStudents = new Set(allLogs.map((l) => l.studentId))
    const studentCount = uniqueStudents.size
    const presentCount = allLogs.filter((l) => l.status === 'PRESENT' || l.status === 'LATE').length
    const attendanceRate = allLogs.length > 0 ? Math.round((presentCount / allLogs.length) * 100) : 0
    const ratings = allLogs.filter((l) => l.supervisorRating != null).map((l) => l.supervisorRating as number)
    const avgRating = ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0

    return NextResponse.json({
      logs: enrichedLogs,
      summary: {
        totalHours: Math.round(totalHours * 10) / 10,
        attendanceRate,
        avgRating,
        studentCount,
        totalLogs: allLogs.length,
      },
    })
  } catch (error) {
    console.error('Internship tracker GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/internship-tracker
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { studentId, companyName, date, hoursWorked, activity, location, supervisorName, supervisorEmail, supervisorRating, supervisorNotes, studentNotes, status } = body

    // Validate required fields
    if (!studentId || !companyName || !date || hoursWorked == null) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: studentId, companyName, date, hoursWorked' },
        { status: 400 }
      )
    }

    if (typeof hoursWorked !== 'number' || hoursWorked < 0 || hoursWorked > 24) {
      return NextResponse.json({ error: 'hoursWorked deve essere tra 0 e 24' }, { status: 400 })
    }

    const validStatuses = ['PRESENT', 'ABSENT', 'EXCUSED', 'LATE']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Status non valido. Valori ammessi: ${validStatuses.join(', ')}` }, { status: 400 })
    }

    const log = await prisma.internshipLog.create({
      data: {
        studentId,
        universityId: user.id,
        companyName,
        date: new Date(date),
        hoursWorked,
        activity: activity || null,
        location: location || null,
        supervisorName: supervisorName || null,
        supervisorEmail: supervisorEmail || null,
        supervisorRating: supervisorRating != null ? Number(supervisorRating) : null,
        supervisorNotes: supervisorNotes || null,
        studentNotes: studentNotes || null,
        status: status || 'PRESENT',
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Internship tracker POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
