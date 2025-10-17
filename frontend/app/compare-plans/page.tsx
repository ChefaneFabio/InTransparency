'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Check, X, Sparkles, Crown } from 'lucide-react'
import Link from 'next/link'

type UserType = 'student' | 'recruiter'

export default function ComparePlansPage() {
  const [userType, setUserType] = useState<UserType>('student')

  const studentPlans = {
    free: {
      name: 'Free Student',
      price: 'Free',
      period: 'forever',
      description: 'Perfect to get started and explore the platform',
      popular: false,
      features: {
        'Profile & Projects': [
          { name: 'Upload projects', free: '3 projects', pro: 'Unlimited projects' },
          { name: 'AI project analysis', free: true, pro: true },
          { name: 'Portfolio page', free: 'Private only', pro: 'Public + Custom URL' },
          { name: 'Profile customization', free: 'Basic', pro: 'Advanced' }
        ],
        'Job Search & Matching': [
          { name: 'Browse job posts', free: true, pro: true },
          { name: 'AI job matching', free: 'Basic', pro: 'Advanced AI' },
          { name: 'Apply to jobs', free: true, pro: true },
          { name: 'Job recommendations', free: '5/week', pro: 'Unlimited' }
        ],
        'Communication': [
          { name: 'Receive messages', free: true, pro: true },
          { name: 'Initiate contact with recruiters', free: false, pro: true },
          { name: 'Priority InMail delivery', free: false, pro: true },
          { name: 'Read receipts', free: false, pro: true }
        ],
        'Visibility & Discovery': [
          { name: 'Profile visibility', free: 'Standard', pro: 'Priority (3x more views)' },
          { name: 'Appear in recruiter search', free: true, pro: true },
          { name: 'Featured in top results', free: false, pro: true },
          { name: 'University leaderboard', free: false, pro: true }
        ],
        'Analytics & Insights': [
          { name: 'Profile views', free: 'Total count', pro: 'Detailed breakdown' },
          { name: 'Who viewed your profile', free: false, pro: true },
          { name: 'Recruiter company names', free: false, pro: true },
          { name: 'Project performance stats', free: false, pro: true }
        ],
        'Premium Features': [
          { name: 'Resume/CV export (AI-optimized)', free: false, pro: true },
          { name: 'Skill verification badges', free: false, pro: true },
          { name: 'Referral rewards multiplier', free: '1x', pro: '2x rewards' },
          { name: 'Priority support', free: false, pro: true }
        ]
      }
    },
    pro: {
      name: 'Student Pro',
      price: '€9',
      period: 'per month',
      description: 'Get hired faster with premium features',
      popular: true
    }
  }

  const recruiterPlans = {
    columns: [
      {
        name: 'Free Recruiter',
        price: 'Free',
        period: 'forever',
        description: 'Explore the platform and browse talent',
        popular: false
      },
      {
        name: 'Starter',
        price: '€49',
        period: 'per month',
        description: 'Perfect for small teams and startups',
        popular: false
      },
      {
        name: 'Growth',
        price: '€149',
        period: 'per month',
        description: 'Scale your recruiting efforts',
        popular: true
      },
      {
        name: 'Pro',
        price: '€297',
        period: 'per month',
        description: 'Unlimited recruiting power',
        popular: false
      }
    ],
    features: {
      'Search & Discovery': [
        { name: 'Browse student profiles', values: ['Read-only', 'Full access', 'Full access', 'Full access'] },
        { name: 'Save candidates', values: ['10 max', '50 max', '200 max', 'Unlimited'] },
        { name: 'Advanced search filters', values: ['5 filters', '20 filters', '50+ filters', 'All filters'] },
        { name: 'AI-powered matching', values: [false, 'Basic', 'Advanced', 'Advanced + Custom'] },
        { name: 'Project code analysis', values: [false, false, 'Basic', 'Deep analysis'] }
      ],
      'Job Posts & Outreach': [
        { name: 'Active job posts', values: [false, '3 posts', '10 posts', 'Unlimited'] },
        { name: 'Messages per month', values: [false, '25 messages', '100 messages', 'Unlimited'] },
        { name: 'Bulk messaging', values: [false, false, true, true] },
        { name: 'Email templates', values: [false, '3 templates', '10 templates', 'Unlimited'] }
      ],
      'Analytics & Insights': [
        { name: 'Job post analytics', values: [false, 'Basic stats', 'Detailed analytics', 'Full dashboard'] },
        { name: 'Candidate engagement metrics', values: [false, false, true, true] },
        { name: 'Pipeline management', values: [false, false, true, true] },
        { name: 'Custom reports', values: [false, false, false, true] }
      ],
      'Team & Collaboration': [
        { name: 'Team members', values: ['1 user', '1 user', '3 users', 'Unlimited'] },
        { name: 'Shared candidate pools', values: [false, false, true, true] },
        { name: 'Notes & comments', values: [false, true, true, true] },
        { name: 'Approval workflows', values: [false, false, false, true] }
      ],
      'Integrations & API': [
        { name: 'Export to CSV', values: [false, true, true, true] },
        { name: 'ATS integrations', values: [false, false, 'Basic', 'All integrations'] },
        { name: 'API access', values: [false, false, false, true] },
        { name: 'Zapier integration', values: [false, false, true, true] }
      ],
      'Support': [
        { name: 'Support channel', values: ['Email', 'Email', 'Priority email', 'Phone + Email'] },
        { name: 'Response time', values: ['48 hours', '24 hours', '12 hours', '4 hours'] },
        { name: 'Dedicated CSM', values: [false, false, false, true] },
        { name: 'Onboarding training', values: [false, false, true, true] }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-16">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Compare Plans & Features
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include our core features.
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
              <button
                onClick={() => setUserType('student')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  userType === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-800 hover:text-gray-900'
                }`}
              >
                For Students
              </button>
              <button
                onClick={() => setUserType('recruiter')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  userType === 'recruiter'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-800 hover:text-gray-900'
                }`}
              >
                For Recruiters
              </button>
            </div>
          </div>

          {/* Student Plans Comparison */}
          {userType === 'student' && (
            <div className="max-w-6xl mx-auto">
              {/* Plan Headers */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {studentPlans.free.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                    <span className="text-gray-700"> forever</span>
                  </div>
                  <p className="text-gray-700 mb-6">{studentPlans.free.description}</p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/auth/register/student">Get Started Free</Link>
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 shadow-lg text-white relative">
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      POPULAR
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {studentPlans.pro.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">€9</span>
                    <span className="text-blue-50"> /month</span>
                  </div>
                  <p className="text-blue-50 mb-6">{studentPlans.pro.description}</p>
                  <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50">
                    <Link href="/student-premium">Start 7-Day Free Trial</Link>
                  </Button>
                </div>
              </div>

              {/* Feature Comparison Table */}
              {Object.entries(studentPlans.free.features).map(([category, features]) => (
                <div key={category} className="bg-white rounded-xl p-8 shadow-sm mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {features.map((feature, idx) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 last:border-0">
                        <div className="font-medium text-gray-900">
                          {feature.name}
                        </div>
                        <div className="text-gray-700">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400" />
                            )
                          ) : (
                            feature.free
                          )}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? (
                              <Check className="h-5 w-5 text-blue-600" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400" />
                            )
                          ) : (
                            feature.pro
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recruiter Plans Comparison */}
          {userType === 'recruiter' && (
            <div className="max-w-7xl mx-auto">
              {/* Plan Headers */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {recruiterPlans.columns.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-6 shadow-sm ${
                      plan.popular
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white ring-4 ring-blue-200'
                        : 'bg-white'
                    }`}
                  >
                    {plan.popular && (
                      <div className="mb-4">
                        <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          POPULAR
                        </div>
                      </div>
                    )}
                    <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                        {plan.price}
                      </span>
                      {plan.period !== 'forever' && (
                        <span className={plan.popular ? 'text-blue-50' : 'text-gray-700'}>
                          /{plan.period.replace('per ', '')}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-50' : 'text-gray-700'}`}>
                      {plan.description}
                    </p>
                    <Button
                      asChild
                      className={`w-full ${
                        plan.popular
                          ? 'bg-white text-blue-600 hover:bg-blue-50'
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      <Link href="/auth/register/recruiter">
                        {plan.price === 'Free' ? 'Get Started Free' : 'Start Free Trial'}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Feature Comparison Table */}
              {Object.entries(recruiterPlans.features).map(([category, features]) => (
                <div key={category} className="bg-white rounded-xl p-8 shadow-sm mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {features.map((feature, idx) => (
                      <div key={idx} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-gray-100 last:border-0">
                        <div className="font-medium text-gray-900">
                          {feature.name}
                        </div>
                        {feature.values.map((value, vidx) => (
                          <div key={vidx} className="text-center">
                            {typeof value === 'boolean' ? (
                              value ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-800 text-sm">{value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Can I switch plans anytime?</h3>
                <p className="text-gray-800">Yes! You can upgrade or downgrade at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-800">We offer a 7-day money-back guarantee on all paid plans. No questions asked.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-800">We accept all major credit cards, debit cards, and PayPal through Stripe.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-800">Yes! Student Pro and all Recruiter paid plans include a 7-day free trial. No credit card required.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-700 mb-6">
              Our team is here to help you choose the right plan.
            </p>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
