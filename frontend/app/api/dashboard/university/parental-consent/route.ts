import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/parental-consent
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get students belonging to this institution
    const universityName = user.company || ''
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true, firstName: true, lastName: true },
    })
    const studentIds = students.map((s) => s.id)

    const consents = await prisma.parentalConsent.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: { requestedAt: 'desc' },
    })

    const studentMap: Record<string, string> = {}
    students.forEach((s) => {
      studentMap[s.id] = `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Studente'
    })

    const enriched = consents.map((c) => ({
      ...c,
      studentName: studentMap[c.studentId] || 'Studente',
    }))

    const stats = {
      total: consents.length,
      pending: consents.filter((c) => c.status === 'PENDING').length,
      granted: consents.filter((c) => c.status === 'GRANTED').length,
      denied: consents.filter((c) => c.status === 'DENIED').length,
      expired: consents.filter((c) => c.status === 'EXPIRED').length,
    }

    return NextResponse.json({ consents: enriched, stats, students })
  } catch (error) {
    console.error('Parental consent GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/parental-consent — send consent request
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { studentId, parentEmail, parentName, consentType } = body

    if (!studentId || !parentEmail || !consentType) {
      return NextResponse.json({ error: 'studentId, parentEmail, and consentType are required' }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90)

    const consent = await prisma.parentalConsent.create({
      data: {
        studentId,
        parentEmail,
        parentName: parentName || null,
        consentType,
        status: 'PENDING',
        expiresAt,
      },
    })

    return NextResponse.json({ success: true, consent })
  } catch (error) {
    console.error('Parental consent POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
