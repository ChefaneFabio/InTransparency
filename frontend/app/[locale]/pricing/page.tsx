'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check } from 'lucide-react'
import { Link } from '@/navigation'
import InstitutionAddonGrid from '@/components/pricing/InstitutionAddonGrid'

export default function PricingPage() {
  const t = useTranslations('pricingPage')

  const companyTiers = [
    { key: 'starter',    featured: false, href: '/auth/register/recruiter?plan=free',         features: [0, 1, 2, 3, 4, 5] },
    { key: 'growth',     featured: true,  href: '/auth/register/recruiter?plan=subscription', features: [0, 1, 2, 3, 4, 5, 6, 7] },
    { key: 'enterprise', featured: false, href: '/contact?subject=enterprise',                features: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative bg-slate-900 text-white">
        <div className="container max-w-4xl mx-auto px-4 pt-32 pb-16 lg:pt-36 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Lightweight anchor nav — duplicates nothing the header doesn't already do,
              just lets users jump within this single scroll page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70"
          >
            <a href="#companies" className="hover:text-white transition-colors">{t('segments.companies')}</a>
            <span className="text-white/20">·</span>
            <a href="#students" className="hover:text-white transition-colors">{t('segments.students')}</a>
            <span className="text-white/20">·</span>
            <a href="#institutions" className="hover:text-white transition-colors">{t('segments.institutions')}</a>
          </motion.div>
        </div>
      </section>

      {/* Companies */}
      <section id="companies" className="py-20 scroll-mt-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t('companies.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{t('companies.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {companyTiers.map(tier => (
              <Card
                key={tier.key}
                className={`relative h-full flex flex-col ${
                  tier.featured ? 'border-2 border-primary shadow-md' : 'border'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-5">
                    <Badge className="bg-primary text-white text-[10px]">
                      {t('companies.popular')}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3 pt-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t(`companies.tiers.${tier.key}.name`)}
                  </span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold tracking-tight">{t(`companies.tiers.${tier.key}.price`)}</span>
                    <span className="text-sm text-muted-foreground">{t(`companies.tiers.${tier.key}.period`)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t(`companies.tiers.${tier.key}.description`)}</p>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map(fi => (
                      <li key={fi} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t(`companies.tiers.${tier.key}.features.${fi}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={tier.featured ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={tier.href}>
                      {t(`companies.tiers.${tier.key}.cta`)}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">
            {t('freemiumFunnel.subtitle', {
              defaultValue:
                "Search the verified talent pool for free. Reach out to up to 5 candidates per month at no cost. When you need to contact more, subscribe — that's the only path forward, no credit packs to manage.",
            })}
          </p>
        </div>
      </section>

      {/* Students */}
      <section id="students" className="py-20 bg-muted/30 scroll-mt-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t('students.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              {t('students.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <Card className="h-full flex flex-col border">
              <CardHeader className="pb-3 pt-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('students.tiers.free.name', { defaultValue: 'Free' })}
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {t('students.tiers.free.price', { defaultValue: t('students.price') })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · {t('students.tiers.free.period', { defaultValue: 'forever' })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {t('students.tiers.free.description', {
                    defaultValue: 'Everything you need to get noticed by companies: AI-extracted skills, real projects, unlimited applications.',
                  })}
                </p>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col">
                <ul className="space-y-2.5 mb-6 flex-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{t(`students.features.${i}`)}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/register/student">
                    {t('students.cta')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="relative h-full flex flex-col border-2 border-primary shadow-md">
              <div className="absolute -top-3 left-5">
                <Badge className="bg-primary text-white text-[10px]">
                  {t('students.tiers.premium.name', { defaultValue: 'Premium' })}
                </Badge>
              </div>
              <CardHeader className="pb-3 pt-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {t('students.tiers.premium.name', { defaultValue: 'Premium' })}
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {t('students.tiers.premium.price', { defaultValue: '€5' })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t('students.tiers.premium.period', { defaultValue: '/mo · or €45/yr' })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('students.tiers.premium.studentDiscount', { defaultValue: '30-day trial · cancel anytime' })}
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {t('students.tiers.premium.description', {
                    defaultValue:
                      'One subscription, all growth tools unlocked. Deep skill path, advanced analytics, priority visibility, interview coach, unlimited AI.',
                  })}
                </p>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col">
                <ul className="space-y-2.5 mb-4 flex-1">
                  <li className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {t('students.tiers.premium.includes', { defaultValue: 'Everything in Free, plus:' })}
                  </li>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                    const fallbacks = [
                      'Deep Skill Path: unlimited gaps, full roadmap, weekly challenges',
                      'Advanced analytics: 8 dashboards incl. recruiter interest, market benchmark, salary context',
                      'Unlimited AI project analyses',
                      'Custom portfolio URL (yourname.intransparency.com)',
                      'Priority visibility in recruiter search results',
                      'AI Interview Coach with practice sessions',
                      'Europass EDCI signed credentials (verifiable wallet)',
                      'Peer benchmarking against your cohort',
                    ]
                    return (
                      <li key={i} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t(`students.tiers.premium.features.${i}`, { defaultValue: fallbacks[i] })}</span>
                      </li>
                    )
                  })}
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/auth/register/student?plan=premium">
                    {t('students.tiers.premium.cta', { defaultValue: 'Start Premium free for 30 days' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8 max-w-lg mx-auto">
            {t('students.whyFree')}
          </p>
        </div>
      </section>

      {/* Institutions */}
      <section id="institutions" className="py-20 scroll-mt-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t('universities.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{t('universities.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Core */}
            <Card className="h-full flex flex-col border">
              <CardHeader className="pb-3 pt-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('universities.tiers.free.name', { defaultValue: 'Free Core' })}
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {t('universities.tiers.free.price', { defaultValue: '€0' })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t('universities.tiers.free.period', { defaultValue: '/ forever' })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {t('universities.tiers.free.description', {
                    defaultValue:
                      'Full M1–M4 workspace. No upsell, no surprises. 90% of small/mid institutions never need more.',
                  })}
                </p>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col">
                <ul className="space-y-2.5 mb-6 flex-1">
                  {[
                    'M1 Mediation Inbox',
                    'M2 Offer moderation',
                    'M3 Company CRM (drag-and-drop pipeline)',
                    'M4 Placement pipeline (hours, evaluations, deadlines)',
                    'Basic analytics + Scorecard',
                    'Audit log (last 30 days)',
                    'AI Assistant (50 queries/month)',
                    'AI skill extraction + optional professor endorsement',
                    'Convention Builder (template-based)',
                  ].map((label, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/register/academic-partner">
                    {t('universities.tiers.free.cta', { defaultValue: 'Activate Free Core' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="relative h-full flex flex-col border-2 border-primary shadow-md">
              <div className="absolute -top-3 left-5">
                <Badge className="bg-primary text-white text-[10px]">
                  {t('universities.tiers.premium.name', { defaultValue: 'Institutional Premium' })}
                </Badge>
              </div>
              <CardHeader className="pb-3 pt-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {t('universities.tiers.premium.name', { defaultValue: 'Institutional Premium' })}
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {t('universities.tiers.premium.price', { defaultValue: '€39' })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t('universities.tiers.premium.period', { defaultValue: '/mo · or €390/yr' })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('universities.tiers.premium.note', { defaultValue: '30-day free trial · cancel anytime' })}
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {t('universities.tiers.premium.description', {
                    defaultValue:
                      'Unlocks the scale features: unlimited AI Assistant, advanced analytics, full audit log, reminder automation, AI-personalized conventions, basic MIUR reports.',
                  })}
                </p>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col">
                <ul className="space-y-2.5 mb-6 flex-1">
                  <li className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {t('universities.tiers.premium.includes', { defaultValue: 'Everything in Free Core, plus:' })}
                  </li>
                  {[
                    'AI Assistant unlimited (no monthly cap)',
                    'Advanced analytics: cross-cohort, cross-program drills',
                    'Audit log: full history + CSV exports',
                    'Reminder engine: full automation (rules + cron)',
                    'Convention Builder: AI-personalized clauses',
                    'Skills Intelligence + Curriculum Alignment',
                    'MIUR-format reports (basic)',
                    'Priority email support (24h response)',
                  ].map((label, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                {/* Plain <a> not Link — /api/* must NOT get a locale prefix
                    (next-intl's createNavigation has localePrefix: 'always') */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="flex-1" asChild>
                    <a href="/api/checkout/institutional-premium?plan=monthly">
                      {t('universities.tiers.premium.cta', { defaultValue: 'Start trial · €39/mo' })}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="/api/checkout/institutional-premium?plan=annual">
                      {t('universities.tiers.premium.ctaAnnual', { defaultValue: 'Pay annually · €390/yr · save 17%' })}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            {t('universities.reassurance', {
              defaultValue:
                'Free Core is free forever. Premium and add-ons are optional — pick them only when you outgrow the limits. Every AI action is logged for AI Act compliance.',
            })}
          </p>

          {/* Add-ons marketplace */}
          <div className="mt-16">
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold">
                {t('universities.addonsTitle', { defaultValue: 'Scale up when you need to' })}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t('universities.addonsSubtitle', {
                  defaultValue:
                    'Optional enterprise modules: white-label, SSO, ATS bridges, MIUR compliance, and more. Pick only what you need.',
                })}
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <InstitutionAddonGrid cols={2} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('faq.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">{t(`faq.questions.${i}.q`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t(`faq.questions.${i}.a`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
