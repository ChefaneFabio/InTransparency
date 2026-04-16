import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/fast-track
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    // Get students from this institution
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        skills: true,
        createdAt: true,
      },
    })
    const studentIds = students.map((s) => s.id)

    // Get recent certificates for these students
    const certificates = await prisma.digitalCertificate.findMany({
      where: {
        studentId: { in: studentIds },
        status: 'ISSUED',
      },
      orderBy: { issueDate: 'desc' },
    })

    // Group certificates by student
    const certsByStudent: Record<string, any[]> = {}
    certificates.forEach((c) => {
      if (!certsByStudent[c.studentId]) certsByStudent[c.studentId] = []
      certsByStudent[c.studentId].push({
        id: c.id,
        title: c.title,
        issueDate: c.issueDate,
        credentialId: c.credentialId,
      })
    })

    // Build student cards
    const fastTrackStudents = students
      .filter((s) => {
        const certs = certsByStudent[s.id]
        return certs && certs.length > 0
      })
      .map((s) => {
        const certs = certsByStudent[s.id] || []
        const latestCert = certs[0]
        return {
          id: s.id,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Studente',
          email: s.email,
          skills: Array.isArray(s.skills) ? s.skills : [],
          certificates: certs,
          certificateCount: certs.length,
          availableSince: latestCert?.issueDate || s.createdAt,
        }
      })
      .sort((a, b) => new Date(b.availableSince).getTime() - new Date(a.availableSince).getTime())

    return NextResponse.json({
      students: fastTrackStudents,
      total: fastTrackStudents.length,
    })
  } catch (error) {
    console.error('Fast track GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
