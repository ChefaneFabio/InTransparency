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
  Building2
} from 'lucide-react'

export default function RecruiterDashboard() {
  const { data: session } = useSession()
  const user = session?.user
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Sample data - would come from API
  const recentCandidates = [
    {
      id: 1,
      name: "Marco Rossi",
      university: "Politecnico di Milano",
      degree: "Computer Science",
      location: "Milano",
      skills: ["React", "Python", "TensorFlow"],
      matchReason: "Strong full-stack projects",
      avatar: null
    },
    {
      id: 2,
      name: "Giulia Bianchi",
      university: "Università di Bologna",
      degree: "Data Science",
      location: "Bologna",
      skills: ["Python", "SQL", "Machine Learning"],
      matchReason: "Data analysis background",
      avatar: null
    },
    {
      id: 3,
      name: "Alessandro Ferrari",
      university: "Sapienza Roma",
      degree: "Software Engineering",
      location: "Roma",
      skills: ["Java", "Spring Boot", "AWS"],
      matchReason: "Backend expertise",
      avatar: null
    }
  ]

  const activeJobs = [
    {
      id: 1,
      title: "Junior Frontend Developer",
      location: "Milano",
      applications: 12,
      views: 89,
      posted: "3 days ago"
    },
    {
      id: 2,
      title: "Data Analyst Intern",
      location: "Remote",
      applications: 24,
      views: 156,
      posted: "1 week ago"
    }
  ]

  const recentActivity = [
    { text: "Marco Rossi viewed your job posting", time: "2h ago" },
    { text: "New application from Giulia Bianchi", time: "5h ago" },
    { text: "Alessandro Ferrari sent a message", time: "1d ago" }
  ]

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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">847</p>
                <p className="text-sm text-gray-600">Candidates</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{activeJobs.length}</p>
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
                <p className="text-2xl font-bold">36</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">245</p>
                <p className="text-sm text-gray-600">Profile views</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Candidates */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recommended Candidates</CardTitle>
                  <CardDescription>
                    Based on your job postings and search history
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
              {recentCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
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
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {candidate.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-blue-600">{candidate.matchReason}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/recruiter/candidates/${candidate.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              {activeJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/recruiter/jobs/${job.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
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
              ))}

              {activeJobs.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-medium text-gray-900 mb-1">No active job postings</h3>
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
                href="/dashboard/recruiter/saved-candidates"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Saved candidates</p>
                  <p className="text-xs text-gray-500">Review your shortlist</p>
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
                  <p className="text-xs text-gray-500">3 unread</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Company Profile */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">
                Complete your company profile to attract better candidates.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 rounded-full h-2 w-3/5"></div>
                </div>
                <span className="font-medium">60%</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/recruiter/settings">
                  Complete profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
