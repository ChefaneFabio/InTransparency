'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GraduationCap,
  BarChart3,
  Globe,
  Shield,
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  TrendingUp,
  Zap,
} from 'lucide-react'
import DecisionPackPreview from '@/components/demo/DecisionPackPreview'
import GradeNormalizerDemo from '@/components/demo/GradeNormalizerDemo'
import AnalyticsPreview from '@/components/demo/AnalyticsPreview'
import { sampleDecisionPack } from '@/lib/sample-decision-pack'

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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative container max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              <Building2 className="h-3 w-3 mr-1" />
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?role=UNIVERSITY">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 w-full sm:w-auto">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  {t('hero.registerCta')}
                </Button>
              </Link>
              <Link href="/contact?subject=university-demo">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  {t('hero.demoCta')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '2,400+', label: t('hero.stats.students') },
              { icon: Building2, value: '180+', label: t('hero.stats.companies') },
              { icon: Globe, value: '6', label: t('hero.stats.countries') },
              { icon: TrendingUp, value: '87%', label: t('hero.stats.placementRate') },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-300" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-blue-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Tabs */}
      <section className="py-16 bg-gray-50">
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
            <TabsList className="grid grid-cols-5 max-w-lg mx-auto mb-8">
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

      {/* Interactive Demos */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              {t('demos.badge')}
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('demos.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('demos.subtitle')}
            </p>
          </div>

          <div className="space-y-16">
            {/* Decision Pack */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('demos.decisionPack.title')}</h3>
                  <p className="text-sm text-gray-600">{t('demos.decisionPack.description')}</p>
                </div>
              </div>
              <div className="max-w-2xl">
                <DecisionPackPreview data={sampleDecisionPack} />
              </div>
            </div>

            {/* Grade Normalizer */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('demos.gradeNormalizer.title')}</h3>
                  <p className="text-sm text-gray-600">{t('demos.gradeNormalizer.description')}</p>
                </div>
              </div>
              <div className="max-w-xl">
                <GradeNormalizerDemo />
              </div>
            </div>

            {/* Analytics Preview */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('demos.analytics.title')}</h3>
                  <p className="text-sm text-gray-600">{t('demos.analytics.description')}</p>
                </div>
              </div>
              <div className="max-w-2xl">
                <AnalyticsPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('socialProof.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-blue-100">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('socialProof.unibg.title')}</h3>
                    <p className="text-xs text-gray-500">{t('socialProof.unibg.subtitle')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">{t('socialProof.unibg.description')}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Pilot Partner</Badge>
                  <Badge variant="secondary">2024-2025</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-amber-100">
                    <Zap className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('socialProof.startCup.title')}</h3>
                    <p className="text-xs text-gray-500">{t('socialProof.startCup.subtitle')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">{t('socialProof.startCup.description')}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Start Cup Bergamo</Badge>
                  <Badge variant="secondary">2024</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=UNIVERSITY">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 w-full sm:w-auto">
                <GraduationCap className="h-5 w-5 mr-2" />
                {t('cta.registerButton')}
              </Button>
            </Link>
            <Link href="/contact?subject=university-demo">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                {t('cta.demoButton')}
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {t('cta.features.free')}</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {t('cta.features.gdpr')}</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {t('cta.features.setup')}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
