'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
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
  LogOut,
  Loader2,
  Lightbulb
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
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
  username: string | null
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
  const t = useTranslations('recruiterDashboard.dashboard')
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
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div>
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-40 mb-1" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t('greeting')}{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/recruiter/candidates">
              <Search className="h-4 w-4 mr-2" />
              {t('searchCandidates')}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/recruiter/post-job">
              <Plus className="h-4 w-4 mr-2" />
              {t('postJob')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Contact Credits Card */}
      {stats.contactUsage && (
        <Card className={`border-2 ${
          stats.contactUsage.limit === 0
            ? 'border-border bg-muted'
            : stats.contactUsage.remaining <= 10 && stats.contactUsage.limit !== -1
              ? 'border-amber-200 bg-amber-50'
              : 'border-primary/20 bg-primary/5'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{t('contactCredits.title')}</h3>
                </div>
                {stats.contactUsage.limit === -1 ? (
                  <p className="text-sm text-muted-foreground">{t('contactCredits.unlimited')}</p>
                ) : stats.contactUsage.limit === 0 ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">{t('contactCredits.upgradeDescription')}</p>
                    <Button size="sm" asChild>
                      <Link href="/pricing?for=recruiters">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {t('contactCredits.upgradePlan')}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t('contactCredits.used', { used: stats.contactUsage.used, limit: stats.contactUsage.limit })}
                      </span>
                      <span className={`font-medium ${
                        stats.contactUsage.remaining <= 10 ? 'text-amber-600' : 'text-primary'
                      }`}>
                        {t('contactCredits.remaining', { count: stats.contactUsage.remaining })}
                      </span>
                    </div>
                    <Progress
                      value={(stats.contactUsage.used / stats.contactUsage.limit) * 100}
                      className="h-2"
                    />
                    {stats.contactUsage.remaining <= 10 && (
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-xs text-amber-600">{t('contactCredits.runningLow')}</p>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/pricing?for=recruiters">
                            {t('contactCredits.upgrade')}
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
                <p className="text-sm text-muted-foreground">{t('stats.activeJobs')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalApplications}</p>
                <p className="text-sm text-muted-foreground">{t('stats.applications')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.pendingReview}</p>
                <p className="text-sm text-muted-foreground">{t('stats.toReview')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.shortlisted}</p>
                <p className="text-sm text-muted-foreground">{t('stats.shortlisted')}</p>
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
                  <CardTitle className="text-lg">{t('topCandidates.title')}</CardTitle>
                  <CardDescription>
                    {t('topCandidates.description')}
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/recruiter/candidates">
                    {t('topCandidates.viewAll')}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCandidates.length > 0 ? (
                topCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary/20 hover:bg-primary/5 transition-all"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.photo || undefined} />
                      <AvatarFallback className="bg-primary text-white">
                        {candidate.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{candidate.name}</h4>
                        <Button size="sm" variant="ghost" className="text-muted-foreground/60 hover:text-primary">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {candidate.university}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {t('topCandidates.projects', { count: candidate.projectCount })}
                        </Badge>
                        {candidate.discipline && (
                          <Badge variant="outline" className="text-xs">
                            {candidate.discipline}
                          </Badge>
                        )}
                        {candidate.score > 0 && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {t('topCandidates.score', { score: candidate.score })}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {candidate.topProject && (
                          <p className="text-xs text-primary truncate max-w-[200px]">
                            {t('topCandidates.topProject', { name: candidate.topProject })}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            {t('topCandidates.message')}
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/students/${candidate.username || candidate.id}/public`}>
                              {t('topCandidates.viewProfile')}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
                  <h3 className="font-medium text-foreground mb-1">{t('topCandidates.empty')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('topCandidates.emptyDescription')}
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/recruiter/candidates">
                      <Search className="h-4 w-4 mr-2" />
                      {t('searchCandidates')}
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
                  <CardTitle className="text-lg">{t('jobPostings.title')}</CardTitle>
                  <CardDescription>
                    {t('jobPostings.description')}
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/recruiter/jobs">
                    {t('jobPostings.manage')}
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
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{job.title}</h4>
                          <Badge
                            variant={job.status === 'ACTIVE' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {job.posted}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-center">
                        <div>
                          <p className="text-lg font-semibold text-foreground">{job.applications}</p>
                          <p className="text-xs text-muted-foreground">{t('jobPostings.applications')}</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">{job.views}</p>
                          <p className="text-xs text-muted-foreground">{t('jobPostings.views')}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-medium text-foreground mb-1">{t('jobPostings.empty')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('jobPostings.emptyDescription')}
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/recruiter/post-job">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('jobPostings.postJob')}
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
              <CardTitle className="text-lg">{t('quickActions.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/dashboard/recruiter/candidates"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('quickActions.searchCandidates')}</p>
                  <p className="text-xs text-muted-foreground">{t('quickActions.searchCandidatesDesc')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              </Link>

              <Link
                href="/dashboard/recruiter/post-job"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('quickActions.postJob')}</p>
                  <p className="text-xs text-muted-foreground">{t('quickActions.postJobDesc')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              </Link>

              <Link
                href="/dashboard/recruiter/messages"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('quickActions.messages')}</p>
                  <p className="text-xs text-muted-foreground">{t('quickActions.messagesDesc')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              </Link>

              <Link
                href="/dashboard/recruiter/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('quickActions.companySettings')}</p>
                  <p className="text-xs text-muted-foreground">{t('quickActions.companySettingsDesc')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              </Link>
            </CardContent>
          </Card>

          {/* This Week Summary */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('thisWeek.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('thisWeek.newApplications')}</span>
                <span className="font-semibold">{stats.newApplicationsThisWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('thisWeek.interviewsScheduled')}</span>
                <span className="font-semibold">{stats.interviewsScheduled}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('thisWeek.pendingReview')}</span>
                <span className="font-semibold text-orange-600">{stats.pendingReview}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-muted/50 to-slate-100 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                {t('recruitingTip.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {t('recruitingTip.text')}
              </p>
            </CardContent>
          </Card>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left border"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">{t('signOut')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
