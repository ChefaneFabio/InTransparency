import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/professor/stats — professor dashboard statistics
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, role: true },
    })

    if (!user || user.role !== 'PROFESSOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const professorEmail = user.email

    const [totalEndorsements, pendingRequests, verifiedCount, declinedCount] = await Promise.all([
      prisma.professorEndorsement.count({ where: { professorEmail } }),
      prisma.professorEndorsement.count({ where: { professorEmail, status: 'PENDING' } }),
      prisma.professorEndorsement.count({ where: { professorEmail, status: 'VERIFIED' } }),
      prisma.professorEndorsement.count({ where: { professorEmail, status: 'DECLINED' } }),
    ])

    // Average rating from verified endorsements
    const ratingAgg = await prisma.professorEndorsement.aggregate({
      where: { professorEmail, status: 'VERIFIED', rating: { not: null } },
      _avg: { rating: true },
    })

    // Count distinct students endorsed
    const distinctStudents = await prisma.professorEndorsement.findMany({
      where: { professorEmail, status: 'VERIFIED' },
      select: { studentId: true },
      distinct: ['studentId'],
    })

    return NextResponse.json({
      totalEndorsements,
      pendingRequests,
      verifiedCount,
      declinedCount,
      averageRating: ratingAgg._avg.rating || 0,
      studentsEndorsed: distinctStudents.length,
    })
  } catch (error) {
    console.error('Error fetching professor stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
