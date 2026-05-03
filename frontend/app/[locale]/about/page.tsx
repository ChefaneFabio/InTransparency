'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'

/**
 * /about — long-form editorial.
 *
 * Slate accent (no segment color — about is brand-neutral, the story
 * page that all three segments share). Narrow column body type for the
 * mission/story sections; wider grids for values + business model.
 * Hero carries the two-column "resume problem vs InTransparency way"
 * comparison as a quiet typographic split — no glassmorphism, no
 * tinted cards.
 */

export default function AboutPage() {
  const t = useTranslations('about')
  const tBrand = useTranslations('brand')

  const valueItems = [0, 1, 2, 3]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <main>
        <EditorialHero
          eyebrow={t('hero.badge')}
          title={t('hero.title')}
          lede={t('hero.description')}
          accent="slate"
        />

        {/* Brand spine — quiet display band carrying the tagline */}
        <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container max-w-4xl mx-auto px-6 py-16 lg:py-20 text-center">
            <p className="text-[28px] sm:text-[36px] leading-[1.2] font-display italic text-slate-900 dark:text-white">
              {tBrand('tagline')}
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              {tBrand('taglineLong')}
            </p>
          </div>
        </section>

        {/* Resume problem vs InTransparency way — slim two-column comparison */}
        <EditorialSection
          tone="muted"
          eyebrow={t('hero.comparisonEyebrow', { defaultValue: 'The shift' })}
          title={t('hero.comparisonTitle', { defaultValue: 'How hiring decisions are made today — and how we change it' })}
        >
          <div className="grid md:grid-cols-2 border border-slate-200 dark:border-slate-800">
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mb-4">
                {t('resumeProblem.title')}
              </div>
              <ul className="space-y-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                {[0, 1, 2, 3, 4].map(i => (
                  <li key={i} className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                    {t(`resumeProblem.items.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-slate-50/60 dark:bg-slate-900/40">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-900 dark:text-white mb-4">
                {t('intransparencyWay.title')}
              </div>
              <ul className="space-y-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                {[0, 1, 2, 3, 4].map(i => (
                  <li key={i} className="border-l-2 border-slate-900 dark:border-white pl-4">
                    {t(`intransparencyWay.items.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </EditorialSection>

        {/* Why we're different — challenge vs solution + metrics */}
        <EditorialSection
          eyebrow={t('whyDifferent.badge')}
          title={t('whyDifferent.title')}
          lede={t('whyDifferent.subtitle')}
        >
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div>
              <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white mb-5">
                {t('whyDifferent.challenge.title')}
              </h3>
              <ul className="space-y-5">
                {[0, 1, 2, 3].map(i => (
                  <li key={i} className="border-l-2 border-slate-300 dark:border-slate-700 pl-5">
                    <strong className="block text-[15px] font-semibold text-slate-900 dark:text-white">
                      {t(`whyDifferent.challenge.items.${i}.title`)}
                    </strong>
                    <p className="mt-1 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {t(`whyDifferent.challenge.items.${i}.description`)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white mb-5">
                {t('whyDifferent.solution.title')}
              </h3>
              <ul className="space-y-5">
                {[0, 1, 2, 3].map(i => (
                  <li key={i} className="border-l-2 border-slate-900 dark:border-white pl-5">
                    <strong className="block text-[15px] font-semibold text-slate-900 dark:text-white">
                      {t(`whyDifferent.solution.items.${i}.title`)}
                    </strong>
                    <p className="mt-1 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {t(`whyDifferent.solution.items.${i}.description`)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mb-5">
              {t('whyDifferent.result.title')}
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div key={i}>
                  <div className="text-[40px] font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums leading-none">
                    {t(`whyDifferent.result.metrics.${i}.value`)}
                  </div>
                  <div className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">
                    {t(`whyDifferent.result.metrics.${i}.label`)}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 max-w-2xl">
              {t('whyDifferent.result.tagline')}
            </p>
          </div>
        </EditorialSection>

        {/* Mission + Story — narrow column, serif pull-quote */}
        <EditorialSection
          tone="muted"
          eyebrow={t('mission.eyebrow', { defaultValue: 'Our mission' })}
          title={t('mission.title')}
          lede={t('mission.description')}
          width="narrow"
        >
          <blockquote className="my-10 border-l-2 border-slate-900 dark:border-white pl-6 py-2">
            <p className="text-[22px] leading-snug font-serif italic text-slate-900 dark:text-white">
              {t('mission.quote')}
            </p>
            <footer className="mt-3 text-[13px] uppercase tracking-[0.14em] text-slate-500">
              {t('mission.quoteAuthor')}
            </footer>
          </blockquote>

          <div className="mt-12">
            <h3 className="text-[20px] font-semibold text-slate-900 dark:text-white mb-5">
              {t('mission.story.title')}
            </h3>
            <div className="space-y-5 text-[16px] leading-[1.7] text-slate-700 dark:text-slate-300">
              <p>{t('mission.story.paragraphs.0')}</p>
              <p>{t('mission.story.paragraphs.1')}</p>
              <p>{t('mission.story.paragraphs.2')}</p>
              <p className="text-slate-900 dark:text-white font-medium">
                {t('mission.story.paragraphs.3')}
              </p>
            </div>
          </div>
        </EditorialSection>

        {/* Values — 4-column editorial grid */}
        <EditorialSection
          eyebrow={t('values.eyebrow', { defaultValue: 'What we stand for' })}
          title={t('values.title')}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
            {valueItems.map(idx => (
              <div key={idx} className="border-t-2 border-slate-900 dark:border-white pt-5">
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {t(`values.items.${idx}.title`)}
                </h3>
                <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`values.items.${idx}.description`)}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Business model — 3-column + philosophy */}
        <EditorialSection
          tone="muted"
          eyebrow={t('businessModel.eyebrow', { defaultValue: 'How we make money' })}
          title={t('businessModel.title')}
          lede={t('businessModel.subtitle')}
        >
          <div className="grid md:grid-cols-3 border-l border-t border-slate-200 dark:border-slate-800 mb-10">
            {([
              { titleKey: 'students.title', descKey: 'students.description', noteLabel: 'students.premiumLabel', noteText: 'students.premiumDescription' },
              { titleKey: 'universities.title', descKey: 'universities.description', noteLabel: 'universities.enterpriseLabel', noteText: 'universities.enterpriseDescription' },
              { titleKey: 'companies.title', descKey: 'companies.description', noteLabel: 'companies.enterpriseLabel', noteText: 'companies.enterpriseDescription' },
            ] as const).map((col, i) => (
              <div key={i} className="p-6 border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-3">
                  0{i + 1}
                </div>
                <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white mb-3">
                  {t(`businessModel.${col.titleKey}`)}
                </h3>
                <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                  {t(`businessModel.${col.descKey}`)}
                </p>
                <div className="text-[13px] text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-3">
                  <strong className="text-slate-700 dark:text-slate-300">{t(`businessModel.${col.noteLabel}`)}</strong>{' '}
                  {t(`businessModel.${col.noteText}`)}
                </div>
              </div>
            ))}
          </div>

          {/* Philosophy block */}
          <div className="border-l-2 border-slate-900 dark:border-white pl-6 py-2 max-w-3xl">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mb-4">
              {t('businessModel.philosophy.title')}
            </div>
            <div className="space-y-4 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
              <p>
                <strong className="text-slate-900 dark:text-white">{t('businessModel.philosophy.studentsBold')}</strong>{' '}
                {t('businessModel.philosophy.studentsText')}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">{t('businessModel.philosophy.universitiesBold')}</strong>{' '}
                {t('businessModel.philosophy.universitiesText')}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">{t('businessModel.philosophy.companiesBold')}</strong>{' '}
                {t('businessModel.philosophy.companiesText')}
              </p>
            </div>
          </div>
        </EditorialSection>

        {/* Vision + kill-resume merged */}
        <EditorialSection
          eyebrow={t('vision.eyebrow', { defaultValue: 'Where we’re going' })}
          title={t('vision.title')}
          lede={t('vision.subtitle')}
        >
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[0, 1, 2].map(idx => (
              <div key={idx} className="border-t border-slate-200 dark:border-slate-800 pt-5">
                <div className="text-[18px] font-semibold text-slate-900 dark:text-white">
                  {t(`vision.stats.${idx}.label`)}
                </div>
                <div className="mt-1.5 text-[14px] text-slate-500">
                  {t(`vision.stats.${idx}.sublabel`)}
                </div>
              </div>
            ))}
          </div>

          {/* Resume vs portfolio — slim two-column */}
          <div className="border border-slate-200 dark:border-slate-800 grid grid-cols-2 max-w-2xl">
            <div className="p-6 border-r border-slate-200 dark:border-slate-800">
              <div className="text-[40px] font-semibold tracking-tight text-slate-500 tabular-nums leading-none">
                {t('killResume.oldYear')}
              </div>
              <div className="mt-2 text-[13px] text-slate-500 uppercase tracking-wider">
                {t('killResume.oldLabel')}
              </div>
            </div>
            <div className="p-6 bg-slate-50/60 dark:bg-slate-900/40">
              <div className="text-[40px] font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums leading-none">
                {t('killResume.newYear')}
              </div>
              <div className="mt-2 text-[13px] text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t('killResume.newLabel')}
              </div>
            </div>
          </div>
          <p className="mt-8 text-[16px] leading-relaxed text-slate-700 dark:text-slate-300 max-w-2xl">
            {t('killResume.closing')}
          </p>
        </EditorialSection>

        {/* Final CTA — slim dark band */}
        <section className="bg-slate-950 text-white">
          <div className="container max-w-3xl mx-auto px-6 py-20 lg:py-24 text-center">
            <h2 className="text-[34px] leading-[1.15] font-semibold tracking-tight">
              {t('joinMovement.title')}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-slate-300 max-w-xl mx-auto">
              {t('joinMovement.description')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('joinMovement.primaryButton')}
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center h-11 px-6 border border-white/30 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
              >
                {t('joinMovement.secondaryButton')}
              </Link>
            </div>
            <p className="mt-8 text-[13px] text-slate-400">
              {t('joinMovement.companiesPrefix')}{' '}
              <Link href="/auth/register" className="text-white underline underline-offset-4 hover:no-underline">
                {t('joinMovement.companiesLink')}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
