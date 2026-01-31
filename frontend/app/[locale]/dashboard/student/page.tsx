'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Plus,
  Eye,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Clock,
  MapPin,
  Building2,
  FileText,
  ChevronRight,
  MessageSquare,
  FolderOpen,
  TrendingUp
} from 'lucide-react'
import { Link } from '@/navigation'

interface DashboardStats {
  projectCount: number
  profileViews: number
  unreadMessages: number
  jobMatches: number
  profileCompletion: number
}

interface JobOpportunity {
  id: string
  title: string
  company: string
  location: string
  type: string
  posted: string
  match: string
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const user = session?.user
  const [projects, setProjects] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    projectCount: 0,
    profileViews: 0,
    unreadMessages: 0,
    jobMatches: 0,
    profileCompletion: 0
  })
  const [recentJobs, setRecentJobs] = useState<JobOpportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, projectsResponse] = await Promise.all([
          fetch('/api/dashboard/student/stats'),
          user?.id ? fetch(`/api/projects?userId=${user.id}`) : Promise.resolve(null)
        ])

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.stats)
          setRecentJobs(statsData.recentJobs || [])
        }

        if (projectsResponse && projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects || [])
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* Header with stats inline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Hey {user?.firstName || 'there'}
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {stats.profileViews} views
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {stats.unreadMessages} messages
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {stats.jobMatches} matches
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/student/profile/edit">Edit Profile</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/student/projects/new">
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile completion - compact */}
      {stats.profileCompletion < 100 && (
        <div className="flex items-center gap-3 p-3 mb-5 bg-amber-50 border border-amber-100 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-amber-900">Profile {stats.profileCompletion}% complete</span>
              <Link href="/dashboard/student/profile/edit" className="text-xs text-amber-700 hover:underline">
                Complete it
              </Link>
            </div>
            <Progress value={stats.profileCompletion} className="h-1.5" />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Projects - takes more space */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-900">Projects</h2>
            <Link href="/dashboard/student/projects" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-2">
              {projects.slice(0, 4).map((project: any) => (
                <Link
                  key={project.id}
                  href={`/dashboard/student/projects/${project.id}`}
                  className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {project.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="h-3 w-3" />
                    {project.views || 0}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <FolderOpen className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-600 mb-3">No projects yet</p>
              <Button size="sm" asChild>
                <Link href="/dashboard/student/projects/new">
                  <Plus className="h-4 w-4 mr-1" />
                  Add your first project
                </Link>
              </Button>
            </div>
          )}

          {/* Jobs section below projects */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-gray-900">Job matches</h2>
              <Link href="/dashboard/student/jobs" className="text-sm text-blue-600 hover:underline">
                Browse jobs
              </Link>
            </div>

            {recentJobs.length > 0 ? (
              <div className="space-y-2">
                {recentJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-3 bg-white border rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{job.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span>{job.company}</span>
                          <span>·</span>
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg p-4 text-center text-sm text-gray-500">
                No job matches yet. Add more projects to improve matching.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - compact */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick links */}
          <Card>
            <CardContent className="p-3">
              <div className="space-y-1">
                <Link
                  href="/dashboard/student/messages"
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">Messages</span>
                  {stats.unreadMessages > 0 && (
                    <Badge variant="destructive" className="text-xs h-5 px-1.5">
                      {stats.unreadMessages}
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/dashboard/student/applications"
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">Applications</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/dashboard/student/analytics"
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">Analytics</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href={`/students/${(user as any)?.username || user?.id}/public`}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">Public profile</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-medium">This week</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile views</span>
                  <span className="font-medium">{stats.profileViews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Project views</span>
                  <span className="font-medium">{projects.reduce((sum, p) => sum + (p.views || 0), 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job matches</span>
                  <span className="font-medium">{stats.jobMatches}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* University status - minimal */}
          <div className="p-3 bg-gray-50 rounded-lg border text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">University</span>
              <Badge variant="outline" className="text-xs">Not verified</Badge>
            </div>
            <Link href="/dashboard/student/profile/edit#university" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
              Connect university email
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
