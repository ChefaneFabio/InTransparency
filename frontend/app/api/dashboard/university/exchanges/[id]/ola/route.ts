import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/dashboard/university/exchanges/[id]/ola
 *
 * Export an ExchangeEnrollment as an Erasmus+ Online Learning Agreement
 * (OLA) JSON document — the format exchanged over the European Student Card
 * (ESC) and EWP (Erasmus Without Paper) network.
 *
 * Spec references:
 *   - EWP Learning Agreement: https://developers.erasmuswithoutpaper.eu/
 *   - OLA exchange schema: https://www.learning-agreement.eu/
 *
 * We emit the core JSON structure here. Production OLA integration would
 * layer on XML envelope signing + EWP network registration — those require
 * per-university onboarding we don't do at runtime.
 */
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await ctx.params
  const exchange = await prisma.exchangeEnrollment.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          degree: true,
        },
      },
    },
  })
  if (!exchange) return NextResponse.json({ error: 'Exchange not found' }, { status: 404 })

  const universityName = user.company || user.university || ''
  const isHome = exchange.homeUniversityName === universityName
  const isHost = exchange.hostUniversityName === universityName
  if (!isHome && !isHost && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not a party to this exchange' }, { status: 403 })
  }

  const ola = {
    '@context': 'https://www.learning-agreement.eu/context.json',
    '@type': 'LearningAgreement',
    version: 'LA-EWP-2.0',
    status:
      exchange.status === 'COMPLETED'
        ? 'Final'
        : exchange.status === 'ACTIVE'
        ? 'InProgress'
        : 'Planned',
    academicYear: (() => {
      const y = exchange.startDate.getUTCFullYear()
      return `${y}/${(y + 1).toString().slice(-2)}`
    })(),
    student: {
      globalId: exchange.student.id,
      firstName: exchange.student.firstName,
      lastName: exchange.student.lastName,
      email: exchange.student.email,
      fieldOfStudy: exchange.student.degree,
    },
    mobility: {
      type: exchange.programType, // ERASMUS / BILATERAL / FREE_MOVER
      startDate: exchange.startDate.toISOString(),
      endDate: exchange.endDate?.toISOString() ?? null,
    },
    sendingInstitution: {
      name: exchange.homeUniversityName,
      country: exchange.homeCountry,
    },
    receivingInstitution: {
      name: exchange.hostUniversityName,
      country: exchange.hostCountry,
    },
    commitments: {
      sendingSignedAt: exchange.verifiedByHome ? exchange.updatedAt.toISOString() : null,
      receivingSignedAt: exchange.verifiedByHost ? exchange.updatedAt.toISOString() : null,
    },
    referenceOrigin: {
      platform: 'InTransparency',
      exchangeId: exchange.id,
      internalUrl: `https://www.in-transparency.com/api/agents/universities/exchange/${exchange.id}`,
    },
    _note:
      'This JSON is OLA-shaped for interoperability. To be valid on the EWP network, it must be wrapped in the signed XML envelope required by your institution\'s EWP-registered endpoint.',
  }

  return NextResponse.json(ola, {
    status: 200,
    headers: {
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Content-Disposition': `attachment; filename="ola-${exchange.id}.jsonld"`,
      'Cache-Control': 'private, no-cache',
    },
  })
}
