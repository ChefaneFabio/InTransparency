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
import { Check, X } from 'lucide-react'

/**
 * /for-students — canonical student segment funnel.
 *
 * Editorial typography aesthetic (matches /for-universities/-its/-high-schools).
 * Emerald is the student-perspective accent.
 *
 * 2026-04-28 refresh: drops the old `titleHighlight` color-flip pattern,
 * adds the Talentware-influenced sections used across company pages
 * (hard-numbers row + X/✓ pain-value comparison + persona blurbs) and
 * the evidence-row visual signal shipped on /explore + the public
 * portfolio. Secondary CTA no longer points to /demo/ai-search (the
 * recruiter Smart Search demo, which made no sense for students).
 */

const ACCENT = 'emerald' as const

const METRICS = ['0', '1', '2'] as const
const PERSONAS = ['0', '1', '2'] as const
const COMPARE_ROWS = ['0', '1', '2', '3', '4'] as const
const EVIDENCE_ITEMS = ['0', '1', '2', '3'] as const

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
          title={t('hero.title')}
          lede={t('hero.subtitle')}
          accent={ACCENT}
          cta={
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register/student"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.primaryButton')}
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.secondaryButton')}
              </Link>
            </div>
          }
        />

        {/* Hard-numbers row */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('metrics.title')}
          title={t('metrics.title')}
          lede={t('metrics.subtitle')}
        >
          <div className="grid sm:grid-cols-3 gap-x-10 gap-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
            {METRICS.map(idx => (
              <div key={idx}>
                <div className="text-[40px] font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums leading-none mb-3">
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

        {/* Pain vs value */}
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
            <div className="border border-emerald-300 dark:border-emerald-800 p-6 bg-emerald-50/40 dark:bg-emerald-950/10">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400 mb-4">
                {t('comparison.after.label')}
              </div>
              <ul className="space-y-2.5">
                {COMPARE_ROWS.map(i => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-slate-900 dark:text-white">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{t(`comparison.after.items.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </EditorialSection>

        {/* How it works — existing 3 numbered steps */}
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

        {/* Evidence row — what the AI extracts */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('evidence.title')}
          title={t('evidence.title')}
          width="narrow"
        >
          <div className="border-l-2 border-emerald-600 dark:border-emerald-400 pl-6 py-2">
            <ul className="space-y-3 text-[16px] text-slate-700 dark:text-slate-300">
              {EVIDENCE_ITEMS.map(i => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{t(`evidence.items.${i}`)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] italic text-slate-500 leading-relaxed max-w-2xl">
              {t('evidence.explainer')}
            </p>
          </div>
        </EditorialSection>

        {/* Personas — 3 student archetypes */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('personas.title')}
          title={t('personas.title')}
        >
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-8">
            {PERSONAS.map(idx => (
              <div key={idx} className="border-l-2 border-slate-200 dark:border-slate-800 pl-5">
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {t(`personas.items.${idx}.title`)}
                </h3>
                <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`personas.items.${idx}.description`)}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* FAQ — preserved from previous version */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow="FAQ"
          title={t('faq.title')}
          lede={t('faq.subtitle')}
          width="narrow"
        >
          <FAQ
            items={Array.from({ length: 5 }, (_, i) => ({
              question: t(`faq.items.${i}.question`),
              answer: t(`faq.items.${i}.answer`),
            }))}
          />
        </EditorialSection>

        {/* CTA — slim dark band */}
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
                href="/auth/register/student"
                className="inline-flex items-center justify-center h-11 px-6 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.primaryButton')}
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.secondaryButton')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA show={showSticky} text={t('cta.primaryButton')} href="/auth/register/student" />
    </div>
  )
}
