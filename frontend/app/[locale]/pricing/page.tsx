'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Building2, GraduationCap, ArrowRight, Zap, Crown, School } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// TODO: Add translations for studentPlans, companyPlans, institutePlans arrays
type PricingSegment = 'students' | 'companies' | 'institutes'

const studentPlans = [
  {
    name: 'Free',
    price: '€0',
    period: '',
    description: 'Everything you need to get discovered',
    icon: GraduationCap,
    popular: true,
    highlight: true,
    badge: 'Free',
    features: [
      'Unlimited project uploads',
      'University verification',
      'Public portfolio page',
      'Company discovery',
      'Profile analytics'
    ],
    cta: 'Get Started',
    ctaLink: '/auth/register'
  },
  {
    name: 'Premium',
    price: '€9',
    period: '/month',
    description: 'Priority visibility and advanced tools',
    icon: Crown,
    popular: false,
    highlight: false,
    badge: 'Optional',
    features: [
      'Everything in Free',
      'Priority in search results',
      'Custom portfolio URL',
      'Contact recruiters directly',
      'Advanced analytics'
    ],
    cta: 'Start Free Trial',
    ctaLink: '/auth/register'
  }
]

const companyPlans = [
  {
    name: 'Browse Free',
    price: '€0',
    period: '',
    description: 'Explore verified talent at no cost',
    icon: Zap,
    popular: false,
    badge: 'Free',
    features: [
      'Unlimited profile browsing',
      'Advanced search filters',
      'Save candidates',
      'View verified skills',
      'No credit card required'
    ],
    cta: 'Start Exploring',
    ctaLink: '/auth/register'
  },
  {
    name: 'Pay Per Contact',
    price: '€10',
    period: '/contact',
    description: 'Pay only when you reach out',
    icon: Building2,
    popular: true,
    badge: 'Most Popular',
    features: [
      'Everything in Browse Free',
      'Unlock full contact details',
      'View complete project info',
      'Credits with no expiration',
      'Volume discounts available'
    ],
    cta: 'Get Started',
    ctaLink: '/auth/register',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: '€99',
    period: '/month',
    description: 'Full access for teams',
    icon: Crown,
    popular: false,
    badge: 'Teams',
    features: [
      'Unlimited contacts',
      'API access',
      'ATS integration',
      'Dedicated support',
      'Custom analytics'
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    highlight: false
  }
]

const institutePlans = [
  {
    name: 'Free',
    price: '€0',
    period: '',
    description: 'Everything you need to verify and place students',
    icon: School,
    popular: true,
    badge: 'Free',
    features: [
      'Verify student projects',
      'Batch approval dashboard',
      'Placement analytics',
      'Company visibility tracking',
      'No credit card required'
    ],
    cta: 'Get Started',
    ctaLink: '/contact',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: '€2,000',
    period: '/year',
    description: 'For large institutions with custom needs',
    icon: Crown,
    popular: false,
    badge: 'Enterprise',
    features: [
      'Everything in Free',
      'API integration',
      'White-label option',
      'Multi-campus support',
      'Dedicated account manager'
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    highlight: false
  }
]

export default function PricingPage() {
  const t = useTranslations('pricingPage')
  const [selectedSegment, setSelectedSegment] = useState<PricingSegment>('students')

  const getPlans = () => {
    switch (selectedSegment) {
      case 'students': return studentPlans
      case 'institutes': return institutePlans
      case 'companies': return companyPlans
    }
  }

  const getHeaderContent = () => {
    switch (selectedSegment) {
      case 'students': return {
        badge: 'For Students',
        title: 'Free',
        subtitle: 'Build your verified portfolio. Get discovered by companies.'
      }
      case 'institutes': return {
        badge: 'For Universities & ITS',
        title: 'Free',
        subtitle: 'Verify student projects. Track placement outcomes.'
      }
      case 'companies': return {
        badge: 'For Companies',
        title: 'Pay Per Contact',
        subtitle: 'Browse verified profiles free. Pay only when you reach out.'
      }
    }
  }

  const plans = getPlans()
  const headerContent = getHeaderContent()

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section with Animated Background */}
          <div className="relative">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                animate={{
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                animate={{
                  x: [0, -50, 0],
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 relative z-10"
            >
              <motion.h1
                className="text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                {t('hero.title')}
              </motion.h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
                {t('hero.subtitle')}</p>
              <p className="text-base text-gray-600 max-w-2xl mx-auto mb-12">
                {t('hero.description')}
              </p>

            {/* Segment Selector */}
            <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
              {(['students', 'institutes', 'companies'] as PricingSegment[]).map((segment) => {
                const Icon = segment === 'students' ? GraduationCap : segment === 'institutes' ? School : Building2
                return (
                  <button
                    key={segment}
                    onClick={() => setSelectedSegment(segment)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSegment === segment
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
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
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-primary/10 text-primary text-sm px-4 py-2">
                {headerContent.badge}
              </Badge>
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                {headerContent.title}
              </h2>
              <p className="text-lg text-gray-700">
                {headerContent.subtitle}
              </p>
            </motion.div>

            <div className={`grid gap-8 max-w-6xl mx-auto ${
              plans.length === 2 ? 'md:grid-cols-2 max-w-5xl' :
              plans.length === 3 ? 'md:grid-cols-3' :
              'md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {plans.map((plan, index) => {
                const Icon = plan.icon
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                  <Card
                    className={`relative ${plan.highlight ? 'border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm' : 'border-gray-200 bg-white/80 backdrop-blur-sm'} h-full flex flex-col hover:shadow-2xl transition-all duration-300`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 shadow-lg">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8 pt-8">
                      <motion.div
                        className={`mx-auto mb-4 rounded-full p-4 ${plan.highlight ? 'bg-primary/10' : 'bg-gray-100'}`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className={`h-8 w-8 ${plan.highlight ? 'text-primary' : 'text-gray-600'}`} />
                      </motion.div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        {plan.period && plan.period !== 'forever' && (
                          <span className="text-gray-600 ml-1">{plan.period}</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className="flex items-start"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: idx * 0.1 + 0.2, type: "spring" }}
                            >
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            </motion.div>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <Button
                        asChild
                        className={`w-full ${plan.highlight ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' : ''}`}
                        variant={plan.highlight ? 'default' : 'outline'}
                      >
                        <Link href={plan.ctaLink}>
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
          {/* TODO: Add translations for finalCTA section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-display font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                  Start exploring for free. Only pay when you find the perfect candidate.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/auth/register">
                      Start Exploring Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                    <Link href="/contact">
                      Talk to Sales
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-white/80 mt-6">
                  No credit card required
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
