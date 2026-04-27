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
 * /for-high-schools — high school segment funnel.
 *
 * Editorial typography aesthetic. Emerald is the accent — distinct
 * from violet (universities) and amber (ITS). Differentiation focuses
 * on PCTO compliance and the portfolio handoff to university:
 * PCTO completion table (in place of the universities savings
 * calculator) and a JSON portfolio-handoff preview (in place of the
 * grade normalizer demo).
 */

const ACCENT = 'emerald' as const

export default function ForHighSchoolsPage() {
  const t = useTranslations('forHighSchools')
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const modules = ['m1', 'm2', 'm3', 'm4'] as const
  const trackRows = ['0', '1', '2'] as const

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
                href="/contact?subject=high-school-pilot"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.demoCta')}
              </Link>
              <Link
                href="/auth/register/academic-partner?type=high-school"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.registerCta')}
              </Link>
            </div>
          }
        />

        {/* Social proof — PCTO + Orientamento */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('socialProof.eyebrow')}
          title={t('socialProof.title')}
        >
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="border-l-2 border-emerald-600 dark:border-emerald-400 pl-6 py-2">
              <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">
                {t('socialProof.pcto.title')}
              </h3>
              <p className="mt-1 text-[13px] text-slate-500 uppercase tracking-wider">
                {t('socialProof.pcto.subtitle')}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                {t('socialProof.pcto.description')}
              </p>
              <div className="mt-3 text-[12px] text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.14em]">
                {t('socialProof.pcto.status')}
              </div>
            </div>
            <div className="border-l-2 border-slate-700 dark:border-slate-300 pl-6 py-2">
              <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">
                {t('socialProof.orientation.title')}
              </h3>
              <p className="mt-1 text-[13px] text-slate-500 uppercase tracking-wider">
                {t('socialProof.orientation.subtitle')}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                {t('socialProof.orientation.description')}
              </p>
              <div className="mt-3 text-[12px] text-slate-700 dark:text-slate-300 uppercase tracking-[0.14em]">
                {t('socialProof.orientation.status')}
              </div>
            </div>
          </div>
        </EditorialSection>

        {/* Workspace modules — 4-column editorial grid */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('workspaceModules.eyebrow')}
          title={t('workspaceModules.title')}
          lede={t('workspaceModules.subtitle')}
          endNote={t('workspaceModules.compliance')}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-slate-200 dark:border-slate-800">
            {modules.map((key, i) => (
              <div
                key={key}
                className="p-6 border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400 mb-3">
                  M{i + 1}
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {t(`workspaceModules.${key}.title`)}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`workspaceModules.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/pricing?for=institutions"
              className="inline-flex items-center justify-center h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
            >
              {t('workspaceModules.pricingCta')}
            </Link>
            <Link
              href="/contact?subject=high-school-demo"
              className="inline-flex items-center justify-center h-11 px-6 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md text-sm font-medium transition-colors"
            >
              {t('workspaceModules.demoCta')}
            </Link>
          </div>
        </EditorialSection>

        {/* PCTO compliance block — replaces savings calculator */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('compliance.eyebrow')}
          title={t('compliance.title')}
          lede={t('compliance.lede')}
        >
          <div className="border border-slate-200 dark:border-slate-800 p-8 bg-white dark:bg-slate-950 max-w-4xl">
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-6">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
                  {t('compliance.metricLabel')}
                </div>
                <div className="text-[64px] leading-none font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {t('compliance.metricValue')}
                </div>
              </div>
              <div className="text-[13px] text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-6">
                {t('compliance.metricThreshold')}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-y border-slate-200 dark:border-slate-800">
                    <th className="py-2 pr-4 font-medium text-slate-500 uppercase tracking-[0.12em] text-[11px]">
                      {t('compliance.rows.header.track')}
                    </th>
                    <th className="py-2 px-4 font-medium text-slate-500 uppercase tracking-[0.12em] text-[11px] text-right">
                      {t('compliance.rows.header.students')}
                    </th>
                    <th className="py-2 px-4 font-medium text-slate-500 uppercase tracking-[0.12em] text-[11px] text-right">
                      {t('compliance.rows.header.required')}
                    </th>
                    <th className="py-2 px-4 font-medium text-slate-500 uppercase tracking-[0.12em] text-[11px] text-right">
                      {t('compliance.rows.header.completed')}
                    </th>
                    <th className="py-2 pl-4 font-medium text-slate-500 uppercase tracking-[0.12em] text-[11px] text-right">
                      {t('compliance.rows.header.missing')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trackRows.map(idx => (
                    <tr key={idx} className="border-b border-slate-200 dark:border-slate-800">
                      <td className="py-3 pr-4 text-slate-900 dark:text-white">
                        {t(`compliance.rows.${idx}.track`)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                        {t(`compliance.rows.${idx}.students`)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                        {t(`compliance.rows.${idx}.required`)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-900 dark:text-white font-medium tabular-nums">
                        {t(`compliance.rows.${idx}.completed`)}
                      </td>
                      <td className="py-3 pl-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                        {t(`compliance.rows.${idx}.missing`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-[12px] italic text-slate-500">{t('compliance.footnote')}</p>
          </div>
        </EditorialSection>

        {/* Portfolio handoff JSON preview — replaces grade normalizer demo */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('demo.eyebrow')}
          title={t('demo.title')}
          lede={t('demo.lede')}
          width="narrow"
        >
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden max-w-3xl">
            <div className="border-b border-slate-800 px-4 py-2.5 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">{t('demo.fileLabel')}</span>
            </div>
            <pre className="p-5 text-[12px] leading-[1.65] font-mono overflow-x-auto whitespace-pre">
              {t('demo.preview')}
            </pre>
          </div>
        </EditorialSection>

        {/* FAQ */}
        <EditorialSection
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

        {/* Final CTA — slim dark band, emerald button */}
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
                href="/contact?subject=high-school-pilot"
                className="inline-flex items-center justify-center h-11 px-6 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.demoButton')}
              </Link>
              <Link
                href="/auth/register/academic-partner?type=high-school"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.registerButton')}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-slate-400 uppercase tracking-[0.12em]">
              <span>{t('cta.features.free')}</span>
              <span className="text-slate-700">·</span>
              <span>{t('cta.features.gdprk')}</span>
              <span className="text-slate-700">·</span>
              <span>{t('cta.features.setup')}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA show={showSticky} text={t('cta.demoButton')} href="/contact?subject=high-school-pilot" />
    </div>
  )
}
