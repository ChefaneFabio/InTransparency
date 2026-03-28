'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'

export default function ForConsultingPage() {
  const t = useTranslations('forConsulting')

  const painPoints = [
    t('pain.tooManyCvs'),
    t('pain.cantVerifySoftSkills'),
    t('pain.gradesNotComparable'),
  ]

  const solutions = [
    { title: t('solution.discProfiles.title'), desc: t('solution.discProfiles.desc') },
    { title: t('solution.normalizedGrades.title'), desc: t('solution.normalizedGrades.desc') },
    { title: t('solution.verifiedSkills.title'), desc: t('solution.verifiedSkills.desc') },
    { title: t('solution.decisionPack.title'), desc: t('solution.decisionPack.desc') },
  ]

  return (
    <div className="min-h-screen segment-recruiter">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
          <div className="container text-center max-w-4xl">
            <Badge className="mb-6 bg-primary/50/20 text-purple-200 border-purple-400/30">
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
              {painPoints.map((text, i) => (
                <Card key={i} className="border-amber-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-amber-800 font-medium">{text}</p>
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
                    <h3 className="font-semibold text-lg mb-1">{sol.title}</h3>
                    <p className="text-gray-600">{sol.desc}</p>
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
                  <div className="text-5xl font-bold text-primary/15 mb-2">
                    {String(step).padStart(2, '0')}
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
            <div className="bg-primary/5 rounded-2xl p-8 mb-8">
              <div className="text-5xl font-bold text-purple-700 mb-2">{t('pricing.price')}</div>
              <p className="text-gray-600 mb-6">{t('pricing.perContact')}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-gray-700">
                <span>{t('pricing.noSubscription')}</span>
                <span>{t('pricing.browseFree')}</span>
                <span>{t('pricing.decisionPackIncluded')}</span>
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
