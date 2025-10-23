'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star, Users, Building2, GraduationCap, ArrowRight, Zap, Crown, Sparkles, School } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type PricingSegment = 'students' | 'companies' | 'institutes'

const studentPlans = [
  {
    name: 'Free Student',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for building your first portfolio',
    icon: GraduationCap,
    popular: false,
    features: [
      'Create your portfolio',
      'Add up to 3 projects',
      'Basic profile visibility',
      'Receive messages from recruiters',
      'Public portfolio page'
    ],
    cta: 'Start Free',
    ctaLink: '/auth/register/role-selection'
  },
  {
    name: 'Student Pro',
    price: '€9',
    period: 'per month',
    description: 'Get discovered faster with premium features',
    icon: Crown,
    popular: true,
    badge: '🚀 Early Access',
    features: [
      'Everything in Free',
      'Unlimited projects',
      'Priority in search results',
      'Advanced analytics',
      'Custom portfolio URL',
      'Contact recruiters directly',
      'AI-powered insights',
      'Priority support'
    ],
    cta: 'Start 7-Day Trial',
    ctaLink: '/auth/register/role-selection',
    highlight: true
  }
]

const companyPlans = [
  {
    name: 'Explore Free',
    price: '€0',
    period: 'forever',
    description: 'Browse the entire database for free',
    icon: Zap,
    popular: false,
    features: [
      'Free registration (no credit card)',
      'Unlimited database exploration',
      'See all profiles (initials only)',
      'Advanced filters by institution, courses, grades',
      'AI-verified skills from projects',
      'Location and availability filters',
      'Save searches and candidates'
    ],
    cta: 'Start Exploring Free',
    ctaLink: '/auth/register/role-selection'
  },
  {
    name: 'Pay Per Contact',
    price: '€10',
    period: 'per contact',
    description: 'Only pay when you find the right candidate',
    icon: Building2,
    popular: true,
    badge: 'Most Popular',
    features: [
      'Everything in Free',
      '10 credits = €10 per contact unlock',
      'Get full name, email, phone, LinkedIn',
      'AI-generated CV for your position',
      'Buy credits as needed',
      'Volume discounts up to 40%',
      'No monthly commitment',
      'Credits never expire'
    ],
    cta: 'Get Started',
    ctaLink: '/auth/register/role-selection',
    highlight: true
  },
  {
    name: 'Credit Packages',
    price: 'From €50',
    period: 'volume discounts',
    description: 'Buy credits in bulk and save more',
    icon: Building2,
    popular: false,
    features: [
      '50 credits (5 contacts) = €50',
      '200 credits (20 contacts) = €180 (10% off)',
      '500 credits (50 contacts) = €400 (20% off)',
      '1000+ credits = 40% discount',
      'Monthly or annual billing',
      'Custom enterprise packages',
      'Dedicated account manager (1000+)',
      'API access (enterprise)'
    ],
    cta: 'View Packages',
    ctaLink: '/contact'
  }
]

const institutePlans = [
  {
    name: 'First Year Free',
    price: 'Free',
    period: 'first year',
    description: 'Launch with zero cost for the first year',
    icon: School,
    popular: true,
    badge: 'Launch Offer',
    features: [
      'Free for entire first year',
      'Unlimited student portfolios',
      'Full platform access',
      'Career outcome analytics',
      'Employer network access',
      'Custom institution branding',
      'Verification system',
      'Dedicated support'
    ],
    cta: 'Become a Partner',
    ctaLink: '/contact',
    highlight: true
  },
  {
    name: 'Year 2+',
    price: 'Custom',
    period: 'per year',
    description: 'Flexible pricing based on institution size',
    icon: School,
    popular: false,
    features: [
      'Everything in First Year',
      'Pricing based on student count',
      'Advanced analytics dashboard',
      'Priority employer matching',
      'API access for integration',
      'White-label options',
      'Quarterly strategy sessions',
      'Custom reporting'
    ],
    cta: 'Schedule Demo',
    ctaLink: '/contact'
  }
]

export default function PricingPage() {
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
        title: 'Always Free for Students',
        subtitle: 'Build your portfolio, get discovered by top companies. No credit card, no limits, forever.'
      }
      case 'institutes': return {
        badge: 'For Institutes',
        title: 'First Year Completely Free',
        subtitle: 'Launch with zero cost. Help your students get hired while tracking career outcomes across all higher education institutions.'
      }
      case 'companies': return {
        badge: 'For Companies',
        title: 'Browse Free, Pay Only for Contacts',
        subtitle: 'Explore the entire database for free. Only pay €10 when you find the perfect candidate.'
      }
    }
  }

  const plans = getPlans()
  const headerContent = getHeaderContent()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section with Animated Background */}
          <div className="relative">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
                className="absolute top-20 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
                className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                Simple, Transparent Pricing
              </motion.h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
                Choose the plan that fits your needs. Always free for students to start.
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
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {segment === 'students' && 'Students'}
                    {segment === 'institutes' && 'Institutes'}
                    {segment === 'companies' && 'Companies'}
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
              <Badge className="mb-4 bg-blue-100 text-blue-800 text-sm px-4 py-2">
                {headerContent.badge}
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
                    className={`relative ${plan.highlight ? 'border-2 border-blue-500 shadow-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm' : 'border-gray-200 bg-white/80 backdrop-blur-sm'} h-full flex flex-col hover:shadow-2xl transition-all duration-300`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-4 py-1 shadow-lg">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8 pt-8">
                      <motion.div
                        className={`mx-auto mb-4 rounded-full p-4 ${plan.highlight ? 'bg-blue-100' : 'bg-gray-100'}`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className={`h-8 w-8 ${plan.highlight ? 'text-blue-600' : 'text-gray-600'}`} />
                      </motion.div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        {plan.period && (
                          <span className="text-gray-600 ml-2">/ {plan.period}</span>
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
                        className={`w-full ${plan.highlight ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' : ''}`}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  question: 'Is browsing really unlimited and free?',
                  answer: 'Yes! Companies can explore the entire database for free. See all profiles (with initials only), filter by institution, courses, grades, and skills. Only pay €10 when you unlock a contact.'
                },
                {
                  question: 'Do credits expire?',
                  answer: 'No! Credits never expire. Buy them when you need them, use them whenever you want. No monthly subscriptions or commitments.'
                },
                {
                  question: 'How do volume discounts work?',
                  answer: 'The more credits you buy, the more you save: 200 credits get 10% off, 500 credits get 20% off, and 1000+ credits get 40% off. Perfect for companies hiring multiple candidates.'
                },
                {
                  question: 'Are students really free forever?',
                  answer: 'Absolutely! Students never pay. Create your portfolio, get verified by your institution, and get discovered by top companies - all 100% free, forever.'
                }
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800">{faq.answer}</p>
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
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                  Start exploring for free. Only pay when you find the perfect candidate.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/auth/register/role-selection">
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
                <p className="text-sm text-white mt-6">
                  ✓ No credit card required  ✓ Unlimited free browsing  ✓ Only pay for contacts you unlock
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
