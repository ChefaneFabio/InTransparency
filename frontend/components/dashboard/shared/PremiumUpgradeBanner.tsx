'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles, Lock, ArrowRight } from 'lucide-react'

type Feature = 'inbox' | 'offers' | 'crm' | 'placement' | 'generic'

// Key maps each feature to the translation slot used for the banner title
// and description. The visual treatment is the <Sparkles/> icon + gold
// gradient — no per-feature iconography needed here.
const FEATURE_KEYS: Record<Feature, string> = {
  inbox:     'inbox',
  offers:    'offers',
  crm:       'crm',
  placement: 'placement',
  generic:   'generic',
}

interface Props {
  institutionName?: string | null
  plan: 'CORE' | 'PREMIUM' | null | undefined
  feature: Feature
  /** If true, replace the children with just the banner. Otherwise render children below banner. */
  fullBlock?: boolean
}

/**
 * Renders a visible PREMIUM upgrade CTA when the institution is on CORE.
 * When plan is PREMIUM (or unknown), renders nothing.
 *
 * Pair with the 402 API gating in /lib/rbac/plan-check.ts: staff can still
 * read CORE dashboards, but writes return 402 — this banner is the upsell
 * surface that turns those silent 402s into an action.
 */
export function PremiumUpgradeBanner({ institutionName, plan, feature }: Props) {
  const t = useTranslations('premiumBanner')
  if (plan !== 'CORE') return null

  const featureKey = FEATURE_KEYS[feature]

  return (
    <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">
              {t(`title.${featureKey}`, { defaultValue: `Unlock ${feature} — PREMIUM` })}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              <Lock className="h-2.5 w-2.5" />
              {t('coreLabel', { defaultValue: 'Currently on CORE' })}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">
            {t(`desc.${featureKey}`, {
              defaultValue:
                'You can preview this workspace, but actions like creating, approving, or moderating require a PREMIUM plan.',
            })}
          </p>
          {institutionName && (
            <p className="text-xs text-gray-500 mt-1">
              {t('forInstitution', { defaultValue: 'For' })}{' '}
              <span className="font-medium">{institutionName}</span>
            </p>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Link href="/dashboard/university/billing">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow">
              {t('cta', { defaultValue: 'Upgrade to PREMIUM' })}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
