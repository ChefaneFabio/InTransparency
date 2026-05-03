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

        {/* Worked example — input README excerpt → typed-bucket badges */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('proof.eyebrow')}
          title={t('proof.title')}
          lede={t('proof.lede')}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input column */}
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-3">
                {t('proof.inputLabel')}
              </div>
              <pre className="text-[12px] leading-relaxed font-mono p-5 rounded-lg bg-slate-950 text-slate-200 overflow-x-auto whitespace-pre-wrap">
{`# Real-time anomaly detection for industrial sensors

Master thesis project · Politecnico di Milano · 2025

Built a streaming pipeline that ingests telemetry from
Brembo's brake-disc QA line (~3,200 events/sec) and flags
defective batches before they leave the cell.

Stack: Python 3.11, FastAPI, PostgreSQL + TimescaleDB,
Apache Kafka, Docker, GitHub Actions. Forecasting model:
LSTM autoencoder (PyTorch), trained on 14 months of
historical sensor data.

Worked with Brembo's manufacturing team for the spec.
Wrote the architecture doc, ran two design reviews with
the QA leads, presented the final report in English to
the operations director.`}
              </pre>
            </div>

            {/* Output column — typed buckets with badges */}
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400 mb-3">
                {t('proof.outputLabel')}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-2">Hard skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'FastAPI', 'PostgreSQL', 'TimescaleDB', 'Kafka', 'Docker', 'PyTorch', 'CI/CD'].map(s => (
                      <span key={s} className="text-[11px] px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-2">Soft skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Stakeholder collaboration', 'Architecture documentation', 'Design review facilitation', 'Technical presentation'].map(s => (
                      <span key={s} className="text-[11px] px-2 py-1 rounded bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-2">Design skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-700 italic">none extracted</span>
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-2">Domain knowledge</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Industrial QA / manufacturing', 'Streaming telemetry', 'Time-series anomaly detection'].map(s => (
                      <span key={s} className="text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-2">Languages</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Italian (native)', 'English (B2+, presentations)'].map(s => (
                      <span key={s} className="text-[11px] px-2 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-[12px] text-slate-500 italic max-w-3xl">
            {t('proof.noteLabel')}
          </p>
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
