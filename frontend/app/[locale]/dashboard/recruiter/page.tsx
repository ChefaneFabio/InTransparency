'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  Search,
  Eye,
  MessageSquare,
  Briefcase,
  Plus,
  MapPin,
  ChevronRight,
  Clock,
  GraduationCap,
  Star,
  Building2,
  FileText,
  Mail,
  TrendingUp,
  LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { Progress } from '@/components/ui/progress'

interface ContactUsage {
  used: number
  limit: number
  remaining: number
}

interface RecruiterStats {
  activeJobs: number
  totalApplications: number
  newApplicationsThisWeek: number
  pendingReview: number
  shortlisted: number
  interviewsScheduled: number
  contactUsage?: ContactUsage
}

interface Candidate {
  id: string
  name: string
  initials: string
  university: string
  degree: string
  photo: string | null
  projectCount: number
  topProject: string | null
  discipline: string | null
  score: number
}

interface JobPosting {
  id: string
  title: string
  status: string
  applications: number
  views: number
  posted: string
}

export default function RecruiterDashboard() {
  const { data: session } = useSession()
  const locale = useLocale()
  const user = session?.user
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<RecruiterStats>({
    activeJobs: 0,
    totalApplications: 0,
    newApplicationsThisWeek: 0,
    pendingReview: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
    contactUsage: { used: 0, limit: 0, remaining: 0 }
  })
  const [topCandidates, setTopCandidates] = useState<Candidate[]>([])
  const [myJobs, setMyJobs] = useState<JobPosting[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/recruiter/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setTopCandidates(data.topCandidates || [])
          setMyJobs(data.myJobs || [])
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
          <div className="animate-pulse text-4xl mb-4">🔍</div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="text-gray-600 mt-1">
            Find and connect with talented graduates
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/recruiter/candidates">
              <Search className="h-4 w-4 mr-2" />
              Search Candidates
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/recruiter/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Contact Credits Card */}
      {stats.contactUsage && (
        <Card className={`border-2 ${
          stats.contactUsage.limit === 0
            ? 'border-gray-200 bg-gray-50'
            : stats.contactUsage.remaining <= 10 && stats.contactUsage.limit !== -1
              ? 'border-amber-200 bg-amber-50'
              : 'border-blue-200 bg-blue-50'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Contact Credits</h3>
                </div>
                {stats.contactUsage.limit === -1 ? (
                  <p className="text-sm text-gray-600">Unlimited contacts with your plan</p>
                ) : stats.contactUsage.limit === 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Upgrade to contact candidates directly</p>
                    <Button size="sm" asChild>
                      <Link href="/pricing?for=recruiters">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Upgrade Plan
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {stats.contactUsage.used} of {stats.contactUsage.limit} used
                      </span>
                      <span className={`font-medium ${
                        stats.contactUsage.remaining <= 10 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {stats.contactUsage.remaining} remaining
                      </span>
                    </div>
                    <Progress
                      value={(stats.contactUsage.used / stats.contactUsage.limit) * 100}
                      className="h-2"
                    />
                    {stats.contactUsage.remaining <= 10 && (
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-xs text-amber-600">Running low on contacts</p>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/pricing?for=recruiters">
                            Upgrade
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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
                <p className="text-2xl font-bold">{stats.activeJobs}</p>
                <p className="text-sm text-gray-600">Active jobs</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalApplications}</p>
                <p className="text-sm text-gray-600">Applications</p>
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
                <p className="text-2xl font-bold">{stats.pendingReview}</p>
                <p className="text-sm text-gray-600">To review</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.shortlisted}</p>
                <p className="text-sm text-gray-600">Shortlisted</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Candidates */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Top Candidates</CardTitle>
                  <CardDescription>
                    Students with strong projects in your areas of interest
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/recruiter/candidates">
                    View all
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCandidates.length > 0 ? (
                topCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.photo || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {candidate.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-yellow-500">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {candidate.university}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {candidate.projectCount} projects
                        </Badge>
                        {candidate.discipline && (
                          <Badge variant="outline" className="text-xs">
                            {candidate.discipline}
                          </Badge>
                        )}
                        {candidate.score > 0 && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Score: {candidate.score}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {candidate.topProject && (
                          <p className="text-xs text-blue-600 truncate max-w-[200px]">
                            Top project: {candidate.topProject}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/students/${candidate.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">No candidates yet</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Students will appear here as they create profiles
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/recruiter/candidates">
                      <Search className="h-4 w-4 mr-2" />
                      Search Candidates
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Jobs */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Your Job Postings</CardTitle>
                  <CardDescription>
                    Track applications and views
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/recruiter/jobs">
                    Manage jobs
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {myJobs.length > 0 ? (
                myJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/dashboard/recruiter/jobs/${job.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <Badge
                            variant={job.status === 'ACTIVE' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {job.posted}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{job.applications}</p>
                          <p className="text-xs text-gray-500">applications</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{job.views}</p>
                          <p className="text-xs text-gray-500">views</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-medium text-gray-900 mb-1">No job postings yet</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Post a job to start receiving applications from qualified candidates
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/recruiter/post-job">
                      <Plus className="h-4 w-4 mr-2" />
                      Post a Job
                    </Link>
                  </Button>
                </div>
              )}
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
                href="/dashboard/recruiter/candidates"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Search candidates</p>
                  <p className="text-xs text-gray-500">Find the right talent</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/recruiter/post-job"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Post a job</p>
                  <p className="text-xs text-gray-500">Reach qualified graduates</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/recruiter/messages"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Messages</p>
                  <p className="text-xs text-gray-500">Conversations with candidates</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/recruiter/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Building2 className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Company settings</p>
                  <p className="text-xs text-gray-500">Update your profile</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </CardContent>
          </Card>

          {/* This Week Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">This week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New applications</span>
                <span className="font-semibold">{stats.newApplicationsThisWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Interviews scheduled</span>
                <span className="font-semibold">{stats.interviewsScheduled}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending review</span>
                <span className="font-semibold text-orange-600">{stats.pendingReview}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>💡</span>
                Recruiting tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                Candidates with verified university projects are <span className="font-medium">2.5x more likely</span> to succeed in technical interviews. Look for the verified badge.
              </p>
            </CardContent>
          </Card>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left border"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
