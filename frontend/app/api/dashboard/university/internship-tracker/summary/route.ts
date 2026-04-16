import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/internship-tracker/summary
// Per-student aggregation
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const logs = await prisma.internshipLog.findMany({
      where: { universityId: user.id },
      select: {
        studentId: true,
        hoursWorked: true,
        status: true,
        supervisorRating: true,
        date: true,
        companyName: true,
      },
      orderBy: { date: 'desc' },
    })

    // Aggregate per student
    const studentAgg = new Map<string, {
      totalHours: number
      daysPresent: number
      daysAbsent: number
      daysExcused: number
      daysLate: number
      ratings: number[]
      lastLogDate: Date | null
      companyName: string
    }>()

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      const existing = studentAgg.get(log.studentId)
      if (!existing) {
        studentAgg.set(log.studentId, {
          totalHours: log.hoursWorked,
          daysPresent: log.status === 'PRESENT' ? 1 : 0,
          daysAbsent: log.status === 'ABSENT' ? 1 : 0,
          daysExcused: log.status === 'EXCUSED' ? 1 : 0,
          daysLate: log.status === 'LATE' ? 1 : 0,
          ratings: log.supervisorRating != null ? [log.supervisorRating] : [],
          lastLogDate: log.date,
          companyName: log.companyName,
        })
      } else {
        existing.totalHours += log.hoursWorked
        if (log.status === 'PRESENT') existing.daysPresent++
        else if (log.status === 'ABSENT') existing.daysAbsent++
        else if (log.status === 'EXCUSED') existing.daysExcused++
        else if (log.status === 'LATE') existing.daysLate++
        if (log.supervisorRating != null) existing.ratings.push(log.supervisorRating)
        if (!existing.lastLogDate || log.date > existing.lastLogDate) {
          existing.lastLogDate = log.date
        }
      }
    }

    // Fetch student names
    const studentIds = Array.from(studentAgg.keys())
    const students = studentIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: studentIds } },
          select: { id: true, firstName: true, lastName: true },
        })
      : []
    const studentMap = new Map(students.map((s) => [s.id, s]))

    const summaries = Array.from(studentAgg.entries()).map(([studentId, agg]) => {
      const student = studentMap.get(studentId)
      const avgRating = agg.ratings.length > 0
        ? Math.round((agg.ratings.reduce((a, b) => a + b, 0) / agg.ratings.length) * 10) / 10
        : null
      const totalDays = agg.daysPresent + agg.daysAbsent + agg.daysExcused + agg.daysLate
      const attendanceRate = totalDays > 0
        ? Math.round(((agg.daysPresent + agg.daysLate) / totalDays) * 100)
        : 0

      return {
        studentId,
        studentName: student ? `${student.firstName || ''} ${student.lastName || ''}`.trim() : 'Sconosciuto',
        companyName: agg.companyName,
        totalHours: Math.round(agg.totalHours * 10) / 10,
        daysPresent: agg.daysPresent,
        daysAbsent: agg.daysAbsent,
        daysExcused: agg.daysExcused,
        daysLate: agg.daysLate,
        totalDays,
        attendanceRate,
        avgSupervisorRating: avgRating,
        lastLogDate: agg.lastLogDate?.toISOString() || null,
      }
    })

    // Sort by totalHours descending
    summaries.sort((a, b) => b.totalHours - a.totalHours)

    return NextResponse.json({ summaries })
  } catch (error) {
    console.error('Internship tracker summary GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
