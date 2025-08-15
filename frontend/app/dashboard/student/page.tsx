'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { ProjectCard } from '@/components/dashboard/student/ProjectCard'
import { ProfileCard } from '@/components/dashboard/student/ProfileCard'
import { JobMatches } from '@/components/dashboard/student/JobMatches'
import { ActivityFeed } from '@/components/dashboard/student/ActivityFeed'
import { StatsCard } from '@/components/dashboard/shared/StatsCard'
import { QuickActions } from '@/components/dashboard/shared/QuickActions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, TrendingUp, Users, Briefcase, Eye } from 'lucide-react'
import Link from 'next/link'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [matches, setMatches] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch user's projects
        const projectsResponse = await fetch(`/api/projects?userId=${user?.id}`)
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects || [])

        // Fetch job matches
        const matchesResponse = await fetch(`/api/matches/recommendations/${user?.id}`)
        const matchesData = await matchesResponse.json()
        setMatches(matchesData.matches || [])

        // Fetch analytics
        const analyticsResponse = await fetch(`/api/analytics/dashboard/${user?.id}`)
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData.analytics || {})

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: TrendingUp,
      description: 'Projects uploaded',
      trend: '+2 this month'
    },
    {
      title: 'Profile Views',
      value: analytics?.profileViews || 0,
      icon: Eye,
      description: 'Profile visits',
      trend: '+12% vs last month'
    },
    {
      title: 'Job Matches',
      value: matches.length,
      icon: Briefcase,
      description: 'Relevant opportunities',
      trend: '+5 new matches'
    },
    {
      title: 'Network',
      value: analytics?.connections || 0,
      icon: Users,
      description: 'Professional connections',
      trend: '+8 connections'
    }
  ]

  const quickActions = [
    {
      title: 'Upload New Project',
      description: 'Share your latest work',
      href: '/dashboard/student/projects/new',
      icon: Plus,
      color: 'blue'
    },
    {
      title: 'Update Profile',
      description: 'Keep your profile current',
      href: '/dashboard/student/profile/edit',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Browse Jobs',
      description: 'Explore opportunities',
      href: '/dashboard/student/jobs',
      icon: Briefcase,
      color: 'purple'
    },
    {
      title: 'View Analytics',
      description: 'Track your progress',
      href: '/dashboard/student/analytics',
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects and career journey.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/student/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with these common tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickActions actions={quickActions} />
            </CardContent>
          </Card>

          {/* Projects Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>
                    Recent projects and their performance
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/student/projects">
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upload your first project to get started with AI analysis and job matching.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/student/projects/new">
                      Upload First Project
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Matches */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recommended Jobs</CardTitle>
                  <CardDescription>
                    Opportunities matched to your skills
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/student/jobs">
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <JobMatches matches={matches.slice(0, 3)} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Profile Card */}
          <ProfileCard user={user} />

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed userId={user?.id} />
            </CardContent>
          </Card>

          {/* Tips & Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Career Tips</CardTitle>
              <CardDescription>
                Boost your profile and job prospects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Complete your profile</h4>
                <p className="text-sm text-gray-600">
                  Profiles with photos get 5x more views
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Add project descriptions</h4>
                <p className="text-sm text-gray-600">
                  Detailed descriptions improve AI analysis
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">Connect with peers</h4>
                <p className="text-sm text-gray-600">
                  Networking leads to opportunities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            Track your journey towards your career goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="skills" className="space-y-4">
            <TabsList>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">JavaScript</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">78%</div>
                  <div className="text-sm text-gray-600">React</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-600">Python</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="projects">
              <div className="text-center py-8">
                <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
                <div className="text-gray-600">Projects uploaded</div>
                <div className="mt-2 text-sm text-green-600">+2 this month</div>
              </div>
            </TabsContent>
            
            <TabsContent value="network">
              <div className="text-center py-8">
                <div className="text-3xl font-bold text-gray-900">{analytics?.connections || 0}</div>
                <div className="text-gray-600">Professional connections</div>
                <div className="mt-2 text-sm text-green-600">+8 this week</div>
              </div>
            </TabsContent>
            
            <TabsContent value="goals">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Land first internship</div>
                    <div className="text-sm text-gray-600">Target: Summer 2024</div>
                  </div>
                  <div className="text-green-600 font-medium">75%</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Complete 5 projects</div>
                    <div className="text-sm text-gray-600">Current: {projects.length}/5</div>
                  </div>
                  <div className="text-blue-600 font-medium">{Math.round((projects.length / 5) * 100)}%</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}