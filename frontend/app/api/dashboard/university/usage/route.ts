import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { getUserScope } from '@/lib/rbac/institution-scope'
import { getInstitutionUsage } from '@/lib/rbac/plan-check'

/**
 * GET /api/dashboard/university/usage
 *
 * Returns the current usage snapshot for the caller's institution. Powers
 * the dashboard usage banner ("47/50 AI queries used this month · upgrade
 * for unlimited") and any other quota-aware UI.
 *
 * Free Core: limits are real numbers; remaining is the gap.
 * Premium:   limits are -1 (sentinel for unlimited); remaining is -1.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const scope = await getUserScope(session.user.id)
  if (!scope || scope.staffInstitutionIds.length === 0) {
    return NextResponse.json({ error: 'Institution staff only' }, { status: 403 })
  }

  const institutionId = scope.staffInstitutionIds[0]
  const usage = await getInstitutionUsage(institutionId)
  return NextResponse.json(usage)
}
