'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  UserPlus, 
  Briefcase,
  Trophy,
  Upload,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface ActivityItem {
  id: string
  type: 'view' | 'like' | 'comment' | 'connection' | 'job_match' | 'project_analyzed' | 'achievement' | 'application'
  title: string
  description: string
  timestamp: string
  user?: {
    id: string
    name: string
    avatar?: string
    role?: string
  }
  project?: {
    id: string
    title: string
  }
  job?: {
    id: string
    title: string
    company: string
  }
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  userId?: string
  limit?: number
}

export function ActivityFeed({ userId, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching activity data
    const fetchActivities = async () => {
      try {
        // This would be a real API call
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'project_analyzed',
            title: 'Project Analysis Complete',
            description: 'Your "E-commerce Platform" project has been analyzed with an innovation score of 87/100',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            project: {
              id: 'project-1',
              title: 'E-commerce Platform'
            },
            metadata: { score: 87 }
          },
          {
            id: '2',
            type: 'job_match',
            title: 'New Job Match',
            description: 'Found a highly relevant position that matches your skills',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            job: {
              id: 'job-1',
              title: 'Frontend Developer',
              company: 'TechCorp'
            },
            metadata: { matchScore: 92 }
          },
          {
            id: '3',
            type: 'like',
            title: 'Project Liked',
            description: 'liked your project "React Dashboard"',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
            user: {
              id: 'user-1',
              name: 'Sarah Chen',
              avatar: '/images/avatars/sarah-chen.jpg',
              role: 'recruiter'
            },
            project: {
              id: 'project-2',
              title: 'React Dashboard'
            }
          },
          {
            id: '4',
            type: 'view',
            title: 'Profile Viewed',
            description: 'viewed your profile',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
            user: {
              id: 'user-2',
              name: 'Marcus Johnson',
              avatar: '/images/avatars/marcus-johnson.jpg',
              role: 'professional'
            }
          },
          {
            id: '5',
            type: 'achievement',
            title: 'Achievement Unlocked',
            description: 'You\'ve earned the "Rising Star" badge for your exceptional project quality',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            metadata: { badge: 'Rising Star' }
          },
          {
            id: '6',
            type: 'connection',
            title: 'New Connection',
            description: 'accepted your connection request',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            user: {
              id: 'user-3',
              name: 'Emily Rodriguez',
              avatar: '/images/avatars/emily-rodriguez.jpg',
              role: 'student'
            }
          },
          {
            id: '7',
            type: 'comment',
            title: 'New Comment',
            description: 'commented on your project "Machine Learning Model"',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
            user: {
              id: 'user-4',
              name: 'Dr. Michael Smith',
              role: 'professor'
            },
            project: {
              id: 'project-3',
              title: 'Machine Learning Model'
            }
          },
          {
            id: '8',
            type: 'application',
            title: 'Application Submitted',
            description: 'Your application for "Junior Developer" has been submitted successfully',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
            job: {
              id: 'job-2',
              title: 'Junior Developer',
              company: 'StartupXYZ'
            }
          }
        ]
        
        setActivities(mockActivities.slice(0, limit))
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId, limit])

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4 text-blue-500" />
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'connection':
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case 'job_match':
        return <Briefcase className="h-4 w-4 text-blue-600" />
      case 'project_analyzed':
        return <TrendingUp className="h-4 w-4 text-indigo-500" />
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'application':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'view':
        return 'bg-blue-50 border-blue-100'
      case 'like':
        return 'bg-red-50 border-red-100'
      case 'comment':
        return 'bg-green-50 border-green-100'
      case 'connection':
        return 'bg-purple-50 border-purple-100'
      case 'job_match':
        return 'bg-blue-50 border-blue-100'
      case 'project_analyzed':
        return 'bg-indigo-50 border-indigo-100'
      case 'achievement':
        return 'bg-yellow-50 border-yellow-100'
      case 'application':
        return 'bg-green-50 border-green-100'
      default:
        return 'bg-gray-50 border-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          No recent activity
        </h3>
        <p className="text-xs text-gray-500">
          Your recent interactions will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
          <div className="flex items-start space-x-3">
            {/* Icon or Avatar */}
            <div className="flex-shrink-0">
              {activity.user ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback className="text-xs">
                    {(activity.user?.name || '').split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.user && (
                      <span className="font-medium text-gray-900">
                        {activity.user.name}{' '}
                      </span>
                    )}
                    {activity.description}
                  </p>

                  {/* Additional Info */}
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>

                    {activity.user?.role && (
                      <Badge variant="outline" className="text-xs">
                        {activity.user.role}
                      </Badge>
                    )}

                    {activity.metadata?.score && (
                      <Badge variant="secondary" className="text-xs">
                        Score: {activity.metadata.score}/100
                      </Badge>
                    )}

                    {activity.metadata?.matchScore && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.metadata.matchScore}% match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center space-x-2 mt-2">
                {activity.project && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
                    <Link href={`/dashboard/student/projects/${activity.project.id}`}>
                      View Project
                    </Link>
                  </Button>
                )}

                {activity.job && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
                    <Link href={`/dashboard/student/jobs/${activity.job.id}`}>
                      View Job
                    </Link>
                  </Button>
                )}

                {activity.user && activity.type === 'connection' && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
                    <Link href={`/profile/${activity.user.id}`}>
                      View Profile
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {activities.length >= limit && (
        <div className="text-center pt-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/student/activity">
              View All Activity
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}