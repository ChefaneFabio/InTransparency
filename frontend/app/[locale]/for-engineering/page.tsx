'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'

export default function ForEngineeringPage() {
  const t = useTranslations('forEngineering')

  const painPoints = [
    t('pain.cantCompete'),
    t('pain.cvsDontShow'),
    t('pain.costPerHire'),
  ]

  const solutions = [
    { title: t('solution.verifiedProjects.title'), desc: t('solution.verifiedProjects.desc') },
    { title: t('solution.technicalPortfolios.title'), desc: t('solution.technicalPortfolios.desc') },
    { title: t('solution.institutionBacked.title'), desc: t('solution.institutionBacked.desc') },
    { title: t('solution.personalityInsights.title'), desc: t('solution.personalityInsights.desc') },
  ]

  const sectors = [
    t('sectors.mechatronics'),
    t('sectors.automation'),
    t('sectors.aerospace'),
    t('sectors.automotive'),
    t('sectors.energy'),
    t('sectors.biomedical'),
    t('sectors.civilEngineering'),
    t('sectors.electronics'),
  ]

  return (
    <div className="min-h-screen segment-recruiter">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="container text-center max-w-4xl">
            <Badge className="mb-6 bg-primary/50/20 text-blue-200 border-blue-400/30">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
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
                <Link href="/contact?subject=engineering-demo">
                  {t('hero.demoCta')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 bg-red-50">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-8 text-red-900">
              {t('pain.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((text, i) => (
                <Card key={i} className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-red-800 font-medium">{text}</p>
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

        {/* Sectors */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-8">{t('sectors.title')}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {sectors.map((sector, i) => (
                <Badge key={i} variant="secondary" className="text-sm px-4 py-2">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16">
          <div className="container max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">{t('pricing.title')}</h2>
            <div className="bg-primary/5 rounded-2xl p-8 mb-8">
              <div className="text-5xl font-bold text-blue-700 mb-2">{t('pricing.price')}</div>
              <p className="text-gray-600 mb-6">{t('pricing.perContact')}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-gray-700">
                <span>{t('pricing.noSubscription')}</span>
                <span>{t('pricing.browseFree')}</span>
                <span>{t('pricing.noMinimum')}</span>
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
