'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import { FAQ } from '@/components/engagement/FAQ'
import { StickyCTA } from '@/components/engagement/StickyCTA'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'

/**
 * /for-students — segment funnel for students.
 *
 * Editorial typography aesthetic (matches /pricing). Emerald is the
 * differentiating accent — eyebrows and final-CTA tone use the student
 * brand color while the rest of the page stays slate.
 */

const ACCENT = 'emerald' as const

export default function ForStudentsPage() {
  const t = useTranslations('forStudents')
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
          title={
            <>
              {t('hero.title')}
              <br />
              <span className="text-emerald-300">{t('hero.titleHighlight')}</span>
            </>
          }
          lede={t('hero.subtitle')}
          accent={ACCENT}
          cta={
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.primaryButton')}
              </Link>
              <Link
                href="/demo/ai-search"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.secondaryButton')}
              </Link>
            </div>
          }
        />

        {/* How it works */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('steps.eyebrow', { defaultValue: 'How it works' })}
          title={t('steps.title')}
          lede={t('steps.subtitle')}
        >
          <div className="grid md:grid-cols-3 gap-x-12 gap-y-10">
            {[0, 1, 2].map(i => (
              <div key={i}>
                <div className="text-[42px] font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums leading-none mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white mb-2">
                  {t(`steps.${i}.title`)}
                </h3>
                <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`steps.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Features */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('features.eyebrow', { defaultValue: 'What you get' })}
          title={t('features.title')}
          lede={t('features.subtitle')}
        >
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i}>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {t(`features.${i}.title`)}
                </h3>
                <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`features.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Audience — who it's for */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('audience.eyebrow', { defaultValue: 'Who it’s for' })}
          title={t('audience.title')}
          lede={t('audience.subtitle')}
        >
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-8">
            {[0, 1, 2].map(i => (
              <div key={i} className="border-l-2 border-slate-200 dark:border-slate-800 pl-5">
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-1.5">
                  {t(`audience.${i}.title`)}
                </h3>
                <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`audience.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* FAQ */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow="FAQ"
          title={t('faq.title')}
          width="narrow"
        >
          <FAQ
            items={Array.from({ length: 5 }, (_, i) => ({
              question: t(`faq.items.${i}.question`),
              answer: t(`faq.items.${i}.answer`),
            }))}
          />
        </EditorialSection>

        {/* CTA — slim dark band, emerald button */}
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
                href="/auth/register"
                className="inline-flex items-center justify-center h-11 px-6 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.primaryButton')}
              </Link>
              <Link
                href="/demo/ai-search"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.secondaryButton')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA show={showSticky} text={t('cta.primaryButton')} href="/auth/register" />
    </div>
  )
}
