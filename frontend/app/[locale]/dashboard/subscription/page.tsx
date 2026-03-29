'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Sparkles,
  Loader2,
  Infinity
} from 'lucide-react'
import { Link } from '@/navigation'

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscriptionData, setSubscriptionData] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/dashboard/student/profile')
      if (response.ok) {
        const data = await response.json()
        const user = data.user || data
        setSubscriptionData({
          subscriptionTier: user.subscriptionTier || 'FREE',
          projectCount: user.projectCount || 0,
          role: user.role || 'STUDENT',
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  if (status === 'loading' || !subscriptionData) {
    return (
      <div className="min-h-screen space-y-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const role = subscriptionData.role

  const features = role === 'RECRUITER' ? [
    'Unlimited portfolio browsing',
    'Advanced search & filters',
    'Unlimited candidate contacts',
    'AI-powered talent matching',
    'Post job listings',
    'Full project and skill data',
  ] : role === 'INSTITUTION' ? [
    'Verify student projects',
    'Batch approval dashboard',
    'Placement analytics',
    'Company visibility tracking',
    'Alumni management',
  ] : [
    'Unlimited project uploads',
    'Institution verification',
    'Public portfolio page',
    'Company discovery',
    'Profile analytics',
  ]

  return (
    <div className="min-h-screen space-y-6">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Plan</h1>
          <p className="text-muted-foreground">Full access — free during launch</p>
        </div>

        <Card className="border-2 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Full Access</CardTitle>
                  <CardDescription>Everything included — no limits</CardDescription>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Infinity className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Free during launch</p>
                  <p className="text-sm text-foreground/80">
                    You have full access to all platform features. No credit card required, no time limit on the current plan.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Your Plan Includes:</h4>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Projects</span>
                <span className="font-medium">{subscriptionData.projectCount || 0} / Unlimited</span>
              </div>
            </div>
            {role === 'RECRUITER' && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Contacts</span>
                  <span className="font-medium">Unlimited</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Link href="/contact" className="block text-primary hover:underline">
              Contact Support
            </Link>
            <Link href="/pricing" className="block text-primary hover:underline">
              Learn More About the Platform
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
