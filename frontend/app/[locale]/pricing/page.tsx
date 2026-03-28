'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Building2, GraduationCap, ArrowRight, School, SearchCheck, Search, BadgeCheck, BarChart3, Briefcase, BookOpen, Sparkles } from 'lucide-react'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'

type Segment = 'students' | 'companies' | 'institutes'

export default function PricingPage() {
  const t = useTranslations('pricingPage')
  const [selectedSegment, setSelectedSegment] = useState<Segment>('companies')

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero — value-first, not price-first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-primary/10 text-primary text-sm px-4 py-2">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-5xl font-display font-bold mb-6 text-foreground">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              {t('hero.subtitle')}
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mb-12">
              {t('hero.description')}
            </p>

            {/* Segment Selector */}
            <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
              {(['companies', 'students', 'institutes'] as Segment[]).map((segment) => {
                const Icon = segment === 'students' ? GraduationCap : segment === 'institutes' ? School : Building2
                return (
                  <button
                    key={segment}
                    onClick={() => setSelectedSegment(segment)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSegment === segment
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(`hero.segments.${segment}`)}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { value: t('stats.portfolios.value'), label: t('stats.portfolios.label') },
                { value: t('stats.universities.value'), label: t('stats.universities.label') },
                { value: t('stats.verified.value'), label: t('stats.verified.label') },
                { value: t('stats.cost.value'), label: t('stats.cost.label') },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 bg-white/60 rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dynamic Segments */}
          <div className="mb-20">
            <motion.div
              key={selectedSegment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* ─── COMPANIES ─── */}
              {selectedSegment === 'companies' && (
                <div className="max-w-5xl mx-auto">
                  {/* Value proposition card */}
                  <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-primary/5 shadow-xl mb-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <CardContent className="p-8 md:p-12 relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-primary/10 text-primary border-primary/30 text-sm">
                              {t('company.badge')}
                            </Badge>
                          </div>
                          <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                            {t('company.title')}
                          </h2>
                          <p className="text-lg text-gray-700 mb-6">
                            {t('company.subtitle')}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg" asChild>
                              <Link href="/auth/register">
                                {t('company.cta')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                              <Link href="/demo/ai-search">
                                {t('company.demoCta')}
                              </Link>
                            </Button>
                          </div>
                        </div>
                        <div className="md:w-72 flex-shrink-0">
                          <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary/20 text-center">
                            <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900 mb-1">{t('company.cardTitle')}</div>
                            <p className="text-sm text-gray-600 mb-4">{t('company.cardNote')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Value features grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { icon: Search, featureKey: 'company.features.discover' },
                      { icon: BadgeCheck, featureKey: 'company.features.verify' },
                      { icon: SearchCheck, featureKey: 'company.features.connect' },
                    ].map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.featureKey}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="h-full bg-white/80 hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-3">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                              <CardTitle className="text-lg">{t(`${item.featureKey}.title`)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-600 mb-4">{t(`${item.featureKey}.description`)}</p>
                              <ul className="space-y-2">
                                {[0, 1, 2].map((idx) => (
                                  <li key={idx} className="flex items-start text-sm">
                                    <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{t(`${item.featureKey}.items.${idx}`)}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ─── STUDENTS ─── */}
              {selectedSegment === 'students' && (
                <div className="max-w-5xl mx-auto">
                  {/* Value proposition */}
                  <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-primary/5 shadow-xl mb-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <CardContent className="p-8 md:p-12 relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-1">
                          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 text-sm">
                            {t('student.badge')}
                          </Badge>
                          <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                            {t('student.title')}
                          </h2>
                          <p className="text-lg text-gray-700 mb-6">
                            {t('student.subtitle')}
                          </p>
                          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg" asChild>
                            <Link href="/auth/register">
                              {t('student.cta')}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                        <div className="md:w-72 flex-shrink-0">
                          <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary/20 text-center">
                            <GraduationCap className="h-10 w-10 text-primary mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900 mb-1">{t('student.cardTitle')}</div>
                            <p className="text-sm text-gray-600">{t('student.cardNote')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Value features grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { icon: BookOpen, featureKey: 'student.features.portfolio' },
                      { icon: BadgeCheck, featureKey: 'student.features.verification' },
                      { icon: Briefcase, featureKey: 'student.features.discovery' },
                    ].map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.featureKey}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="h-full bg-white/80 hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-3">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                              <CardTitle className="text-lg">{t(`${item.featureKey}.title`)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-600 mb-4">{t(`${item.featureKey}.description`)}</p>
                              <ul className="space-y-2">
                                {[0, 1, 2].map((idx) => (
                                  <li key={idx} className="flex items-start text-sm">
                                    <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{t(`${item.featureKey}.items.${idx}`)}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ─── INSTITUTES ─── */}
              {selectedSegment === 'institutes' && (
                <div className="max-w-5xl mx-auto">
                  {/* Value proposition */}
                  <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-primary/5 shadow-xl mb-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <CardContent className="p-8 md:p-12 relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-1">
                          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 text-sm">
                            {t('institute.badge')}
                          </Badge>
                          <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                            {t('institute.title')}
                          </h2>
                          <p className="text-lg text-gray-700 mb-6">
                            {t('institute.subtitle')}
                          </p>
                          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg" asChild>
                            <Link href="/contact">
                              {t('institute.cta')}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                        <div className="md:w-72 flex-shrink-0">
                          <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary/20 text-center">
                            <School className="h-10 w-10 text-primary mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900 mb-1">{t('institute.cardTitle')}</div>
                            <p className="text-sm text-gray-600">{t('institute.cardNote')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Value features grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { icon: BadgeCheck, featureKey: 'institute.features.verify' },
                      { icon: BarChart3, featureKey: 'institute.features.track' },
                      { icon: SearchCheck, featureKey: 'institute.features.connect' },
                    ].map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.featureKey}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="h-full bg-white/80 hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-3">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                              <CardTitle className="text-lg">{t(`${item.featureKey}.title`)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-600 mb-4">{t(`${item.featureKey}.description`)}</p>
                              <ul className="space-y-2">
                                {[0, 1, 2].map((idx) => (
                                  <li key={idx} className="flex items-start text-sm">
                                    <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{t(`${item.featureKey}.items.${idx}`)}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                {t('faq.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{t(`faq.questions.${idx}.q`)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-800">{t(`faq.questions.${idx}.a`)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-display font-bold mb-4">
                  {t('finalCta.title')}
                </h2>
                <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                  {t('finalCta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/auth/register">
                      {t('finalCta.primaryButton')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                    <Link href="/demo/ai-search">
                      {t('finalCta.secondaryButton')}
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-white/80 mt-6">
                  {t('finalCta.benefits')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
