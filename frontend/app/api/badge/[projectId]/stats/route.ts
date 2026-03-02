import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/badge/[projectId]/stats
 * Returns badge view/export counts for a project.
 * No auth required — counts are non-sensitive.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  const badge = await prisma.portableBadge.findFirst({
    where: { projectId },
    orderBy: { issuedAt: 'desc' },
    select: {
      viewCount: true,
      exportCount: true,
      issuedAt: true,
    },
  })

  if (!badge) {
    return NextResponse.json({ issued: false, viewCount: 0, exportCount: 0 })
  }

  return NextResponse.json({
    issued: true,
    viewCount: badge.viewCount,
    exportCount: badge.exportCount,
    issuedAt: badge.issuedAt,
  })
}

/**
 * POST /api/badge/[projectId]/stats
 * Increment export count.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  await prisma.portableBadge.updateMany({
    where: { projectId },
    data: { exportCount: { increment: 1 } },
  }).catch(() => { /* ignore if no badge record */ })

  return NextResponse.json({ success: true })
}
