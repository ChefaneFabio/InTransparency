import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/exchanges
 *
 * Returns exchange enrollments + institution partnerships for a university,
 * split by "outbound" (home is us) and "inbound" (host is us). Powers the
 * cross-border Erasmus dashboard — P5.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const universityName = user.company || user.university || ''
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const baseWhere: any = {}
  if (status) baseWhere.status = status

  const [outbound, inbound] = await Promise.all([
    prisma.exchangeEnrollment.findMany({
      where: { ...baseWhere, homeUniversityName: universityName },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true, photo: true, degree: true } },
        partnership: true,
      },
      orderBy: { startDate: 'desc' },
    }),
    prisma.exchangeEnrollment.findMany({
      where: { ...baseWhere, hostUniversityName: universityName },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true, photo: true, degree: true } },
        partnership: true,
      },
      orderBy: { startDate: 'desc' },
    }),
  ])

  // Partnerships live on UniversitySettings — join via either side.
  const settings = await prisma.universitySettings.findFirst({
    where: { name: universityName },
    select: { id: true },
  })
  const partnerships = settings
    ? await prisma.institutionPartnership.findMany({
        where: {
          OR: [{ institutionAId: settings.id }, { institutionBId: settings.id }],
        },
        include: {
          institutionA: { select: { name: true } },
          institutionB: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const byCountryOut: Record<string, number> = {}
  const byCountryIn: Record<string, number> = {}
  for (const o of outbound) {
    byCountryOut[o.hostCountry] = (byCountryOut[o.hostCountry] ?? 0) + 1
  }
  for (const i of inbound) {
    byCountryIn[i.homeCountry] = (byCountryIn[i.homeCountry] ?? 0) + 1
  }

  return NextResponse.json({
    universityName,
    stats: {
      totalOutbound: outbound.length,
      totalInbound: inbound.length,
      activePartnerships: partnerships.filter(p => p.status === 'ACTIVE').length,
      byCountryOut,
      byCountryIn,
    },
    outbound: outbound.map(o => ({
      id: o.id,
      student: {
        id: o.student.id,
        name: [o.student.firstName, o.student.lastName].filter(Boolean).join(' '),
        email: o.student.email,
        photo: o.student.photo,
        degree: o.student.degree,
      },
      hostUniversityName: o.hostUniversityName,
      hostCountry: o.hostCountry,
      programType: o.programType,
      startDate: o.startDate.toISOString(),
      endDate: o.endDate?.toISOString() ?? null,
      status: o.status,
      verifiedByHome: o.verifiedByHome,
      verifiedByHost: o.verifiedByHost,
    })),
    inbound: inbound.map(i => ({
      id: i.id,
      student: {
        id: i.student.id,
        name: [i.student.firstName, i.student.lastName].filter(Boolean).join(' '),
        email: i.student.email,
        photo: i.student.photo,
        degree: i.student.degree,
      },
      homeUniversityName: i.homeUniversityName,
      homeCountry: i.homeCountry,
      programType: i.programType,
      startDate: i.startDate.toISOString(),
      endDate: i.endDate?.toISOString() ?? null,
      status: i.status,
      verifiedByHome: i.verifiedByHome,
      verifiedByHost: i.verifiedByHost,
    })),
    partnerships: partnerships.map(p => {
      const isA = p.institutionA.name === universityName
      const partnerName = isA ? p.institutionB.name : p.institutionA.name
      return {
        id: p.id,
        partnerName,
        exchangeType: p.exchangeType,
        status: p.status,
        maxStudents: p.maxStudents,
        startDate: p.startDate?.toISOString() ?? null,
        endDate: p.endDate?.toISOString() ?? null,
      }
    }),
  })
}
