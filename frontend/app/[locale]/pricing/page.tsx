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
    { key: 'starter', featured: false, href: '/auth/register/recruiter', features: [0, 1, 2, 3, 4, 5] },
    { key: 'growth', featured: true, href: '/auth/register/recruiter', features: [0, 1, 2, 3, 4, 5, 6, 7] },
    { key: 'enterprise', featured: false, href: '/contact?subject=enterprise', features: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
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

                  {/* PREMIUM — optional upgrade for advanced career tooling */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="relative h-full flex flex-col border-2 border-primary/30 shadow-xl shadow-primary/10 bg-gradient-to-br from-primary/5 via-purple-50/30 to-transparent dark:from-primary/10 dark:via-purple-950/20">
                      <div className="absolute -top-3 left-5">
                        <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg border-0 text-[10px]">
                          {t('students.tiers.premium.badge', { defaultValue: 'Premium — Early Access' })}
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
                            {t('students.tiers.premium.price', { defaultValue: 'Coming soon' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {t('students.tiers.premium.description', {
                            defaultValue:
                              'Strumenti avanzati di carriera per chi vuole accelerare: coaching AI, analisi offerte, visibilità prioritaria.',
                          })}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1 flex flex-col">
                        <ul className="space-y-2.5 mb-4 flex-1">
                          <li className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            {t('students.tiers.premium.includes', {
                              defaultValue: 'Everything in Free, plus (quoted per request):',
                            })}
                          </li>
                          {[0, 1, 2, 3, 4, 5, 6].map(i => {
                            const fallbacks = [
                              'Priority visibility in recruiter search results',
                              'Additional AI project analyses beyond the 3 free',
                              'Unlimited AI Career Coach queries',
                              'Interview Prep with audio/video simulations',
                              'Offer analyzer: compare salary, benefits, growth',
                              'Personalized Skill Path with weekly coaching',
                              'Decision Pack PDF export for final interviews',
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
                              'Each premium feature is quoted individually. Pay only for what you use, no subscription.',
                          })}
                        </div>
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5" asChild>
                          <Link href="/contact?subject=student-premium-quote">
                            {t('students.tiers.premium.cta', { defaultValue: 'Request a quote' })}
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

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* CORE — always free preview tier */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="h-full flex flex-col border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/40 to-transparent dark:from-blue-950/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                            {t('universities.tiers.core.name')}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold tracking-tight">{t('universities.tiers.core.price')}</span>
                          <span className="text-sm text-muted-foreground">· {t('universities.tiers.core.period')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t('universities.tiers.core.description')}</p>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1 flex flex-col">
                        <ul className="space-y-2.5 mb-6 flex-1">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                            <li key={i} className="flex items-start text-sm">
                              <Check className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{t(`universities.tiers.core.features.${i}`)}</span>
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/auth/register/academic-partner">{t('universities.tiers.core.cta')}<ArrowRight className="h-4 w-4 ml-2" /></Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* PREMIUM — institutional workspace unlocked */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="relative h-full flex flex-col border-2 border-amber-300 shadow-xl shadow-amber-200/40 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-transparent dark:from-amber-950/20">
                      <div className="absolute -top-3 left-5">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-0 text-[10px]">
                          {t('universities.premiumBadge', { defaultValue: 'Institutional Workspace' })}
                        </Badge>
                      </div>
                      <CardHeader className="pb-3 pt-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                            {t('universities.tiers.premium.name')}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold tracking-tight">{t('universities.tiers.premium.price')}</span>
                          <span className="text-sm text-muted-foreground">{t('universities.tiers.premium.period')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t('universities.tiers.premium.description')}</p>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1 flex flex-col">
                        <ul className="space-y-2.5 mb-6 flex-1">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                            <li key={i} className="flex items-start text-sm">
                              <Check className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{t(`universities.tiers.premium.features.${i}`)}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/20" asChild>
                          <Link href="/contact?subject=premium-institutional">{t('universities.tiers.premium.cta')}<ArrowRight className="h-4 w-4 ml-2" /></Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Reassurance */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto"
                >
                  {t('universities.reassurance', {
                    defaultValue:
                      'Start on CORE — free, no commitment. Upgrade to PREMIUM when your career office needs moderation, CRM, and placement tracking. All writes are logged for AI Act compliance.',
                  })}
                </motion.p>
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
