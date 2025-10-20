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

type PricingSegment = 'students' | 'companies' | 'universities'

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
    name: 'Starter',
    price: '€49',
    period: 'per month',
    description: 'For startups hiring occasionally',
    icon: Zap,
    popular: false,
    features: [
      'Search verified portfolios',
      'Post 3 active jobs',
      'Contact 25 students/month',
      'Basic filters',
      'Email support'
    ],
    cta: 'Start 7-Day Trial',
    ctaLink: '/auth/register/role-selection'
  },
  {
    name: 'Growth',
    price: '€149',
    period: 'per month',
    description: 'For growing teams hiring regularly',
    icon: Building2,
    popular: true,
    badge: 'Most Popular',
    features: [
      'Everything in Starter',
      'Post 10 active jobs',
      'Contact 100 students/month',
      'AI-powered matching',
      'Advanced filters (50+)',
      'Analytics dashboard',
      'Priority support'
    ],
    cta: 'Start 7-Day Trial',
    ctaLink: '/auth/register/role-selection',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large organizations with complex needs',
    icon: Building2,
    popular: false,
    features: [
      'Everything in Growth',
      'Unlimited jobs',
      'Unlimited contacts',
      'Dedicated account manager',
      'Custom integrations',
      'API access',
      'White-label options',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact'
  }
]

const universityPlans = [
  {
    name: 'Free Partner',
    price: 'Free',
    period: 'forever',
    description: 'Get started with basic career services integration',
    icon: School,
    popular: false,
    features: [
      'Student portfolio hub',
      'Basic analytics',
      'Up to 100 active students',
      'Email support',
      'Standard branding'
    ],
    cta: 'Become a Partner',
    ctaLink: '/contact'
  },
  {
    name: 'University Pro',
    price: 'Custom',
    period: 'per year',
    description: 'Complete career services solution',
    icon: School,
    popular: true,
    badge: 'Recommended',
    features: [
      'Everything in Free',
      'Unlimited students',
      'Advanced career analytics',
      'Employer network access',
      'Custom university branding',
      'Verification system',
      'Dedicated support',
      'Quarterly strategy sessions'
    ],
    cta: 'Schedule Demo',
    ctaLink: '/contact',
    highlight: true
  }
]

export default function PricingPage() {
  const [selectedSegment, setSelectedSegment] = useState<PricingSegment>('students')

  const getPlans = () => {
    switch (selectedSegment) {
      case 'students': return studentPlans
      case 'companies': return companyPlans
      case 'universities': return universityPlans
    }
  }

  const getHeaderContent = () => {
    switch (selectedSegment) {
      case 'students': return {
        badge: 'For Students',
        title: 'Start Free, Upgrade When Ready',
        subtitle: 'Build your portfolio for free. Upgrade to get discovered 2x faster.'
      }
      case 'companies': return {
        badge: 'For Companies',
        title: 'Find Verified Talent, Fast',
        subtitle: 'Access university-verified portfolios. Plans for teams of all sizes.'
      }
      case 'universities': return {
        badge: 'For Universities',
        title: 'Empower Your Students',
        subtitle: 'Help students showcase their work and track career outcomes.'
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

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
              Choose the plan that fits your needs. Always free for students to start.
            </p>

            {/* Segment Selector */}
            <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
              {(['students', 'companies', 'universities'] as PricingSegment[]).map((segment) => {
                const Icon = segment === 'students' ? GraduationCap : segment === 'companies' ? Building2 : School
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
                    {segment === 'companies' && 'Companies'}
                    {segment === 'universities' && 'Universities'}
                  </button>
                )
              })}
            </div>
          </motion.div>

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
                    whileHover={{ y: -5 }}
                  >
                  <Card
                    className={`relative ${plan.highlight ? 'border-2 border-blue-500 shadow-xl' : 'border-gray-200'} h-full flex flex-col`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-4 py-1 shadow-lg">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8 pt-8">
                      <div className={`mx-auto mb-4 rounded-full p-4 ${plan.highlight ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon className={`h-8 w-8 ${plan.highlight ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
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
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
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
                  question: 'Is there really a free plan?',
                  answer: 'Yes! Students can create portfolios and get discovered by recruiters 100% free, forever.'
                },
                {
                  question: 'Can I cancel anytime?',
                  answer: 'Absolutely. No contracts, no commitments. Cancel with one click from your dashboard.'
                },
                {
                  question: 'Do you offer student discounts?',
                  answer: 'All student plans are already heavily discounted. Plus, the free plan has everything you need to get started.'
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, debit cards, and SEPA direct debit for European customers.'
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
                  Join early access and be among the first to transform how students connect with opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/auth/register/role-selection">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                    <Link href="/contact">
                      Contact Sales
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-white mt-6">
                  ✓ No credit card required  ✓ 7-day free trial  ✓ Cancel anytime
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
