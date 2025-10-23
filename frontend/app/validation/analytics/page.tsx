'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getValidationAnalytics } from '@/lib/analytics'
import { TrendingUp, Users, MessageCircle, DollarSign, Download, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ValidationAnalyticsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Protect this page - admin only
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAnalytics()
    }
  }, [user])

  const loadAnalytics = () => {
    setLoading(true)
    const data = getValidationAnalytics()
    setAnalytics(data)
    setLoading(false)
  }

  const exportData = () => {
    if (!analytics) return

    const dataStr = JSON.stringify(analytics, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `validation_analytics_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const calculateOptimalPrice = () => {
    if (!analytics || analytics.pricingSurveys === 0) return null

    const surveys = analytics.surveys
    const avgTooExpensive = surveys.reduce((sum: number, s: any) => sum + s.tooExpensive, 0) / surveys.length
    const avgExpensive = surveys.reduce((sum: number, s: any) => sum + s.expensive, 0) / surveys.length
    const avgBargain = surveys.reduce((sum: number, s: any) => sum + s.bargain, 0) / surveys.length
    const avgTooCheap = surveys.reduce((sum: number, s: any) => sum + s.tooCheap, 0) / surveys.length

    return {
      optimalPricePoint: Math.round((avgExpensive + avgBargain) / 2),
      acceptableRange: [Math.round(avgTooCheap), Math.round(avgTooExpensive)],
      avgTooExpensive,
      avgExpensive,
      avgBargain,
      avgTooCheap
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not admin
  if (!user || user.role !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const optimalPrice = calculateOptimalPrice()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Validation Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  Track demand validation and pricing experiments
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={loadAnalytics} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button onClick={exportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fake Door Clicks</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.fakeDoorClicks}</p>
                    </div>
                    <div className="rounded-full bg-blue-100 p-3">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Waitlist Signups</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.waitlistSignups}</p>
                    </div>
                    <div className="rounded-full bg-green-100 p-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Interview Signups</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.interviewSignups}</p>
                    </div>
                    <div className="rounded-full bg-purple-100 p-3">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.conversionRate}</p>
                    </div>
                    <div className="rounded-full bg-orange-100 p-3">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Van Westendorp Optimal Price */}
            {optimalPrice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="mr-2 h-6 w-6 text-green-600" />
                      Van Westendorp Price Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-2xl text-gray-900 mb-4">
                          Optimal Price Point: €{optimalPrice.optimalPricePoint}
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Based on {analytics.pricingSurveys} survey responses
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Acceptable Range:</span>
                            <span className="font-semibold">€{optimalPrice.acceptableRange[0]} - €{optimalPrice.acceptableRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-gray-600">Too Expensive:</span>
                          <Badge variant="destructive">€{Math.round(optimalPrice.avgTooExpensive)}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-gray-600">Expensive but OK:</span>
                          <Badge className="bg-orange-500">€{Math.round(optimalPrice.avgExpensive)}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-gray-600">Good Bargain:</span>
                          <Badge className="bg-green-500">€{Math.round(optimalPrice.avgBargain)}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-gray-600">Too Cheap:</span>
                          <Badge variant="secondary">€{Math.round(optimalPrice.avgTooCheap)}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recent Signups */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Waitlist Signups</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.signups.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {analytics.signups.slice(-10).reverse().map((signup: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{signup.email}</span>
                            <Badge variant="secondary" className="text-xs">
                              €{signup.price}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(signup.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No signups yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Interview Signups</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.interviews.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {analytics.interviews.slice(-10).reverse().map((interview: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{interview.email}</span>
                            <Badge variant={interview.participantType === 'student' ? 'default' : 'secondary'} className="text-xs">
                              {interview.participantType}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(interview.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No interview signups yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Success Criteria */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle>Validation Success Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Target Metrics</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${analytics.fakeDoorClicks >= 100 ? 'bg-green-500' : 'bg-gray-300'}`} />
                          100+ fake door clicks
                        </li>
                        <li className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${analytics.waitlistSignups >= 40 ? 'bg-green-500' : 'bg-gray-300'}`} />
                          40+ waitlist signups (40% conversion)
                        </li>
                        <li className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${analytics.interviewSignups >= 30 ? 'bg-green-500' : 'bg-gray-300'}`} />
                          30+ interviews (15 students + 15 recruiters)
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Current Progress</h3>
                      <ul className="space-y-2 text-sm">
                        <li>Clicks: <span className="font-bold">{analytics.fakeDoorClicks}/100</span> ({Math.round(analytics.fakeDoorClicks/100*100)}%)</li>
                        <li>Signups: <span className="font-bold">{analytics.waitlistSignups}/40</span> ({Math.round(analytics.waitlistSignups/40*100)}%)</li>
                        <li>Interviews: <span className="font-bold">{analytics.interviewSignups}/30</span> ({Math.round(analytics.interviewSignups/30*100)}%)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">GO/NO-GO Decision</h3>
                      <div className={`p-4 rounded-lg ${
                        analytics.waitlistSignups >= 40 && analytics.interviewSignups >= 30
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-gray-100 border-2 border-gray-300'
                      }`}>
                        <p className="font-bold text-lg">
                          {analytics.waitlistSignups >= 40 && analytics.interviewSignups >= 30
                            ? '✅ GO - Validation Passed'
                            : '⏳ Pending - Keep Collecting Data'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
