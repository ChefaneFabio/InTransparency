'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import {
  BarChart3,
  Sparkles,
  Clock,
  TrendingUp,
  Users,
  Send,
} from 'lucide-react'

type SequenceStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'REPLIED' | 'BOUNCED'

interface TemplatePerf {
  templateId: string | null
  templateName: string
  totalSequences: number
  completed: number
  replied: number
  replyRate: number
  avgStepsSent: number
}

interface PipelineAnalyticsData {
  sequences: {
    total: number
    byStatus: Record<SequenceStatus, number>
    avgStepsSent: number
  }
  templates: TemplatePerf[]
  responseTime: {
    medianHours: number | null
    fastestHours: number | null
    slowestHours: number | null
  }
  scoreDistribution: Array<{ bucket: string; count: number }>
}

const STATUS_ORDER: SequenceStatus[] = [
  'ACTIVE',
  'PAUSED',
  'REPLIED',
  'COMPLETED',
  'BOUNCED',
]

const STATUS_BAR_COLORS: Record<SequenceStatus, string> = {
  ACTIVE: 'bg-blue-500',
  PAUSED: 'bg-amber-500',
  REPLIED: 'bg-emerald-500',
  COMPLETED: 'bg-slate-500',
  BOUNCED: 'bg-rose-500',
}

const STATUS_BADGE_COLORS: Record<SequenceStatus, string> = {
  ACTIVE: 'bg-blue-100 text-blue-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  REPLIED: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-slate-100 text-slate-700',
  BOUNCED: 'bg-rose-100 text-rose-700',
}

function formatHours(hours: number | null, t: (k: string) => string): string {
  if (hours === null || !isFinite(hours)) return t('notAvailable')
  if (hours < 1) {
    const minutes = Math.max(1, Math.round(hours * 60))
    return `${minutes} ${t('minutesShort')}`
  }
  if (hours < 48) return `${hours.toFixed(1)} ${t('hoursShort')}`
  const days = hours / 24
  return `${days.toFixed(1)} ${t('daysShort')}`
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export default function RecruiterPipelineAnalyticsPage() {
  const t = useTranslations('recruiterPipelineAnalytics')
  const [data, setData] = useState<PipelineAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/recruiter/analytics/pipeline')
      .then(res => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then((d: PipelineAnalyticsData) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        setError(t('error'))
        setLoading(false)
      })
  }, [t])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <GlassCard hover={false}>
        <div className="py-12 text-center px-5">
          <p className="text-destructive font-medium">{error || t('error')}</p>
        </div>
      </GlassCard>
    )
  }

  const { sequences, templates, responseTime, scoreDistribution } = data

  // Reply rate across the whole recruiter
  const overallDenom =
    sequences.byStatus.ACTIVE +
    sequences.byStatus.PAUSED +
    sequences.byStatus.COMPLETED +
    sequences.byStatus.REPLIED
  const overallReplyRate =
    overallDenom > 0 ? sequences.byStatus.REPLIED / overallDenom : 0

  const activeInPipeline =
    sequences.byStatus.ACTIVE + sequences.byStatus.PAUSED

  const maxStatusCount = Math.max(
    1,
    ...STATUS_ORDER.map(s => sequences.byStatus[s] || 0)
  )

  const maxScoreCount = Math.max(
    1,
    ...scoreDistribution.map(s => s.count)
  )

  const hasAnySequences = sequences.total > 0
  const hasAnyScores = scoreDistribution.some(s => s.count > 0)

  return (
    <div className="space-y-6">
      <MetricHero gradient="company">
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
              <Sparkles className="h-4 w-4" />
              {t('eyebrow')}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HeroMetric
              icon={<Send className="h-4 w-4" />}
              label={t('metrics.totalSequences')}
              value={sequences.total.toString()}
            />
            <HeroMetric
              icon={<TrendingUp className="h-4 w-4" />}
              label={t('metrics.replyRate')}
              value={formatPercent(overallReplyRate)}
            />
            <HeroMetric
              icon={<Clock className="h-4 w-4" />}
              label={t('metrics.medianResponse')}
              value={formatHours(responseTime.medianHours, t)}
            />
            <HeroMetric
              icon={<Users className="h-4 w-4" />}
              label={t('metrics.activeInPipeline')}
              value={activeInPipeline.toString()}
            />
          </div>
        </div>
      </MetricHero>

      {!hasAnySequences ? (
        <GlassCard hover={false}>
          <div className="px-5 py-6">
            <EmptyState
              icon={Send}
              title={t('empty.title')}
              description={t('empty.description')}
            />
          </div>
        </GlassCard>
      ) : (
        <Tabs defaultValue="status" className="space-y-4">
          <TabsList className="w-full md:w-auto h-auto flex-wrap justify-start">
            <TabsTrigger value="status">
              <BarChart3 className="h-4 w-4 mr-1.5" />
              {t('tabs.status')}
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Sparkles className="h-4 w-4 mr-1.5" />
              {t('tabs.templates')}
            </TabsTrigger>
            <TabsTrigger value="response">
              <Clock className="h-4 w-4 mr-1.5" />
              {t('tabs.responseTime')}
            </TabsTrigger>
            <TabsTrigger value="scores">
              <TrendingUp className="h-4 w-4 mr-1.5" />
              {t('tabs.scoreDistribution')}
            </TabsTrigger>
          </TabsList>

          {/* Status distribution */}
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('status.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('status.description')}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {STATUS_ORDER.map(status => {
                    const count = sequences.byStatus[status] || 0
                    const pct = (count / maxStatusCount) * 100
                    return (
                      <div key={status} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${STATUS_BADGE_COLORS[status]}`}
                            >
                              {t(`statuses.${status}`)}
                            </Badge>
                          </div>
                          <span className="font-medium tabular-nums">{count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${STATUS_BAR_COLORS[status]}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                  <div>
                    {t('status.avgStepsSent')}:{' '}
                    <span className="font-semibold text-foreground tabular-nums">
                      {sequences.avgStepsSent.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    {t('status.totalLabel')}:{' '}
                    <span className="font-semibold text-foreground tabular-nums">
                      {sequences.total}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('templates.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('templates.description')}</p>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <EmptyState
                    icon={Sparkles}
                    title={t('templates.emptyTitle')}
                    description={t('templates.emptyDescription')}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b">
                          <th className="py-2 pr-3 font-medium">{t('templates.col.name')}</th>
                          <th className="py-2 pr-3 font-medium text-right">{t('templates.col.total')}</th>
                          <th className="py-2 pr-3 font-medium text-right">{t('templates.col.replied')}</th>
                          <th className="py-2 pr-3 font-medium text-right">{t('templates.col.replyRate')}</th>
                          <th className="py-2 pr-3 font-medium text-right">{t('templates.col.avgSteps')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((tpl, idx) => (
                          <tr
                            key={`${tpl.templateId || 'snap'}-${idx}`}
                            className="border-b last:border-0"
                          >
                            <td className="py-3 pr-3 font-medium truncate max-w-xs">
                              {tpl.templateName || t('templates.untitled')}
                            </td>
                            <td className="py-3 pr-3 text-right tabular-nums">
                              {tpl.totalSequences}
                            </td>
                            <td className="py-3 pr-3 text-right tabular-nums">
                              {tpl.replied}
                            </td>
                            <td className="py-3 pr-3 text-right tabular-nums">
                              <span
                                className={
                                  tpl.replyRate >= 0.3
                                    ? 'text-emerald-600 font-semibold'
                                    : tpl.replyRate >= 0.1
                                    ? 'text-amber-600 font-medium'
                                    : 'text-muted-foreground'
                                }
                              >
                                {formatPercent(tpl.replyRate)}
                              </span>
                            </td>
                            <td className="py-3 pr-3 text-right tabular-nums">
                              {tpl.avgStepsSent.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Response time */}
          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('response.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('response.description')}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatBox
                    label={t('response.median')}
                    value={formatHours(responseTime.medianHours, t)}
                    accent="emerald"
                  />
                  <StatBox
                    label={t('response.fastest')}
                    value={formatHours(responseTime.fastestHours, t)}
                    accent="blue"
                  />
                  <StatBox
                    label={t('response.slowest')}
                    value={formatHours(responseTime.slowestHours, t)}
                    accent="amber"
                  />
                </div>
                {responseTime.medianHours === null && (
                  <p className="text-sm text-muted-foreground mt-4">
                    {t('response.noData')}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Score distribution */}
          <TabsContent value="scores">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('scores.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('scores.description')}</p>
              </CardHeader>
              <CardContent>
                {!hasAnyScores ? (
                  <EmptyState
                    icon={TrendingUp}
                    title={t('scores.emptyTitle')}
                    description={t('scores.emptyDescription')}
                  />
                ) : (
                  <div className="space-y-3">
                    {scoreDistribution.map(bucket => {
                      const pct = (bucket.count / maxScoreCount) * 100
                      return (
                        <div key={bucket.bucket} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{bucket.bucket}</span>
                            <span className="tabular-nums text-muted-foreground">
                              {bucket.count}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-white/60 dark:bg-slate-900/40 border border-white/40 dark:border-slate-700/40 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="text-xl md:text-2xl font-bold tabular-nums">{value}</div>
    </div>
  )
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'emerald' | 'blue' | 'amber'
}) {
  const accentClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return (
    <div className={`rounded-xl border p-4 ${accentClasses[accent]}`}>
      <div className="text-xs uppercase tracking-wide font-medium mb-1 opacity-80">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
    </div>
  )
}
