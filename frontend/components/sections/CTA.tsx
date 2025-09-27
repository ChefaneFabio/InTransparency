import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
  'AI-powered project analysis',
  'Professional story generation', 
  'Smart job matching',
  'Direct recruiter connections',
  'Career progress tracking',
  'Peer collaboration network'
]

const pricingTiers = [
  {
    name: 'Student',
    price: 'Free',
    description: 'Perfect for students getting started',
    features: [
      'Upload up to 5 projects',
      'Basic AI analysis',
      'Professional stories',
      'Community access',
      'Email support'
    ],
    cta: 'Start Free',
    popular: false
  },
  {
    name: 'Pro Student',
    price: '$9/month',
    description: 'Advanced features for serious students',
    features: [
      'Unlimited projects',
      'Advanced AI analysis',
      'Priority job matching',
      'Video portfolio creation',
      'Direct recruiter messaging',
      'Priority support'
    ],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'University',
    price: 'Custom',
    description: 'Enterprise solution for institutions',
    features: [
      'Institution-wide access',
      'Student analytics dashboard',
      'Placement tracking',
      'Industry partnerships',
      'Custom branding',
      'Dedicated support'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        {/* Main CTA */}
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Transform your projects into
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"> career opportunities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Use InTransparency to showcase your work, connect with opportunities,
            and advance your career.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-left">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
              <Link href="/auth/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#demo">
                Watch Demo
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Start showcasing in minutes • Get started today
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose your plan
            </h3>
            <p className="text-xl text-gray-600">
              Start free and upgrade as your career grows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border-2 p-8 ${
                  tier.popular
                    ? 'border-teal-500 shadow-xl scale-105'
                    : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <div className="text-4xl font-bold text-gray-900">
                    {tier.price}
                    {tier.price !== 'Free' && tier.price !== 'Custom' && (
                      <span className="text-lg text-gray-500 font-normal">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {(tier.features || []).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.popular
                      ? 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white'
                      : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                  }`}
                  asChild
                >
                  <Link href={tier.name === 'University' ? '/contact-sales' : '/auth/register'}>
                    {tier.cta}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              All plans include SSL security, data backups, and GDPR compliance
            </p>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to unlock your potential?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Transform your academic projects into compelling career stories. 
            Start your journey with InTransparency today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/auth/register">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/contact">
                Schedule Demo
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">
            Connect with top universities and companies
          </p>
        </div>
      </div>
    </section>
  )
}