/**
 * Admin-managed access grants — controls which companies can browse / view /
 * contact students of which institutions.
 *
 * POLICY (allow-list overlay):
 *   - If a recruiter's company has ZERO active grants → no restriction
 *     (default behavior preserved). They see everyone.
 *   - If a recruiter's company has ≥1 active grant → restricted to the
 *     institutions named in those grants only. Per-grant flags can further
 *     restrict scope (search / profile / contact) and student subset
 *     (program, cohort year).
 *
 * Membership: a recruiter belongs to a company by their `User.company`
 * string match (lowercased + trimmed) against `InstitutionAccessGrant
 * .companyNameKey`. Recruiters with no `company` are unrestricted (this
 * is intentional — admins can also set company manually via the user edit
 * page if they want to enforce it).
 *
 * Active = not revoked AND (no expiresAt OR expiresAt > now).
 */

import prisma from '@/lib/prisma'
import type { InstitutionAccessGrant } from '@prisma/client'

export type AccessScope = 'search' | 'profile' | 'contact'

export function normalizeCompanyName(name: string): string {
  return name.trim().toLowerCase()
}

interface CachedGrants {
  userId: string
  fetchedAt: number
  grants: InstitutionAccessGrant[]
}
const GRANT_CACHE_TTL_MS = 30_000 // short cache to absorb burst lookups inside one request
const grantCache = new Map<string, CachedGrants>()

async function loadActiveGrants(companyKey: string): Promise<InstitutionAccessGrant[]> {
  const now = new Date()
  return prisma.institutionAccessGrant.findMany({
    where: {
      companyNameKey: companyKey,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
  })
}

/**
 * Resolve the recruiter's User.company string and fetch all of their company's
 * active grants. Empty array if the recruiter has no company set.
 */
export async function getActiveGrantsForRecruiter(userId: string): Promise<InstitutionAccessGrant[]> {
  const cached = grantCache.get(userId)
  if (cached && Date.now() - cached.fetchedAt < GRANT_CACHE_TTL_MS) {
    return cached.grants
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { company: true },
  })
  if (!user?.company) {
    grantCache.set(userId, { userId, fetchedAt: Date.now(), grants: [] })
    return []
  }
  const grants = await loadActiveGrants(normalizeCompanyName(user.company))
  grantCache.set(userId, { userId, fetchedAt: Date.now(), grants })
  return grants
}

/**
 * Returns the institution-id allow-list for a recruiter, or `null` if the
 * recruiter has no active grants (i.e. unrestricted — default behavior).
 *
 * `scope` filters to grants that allow the requested action.
 */
export async function getAllowedInstitutionIds(
  userId: string,
  scope: AccessScope = 'search'
): Promise<string[] | null> {
  const grants = await getActiveGrantsForRecruiter(userId)
  if (grants.length === 0) return null
  const filtered = grants.filter(g => grantAllowsScope(g, scope))
  return Array.from(new Set(filtered.map(g => g.institutionId)))
}

function grantAllowsScope(grant: InstitutionAccessGrant, scope: AccessScope): boolean {
  if (scope === 'search') return grant.allowSearch
  if (scope === 'profile') return grant.allowProfile
  if (scope === 'contact') return grant.allowContact
  return false
}

/**
 * Resolve a student's institution memberships. Combines:
 *   - InstitutionAffiliation rows (status = ACTIVE) — the structured source.
 *   - User.university free-text → name-match against Institution.name (case-
 *     insensitive). Backfill for older students who haven't been linked via
 *     an Affiliation row yet.
 */
async function getStudentInstitutionContext(studentId: string): Promise<{
  institutionIds: Set<string>
  programByInstitution: Map<string, string[]>
  graduationYear: number | null
}> {
  const [affiliations, user] = await Promise.all([
    prisma.institutionAffiliation.findMany({
      where: { studentId, status: 'ACTIVE' },
      select: { institutionId: true, program: true },
    }),
    prisma.user.findUnique({
      where: { id: studentId },
      select: { university: true, graduationYear: true },
    }),
  ])
  const institutionIds = new Set<string>()
  const programByInstitution = new Map<string, string[]>()
  for (const a of affiliations) {
    institutionIds.add(a.institutionId)
    if (a.program) {
      const prev = programByInstitution.get(a.institutionId) ?? []
      prev.push(a.program)
      programByInstitution.set(a.institutionId, prev)
    }
  }
  if (user?.university) {
    const matched = await prisma.institution.findMany({
      where: { name: { equals: user.university, mode: 'insensitive' } },
      select: { id: true },
    })
    for (const i of matched) institutionIds.add(i.id)
  }
  const gradYear = user?.graduationYear ? parseInt(user.graduationYear, 10) : null
  return {
    institutionIds,
    programByInstitution,
    graduationYear: Number.isFinite(gradYear as number) ? (gradYear as number) : null,
  }
}

/**
 * Final access decision for a recruiter → student → scope tuple.
 * Returns `{ ok: true }` when:
 *   - The recruiter has no active grants (default-open), OR
 *   - At least one of their grants matches the student's institution AND
 *     the requested scope AND the optional program/cohort filters.
 */
export async function canRecruiterAccessStudent(
  recruiterId: string,
  studentId: string,
  scope: AccessScope = 'search'
): Promise<{ ok: boolean; reason?: string }> {
  const grants = await getActiveGrantsForRecruiter(recruiterId)
  if (grants.length === 0) return { ok: true }

  const ctx = await getStudentInstitutionContext(studentId)
  if (ctx.institutionIds.size === 0) {
    return { ok: false, reason: 'STUDENT_NO_INSTITUTION' }
  }

  for (const grant of grants) {
    if (!grant.institutionId || !ctx.institutionIds.has(grant.institutionId)) continue
    if (!grantAllowsScope(grant, scope)) continue

    if (grant.programs.length > 0) {
      const studentPrograms = ctx.programByInstitution.get(grant.institutionId) ?? []
      const programMatch = grant.programs.some(p =>
        studentPrograms.some(sp => sp.toLowerCase() === p.toLowerCase())
      )
      if (!programMatch) continue
    }

    if (grant.cohortYears.length > 0) {
      if (ctx.graduationYear === null || !grant.cohortYears.includes(ctx.graduationYear)) continue
    }

    return { ok: true }
  }
  return { ok: false, reason: 'NOT_IN_GRANTED_INSTITUTIONS' }
}

/**
 * Build a Prisma `where`-fragment that restricts a recruiter's student-search
 * to their granted institutions (when grants exist). Returns `null` when the
 * recruiter is unrestricted — caller should append nothing.
 *
 * Matches via either the structured Affiliation table OR the legacy
 * `user.university` string (so older students without affiliations still
 * surface).
 */
export async function buildRecruiterSearchFilter(
  recruiterId: string
): Promise<Record<string, unknown> | null> {
  const allowed = await getAllowedInstitutionIds(recruiterId, 'search')
  if (allowed === null) return null
  if (allowed.length === 0) {
    // Recruiter has grants but none allow search — block everything.
    return { id: '__blocked__' }
  }
  const institutions = await prisma.institution.findMany({
    where: { id: { in: allowed } },
    select: { id: true, name: true },
  })
  const names = institutions.map(i => i.name).filter(Boolean)
  return {
    OR: [
      {
        affiliations: {
          some: { institutionId: { in: allowed }, status: 'ACTIVE' },
        },
      },
      ...names.map(n => ({
        university: { equals: n, mode: 'insensitive' as const },
      })),
    ],
  }
}

export function clearGrantCache(userId?: string): void {
  if (userId) grantCache.delete(userId)
  else grantCache.clear()
}
