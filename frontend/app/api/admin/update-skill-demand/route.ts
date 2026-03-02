import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * POST /api/admin/update-skill-demand
 * Scans all active Jobs, counts skill frequency, updates SkillMapping.demandScore.
 * Admin-only endpoint.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: string } | undefined
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all active jobs and their skills
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE' },
      select: { requiredSkills: true, preferredSkills: true },
    })

    // Count skill frequency
    const skillCounts = new Map<string, number>()
    for (const job of jobs) {
      const allSkills = [...job.requiredSkills, ...job.preferredSkills]
      for (const skill of allSkills) {
        const lower = skill.toLowerCase().trim()
        skillCounts.set(lower, (skillCounts.get(lower) || 0) + 1)
      }
    }

    // Find max for normalization
    let maxCount = 1
    const entries = Array.from(skillCounts.entries())
    for (const [, count] of entries) {
      if (count > maxCount) maxCount = count
    }

    // Update SkillMapping demandScores
    let updated = 0
    const allMappings = await prisma.skillMapping.findMany({
      select: { id: true, academicTerm: true, industryTerms: true, synonyms: true },
    })

    for (const mapping of allMappings) {
      // Check all terms for matches
      const allTerms = [mapping.academicTerm, ...mapping.industryTerms, ...mapping.synonyms]
      let totalCount = 0
      for (const term of allTerms) {
        totalCount += skillCounts.get(term.toLowerCase().trim()) || 0
      }

      const demandScore = Math.round((totalCount / maxCount) * 100)
      await prisma.skillMapping.update({
        where: { id: mapping.id },
        data: { demandScore },
      })
      updated++
    }

    return NextResponse.json({
      jobsScanned: jobs.length,
      uniqueSkills: skillCounts.size,
      mappingsUpdated: updated,
    })
  } catch (error) {
    console.error('Update skill demand error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
