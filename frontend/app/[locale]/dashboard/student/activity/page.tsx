'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Activity,
  Eye,
  MessageSquare,
  FileText,
  Clock,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'profile_view' | 'message_received' | 'application_status'
  title: string
  description: string
  timestamp: string
  metadata: Record<string, any>
}

interface ActivitySummary {
  profileViews: number
  messagesReceived: number
  applicationUpdates: number
}

export default function StudentActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [summary, setSummary] = useState<ActivitySummary>({ profileViews: 0, messagesReceived: 0, applicationUpdates: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const fetchActivity = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/student/activity')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load activity')
        return res.json()
      })
      .then(data => {
        setActivities(data.activities || [])
        setSummary(data.summary || { profileViews: 0, messagesReceived: 0, applicationUpdates: 0 })
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter)

  const filterOptions = [
    { value: 'all', label: 'All Activity', count: activities.length },
    { value: 'profile_view', label: 'Profile Views', count: activities.filter(a => a.type === 'profile_view').length },
    { value: 'message_received', label: 'Messages', count: activities.filter(a => a.type === 'message_received').length },
    { value: 'application_status', label: 'Applications', count: activities.filter(a => a.type === 'application_status').length },
  ]

  const getIconForType = (type: string) => {
    switch (type) {
      case 'profile_view': return Eye
      case 'message_received': return MessageSquare
      case 'application_status': return FileText
      default: return Activity
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case 'profile_view': return 'text-blue-600 bg-blue-100'
      case 'message_received': return 'text-green-600 bg-green-100'
      case 'application_status': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Feed</h1>
          <p className="text-gray-600 mt-2">Stay updated with all interactions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Feed</h1>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchActivity}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Feed</h1>
        <p className="text-gray-600 mt-2">
          Stay updated with all interactions and activities related to your profile
        </p>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{summary.profileViews}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Messages Received</p>
                <p className="text-2xl font-bold text-gray-900">{summary.messagesReceived}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Application Updates</p>
                <p className="text-2xl font-bold text-gray-900">{summary.applicationUpdates}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === option.value
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>

          {/* Activity List */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const Icon = getIconForType(activity.type)
              const colorClass = getColorForType(activity.type)

              return (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    activity.metadata.read === false
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200'
                  } hover:bg-gray-50`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <div className="flex items-center space-x-2">
                        {activity.metadata.read === false && (
                          <Badge className="bg-blue-100 text-blue-800">New</Badge>
                        )}
                        <span className="text-sm text-gray-700 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-1">{activity.description}</p>

                    {activity.metadata.viewDuration && (
                      <p className="text-gray-700 text-xs mt-2 italic">
                        Viewed for {Math.round(activity.metadata.viewDuration / 60)} min
                      </p>
                    )}

                    {activity.metadata.statusLabel && activity.type === 'application_status' && (
                      <div className="flex items-center mt-2">
                        <Badge variant="outline">{activity.metadata.statusLabel}</Badge>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 mt-3">
                      {activity.type === 'profile_view' && activity.metadata.company && (
                        <Button size="sm" variant="outline">
                          {activity.metadata.company}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                      {activity.type === 'message_received' && (
                        <Button size="sm">Reply to Message</Button>
                      )}
                      {activity.type === 'application_status' && (
                        <Button size="sm" variant="outline">View Application</Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? 'Your activity feed will show profile views, messages, and application updates.'
                  : 'Try adjusting your filter or check back later for new activity.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
