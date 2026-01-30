'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Settings,
  Bell,
  ChevronRight,
  Sparkles,
  GraduationCap
} from 'lucide-react'
import { Link } from '@/navigation'
import { useRouter } from 'next/navigation'

export default function StudentDashboard() {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profileCompletion, setProfileCompletion] = useState(45)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.id) {
          const projectsResponse = await fetch(`/api/projects?userId=${user.id}`)
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">📚</div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Sample job opportunities (would come from API)
  const recentOpportunities = [
    {
      id: 1,
      title: 'Junior Frontend Developer',
      company: 'TechStart Milano',
      location: 'Milano, Italy',
      type: 'Full-time',
      posted: '2 days ago',
      match: 'Based on your React projects'
    },
    {
      id: 2,
      title: 'Software Engineering Intern',
      company: 'Fintech Solutions',
      location: 'Remote',
      type: 'Internship',
      posted: '5 days ago',
      match: 'Matches your Python skills'
    },
    {
      id: 3,
      title: 'Data Analyst Graduate',
      company: 'Analytics Co',
      location: 'Turin, Italy',
      type: 'Full-time',
      posted: '1 week ago',
      match: 'Fits your data science background'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Simple Welcome */}
      <div className="pt-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          {getGreeting()}, {user?.firstName || 'there'}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your profile
        </p>
      </div>

      {/* Profile Completion Banner - Only show if incomplete */}
      {profileCompletion < 100 && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Complete your profile</p>
                  <p className="text-sm text-gray-600">
                    Profiles with more details get 3x more views from recruiters
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium text-blue-600">{profileCompletion}%</span>
                  <Progress value={profileCompletion} className="w-24 h-2" />
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/student/profile/edit">
                    Continue
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-gray-600">Projects</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-gray-600">Profile views</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Job matches</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">New messages</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Your Projects */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Your Projects</CardTitle>
                  <CardDescription>
                    Showcase your work to recruiters
                  </CardDescription>
                </div>
                <Button size="sm" asChild>
                  <Link href="/dashboard/student/projects/new">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Project
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project: any) => (
                    <Link
                      key={project.id}
                      href={`/dashboard/student/projects/${project.id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xl">
                          {project.emoji || '📁'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {project.title || 'Untitled Project'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {project.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          {project.views || 0}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}

                  {projects.length > 3 && (
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/dashboard/student/projects">
                        View all {projects.length} projects
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Add your first project
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                    Show recruiters what you can do. Upload a project from university, a personal project, or anything you're proud of.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/student/projects/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Opportunities */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Opportunities for you</CardTitle>
                  <CardDescription>
                    Jobs that match your skills and projects
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/student/jobs">
                    Browse all
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOpportunities.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg border hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {job.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {job.match}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.posted}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/dashboard/student/profile/edit"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Edit profile</p>
                  <p className="text-xs text-gray-500">Update your info</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/student/projects/new"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Upload project</p>
                  <p className="text-xs text-gray-500">Share your work</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/student/jobs"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Find jobs</p>
                  <p className="text-xs text-gray-500">Browse opportunities</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href={`/students/${(user as any)?.username || user?.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <ExternalLink className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">View public profile</p>
                  <p className="text-xs text-gray-500">See how others see you</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>💡</span>
                Quick tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                Record a short video introduction for your profile. Students with video intros get <span className="font-medium">2x more recruiter responses</span>.
              </p>
              <Button variant="link" className="px-0 mt-2 h-auto" asChild>
                <Link href="/dashboard/student/profile/edit#video">
                  Add video intro
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* University Connection Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">University verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-2xl">🎓</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">Not verified yet</p>
                  <p className="text-xs text-amber-700">
                    Connect your university email to get verified
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3" size="sm" asChild>
                <Link href="/dashboard/student/profile/edit#university">
                  Connect university
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
