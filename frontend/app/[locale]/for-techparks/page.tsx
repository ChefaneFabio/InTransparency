'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'

/**
 * /for-techparks — innovation hub / tech park segment.
 *
 * Editorial pattern (matches /for-universities, /pricing, /decision-pack).
 * Amber accent — distinct from violet (universities) and blue (companies),
 * picks up the Start Cup color the brand is already using elsewhere.
 *
 * Audience is innovation hub managers, not recruiters: they sign a
 * partnership agreement that lets their resident companies hire through
 * the platform. The recruiter capability surface stays on /for-companies;
 * this page sells the partnership conversation.
 */

const ACCENT = 'amber' as const

export default function ForTechparksPage() {
  const t = useTranslations('forTechparks')

  const benefits = Array.from({ length: 4 }, (_, i) => ({
    title: t(`benefits.items.${i}.title`),
    desc: t(`benefits.items.${i}.desc`),
  }))

  const steps = Array.from({ length: 3 }, (_, i) => ({
    title: t(`process.steps.${i}.title`),
    desc: t(`process.steps.${i}.desc`),
  }))

  const audiences = Array.from({ length: 3 }, (_, i) => ({
    title: t(`audience.items.${i}.title`),
    desc: t(`audience.items.${i}.desc`),
  }))

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <main>
        <EditorialHero
          eyebrow={t('hero.eyebrow')}
          title={t('hero.title')}
          lede={t('hero.subtitle')}
          accent={ACCENT}
          cta={
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact?subject=techpark-partnership"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.primaryCta')}
              </Link>
              <Link
                href="/for-companies"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
          }
        />

        {/* Four benefits — editorial 4-column grid */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('benefits.eyebrow')}
          title={t('benefits.title')}
          lede={t('benefits.lede')}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-slate-200 dark:border-slate-800">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-6 border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400 mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2 leading-snug">
                  {b.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* How partnership starts — 3 steps */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('process.eyebrow')}
          title={t('process.title')}
          lede={t('process.lede')}
        >
          <div className="grid sm:grid-cols-3 border-l border-t border-slate-200 dark:border-slate-800">
            {steps.map((step, i) => (
              <div
                key={i}
                className="p-6 border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400 mb-3">
                  {`Step ${i + 1}`}
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Audience — 3 hub types */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('audience.eyebrow')}
          title={t('audience.title')}
        >
          <div className="grid sm:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <div
                key={i}
                className="border-l-2 border-amber-500 pl-5 py-2"
              >
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-2">
                  {a.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* CTA — slim dark band, amber primary */}
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
                href="/contact?subject=techpark-partnership"
                className="inline-flex items-center justify-center h-11 px-6 bg-amber-500 text-slate-900 hover:bg-amber-400 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.primary')}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.secondary')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
