'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'
import DecisionPackPreview from '@/components/demo/DecisionPackPreview'
import type { DecisionPackData } from '@/lib/decision-pack'

const ACCENT = 'blue' as const

const SAMPLE_PACK: DecisionPackData = {
  candidate: {
    id: 'sample',
    firstName: 'Sofia',
    lastName: 'Conti',
    university: 'Università degli Studi di Milano',
    degree: 'MD, Medicine and Surgery (6-year)',
    country: 'IT',
    tagline: 'Emergency medicine track, hospital-data thesis',
    bio: null,
  },
  trustScore: { verifiedProjects: 4, totalProjects: 4, endorsementCount: 1, universityVerified: true },
  skills: [
    { name: 'Clinical reasoning', industryTerms: [], evidenceSources: ['Thesis', 'ED rotation report', 'Internal med rotation'], verifiedLevel: 'Advanced' },
    { name: 'Statistical analysis (R)', industryTerms: [], evidenceSources: ['Thesis', 'Biostatistics course project'], verifiedLevel: 'Advanced' },
    { name: 'Hospital protocol design', industryTerms: [], evidenceSources: ['Thesis', 'Stage at Niguarda'], verifiedLevel: 'Intermediate' },
    { name: 'Medical English', industryTerms: [], evidenceSources: ['Thesis', 'SIMEU conference poster'], verifiedLevel: 'Advanced' },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Triage protocol redesign for ED throughput — Niguarda Hospital',
      discipline: 'HEALTHCARE',
      grade: '110L',
      normalizedGrade: 4.0,
      gradeDisplay: '110 cum laude / 110',
      innovationScore: 8.6,
      complexityScore: 9.0,
      marketRelevance: 9.3,
      aiInsights: null,
      verificationStatus: 'VERIFIED',
      skills: ['Clinical reasoning', 'Statistical analysis (R)', 'Hospital protocol design'],
      endorsements: [
        {
          professorName: 'Prof. Marco Bianchi',
          rating: 5,
          endorsementText: 'Sofia ran the protocol pilot end-to-end. The follow-up data she produced is now being used to inform the regional triage standard.',
        },
      ],
    },
  ],
  grades: [],
  prediction: {
    probability: 0.92,
    topFactors: [
      { factor: 'Verified clinical exposure', impact: 0.36, description: '4 of 4 hospital rotations independently signed off by attending physicians.' },
      { factor: 'Quantitative rigor', impact: 0.30, description: 'Thesis includes regression analysis on 8,400 ED admissions.' },
      { factor: 'Endorsement quality', impact: 0.20, description: 'Endorsement cites measurable impact on regional protocol, not attendance.' },
    ],
  },
  softSkills: null,
  matchScore: null,
  generatedAt: new Date().toISOString(),
}

export default function DecisionPackPage() {
  const t = useTranslations('decisionPack')

  const contents = Array.from({ length: 6 }, (_, i) => ({
    title: t(`contents.items.${i}.title`),
    desc: t(`contents.items.${i}.desc`),
  }))

  const readers = Array.from({ length: 4 }, (_, i) => ({
    title: t(`whoUses.items.${i}.title`),
    desc: t(`whoUses.items.${i}.desc`),
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
                href="/auth/register/recruiter"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.registerCta')}
              </Link>
              <Link
                href="/demo/ai-search"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('hero.demoCta')}
              </Link>
            </div>
          }
        />

        {/* Six sections in the dossier */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('contents.eyebrow')}
          title={t('contents.title')}
          lede={t('contents.lede')}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-slate-200 dark:border-slate-800">
            {contents.map((item, i) => (
              <div
                key={i}
                className="p-6 border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400 mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Live preview — render the actual component the recruiter sees */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('preview.eyebrow')}
          title={t('preview.title')}
          lede={t('preview.lede')}
        >
          <div className="max-w-2xl mx-auto">
            <DecisionPackPreview data={SAMPLE_PACK} />
            <p className="mt-6 text-xs text-slate-500 text-center italic">
              {t('preview.note')}
            </p>
          </div>
        </EditorialSection>

        {/* Who reads it */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('whoUses.eyebrow')}
          title={t('whoUses.title')}
          lede={t('whoUses.lede')}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {readers.map((item, i) => (
              <div
                key={i}
                className="border-l-2 border-blue-600 dark:border-blue-400 pl-5 py-2"
              >
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Speed */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('speed.eyebrow')}
          title={t('speed.title')}
          width="narrow"
        >
          <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            {t('speed.lede')}
          </p>
        </EditorialSection>

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
                className="inline-flex items-center justify-center h-11 px-6 bg-blue-500 text-white hover:bg-blue-400 rounded-md text-sm font-medium transition-colors"
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
