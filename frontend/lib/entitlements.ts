/**
 * Student entitlement resolver.
 *
 * A student is "Premium-entitled" if EITHER:
 *   - their own subscriptionTier === 'STUDENT_PREMIUM' (paid personally), OR
 *   - they have an active InstitutionAffiliation with an Institution whose
 *     sponsorsPremium flag is true (their university covers it).
 *
 * Use this helper anywhere the old check was
 * `user.subscriptionTier === 'STUDENT_PREMIUM'`. The institutional path is
 * transparent to the student — they just see Premium features unlocked.
 */

import prisma from './prisma'

export interface PremiumEntitlement {
  isEntitled: boolean
  /** How Premium was granted — useful for UI ("sponsored by X"). */
  source: 'personal' | 'institution' | 'none'
  /** If source === 'institution', the institution name sponsoring it. */
  sponsoringInstitution?: { id: string; name: string; slug: string }
}

/**
 * Resolve a student's Premium entitlement. Returns `{ isEntitled, source }`
 * so callers can both gate and explain.
 */
export async function getStudentPremiumEntitlement(
  userId: string
): Promise<PremiumEntitlement> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      institutionAffiliations: {
        where: { status: 'ACTIVE' },
        select: {
          institution: {
            select: { id: true, name: true, slug: true, sponsorsPremium: true },
          },
        },
        take: 5,
      },
    },
  })

  if (!user) return { isEntitled: false, source: 'none' }

  if (user.subscriptionTier === 'STUDENT_PREMIUM') {
    return { isEntitled: true, source: 'personal' }
  }

  const sponsor = user.institutionAffiliations.find(a => a.institution.sponsorsPremium)
  if (sponsor) {
    return {
      isEntitled: true,
      source: 'institution',
      sponsoringInstitution: {
        id: sponsor.institution.id,
        name: sponsor.institution.name,
        slug: sponsor.institution.slug,
      },
    }
  }

  return { isEntitled: false, source: 'none' }
}

/**
 * Quick boolean for gating checks. Preferred over the raw subscriptionTier
 * comparison so institutional sponsorship is honored everywhere.
 */
export async function isStudentPremium(userId: string): Promise<boolean> {
  const e = await getStudentPremiumEntitlement(userId)
  return e.isEntitled
}
