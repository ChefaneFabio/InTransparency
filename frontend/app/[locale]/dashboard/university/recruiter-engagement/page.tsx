'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import {
  Building2,
  Users,
  Send,
  TrendingUp,
  Clock,
  Heart,
  Zap,
  CheckCircle2,
  Briefcase,
} from 'lucide-react'

type Totals = {
  activeRecruiters: number
  studentsEngaged: number
  sequencesStarted: number
  conversionToReply: number
}

type TopCompany = {
  recruiterName: string
  companyName: string | null
  studentsSaved: number
  outreachStarted: number
  replies: number
}

type Funnel = {
  matched: number
  saved: number
  contacted: number
  replied: number
  hired: number
}

type ActivityAction = 'saved' | 'outreach_started' | 'match_generated'

type Activity = {
  timestamp: string
  recruiterName: string
  companyName: string | null
  action: ActivityAction
  studentName: string
}

type EngagementData = {
  totals: Totals
  topCompanies: TopCompany[]
  funnel: Funnel
  recentActivity: Activity[]
}

export default function RecruiterEngagementPage() {
  const t = useTranslations('universityRecruiterEngagement')
  const [data, setData] = useState<EngagementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/university/recruiter-engagement')
      if (!res.ok) throw new Error('Failed to fetch')
      const json = (await res.json()) as EngagementData
      setData(json)
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatRelative = (iso: string): string => {
    const date = new Date(iso)
    const diffMs = Date.now() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return t('time.justNow')
    if (diffMin < 60) return t('time.minutesAgo', { count: diffMin })
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return t('time.hoursAgo', { count: diffHr })
    const diffDay = Math.floor(diffHr / 24)
    if (diffDay < 30) return t('time.daysAgo', { count: diffDay })
    return date.toLocaleDateString()
  }

  const totals = data?.totals
  const funnel = data?.funnel
  const topCompanies = data?.topCompanies ?? []
  const recentActivity = data?.recentActivity ?? []

  const totalEngagement =
    (funnel?.matched ?? 0) +
    (funnel?.saved ?? 0) +
    (funnel?.contacted ?? 0) +
    (funnel?.replied ?? 0) +
    (funnel?.hired ?? 0)
  const hasData = totalEngagement > 0

  const heroStats = [
    {
      key: 'activeRecruiters',
      label: t('metrics.activeRecruiters'),
      value: totals?.activeRecruiters ?? 0,
      icon: Building2,
    },
    {
      key: 'studentsEngaged',
      label: t('metrics.studentsEngaged'),
      value: totals?.studentsEngaged ?? 0,
      icon: Users,
    },
    {
      key: 'sequencesStarted',
      label: t('metrics.sequencesStarted'),
      value: totals?.sequencesStarted ?? 0,
      icon: Send,
    },
    {
      key: 'conversionToReply',
      label: t('metrics.conversionToReply'),
      value: `${totals?.conversionToReply ?? 0}%`,
      icon: TrendingUp,
    },
  ]

  const funnelSteps: Array<{
    key: keyof Funnel
    label: string
    icon: typeof Zap
    color: string
  }> = [
    { key: 'matched', label: t('funnel.matched'), icon: Zap, color: 'bg-purple-500' },
    { key: 'saved', label: t('funnel.saved'), icon: Heart, color: 'bg-rose-500' },
    { key: 'contacted', label: t('funnel.contacted'), icon: Send, color: 'bg-blue-500' },
    { key: 'replied', label: t('funnel.replied'), icon: CheckCircle2, color: 'bg-emerald-500' },
    { key: 'hired', label: t('funnel.hired'), icon: Briefcase, color: 'bg-amber-500' },
  ]
  const funnelMax = funnel ? Math.max(1, funnel.matched) : 1

  const actionLabel = (a: ActivityAction): string => {
    if (a === 'saved') return t('activity.saved')
    if (a === 'outreach_started') return t('activity.outreachStarted')
    return t('activity.matchGenerated')
  }

  const actionBadgeClass = (a: ActivityAction): string => {
    if (a === 'saved') return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
    if (a === 'outreach_started')
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
    return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
  }

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="primary">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
      </MetricHero>

      {/* Top metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {heroStats.map((s, i) => (
          <GlassCard key={s.key} delay={0.05 * (i + 1)}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive text-center">{error}</p>
            <div className="flex justify-center mt-2">
              <Button variant="outline" size="sm" onClick={fetchData}>
                {t('retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading placeholder */}
      {loading && !data && (
        <GlassCard delay={0.2}>
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </GlassCard>
      )}

      {/* Empty state */}
      {!loading && !error && data && !hasData && (
        <GlassCard delay={0.2}>
          <EmptyState
            icon={Building2}
            title={t('empty.title')}
            description={t('empty.description')}
          />
        </GlassCard>
      )}

      {/* Funnel */}
      {!loading && hasData && funnel && (
        <GlassCard delay={0.2}>
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{t('funnel.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('funnel.subtitle')}</p>
            </div>
            <div className="space-y-3">
              {funnelSteps.map(step => {
                const value = funnel[step.key]
                const pct = Math.max(2, Math.round((value / funnelMax) * 100))
                return (
                  <div key={step.key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <step.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{step.label}</span>
                      </div>
                      <span className="tabular-nums font-semibold">{value}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${step.color} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Top companies table */}
      {!loading && hasData && (
        <GlassCard delay={0.25}>
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{t('topCompanies.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('topCompanies.subtitle')}</p>
            </div>
            {topCompanies.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                {t('topCompanies.empty')}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('topCompanies.recruiter')}</TableHead>
                    <TableHead>{t('topCompanies.company')}</TableHead>
                    <TableHead className="text-right">{t('topCompanies.saved')}</TableHead>
                    <TableHead className="text-right">{t('topCompanies.outreach')}</TableHead>
                    <TableHead className="text-right">{t('topCompanies.replies')}</TableHead>
                    <TableHead className="text-right">{t('topCompanies.rate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCompanies.map((c, idx) => {
                    const rate =
                      c.outreachStarted > 0
                        ? Math.round((c.replies / c.outreachStarted) * 100)
                        : 0
                    return (
                      <TableRow key={`${c.recruiterName}-${idx}`}>
                        <TableCell className="font-medium">{c.recruiterName}</TableCell>
                        <TableCell>
                          {c.companyName ? (
                            <div className="flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{c.companyName}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{c.studentsSaved}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {c.outreachStarted}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{c.replies}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className={
                              rate >= 40
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                                : rate >= 15
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {rate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </GlassCard>
      )}

      {/* Recent activity timeline */}
      {!loading && hasData && (
        <GlassCard delay={0.3}>
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{t('activity.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('activity.subtitle')}</p>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                {t('activity.empty')}
              </p>
            ) : (
              <ul className="space-y-3">
                {recentActivity.map((a, idx) => (
                  <li
                    key={`${a.timestamp}-${idx}`}
                    className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0"
                  >
                    <div className="mt-0.5">
                      <Badge
                        variant="outline"
                        className={`${actionBadgeClass(a.action)} whitespace-nowrap`}
                      >
                        {actionLabel(a.action)}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{a.recruiterName}</span>
                        {a.companyName && (
                          <span className="text-muted-foreground"> · {a.companyName}</span>
                        )}
                        <span className="text-muted-foreground"> → </span>
                        <span>{a.studentName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {formatRelative(a.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
