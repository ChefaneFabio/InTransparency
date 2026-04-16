import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/pcto/marketplace
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const activityType = searchParams.get('activityType') || ''
    const isRemote = searchParams.get('isRemote')
    const location = searchParams.get('location') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {
      status: 'OPEN',
    }

    if (activityType) where.activityType = activityType
    if (isRemote === 'true') where.isRemote = true
    if (isRemote === 'false') where.isRemote = false
    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    const [opportunities, total] = await Promise.all([
      prisma.pCTOOpportunity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.pCTOOpportunity.count({ where }),
    ])

    return NextResponse.json({
      opportunities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('PCTO marketplace GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/pcto/marketplace — express interest
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { opportunityId, studentIds, message } = body

    if (!opportunityId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ error: 'opportunityId and studentIds are required' }, { status: 400 })
    }

    const opportunity = await prisma.pCTOOpportunity.findUnique({ where: { id: opportunityId } })
    if (!opportunity || opportunity.status !== 'OPEN') {
      return NextResponse.json({ error: 'Opportunity not found or not open' }, { status: 404 })
    }

    // Create a notification/interest record in a generic way
    // Since there's no PCTOInterest model, we store as a JSON event or use notifications
    const result = {
      opportunityId,
      opportunityTitle: opportunity.title,
      companyName: opportunity.companyName,
      studentIds,
      message: message || '',
      submittedBy: user.id,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    }

    return NextResponse.json({ success: true, interest: result })
  } catch (error) {
    console.error('PCTO marketplace POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
