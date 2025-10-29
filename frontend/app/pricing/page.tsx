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
    name: 'Verified Talent Discovery Service',
    price: 'Free',
    period: 'forever',
    description: 'Upload projects → Institution verifies → Companies discover YOU (no applications)',
    icon: GraduationCap,
    popular: false,
    badge: '🎓 Always Free - Core Services',
    features: [
      '✅ VERIFICATION SERVICE: Upload up to 5 projects (theses, stage curriculare, code)',
      '✅ Institution authenticates via Esse3/Moodle integration',
      '✅ MATCHING SERVICE: AI connects you to opportunities (92% verified accuracy)',
      '✅ DISCOVERY SERVICE: Companies find YOU - zero applications needed',
      '✅ Transparent explanations: "92% fit because Python thesis matches ML req"',
      '🤖 24/7 AI Career Assistant for profile building & guidance',
      '📊 Skill demand insights ("Excel searched 89x this month")',
      '📝 See company requirements and match reasoning (bidirectional transparency)',
      'All disciplines: Tech, Business, Law, Engineering, Design, Fashion',
      'Custom portfolio URL with verification badges',
      'EU/Italian support: 30/30 grading, tirocini, stage curriculare',
      '⚠️ Limit: 5 projects, standard AI analysis, no direct messaging'
    ],
    cta: 'Get Started Free',
    ctaLink: '/auth/register/role-selection',
    highlight: false
  },
  {
    name: 'Pro Student',
    price: '€9',
    period: 'per month',
    description: 'Unlimited projects + priority matching + direct messaging. 30% more contacts vs Free.',
    icon: Sparkles,
    popular: true,
    badge: '⚡ Most Popular - Upgrade',
    features: [
      '✅ Everything in Free, plus:',
      '🚀 UNLIMITED projects (vs. 5 free) - upload thesis, portfolios, side projects',
      '🧠 Advanced AI analysis: Deeper soft skills detection from teamwork/presentations',
      '📹 Video portfolio support: Record project demos and explanations',
      '⚡ Priority matching: Your profile shown first in company searches',
      '💬 Direct recruiter messaging: Contact companies directly (vs. waiting)',
      '📈 30% more contacts: Pro users get significantly more company interest',
      '🎯 Custom alerts: "New BMW internship matches your AutoCAD skills"',
      '📊 Advanced analytics: "Your Python thesis viewed by 12 companies this week"',
      '🏆 Pro badge on profile: "Verified Pro Student" increases credibility',
      '✅ Early access to new features and beta tests',
      '⏱️ Projected 40+ hours/month time savings with unlimited uploads',
      'Cancel anytime - no commitment'
    ],
    cta: 'Upgrade to Pro',
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
    name: 'Transparent Talent Sourcing Service',
    price: '€10',
    period: 'per contact (no subscriptions)',
    description: 'Browse 100% verified profiles FREE → Pay €10 only when you contact the right candidate',
    icon: Building2,
    popular: true,
    badge: 'Most Popular - Pay As You Use',
    features: [
      '✅ DISCOVERY SERVICE: FREE unlimited browsing of verified profiles',
      '✅ Search institution-authenticated competencies: "AutoCAD, 28/30 by ITS Rizzoli"',
      '✅ View project excerpts with institutional stamps (no self-reported CVs)',
      '✅ MATCHING SERVICE: AI shows "92% fit because Python thesis matches ML req"',
      '✅ Transparency Panel: See exact skill mappings and verification dates',
      '✅ Bidirectional visibility: Define your requirements, see exact matches',
      '€10 unlocks: Full name, email, phone, LinkedIn + verified project details',
      '🤖 24/7 AI Recruiting Assistant for candidate sourcing guidance',
      '📊 80% faster screening with verifiable data (vs Manatal resume parsing)',
      '✅ 92% match accuracy with institution-verified competencies',
      '📝 EU AI Act compliant: Every match explained, traceable to source',
      'Buy credits as needed - no monthly commitment',
      'Volume discounts up to 40% (bulk packages available)',
      'Credits never expire'
    ],
    cta: 'Start Browsing Free',
    ctaLink: '/auth/register/role-selection',
    highlight: false
  },
  {
    name: 'Enterprise',
    price: '€99',
    period: 'per month',
    description: 'Unlimited contacts + custom filters + branding + API access. For high-volume recruiting.',
    icon: Crown,
    popular: true,
    badge: '🏢 Best for Scale',
    features: [
      '✅ Everything in Pay-Per-Contact, plus:',
      '💎 UNLIMITED contacts (vs. €10 each) - hire as many as you need',
      '🔍 Custom filters: "All 30/30 law students from Sapienza" or "ITS mechatronics grads near Milan"',
      '🎨 Company branding: Your logo on matches and job postings',
      '🔗 API access: Integrate InTransparency into your ATS (Manatal, Greenhouse, etc.)',
      '📊 Bulk operations: Download candidate lists, mass messaging, campaign tracking',
      '⚡ Priority support: Dedicated account manager for onboarding and strategy',
      '📈 Advanced analytics: "47-day avg hire from ITS students", "€10K cost savings vs. Indeed"',
      '🏷️ "Preferred Partner" badge: Increase student trust and application rates',
      '🎯 Early access: Beta features, exclusive talent pools, new partnerships',
      '💰 ROI: €10/contact × 100 contacts = €1K vs. €99/month Enterprise (90% savings)',
      'Cancel anytime - no long-term commitment'
    ],
    cta: 'Upgrade to Enterprise',
    ctaLink: '/contact',
    highlight: true
  },
  {
    name: 'Credit Packages',
    price: 'From €50',
    period: 'volume discounts',
    description: 'Buy credits in bulk and save more',
    icon: Building2,
    popular: false,
    badge: '💳 Pay As You Go',
    features: [
      '50 credits (5 contacts) = €50 (no discount)',
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
    name: 'Free Career Intelligence Service',
    price: 'Free',
    period: 'forever - no subscriptions',
    description: 'FREE Verification + Analytics services. Auto-import from Esse3/Moodle. You authenticate competencies, we deliver insights.',
    icon: School,
    popular: true,
    badge: '🎓 100% Free Core Services',
    features: [
      '✅ VERIFICATION SERVICE: FREE Esse3/Moodle/CRM integration',
      '✅ Auto-import grades/projects → You endorse → Student profile goes live',
      '✅ Batch approval: "Endorse 50 projects in 1 hour" dashboard',
      '✅ ANALYTICS SERVICE: FREE dashboards for placement insights',
      '📊 "Deloitte viewed 31 Economics students" → warm outreach opportunity',
      '📈 "Excel searched 89x this month" → advise Business students',
      '📉 Early alerts: "87 seniors with zero views" → proactive support',
      '✅ Placement tracking: "47-day avg hire via your verification"',
      '✅ Prove impact to MIUR: "85% placement boost from your stamp"',
      '✅ Zero cost (vs AlmaLaurea €2,500/year or Univariety €500/year)',
      '⏱️ Saves projected 40+ hours/month vs manual career services',
      '🌍 European job opportunities for your students',
      'EU/Italian: 30/30 grading, tirocini, stage curriculare support'
    ],
    cta: 'Become a Partner (Free)',
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
        badge: 'For Students - All Disciplines',
        title: 'Verified Talent Discovery Service - Free Forever',
        subtitle: 'Upload projects → Institution verifies → Companies discover YOU (no applications). Four free services: Verification, Matching, Discovery, Analytics. EU/Italian: 30/30 grading, stage curriculare, tirocini support.'
      }
      case 'institutes': return {
        badge: 'For Institutes (Universities & ITS)',
        title: 'Free Career Intelligence Service - No Subscriptions Ever',
        subtitle: 'FREE Verification + Analytics services. Auto-import Esse3/Moodle. You authenticate, we deliver insights. Zero cost vs AlmaLaurea (€2,500/year). Prove 85% placement boost to MIUR.'
      }
      case 'companies': return {
        badge: 'For Companies - Pay As You Use',
        title: 'Transparent Talent Sourcing Service - No Subscriptions',
        subtitle: 'Browse 100% institution-verified profiles FREE. Search "AutoCAD, 28/30 by ITS Rizzoli" with project excerpts. Pay €10 only when you contact verified candidates. 80% faster screening, 92% match accuracy.'
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
                Subscription-Free Service Model
              </motion.h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
                Partner-enabled services, not subscription traps. Free for students & institutions. Companies pay only per contact.</p>
              <p className="text-base text-gray-600 max-w-2xl mx-auto mb-12">
                Low-overhead SaaS (€0.02/query, €20/month hosting) scalable to 100K+ users. No subscriptions, no monthly fees - just transparent, pay-as-you-use services.
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
