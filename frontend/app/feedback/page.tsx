'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Users,
  Building2,
  School,
  ArrowRight,
  Calendar,
  TrendingUp,
  Database
} from 'lucide-react'
import { format } from 'date-fns'

export default function FeedbackPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentResponses, setRecentResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedbackData()
  }, [])

  const fetchFeedbackData = async () => {
    try {
      const response = await fetch('/api/surveys/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
        setRecentResponses(data.data.recentResponses || [])
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'company':
        return <Building2 className="h-4 w-4 text-green-600" />
      case 'university':
        return <School className="h-4 w-4 text-purple-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'company':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'university':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-12 w-12 mx-auto text-blue-600 mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Survey Feedback</h2>
          <p className="text-gray-600">Fetching the latest survey responses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Feedback
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our community members are saying about InTransparency.
              Your voice helps us build a better platform for everyone.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Responses</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.total || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Community voices heard</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.byType?.student || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Future professionals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Companies</CardTitle>
                <Building2 className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.byType?.company || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Hiring partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Universities</CardTitle>
                <School className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats?.byType?.university || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Education partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Recent Community Feedback
            </CardTitle>
            <CardDescription>
              Latest survey responses from our community members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentResponses && recentResponses.length > 0 ? (
              <div className="space-y-4">
                {recentResponses.map((response, index) => (
                  <div
                    key={response.id}
                    className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(response.surveyType)}
                        <Badge className={getTypeBadgeColor(response.surveyType)}>
                          {response.surveyType}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-800 font-medium">
                        Response #{index + 1}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        {format(new Date(response.createdAt), 'MMM d, yyyy')}
                      </div>
                      {response.completionTime && (
                        <div className="text-xs font-medium">
                          {Math.round(response.completionTime / 1000)}s completion
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Your Voice</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    As a new platform, we're eager to hear from our community. Your feedback will directly shape how InTransparency evolves to serve students, employers, and universities better.
                  </p>
                </div>
                <div className="space-y-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/survey">
                      Share Your Thoughts
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <div className="text-sm text-gray-500">
                    📝 Quick surveys • 💡 Shape our features • 🚀 Help us grow
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Help Build the Future of Academic-Career Connections
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              InTransparency is being built with community input at its core. Your perspectives on academic achievement, skill demonstration, and career development help us create a platform that truly serves everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/survey">
                  Join Our Community Survey
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <div className="text-sm text-gray-500">
                🎯 5-8 minutes • 🎁 Early access opportunities
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}