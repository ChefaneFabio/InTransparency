'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight, Check, GraduationCap, Building2, Sparkles,
  Briefcase, BookOpen, Shield, Brain, FileText, Users,
  Zap, BarChart3, Globe
} from 'lucide-react'
import { Link } from '@/navigation'
import InstitutionAddonGrid from '@/components/pricing/InstitutionAddonGrid'

type Segment = 'companies' | 'students' | 'institutions'

const segmentConfig: Record<Segment, { icon: typeof Briefcase; color: string; activeColor: string }> = {
  companies: { icon: Briefcase, color: 'text-muted-foreground', activeColor: 'bg-primary text-white shadow-lg shadow-primary/25' },
  students: { icon: GraduationCap, color: 'text-muted-foreground', activeColor: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' },
  institutions: { icon: Building2, color: 'text-muted-foreground', activeColor: 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' },
}

export default function PricingPage() {
  const t = useTranslations('pricingPage')
  const searchParams = useSearchParams()
  const initialSegment = (searchParams.get('for') as Segment) || 'companies'
  const [segment, setSegment] = useState<Segment>(initialSegment)

  const companyTiers = [
    { key: 'starter',    featured: false, href: '/auth/register/recruiter?plan=per-contact', features: [0, 1, 2, 3, 4, 5] },
    { key: 'growth',     featured: true,  href: '/auth/register/recruiter?plan=subscription', features: [0, 1, 2, 3, 4, 5, 6, 7] },
    { key: 'enterprise', featured: false, href: '/contact?subject=enterprise',                features: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero + Segment Switcher */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="relative container max-w-4xl mx-auto px-4 pt-32 pb-10 lg:pt-36 text-center">
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
            className="text-lg text-white/70 max-w-2xl mx-auto mb-10"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Segment Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
          >
            {(['companies', 'students', 'institutions'] as Segment[]).map(seg => {
              const config = segmentConfig[seg]
              const Icon = config.icon
              const active = segment === seg
              return (
                <button
                  key={seg}
                  onClick={() => setSegment(seg)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active ? config.activeColor : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t(`segments.${seg}`)}
                </button>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Segment Content */}
      <AnimatePresence mode="wait">
        {segment === 'companies' && (
          <motion.div
            key="companies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Company Tiers */}
            <section className="py-16">
              <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold">{t('companies.title')}</h2>
                  <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{t('companies.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {companyTiers.map((tier, i) => (
                    <motion.div
                      key={tier.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      <Card className={`relative h-full flex flex-col ${tier.featured ? 'border-2 border-primary shadow-xl shadow-primary/10' : 'border-2'}`}>
                        {tier.featured && (
                          <div className="absolute -top-3 left-5">
                            <Badge className="bg-primary text-white shadow-lg text-[10px]">
                              {t('companies.popular')}
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="pb-3 pt-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`h-2 w-2 rounded-full ${tier.featured ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                            <span className={`text-xs font-semibold uppercase tracking-wider ${tier.featured ? 'text-primary' : 'text-muted-foreground'}`}>
                              {t(`companies.tiers.${tier.key}.name`)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1">
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
                            className={`w-full ${tier.featured ? 'shadow-lg shadow-primary/20' : ''}`}
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
                    </motion.div>
                  ))}
                </div>

                {/* Pay-per-talent */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 p-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 text-center"
                >
                  <Badge variant="outline" className="mb-3">{t('payPerTalent.badge')}</Badge>
                  <h3 className="text-xl font-bold">{t('payPerTalent.title')}</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg mx-auto">{t('payPerTalent.subtitle')}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 max-w-3xl mx-auto">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-800 border text-sm font-medium">
                        {t(`payPerTalent.packages.${i}`)}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-5" asChild>
                    <Link href="/contact?subject=credits">{t('payPerTalent.cta')}<ArrowRight className="h-4 w-4 ml-2" /></Link>
                  </Button>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {segment === 'students' && (
          <motion.div
            key="students"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-16">
              <div className="container max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold">{t('students.title')}</h2>
                  <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                    {t('students.subtitle')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* FREE — the always-available core tier */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="h-full flex flex-col border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/40 to-transparent dark:from-emerald-950/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                            {t('students.tiers.free.name', { defaultValue: 'Free' })}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold tracking-tight">
                            {t('students.tiers.free.price', { defaultValue: t('students.price') })}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            · {t('students.tiers.free.period', { defaultValue: 'forever' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {t('students.tiers.free.description', {
                            defaultValue: 'Tutto ciò che serve per farti notare dalle aziende: portfolio verificato, skills, applicazioni illimitate.',
                          })}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1 flex flex-col">
                        <ul className="space-y-2.5 mb-6 flex-1">
                          {[0, 1, 2, 3, 4].map(i => (
                            <li key={i} className="flex items-start text-sm">
                              <Check className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{t(`students.features.${i}`)}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" asChild>
                          <Link href="/auth/register/student">
                            {t('students.cta')}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* PREMIUM — single-tier bundle, one price unlocks everything */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="relative h-full flex flex-col border-2 border-primary/40 shadow-xl shadow-primary/15 bg-gradient-to-br from-primary/5 via-purple-50/30 to-transparent dark:from-primary/10 dark:via-purple-950/20">
                      <div className="absolute -top-3 left-5">
                        <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg border-0 text-[10px]">
                          {t('students.tiers.premium.badge', { defaultValue: 'Premium · Accelerate your career' })}
                        </Badge>
                      </div>
                      <CardHeader className="pb-3 pt-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {t('students.tiers.premium.name', { defaultValue: 'Premium' })}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold tracking-tight">
                            {t('students.tiers.premium.price', { defaultValue: '€7.99' })}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {t('students.tiers.premium.period', { defaultValue: '/mo · or €69/yr' })}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                          {t('students.tiers.premium.studentDiscount', { defaultValue: '·50% off for verified students · first month free' })}
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
                            {t('students.tiers.premium.includes', {
                              defaultValue: 'Everything in Free, plus:',
                            })}
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
                        <div className="text-[11px] text-muted-foreground mb-4 p-2.5 bg-primary/5 rounded-md border border-primary/10">
                          {t('students.tiers.premium.note', {
                            defaultValue:
                              'Cancel anytime. Institutional pricing: if your university is a partner, Premium is free for you — check your dashboard.',
                          })}
                        </div>
                        <Button className="w-full bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/20" asChild>
                          <Link href="/auth/register/student?plan=premium">
                            {t('students.tiers.premium.cta', { defaultValue: 'Start Premium free for 30 days' })}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Why free callout */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-10 text-center max-w-lg mx-auto"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('students.whyFree')}
                  </p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {segment === 'institutions' && (
          <motion.div
            key="institutions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-16">
              <div className="container max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold">{t('universities.title')}</h2>
                  <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{t('universities.subtitle')}</p>
                </div>

                {/* Single free tier — full institutional workspace included at no cost */}
                <div className="max-w-2xl mx-auto">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="relative h-full flex flex-col border-2 border-emerald-300 shadow-xl shadow-emerald-200/30 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/30 dark:from-emerald-950/20 dark:via-slate-950 dark:to-blue-950/20">
                      <div className="absolute -top-3 left-5">
                        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg border-0 text-[10px]">
                          {t('universities.freeBadge', { defaultValue: 'Full Workspace · Free' })}
                        </Badge>
                      </div>
                      <CardHeader className="pb-3 pt-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                            {t('universities.tiers.free.name', { defaultValue: 'Academic Partners' })}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold tracking-tight">
                            {t('universities.tiers.free.price', { defaultValue: 'Free' })}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {t('universities.tiers.free.period', { defaultValue: '· forever' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {t('universities.tiers.free.description', {
                            defaultValue:
                              'Universities and ITS get the full M1–M4 workspace — Inbox, Offer moderation, CRM, Placement pipeline — included. Reminder engine, AI Assistant, audit log, scorecard, all analytics. Forever.',
                          })}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1 flex flex-col">
                        <ul className="space-y-2.5 mb-6 flex-1 grid sm:grid-cols-2 gap-y-2.5 gap-x-4">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                            <li key={i} className="flex items-start text-sm">
                              <Check className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{t(`universities.tiers.premium.features.${i}`)}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/20" asChild>
                          <Link href="/auth/register/academic-partner">
                            {t('universities.tiers.free.cta', { defaultValue: 'Activate your workspace — free' })}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Reassurance — sustainability story, not upgrade */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto"
                >
                  {t('universities.reassurance', {
                    defaultValue:
                      'The workspace is funded by the companies that recruit from it. Universities and ITS never pay — students never pay. Every AI action is logged for AI Act compliance.',
                  })}
                </motion.p>

                {/* Paid add-ons marketplace */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-16"
                >
                  <div className="text-center mb-8 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-950/40 dark:to-blue-950/40 text-xs font-medium text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-900/60">
                      <Sparkles className="h-3 w-3" />
                      {t('universities.addonsBadge', { defaultValue: 'Optional add-ons' })}
                    </div>
                    <h3 className="text-2xl font-bold mt-4">
                      {t('universities.addonsTitle', { defaultValue: 'Scale up when you need to' })}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('universities.addonsSubtitle', {
                        defaultValue:
                          'Core stays free. Pick only the modules you actually need — white-label, multi-institution, SSO, ATS bridge, MIUR compliance, and more.',
                      })}
                    </p>
                  </div>
                  <div className="max-w-5xl mx-auto">
                    <InstitutionAddonGrid cols={2} />
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ — always visible */}
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
