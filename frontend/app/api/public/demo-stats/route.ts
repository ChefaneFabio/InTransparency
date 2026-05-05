import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Public-facing stats — count REAL users only, never demo seeds.
    const [jobCount, studentCount] = await Promise.all([
      prisma.job.count({
        where: {
          isPublic: true,
          status: 'ACTIVE',
          recruiter: { isDemo: false },
        },
      }),
      prisma.user.count({
        where: { role: 'STUDENT', profilePublic: true, isDemo: false },
      }),
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
