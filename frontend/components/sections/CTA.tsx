'use client'

import Link from 'next/link'
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
              <Link href="#demo">
                {t('main.secondaryCTA')}
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-700 mt-4">
            {t('main.finePrint')}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-display font-bold text-foreground mb-4">
              {t('pricing.title')}
            </h3>
            <p className="text-xl text-gray-600">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border-2 p-8 ${
                  tier.popular
                    ? 'border-primary shadow-xl scale-105'
                    : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
                      {t('pricing.mostPopular')}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <div className="text-4xl font-bold text-gray-900">
                    {tier.price}
                    {tier.period && (
                      <span className="text-lg text-gray-700 font-normal">{tier.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {(tier.features || []).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.popular
                      ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white'
                      : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                  }`}
                  asChild
                >
                  <Link href={tier.name === 'University' ? '/contact-sales' : '/auth/register'}>
                    {tier.cta}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-700">
              {t('pricing.allPlansInclude')}
            </p>
          </div>
        </div>

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