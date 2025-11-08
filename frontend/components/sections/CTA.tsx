'use client'

import { Link } from '@/navigation'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function CTA() {
  const t = useTranslations('home.cta')

  // Get benefits from translations
  const benefits = Array.from({ length: 6 }, (_, i) => t(`main.benefits.${i}`))

  // Get pricing tiers from translations
  const pricingTiers = [
    {
      name: t('pricing.tiers.0.name'),
      price: t('pricing.tiers.0.price'),
      period: null,
      description: t('pricing.tiers.0.description'),
      features: Array.from({ length: 5 }, (_, i) => t(`pricing.tiers.0.features.${i}`)),
      cta: t('pricing.tiers.0.cta'),
      popular: false
    },
    {
      name: t('pricing.tiers.1.name'),
      price: t('pricing.tiers.1.price'),
      period: t('pricing.tiers.1.period'),
      description: t('pricing.tiers.1.description'),
      features: Array.from({ length: 6 }, (_, i) => t(`pricing.tiers.1.features.${i}`)),
      cta: t('pricing.tiers.1.cta'),
      popular: true
    },
    {
      name: t('pricing.tiers.2.name'),
      price: t('pricing.tiers.2.price'),
      period: null,
      description: t('pricing.tiers.2.description'),
      features: Array.from({ length: 6 }, (_, i) => t(`pricing.tiers.2.features.${i}`)),
      cta: t('pricing.tiers.2.cta'),
      popular: false
    }
  ]
  return (
    <section className="relative py-24 overflow-hidden hero-bg">
      <div className="container relative z-10">
        {/* Main CTA */}
        <div className="text-center mb-24">
          <h2 className="text-4xl font-display font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            {t('main.title')}{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('main.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('main.subtitle')}
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-left">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href="/auth/register">
                {t('main.primaryCTA')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">
                {t('main.secondaryCTA')}
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-700 mt-4">
            {t('main.finePrint')}
          </p>
        </div>

        {/* Pricing Section - Hidden on homepage, available on /pricing page */}
        {/* <div className="mb-24">
          ... pricing content removed for homepage ...
        </div> */}

        {/* Social Proof / Viral Section */}
        <div className="mb-24 text-center">
          <h3 className="text-3xl font-display font-bold text-foreground mb-4">
            {t('socialProof.title')}
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('socialProof.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {[0, 1, 2].map((index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-all hover:shadow-lg">
                <div className="text-3xl font-bold text-primary mb-2">{t(`socialProof.stats.${index}.value`)}</div>
                <p className="text-gray-600">{t(`socialProof.stats.${index}.label`)}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/success-stories">
                {t('socialProof.readStories')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/students">
                {t('socialProof.browsePortfolios')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-display font-bold mb-4">
            {t('finalBanner.title')}
          </h3>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            {t('finalBanner.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <Link href="/auth/register">
                {t('finalBanner.createAccount')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link href="/contact">
                {t('finalBanner.schedulDemo')}
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-white">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>{t(`finalBanner.benefits.${index}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-700 mb-6">
            {t('trustIndicator')}
          </p>
        </div>
      </div>
    </section>
  )
}