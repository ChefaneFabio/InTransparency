'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Building2, GraduationCap, ArrowRight, Zap, Crown, School, Star, Heart, Briefcase } from 'lucide-react'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'

type PricingSegment = 'students' | 'companies' | 'institutes'

export default function PricingPage() {
  const t = useTranslations('pricingPage')
  const [selectedSegment, setSelectedSegment] = useState<PricingSegment>('companies')

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="relative">
            {/* Clean layout — no floating orbs */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 relative z-10"
            >
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
                {(['companies', 'students', 'institutes'] as PricingSegment[]).map((segment) => {
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
          </div>

          {/* Dynamic Pricing Section */}
          <div className="mb-20">
            <motion.div
              key={selectedSegment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* ─── COMPANIES: Founding Partner Program ─── */}
              {selectedSegment === 'companies' && (
                <div className="max-w-5xl mx-auto">
                  {/* Founding Partner Hero Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50 shadow-xl mb-12 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                      <CardContent className="p-8 md:p-12 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-8">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-amber-100 rounded-full">
                                <Heart className="h-6 w-6 text-amber-700" />
                              </div>
                              <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-sm">
                                {t('founding.badge')}
                              </Badge>
                            </div>
                            <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                              {t('founding.title')}
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                              {t('founding.subtitle')}
                            </p>
                            <ul className="space-y-3 mb-8">
                              {[0, 1, 2, 3].map((i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{t(`founding.features.${i}`)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button
                                size="lg"
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
                                asChild
                              >
                                <Link href="/contact?subject=founding-partner">
                                  {t('founding.cta')}
                                  <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                              </Button>
                              <Button size="lg" variant="outline" asChild>
                                <Link href="/demo/ai-search">
                                  {t('founding.demoCta')}
                                </Link>
                              </Button>
                            </div>
                          </div>
                          <div className="md:w-64 flex-shrink-0">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200 text-center">
                              <div className="text-5xl font-bold text-amber-600 mb-1">€0</div>
                              <div className="text-sm text-gray-600 mb-4">{t('founding.priceNote')}</div>
                              <div className="space-y-2 text-sm text-left">
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <span className="text-gray-700">{t('founding.perk1')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <span className="text-gray-700">{t('founding.perk2')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <span className="text-gray-700">{t('founding.perk3')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* After Pilot — future pricing (collapsed, secondary) */}
                  <div className="text-center mb-8">
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                      {t('founding.afterPilotLabel')}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-75 hover:opacity-100 transition-opacity duration-300">
                    {[
                      { name: t('plans.company.browse.name'), price: '€0', period: '', icon: Zap, features: [0, 1, 2, 3, 4], highlight: false, badge: t('plans.company.browse.badge'), cta: t('plans.company.browse.cta'), link: '/auth/register', featureKey: 'plans.company.browse.features' },
                      { name: t('plans.company.payPerContact.name'), price: '€10', period: t('plans.company.payPerContact.period'), icon: Building2, features: [0, 1, 2, 3, 4], highlight: false, badge: t('plans.company.payPerContact.badge'), cta: t('plans.company.payPerContact.cta'), link: '/auth/register', featureKey: 'plans.company.payPerContact.features' },
                      { name: t('plans.company.payPerPosition.name'), price: '€49', period: t('plans.company.payPerPosition.period'), icon: Briefcase, features: [0, 1, 2, 3, 4], highlight: true, badge: t('plans.company.payPerPosition.badge'), cta: t('plans.company.payPerPosition.cta'), link: '/dashboard/recruiter/positions', featureKey: 'plans.company.payPerPosition.features' },
                      { name: t('plans.company.enterprise.name'), price: '€99', period: t('plans.company.enterprise.period'), icon: Crown, features: [0, 1, 2, 3, 4], highlight: false, badge: t('plans.company.enterprise.badge'), cta: t('plans.company.enterprise.cta'), link: '/contact', featureKey: 'plans.company.enterprise.features' },
                    ].map((plan, index) => {
                      const Icon = plan.icon
                      return (
                        <motion.div
                          key={plan.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className={`relative ${plan.highlight ? 'border-2 border-primary shadow-lg' : 'border-gray-200'} h-full flex flex-col bg-white/80`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <Badge className="bg-gray-100 text-gray-600 border-gray-300 text-xs">{plan.badge}</Badge>
                            </div>
                            <CardHeader className="text-center pb-4 pt-8">
                              <div className={`mx-auto mb-3 rounded-full p-3 ${plan.highlight ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                <Icon className={`h-6 w-6 ${plan.highlight ? 'text-primary' : 'text-gray-500'}`} />
                              </div>
                              <CardTitle className="text-lg mb-1">{plan.name}</CardTitle>
                              <div>
                                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                                {plan.period && <span className="text-gray-500 ml-1 text-sm">{plan.period}</span>}
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                              <ul className="space-y-2 mb-6 flex-1">
                                {plan.features.map((_, idx) => (
                                  <li key={idx} className="flex items-start text-sm">
                                    <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600">{t(`${plan.featureKey}.${idx}`)}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button asChild variant={plan.highlight ? 'default' : 'outline'} size="sm" className={plan.highlight ? 'bg-primary' : ''}>
                                <Link href={plan.link}>
                                  {plan.cta}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
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
                  <div className="text-center mb-12">
                    <Badge className="mb-4 bg-primary/10 text-primary text-sm px-4 py-2">
                      {t('plans.student.badge')}
                    </Badge>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-4">{t('plans.student.title')}</h2>
                    <p className="text-lg text-gray-700">{t('plans.student.subtitle')}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {[
                      { name: t('plans.student.free.name'), price: '€0', icon: GraduationCap, features: [0, 1, 2, 3, 4], highlight: true, badge: t('plans.student.free.badge'), cta: t('plans.student.free.cta'), link: '/auth/register', featureKey: 'plans.student.free.features' },
                      { name: t('plans.student.premium.name'), price: '€9', period: t('plans.student.premium.period'), icon: Crown, features: [0, 1, 2, 3, 4], highlight: false, badge: t('plans.student.premium.badge'), cta: t('plans.student.premium.cta'), link: '/auth/register', featureKey: 'plans.student.premium.features' },
                    ].map((plan, index) => {
                      const Icon = plan.icon
                      return (
                        <motion.div
                          key={plan.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                                                  >
                          <Card className={`relative ${plan.highlight ? 'border-2 border-primary shadow-xl bg-primary/5' : 'border-gray-200 bg-white/80'} h-full flex flex-col`}>
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                              <Badge className="bg-primary text-primary-foreground px-4 py-1">{plan.badge}</Badge>
                            </div>
                            <CardHeader className="text-center pb-8 pt-8">
                              <motion.div className={`mx-auto mb-4 rounded-full p-4 ${plan.highlight ? 'bg-primary/10' : 'bg-gray-100'}`} >
                                <Icon className={`h-8 w-8 ${plan.highlight ? 'text-primary' : 'text-gray-600'}`} />
                              </motion.div>
                              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                              <div className="mb-4">
                                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                              <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((_, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 text-sm">{t(`${plan.featureKey}.${idx}`)}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button asChild className={`w-full ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`} variant={plan.highlight ? 'default' : 'outline'}>
                                <Link href={plan.link}>{plan.cta}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                              </Button>
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
                  <div className="text-center mb-12">
                    <Badge className="mb-4 bg-primary/10 text-primary text-sm px-4 py-2">
                      {t('plans.institute.badge')}
                    </Badge>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-4">{t('plans.institute.title')}</h2>
                    <p className="text-lg text-gray-700">{t('plans.institute.subtitle')}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {[
                      { name: t('plans.institute.free.name'), price: '€0', icon: School, features: [0, 1, 2, 3, 4], highlight: true, badge: t('plans.institute.free.badge'), cta: t('plans.institute.free.cta'), link: '/contact', featureKey: 'plans.institute.free.features' },
                      { name: t('plans.institute.enterprise.name'), price: '€2,000', period: t('plans.institute.enterprise.period'), icon: Crown, features: [0, 1, 2, 3, 4], highlight: false, badge: t('plans.institute.enterprise.badge'), cta: t('plans.institute.enterprise.cta'), link: '/contact', featureKey: 'plans.institute.enterprise.features' },
                    ].map((plan, index) => {
                      const Icon = plan.icon
                      return (
                        <motion.div
                          key={plan.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                                                  >
                          <Card className={`relative ${plan.highlight ? 'border-2 border-primary shadow-xl bg-primary/5' : 'border-gray-200 bg-white/80'} h-full flex flex-col`}>
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                              <Badge className="bg-primary text-primary-foreground px-4 py-1">{plan.badge}</Badge>
                            </div>
                            <CardHeader className="text-center pb-8 pt-8">
                              <motion.div className={`mx-auto mb-4 rounded-full p-4 ${plan.highlight ? 'bg-primary/10' : 'bg-gray-100'}`} >
                                <Icon className={`h-8 w-8 ${plan.highlight ? 'text-primary' : 'text-gray-600'}`} />
                              </motion.div>
                              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                              <div className="mb-4">
                                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                              <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((_, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 text-sm">{t(`${plan.featureKey}.${idx}`)}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button asChild className={`w-full ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`} variant={plan.highlight ? 'default' : 'outline'}>
                                <Link href={plan.link}>{plan.cta}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                              </Button>
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
                    <Link href="/contact?subject=founding-partner">
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
