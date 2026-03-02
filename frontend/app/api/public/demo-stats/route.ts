import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [jobCount, studentCount] = await Promise.all([
      prisma.job.count({ where: { isPublic: true, status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'STUDENT', profilePublic: true } }),
    ])

    return NextResponse.json(
      { jobCount, studentCount },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch {
    return NextResponse.json({ jobCount: 0, studentCount: 0 }, { status: 500 })
  }
}
