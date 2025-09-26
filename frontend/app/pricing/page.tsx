import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star, Users, Building, GraduationCap, ArrowRight, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Graduate',
    price: 'Free',
    period: 'forever',
    description: 'Everything you need to launch your career - completely free for graduates',
    icon: GraduationCap,
    popular: true,
    features: [
      'Unlimited project portfolio',
      'AI-powered CV optimization',
      'University transcript integration',
      'Basic job matching',
      'Profile visibility to recruiters',
      'Direct messaging (receive only)',
      'Basic analytics dashboard',
      'CV templates library',
      'Skills assessment',
      'Email support'
    ],
    limitations: [
      'Cannot initiate contact with recruiters',
      'Basic search filters only',
      'Standard matching algorithm',
      'Limited premium insights'
    ],
    cta: 'Join Free - Always',
    color: 'bg-green-500'
  },
  {
    name: 'Recruiter Basic',
    price: '€97',
    period: 'per month',
    description: 'Essential tools for talent acquisition professionals',
    icon: Users,
    popular: false,
    features: [
      'Search 500,000+ verified student profiles',
      'Basic filters (university, skills, GPA)',
      'Send 50 messages per month',
      'View basic project portfolios',
      'Contact information access',
      'Basic candidate tracking',
      'Standard analytics',
      'Email support'
    ],
    limitations: [
      'Limited to 50 messages/month',
      'Basic search filters only',
      'No advanced matching insights',
      'Standard response rates'
    ],
    cta: 'Start 7-Day Free Trial',
    color: 'bg-blue-500'
  },
  {
    name: 'Recruiter Pro',
    price: '€297',
    period: 'per month',
    description: 'Advanced recruiting with AI insights and premium features',
    icon: Building,
    popular: true,
    features: [
      'Everything in Recruiter Basic',
      'Unlimited messaging',
      'Advanced AI matching algorithms',
      'Detailed project code analysis',
      'University GPA verification',
      'InMail priority delivery',
      'Advanced search filters (50+)',
      'Bulk candidate operations',
      'Advanced analytics & insights',
      'Candidate comparison tools',
      'Pipeline management',
      'Priority support'
    ],
    limitations: [
      'Limited to 3 team members',
      'Standard integrations only'
    ],
    cta: 'Upgrade to Pro',
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
      'Everything in Recruiter Pro',
      'Unlimited team members',
      'Custom AI model training',
      'White-label solution',
      'ATS integrations',
      'SSO & advanced security',
      'Custom workflows & approval processes',
      'Dedicated customer success manager',
      'SLA guarantees',
      'Custom reporting & APIs',
      'Onboarding & training',
      '24/7 priority support'
    ],
    limitations: [],
    cta: 'Contact Sales',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  }
]

const faqs = [
  {
    question: 'Why is InTransparency free for graduates?',
    answer: 'We believe every graduate deserves equal access to career opportunities. Our revenue comes from companies who pay to access our verified talent pool, similar to LinkedIn\'s model.'
  },
  {
    question: 'What\'s the difference between Recruiter Basic and Pro?',
    answer: 'Basic limits you to 50 messages per month and basic search filters. Pro offers unlimited messaging, advanced AI matching, detailed project analysis, and priority InMail delivery.'
  },
  {
    question: 'How does messaging work for free graduate accounts?',
    answer: 'Graduates can receive unlimited messages from recruiters but cannot initiate contact. To message recruiters first, graduates would need a premium account (coming soon).'
  },
  {
    question: 'Can graduates see who viewed their profile?',
    answer: 'Yes! All graduates get basic profile analytics showing view counts and company interest. Detailed analytics (like specific viewer names) are available in our upcoming Graduate Premium plan.'
  },
  {
    question: 'Do you verify university transcripts and GPAs?',
    answer: 'Yes, we integrate directly with university systems to verify academic records. This ensures companies can trust the academic achievements they see on student profiles.'
  },
  {
    question: 'Can I try Recruiter Pro before committing?',
    answer: 'Absolutely! We offer a 7-day free trial of Recruiter Pro with no credit card required. You can downgrade to Basic or cancel anytime.'
  },
  {
    question: 'How does InTransparency compare to LinkedIn Recruiter?',
    answer: 'We specialize in new graduates with verified academic records and project portfolios. Unlike LinkedIn, we offer direct university integration and focus on demonstrable skills over connections.'
  }
]

const addOns = [
  {
    name: 'Advanced Search & Filters',
    price: '€97/month',
    description: 'Unlock 50+ advanced search filters and saved searches',
    features: ['Project complexity filters', 'University ranking filters', 'Graduation date precision', 'Saved search alerts']
  },
  {
    name: 'Bulk Operations Suite',
    price: '€197/month',
    description: 'Streamline high-volume recruiting workflows',
    features: ['Bulk message campaigns', 'CSV exports', 'Automated follow-ups', 'Template management']
  },
  {
    name: 'University Partnership API',
    price: '€497/month',
    description: 'Direct integration with university career services',
    features: ['Real-time graduate data', 'Campus recruiting tools', 'Event management', 'Custom branding']
  }
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              FREE for Graduates, Paid by Companies
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              Just like LinkedIn: graduates access everything for free, companies pay to find top talent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">For Graduates</h2>
                <div className="space-y-2 text-left">
                  <div className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>Unlimited profile & projects</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>AI-powered CV optimization</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>Direct messages from recruiters</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>University transcript verification</span>
                  </div>
                </div>
                <div className="mt-4 text-2xl font-bold text-green-600">FREE FOREVER</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">For Companies</h2>
                <div className="space-y-2 text-left">
                  <div className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 mr-2 text-blue-600" />
                    <span>Search 500k+ verified graduates</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 mr-2 text-blue-600" />
                    <span>Advanced AI matching & filters</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 mr-2 text-blue-600" />
                    <span>Direct messaging & InMail</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 mr-2 text-blue-600" />
                    <span>Project portfolio analysis</span>
                  </div>
                </div>
                <div className="mt-4 text-2xl font-bold text-blue-600">From €97/month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => {
                const Icon = plan.icon
                return (
                  <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary border-2' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-4 py-1">
                          <Star className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-8">
                      <div className={`mx-auto w-16 h-16 ${plan.color} rounded-full flex items-center justify-center mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-base">{plan.description}</CardDescription>
                      <div className="mt-6">
                        <div className="text-4xl font-bold">
                          {plan.price}
                          {plan.period !== 'pricing' && plan.price !== 'Free' && (
                            <span className="text-base font-normal text-muted-foreground">/{plan.period}</span>
                          )}
                        </div>
                        {plan.price === 'Free' && (
                          <p className="text-sm text-muted-foreground mt-1">No credit card required</p>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        
                        {plan.limitations.map((limitation) => (
                          <div key={limitation} className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Power-ups & Add-ons</h2>
              <p className="text-xl text-muted-foreground">
                Enhance your plan with additional features and capabilities
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {addOns.map((addon) => (
                <Card key={addon.name}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-xl">{addon.name}</CardTitle>
                    </div>
                    <CardDescription>{addon.description}</CardDescription>
                    <div className="text-2xl font-bold text-primary mt-4">{addon.price}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-6">
                      {addon.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      Add to Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-slate-200">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-gray-600">
              Join thousands of students and hundreds of universities already using InTransparency
              to achieve better career outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  )
}