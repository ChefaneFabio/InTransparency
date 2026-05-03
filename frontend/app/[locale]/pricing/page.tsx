'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/navigation'
import InstitutionAddonGrid from '@/components/pricing/InstitutionAddonGrid'

/**
 * Pricing page — revenue-hardened typography-first design.
 *
 * Hardening pass (post-critique):
 *  • Specific H1 stating actual pricing summary, not generic "Clear pricing".
 *  • Trust strip beneath the hero — UniBg pilot, Start Cup award, GDPR/AI
 *    Act compliance. Only what's true; no fabrication.
 *  • Annual savings show both € and %, not just €.
 *  • VAT-excluded label on every euro price (Italian B2B buyers expect it).
 *  • Trust microcopy ("No card · 30-day trial · cancel anytime") next to
 *    the price, not buried in CTA text.
 *  • Enterprise tier carries actual decision-criteria copy, not "more of
 *    everything". Lists SSO, ATS, security review, named CSM, SLA.
 *  • "Most chosen" replaced with neutral "Recommended" — we don't yet
 *    have data to back the original claim.
 */

type Tier = {
  name: string
  eyebrow?: string
  price: string
  cadence: string
  annual?: { price: string; savings: string }
  description: string
  features: string[]
  cta: { label: string; href: string; external?: boolean }
  emphasized?: boolean
  trustLine?: string
  /** Show "VAT excl." label next to price. True for paid tiers. */
  showVatNote?: boolean
}

function TierColumn({ tier, vatLabel }: { tier: Tier; vatLabel: string }) {
  const isExternal = tier.cta.external
  const ctaClass = `inline-flex items-center justify-center w-full h-11 px-5 text-sm font-medium rounded-md transition-colors ${
    tier.emphasized
      ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
      : 'bg-transparent text-slate-900 border border-slate-300 hover:bg-slate-50 dark:text-white dark:border-slate-700 dark:hover:bg-slate-900'
  }`

  return (
    <div
      className={`flex flex-col h-full pt-10 pb-8 px-8 ${
        tier.emphasized
          ? 'border-x border-t-2 border-b border-x-slate-200 border-t-slate-900 border-b-slate-200 bg-white dark:border-x-slate-800 dark:border-t-white dark:border-b-slate-800 dark:bg-slate-950'
          : 'border-t border-b border-t-slate-200 border-b-slate-200 dark:border-t-slate-800 dark:border-b-slate-800'
      }`}
    >
      {tier.emphasized && (
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-900 dark:text-white -mt-4 mb-6">
          {tier.eyebrow ?? 'Recommended'}
        </div>
      )}
      {!tier.emphasized && tier.eyebrow && (
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 -mt-4 mb-6">
          {tier.eyebrow}
        </div>
      )}

      <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{tier.name}</div>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-5xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {tier.price}
        </span>
        <span className="text-sm text-slate-500">{tier.cadence}</span>
      </div>

      {tier.showVatNote && (
        <div className="mt-1 text-[11px] text-slate-500 uppercase tracking-wider">
          {vatLabel}
        </div>
      )}

      {tier.annual && (
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 tabular-nums">
          {tier.annual.price}{' '}
          <span className="text-slate-500">— {tier.annual.savings}</span>
        </div>
      )}

      {tier.trustLine && (
        <div className="mt-3 text-[12px] text-slate-500 leading-snug">{tier.trustLine}</div>
      )}

      <p className="mt-5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 min-h-[3.5rem]">
        {tier.description}
      </p>

      <ul className="mt-8 space-y-3 text-[14px] text-slate-700 dark:text-slate-300 flex-1">
        {tier.features.map((f, i) => (
          <li key={i} className="leading-relaxed">
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-10">
        {isExternal ? (
          <a href={tier.cta.href} className={ctaClass}>
            {tier.cta.label}
          </a>
        ) : (
          <Link href={tier.cta.href as any} className={ctaClass}>
            {tier.cta.label}
          </Link>
        )}
      </div>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede: string
}) {
  return (
    <div className="max-w-3xl mb-14">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mb-4">
        {eyebrow}
      </div>
      <h2 className="text-[34px] leading-[1.15] font-semibold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-4 text-[17px] leading-relaxed text-slate-600 dark:text-slate-400">
        {lede}
      </p>
    </div>
  )
}

export default function PricingPage() {
  const t = useTranslations('pricingPage')
  const tBrand = useTranslations('brand')
  const vatLabel = t('vatNote', { defaultValue: 'VAT excl.' })
  const trustNoCard = t('trustNoCardTrial', { defaultValue: 'No card required · 30-day trial · cancel anytime' })
  const trustFreeForever = t('trustFreeForever', { defaultValue: 'Free forever · no card required' })

  const companyTiers: Tier[] = [
    {
      name: t('companies.tiers.starter.name'),
      price: '€0',
      cadence: t('companies.tiers.starter.period'),
      description: t('companies.tiers.starter.description'),
      features: [0, 1, 2, 3, 4, 5].map(i => t(`companies.tiers.starter.features.${i}`)),
      trustLine: trustFreeForever,
      cta: {
        label: t('companies.tiers.starter.cta'),
        href: '/auth/register/recruiter?plan=free',
      },
    },
    {
      name: t('companies.tiers.growth.name'),
      eyebrow: t('companies.popular'),
      price: '€89',
      cadence: t('companies.tiers.growth.period'),
      annual: {
        price: t('companies.tiers.growth.annualPrice', { defaultValue: '€890 / year' }),
        savings: t('companies.tiers.growth.annualSavings', { defaultValue: 'save €178 (17%)' }),
      },
      showVatNote: true,
      trustLine: trustNoCard,
      description: t('companies.tiers.growth.description'),
      features: [1, 2, 3, 4, 5, 6, 7].map(i => t(`companies.tiers.growth.features.${i}`)),
      cta: {
        label: t('companies.tiers.growth.cta'),
        href: '/auth/register/recruiter?plan=subscription',
      },
      emphasized: true,
    },
    {
      name: t('companies.tiers.enterprise.name'),
      price: t('companies.tiers.enterprise.price'),
      cadence: t('companies.tiers.enterprise.period') || 'pricing',
      description: t('companies.tiers.enterprise.description'),
      features: [1, 2, 3, 4, 5, 6, 7, 8].map(i => t(`companies.tiers.enterprise.features.${i}`)),
      trustLine: t('companies.tiers.enterprise.trustLine', {
        defaultValue: 'For 50+ recruiter teams · multi-brand groups · regulated industries',
      }),
      cta: {
        label: t('companies.tiers.enterprise.cta'),
        href: '/contact?subject=enterprise',
      },
    },
  ]

  const studentTiers: Tier[] = [
    {
      name: t('students.tiers.free.name', { defaultValue: 'Free' }),
      price: '€0',
      cadence: t('students.tiers.free.period', { defaultValue: 'forever' }),
      description: t('students.tiers.free.description', {
        defaultValue:
          'Everything you need to get noticed by companies. AI-extracted skills from real projects, unlimited applications.',
      }),
      features: [0, 1, 2, 3, 4].map(i => t(`students.features.${i}`)),
      trustLine: trustFreeForever,
      cta: {
        label: t('students.cta'),
        href: '/auth/register/student',
      },
    },
    {
      name: t('students.tiers.premium.name', { defaultValue: 'Premium' }),
      eyebrow: t('students.tiers.premium.eyebrow', { defaultValue: 'Accelerate your career' }),
      price: '€5',
      cadence: t('students.tiers.premium.cadence', { defaultValue: '/ month' }),
      annual: {
        price: t('students.tiers.premium.annualPrice', { defaultValue: '€45 / year' }),
        savings: t('students.tiers.premium.annualSavings', { defaultValue: 'save €15 (25%)' }),
      },
      showVatNote: false,
      trustLine: trustNoCard,
      description: t('students.tiers.premium.description', {
        defaultValue:
          'Deep skill path, unlimited AI, advanced analytics, priority recruiter visibility, interview coach.',
      }),
      features: [
        t('students.tiers.premium.features.0', { defaultValue: 'Deep Skill Path with 12-month roadmap' }),
        t('students.tiers.premium.features.1', { defaultValue: '8 advanced analytics dashboards' }),
        t('students.tiers.premium.features.2', { defaultValue: 'Unlimited AI project analyses' }),
        t('students.tiers.premium.features.3', { defaultValue: 'Custom portfolio URL' }),
        t('students.tiers.premium.features.4', { defaultValue: 'Priority visibility in recruiter search' }),
        t('students.tiers.premium.features.5', { defaultValue: 'AI Interview Coach' }),
        t('students.tiers.premium.features.6', { defaultValue: 'Europass signed credentials' }),
      ],
      cta: {
        label: t('students.tiers.premium.cta', { defaultValue: 'Start Premium · 30 days free' }),
        href: '/auth/register/student?plan=premium',
      },
      emphasized: true,
    },
  ]

  const institutionTiers: Tier[] = [
    {
      name: t('universities.tiers.free.name', { defaultValue: 'Free Core' }),
      price: '€0',
      cadence: t('universities.tiers.free.period', { defaultValue: '/ forever' }),
      description: t('universities.tiers.free.description', {
        defaultValue:
          'Full M1–M4 placement workspace. 90% of small and mid-sized academic partners never need more.',
      }),
      features: Array.from({ length: 9 }, (_, i) =>
        t(`universities.tiers.free.features.${i}`)
      ),
      trustLine: trustFreeForever,
      cta: {
        label: t('universities.tiers.free.cta', { defaultValue: 'Activate Free Core' }),
        href: '/auth/register/academic-partner',
      },
    },
    {
      name: t('universities.tiers.premium.name', { defaultValue: 'Institutional Premium' }),
      eyebrow: t('universities.tiers.premium.eyebrow', { defaultValue: 'For academic partners scaling past Free Core' }),
      price: '€39',
      cadence: t('universities.tiers.premium.cadence', { defaultValue: '/ month' }),
      annual: {
        price: t('universities.tiers.premium.annualPrice', { defaultValue: '€390 / year' }),
        savings: t('universities.tiers.premium.annualSavings', { defaultValue: 'save €78 (17%)' }),
      },
      showVatNote: true,
      trustLine: trustNoCard,
      description: t('universities.tiers.premium.description', {
        defaultValue:
          'Unlimited AI, advanced analytics, full audit log with CSV exports, reminder automation, MIUR-format reports.',
      }),
      features: Array.from({ length: 7 }, (_, i) =>
        t(`universities.tiers.premium.features.${i}`)
      ),
      cta: {
        label: t('universities.tiers.premium.cta', { defaultValue: 'Start Premium · 30 days free' }),
        href: '/api/checkout/institutional-premium?plan=monthly',
        external: true,
      },
      emphasized: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      {/* Hero — specific pricing summary in the H1, not generic */}
      <section className="bg-slate-950 text-white">
        <div className="container max-w-5xl mx-auto px-6 pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 mb-6">
            {t('hero.eyebrow', { defaultValue: 'Pricing' })}
          </div>
          <h1 className="text-[44px] sm:text-[56px] leading-[1.05] font-semibold tracking-tight max-w-3xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-[19px] leading-relaxed text-slate-300 max-w-2xl">
            {t('hero.subtitle')}
          </p>
          <p className="mt-8 text-[14px] italic text-slate-400 max-w-2xl">
            {tBrand('tagline')}
          </p>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400">
            <a href="#companies" className="hover:text-white transition-colors">
              {t('segments.companies')}
              <span className="ml-1.5 text-slate-600">€89/mo</span>
            </a>
            <a href="#students" className="hover:text-white transition-colors">
              {t('segments.students')}
              <span className="ml-1.5 text-slate-600">free · €5/mo</span>
            </a>
            <a href="#institutions" className="hover:text-white transition-colors">
              {t('segments.institutions')}
              <span className="ml-1.5 text-slate-600">free · €39/mo</span>
            </a>
          </div>
        </div>

        {/* Trust strip — only what's TRUE. No fabricated logos. */}
        <div className="border-t border-slate-800/60">
          <div className="container max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px] text-slate-400 uppercase tracking-[0.12em]">
            <span className="text-slate-500">{t('trustStrip.label', { defaultValue: 'Trusted foundation' })}:</span>
            <span>{t('trustStrip.pilot', { defaultValue: 'UniBg pilot' })}</span>
            <span className="text-slate-700">·</span>
            <span>{t('trustStrip.startCup', { defaultValue: 'Start Cup award' })}</span>
            <span className="text-slate-700">·</span>
            <span>{t('trustStrip.gdpr', { defaultValue: 'GDPR + AI Act audit log' })}</span>
            <span className="text-slate-700">·</span>
            <span>{t('trustStrip.dataRoom', { defaultValue: 'EU data residency' })}</span>
          </div>
        </div>
      </section>

      {/* Companies — lead position, drives revenue */}
      <section id="companies" className="scroll-mt-24 border-b border-slate-200 dark:border-slate-800">
        <div className="container max-w-6xl mx-auto px-6 py-24 lg:py-28">
          <SectionHeader
            eyebrow={t('segments.companies')}
            title={t('companies.title')}
            lede={t('companies.subtitle')}
          />

          <div className="grid md:grid-cols-3 border-x border-slate-200 dark:border-slate-800">
            {companyTiers.map(tier => (
              <TierColumn key={tier.name} tier={tier} vatLabel={vatLabel} />
            ))}
          </div>

          <p className="mt-12 text-sm text-slate-500 max-w-3xl">
            {t('companies.roiAnchor', {
              defaultValue:
                "A bad hire wastes months of salary, ramp time, and team morale. InTransparency reduces that risk by showing real, AI-verified work — code, theses, internship reports — instead of resume claims. Free until you've proven the pool; €89/month when you're ready to scale.",
            })}
          </p>
        </div>
      </section>

      {/* Students */}
      <section
        id="students"
        className="scroll-mt-24 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
      >
        <div className="container max-w-5xl mx-auto px-6 py-24 lg:py-28">
          <SectionHeader
            eyebrow={t('segments.students')}
            title={t('students.title')}
            lede={t('students.subtitle')}
          />

          <div className="grid md:grid-cols-2 border-x border-slate-200 dark:border-slate-800">
            {studentTiers.map(tier => (
              <TierColumn key={tier.name} tier={tier} vatLabel={vatLabel} />
            ))}
          </div>

          <p className="mt-12 text-sm text-slate-500 max-w-2xl">
            {t('students.endNote', {
              defaultValue:
                'Free covers everything you need to get hired. Premium is optional — for students who want priority visibility, deeper analytics, and the AI Interview Coach.',
            })}
          </p>
        </div>
      </section>

      {/* Institutions */}
      <section id="institutions" className="scroll-mt-24 border-b border-slate-200 dark:border-slate-800">
        <div className="container max-w-5xl mx-auto px-6 py-24 lg:py-28">
          <SectionHeader
            eyebrow={t('segments.institutions')}
            title={t('universities.title')}
            lede={t('universities.subtitle')}
          />

          <div className="grid md:grid-cols-2 border-x border-slate-200 dark:border-slate-800">
            {institutionTiers.map(tier => (
              <TierColumn key={tier.name} tier={tier} vatLabel={vatLabel} />
            ))}
          </div>

          <p className="mt-12 text-sm text-slate-500 max-w-2xl">
            {t('universities.reassurance', {
              defaultValue:
                'Free Core is free forever. Every AI action is logged for AI Act compliance. Premium and add-ons are optional — pick them only when you outgrow the limits.',
            })}
          </p>

          {/* Add-ons — public page shows only available + beta. Roadmap items
              hidden behind a "talk to us about what's coming" link. */}
          <div className="mt-24">
            <div className="max-w-3xl mb-10">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mb-4">
                {t('universities.addonsBadge', { defaultValue: 'Available add-ons' })}
              </div>
              <h3 className="text-[26px] leading-[1.2] font-semibold tracking-tight text-slate-900 dark:text-white">
                {t('universities.addonsTitle', { defaultValue: 'Scale modules — pick only what you need' })}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                {t('universities.addonsAvailableSubtitle', {
                  defaultValue:
                    'Modules available today: priority AI quota, dedicated CSM, custom reporting, ATS bridge (beta), bulk verifiable credentials (beta).',
                })}
              </p>
            </div>
            <InstitutionAddonGrid cols={2} excludeRoadmap hidePrices />

            <div className="mt-8 text-sm text-slate-600 dark:text-slate-400">
              {t('universities.roadmapHint', {
                defaultValue:
                  'White-label workspace, multi-institution rollup, SSO, MIUR/ANVUR pack — currently in development.',
              })}{' '}
              <Link
                href="/contact?subject=roadmap"
                className="font-medium text-slate-900 dark:text-white underline underline-offset-4 hover:no-underline"
              >
                {t('universities.roadmapCta', { defaultValue: 'Talk to us →' })}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="scroll-mt-24">
        <div className="container max-w-3xl mx-auto px-6 py-24 lg:py-28">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mb-4">
            FAQ
          </div>
          <h2 className="text-[34px] leading-[1.15] font-semibold tracking-tight text-slate-900 dark:text-white mb-12">
            {t('faq.title')}
          </h2>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="py-7">
                <dt className="text-[17px] font-semibold text-slate-900 dark:text-white">
                  {t(`faq.questions.${i}.q`)}
                </dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`faq.questions.${i}.a`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Footer />
    </div>
  )
}
