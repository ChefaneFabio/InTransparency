/**
 * Demo / real data segregation on user-facing browse surfaces.
 *
 * Rule:
 *   - Admin viewer            → no filter (sees everything).
 *   - Demo-flagged viewer     → sees ONLY demo data (consistent demo env).
 *   - Real / anonymous viewer → sees ONLY real data (prospect-grade).
 *
 * Apply via spread into a `prisma.user.findMany`-style where clause:
 *   const where = { role: 'STUDENT', ...userDemoFilter(viewer) }
 *
 * For nested filters (e.g. `Project.where.user.<filter>`), use
 * `userDemoFilter(viewer)` and merge into the inner user fragment.
 *
 * For queries that JOIN to a User (e.g. AuditLog.actorId), call
 * `resolveDemoUserIds(viewer)` to fetch the id set up-front and exclude.
 */

import prisma from '@/lib/prisma'

export type Viewer = {
  id: string | null
  role: string | null
  isDemo?: boolean | null
} | null

/** Resolve whether a viewer's "world" is demo, real, or unrestricted. */
export function viewerScope(viewer: Viewer): 'admin' | 'demo' | 'real' {
  if (viewer?.role === 'ADMIN') return 'admin'
  if (viewer?.isDemo === true) return 'demo'
  return 'real'
}

/**
 * Where-fragment to apply to a `User` query — restricts the row set to
 * the viewer's scope. Returns `{}` when no restriction is needed.
 */
export function userDemoFilter(viewer: Viewer): Record<string, unknown> {
  const scope = viewerScope(viewer)
  if (scope === 'admin') return {}
  if (scope === 'demo') return { isDemo: true }
  return { isDemo: false }
}

/**
 * Where-fragment to apply to a query that has a relation to User (e.g. a
 * Project). Pass the relation name (default: "user").
 */
export function relatedUserDemoFilter(
  viewer: Viewer,
  relation: string = 'user'
): Record<string, unknown> {
  const scope = viewerScope(viewer)
  if (scope === 'admin') return {}
  return { [relation]: { isDemo: scope === 'demo' } }
}

/**
 * Resolve the set of user IDs that should be EXCLUDED for queries against
 * tables that don't have a Prisma relation to User (e.g. AuditLog). Returns
 * `null` when no exclusion is needed.
 *
 * Returns:
 *   - admin viewer  → null (no exclusion)
 *   - demo viewer   → ids of all REAL users (so they get filtered out, leaving demo)
 *   - real viewer   → ids of all DEMO users (so they get filtered out, leaving real)
 */
export async function getExcludedUserIds(viewer: Viewer): Promise<string[] | null> {
  const scope = viewerScope(viewer)
  if (scope === 'admin') return null
  const excluded = await prisma.user.findMany({
    where: { isDemo: scope === 'real' },
    select: { id: true },
  })
  return excluded.map(u => u.id)
}
