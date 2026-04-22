import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * Institutional workspace gating.
 *
 * CORE plan:
 *   - Read-only access (can see kanbans, placements, inbox — tangible demo)
 *   - Student-facing features remain freemium
 *   - Write operations (create/update/transition/approve/reject) are blocked
 *     with 402 Payment Required so UIs can surface an upgrade CTA.
 *
 * PREMIUM plan:
 *   - Full write access to M1 / M2 / M3 / M4 + reminder engine.
 *
 * The check is always keyed by institutionId, never by user — a user may
 * be staff at one PREMIUM and one CORE institution and has different
 * permissions at each.
 */

export const PREMIUM_FEATURES = [
  'mediation.message.submit',
  'mediation.message.approve',
  'mediation.message.edit',
  'mediation.message.reject',
  'mediation.message.note',
  'mediation.message.reply',
  'job.approve',
  'job.reject',
  'lead.create',
  'lead.update',
  'lead.delete',
  'lead.stage_change',
  'lead.activity.log',
  'placement.create',
  'placement.update',
  'placement.delete',
  'placement.stage_change',
  'placement.evaluation.submit',
  'placement.hours.log',
  'convention.generate',
  'reminder.send',
  'reminder.rule.edit',
] as const

export type PremiumFeature = typeof PREMIUM_FEATURES[number]

export async function getInstitutionPlan(institutionId: string): Promise<'CORE' | 'PREMIUM' | null> {
  const i = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { plan: true },
  })
  return i?.plan ?? null
}

/**
 * Throws a NextResponse 402 if the institution is not PREMIUM.
 * Use in a try/catch — catch the response and return it.
 *
 * Simpler pattern: `const gate = await checkPremium(id); if (gate) return gate;`
 */
export async function checkPremium(
  institutionId: string,
  feature?: PremiumFeature
): Promise<NextResponse | null> {
  const plan = await getInstitutionPlan(institutionId)
  if (plan === 'PREMIUM') return null

  return NextResponse.json(
    {
      error: 'Premium required',
      code: 'PREMIUM_REQUIRED',
      institutionPlan: plan ?? 'UNKNOWN',
      feature: feature ?? 'generic',
      message: "Questa funzionalità fa parte del pacchetto Premium dell'istituzione. Contatta il tuo admin per l'upgrade.",
    },
    { status: 402 }
  )
}

/**
 * Non-throwing variant — returns boolean. Useful in GET endpoints to
 * annotate the response with `canEdit` rather than block reads.
 */
export async function isInstitutionPremium(institutionId: string): Promise<boolean> {
  return (await getInstitutionPlan(institutionId)) === 'PREMIUM'
}
