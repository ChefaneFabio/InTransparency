import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/certificates
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const certificates = await prisma.digitalCertificate.findMany({
      where: { universityId: user.id },
      orderBy: { issueDate: 'desc' },
    })

    // Enrich with student names
    const studentIds = certificates.map((c) => c.studentId)
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, firstName: true, lastName: true, email: true },
    })
    const studentMap: Record<string, { name: string; email: string }> = {}
    students.forEach((s) => {
      studentMap[s.id] = {
        name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Studente',
        email: s.email,
      }
    })

    const enriched = certificates.map((c) => ({
      ...c,
      studentName: studentMap[c.studentId]?.name || 'Studente',
      studentEmail: studentMap[c.studentId]?.email || '',
    }))

    const stats = {
      total: certificates.length,
      issued: certificates.filter((c) => c.status === 'ISSUED').length,
      revoked: certificates.filter((c) => c.status === 'REVOKED').length,
      expired: certificates.filter((c) => c.status === 'EXPIRED').length,
    }

    return NextResponse.json({ certificates: enriched, stats })
  } catch (error) {
    console.error('Certificates GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/certificates — issue new certificate
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { studentId, title, description, courseId, expiryDate } = body

    if (!studentId || !title) {
      return NextResponse.json({ error: 'studentId and title are required' }, { status: 400 })
    }

    const certificate = await prisma.digitalCertificate.create({
      data: {
        studentId,
        universityId: user.id,
        title,
        description: description || null,
        courseId: courseId || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: 'ISSUED',
      },
    })

    return NextResponse.json({ success: true, certificate })
  } catch (error) {
    console.error('Certificates POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
