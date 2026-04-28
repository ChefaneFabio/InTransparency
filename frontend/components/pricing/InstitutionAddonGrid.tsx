'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import {
  INSTITUTION_ADDONS,
  formatAddonPrice,
  type InstitutionAddon,
} from '@/lib/config/institution-addons'

/**
 * Editorial-style add-on table.
 *
 * Each row: name + status (left) · description (middle) · price + CTA (right).
 * All addon copy (title, oneLine, description, target, optional note) is
 * resolved via dashboard.addons.{key}.{...} translation keys; the data file
 * holds only structural metadata (key, icon, pricing, status, tint).
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
  /** Render "Talk to us" / "Su misura" instead of the euro figure for
   *  every add-on. Public /pricing passes this so the only euro numbers on
   *  the public site are the freemium plan prices; the auth'd dashboard
   *  leaves it false (paying customers see actual numbers in-product). */
  hidePrices?: boolean
}

export default function InstitutionAddonGrid({
  authenticated,
  locale = 'en',
  only,
  excludeRoadmap,
  hidePrices,
}: Props) {
  const t = useTranslations('dashboard.addonGrid')
  const tAddon = useTranslations('dashboard.addons')
  const filtered = only ? INSTITUTION_ADDONS.filter(a => only.includes(a.key)) : INSTITUTION_ADDONS
  const items = excludeRoadmap ? filtered.filter(a => a.status !== 'roadmap') : filtered

  const contactHref = (a: InstitutionAddon) =>
    authenticated
      ? `/dashboard/university/billing?addon=${a.key}`
      : `/contact?subject=addon-${a.key}`

  // Optional `note` per addon — not every addon defines one, so guard with
  // tAddon.has() to avoid the next-intl missing-key throw.
  const addonNote = (key: string): string | null =>
    tAddon.has(`${key}.note`) ? tAddon(`${key}.note`) : null

  return (
    <div className="border-t border-slate-200 dark:border-slate-800">
      {items.map(a => {
        const isComingSoon = a.status === 'roadmap'
        const statusLabel = t(STATUS_LABEL_KEY[a.status])
        const statusTone = STATUS_TONE[a.status]
        const note = addonNote(a.key)

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
                {tAddon(`${a.key}.title`)}
              </h4>
              <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-500">
                {tAddon(`${a.key}.target`)}
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-5">
              <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300 leading-snug">
                {tAddon(`${a.key}.oneLine`)}
              </p>
              <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {tAddon(`${a.key}.description`)}
              </p>
            </div>

            {/* Price + CTA */}
            <div className="md:col-span-3 md:text-right flex flex-col md:items-end justify-between gap-4">
              <div>
                <div
                  className={`text-[18px] font-semibold tracking-tight ${
                    hidePrices || isComingSoon ? 'text-slate-500' : 'text-slate-900 dark:text-white tabular-nums'
                  }`}
                >
                  {hidePrices
                    ? t('talkToUs')
                    : isComingSoon
                      ? t('indicativePrice', { price: formatAddonPrice(a.pricing, locale) })
                      : formatAddonPrice(a.pricing, locale)}
                </div>
                {!hidePrices && note && (
                  <div className="mt-1 text-[12px] text-slate-500 leading-snug max-w-[200px] md:ml-auto">
                    {note}
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
