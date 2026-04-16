'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Link } from '@/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users, Plus, ChevronRight, Upload, TrendingUp, LogOut,
  GraduationCap, Eye, Shield, BarChart3, BookOpen, UserPlus,
  Building2, RefreshCw, Settings, Award, Zap, Bell,
  FileText, Brain, FolderOpen,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import PlacementProbabilityBadge from '@/components/predictions/PlacementProbabilityBadge'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { DonutChart } from '@/components/dashboard/shared/DonutChart'
// MiniChart available for future use with real trend data
import { ActivityFeed } from '@/components/dashboard/shared/ActivityFeed'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { StaggerContainer, StaggerItem, AnimatedCard } from '@/components/ui/animated-card'

interface UniversityStats {
  totalStudents: number; verifiedStudents: number; activeProfiles: number; recruiterViews: number
}

interface Student {
  id: string; name: string; initials: string; course: string
  year: string; projects: number; verified: boolean; photo: string | null
}

interface Recruiter { name: string; views: number; contacts: number }

interface Activation {
  activationRate: number
  profileCompletionRate: number
  withProjects: number
  withMultipleProjects: number
  withBio: number
  withSkills: number
}

interface EngagementAlert {
  company: string
  views: number
  contacts: number
  hires: number
  uniqueStudents: number
  degrees: string[]
  engagement: number
}

interface EngagementData {
  alerts: EngagementAlert[]
  summary: { totalViews: number; totalContacts: number; activeCompanies: number }
}

export default function UniversityDashboard() {
  const { data: session } = useSession()
  const locale = useLocale()
  const t = useTranslations('universityDashboard.main')
  const ts = useTranslations('shared')
  const user = session?.user
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UniversityStats>({
    totalStudents: 0, verifiedStudents: 0, activeProfiles: 0, recruiterViews: 0,
  })
  const [recentStudents, setRecentStudents] = useState<Student[]>([])
  const [topRecruiters, setTopRecruiters] = useState<Recruiter[]>([])
  const [activation, setActivation] = useState<Activation>({
    activationRate: 0, profileCompletionRate: 0, withProjects: 0,
    withMultipleProjects: 0, withBio: 0, withSkills: 0,
  })
  const [engagementData, setEngagementData] = useState<EngagementData>({
    alerts: [], summary: { totalViews: 0, totalContacts: 0, activeCompanies: 0 },
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          fetch('/api/dashboard/university/stats'),
          fetch('/api/dashboard/university/engagement-alerts'),
        ])
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data.stats)
          setRecentStudents(data.recentStudents || [])
          setTopRecruiters(data.topRecruiters || [])
          if (data.activation) setActivation(data.activation)
        }
        if (alertsRes.ok) {
          const data = await alertsRes.json()
          setEngagementData(data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchDashboardData()
    else setLoading(false)
  }, [user])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-12 px-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-12 gap-4">
          <Skeleton className="lg:col-span-8 h-64 rounded-2xl" />
          <Skeleton className="lg:col-span-4 h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  const verificationPct = stats.totalStudents > 0
    ? Math.round((stats.verifiedStudents / stats.totalStudents) * 100) : 0

  const activityItems = [
    ...(stats.recruiterViews > 0 ? [{ id: 'rv', type: 'view' as const, text: ts('activity.recruiterProfileViews', { count: stats.recruiterViews }), time: ts('time.last30Days') }] : []),
    ...(stats.verifiedStudents > 0 ? [{ id: 'vs', type: 'verification' as const, text: ts('activity.studentsVerified', { count: stats.verifiedStudents }), time: ts('time.total') }] : []),
    ...(stats.activeProfiles > 0 ? [{ id: 'ap', type: 'application' as const, text: ts('activity.activeStudentProfiles', { count: stats.activeProfiles }), time: ts('time.active') }] : []),
    ...topRecruiters.slice(0, 3).map((r, i) => ({
      id: `r${i}`, type: 'contact' as const, text: ts('activity.recruiterActivity', { name: r.name, contacts: r.contacts, views: r.views }), time: ts('time.active'),
    })),
  ]

  const isNewInstitution = stats.totalStudents < 10

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-12 px-4">
      {/* Hero */}
      <MetricHero gradient={isNewInstitution ? 'dark' : 'green'}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            {isNewInstitution ? (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{t('welcomeTitle')}</h1>
                <p className="text-white/70 mt-1 mb-4">{t('welcomeSubtitle')}</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{t('subtitle')}</p>
              </>
            )}
            <div className="flex gap-3">
              <Button className={isNewInstitution ? 'bg-white text-slate-900 hover:bg-white/90 shadow-lg' : 'shadow-md'} asChild>
                <Link href="/dashboard/university/students/import">
                  <Upload className="h-4 w-4 mr-2" /> {t('importStudents')}
                </Link>
              </Button>
              <Button variant="outline" className={isNewInstitution ? 'border-white/30 text-white hover:bg-white/10' : 'bg-white/60 backdrop-blur-sm'} asChild>
                <Link href="/dashboard/university/students/add">
                  <Plus className="h-4 w-4 mr-2" /> {t('addStudents')}
                </Link>
              </Button>
            </div>
          </div>
          {/* Verification Donut */}
          <div className="flex-shrink-0">
            <DonutChart
              value={verificationPct}
              size={130}
              strokeWidth={12}
              color={isNewInstitution ? '#34d399' : '#16a34a'}
              trackColor={isNewInstitution ? 'rgba(255,255,255,0.2)' : 'hsl(var(--muted))'}
              sublabel={t('verified')}
            />
          </div>
        </div>
      </MetricHero>

      {/* Activity Banner */}
      {stats.recruiterViews > 0 && !isNewInstitution && (
        <GlassCard delay={0.1} gradient="green" hover={false}>
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600"><Eye className="h-4 w-4" /></div>
            <div>
              <p className="font-medium text-foreground text-sm">{t('companiesViewed', { count: stats.recruiterViews })}</p>
              <p className="text-xs text-muted-foreground">{t('completeProfilesTip')}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Engagement Alerts */}
      {engagementData.alerts.length > 0 && !isNewInstitution && (
        <GlassCard delay={0.12} gradient="amber" hover={false}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600"><Bell className="h-4 w-4" /></div>
              <div>
                <p className="font-medium text-foreground text-sm">{t('engagementAlerts')}</p>
                <p className="text-xs text-muted-foreground">{t('engagementAlertsDescription')}</p>
              </div>
              <div className="ml-auto flex gap-3 text-xs text-muted-foreground">
                <span>{engagementData.summary.activeCompanies} {t('activeCompanies').toLowerCase()}</span>
                <span>{engagementData.summary.totalViews} {t('weeklyViews').toLowerCase()}</span>
              </div>
            </div>
            <div className="space-y-2">
              {engagementData.alerts.slice(0, 4).map((alert) => (
                <div key={alert.company} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{alert.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.views > 0 && <span>{alert.views} views</span>}
                      {alert.contacts > 0 && <span> · {alert.contacts} contacts</span>}
                      {alert.hires > 0 && <span> · {alert.hires} hires</span>}
                      {' · '}{alert.uniqueStudents} students
                    </p>
                  </div>
                  {alert.degrees.length > 0 && (
                    <div className="flex gap-1">
                      {alert.degrees.slice(0, 2).map((d) => (
                        <Badge key={d} variant="outline" className="text-[10px] h-5">{d}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Stat Cards */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem><StatCard label={t('totalStudents')} value={stats.totalStudents} icon={<GraduationCap className="h-5 w-5" />} variant="blue" /></StaggerItem>
        <StaggerItem><StatCard label={t('verified')} value={stats.verifiedStudents} icon={<Shield className="h-5 w-5" />} variant="green" /></StaggerItem>
        <StaggerItem><StatCard label={t('activeProfiles')} value={stats.activeProfiles} icon={<Users className="h-5 w-5" />} variant="purple" /></StaggerItem>
        <StaggerItem><StatCard label={t('recruiterViews')} value={stats.recruiterViews} icon={<Eye className="h-5 w-5" />} variant="amber" /></StaggerItem>
      </StaggerContainer>

      {/* Bento Grid */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Left (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Recruiter Views Trend */}
          <GlassCard delay={0.2} gradient="blue">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('recruiterViews')}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <AnimatedCounter value={stats.recruiterViews} className="text-2xl font-bold text-foreground" />
                    <span className="text-xs text-muted-foreground">last 30 days</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('activeProfiles')}</p>
                  <AnimatedCounter value={stats.activeProfiles} className="text-2xl font-bold text-foreground" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Student Activation Metrics */}
          <GlassCard delay={0.25} gradient="green">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('studentActivation')}</h3>
                  <p className="text-[11px] text-muted-foreground">{t('activationDescription')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">{activation.activationRate}%</p>
                  <p className="text-xs text-muted-foreground">{t('activationRate')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activation.profileCompletionRate}%</p>
                  <p className="text-xs text-muted-foreground">{t('profileCompletion')}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: t('withProjects'), value: activation.withProjects, total: stats.totalStudents, icon: FolderOpen },
                  { label: t('withMultipleProjects'), value: activation.withMultipleProjects, total: stats.totalStudents, icon: FolderOpen },
                  { label: t('withBio'), value: activation.withBio, total: stats.totalStudents, icon: FileText },
                  { label: t('withSkills'), value: activation.withSkills, total: stats.totalStudents, icon: Brain },
                ].map((item) => {
                  const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">{item.value}/{item.total} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </GlassCard>

          {/* Recent Students */}
          <GlassCard delay={0.3} hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">{t('recentStudents')}</h2>
                <Link href="/dashboard/university/students" className="text-xs text-primary hover:underline font-medium">{t('viewAll')} →</Link>
              </div>
              {recentStudents.length > 0 ? (
                <div className="space-y-2">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:shadow-md hover:border-primary/20 transition-all group">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-sm font-semibold">{student.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                          {student.verified && <Badge className="text-[10px] bg-green-100 text-green-700 border-0 h-4 px-1.5"><Shield className="h-2.5 w-2.5 mr-0.5" />{t('verified')}</Badge>}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{student.course} · {student.year}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs rounded-full">{student.projects} {t('projects')}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-7 w-7 text-primary/60" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{t('noStudentsYet')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t('importOrAdd')}</p>
                  <Button asChild><Link href="/dashboard/university/students/add"><Plus className="h-4 w-4 mr-2" />{t('addStudents')}</Link></Button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Placement Candidates */}
          {recentStudents.length > 0 && (
            <GlassCard delay={0.4} hover={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-green-100"><TrendingUp className="h-4 w-4 text-green-600" /></div>
                  <h2 className="font-semibold text-foreground">{t('topPlacementCandidates')}</h2>
                </div>
                <div className="space-y-2">
                  {recentStudents.slice(0, 5).map((student) => (
                    <div key={`pred-${student.id}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:shadow-sm transition-all">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-xs font-semibold">{student.initials}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium text-foreground flex-1 truncate">{student.name}</p>
                      <PlacementProbabilityBadge studentId={student.id} compact />
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Top Recruiters Bar Chart */}
          {topRecruiters.length > 0 && (
            <GlassCard delay={0.5} gradient="purple">
              <div className="p-5">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">{t('activeRecruiters')}</h3>
                <div className="space-y-2.5">
                  {topRecruiters.map((r, i) => {
                    const maxViews = Math.max(1, ...topRecruiters.map(x => x.views))
                    const pct = Math.round((r.views / maxViews) * 100)
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-foreground truncate">{r.name}</p>
                            <span className="text-xs text-muted-foreground">{r.views} views · {r.contacts} contacts</span>
                          </div>
                          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Bulk Import */}
          <GlassCard delay={0.5} hover={false}>
            <div className="p-6 text-center">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{t('importBulk')}</h3>
              <p className="text-xs text-muted-foreground mb-3 max-w-sm mx-auto">{t('importBulkDescription')}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/university/students/import">{t('importCsv')}</Link>
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Right sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Activity Feed */}
          <GlassCard delay={0.3}>
            <div className="p-4">
              <ActivityFeed items={activityItems} title={t('recentActivity') || 'Recent Activity'} maxHeight={300} />
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard delay={0.4}>
            <div className="p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-2">{t('quickActions')}</p>
              {[
                { href: '/dashboard/university/students/add' as const, icon: UserPlus, label: t('addStudents') },
                { href: '/dashboard/university/analytics' as const, icon: BarChart3, label: t('analytics') },
                { href: '/dashboard/university/recruiters' as const, icon: Building2, label: t('recruiters') },
                { href: '/dashboard/university/courses' as const, icon: BookOpen, label: t('courses') },
                { href: '/dashboard/university/alumni' as const, icon: Award, label: t('alumni') },
                { href: '/dashboard/university/documents' as const, icon: FileText, label: t('documents') },
                { href: '/dashboard/university/sync' as const, icon: RefreshCw, label: t('dataSync') },
                { href: '/dashboard/university/settings' as const, icon: Settings, label: t('settings') },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 transition-colors group">
                  <div className="p-2 rounded-lg bg-muted/80 group-hover:bg-primary/10 transition-colors">
                    <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 ml-auto group-hover:text-primary transition-colors" />
                </Link>
              ))}
              <div className="border-t mx-2 my-2" />
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 transition-colors w-full text-left group">
                <div className="p-2 rounded-lg bg-muted/80 group-hover:bg-red-100 transition-colors">
                  <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-red-600 transition-colors">{t('signOut')}</span>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
