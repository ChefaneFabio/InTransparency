'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'
import { ArrowRight } from 'lucide-react'

const ACCENT = 'slate' as const

export default function IntegrationsIndexPage() {
  const t = useTranslations('integrationsIndex')

  const shipping = Array.from({ length: 2 }, (_, i) => ({
    title: t(`shipping.items.${i}.title`),
    desc: t(`shipping.items.${i}.desc`),
    linkLabel: t(`shipping.items.${i}.linkLabel`),
    linkHref: t(`shipping.items.${i}.linkHref`),
  }))

  const planned = Array.from({ length: 2 }, (_, i) => ({
    title: t(`planned.items.${i}.title`),
    desc: t(`planned.items.${i}.desc`),
  }))

  const partners = Array.from({ length: 1 }, (_, i) => ({
    title: t(`partners.items.${i}.title`),
    desc: t(`partners.items.${i}.desc`),
  }))

  const stayOut = Array.from({ length: 4 }, (_, i) => t(`stayOut.items.${i}`))

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <main>
        <EditorialHero
          eyebrow={t('hero.eyebrow')}
          title={t('hero.title')}
          lede={t('hero.subtitle')}
          accent={ACCENT}
        />

        {/* Shipping now */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('shipping.eyebrow')}
          title={t('shipping.title')}
          lede={t('shipping.lede')}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {shipping.map((item, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-950"
              >
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                  {item.desc}
                </p>
                <Link
                  href={item.linkHref}
                  className="text-[13px] text-slate-900 dark:text-white hover:underline inline-flex items-center gap-1"
                >
                  {item.linkLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Worked example — actual webhook payload */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('payload.eyebrow')}
          title={t('payload.title')}
          lede={t('payload.lede')}
        >
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium">POST</span>
              <span className="font-mono normal-case tracking-normal text-slate-700 dark:text-slate-300">https://your-ats.example.com/webhooks/intransparency</span>
            </div>
            <pre className="text-[12px] leading-relaxed font-mono p-5 rounded-lg bg-slate-950 text-slate-200 overflow-x-auto">
{`{
  "event": "match.created",
  "id": "evt_8c2f4a91-b6e5-4d12-9e3b-7a8c2f4a91b6",
  "occurred_at": "2026-05-03T14:22:08Z",
  "data": {
    "match_id": "mat_a3f51e9d",
    "job_id": "job_lvmh_brand_strategy_2026",
    "candidate": {
      "id": "cnd_giulia_ferrari",
      "first_name": "Giulia",
      "last_name": "Ferrari",
      "email": "giulia.ferrari@example.com",
      "university": "Università Bocconi",
      "degree": "MSc Marketing Management",
      "graduation_year": 2025,
      "country": "IT"
    },
    "verification": {
      "verified_projects": 3,
      "total_projects": 4,
      "endorsements": 1,
      "trust_score": 0.84
    },
    "skills": [
      { "name": "Brand positioning",     "level": "advanced",    "evidence_count": 3 },
      { "name": "Quantitative research", "level": "advanced",    "evidence_count": 2 },
      { "name": "Competitive analysis",  "level": "intermediate","evidence_count": 2 }
    ],
    "decision_pack_url": "https://app.in-transparency.com/dp/cnd_giulia_ferrari.pdf",
    "match_score": 0.89,
    "match_explanation": "Thesis on premium-segment repositioning maps directly to the brand-strategy junior role; quant-research evidence covers consumer segmentation."
  }
}`}
            </pre>
            <p className="mt-6 text-[12px] text-slate-500 italic">
              {t('payload.noteLabel')}
            </p>
          </div>
        </EditorialSection>

        {/* Planned */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('planned.eyebrow')}
          title={t('planned.title')}
          lede={t('planned.lede')}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {planned.map((item, i) => (
              <div
                key={i}
                className="border-l-2 border-slate-400 dark:border-slate-600 pl-6 py-2"
              >
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Partners */}
        <EditorialSection
          tone="muted"
          accent={ACCENT}
          eyebrow={t('partners.eyebrow')}
          title={t('partners.title')}
          lede={t('partners.lede')}
        >
          <div className="grid gap-6 max-w-3xl">
            {partners.map((item, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-950"
              >
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Stay out */}
        <EditorialSection
          accent={ACCENT}
          eyebrow={t('stayOut.eyebrow')}
          title={t('stayOut.title')}
          lede={t('stayOut.lede')}
        >
          <ul className="space-y-3 max-w-3xl">
            {stayOut.map((item, i) => (
              <li
                key={i}
                className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-slate-300 dark:border-slate-700"
              >
                {item}
              </li>
            ))}
          </ul>
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
                href="/contact?subject=integration"
                className="inline-flex items-center justify-center h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
              >
                {t('cta.primary')}
              </Link>
              <Link
                href="/developers"
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
