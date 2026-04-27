'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import { FAQ } from '@/components/engagement/FAQ'
import { StickyCTA } from '@/components/engagement/StickyCTA'
import GradeNormalizerDemo from '@/components/demo/GradeNormalizerDemo'
import { SavingsCalculator } from '@/components/sections/universities/SavingsCalculator'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'

/**
 * /for-universities — academic-partner segment funnel.
 *
 * Editorial typography aesthetic (matches /pricing). Violet is the
 * differentiating accent. Already structurally slim from prior pass —
 * this revision keeps the same 6 sections (hero, social proof,
 * workspace modules, savings calculator, grade normalizer, FAQ + CTA)
 * and migrates them to the editorial pattern.
 */

const ACCENT = 'violet' as const

export default function ForUniversitiesPage() {
  const t = useTranslations('forUniversities')
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const modules = [
    { key: 'm1', title: t('workspaceModules.m1.title', { defaultValue: 'Mediation Inbox' }), desc: t('workspaceModules.m1.desc', { defaultValue: 'Every recruiter message to your students is reviewed by your staff first. Approve, edit, or reject. Full audit trail.' }) },
    { key: 'm2', title: t('workspaceModules.m2.title', { defaultValue: 'Offer Moderation' }), desc: t('workspaceModules.m2.desc', { defaultValue: 'Job offers tied to your institution go to pending approval. Block offers that violate stage rules before students see them.' }) },
    { key: 'm3', title: t('workspaceModules.m3.title', { defaultValue: 'Company CRM' }), desc: t('workspaceModules.m3.desc', { defaultValue: 'Drag-and-drop kanban from first contact to signed convention. Track every company relationship your career office manages.' }) },
    { key: 'm4', title: t('workspaceModules.m4.title', { defaultValue: 'Placement Pipeline' }), desc: t('workspaceModules.m4.desc', { defaultValue: 'Full tirocinio lifecycle — hours log, mid/final evaluations, deadlines, convention auto-generation.' }) },
  ]

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
                href="/contact?subject=university-pilot"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.demoCta')}
              </Link>
              <Link
                href="/auth/register/academic-partner"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.registerCta')}
              </Link>
            </div>
          }
        />

        {/* Social proof — UniBg pilot + Start Cup, editorial cards */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('socialProof.eyebrow', { defaultValue: 'Real, not staged' })}
          title={t('socialProof.title')}
        >
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="border-l-2 border-violet-600 dark:border-violet-400 pl-6 py-2">
              <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">
                {t('socialProof.unibg.title')}
              </h3>
              <p className="mt-1 text-[13px] text-slate-500 uppercase tracking-wider">
                {t('socialProof.unibg.subtitle')} · 2026
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                {t('socialProof.unibg.description')}
              </p>
              <div className="mt-3 text-[12px] text-violet-700 dark:text-violet-400 uppercase tracking-[0.14em]">
                {t('socialProof.unibg.status')}
              </div>
            </div>
            <div className="border-l-2 border-amber-500 pl-6 py-2">
              <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">
                {t('socialProof.startCup.title')}
              </h3>
              <p className="mt-1 text-[13px] text-slate-500 uppercase tracking-wider">
                {t('socialProof.startCup.subtitle')} · 2025
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                {t('socialProof.startCup.description')}
              </p>
              <div className="mt-3 text-[12px] text-amber-700 dark:text-amber-400 uppercase tracking-[0.14em]">
                Start Cup Bergamo
              </div>
            </div>
          </div>
        </EditorialSection>

        {/* Workspace modules — editorial 4-column grid, no icon ornaments */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('workspaceModules.eyebrow', { defaultValue: 'Institutional workspace' })}
          title={t('workspaceModules.title', { defaultValue: 'Built for the career office — not just another job board' })}
          lede={t('workspaceModules.subtitle', { defaultValue: 'Four modules that turn placement from spreadsheets into an auditable workflow. Free Core gets full read access; Premium unlocks automation and unlimited AI.' })}
          endNote={t('workspaceModules.compliance', { defaultValue: 'Every write is logged for AI Act compliance. Students retain GDPR Art. 22 rights on every automated decision.' })}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-slate-200 dark:border-slate-800">
            {modules.map((m, i) => (
              <div
                key={m.key}
                className="p-6 border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-violet-700 dark:text-violet-400 mb-3">
                  M{i + 1}
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {m.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/pricing?for=institutions"
              className="inline-flex items-center justify-center h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
            >
              {t('workspaceModules.pricingCta', { defaultValue: 'See pricing' })}
            </Link>
            <Link
              href="/contact?subject=institutional-demo"
              className="inline-flex items-center justify-center h-11 px-6 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md text-sm font-medium transition-colors"
            >
              {t('workspaceModules.demoCta', { defaultValue: 'Request a demo' })}
            </Link>
          </div>
        </EditorialSection>

        {/* Savings calculator — keep the existing component, slim wrapper */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('savings.eyebrow', { defaultValue: 'Hard-money value' })}
          title={t('savings.title', { defaultValue: 'What you save vs your current placement workflow' })}
          lede={t('savings.lede', { defaultValue: 'Set your cohort size — see annual hours saved and what they cost in staff time.' })}
        >
          <SavingsCalculator />
        </EditorialSection>

        {/* Grade normalizer demo */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('demos.eyebrow', { defaultValue: 'Try a live tool' })}
          title={t('demos.gradeNormalizer.title')}
          lede={t('demos.gradeNormalizer.description')}
          width="narrow"
        >
          <div className="max-w-xl mx-auto">
            <GradeNormalizerDemo />
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

        {/* CTA — slim dark band, violet button */}
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
                href="/contact?subject=university-pilot"
                className="inline-flex items-center justify-center h-11 px-6 bg-violet-600 text-white hover:bg-violet-500 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.demoButton')}
              </Link>
              <Link
                href="/auth/register/academic-partner"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.registerButton')}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-slate-400 uppercase tracking-[0.12em]">
              <span>{t('cta.features.free')}</span>
              <span className="text-slate-700">·</span>
              <span>{t('cta.features.gdpr')}</span>
              <span className="text-slate-700">·</span>
              <span>{t('cta.features.setup')}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA show={showSticky} text={t('cta.demoButton')} href="/contact?subject=university-pilot" />
    </div>
  )
}
