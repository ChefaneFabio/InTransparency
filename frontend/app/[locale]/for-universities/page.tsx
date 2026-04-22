'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Inbox,
  FileSignature,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { FAQ } from '@/components/engagement/FAQ'
import { StickyCTA } from '@/components/engagement/StickyCTA'
import GradeNormalizerDemo from '@/components/demo/GradeNormalizerDemo'
import DecisionPackPreview from '@/components/demo/DecisionPackPreview'
import AnalyticsPreview from '@/components/demo/AnalyticsPreview'
import { UniversityUrgency } from '@/components/sections/universities/UniversityUrgency'
import { SavingsCalculator } from '@/components/sections/universities/SavingsCalculator'
import { UniversityPrestige } from '@/components/sections/universities/UniversityPrestige'

const COUNTRY_TABS = [
  {
    code: 'IT',
    flag: '🇮🇹',
    label: 'Italy',
    pain: 'Career services rely on end-of-year surveys with 15% response rates. Placement data is months old by the time it reaches ministry reports.',
    value: 'Real-time placement funnels replace surveys. Grade normalization (18-30 scale) lets companies from DE, FR, NL instantly understand your students\' results.',
  },
  {
    code: 'DE',
    flag: '🇩🇪',
    label: 'Germany',
    pain: 'Dual-study partnerships lack visibility into which companies actually engage with students. The inverted grading system (1.0 = best) confuses international recruiters.',
    value: 'Automatic grade translation (1.0-5.0 → all EU systems). Company leaderboard shows which employers actively recruit from your Hochschule.',
  },
  {
    code: 'FR',
    flag: '🇫🇷',
    label: 'France',
    pain: 'Grandes écoles and universities compete for the same employer relationships but lack data on recruiter behaviour and cross-border placement.',
    value: 'Unified analytics across formations. Erasmus Bridge connects your exchange students to both home and host employer networks simultaneously.',
  },
  {
    code: 'ES',
    flag: '🇪🇸',
    label: 'Spain',
    pain: 'Youth unemployment at 27% makes placement proof essential for accreditation. Most prácticas go untracked after the initial agreement.',
    value: 'Verified placement tracking from first contact to hiring outcome. Exportable reports for ANECA accreditation and ministerial reporting.',
  },
  {
    code: 'NL',
    flag: '🇳🇱',
    label: 'Netherlands',
    pain: 'HBO and WO institutions need to demonstrate employability outcomes for NVAO accreditation. International student placement is especially hard to track.',
    value: 'Cross-border placement visibility for your international cohorts. Decision Packs translate Dutch grades for employers across Europe.',
  },
]

export default function ForUniversitiesPage() {
  const t = useTranslations('forUniversities')
  const [activeCountry, setActiveCountry] = useState('IT')
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen segment-university">
      <Header />

      {/* Hero — lead with the real pilot story */}
      <section className="relative overflow-hidden bg-foreground text-white">
        <img src="/images/brand/campus.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative container max-w-6xl mx-auto px-4 pt-32 pb-16 lg:pt-36 lg:pb-20 min-h-[420px] flex flex-col justify-center">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact?subject=university-pilot">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 w-full sm:w-auto">
                  {t('hero.demoCta')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/register/academic-partner">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  {t('hero.registerCta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Proof — real social proof first */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('socialProof.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-primary/20 border-2">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{t('socialProof.unibg.title')}</h3>
                  <p className="text-sm text-gray-500">{t('socialProof.unibg.subtitle')}</p>
                </div>
                <p className="text-sm text-gray-700 mb-4">{t('socialProof.unibg.description')}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">{t('socialProof.unibg.status')}</Badge>
                  <Badge variant="secondary">2026</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 border-2">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{t('socialProof.startCup.title')}</h3>
                  <p className="text-sm text-gray-500">{t('socialProof.startCup.subtitle')}</p>
                </div>
                <p className="text-sm text-gray-700 mb-4">{t('socialProof.startCup.description')}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Start Cup Bergamo</Badge>
                  <Badge variant="secondary">2025</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Institutional Workspace — M1-M4 modules showcase (shipped 2026-04) */}
      <section className="py-16 bg-gradient-to-br from-amber-50/40 via-white to-blue-50/40">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Institutional Workspace
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('workspaceModules.title', {
                defaultValue: 'Built for the career office — not just another job board',
              })}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('workspaceModules.subtitle', {
                defaultValue:
                  'Four modules that turn placement from spreadsheets into an auditable workflow. Preview on the free CORE tier; unlock writes with PREMIUM.',
              })}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Inbox,
                code: 'M1',
                title: t('workspaceModules.m1.title', { defaultValue: 'Mediation Inbox' }),
                desc: t('workspaceModules.m1.desc', {
                  defaultValue:
                    'Every recruiter message to your students is reviewed by your staff first. Approve, edit, or reject. Full audit trail.',
                }),
                color: 'text-blue-600',
                bg: 'bg-blue-100',
              },
              {
                icon: FileSignature,
                code: 'M2',
                title: t('workspaceModules.m2.title', { defaultValue: 'Offer Moderation' }),
                desc: t('workspaceModules.m2.desc', {
                  defaultValue:
                    'Job offers tied to your institution go to PENDING_APPROVAL. Block offers that violate stage rules before students see them.',
                }),
                color: 'text-purple-600',
                bg: 'bg-purple-100',
              },
              {
                icon: Building2,
                code: 'M3',
                title: t('workspaceModules.m3.title', { defaultValue: 'Company CRM' }),
                desc: t('workspaceModules.m3.desc', {
                  defaultValue:
                    'Drag-and-drop kanban from first contact to signed convention. Track every company relationship your career office manages.',
                }),
                color: 'text-emerald-600',
                bg: 'bg-emerald-100',
              },
              {
                icon: GraduationCap,
                code: 'M4',
                title: t('workspaceModules.m4.title', { defaultValue: 'Placement Pipeline' }),
                desc: t('workspaceModules.m4.desc', {
                  defaultValue:
                    'Full tirocinio lifecycle — hours log, mid/final evaluations, deadlines, convention auto-generation. Replaces your career office spreadsheets.',
                }),
                color: 'text-amber-600',
                bg: 'bg-amber-100',
              },
            ].map((m, i) => {
              const Icon = m.icon
              return (
                <motion.div
                  key={m.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${m.color}`} />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">{m.code}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1.5">{m.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{m.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600 mb-4 max-w-xl mx-auto">
              {t('workspaceModules.compliance', {
                defaultValue:
                  'Every write is logged for AI Act compliance. Students retain GDPR Art. 22 rights on every automated decision.',
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/pricing?for=institutions">
                <Button variant="default" size="lg">
                  {t('workspaceModules.pricingCta', { defaultValue: 'See pricing' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact?subject=institutional-demo">
                <Button variant="outline" size="lg">
                  {t('workspaceModules.demoCta', { defaultValue: 'Request a demo' })}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency — why this decision can't wait */}
      <UniversityUrgency />

      {/* Savings calculator — hard-money value prop */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <SavingsCalculator />
        </div>
      </section>

      {/* Prestige — rector-level framing */}
      <UniversityPrestige />

      {/* Grade Normalizer Demo — most tangible value prop, show it early */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('demos.gradeNormalizer.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              {t('demos.gradeNormalizer.description')}
            </p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            <GradeNormalizerDemo />
          </div>
        </div>
      </section>

      {/* Country-specific pain/value */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('countries.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('countries.subtitle')}
            </p>
          </div>

          <Tabs value={activeCountry} onValueChange={setActiveCountry}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-lg mx-auto mb-8">
              {COUNTRY_TABS.map((tab) => (
                <TabsTrigger key={tab.code} value={tab.code} className="text-sm">
                  {tab.flag} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {COUNTRY_TABS.map((tab) => (
              <TabsContent key={tab.code} value={tab.code}>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-red-800 mb-2">{t('countries.painLabel')}</h3>
                      <p className="text-sm text-red-700">{tab.pain}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-green-800 mb-2">{t('countries.valueLabel')}</h3>
                      <p className="text-sm text-green-700">{tab.value}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* More Demos — Decision Pack + Analytics */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('demos.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              {t('demos.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold">{t('demos.decisionPack.title')}</h3>
                <p className="text-sm text-gray-600">{t('demos.decisionPack.description')}</p>
              </div>
              <div className="max-w-2xl">
                <DecisionPackPreview data={null} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold">{t('demos.analytics.title')}</h3>
                <p className="text-sm text-gray-600">{t('demos.analytics.description')}</p>
              </div>
              <div className="max-w-2xl">
                <AnalyticsPreview />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Co-Creation */}
      <section className="py-16 bg-amber-50/50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
              Co-Creation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('coCreation.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              {t('coCreation.subtitle')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-amber-100">
                  <CardContent className="pt-6">
                    <h3 className="text-base font-bold mb-2">{t(`coCreation.points.${i}.title`)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t(`coCreation.points.${i}.desc`)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('faq.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>

          <FAQ
            items={Array.from({ length: 5 }, (_, i) => ({
              question: t(`faq.items.${i}.question`),
              answer: t(`faq.items.${i}.answer`),
            }))}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?subject=university-pilot">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 w-full sm:w-auto">
                {t('cta.demoButton')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/register/academic-partner">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                {t('cta.registerButton')}
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-200">
            <span>{t('cta.features.free')}</span>
            <span>{t('cta.features.gdpr')}</span>
            <span>{t('cta.features.setup')}</span>
          </div>
        </div>
      </section>
      <Footer />
      <StickyCTA show={showSticky} text={t('cta.demoButton')} href="/contact?subject=university-pilot" />
    </div>
  )
}
