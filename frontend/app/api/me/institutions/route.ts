import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { getUserScope } from '@/lib/rbac/institution-scope'
import prisma from '@/lib/prisma'

/**
 * GET /api/me/institutions
 * Returns institutions where the current user is staff, plus affiliations
 * as a student. Used by role-scoped pages (CRM, Inbox) to resolve which
 * institution context to load.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const scope = await getUserScope(session.user.id)
    if (!scope) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const all = await prisma.institution.findMany({
      where: {
        OR: [
          { id: { in: scope.staffInstitutionIds } },
          { id: { in: scope.affiliatedInstitutionIds } },
        ],
      },
      select: {
        id: true, name: true, slug: true, type: true, plan: true,
        city: true, region: true, country: true,
      },
    })

    // Annotate each with the caller's role
    const annotated = all.map(i => {
      const staffRole = scope.staffRoleByInstitution[i.id]
      const isAffiliated = scope.affiliatedInstitutionIds.includes(i.id)
      return {
        ...i,
        role: staffRole || (isAffiliated ? 'STUDENT' : null),
      }
    })

    return NextResponse.json({ institutions: annotated, isPlatformAdmin: scope.isPlatformAdmin })
  } catch (error) {
    console.error('GET /api/me/institutions error:', error)
    return NextResponse.json({ error: 'Failed to load institutions' }, { status: 500 })
  }
}
