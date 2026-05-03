'use client'

import { useTranslations } from 'next-intl'

/**
 * TrustStrip — honest "where we are today" surface.
 *
 * Not a fake "Trusted by Logo1 / Logo2 / Logo3" strip. The brand voice
 * rules out SaaS-playbook tactics, and we don't have signed customers
 * to claim. This component shows the real state of conversations and
 * recognitions with explicit status indicators (prize, pilot in
 * discussion, conversation), so visitors learn what we've earned and
 * what's in motion — without exaggeration.
 *
 * Items are configured here (not in i18n) because each one represents
 * a real fact that needs to be reviewed before it's added or changed.
 * Per-item copy lives in i18n under the `trustStrip` namespace.
 */

type TrustStatus = 'prize' | 'pilot' | 'meeting'

interface TrustItem {
  key: string
  status: TrustStatus
  year?: string
}

// Reviewed 2026-05-03 — every item below is a real, verifiable state.
// Update only after the underlying conversation has actually advanced.
const ITEMS: TrustItem[] = [
  { key: 'startCup', status: 'prize',   year: '2025' },
  { key: 'unibg',    status: 'pilot' },
  { key: 'polimi',   status: 'meeting' },
  { key: 'cattolica', status: 'meeting' },
]

const STATUS_STYLES: Record<TrustStatus, string> = {
  prize:   'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  pilot:   'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900',
  meeting: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700',
}

interface Props {
  /** When true, renders a tighter single-row layout suitable for between
   *  hero and the first content section. Otherwise renders the fuller
   *  grid layout with descriptive notes. */
  compact?: boolean
}

export function TrustStrip({ compact = false }: Props) {
  const t = useTranslations('trustStrip')

  if (compact) {
    return (
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container max-w-5xl mx-auto px-6 py-10">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 text-center mb-5">
            {t('eyebrow')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {ITEMS.map(item => (
              <div key={item.key} className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-slate-900 dark:text-white">
                  {t(`items.${item.key}.name`)}
                </span>
                <span className={`text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded border ${STATUS_STYLES[item.status]}`}>
                  {t(`status.${item.status}`)}
                  {item.year && ` · ${item.year}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container max-w-5xl mx-auto px-6 py-14">
        <div className="max-w-2xl mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 mb-3">
            {t('eyebrow')}
          </div>
          <h2 className="text-[24px] sm:text-[28px] leading-tight font-semibold tracking-tight text-slate-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">
            {t('lede')}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map(item => (
            <div
              key={item.key}
              className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5"
            >
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                {t(`items.${item.key}.name`)}
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                {t(`items.${item.key}.note`)}
              </p>
              <span
                className={`mt-3 inline-block text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded border ${STATUS_STYLES[item.status]}`}
              >
                {t(`status.${item.status}`)}
                {item.year && ` · ${item.year}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
