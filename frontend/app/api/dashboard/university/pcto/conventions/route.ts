import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/pcto/conventions
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const conventions = await prisma.pCTOConvention.findMany({
      where: { universityId: session.user.id },
      include: {
        activities: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ conventions })
  } catch (err: any) {
    console.error('[PCTO Conventions GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/pcto/conventions
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { companyName, companyContact, companyEmail, companyAddress, signedDate, expiryDate } =
      body

    if (!companyName) {
      return NextResponse.json({ error: 'companyName is required' }, { status: 400 })
    }

    const convention = await prisma.pCTOConvention.create({
      data: {
        universityId: session.user.id,
        companyName,
        companyContact: companyContact || null,
        companyEmail: companyEmail || null,
        companyAddress: companyAddress || null,
        signedDate: signedDate ? new Date(signedDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: signedDate ? 'ACTIVE' : 'DRAFT',
      },
    })

    return NextResponse.json(convention, { status: 201 })
  } catch (err: any) {
    console.error('[PCTO Conventions POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
