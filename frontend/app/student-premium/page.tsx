'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Check,
  X,
  Star,
  Zap,
  TrendingUp,
  Eye,
  MessageCircle,
  Target,
  BarChart3,
  Crown,
  Sparkles,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Rocket,
  Shield,
  Download,
  Share2
} from 'lucide-react'
import Link from 'next/link'

const premiumFeatures = [
  {
    category: 'Profile & Visibility',
    icon: Eye,
    features: [
      {
        name: 'Priority in Search Results',
        free: false,
        premium: true,
        description: 'Appear at the top of recruiter searches',
        impact: '3x more profile views'
      },
      {
        name: 'Public Portfolio Page',
        free: 'Basic',
        premium: 'Custom URL',
        description: 'Share your portfolio with custom subdomain',
        impact: 'yourname.intransparency.com'
      },
      {
        name: 'Profile Analytics',
        free: 'Basic stats',
        premium: 'Detailed insights',
        description: 'See who viewed your profile and from which companies',
        impact: 'Know which recruiters are interested'
      },
      {
        name: 'Featured Badge',
        free: false,
        premium: true,
        description: 'Stand out with "Premium Member" badge',
        impact: 'Increased credibility'
      }
    ]
  },
  {
    category: 'Communication',
    icon: MessageCircle,
    features: [
      {
        name: 'Initiate Contact with Recruiters',
        free: false,
        premium: true,
        description: 'Message recruiters directly, don\'t wait to be discovered',
        impact: 'Take control of your job search'
      },
      {
        name: 'Unlimited Messages',
        free: 'Receive only',
        premium: 'Send & Receive',
        description: 'No limits on recruiter conversations',
        impact: 'Connect with unlimited opportunities'
      },
      {
        name: 'Priority Response',
        free: false,
        premium: true,
        description: 'Your messages appear first in recruiter inboxes',
        impact: 'Faster responses'
      }
    ]
  },
  {
    category: 'AI & Matching',
    icon: Sparkles,
    features: [
      {
        name: 'Advanced AI Matching',
        free: 'Basic',
        premium: 'Advanced',
        description: 'Better job recommendations using deep learning',
        impact: '2x more relevant matches'
      },
      {
        name: 'AI Resume Optimizer',
        free: false,
        premium: true,
        description: 'AI-generated resume tailored for each job',
        impact: 'Download optimized PDF per application'
      },
      {
        name: 'Career Insights',
        free: false,
        premium: true,
        description: 'Personalized career path recommendations',
        impact: 'Know what skills to develop'
      }
    ]
  },
  {
    category: 'Projects & Portfolio',
    icon: Rocket,
    features: [
      {
        name: 'Project Uploads',
        free: '3 projects',
        premium: 'Unlimited',
        description: 'Showcase all your work, not just top 3',
        impact: 'Complete portfolio'
      },
      {
        name: 'Project Analytics',
        free: false,
        premium: true,
        description: 'See which projects recruiters view most',
        impact: 'Optimize what to showcase'
      },
      {
        name: 'Portfolio Export',
        free: false,
        premium: true,
        description: 'Download portfolio as PDF or embed on website',
        impact: 'Use anywhere'
      }
    ]
  },
  {
    category: 'Support & Perks',
    icon: Shield,
    features: [
      {
        name: 'Email Support',
        free: 'Standard',
        premium: 'Priority',
        description: 'Get help within 24 hours',
        impact: 'Faster issue resolution'
      },
      {
        name: 'Referral Rewards',
        free: '1x',
        premium: '2x',
        description: 'Earn double rewards for referrals',
        impact: 'Unlock benefits faster'
      },
      {
        name: 'Early Access',
        free: false,
        premium: true,
        description: 'Try new features before everyone else',
        impact: 'Stay ahead'
      }
    ]
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    university: 'MIT',
    role: 'CS Student',
    quote: 'Premium was worth it. I got 5 interview requests in the first week after upgrading.',
    result: 'Hired at Google',
    image: 'SC'
  },
  {
    name: 'Michael Rodriguez',
    university: 'Stanford',
    role: 'Data Science',
    quote: 'Being able to initiate contact with recruiters changed everything. I didn\'t have to wait.',
    result: '3 job offers in 2 weeks',
    image: 'MR'
  },
  {
    name: 'Emily Park',
    university: 'Berkeley',
    role: 'Software Engineering',
    quote: 'The AI resume optimizer saved me hours. Each application got a custom-tailored resume.',
    result: 'Hired at Meta',
    image: 'EP'
  }
]

const faqs = [
  {
    question: 'Can I try Premium for free?',
    answer: 'Yes! We offer a 7-day free trial. No credit card required. Cancel anytime before the trial ends and you won\'t be charged.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Cancel your subscription anytime from your dashboard. You\'ll continue to have Premium access until the end of your billing period.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, Amex), debit cards, and PayPal. Student discounts available for annual plans.'
  },
  {
    question: 'How is this different from free?',
    answer: 'Premium gives you 3 key advantages: 1) Initiate contact with recruiters (don\'t wait), 2) Priority in search results (3x more views), 3) Advanced AI matching (better job recommendations).'
  },
  {
    question: 'Is there a student discount?',
    answer: 'Yes! The €9/month price is already a student rate. If you pay annually (€90/year), you save 2 months free.'
  },
  {
    question: 'What happens after I graduate?',
    answer: 'You can keep your Premium subscription at the same student rate as long as you maintain your account. We don\'t raise prices for existing members.'
  }
]

export default function StudentPremiumPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const monthlyPrice = 9
  const annualPrice = 90
  const annualMonthlyEquivalent = (annualPrice / 12).toFixed(2)
  const savings = (monthlyPrice * 12) - annualPrice

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Crown className="h-4 w-4 mr-2" />
              Student Premium
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get Hired{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                2x Faster
              </span>
              {' '}with Premium
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Unlock advanced features, priority visibility, and direct recruiter contact.
              Join premium students who land jobs faster.
            </p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'annual'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
              />
              <span className={`text-lg font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
                <Badge className="ml-2 bg-green-100 text-green-800">Save €{savings}</Badge>
              </span>
            </div>

            {/* Pricing Card */}
            <Card className="max-w-2xl mx-auto border-2 border-purple-500 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-6xl font-bold text-gray-900">
                      €{billingCycle === 'monthly' ? monthlyPrice : annualMonthlyEquivalent}
                    </span>
                    <span className="text-2xl text-gray-700 ml-2">/month</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-sm text-gray-700">
                      Billed annually at €{annualPrice} (save €{savings})
                    </p>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg h-14 mb-4"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start 7-Day Free Trial
                </Button>

                <p className="text-center text-sm text-gray-700">
                  ✓ No credit card required  ✓ Cancel anytime  ✓ Instant access
                </p>
              </CardContent>
            </Card>

            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-700">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span>4.9/5 from students</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <span>1,247+ Premium members</span>
              </div>
            </div>
          </div>

          {/* Feature Comparison by Category */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What You Get with Premium
              </h2>
              <p className="text-lg text-gray-700">
                Everything in Free, plus these powerful upgrades
              </p>
            </div>

            <div className="space-y-8">
              {premiumFeatures.map((category) => {
                const Icon = category.icon
                return (
                  <Card key={category.category}>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <CardTitle className="flex items-center text-xl">
                        <Icon className="h-6 w-6 mr-3 text-blue-600" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                              <th className="text-center p-4 font-semibold text-gray-800 w-32">Free</th>
                              <th className="text-center p-4 font-semibold text-purple-600 w-32">
                                Premium
                                <Crown className="inline h-4 w-4 ml-1" />
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {category.features.map((feature, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="p-4">
                                  <div>
                                    <div className="font-medium text-gray-900 mb-1">
                                      {feature.name}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      {feature.description}
                                    </div>
                                    {feature.impact && (
                                      <Badge variant="secondary" className="mt-2 text-xs">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        {feature.impact}
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  {typeof feature.free === 'boolean' ? (
                                    feature.free ? (
                                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                                    ) : (
                                      <X className="h-6 w-6 text-gray-300 mx-auto" />
                                    )
                                  ) : (
                                    <span className="text-sm text-gray-700">{feature.free}</span>
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  {typeof feature.premium === 'boolean' ? (
                                    feature.premium ? (
                                      <CheckCircle className="h-6 w-6 text-purple-600 mx-auto" />
                                    ) : (
                                      <X className="h-6 w-6 text-gray-300 mx-auto" />
                                    )
                                  ) : (
                                    <span className="text-sm font-semibold text-purple-600">{feature.premium}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Why Students Upgrade */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Students Upgrade
              </h2>
              <p className="text-lg text-gray-700">
                Hear from premium members who landed their dream jobs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                        {testimonial.image}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-800">{testimonial.university}</div>
                      </div>
                    </div>

                    <div className="flex mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.quote}"
                    </p>

                    <Badge className="bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" />
                      {testimonial.result}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div>
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Get Hired Faster?
                </h2>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                  Join 1,247+ students using Premium to land their dream jobs.
                  Start your 7-day free trial today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-purple-50 text-lg h-14"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 text-lg h-14"
                    asChild
                  >
                    <Link href="/pricing">
                      Compare All Plans
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm text-purple-100">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    7-day free trial
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    No credit card required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Cancel anytime
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
