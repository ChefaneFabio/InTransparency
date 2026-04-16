import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/dashboard/recruiter/candidates/[id]/notes
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params

    const saved = await prisma.savedCandidate.findUnique({
      where: {
        recruiterId_candidateId: {
          recruiterId: session.user.id,
          candidateId: id,
        },
      },
      select: {
        notes: true,
        rating: true,
        tags: true,
        folder: true,
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            university: true,
            degree: true,
          },
        },
      },
    })

    if (!saved) {
      return NextResponse.json({
        notes: null,
        rating: null,
        tags: [],
        folder: null,
        candidate: null,
      })
    }

    return NextResponse.json({
      notes: saved.notes,
      rating: saved.rating,
      tags: saved.tags,
      folder: saved.folder,
      candidate: {
        name: [saved.candidate.firstName, saved.candidate.lastName].filter(Boolean).join(' '),
        email: saved.candidate.email,
        university: saved.candidate.university,
        degree: saved.candidate.degree,
      },
    })
  } catch (error) {
    console.error('Error fetching candidate notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/dashboard/recruiter/candidates/[id]/notes
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    const body = await req.json()
    const { notes, rating, tags } = body

    const saved = await prisma.savedCandidate.upsert({
      where: {
        recruiterId_candidateId: {
          recruiterId: session.user.id,
          candidateId: id,
        },
      },
      create: {
        recruiterId: session.user.id,
        candidateId: id,
        notes: notes || null,
        rating: rating !== undefined ? rating : null,
        tags: tags || [],
        folder: 'all',
      },
      update: {
        ...(notes !== undefined && { notes }),
        ...(rating !== undefined && { rating }),
        ...(tags !== undefined && { tags }),
      },
    })

    return NextResponse.json({
      success: true,
      notes: saved.notes,
      rating: saved.rating,
      tags: saved.tags,
    })
  } catch (error) {
    console.error('Error saving candidate notes:', error)
    return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 })
  }
}
