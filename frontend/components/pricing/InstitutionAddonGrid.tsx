'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import {
  INSTITUTION_ADDONS,
  formatAddonPrice,
  type InstitutionAddon,
} from '@/lib/config/institution-addons'

/**
 * Editorial-style add-on table — replaces the previous tinted-card grid.
 *
 * Each row is name + status (left), description (middle), price + CTA
 * (right). No tint backgrounds, no icon circles, no decorative ornaments.
 * Status is shown as a small uppercase eyebrow next to the title.
 */

const STATUS_LABEL_KEY: Record<InstitutionAddon['status'], 'statusAvailable' | 'statusBeta' | 'statusComingSoon'> = {
  available: 'statusAvailable',
  beta:      'statusBeta',
  roadmap:   'statusComingSoon',
}

const STATUS_TONE: Record<InstitutionAddon['status'], string> = {
  available: 'text-emerald-700 dark:text-emerald-400',
  beta:      'text-blue-700 dark:text-blue-400',
  roadmap:   'text-slate-500',
}

interface Props {
  authenticated?: boolean
  locale?: string
  only?: string[]
  /** Kept for API compat with the public pricing page; ignored in the
   *  editorial layout, which always renders one row per add-on. */
  cols?: 2 | 3
  /** Hide roadmap items from the grid. The public pricing page sets this
   *  so visitors see only what's actually available; the auth'd dashboard
   *  add-ons page leaves it false to surface the full roadmap. */
  excludeRoadmap?: boolean
}

export default function InstitutionAddonGrid({ authenticated, locale = 'en', only, excludeRoadmap }: Props) {
  const t = useTranslations('dashboard.addonGrid')
  const filtered = only ? INSTITUTION_ADDONS.filter(a => only.includes(a.key)) : INSTITUTION_ADDONS
  const items = excludeRoadmap ? filtered.filter(a => a.status !== 'roadmap') : filtered

  const contactHref = (a: InstitutionAddon) =>
    authenticated
      ? `/dashboard/university/billing?addon=${a.key}`
      : `/contact?subject=addon-${a.key}`

  return (
    <div className="border-t border-slate-200 dark:border-slate-800">
      {items.map(a => {
        const isComingSoon = a.status === 'roadmap'
        const statusLabel = t(STATUS_LABEL_KEY[a.status])
        const statusTone = STATUS_TONE[a.status]

        return (
          <div
            key={a.key}
            className="grid md:grid-cols-12 gap-6 py-8 border-b border-slate-200 dark:border-slate-800"
          >
            {/* Title + status */}
            <div className="md:col-span-4">
              <div className={`text-[10px] font-medium uppercase tracking-[0.14em] mb-2 ${statusTone}`}>
                {statusLabel}
              </div>
              <h4 className="text-[17px] font-semibold text-slate-900 dark:text-white leading-tight">
                {a.title}
              </h4>
              <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-500">{a.target}</p>
            </div>

            {/* Description */}
            <div className="md:col-span-5">
              <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300 leading-snug">
                {a.oneLine}
              </p>
              <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {a.description}
              </p>
            </div>

            {/* Price + CTA */}
            <div className="md:col-span-3 md:text-right flex flex-col md:items-end justify-between gap-4">
              <div>
                <div
                  className={`text-[18px] font-semibold tracking-tight tabular-nums ${
                    isComingSoon ? 'text-slate-500' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {isComingSoon
                    ? t('indicativePrice', { price: formatAddonPrice(a.pricing, locale) })
                    : formatAddonPrice(a.pricing, locale)}
                </div>
                {'note' in a.pricing && a.pricing.note && (
                  <div className="mt-1 text-[12px] text-slate-500 leading-snug max-w-[200px] md:ml-auto">
                    {a.pricing.note}
                  </div>
                )}
              </div>
              <Link
                href={contactHref(a) as any}
                className="inline-flex items-center text-sm font-medium text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors whitespace-nowrap"
              >
                {isComingSoon ? t('ctaWaitlist') : authenticated ? t('ctaRequest') : t('ctaTalk')}
                <span className="ml-1.5" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
