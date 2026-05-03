'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Rocket,
  ShieldCheck,
  Code2,
  MessageSquare,
  Moon,
  CreditCard,
  Plug,
  Bot,
  ArrowRight,
  X,
  Check,
} from 'lucide-react'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import HeroVisual from '@/components/3d/HeroVisual'
import HeroCTA from '@/components/ui/HeroCTA'
import { StickyCTA } from '@/components/engagement/StickyCTA'

/**
 * /for-startups — startup / scale-up segment funnel.
 *
 * Mirrors the for-enterprise + for-sme + for-agencies structure
 * (hero + metrics + comparison + capability cards + personas +
 * process). Lead message: speed-to-hire and technical evidence —
 * the candidate's code is in the profile, the founder reads the
 * Decision Pack at 11pm, the offer goes out in 5 days instead of 5
 * weeks.
 */

interface Capability {
  key: string
  icon: any
  endpoint?: string
}

const CAPABILITIES: Capability[] = [
  { key: 'verified',      icon: ShieldCheck,    endpoint: '/explore' },
  { key: 'code',          icon: Code2,          endpoint: '/explore' },
  { key: 'smartSearch',   icon: MessageSquare,  endpoint: '/demo/ai-search' },
  { key: 'async',         icon: Moon },
  { key: 'hiringAdvisor', icon: Bot },
  { key: 'pricing',       icon: CreditCard,     endpoint: '/pricing' },
  { key: 'atsBridge',     icon: Plug,           endpoint: '/integrations' },
]

const METRICS = ['0', '1', '2'] as const
const PERSONAS = ['founder', 'tech', 'people'] as const
const COMPARE_ROWS = ['0', '1', '2', '3', '4'] as const

export default function ForStartupsPage() {
  const t = useTranslations('forStartups')
  const tBrand = useTranslations('brand')

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — text + visual side-by-side */}
      <section className="container max-w-6xl mx-auto px-4 pt-28 pb-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">
              <Rocket className="h-3 w-3 mr-1" />
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-3 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <p className="text-sm italic text-muted-foreground/70 mb-8">
              {tBrand('tagline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <HeroCTA href="/auth/register/recruiter?type=startup" variant="primary">
                {t('cta.primary')}
              </HeroCTA>
              <HeroCTA href="/demo/ai-search" variant="secondary">
                {t('cta.secondary')}
              </HeroCTA>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:block"
          >
            <HeroVisual className="max-w-[460px] ml-auto" />
          </motion.div>
        </div>
      </section>

      <main className="container max-w-5xl mx-auto px-4 pb-16 space-y-10">
        {/* Hard-numbers row */}
        <section>
          <div className="mb-6 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">{t('metrics.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('metrics.subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {METRICS.map(idx => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold tracking-tight text-primary tabular-nums leading-none mb-3">
                    {t(`metrics.items.${idx}.value`)}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-2">
                    {t(`metrics.items.${idx}.label`)}
                  </div>
                  <div className="text-xs italic text-muted-foreground">
                    {t(`metrics.items.${idx}.source`)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pain vs value */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6 max-w-2xl">
            {t('comparison.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-red-200 dark:border-red-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wider text-red-700 dark:text-red-400">
                  {t('comparison.before.label')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {COMPARE_ROWS.map(i => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{t(`comparison.before.items.${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {t('comparison.after.label')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {COMPARE_ROWS.map(i => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{t(`comparison.after.items.${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6 max-w-2xl">
            {t('capabilities.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {CAPABILITIES.map(c => {
              const Icon = c.icon
              return (
                <Card key={c.key} className="hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {t(`capabilities.items.${c.key}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t(`capabilities.items.${c.key}.description`)}
                    </p>
                    <p className="text-xs text-foreground/80 mb-2">
                      <span className="font-semibold">{t('practiceLabel')}</span>{' '}
                      {t(`capabilities.items.${c.key}.concrete`)}
                    </p>
                    {c.endpoint && (
                      <a
                        href={c.endpoint}
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {t('seeIt')}
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Personas */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6 max-w-2xl">
            {t('personas.title')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PERSONAS.map(key => (
              <Card key={key}>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {t(`personas.items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`personas.items.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Process */}
        <Card className="bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-lg font-semibold mb-3">{t('process.title')}</h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>{t('process.step1')}</li>
              <li>
                {t('process.step2.before')}{' '}
                <Link href="/demo/ai-search" className="text-primary hover:underline">
                  {t('process.step2.link')}
                </Link>{' '}
                {t('process.step2.after')}
              </li>
              <li>{t('process.step3')}</li>
              <li>
                {t('process.step4.before')}{' '}
                <Link href="/dashboard/recruiter/billing" className="text-primary hover:underline">
                  {t('process.step4.link')}
                </Link>{' '}
                {t('process.step4.after')}
              </li>
              <li>{t('process.step5')}</li>
            </ol>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <Card className="border-primary/40">
          <CardContent className="pt-6 pb-6">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">{t('cta.title')}</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-2xl">{t('cta.subtitle')}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <HeroCTA href="/auth/register/recruiter?type=startup" variant="primary">
                {t('cta.primary')}
              </HeroCTA>
              <HeroCTA href="/demo/ai-search" variant="secondary">
                {t('cta.secondary')}
              </HeroCTA>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
              <span>{t('cta.trustItems.0')}</span>
              <span className="text-muted-foreground/40">·</span>
              <span>{t('cta.trustItems.1')}</span>
              <span className="text-muted-foreground/40">·</span>
              <span>{t('cta.trustItems.2')}</span>
            </div>
          </CardContent>
        </Card>
      </main>

      <StickyCTA href="/auth/register/recruiter?type=startup" text={t('cta.primary')} show />
      <Footer />
    </div>
  )
}
