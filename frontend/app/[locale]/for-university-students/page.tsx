'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import { StickyCTA } from '@/components/engagement/StickyCTA'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'
import { Check, X } from 'lucide-react'

/**
 * /for-university-students — university-segment student page.
 *
 * Slimmer than the canonical /for-students: hero + metrics + comparison
 * + CTA. Segment-specific anchor messaging (ESCO normalization, MIUR
 * grade context, optional supervisor endorsement). Violet accent
 * matches the institutional /for-universities family.
 */

const ACCENT = 'violet' as const
const METRICS = ['0', '1', '2'] as const
const COMPARE_ROWS = ['0', '1', '2', '3'] as const

export default function ForUniversityStudentsPage() {
  const t = useTranslations('forUniversityStudents')
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <main>
        <EditorialHero
          eyebrow={t('hero.badge')}
          title={t('hero.title')}
          lede={t('hero.subtitle')}
          accent={ACCENT}
          cta={
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register/student?type=university"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.cta')}
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
          }
        />

        <EditorialSection
          accent={ACCENT}
          eyebrow={t('metrics.title')}
          title={t('metrics.title')}
          lede={t('metrics.subtitle')}
        >
          <div className="grid sm:grid-cols-3 gap-x-10 gap-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
            {METRICS.map(idx => (
              <div key={idx}>
                <div className="text-[40px] font-semibold tracking-tight text-violet-600 dark:text-violet-400 tabular-nums leading-none mb-3">
                  {t(`metrics.items.${idx}.value`)}
                </div>
                <div className="text-[15px] font-medium text-slate-900 dark:text-white mb-2 leading-snug">
                  {t(`metrics.items.${idx}.label`)}
                </div>
                <div className="text-[13px] italic text-slate-500 leading-snug">
                  {t(`metrics.items.${idx}.source`)}
                </div>
              </div>
            ))}
          </div>
        </EditorialSection>

        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('comparison.title')}
          title={t('comparison.title')}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-950">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-red-700 dark:text-red-400 mb-4">
                {t('comparison.before.label')}
              </div>
              <ul className="space-y-2.5">
                {COMPARE_ROWS.map(i => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-slate-600 dark:text-slate-400">
                    <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{t(`comparison.before.items.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-violet-300 dark:border-violet-800 p-6 bg-violet-50/40 dark:bg-violet-950/10">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-violet-700 dark:text-violet-400 mb-4">
                {t('comparison.after.label')}
              </div>
              <ul className="space-y-2.5">
                {COMPARE_ROWS.map(i => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-slate-900 dark:text-white">
                    <Check className="h-4 w-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>{t(`comparison.after.items.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </EditorialSection>

        <section className="bg-slate-950 text-white">
          <div className="container max-w-3xl mx-auto px-6 py-20 lg:py-24 text-center">
            <h2 className="text-[34px] leading-[1.15] font-semibold tracking-tight">
              {t('cta.title')}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-slate-300 max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register/student?type=university"
                className="inline-flex items-center justify-center h-11 px-6 bg-violet-600 text-white hover:bg-violet-500 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.button')}
              </Link>
              <Link
                href="/for-students"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA show={showSticky} text={t('cta.button')} href="/auth/register/student?type=university" />
    </div>
  )
}
