'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Eye,
  MessageSquare,
  Heart,
  Download,
  Upload,
  UserPlus,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  Filter,
  ExternalLink,
  CheckCircle
} from 'lucide-react'

export default function StudentActivityPage() {
  const [filter, setFilter] = useState('all')

  const activities = [
    {
      id: 1,
      type: 'profile_view',
      title: 'Profile viewed by TechCorp Recruiter',
      description: 'Sarah Johnson from TechCorp viewed your profile',
      timestamp: '2 hours ago',
      icon: Eye,
      color: 'blue',
      actionable: true,
      company: 'TechCorp',
      details: 'Spent 4 minutes reviewing your Machine Learning projects'
    },
    {
      id: 2,
      type: 'project_like',
      title: 'Project liked',
      description: 'Your "E-commerce Analytics Dashboard" received a like from Alex Chen',
      timestamp: '4 hours ago',
      icon: Heart,
      color: 'red',
      actionable: false,
      project: 'E-commerce Analytics Dashboard'
    },
    {
      id: 3,
      type: 'message_received',
      title: 'New message from recruiter',
      description: 'Maria Lopez from DataFlow sent you a message about a Full Stack Developer position',
      timestamp: '1 day ago',
      icon: MessageSquare,
      color: 'green',
      actionable: true,
      company: 'DataFlow',
      unread: true
    },
    {
      id: 4,
      type: 'project_upload',
      title: 'Project uploaded successfully',
      description: 'Your "Real-time Chat Application" has been analyzed and is now live',
      timestamp: '2 days ago',
      icon: Upload,
      color: 'purple',
      actionable: true,
      project: 'Real-time Chat Application',
      status: 'Analysis Complete'
    },
    {
      id: 5,
      type: 'cv_download',
      title: 'CV downloaded',
      description: 'Microsoft Recruiter downloaded your AI-generated CV',
      timestamp: '3 days ago',
      icon: Download,
      color: 'indigo',
      actionable: false,
      company: 'Microsoft'
    },
    {
      id: 6,
      type: 'profile_update',
      title: 'Profile updated',
      description: 'You updated your skills and experience section',
      timestamp: '3 days ago',
      icon: UserPlus,
      color: 'gray',
      actionable: false
    },
    {
      id: 7,
      type: 'job_match',
      title: 'New job matches found',
      description: '5 new positions match your profile: Senior Developer, ML Engineer, and 3 more',
      timestamp: '1 week ago',
      icon: TrendingUp,
      color: 'orange',
      actionable: true,
      matchCount: 5
    },
    {
      id: 8,
      type: 'application_status',
      title: 'Application status updated',
      description: 'Your application to Google for Software Engineer has moved to "Under Review"',
      timestamp: '1 week ago',
      icon: FileText,
      color: 'blue',
      actionable: true,
      company: 'Google',
      status: 'Under Review'
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All Activity', count: activities.length },
    { value: 'profile_view', label: 'Profile Views', count: activities.filter(a => a.type === 'profile_view').length },
    { value: 'message_received', label: 'Messages', count: activities.filter(a => a.type === 'message_received').length },
    { value: 'project_like', label: 'Project Activity', count: activities.filter(a => a.type.includes('project')).length },
    { value: 'job_match', label: 'Job Matches', count: activities.filter(a => a.type === 'job_match').length }
  ]

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(activity => {
        if (filter === 'project_like') return activity.type.includes('project')
        return activity.type === filter
      })

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      red: 'text-red-600 bg-red-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      gray: 'text-gray-600 bg-gray-100',
      orange: 'text-orange-600 bg-orange-100'
    }
    return colors[color as keyof typeof colors] || colors.gray
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↗ +12% this week</span>
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
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-blue-600">2 unread</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Project Likes</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↗ +8 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Job Matches</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">5 new matches</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
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
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    activity.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  } hover:bg-gray-50`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(activity.color)}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <div className="flex items-center space-x-2">
                        {activity.unread && (
                          <Badge className="bg-blue-100 text-blue-800">New</Badge>
                        )}
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-1">{activity.description}</p>

                    {activity.details && (
                      <p className="text-gray-500 text-xs mt-2 italic">{activity.details}</p>
                    )}

                    {activity.status && (
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{activity.status}</span>
                      </div>
                    )}

                    {activity.actionable && (
                      <div className="flex items-center space-x-3 mt-3">
                        {activity.type === 'profile_view' && (
                          <Button size="sm" variant="outline">
                            View Company Profile
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                        {activity.type === 'message_received' && (
                          <Button size="sm">
                            Reply to Message
                          </Button>
                        )}
                        {activity.type === 'project_upload' && (
                          <Button size="sm" variant="outline">
                            View Analysis Results
                          </Button>
                        )}
                        {activity.type === 'job_match' && (
                          <Button size="sm">
                            View {activity.matchCount} Matches
                          </Button>
                        )}
                        {activity.type === 'application_status' && (
                          <Button size="sm" variant="outline">
                            View Application
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your filter or check back later for new activity.</p>
            </div>
          )}

          {/* Load More */}
          {filteredActivities.length > 0 && (
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <Button variant="outline">
                Load More Activity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}