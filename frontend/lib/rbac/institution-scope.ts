import prisma from '@/lib/prisma'

/**
 * Resolve the institutional scope for a given user.
 * Returns the full picture needed to filter Placements, Leads, etc.
 *
 * Every institution-scoped API should call this and use the result as
 * the authoritative filter — do NOT trust client-sent institutionId.
 */
export async function getUserScope(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, company: true, university: true },
  })
  if (!user) return null

  const [staffRoles, affiliations] = await Promise.all([
    prisma.institutionStaff.findMany({
      where: { userId },
      select: { institutionId: true, role: true },
    }),
    prisma.institutionAffiliation.findMany({
      where: { studentId: userId, status: 'ACTIVE' },
      select: { institutionId: true, program: true },
    }),
  ])

  return {
    user,
    staffInstitutionIds: staffRoles.map(s => s.institutionId),
    staffRoleByInstitution: Object.fromEntries(staffRoles.map(s => [s.institutionId, s.role])),
    affiliatedInstitutionIds: affiliations.map(a => a.institutionId),
    affiliations,
    isStaff: staffRoles.length > 0,
    isPlatformAdmin: user.role === 'ADMIN',
  }
}

/**
 * Build the Prisma `where` clause for Placement queries based on the caller.
 *
 * - STUDENT → only own placements
 * - Academic tutor → placements where academicTutorId = me
 * - Company tutor → placements where companyTutorUserId = me
 * - Institution staff → all placements in staffed institutions
 * - Platform admin → everything
 * - Recruiter with company → all placements at that company
 */
export async function placementWhereForUser(userId: string) {
  const scope = await getUserScope(userId)
  if (!scope) return { id: '__no_match__' } // fail closed

  if (scope.isPlatformAdmin) return {}

  const or: any[] = []

  // Always include: own placements
  or.push({ studentId: userId })

  // Tutors
  or.push({ academicTutorId: userId })
  or.push({ companyTutorUserId: userId })

  // Institution staff
  if (scope.staffInstitutionIds.length > 0) {
    or.push({ institutionId: { in: scope.staffInstitutionIds } })
  }

  // Recruiter at a known company — scope by companyName match
  if (scope.user.role === 'RECRUITER' && scope.user.company) {
    or.push({ companyName: { equals: scope.user.company, mode: 'insensitive' as const } })
  }

  return { OR: or }
}

/**
 * Can this user view/edit this placement? Returns { canView, canEdit, role }.
 * role is the "view lens" to use in the response: STUDENT | ACADEMIC_TUTOR | COMPANY_TUTOR | INSTITUTION_STAFF | COMPANY_ADMIN | PLATFORM_ADMIN
 */
export async function checkPlacementAccess(userId: string, placementId: string) {
  const scope = await getUserScope(userId)
  if (!scope) return { canView: false, canEdit: false, role: null as null }

  const p = await prisma.placement.findUnique({
    where: { id: placementId },
    select: {
      id: true,
      studentId: true,
      academicTutorId: true,
      companyTutorUserId: true,
      institutionId: true,
      companyName: true,
    },
  })
  if (!p) return { canView: false, canEdit: false, role: null as null }

  if (scope.isPlatformAdmin) return { canView: true, canEdit: true, role: 'PLATFORM_ADMIN' as const }

  if (p.studentId === userId) return { canView: true, canEdit: false, role: 'STUDENT' as const }
  if (p.academicTutorId === userId) return { canView: true, canEdit: true, role: 'ACADEMIC_TUTOR' as const }
  if (p.companyTutorUserId === userId) return { canView: true, canEdit: true, role: 'COMPANY_TUTOR' as const }

  if (p.institutionId && scope.staffInstitutionIds.includes(p.institutionId)) {
    return { canView: true, canEdit: true, role: 'INSTITUTION_STAFF' as const }
  }

  if (scope.user.role === 'RECRUITER' && scope.user.company && p.companyName &&
      scope.user.company.toLowerCase() === p.companyName.toLowerCase()) {
    return { canView: true, canEdit: false, role: 'COMPANY_ADMIN' as const }
  }

  return { canView: false, canEdit: false, role: null as null }
}

/**
 * Write an AuditEvent for state changes. Best-effort; failures are logged but do not block.
 */
export async function audit(params: {
  actorId: string | null
  actorRole: string
  action: string
  entityType: string
  entityId: string
  payload?: any
  institutionId?: string
}) {
  try {
    await prisma.auditEvent.create({
      data: {
        actorId: params.actorId ?? null,
        actorRole: params.actorRole,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        payload: params.payload ?? null,
        institutionId: params.institutionId ?? null,
      },
    })
  } catch (err) {
    console.error('Audit write failed (non-fatal):', err)
  }
}
