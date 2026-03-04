'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import {
  Brain,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  MessageSquare,
} from 'lucide-react'

export default function ForConsultingPage() {
  const t = useTranslations('forConsulting')

  const painPoints = [
    { icon: Users, text: t('pain.tooManyCvs') },
    { icon: Brain, text: t('pain.cantVerifySoftSkills') },
    { icon: BarChart3, text: t('pain.gradesNotComparable') },
  ]

  const solutions = [
    { icon: Brain, title: t('solution.discProfiles.title'), desc: t('solution.discProfiles.desc') },
    { icon: BarChart3, title: t('solution.normalizedGrades.title'), desc: t('solution.normalizedGrades.desc') },
    { icon: Shield, title: t('solution.verifiedSkills.title'), desc: t('solution.verifiedSkills.desc') },
    { icon: Target, title: t('solution.decisionPack.title'), desc: t('solution.decisionPack.desc') },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
          <div className="container text-center max-w-4xl">
            <Badge className="mb-6 bg-purple-500/20 text-purple-200 border-purple-400/30">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-gray-100">
                <Link href="/explore">
                  {t('hero.browseCta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link href="/contact?subject=consulting-demo">
                  {t('hero.demoCta')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 bg-amber-50">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-8 text-amber-900">
              {t('pain.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((point, i) => (
                <Card key={i} className="border-amber-200">
                  <CardContent className="p-6 text-center">
                    <point.icon className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                    <p className="text-amber-800 font-medium">{point.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-4">{t('solution.title')}</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">{t('solution.subtitle')}</p>
            <div className="grid md:grid-cols-2 gap-6">
              {solutions.map((sol, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                        <sol.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{sol.title}</h3>
                        <p className="text-gray-600">{sol.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works for consulting */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-8">{t('howItWorks.title')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="text-center">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold mb-2">{t(`howItWorks.step${step}.title`)}</h3>
                  <p className="text-gray-600 text-sm">{t(`howItWorks.step${step}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16">
          <div className="container max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">{t('pricing.title')}</h2>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 mb-8">
              <div className="text-5xl font-bold text-purple-700 mb-2">{t('pricing.price')}</div>
              <p className="text-gray-600 mb-6">{t('pricing.perContact')}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-gray-700">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-600" /> {t('pricing.noSubscription')}</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-600" /> {t('pricing.browseFree')}</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-600" /> {t('pricing.decisionPackIncluded')}</span>
              </div>
            </div>
            <Button size="lg" asChild>
              <Link href="/auth/register/recruiter">
                {t('pricing.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
