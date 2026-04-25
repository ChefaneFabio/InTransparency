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
  Users, Search, MessageSquare, Plus, ChevronRight, Clock,
  GraduationCap, Star, Mail, TrendingUp, LogOut, Briefcase,
  FileText, Settings, Eye, ShieldCheck, Target, Sparkles,
  Flame, BarChart3,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { DonutChart } from '@/components/dashboard/shared/DonutChart'
// MiniChart available for future use with real trend data
import { ActivityFeed } from '@/components/dashboard/shared/ActivityFeed'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { StaggerContainer, StaggerItem, AnimatedCard } from '@/components/ui/animated-card'
import { RecruiterActionCenter } from '@/components/dashboard/recruiter/RecruiterActionCenter'
import PendingEnrichmentDrainer from '@/components/dashboard/recruiter/PendingEnrichmentDrainer'
import RecruiterOnboardingGate from '@/components/dashboard/recruiter/RecruiterOnboardingGate'

interface ContactUsage { used: number; limit: number; remaining: number }

interface RecruiterStats {
  activeJobs: number; totalApplications: number; newApplicationsThisWeek: number
  pendingReview: number; shortlisted: number; interviewsScheduled: number
  contactUsage?: ContactUsage
}

interface Candidate {
  id: string; username: string | null; name: string; initials: string
  university: string; degree: string; photo: string | null
  projectCount: number; topProject: string | null; discipline: string | null; score: number
}

interface JobPosting {
  id: string; title: string; status: string; applications: number; views: number; posted: string
}

export default function RecruiterDashboard() {
  const { data: session } = useSession()
  const locale = useLocale()
  const t = useTranslations('recruiterDashboard.dashboard')
  const ts = useTranslations('shared')
  const user = session?.user
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<RecruiterStats>({
    activeJobs: 0, totalApplications: 0, newApplicationsThisWeek: 0,
    pendingReview: 0, shortlisted: 0, interviewsScheduled: 0,
    contactUsage: { used: 0, limit: 0, remaining: 0 },
  })
  const [topCandidates, setTopCandidates] = useState<Candidate[]>([])
  const [myJobs, setMyJobs] = useState<JobPosting[]>([])
  const [talentRecs, setTalentRecs] = useState<Array<{
    studentId: string; firstName: string | null; lastName: string | null
    university: string | null; photo: string | null; matchScore: number
    matchedSkills: string[]; projectCount: number; verified: boolean
  }>>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recsRes] = await Promise.all([
          fetch('/api/dashboard/recruiter/stats'),
          fetch('/api/dashboard/recruiter/recommendations?limit=5'),
        ])
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data.stats)
          setTopCandidates(data.topCandidates || [])
          setMyJobs(data.myJobs || [])
        }
        if (recsRes.ok) {
          const recsData = await recsRes.json()
          setTalentRecs(recsData.recommendations || [])
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

  const cu = stats.contactUsage
  const creditPct = cu && cu.limit > 0 && cu.limit !== -1 ? Math.round((cu.used / cu.limit) * 100) : 0

  // Activity feed — rotate the per-candidate time labels so rows aren't
  // all tagged "Miglior match" (which looked robotic in the UI).
  const candidateTimeLabels = locale === 'it'
    ? ['Nuovo', 'Ben allineato', 'Da valutare']
    : ['Just matched', 'Strong fit', 'Worth a look']
  const activityItems = [
    ...(stats.newApplicationsThisWeek > 0 ? [{ id: 'a1', type: 'application' as const, text: ts('activity.newApplicationsThisWeek', { count: stats.newApplicationsThisWeek }), time: ts('time.thisWeek') }] : []),
    ...(stats.interviewsScheduled > 0 ? [{ id: 'i1', type: 'hire' as const, text: ts('activity.interviewsScheduled', { count: stats.interviewsScheduled }), time: ts('time.upcoming') }] : []),
    ...(stats.pendingReview > 0 ? [{ id: 'p1', type: 'view' as const, text: ts('activity.applicationsPendingReview', { count: stats.pendingReview }), time: ts('time.actionNeeded') }] : []),
    ...topCandidates.slice(0, 3).map((c, i) => ({
      id: `c${i}`,
      type: 'contact' as const,
      text: ts('activity.topCandidate', { name: c.name, projects: c.projectCount, university: c.university }),
      time: candidateTimeLabels[i] ?? candidateTimeLabels[0],
    })),
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-12 px-4">
      {/* Drains the domain-enrichment that was pre-fetched at signup time */}
      <PendingEnrichmentDrainer />

      {/* Conversational onboarding for first-time recruiters (auto-mounts
          only when RecruiterSettings.companyName is empty). */}
      <RecruiterOnboardingGate />

      {/* Action Center — "what needs my attention today" */}
      <RecruiterActionCenter />

      {/* Hero */}
      <MetricHero gradient="company">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('greeting')}{user?.firstName ? `, ${user.firstName}` : ''}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{t('subtitle')}</p>
            <div className="flex gap-3">
              <Button className="shadow-md" asChild>
                <Link href="/dashboard/recruiter/candidates">
                  <Search className="h-4 w-4 mr-2" /> {t('searchCandidates')}
                </Link>
              </Button>
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm" asChild>
                <Link href="/dashboard/recruiter/jobs/new">
                  <Plus className="h-4 w-4 mr-2" /> {t('postJob')}
                </Link>
              </Button>
            </div>
          </div>
          {/* Contact Credits Donut */}
          {cu && cu.limit !== 0 && (
            <div className="flex-shrink-0">
              <DonutChart
                value={cu.limit === -1 ? 100 : Math.max(0, 100 - creditPct)}
                size={130}
                strokeWidth={12}
                color={cu.limit === -1 ? '#16a34a' : cu.remaining <= 10 ? '#f59e0b' : 'hsl(var(--primary))'}
                label={cu.limit === -1 ? '∞' : String(cu.remaining)}
                sublabel={t('contactCredits.title')}
              />
            </div>
          )}
        </div>
      </MetricHero>

      {/* Upgrade Banner for free tier */}
      {cu && cu.limit === 0 && (
        <GlassCard delay={0.1} gradient="amber">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t('contactCredits.title')}</p>
                <p className="text-xs text-muted-foreground">{t('contactCredits.upgradeDescription')}</p>
              </div>
            </div>
            <Button size="sm" asChild>
              <Link href="/pricing?for=recruiters">
                <TrendingUp className="h-4 w-4 mr-1" /> {t('contactCredits.upgradePlan')}
              </Link>
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Stat Cards */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem><StatCard label={t('stats.activeJobs')} value={stats.activeJobs} icon={<Briefcase className="h-5 w-5" />} variant="blue" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.applications')} value={stats.totalApplications} icon={<FileText className="h-5 w-5" />} variant="purple" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.toReview')} value={stats.pendingReview} icon={<Eye className="h-5 w-5" />} variant="amber" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.shortlisted')} value={stats.shortlisted} icon={<Star className="h-5 w-5" />} variant="green" /></StaggerItem>
      </StaggerContainer>

      {/* Bento Grid */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Left: chart + candidates + jobs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Applications Trend */}
          <GlassCard delay={0.2} gradient="purple">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('stats.applications')}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <AnimatedCounter value={stats.totalApplications} className="text-2xl font-bold text-foreground" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('thisWeek.newApplications')}</p>
                  <div className="flex items-baseline gap-1 mt-1 justify-end">
                    <span className="text-2xl font-bold text-green-600">+{stats.newApplicationsThisWeek}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Top Candidates */}
          <GlassCard delay={0.3} hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-foreground">{t('topCandidates.title')}</h2>
                  <p className="text-xs text-muted-foreground">{t('topCandidates.description')}</p>
                </div>
                <Button size="sm" variant="outline" className="bg-white/60" asChild>
                  <Link href="/dashboard/recruiter/candidates">{t('topCandidates.viewAll')}</Link>
                </Button>
              </div>
              {topCandidates.length > 0 ? (
                <div className="space-y-2">
                  {topCandidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:shadow-md hover:border-primary/20 transition-all group">
                      <Avatar className="h-11 w-11 ring-2 ring-primary/10">
                        <AvatarImage src={candidate.photo || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-semibold text-sm">
                          {candidate.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{candidate.name}</h4>
                          {candidate.score > 0 && (
                            <Badge className="text-[10px] bg-primary/10 text-primary border-0 px-1.5">{candidate.score}%</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <GraduationCap className="h-3 w-3" />
                          <span className="truncate">{candidate.university}</span>
                          <span className="text-muted-foreground/30">·</span>
                          <span>{candidate.projectCount} projects</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/60" asChild>
                          <Link href="/dashboard/recruiter/messages">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button size="sm" className="h-8 text-xs" asChild>
                          <Link href={`/students/${candidate.username || candidate.id}/public`}>{ts('view')}</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-7 w-7 text-primary/60" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{t('topCandidates.empty')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t('topCandidates.emptyDescription')}</p>
                  <Button asChild>
                    <Link href="/dashboard/recruiter/candidates"><Search className="h-4 w-4 mr-2" />{t('searchCandidates')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Matches for open roles — evidence-weighted shortlist */}
          {talentRecs.length > 0 && (
            <GlassCard delay={0.35} hover={false}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" strokeWidth={2.25} />
                    {locale === 'it' ? 'Match per i tuoi ruoli aperti' : 'Matches for your open roles'}
                  </h2>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" asChild>
                    <Link href="/dashboard/recruiter/talent-match">
                      {locale === 'it' ? 'Rifinisci ricerca' : 'Refine search'}
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {locale === 'it'
                    ? 'Classifica basata su competenze verificate — non auto-dichiarazioni.'
                    : 'Ranked by verified skills — not self-declared claims.'}
                </p>
                <div className="space-y-2">
                  {talentRecs.map((rec, idx) => {
                    const tier = rec.matchScore >= 80 ? 'strong' : rec.matchScore >= 60 ? 'match' : 'weak'
                    return (
                      <div
                        key={rec.studentId}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:shadow-md hover:border-primary/30 transition-all"
                      >
                        <div className="flex-shrink-0 w-12 flex flex-col items-center">
                          <span className="text-base font-bold text-foreground tabular-nums leading-none">
                            {rec.matchScore}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">
                            /100
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="font-medium text-sm text-foreground truncate">
                              {rec.firstName} {rec.lastName}
                            </p>
                            {rec.verified && (
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" strokeWidth={2.25} />
                            )}
                            {tier === 'strong' && idx === 0 && (
                              <Flame className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" strokeWidth={2.25} />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            {rec.university && <span className="truncate">{rec.university}</span>}
                            <span className="text-muted-foreground/30">·</span>
                            <span className="flex-shrink-0">
                              {rec.projectCount}{' '}
                              {locale === 'it' ? 'progetti verificati' : 'verified projects'}
                            </span>
                          </div>
                          {rec.matchedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {rec.matchedSkills.slice(0, 4).map(s => (
                                <span
                                  key={s}
                                  className="text-[10px] font-medium text-foreground/80 bg-muted border border-border/60 px-2 py-0.5 rounded-md"
                                >
                                  {s}
                                </span>
                              ))}
                              {rec.matchedSkills.length > 4 && (
                                <span className="text-[10px] text-muted-foreground px-1">
                                  +{rec.matchedSkills.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                          <Link href={`/students/${rec.studentId}/public`}>
                            {locale === 'it' ? 'Apri' : 'Open'}
                          </Link>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Active Jobs */}
          <GlassCard delay={0.4} hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-foreground">{t('jobPostings.title')}</h2>
                  <p className="text-xs text-muted-foreground">{t('jobPostings.description')}</p>
                </div>
                <Button size="sm" variant="outline" className="bg-white/60" asChild>
                  <Link href="/dashboard/recruiter/jobs">{t('jobPostings.manage')}</Link>
                </Button>
              </div>
              {myJobs.length > 0 ? (
                <div className="space-y-2">
                  {myJobs.map((job) => (
                    <Link key={job.id} href={`/dashboard/recruiter/jobs/${job.id}`} className="block">
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:shadow-md hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                              <Badge variant={job.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-[10px] rounded-full h-5">{job.status}</Badge>
                            </div>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" /> {job.posted}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-foreground">{job.applications}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">{t('jobPostings.applications')}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-foreground">{job.views}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">{t('jobPostings.views')}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{t('jobPostings.empty')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t('jobPostings.emptyDescription')}</p>
                  <Button asChild>
                    <Link href="/dashboard/recruiter/jobs/new"><Plus className="h-4 w-4 mr-2" />{t('jobPostings.postJob')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Activity Feed */}
          <GlassCard delay={0.3}>
            <div className="p-4">
              <ActivityFeed items={activityItems} title={t('thisWeek.title')} maxHeight={300} />
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard delay={0.4}>
            <div className="p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-2">{t('quickActions.title')}</p>
              {[
                { href: '/dashboard/recruiter/candidates' as const, icon: Search, label: t('quickActions.searchCandidates') },
                { href: '/dashboard/recruiter/jobs/new' as const, icon: Plus, label: t('quickActions.postJob') },
                { href: '/dashboard/recruiter/messages' as const, icon: MessageSquare, label: t('quickActions.messages') },
                { href: '/dashboard/recruiter/settings' as const, icon: Settings, label: t('quickActions.companySettings') },
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
            </div>
          </GlassCard>

          {/* This-week pipeline snapshot — replaces the generic "tip" card
              with real signal from the recruiter's own numbers. */}
          <GlassCard delay={0.5} gradient="blue">
            <div className="p-4">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-3">
                <BarChart3 className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} />
                {locale === 'it' ? 'La tua settimana' : 'Your week'}
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'it' ? 'Nuove candidature' : 'New applications'}
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {stats.newApplicationsThisWeek}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'it' ? 'Colloqui programmati' : 'Interviews scheduled'}
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {stats.interviewsScheduled}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'it' ? 'Da valutare' : 'Pending review'}
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      stats.pendingReview > 10 ? 'text-amber-600' : 'text-foreground'
                    }`}
                  >
                    {stats.pendingReview}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2.5 mt-2.5">
                  <span className="text-muted-foreground">
                    {locale === 'it' ? 'Shortlist' : 'Shortlisted'}
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {stats.shortlisted}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-2 p-3 rounded-xl hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">{t('signOut')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
