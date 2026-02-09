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
  Plus,
  Settings,
  ChevronRight,
  Eye,
  Award,
  Upload,
  BarChart3,
  BookOpen,
  RefreshCw,
  LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLocale } from 'next-intl'

interface UniversityStats {
  totalStudents: number
  verifiedStudents: number
  activeProfiles: number
  recruiterViews: number
}

interface Student {
  id: string
  name: string
  initials: string
  course: string
  year: string
  projects: number
  verified: boolean
  photo: string | null
}

interface Recruiter {
  name: string
  views: number
  contacts: number
}

export default function UniversityDashboard() {
  const { data: session } = useSession()
  const locale = useLocale()
  const user = session?.user
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UniversityStats>({
    totalStudents: 0,
    verifiedStudents: 0,
    activeProfiles: 0,
    recruiterViews: 0
  })
  const [recentStudents, setRecentStudents] = useState<Student[]>([])
  const [topRecruiters, setTopRecruiters] = useState<Recruiter[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/university/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setRecentStudents(data.recentStudents || [])
          setTopRecruiters(data.topRecruiters || [])
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
          <div className="animate-pulse text-4xl mb-4">🎓</div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const verificationPercentage = stats.totalStudents > 0
    ? Math.round((stats.verifiedStudents / stats.totalStudents) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Welcome Banner - Show when few students */}
      {stats.totalStudents < 10 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">
                Welcome to InTransparency!
              </h2>
              <p className="text-indigo-100">
                Your students are now discoverable by 500+ companies. Import your student list to boost placements by up to 25%.
              </p>
            </div>
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 shrink-0" asChild>
              <Link href="/dashboard/university/students/import">
                <Upload className="h-4 w-4 mr-2" />
                Import Students
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Success Metrics Banner - Show when there's activity */}
      {stats.recruiterViews > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">
                {stats.recruiterViews} companies viewed your students this month
              </p>
              <p className="text-sm text-green-700">
                Students with complete profiles get 3x more views
              </p>
            </div>
          </div>
        </div>
      )}

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
              {recentStudents.length > 0 ? (
                recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                        {student.initials}
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
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">No students yet</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Import or add students to get started
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/university/students/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Students
                    </Link>
                  </Button>
                </div>
              )}
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
                href="/dashboard/university/courses"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <BookOpen className="h-4 w-4 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Courses</p>
                  <p className="text-xs text-gray-500">Manage course catalog</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/university/alumni"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-orange-100 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Alumni</p>
                  <p className="text-xs text-gray-500">Track post-graduation outcomes</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/university/sync"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-teal-100 rounded-lg">
                  <RefreshCw className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Data Sync</p>
                  <p className="text-xs text-gray-500">Sync university systems</p>
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

              <div className="border-t my-1" />
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
              >
                <div className="p-2 bg-red-50 rounded-lg">
                  <LogOut className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-sm font-medium text-red-600">Sign out</p>
              </button>
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
              {topRecruiters.length > 0 ? (
                topRecruiters.map((recruiter, index) => (
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
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recruiter activity yet
                </p>
              )}
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
                <Progress value={verificationPercentage} className="h-2" />
                <p className="text-xs text-gray-500">
                  {verificationPercentage}% of students have verified profiles
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
