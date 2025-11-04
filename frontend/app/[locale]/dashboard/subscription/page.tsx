'use client'

import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getPricingTier } from '@/lib/config/pricing'
import {
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Crown,
  Zap,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionPage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Fetch user subscription data
      fetchUserData()
    }
  }, [isAuthenticated, authUser])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/subscription', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscription/portal', {
        method: 'POST'
      })

      if (response.ok) {
        const { url } = await response.json()
        if (url) {
          window.location.href = url
        }
      } else {
        alert('Failed to open subscription portal. Please try again.')
      }
    } catch (error) {
      console.error('Error opening subscription portal:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !subscriptionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentTier = subscriptionData.subscriptionTier || 'FREE'
  const tierInfo = getPricingTier(currentTier)
  const subscriptionStatus = subscriptionData.subscriptionStatus || 'INACTIVE'
  const premiumUntil = subscriptionData.premiumUntil ? new Date(subscriptionData.premiumUntil) : null

  const isActive = subscriptionStatus === 'ACTIVE' || subscriptionStatus === 'TRIALING'
  const isTrialing = subscriptionStatus === 'TRIALING'
  const isPastDue = subscriptionStatus === 'PAST_DUE'
  const isCanceled = subscriptionStatus === 'CANCELED'

  const getTierIcon = () => {
    if (tierInfo?.name === 'Free') return <Sparkles className="h-6 w-6" />
    if (tierInfo?.name === 'Pro') return <Zap className="h-6 w-6" />
    if (tierInfo?.name === 'Elite') return <Crown className="h-6 w-6" />
    return <Sparkles className="h-6 w-6" />
  }

  const getStatusBadge = () => {
    if (isTrialing) {
      return <Badge className="bg-blue-100 text-blue-700">Trial Active</Badge>
    }
    if (isActive) {
      return <Badge className="bg-green-100 text-green-700">Active</Badge>
    }
    if (isPastDue) {
      return <Badge className="bg-orange-100 text-orange-700">Past Due</Badge>
    }
    if (isCanceled) {
      return <Badge className="bg-gray-100 text-gray-700">Canceled</Badge>
    }
    return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
          <p className="text-gray-600">Manage your subscription and billing information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Current Plan</CardTitle>
                    <CardDescription>Your subscription details</CardDescription>
                  </div>
                  {getStatusBadge()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {getTierIcon()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{tierInfo?.name || 'Free'} Plan</h3>
                    <p className="text-gray-600">{tierInfo?.description}</p>
                  </div>
                </div>

                {premiumUntil && isActive && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">
                          {isTrialing ? 'Trial ends on' : 'Next billing date'}
                        </p>
                        <p className="text-sm text-blue-700">
                          {premiumUntil.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isPastDue && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-900">Payment Failed</p>
                        <p className="text-sm text-orange-700">
                          Please update your payment method to continue using premium features.
                        </p>
                        <Button
                          size="sm"
                          className="mt-3"
                          onClick={handleManageSubscription}
                          disabled={loading}
                        >
                          Update Payment Method
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3">Your Plan Includes:</h4>
                  <ul className="space-y-2">
                    {tierInfo?.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                {currentTier === 'FREE' ? (
                  <Button size="lg" asChild className="flex-1">
                    <Link href="/dashboard/student/upgrade">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Upgrade Plan
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={handleManageSubscription}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Manage Subscription
                        </>
                      )}
                    </Button>
                    {(currentTier === 'STUDENT_PRO' || currentTier === 'RECRUITER_STARTER') && (
                      <Button size="lg" asChild className="flex-1">
                        <Link href="/dashboard/student/upgrade">
                          <TrendingUp className="mr-2 h-5 w-5" />
                          Upgrade to Elite
                        </Link>
                      </Button>
                    )}
                  </>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Projects</span>
                    <span className="font-medium">
                      {subscriptionData.projectCount || 0} / {tierInfo?.limits.projects === -1 ? '∞' : tierInfo?.limits.projects || 3}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          tierInfo?.limits.projects === -1
                            ? 0
                            : Math.min(((subscriptionData.projectCount || 0) / (tierInfo?.limits.projects || 3)) * 100, 100)
                        }%`
                      }}
                    />
                  </div>
                </div>

                {currentTier !== 'FREE' && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">AI Searches</span>
                        <span className="font-medium">
                          {subscriptionData.aiSearchCount || 0} / {tierInfo?.limits.aiSearches === -1 ? '∞' : tierInfo?.limits.aiSearches || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              tierInfo?.limits.aiSearches === -1
                                ? 0
                                : Math.min(((subscriptionData.aiSearchCount || 0) / (tierInfo?.limits.aiSearches || 1)) * 100, 100)
                            }%`
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Contacts</span>
                        <span className="font-medium">
                          {subscriptionData.contactCount || 0} / {tierInfo?.limits.contacts === -1 ? '∞' : tierInfo?.limits.contacts || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              tierInfo?.limits.contacts === -1
                                ? 0
                                : Math.min(((subscriptionData.contactCount || 0) / (tierInfo?.limits.contacts || 1)) * 100, 100)
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            {currentTier === 'FREE' && (
              <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Unlock More Features</CardTitle>
                  <CardDescription>Get unlimited projects and priority matching</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Unlimited projects
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Priority in search results
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Direct messaging
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/student/upgrade">
                      Upgrade Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Link href="/contact" className="block text-primary hover:underline">
                  Contact Support
                </Link>
                <Link href="/pricing" className="block text-primary hover:underline">
                  View All Plans
                </Link>
                <Link href="/faq" className="block text-primary hover:underline">
                  FAQs
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
