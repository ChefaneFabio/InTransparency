import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// PATCH /api/dashboard/university/placements/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const placement = await prisma.placement.findFirst({
      where: { id: params.id, universityName },
    })

    if (!placement) {
      return NextResponse.json({ error: 'Placement not found' }, { status: 404 })
    }

    const body = await req.json()
    const updated = await prisma.placement.update({
      where: { id: params.id },
      data: {
        ...(body.companyName && { companyName: body.companyName }),
        ...(body.jobTitle && { jobTitle: body.jobTitle }),
        ...(body.jobType && { jobType: body.jobType }),
        ...(body.salaryAmount !== undefined && { salaryAmount: body.salaryAmount }),
        ...(body.status && { status: body.status }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
      },
    })

    return NextResponse.json({ placement: updated })
  } catch (error) {
    console.error('Error updating placement:', error)
    return NextResponse.json({ error: 'Failed to update placement' }, { status: 500 })
  }
}

// DELETE /api/dashboard/university/placements/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const placement = await prisma.placement.findFirst({
      where: { id: params.id, universityName },
    })

    if (!placement) {
      return NextResponse.json({ error: 'Placement not found' }, { status: 404 })
    }

    await prisma.placement.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting placement:', error)
    return NextResponse.json({ error: 'Failed to delete placement' }, { status: 500 })
  }
}
