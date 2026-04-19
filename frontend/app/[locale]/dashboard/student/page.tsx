'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus, ExternalLink, ChevronRight, LogOut,
  Eye, Mail, Briefcase, FolderOpen, BarChart3, Route, MessageSquare, Send,
  Shield, MapPin,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import OnboardingChecklist from '@/components/dashboard/student/OnboardingChecklist'
import { AchievementsPanel } from '@/components/dashboard/student/AchievementsPanel'
import { HiringConfirmationBanner } from '@/components/dashboard/student/HiringConfirmationBanner'
import { PendingVerificationsCard } from '@/components/dashboard/student/PendingVerificationsCard'
import { OnboardingGate } from '@/components/dashboard/student/OnboardingGate'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { DonutChart } from '@/components/dashboard/shared/DonutChart'
// MiniChart available for future use with real trend data
import { ActivityFeed } from '@/components/dashboard/shared/ActivityFeed'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { StaggerContainer, StaggerItem, AnimatedCard } from '@/components/ui/animated-card'
import { signOut } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
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

interface JobRecommendation {
  jobId: string
  title: string
  companyName: string
  location: string | null
  jobType: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const locale = useLocale()
  const t = useTranslations('studentDashboard')
  const ts = useTranslations('shared')
  const user = session?.user
  const [projects, setProjects] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    projectCount: 0, profileViews: 0, unreadMessages: 0, jobMatches: 0, profileCompletion: 0,
  })
  const [recentJobs, setRecentJobs] = useState<JobOpportunity[]>([])
  const [jobRecs, setJobRecs] = useState<JobRecommendation[]>([])
  const [salaryBenchmarks, setSalaryBenchmarks] = useState<any[]>([])
  const [onboarding, setOnboarding] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, projectsResponse, recsResponse, salaryRes] = await Promise.all([
          fetch('/api/dashboard/student/stats'),
          user?.id ? fetch(`/api/projects?userId=${user.id}`) : Promise.resolve(null),
          fetch('/api/dashboard/student/recommendations?limit=5'),
          fetch('/api/dashboard/student/salary-benchmarks'),
        ])
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.stats)
          setRecentJobs(statsData.recentJobs || [])
          if (statsData.onboarding) setOnboarding(statsData.onboarding)
        }
        if (projectsResponse && projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects || [])
        }
        if (recsResponse && recsResponse.ok) {
          const recsData = await recsResponse.json()
          setJobRecs(recsData.recommendations || [])
        }
        if (salaryRes && salaryRes.ok) {
          const salaryData = await salaryRes.json()
          setSalaryBenchmarks((salaryData.benchmarks || []).slice(0, 4))
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
      <div className="max-w-6xl mx-auto pb-8 space-y-6 px-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-12 gap-4">
          <Skeleton className="lg:col-span-8 h-48 rounded-2xl" />
          <Skeleton className="lg:col-span-4 h-48 rounded-2xl" />
        </div>
      </div>
    )
  }

  const projectViews = projects.reduce((sum, p) => sum + (p.views || 0), 0)

  const activityItems = [
    ...(stats.profileViews > 0 ? [{ id: 'v1', type: 'view' as const, text: ts('activity.recruiterViewsThisWeek', { count: stats.profileViews }), time: ts('time.thisWeek') }] : []),
    ...(stats.unreadMessages > 0 ? [{ id: 'm1', type: 'message' as const, text: ts('activity.unreadMessages', { count: stats.unreadMessages }), time: ts('time.recent') }] : []),
    ...(stats.jobMatches > 0 ? [{ id: 'j1', type: 'job' as const, text: ts('activity.newJobMatches', { count: stats.jobMatches }), time: ts('time.thisWeek') }] : []),
    ...projects.slice(0, 3).map((p, i) => ({
      id: `p${i}`, type: 'application' as const, text: ts('activity.projectReceivedViews', { title: p.title, count: p.views || 0 }), time: ts('time.recent'),
    })),
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-8 space-y-5">
      {/* Hero Section */}
      <MetricHero gradient="primary">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('greeting', { name: user?.firstName || '' })}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{t('subtitle')}</p>
            <div className="flex gap-2">
              <Button size="sm" className="shadow-md" asChild>
                <Link href="/dashboard/student/projects/new">
                  <Plus className="h-4 w-4 mr-1" />
                  {t('newProject')}
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="bg-white/60 backdrop-blur-sm" asChild>
                <Link href="/dashboard/student/profile">{t('editProfile')}</Link>
              </Button>
            </div>
          </div>
          {/* Donut: Profile Completion */}
          <div className="flex-shrink-0">
            <DonutChart
              value={stats.profileCompletion}
              size={130}
              strokeWidth={12}
              sublabel={ts('complete')}
            />
          </div>
        </div>
      </MetricHero>

      {/* Onboarding + Hiring */}
      {onboarding && (
        <OnboardingChecklist
          profile={onboarding.profile}
          projectCount={onboarding.projectCount}
          endorsementCount={onboarding.endorsementCount}
          universityVerified={onboarding.universityVerified}
        />
      )}
      <HiringConfirmationBanner />
      <OnboardingGate />
      <PendingVerificationsCard />

      {/* Stat Cards Row */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StaggerItem>
          <StatCard label={t('stats.views')} value={stats.profileViews} icon={<Eye className="h-5 w-5" />} variant="blue" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label={t('stats.messages')} value={stats.unreadMessages} icon={<Mail className="h-5 w-5" />} variant="rose" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label={t('stats.matches')} value={stats.jobMatches} icon={<Briefcase className="h-5 w-5" />} variant="green" />
        </StaggerItem>
      </StaggerContainer>

      {/* Bento Grid: Main Content */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Left: Area Chart + Projects + Jobs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Mini Area Chart Card */}
          <GlassCard delay={0.2} gradient="blue">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('activity.profileViews')}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <AnimatedCounter value={stats.profileViews} className="text-2xl font-bold text-foreground" />
                    <span className="text-xs text-muted-foreground">{t('sections.thisWeek')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('activity.projectViews')}</p>
                  <AnimatedCounter value={projectViews} className="text-2xl font-bold text-foreground" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Projects */}
          <GlassCard delay={0.3} hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">{t('sections.projects')}</h2>
                <Link href="/dashboard/student/projects" className="text-xs text-primary hover:underline font-medium">
                  {t('viewAll')} →
                </Link>
              </div>
              {projects.length > 0 ? (
                <div className="grid gap-3">
                  {projects.slice(0, 4).map((project: any) => (
                    <Link
                      key={project.id}
                      href={`/dashboard/student/projects/${project.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:shadow-md hover:border-primary/20 transition-all group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">{(project.title || 'P')[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">{project.title || t('untitled')}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {project.verificationStatus === 'VERIFIED' && (
                            <Badge className="text-[10px] bg-green-100 text-green-700 border-0 h-4 px-1.5">
                              <Shield className="h-2.5 w-2.5 mr-0.5" />{ts('verified')}
                            </Badge>
                          )}
                          <span className="text-[11px] text-muted-foreground truncate">{project.description || t('noDescription')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                        <Eye className="h-3 w-3" /> {project.views || 0}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Plus className="h-7 w-7 text-primary/60" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{t('empty.noProjects')}</p>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/student/projects/new">
                      <Plus className="h-4 w-4 mr-1" /> {t('empty.addFirst')}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* AI Job Recommendations */}
          <GlassCard delay={0.4} hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">{t('sections.jobMatches')}</h2>
                <Link href="/dashboard/student/jobs" className="text-xs text-primary hover:underline font-medium">
                  {t('browseJobs')} →
                </Link>
              </div>
              {jobRecs.length > 0 ? (
                <div className="space-y-2">
                  {jobRecs.slice(0, 5).map((rec) => (
                    <div key={rec.jobId} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:shadow-md hover:border-primary/20 transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{rec.matchScore}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{rec.title}</p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{rec.companyName}</span>
                          {rec.location && <><span className="text-muted-foreground/30">·</span><span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{rec.location}</span></>}
                        </div>
                        {rec.matchedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.matchedSkills.slice(0, 3).map(s => (
                              <span key={s} className="text-[9px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">{s}</span>
                            ))}
                            {rec.missingSkills.length > 0 && (
                              <span className="text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full">+{rec.missingSkills.length} to learn</span>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-[10px] rounded-full">{rec.jobType.replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              ) : recentJobs.length > 0 ? (
                <div className="space-y-2">
                  {recentJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:shadow-md hover:border-primary/20 transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2Icon className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{job.title}</p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{job.company}</span>
                          {job.location && <><span className="text-muted-foreground/30">·</span><span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{job.location}</span></>}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] rounded-full">{job.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">{t('empty.noMatches')}</div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Activity Feed */}
          <GlassCard delay={0.3}>
            <div className="p-4">
              <ActivityFeed
                items={activityItems}
                title={t('sections.thisWeek')}
                emptyText={ts('noActivityYet')}
                maxHeight={260}
              />
            </div>
          </GlassCard>

          {/* International Salary Benchmarks */}
          {salaryBenchmarks.length > 0 && (
            <GlassCard delay={0.35} gradient="blue">
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3">{t('sections.salaryAbroad')}</h3>
                <div className="space-y-2">
                  {salaryBenchmarks.map((b: any) => (
                    <div key={b.country} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{b.country}</span>
                      <div className="text-right">
                        <span className="font-semibold text-foreground">
                          {b.currency === 'GBP' ? '£' : b.currency === 'CHF' ? 'CHF ' : '€'}{(b.estimatedSalary / 1000).toFixed(0)}K
                        </span>
                        <span className="text-muted-foreground ml-1">/{t('sections.year')}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">{t('sections.salaryNote')}</p>
              </div>
            </GlassCard>
          )}

          {/* Quick Actions Grid */}
          <GlassCard delay={0.4}>
            <div className="p-3">
              <div className="grid grid-cols-3 gap-1">
                {[
                  { href: '/dashboard/student/messages' as const, icon: MessageSquare, label: t('links.messages'), badge: stats.unreadMessages },
                  { href: '/dashboard/student/applications' as const, icon: Send, label: t('links.applications') },
                  { href: '/dashboard/student/analytics' as const, icon: BarChart3, label: t('links.analytics') },
                  { href: '/dashboard/student/skill-path' as const, icon: Route, label: t('links.skillPath') },
                  { href: '/dashboard/student/cv' as const, icon: FolderOpen, label: 'CV' },
                  { href: `/students/${(user as any)?.username || user?.id}/public` as any, icon: ExternalLink, label: t('links.publicProfile') },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    className="relative flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-primary/5 transition-colors text-center group">
                    <div className="p-2 rounded-lg bg-muted/80 group-hover:bg-primary/10 transition-colors">
                      <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{item.label}</span>
                    {item.badge ? (
                      <Badge variant="destructive" className="absolute -top-0.5 -right-0.5 text-[9px] h-4 px-1 min-w-4">{item.badge}</Badge>
                    ) : null}
                  </Link>
                ))}
              </div>
              <div className="border-t mt-2 pt-2">
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="flex items-center justify-center gap-1.5 w-full p-2 rounded-xl hover:bg-red-50 transition-colors group"
                >
                  <LogOut className="h-3.5 w-3.5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                  <span className="text-xs text-muted-foreground group-hover:text-red-600 transition-colors">{t('links.signOut')}</span>
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Achievements */}
          <AnimatedCard delay={0.5} hover={false}>
            <AchievementsPanel />
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}

// Inline building icon to avoid adding to imports (Briefcase already used for jobs)
function Building2Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
    </svg>
  )
}
