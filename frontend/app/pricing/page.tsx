import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star, Users, Building, GraduationCap, ArrowRight, Zap, Crown, Gift, Sparkles } from 'lucide-react'
import Link from 'next/link'

const studentPlans = [
  {
    name: 'Free Student',
    price: 'Free',
    period: 'forever',
    description: 'Everything you need to start building your career portfolio',
    icon: GraduationCap,
    popular: false,
    features: [
      '3 project uploads',
      'Basic AI project analysis',
      'Profile visibility to recruiters',
      'Receive messages from recruiters',
      'Basic job matching',
      'Public portfolio page (basic)',
      'CV templates library',
      'Email support'
    ],
    limitations: [
      'Cannot initiate contact with recruiters',
      'Limited to 3 projects',
      'Basic matching algorithm',
      'Standard profile visibility'
    ],
    cta: 'Get Started Free',
    ctaLink: '/auth/register/student',
    color: 'bg-green-500'
  },
  {
    name: 'Student Pro',
    price: '€9',
    period: 'per month',
    description: 'Premium features to get hired 2x faster',
    icon: Crown,
    popular: true,
    badge: 'Most Popular',
    features: [
      'Everything in Free',
      '✨ Unlimited project uploads',
      '✨ Initiate contact with recruiters',
      '✨ Advanced AI matching',
      '✨ Priority in search results (3x more views)',
      '✨ Public portfolio with custom URL',
      '✨ Detailed analytics (who viewed, from which companies)',
      '✨ AI resume optimizer (download per job)',
      '✨ 2x referral rewards',
      '✨ Premium member badge',
      '✨ Priority email support'
    ],
    limitations: [],
    cta: 'Start 7-Day Free Trial',
    ctaLink: '/student-premium',
    color: 'bg-purple-500',
    highlight: true,
    savings: 'Save €18 with annual plan'
  }
]

const recruiterPlans = [
  {
    name: 'Free Recruiter',
    price: 'Free',
    period: 'forever',
    description: 'Explore the platform and discover student talent',
    icon: Users,
    popular: false,
    features: [
      'Browse student profiles (read-only)',
      'Save up to 10 candidates',
      'View basic project information',
      'See university and skills',
      'Basic search filters'
    ],
    limitations: [
      'No messaging',
      'Cannot post jobs',
      'No contact information access',
      'Limited search capabilities'
    ],
    cta: 'Browse Talent',
    ctaLink: '/auth/register/recruiter',
    color: 'bg-gray-500'
  },
  {
    name: 'Starter',
    price: '€49',
    period: 'per month',
    description: 'Perfect for startups and small teams hiring occasionally',
    icon: Zap,
    popular: false,
    features: [
      'Everything in Free',
      'Post 3 active jobs',
      'Send 25 messages/month',
      'Basic search filters',
      'Contact information access',
      'Basic analytics',
      'Email support'
    ],
    limitations: [
      'Limited messaging (25/month)',
      'Basic matching only',
      'No advanced filters'
    ],
    cta: 'Start Free Trial',
    ctaLink: '/auth/register/recruiter',
    color: 'bg-blue-500'
  },
  {
    name: 'Growth',
    price: '€149',
    period: 'per month',
    description: 'Advanced recruiting for growing companies',
    icon: Building,
    popular: true,
    badge: 'Best Value',
    features: [
      'Everything in Starter',
      'Post 10 active jobs',
      'Send 100 messages/month',
      'AI-powered matching',
      'Advanced search filters (50+)',
      'Detailed project code analysis',
      'Analytics dashboard',
      'Priority support'
    ],
    limitations: [
      'Limited to 100 messages/month'
    ],
    cta: 'Start Free Trial',
    ctaLink: '/auth/register/recruiter',
    color: 'bg-indigo-500',
    highlight: true
  },
  {
    name: 'Pro',
    price: '€297',
    period: 'per month',
    description: 'Full-featured recruiting for serious hiring teams',
    icon: Building,
    popular: false,
    features: [
      'Everything in Growth',
      'Unlimited job posts',
      'Unlimited messaging',
      'AI RAG matching (industry knowledge)',
      'GPA verification',
      'InMail priority delivery',
      'Bulk candidate operations',
      'Pipeline management',
      'Advanced analytics',
      'Candidate comparison tools',
      'Priority support'
    ],
    limitations: [
      'Limited to 3 team members'
    ],
    cta: 'Start Free Trial',
    ctaLink: '/auth/register/recruiter',
    color: 'bg-purple-500'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'Complete talent acquisition platform for large organizations',
    icon: Building,
    popular: false,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom AI model training',
      'White-label solution',
      'ATS integrations (Greenhouse, Lever)',
      'SSO & advanced security',
      'Custom workflows',
      'Dedicated customer success manager',
      'SLA guarantees',
      'Custom reporting & APIs',
      'Onboarding & training',
      '24/7 priority support'
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaLink: '/contact-sales',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  }
]

const faqs = [
  {
    question: 'Why is the basic plan free for students?',
    answer: 'We believe every student deserves access to career opportunities. Our revenue comes from companies who pay to access our verified talent pool. Students can upgrade to Premium for advanced features like initiating contact with recruiters.'
  },
  {
    question: 'What\'s the difference between Free and Student Pro?',
    answer: 'Student Pro gives you 3 key advantages: 1) Initiate contact with recruiters (don\'t wait to be discovered), 2) Priority in search results (3x more profile views), 3) Unlimited projects and advanced AI matching. Plus you get detailed analytics and a custom portfolio URL.'
  },
  {
    question: 'How does the Student Pro free trial work?',
    answer: '7-day free trial, no credit card required. Try all Premium features risk-free. If you like it, you\'ll be charged €9/month after the trial. Cancel anytime during the trial and you won\'t pay anything.'
  },
  {
    question: 'What\'s the difference between Starter, Growth, and Pro for recruiters?',
    answer: 'Starter (€49/mo): 25 messages, 3 jobs, basic filters. Growth (€149/mo): 100 messages, 10 jobs, AI matching, advanced filters. Pro (€297/mo): Unlimited messages, unlimited jobs, priority delivery, full analytics.'
  },
  {
    question: 'Why should I choose InTransparency over LinkedIn Recruiter?',
    answer: 'LinkedIn Recruiter costs €8,000+/year and shows unverified skills. InTransparency starts at €49/month, specializes in verified university talent with real project portfolios, and offers AI-powered matching. Perfect for hiring new grads and junior talent.'
  },
  {
    question: 'Can recruiters try the platform for free?',
    answer: 'Yes! Free Recruiter tier lets you browse student profiles and see project info. To message candidates or post jobs, upgrade to Starter (€49/mo) with a 7-day free trial.'
  },
  {
    question: 'Do you verify university transcripts and projects?',
    answer: 'Yes! We integrate directly with universities to verify academic records. Projects are analyzed by AI and can be linked to GitHub for verification. This ensures companies can trust what they see.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. All plans can be canceled anytime from your dashboard. You\'ll continue to have access until the end of your billing period. No long-term contracts or cancellation fees.'
  },
  {
    question: 'Do you offer annual discounts?',
    answer: 'Yes! Student Pro annual plan: €90/year (save €18). Recruiter annual plans: 20% discount. Contact sales for enterprise annual contracts.'
  }
]

const comparisonHighlights = [
  {
    feature: 'LinkedIn Recruiter',
    price: '€8,000+/year',
    messaging: 'Limited InMails',
    verification: 'Unverified skills',
    matching: 'Keyword-based'
  },
  {
    feature: 'InTransparency Pro',
    price: '€297/month (€3,564/year)',
    messaging: 'Unlimited messages',
    verification: 'University-verified',
    matching: 'AI-powered + RAG'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Always free for students to get started,
              with premium options for faster results. Affordable plans for recruiters of all sizes.
            </p>
          </div>

          {/* Student Plans Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-800 text-sm px-4 py-2">
                <GraduationCap className="h-4 w-4 mr-2 inline" />
                For Students
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Start Free, Upgrade When Ready
              </h2>
              <p className="text-lg text-gray-700">
                Build your portfolio for free. Upgrade to Premium to get hired 2x faster.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {studentPlans.map((plan) => {
                const Icon = plan.icon
                return (
                  <Card
                    key={plan.name}
                    className={`relative ${plan.highlight ? 'border-2 border-purple-500 shadow-2xl transform scale-105' : 'border-gray-200'}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-600 text-white px-4 py-1">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8 pt-8">
                      <div className={`w-16 h-16 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-700 mb-4">{plan.description}</CardDescription>

                      <div className="mb-4">
                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                        {plan.period !== 'forever' && (
                          <span className="text-gray-700 ml-2">/{plan.period}</span>
                        )}
                        {plan.period === 'forever' && (
                          <span className="text-gray-700 ml-2">{plan.period}</span>
                        )}
                      </div>

                      {plan.savings && (
                        <p className="text-sm text-green-600 font-medium">{plan.savings}</p>
                      )}
                    </CardHeader>

                    <CardContent>
                      <Button
                        className={`w-full mb-6 ${plan.highlight ? plan.color + ' text-white hover:opacity-90' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}
                        size="lg"
                        asChild
                      >
                        <Link href={plan.ctaLink}>
                          {plan.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <div className="space-y-3 mb-6">
                        <p className="font-semibold text-gray-900 text-sm">Includes:</p>
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {plan.limitations.length > 0 && (
                        <div className="space-y-2 pt-6 border-t border-gray-200">
                          <p className="font-semibold text-gray-700 text-sm">Limitations:</p>
                          {plan.limitations.map((limitation, idx) => (
                            <div key={idx} className="flex items-start">
                              <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/student-premium" className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center">
                See detailed Premium comparison
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Recruiter Plans Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800 text-sm px-4 py-2">
                <Users className="h-4 w-4 mr-2 inline" />
                For Recruiters & Companies
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Find Verified Talent, Fast
              </h2>
              <p className="text-lg text-gray-700">
                From startups to enterprises, we have a plan for every hiring need.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {recruiterPlans.map((plan) => {
                const Icon = plan.icon
                return (
                  <Card
                    key={plan.name}
                    className={`relative ${plan.highlight ? 'border-2 border-indigo-500 shadow-xl' : 'border-gray-200'}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-indigo-600 text-white px-3 py-1 text-xs">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-6">
                      <div className={`w-12 h-12 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg mb-2">{plan.name}</CardTitle>
                      <CardDescription className="text-xs text-gray-700 mb-3 h-12">{plan.description}</CardDescription>


                      <div className="mb-2">
                        <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                        {plan.period !== 'pricing' && (
                          <div className="text-xs text-gray-700">/{plan.period}</div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <Button
                        className={`w-full mb-4 text-sm ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                        size="sm"
                        variant={plan.highlight ? 'default' : 'outline'}
                        asChild
                      >
                        <Link href={plan.ctaLink}>
                          {plan.cta}
                        </Link>
                      </Button>

                      <div className="space-y-2 mb-4">
                        {plan.features.slice(0, 6).map((feature, idx) => (
                          <div key={idx} className="flex items-start">
                            <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-700">{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 6 && (
                          <p className="text-xs text-gray-500 italic">
                            +{plan.features.length - 6} more features
                          </p>
                        )}
                      </div>

                      {plan.limitations.length > 0 && (
                        <div className="space-y-1 pt-4 border-t border-gray-200">
                          {plan.limitations.slice(0, 2).map((limitation, idx) => (
                            <div key={idx} className="flex items-start">
                              <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-gray-700">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Comparison vs LinkedIn */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Why Choose InTransparency?</CardTitle>
                <CardDescription className="text-gray-700">
                  Compare us to LinkedIn Recruiter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2 border-gray-300">
                      <tr>
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold text-gray-800">LinkedIn Recruiter</th>
                        <th className="text-center p-4 font-semibold text-purple-600">InTransparency Pro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="p-4 font-medium">Annual Cost</td>
                        <td className="p-4 text-center text-gray-700">€8,000+</td>
                        <td className="p-4 text-center font-bold text-purple-600">€3,564</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Messaging</td>
                        <td className="p-4 text-center text-gray-700">Limited InMails</td>
                        <td className="p-4 text-center font-bold text-purple-600">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Skill Verification</td>
                        <td className="p-4 text-center text-gray-700">Self-reported</td>
                        <td className="p-4 text-center font-bold text-purple-600">University-verified</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Project Portfolios</td>
                        <td className="p-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                        <td className="p-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">AI Matching</td>
                        <td className="p-4 text-center text-gray-700">Keyword-based</td>
                        <td className="p-4 text-center font-bold text-purple-600">AI + RAG (contextual)</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Free Trial</td>
                        <td className="p-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                        <td className="p-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-center mt-8">
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    Save 55% compared to LinkedIn Recruiter
                  </p>
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                    <Link href="/auth/register/recruiter">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
                  Join thousands of students and companies already using InTransparency.
                  Start free, upgrade when ready.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-blue-50 text-lg"
                    asChild
                  >
                    <Link href="/auth/register/student">
                      <GraduationCap className="mr-2 h-5 w-5" />
                      I'm a Student
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 text-lg"
                    asChild
                  >
                    <Link href="/auth/register/recruiter">
                      <Users className="mr-2 h-5 w-5" />
                      I'm a Recruiter
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-white mt-6">
                  ✓ No credit card required  ✓ 7-day free trial  ✓ Cancel anytime
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
