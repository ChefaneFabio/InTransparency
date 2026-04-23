import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getCurrentSkillGraph, writeProjectDeltas } from '@/lib/skill-delta'

/**
 * GET /api/student/skill-graph
 * Returns the current student's verified skill graph — one row per skill, with
 * current proficiency level and evidence provenance.
 *
 * Lazy backfill: if the student has projects but zero deltas (e.g. demo seed
 * users, or projects uploaded before the self-declared-on-upload fix), we
 * backfill self-declared PROJECT deltas from existing projects so the graph
 * isn't empty. New uploads write deltas immediately via POST /api/projects.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const studentId = session.user.id

  let graph = await getCurrentSkillGraph(studentId)

  if (graph.length === 0) {
    const projects = await prisma.project.findMany({
      where: { userId: studentId },
      select: { id: true, title: true, skills: true, tools: true, technologies: true },
    })

    if (projects.length > 0) {
      for (const p of projects) {
        const allSkills = Array.from(
          new Set([...(p.skills || []), ...(p.tools || []), ...(p.technologies || [])])
        )
        if (allSkills.length === 0) continue
        await writeProjectDeltas({
          projectId: p.id,
          studentId,
          projectTitle: p.title,
          competencies: allSkills.map(skill => ({ skill, proficiencyLevel: 'Intermediate' })),
          endorserName: null,
        }).catch(err => console.error('Lazy skill-graph backfill failed:', err))
      }
      graph = await getCurrentSkillGraph(studentId)
    }
  }

  return NextResponse.json({
    skills: graph.map(row => ({
      skillTerm: row.skillTerm,
      escoUri: row.escoUri,
      currentLevel: row.currentLevel,
      sourceCount: row.sourceCount,
      sources: row.sources.map(s => ({
        source: s.source,
        sourceId: s.sourceId,
        sourceName: s.sourceName,
        level: s.level,
        occurredAt: s.occurredAt.toISOString(),
      })),
      firstObservedAt: row.firstObservedAt.toISOString(),
      lastObservedAt: row.lastObservedAt.toISOString(),
    })),
    summary: {
      totalSkills: graph.length,
      byLevel: {
        beginner: graph.filter(r => r.currentLevel === 1).length,
        intermediate: graph.filter(r => r.currentLevel === 2).length,
        advanced: graph.filter(r => r.currentLevel === 3).length,
        expert: graph.filter(r => r.currentLevel === 4).length,
      },
      multiSource: graph.filter(r => r.sourceCount >= 2).length,
    },
  })
}
