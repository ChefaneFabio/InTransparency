'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'

const ACCENT = 'emerald' as const

export default function SkillExtractionPage() {
  const t = useTranslations('skillExtraction')

  const steps = Array.from({ length: 4 }, (_, i) => ({
    title: t(`howItWorks.steps.${i}.title`),
    desc: t(`howItWorks.steps.${i}.desc`),
  }))

  const buckets = Array.from({ length: 5 }, (_, i) => ({
    title: t(`buckets.items.${i}.title`),
    desc: t(`buckets.items.${i}.desc`),
  }))

  const evidenceItems = Array.from({ length: 3 }, (_, i) =>
    t(`evidence.items.${i}`)
  )

  const limitItems = Array.from({ length: 3 }, (_, i) => t(`limits.items.${i}`))

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
                href="/demo/ai-search"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.registerCta')}
              </Link>
              <Link
                href="/algorithm-registry"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.demoCta')}
              </Link>
            </div>
          }
        />

        {/* How it works — 4 steps */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('howItWorks.eyebrow')}
          title={t('howItWorks.title')}
          lede={t('howItWorks.lede')}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-slate-200 dark:border-slate-800">
            {steps.map((step, i) => (
              <div
                key={i}
                className="p-6 border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400 mb-3">
                  {String(i + 1).padStart(2, '0')}
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

        {/* Five typed buckets */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('buckets.eyebrow')}
          title={t('buckets.title')}
          lede={t('buckets.lede')}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-l border-t border-slate-200 dark:border-slate-800">
            {buckets.map((bucket, i) => (
              <div
                key={i}
                className="p-6 border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-2">
                  {bucket.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {bucket.desc}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Evidence + limits — two columns, plain section since each column has its own header */}
        <section className="scroll-mt-24 border-b border-slate-200 dark:border-slate-800">
          <div className="container max-w-5xl mx-auto px-6 py-20 lg:py-24">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
            <div>
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400 mb-3">
                {t('evidence.eyebrow')}
              </div>
              <h3 className="text-[22px] font-semibold text-slate-900 dark:text-white mb-3">
                {t('evidence.title')}
              </h3>
              <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400 mb-5">
                {t('evidence.lede')}
              </p>
              <ul className="space-y-3">
                {evidenceItems.map((item, i) => (
                  <li
                    key={i}
                    className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-emerald-600 dark:border-emerald-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-3">
                {t('limits.eyebrow')}
              </div>
              <h3 className="text-[22px] font-semibold text-slate-900 dark:text-white mb-3">
                {t('limits.title')}
              </h3>
              <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400 mb-5">
                {t('limits.lede')}
              </p>
              <ul className="space-y-3">
                {limitItems.map((item, i) => (
                  <li
                    key={i}
                    className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-slate-300 dark:border-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </div>
        </section>

        {/* Final CTA */}
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
                href="/auth/register/recruiter"
                className="inline-flex items-center justify-center h-11 px-6 bg-emerald-500 text-white hover:bg-emerald-400 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.primary')}
              </Link>
              <Link
                href="/demo/ai-search"
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
