import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star, Users, Building, GraduationCap, ArrowRight, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Student',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for individual students building their career portfolios',
    icon: Users,
    popular: false,
    features: [
      'AI-powered project analysis',
      'Professional story generation',
      'Skills assessment',
      'Job matching algorithm',
      'Resume optimization',
      'Up to 10 projects',
      'Basic analytics dashboard',
      'Email support'
    ],
    limitations: [
      'Limited to 5 AI analyses per month',
      'Basic story templates only',
      'Standard matching algorithm'
    ],
    cta: 'Get Started Free',
    color: 'bg-blue-500'
  },
  {
    name: 'University',
    price: '$2,500',
    period: 'per month',
    description: 'Comprehensive solution for educational institutions',
    icon: GraduationCap,
    popular: true,
    features: [
      'Everything in Student plan',
      'Unlimited students',
      'Advanced analytics dashboard',
      'Placement tracking',
      'Employer partnership tools',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'Priority support',
      'Custom integrations',
      'Bulk export capabilities',
      'Advanced reporting'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    color: 'bg-purple-500'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'Tailored solutions for large organizations and employers',
    icon: Building,
    popular: false,
    features: [
      'Everything in University plan',
      'Custom AI model training',
      'White-label solution',
      'Advanced security features',
      'SSO integration',
      'Custom workflows',
      'Dedicated infrastructure',
      '24/7 support',
      'On-premise deployment option',
      'Custom analytics',
      'Training and onboarding',
      'SLA guarantees'
    ],
    limitations: [],
    cta: 'Contact Sales',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  }
]

const faqs = [
  {
    question: 'How does the AI project analysis work?',
    answer: 'Our AI analyzes your project code, documentation, and descriptions to assess technical complexity, innovation level, and market relevance. It provides detailed insights and suggestions for improvement.'
  },
  {
    question: 'Can I upgrade or downgrade my plan at any time?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
  },
  {
    question: 'Do you offer discounts for educational institutions?',
    answer: 'Yes, we offer special pricing for educational institutions. Contact our sales team to discuss volume discounts and academic pricing.'
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Absolutely. We use enterprise-grade security measures and never share your personal data. All projects and profiles remain private unless you choose to make them public.'
  },
  {
    question: 'How accurate is the job matching algorithm?',
    answer: 'Our AI-powered matching algorithm has a 92% accuracy rate in identifying relevant opportunities. It continuously learns from successful placements to improve recommendations.'
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to premium features until the end of your current billing period.'
  }
]

const addOns = [
  {
    name: 'Premium Analytics',
    price: '$500/month',
    description: 'Advanced reporting and custom dashboards',
    features: ['Custom reports', 'Real-time analytics', 'Data export']
  },
  {
    name: 'AI Story Generation Plus',
    price: '$200/month',
    description: 'Unlimited AI-generated professional stories',
    features: ['Unlimited generations', 'Premium templates', 'Multi-format export']
  },
  {
    name: 'Employer Network Access',
    price: '$1,000/month',
    description: 'Direct access to our premium employer network',
    features: ['Priority job matching', 'Exclusive opportunities', 'Dedicated recruiter support']
  }
]

export default function Pricing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Choose the plan that fits your needs. All plans include our core AI-powered features.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Check className="h-5 w-5" />
              <span>30-day free trial</span>
              <span className="mx-2">•</span>
              <Check className="h-5 w-5" />
              <span>No setup fees</span>
              <span className="mx-2">•</span>
              <Check className="h-5 w-5" />
              <span>Cancel anytime</span>
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
      <section className="py-20 bg-muted/50">
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students and hundreds of universities already using InTransparency 
              to achieve better career outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}