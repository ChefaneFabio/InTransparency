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
    firstName: 'Marco',
    lastName: 'Colombo',
    university: 'Politecnico di Milano',
    degree: 'MSc Computer Engineering',
    country: 'IT',
    tagline: 'Backend + ML, two-year hackathon track record',
    bio: null,
  },
  trustScore: { verifiedProjects: 4, totalProjects: 5, endorsementCount: 2, universityVerified: true },
  skills: [
    { name: 'Python', industryTerms: [], evidenceSources: ['Thesis', 'GitHub repo', 'Course project'], verifiedLevel: 'Advanced' },
    { name: 'PostgreSQL', industryTerms: [], evidenceSources: ['Thesis', 'Stage project'], verifiedLevel: 'Advanced' },
    { name: 'Machine Learning', industryTerms: [], evidenceSources: ['Thesis', 'Hackathon win'], verifiedLevel: 'Intermediate' },
    { name: 'Docker', industryTerms: [], evidenceSources: ['Stage project'], verifiedLevel: 'Intermediate' },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Real-time anomaly detection for industrial sensors',
      discipline: 'TECHNOLOGY',
      grade: '30L',
      normalizedGrade: 4.0,
      gradeDisplay: '30 cum laude / 30',
      innovationScore: 8.4,
      complexityScore: 9.1,
      marketRelevance: 8.7,
      aiInsights: null,
      verificationStatus: 'VERIFIED',
      skills: ['Python', 'PostgreSQL', 'Machine Learning'],
      endorsements: [
        {
          professorName: 'Prof. Anna Rossi',
          rating: 5,
          endorsementText: 'Marco delivered a production-ready system, not a coursework prototype. The architecture choices were sound under load.',
        },
      ],
    },
  ],
  grades: [],
  prediction: {
    probability: 0.87,
    topFactors: [
      { factor: 'Verified projects', impact: 0.34, description: '4 of 5 projects independently verified by faculty.' },
      { factor: 'Industrial relevance', impact: 0.28, description: 'Thesis topic maps to active demand in 3 sectors.' },
      { factor: 'Endorsement quality', impact: 0.18, description: 'Endorsement cites delivery, not just attendance.' },
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
