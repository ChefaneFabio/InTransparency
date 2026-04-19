import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { getCurrentSkillGraph } from '@/lib/skill-delta'

/**
 * GET /api/student/skill-graph
 * Returns the current student's verified skill graph — one row per skill, with
 * current proficiency level and evidence provenance.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const graph = await getCurrentSkillGraph(session.user.id)

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
