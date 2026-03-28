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
  LogOut,
  TrendingUp
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import PlacementProbabilityBadge from '@/components/predictions/PlacementProbabilityBadge'

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
  const t = useTranslations('universityDashboard.main')
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
          <p className="text-gray-500">{t('loading')}</p>
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
        <div className="bg-primary rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">
                {t('welcomeTitle')}
              </h2>
              <p className="text-white/80">
                {t('welcomeSubtitle')}
              </p>
            </div>
            <Button className="bg-white text-primary hover:bg-white/90 shrink-0" asChild>
              <Link href="/dashboard/university/students/import">
                <Upload className="h-4 w-4 mr-2" />
                {t('importStudents')}
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Success Metrics Banner - Show when there's activity */}
      {stats.recruiterViews > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {t('companiesViewed', { count: stats.recruiterViews })}
              </p>
              <p className="text-sm text-gray-700">
                {t('completeProfilesTip')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/university/students/add">
              <Plus className="h-4 w-4 mr-2" />
              {t('addStudents')}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/university/students">
              <Users className="h-4 w-4 mr-2" />
              {t('viewAll')}
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
                <p className="text-sm text-gray-600">{t('totalStudents')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.verifiedStudents}</p>
                <p className="text-sm text-gray-600">{t('verified')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.activeProfiles}</p>
                <p className="text-sm text-gray-600">{t('activeProfiles')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.recruiterViews}</p>
                <p className="text-sm text-gray-600">{t('recruiterViews')}</p>
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
                  <CardTitle className="text-lg">{t('recentStudents')}</CardTitle>
                  <CardDescription>
                    {t('studentsEnrolled')}
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/university/students">
                    {t('viewAll')}
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
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {student.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        {student.verified && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {t('verified')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {student.course} · {student.year}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">{student.projects} {t('projects')}</p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">{t('noStudentsYet')}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('importOrAdd')}
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/university/students/add">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('addStudents')}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Placement Candidates */}
          {recentStudents.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      {t('topPlacementCandidates')}
                    </CardTitle>
                    <CardDescription>
                      {t('topPlacementDescription')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentStudents.slice(0, 5).map((student) => (
                  <div
                    key={`prediction-${student.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {student.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                    </div>
                    <PlacementProbabilityBadge studentId={student.id} compact />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Bulk Import */}
          <Card className="border-dashed">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {t('importBulk')}
                </h3>
                <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                  {t('importBulkDescription')}
                </p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/university/students/import">
                    {t('importCsv')}
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
              <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/dashboard/university/students/add"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('addStudents')}</p>
                  <p className="text-xs text-gray-500">{t('inviteNewStudents')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/university/analytics"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('analytics')}</p>
                  <p className="text-xs text-gray-500">{t('viewPlacementStats')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/university/recruiters"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('recruiters')}</p>
                  <p className="text-xs text-gray-500">{t('companiesRecruiting')}</p>
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
                  <p className="text-sm font-medium">{t('courses')}</p>
                  <p className="text-xs text-gray-500">{t('manageCourseCatalog')}</p>
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
                  <p className="text-sm font-medium">{t('alumni')}</p>
                  <p className="text-xs text-gray-500">{t('trackPostGraduation')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/university/sync"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RefreshCw className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('dataSync')}</p>
                  <p className="text-xs text-gray-500">{t('syncUniversitySystems')}</p>
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
                  <p className="text-sm font-medium">{t('settings')}</p>
                  <p className="text-xs text-gray-500">{t('universityProfile')}</p>
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
                <p className="text-sm font-medium text-red-600">{t('signOut')}</p>
              </button>
            </CardContent>
          </Card>

          {/* Top Recruiters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('activeRecruiters')}</CardTitle>
              <CardDescription>
                {t('companiesViewingStudents')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topRecruiters.length > 0 ? (
                topRecruiters.map((recruiter, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{recruiter.name}</p>
                      <p className="text-xs text-gray-500">{recruiter.contacts} {t('contactsMade')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{recruiter.views}</p>
                      <p className="text-xs text-gray-500">{t('views')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  {t('noRecruiterActivity')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Verification Progress */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('verificationProgress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('studentsVerified')}</span>
                  <span className="font-medium">{stats.verifiedStudents}/{stats.totalStudents}</span>
                </div>
                <Progress value={verificationPercentage} className="h-2" />
                <p className="text-xs text-gray-500">
                  {t('verificationPercent', { percentage: verificationPercentage })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
