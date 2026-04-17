'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, GraduationCap, Building2, Sparkles, Users } from 'lucide-react'
import { Link } from '@/navigation'

export default function PricingPage() {
  const t = useTranslations('pricingPage')

  const companyTiers = [
    {
      key: 'starter',
      featured: false,
      href: '/auth/register/recruiter',
      features: [0, 1, 2, 3, 4, 5],
    },
    {
      key: 'growth',
      featured: true,
      href: '/auth/register/recruiter',
      features: [0, 1, 2, 3, 4, 5, 6, 7],
    },
    {
      key: 'enterprise',
      featured: false,
      href: '/contact?subject=enterprise',
      features: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="relative container max-w-4xl mx-auto px-4 pt-32 pb-16 lg:pt-36 lg:pb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-6"
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
        </div>
      </section>

      {/* Students — Free forever */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border"
          >
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
              <GraduationCap className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{t('students.title')}</h2>
              <p className="text-muted-foreground mt-1">{t('students.subtitle')}</p>
              <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} className="flex items-center gap-1.5 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {t(`students.features.${i}`)}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">{t('students.price')}</p>
              <p className="text-sm text-muted-foreground">{t('students.period')}</p>
              <Button className="mt-3" variant="outline" asChild>
                <Link href="/auth/register/student">{t('students.cta')}<ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Tiers */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">{t('companies.badge')}</Badge>
            <h2 className="text-3xl font-bold">{t('companies.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{t('companies.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {companyTiers.map((tier, i) => (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className={`relative h-full flex flex-col ${tier.featured ? 'border-2 border-primary shadow-xl shadow-primary/10' : 'border-2'}`}>
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />{t('companies.popular')}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{t(`companies.tiers.${tier.key}.name`)}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{t(`companies.tiers.${tier.key}.price`)}</span>
                      <span className="text-sm text-muted-foreground ml-1">{t(`companies.tiers.${tier.key}.period`)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{t(`companies.tiers.${tier.key}.description`)}</p>
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

          {/* Pay-per-talent alternative */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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

      {/* Universities — 2 tiers */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4"><Building2 className="h-3 w-3 mr-1" />{t('universities.title')}</Badge>
            <h2 className="text-3xl font-bold">{t('universities.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{t('universities.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Base Platform — Free */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="h-full flex flex-col border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{t('universities.tiers.core.name')}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-600">{t('universities.tiers.core.price')}</span>
                    <span className="text-sm text-muted-foreground ml-1">{t('universities.tiers.core.period')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{t('universities.tiers.core.description')}</p>
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

            {/* Premium — On request */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="h-full flex flex-col border-2">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{t('universities.tiers.premium.name')}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t('universities.tiers.premium.price')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{t('universities.tiers.premium.description')}</p>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                      <li key={i} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{t(`universities.tiers.premium.features.${i}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/contact?subject=university-premium">{t('universities.tiers.premium.cta')}<ArrowRight className="h-4 w-4 ml-2" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
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
