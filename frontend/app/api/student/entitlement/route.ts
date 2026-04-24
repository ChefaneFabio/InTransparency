import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { getStudentPremiumEntitlement } from '@/lib/entitlements'

/**
 * GET /api/student/entitlement
 * Returns the caller's Premium entitlement, including whether it's
 * personal or institution-sponsored. Used by the student dashboard to
 * show "Premium is free for you — sponsored by X" when applicable.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entitlement = await getStudentPremiumEntitlement(session.user.id)
  return NextResponse.json(entitlement)
}
