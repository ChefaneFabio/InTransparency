'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { STUDENT_PRICING } from '@/lib/config/pricing'
import { Check, Sparkles, Zap, Crown, Loader2, ArrowLeft } from 'lucide-react'
import { Link } from '@/navigation'

export default function UpgradePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard/student/upgrade')
    }
  }, [authLoading, isAuthenticated, router])

  const handleUpgrade = async (priceId: string, tier: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard/student/upgrade')
      return
    }

    setLoading(tier)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId,
          tier,
          interval
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error)
      alert(error.message || 'Failed to start checkout. Please try again.')
      setLoading(null)
    }
  }

  const getTierIcon = (tierName: string) => {
    if (tierName === 'Free') return <Sparkles className="h-6 w-6" />
    if (tierName === 'Premium') return <Crown className="h-6 w-6" />
    return <Sparkles className="h-6 w-6" />
  }

  // Filter out the free tier for this upgrade page
  const paidTiers = STUDENT_PRICING.filter(tier => tier.price.monthly > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/student">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Your Account
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stand out to employers with unlimited projects and premium features
          </p>

          {/* Interval Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant={interval === 'monthly' ? 'default' : 'outline'}
              onClick={() => setInterval('monthly')}
              size="lg"
            >
              Monthly
            </Button>
            <Button
              variant={interval === 'annual' ? 'default' : 'outline'}
              onClick={() => setInterval('annual')}
              size="lg"
            >
              Annual
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                Save 17%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {paidTiers.map((tier) => {
            const price = interval === 'monthly' ? tier.price.monthly : tier.price.annual
            const displayPrice = interval === 'annual' ? (price / 12).toFixed(0) : price
            const stripePriceId = interval === 'monthly'
              ? tier.stripePriceIds.monthly
              : tier.stripePriceIds.annual

            return (
              <Card
                key={tier.id}
                className={`relative flex flex-col ${
                  tier.popular
                    ? 'border-primary border-2 shadow-xl scale-105'
                    : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-primary text-white px-4 py-1.5 text-sm font-semibold">
                      ⚡ Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${tier.popular ? 'bg-primary/10' : 'bg-gray-100'}`}>
                      {getTierIcon(tier.name)}
                    </div>
                  </div>

                  <CardTitle className="text-3xl mb-2">{tier.name}</CardTitle>
                  <CardDescription className="text-base">{tier.description}</CardDescription>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold">€{displayPrice}</span>
                      <span className="text-gray-600 text-lg">/month</span>
                    </div>
                    {interval === 'annual' && (
                      <p className="text-sm text-gray-500 mt-2">
                        Billed €{price} annually • Save €{(tier.price.monthly * 12 - price).toFixed(0)}/year
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 px-8">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-8 px-8 pb-8">
                  <Button
                    className={`w-full text-lg py-6 ${tier.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    size="lg"
                    onClick={() => handleUpgrade(stripePriceId || '', tier.id)}
                    disabled={loading === tier.id || !stripePriceId}
                  >
                    {loading === tier.id ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {tier.cta}
                        {tier.popular && ' →'}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    14-day free trial • Cancel anytime
                  </p>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Benefits Summary */}
        <Card className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-lg max-w-5xl mx-auto">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">14 Days</div>
                <div className="text-gray-700">Free trial period</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">30%</div>
                <div className="text-gray-700">More company contacts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-gray-700">Unlimited projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the free trial work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Start your 14-day free trial today. You'll get full access to all Premium features.
                  We'll remind you before your trial ends. Cancel anytime during the trial and you won't be charged.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes, absolutely. You can cancel your subscription at any time from your dashboard.
                  You'll continue to have access to premium features until the end of your billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We accept all major credit cards (Visa, MasterCard, American Express) and debit cards via Stripe.
                  Your payment information is securely processed and never stored on our servers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I switch between plans?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes! You can switch plans at any time. If you upgrade, the price difference will be prorated.
                  If you downgrade, the change will take effect at the end of your current billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 text-center text-gray-600">
          <p>Need help choosing the right plan?</p>
          <p className="mt-2">
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
