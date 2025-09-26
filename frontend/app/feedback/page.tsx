'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
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
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(response.surveyType)}
                        <Badge className={getTypeBadgeColor(response.surveyType)}>
                          {response.surveyType}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Response #{index + 1}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(response.createdAt), 'MMM d, yyyy')}
                      </div>
                      {response.completionTime && (
                        <div className="text-xs">
                          {Math.round(response.completionTime / 1000)}s completion
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
                <p className="text-gray-600 mb-6">Be the first to share your feedback with us!</p>
                <Button asChild>
                  <Link href="/survey">
                    Take Survey
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Share Your Voice
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Help us improve InTransparency by sharing your thoughts and experiences.
              Your feedback directly influences our platform development.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/survey">
                  Take Survey
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/admin/surveys">
                  View Detailed Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}