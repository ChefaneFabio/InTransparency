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
    name: 'Platform Access',
    price: 'Free',
    period: 'forever',
    description: 'Complete platform access - no paywalls, no limits',
    icon: GraduationCap,
    popular: true,
    badge: '🎓 Always Free',
    features: [
      'Two onboarding paths: University partner = opt-in streamlined profile OR Independent = upload + select courses',
      'Unlimited projects (all formats)',
      'Complete AI analysis (hard + soft skills)',
      'University integration available for institutions',
      '🤖 24/7 AI Career Assistant for profile building & job search',
      '💬 Personalized career advice from AI chatbot',
      '📊 Skill demand insights from company requirements',
      '📝 See company notes and feedback on your profile',
      'AI Job Search',
      'Job matching & recommendations',
      'Direct messaging with recruiters',
      'Career analytics & insights',
      'Custom portfolio URL',
      'Public portfolio page'
    ],
    cta: 'Get Started Free',
    ctaLink: '/auth/register/role-selection',
    highlight: true
  },
  {
    name: 'Career Coaching',
    price: '€9',
    period: 'per session',
    description: 'Optional 1-on-1 consultations with HR experts',
    icon: Crown,
    popular: false,
    badge: '👥 Human Service',
    features: [
      'Platform access remains free',
      '1-on-1 session with HR professionals',
      'Personalized career strategy',
      'Skills discovery & assessment',
      'Portfolio & resume review',
      'Interview preparation',
      'Industry-specific advice',
      'Career path guidance',
      'Book sessions as needed'
    ],
    cta: 'Book a Session',
    ctaLink: '/contact'
  }
]

const companyPlans = [
  {
    name: 'Browse Free',
    price: '€0',
    period: 'no subscription',
    description: 'Unlimited browsing - pay only when you contact',
    icon: Zap,
    popular: false,
    badge: '🔍 Always Free',
    features: [
      'Free registration (no credit card)',
      'Unlimited database exploration',
      'See all profiles (anonymized)',
      'Advanced filters by institution, courses, grades',
      'AI Candidate Search',
      'AI-verified skills from all project types',
      'Location and availability filters',
      'Save searches and candidates',
      'No monthly fees ever'
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
      '🤖 24/7 AI Recruiting Assistant for candidate sourcing',
      '💬 Get match explanations and job description tips via chat',
      '📊 40% higher engagement with conversational search',
      '🔍 Explainable AI matching (see WHY each match)',
      '✅ Institution-verified hard and soft skills',
      '📊 Transparent match scores with reasoning',
      '📝 Leave notes on profiles with feedback and requirements',
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
    name: 'Talent Supply Partnership',
    price: 'Free',
    period: 'forever',
    description: 'You supply talent. We handle everything else. Zero cost, zero burden.',
    icon: School,
    popular: true,
    badge: '🎓 Always Free',
    features: [
      '✅ Zero cost (vs AlmaLaurea €2,500/year)',
      '✅ Streamlined onboarding - students consent via email, profiles created with verified data',
      '✅ ALL students get exposure (not just top 5% like headhunters)',
      '✅ AI verifies skills via projects (not self-reported CVs)',
      '🤖 24/7 AI Partnership Assistant for onboarding & analytics',
      '💬 Conversational support for setup and troubleshooting',
      '📊 20-30% more data gathered with AI-guided onboarding',
      '📊 Real-time placement statistics dashboard',
      '📈 Better placement rates = Better reputation',
      '🔍 Company notes and feedback on student profiles',
      '🎯 Bidirectional transparency (see what companies need)',
      '📉 Early intervention alerts (at-risk students)',
      '🤖 Modern image: "AI-powered career services"',
      '⏱️ Projected 40+ hours/month time savings with automated matching',
      '🌍 European job opportunities search for students'
    ],
    cta: 'Partner With Us',
    ctaLink: '/contact',
    highlight: true
  },
  {
    name: 'Enterprise Add-Ons',
    price: 'Custom',
    period: 'optional',
    description: 'Optional customizations - core platform stays free forever',
    icon: School,
    popular: false,
    badge: '⚙️ Optional',
    features: [
      'Core platform always free (no catch)',
      'API integration with Esse3/university systems',
      'White-label branding for career portal',
      'Custom analytics & KPI dashboards',
      'Priority employer partnerships',
      'Dedicated account manager',
      'Custom feature development',
      'Quarterly strategy sessions'
    ],
    cta: 'Contact Sales',
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
        title: 'Complete Platform Access - Free Forever',
        subtitle: 'University partner? Opt-in streamlined profile via email consent. No university? Upload projects + select courses. All features free, no paywalls.'
      }
      case 'institutes': return {
        badge: 'For Institutes (Universities & ITS)',
        title: 'You Supply Talent. We Handle Everything Else.',
        subtitle: 'Institutes are talent SUPPLIERS, not platform users. Zero cost. Zero burden. Better placement statistics. Modern reputation. Better than AlmaLaurea (€2,500/year) or headhunters (only top 5%).'
      }
      case 'companies': return {
        badge: 'For Companies',
        title: 'Browse Free, Pay Only When You Contact',
        subtitle: 'No subscriptions, no monthly fees. Explore unlimited profiles for free. Pay €10 only when you find the perfect candidate.'
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
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
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
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  question: 'How do students create profiles?',
                  answer: 'Two ways: (1) If your university is a partner, we send an email invitation. Students click to consent and their profile is created from verified university data. (2) If independent, students upload projects + select courses, and we verify them to create their complete profile. Both ways: 100% free, consent-based, < 5 minutes.'
                },
                {
                  question: 'Do institutes (universities/ITS) have to pay?',
                  answer: 'No! The core platform is always free - not just "year 1 free." Institutes are talent SUPPLIERS, not platform users. You supply talent, we handle everything else: profile creation, company search, analytics. Zero cost, zero burden. You only pay for optional customizations (API, white-label).'
                },
                {
                  question: 'How is this better than AlmaLaurea?',
                  answer: 'AlmaLaurea charges universities €2,500/year and just collects self-reported CVs. InTransparency is FREE forever and verifies skills via AI + actual projects. Plus ALL students get exposure (not just those who update their CV), and companies get better data (verified portfolios vs self-reported).'
                },
                {
                  question: 'Do ALL students get exposure or just top performers?',
                  answer: 'ALL students. Traditional headhunters only contact the top 5%. We give EVERY student a profile that companies can discover. This dramatically improves placement rates across your entire graduating class, not just the stars.'
                },
                {
                  question: 'How does company pricing work?',
                  answer: 'Companies browse the entire database for free - unlimited searching, filtering, and AI candidate search. You only pay €10 when you decide to contact a specific candidate. No subscriptions, no monthly fees, credits never expire.'
                },
                {
                  question: 'What is the €9 career coaching service?',
                  answer: 'This is an optional 1-on-1 consultation with HR professionals and career consultants. It\'s a human service, not a software feature. You get personalized career advice, skills assessment, interview prep, and portfolio review.'
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
