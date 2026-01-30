'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Link } from '@/navigation'
import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  TrendingUp,
  Plus,
  Settings,
  ChevronRight,
  Eye,
  Award,
  Upload,
  BarChart3
} from 'lucide-react'

export default function UniversityDashboard() {
  const { data: session } = useSession()
  const user = session?.user
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Sample data - would come from API
  const stats = {
    totalStudents: 156,
    verifiedStudents: 89,
    activeProfiles: 134,
    recruiterViews: 1247
  }

  const recentStudents = [
    {
      id: 1,
      name: "Marco Rossi",
      course: "Computer Science",
      year: "3rd Year",
      projects: 4,
      verified: true
    },
    {
      id: 2,
      name: "Giulia Bianchi",
      course: "Data Science",
      year: "2nd Year",
      projects: 3,
      verified: true
    },
    {
      id: 3,
      name: "Alessandro Ferrari",
      course: "Software Engineering",
      year: "3rd Year",
      projects: 5,
      verified: false
    }
  ]

  const topRecruiters = [
    { name: "TechStart Milano", views: 45, contacts: 12 },
    { name: "Fintech Solutions", views: 38, contacts: 8 },
    { name: "Digital Agency", views: 29, contacts: 6 }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">🎓</div>
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
            University Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your students and track placements
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/university/students/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Students
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/university/students">
              <Users className="h-4 w-4 mr-2" />
              View All
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
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-sm text-gray-600">Total students</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.verifiedStudents}</p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.activeProfiles}</p>
                <p className="text-sm text-gray-600">Active profiles</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.recruiterViews}</p>
                <p className="text-sm text-gray-600">Recruiter views</p>
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
          {/* Recent Students */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Students</CardTitle>
                  <CardDescription>
                    Students enrolled on the platform
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/university/students">
                    View all
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{student.name}</p>
                      {student.verified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {student.course} · {student.year}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">{student.projects} projects</p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bulk Import */}
          <Card className="border-dashed">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Import students in bulk
                </h3>
                <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                  Upload a CSV file with student emails to invite them to the platform
                </p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/university/students/import">
                    Import CSV
                  </Link>
                </Button>
              </div>
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
                href="/dashboard/university/students/add"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Add students</p>
                  <p className="text-xs text-gray-500">Invite new students</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/university/analytics"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Analytics</p>
                  <p className="text-xs text-gray-500">View placement stats</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/university/recruiters"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Recruiters</p>
                  <p className="text-xs text-gray-500">Companies recruiting</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/university/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Settings</p>
                  <p className="text-xs text-gray-500">University profile</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </CardContent>
          </Card>

          {/* Top Recruiters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Active recruiters</CardTitle>
              <CardDescription>
                Companies viewing your students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topRecruiters.map((recruiter, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{recruiter.name}</p>
                    <p className="text-xs text-gray-500">{recruiter.contacts} contacts made</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{recruiter.views}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Verification Progress */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Verification progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students verified</span>
                  <span className="font-medium">{stats.verifiedStudents}/{stats.totalStudents}</span>
                </div>
                <Progress value={(stats.verifiedStudents / stats.totalStudents) * 100} className="h-2" />
                <p className="text-xs text-gray-500">
                  {Math.round((stats.verifiedStudents / stats.totalStudents) * 100)}% of students have verified profiles
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
