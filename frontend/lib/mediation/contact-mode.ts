import prisma from '@/lib/prisma'

/**
 * Derive contactMode for a given student. Never stored — computed at
 * query time so toggling Institution.mediationEnabled immediately
 * changes the behaviour without a migration.
 *
 * - MEDIATED: student has at least one ACTIVE affiliation to an
 *   institution with mediationEnabled=true
 * - DIRECT: otherwise (pay-per-talent flow)
 */
export type ContactMode = 'MEDIATED' | 'DIRECT'

export async function deriveContactMode(studentId: string): Promise<{
  mode: ContactMode
  institutionId: string | null
  institutionName: string | null
}> {
  const affiliation = await prisma.institutionAffiliation.findFirst({
    where: {
      studentId,
      status: 'ACTIVE',
      institution: { mediationEnabled: true },
    },
    include: { institution: { select: { id: true, name: true } } },
    orderBy: { startDate: 'desc' },
  })

  if (affiliation) {
    return {
      mode: 'MEDIATED',
      institutionId: affiliation.institutionId,
      institutionName: affiliation.institution.name,
    }
  }
  return { mode: 'DIRECT', institutionId: null, institutionName: null }
}

/**
 * Batch variant — returns Map<studentId, ContactMode>. Preferred for
 * candidate-search pages that render many students at once.
 */
export async function deriveContactModesForMany(studentIds: string[]): Promise<Map<string, {
  mode: ContactMode
  institutionId: string | null
  institutionName: string | null
}>> {
  if (studentIds.length === 0) return new Map()

  const rows = await prisma.institutionAffiliation.findMany({
    where: {
      studentId: { in: studentIds },
      status: 'ACTIVE',
      institution: { mediationEnabled: true },
    },
    include: { institution: { select: { id: true, name: true } } },
    orderBy: { startDate: 'desc' },
  })

  const map = new Map<string, { mode: ContactMode; institutionId: string | null; institutionName: string | null }>()

  // Each student defaults to DIRECT
  for (const sid of studentIds) {
    map.set(sid, { mode: 'DIRECT', institutionId: null, institutionName: null })
  }

  // Override with the first (most recent) mediated affiliation
  for (const r of rows) {
    if (!map.get(r.studentId) || map.get(r.studentId)!.mode === 'DIRECT') {
      map.set(r.studentId, {
        mode: 'MEDIATED',
        institutionId: r.institutionId,
        institutionName: r.institution.name,
      })
    }
  }

  return map
}
