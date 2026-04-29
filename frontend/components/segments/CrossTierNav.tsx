'use client'

import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'

type Tier = 'universities' | 'its' | 'highSchools'

interface CrossTierNavProps {
  current: Tier
}

const TIER_HREFS: Record<Tier, string> = {
  universities: '/for-universities',
  its: '/for-its-institutes',
  highSchools: '/for-high-schools',
}

export function CrossTierNav({ current }: CrossTierNavProps) {
  const t = useTranslations('crossTier')
  const others: Tier[] = (['universities', 'its', 'highSchools'] as Tier[]).filter(x => x !== current)

  return (
    <section className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-3">
          {t('heading')}
        </p>
        <h2 className="text-xl font-medium text-slate-900 mb-6">
          {t('subhead')}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {others.map(tier => (
            <Link
              key={tier}
              href={TIER_HREFS[tier]}
              className="group flex items-center justify-between p-5 border border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {t(`tiers.${tier}.label`)}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {t(`tiers.${tier}.tagline`)}
                </p>
              </div>
              <span className="text-slate-400 group-hover:text-slate-700 transition-colors text-lg" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
