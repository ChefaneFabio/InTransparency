'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingDown,
  GraduationCap,
  Sparkles,
  Target,
  RefreshCw,
  Briefcase,
  Building2,
  Calendar,
  Award,
  Users,
  Clock,
  Euro,
} from 'lucide-react'

interface GapRow {
  skill: string
  escoUri: string | null
  demandScore: number
  studentCount: number
  coverage: number
  gapSeverity: number
}

interface Report {
  universityName: string
  programName: string | null
  studentCount: number
  jobCount: number
  gaps: GapRow[]
  strengths: GapRow[]
  gapIndex: number
  alignmentIndex: number
  computedAt: string
}

interface TrendRow {
  month: string
  gapIndex: number
  alignmentIndex: number
  studentCount: number
}

interface Recommendation {
  type: string
  skill: string
  suggestion: string
  confidence: number
  rationale: string
}

interface ApiResponse {
  report: Report
  trend?: TrendRow[]
  recommendations?: Recommendation[]
}

function severityColor(severity: number): string {
  if (severity >= 60) return 'bg-red-500'
  if (severity >= 40) return 'bg-orange-500'
  if (severity >= 20) return 'bg-amber-400'
  return 'bg-blue-400'
}

function ZeroMetric({
  icon,
  label,
  value,
  unit,
  helper,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit?: string
  helper: string
}) {
  return (
    <div className="border rounded-lg p-4 bg-muted/20">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-muted-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">{helper}</p>
    </div>
  )
}

function EmptyStateBanner({ title, body, badge }: { title: string; body: string; badge: string }) {
  return (
    <div className="border border-dashed rounded-lg p-6 bg-muted/10 text-center">
      <Badge variant="outline" className="mb-3">
        {badge}
      </Badge>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xl mx-auto">{body}</p>
    </div>
  )
}

export default function SkillsIntelligencePanel({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations('skillsIntelligence')
  const [programs, setPrograms] = useState<string[]>([])
  const [program, setProgram] = useState<string>('ALL')
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [snapshotting, setSnapshotting] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard/university/skills-gap-v2?programs=1')
      .then(r => r.json())
      .then(data => setPrograms(data.programs ?? []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      program,
      withTrend: '1',
      withRecs: '1',
    })
    fetch(`/api/dashboard/university/skills-gap-v2?${params}`)
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [program])

  const takeSnapshot = async () => {
    setSnapshotting(true)
    await fetch('/api/dashboard/university/skills-gap-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ program: program === 'ALL' ? null : program }),
    })
    const res = await fetch(
      `/api/dashboard/university/skills-gap-v2?program=${program}&withTrend=1&withRecs=1`
    )
    if (res.ok) setData(await res.json())
    setSnapshotting(false)
  }

  return (
    <div className={embedded ? '' : 'container max-w-6xl mx-auto py-8 px-4'}>
      {!embedded && (
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground max-w-2xl">{t('subtitle')}</p>
          </div>
          <Button onClick={takeSnapshot} disabled={snapshotting} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${snapshotting ? 'animate-spin' : ''}`} />
            {t('saveSnapshot')}
          </Button>
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6 flex items-center gap-3 flex-wrap">
          <GraduationCap className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{t('programLabel')}</span>
          <select
            className="px-3 py-2 border rounded text-sm bg-background"
            value={program}
            onChange={e => setProgram(e.target.value)}
          >
            <option value="ALL">{t('allPrograms')}</option>
            {programs.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {data?.report && (
            <>
              <Badge variant="outline" className="ml-auto">
                {t('studentsCount', { count: data.report.studentCount })}
              </Badge>
              <Badge variant="outline">{t('jobsCount', { count: data.report.jobCount })}</Badge>
            </>
          )}
        </CardContent>
      </Card>

      {loading && <Skeleton className="h-96 w-full" />}

      {!loading && data?.report && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  {t('gapIndex.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-red-600">{data.report.gapIndex}</span>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
                <p className="text-xs text-muted-foreground">{t('gapIndex.helper')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" />
                  {t('alignmentIndex.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-emerald-600">
                    {data.report.alignmentIndex}
                  </span>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
                <p className="text-xs text-muted-foreground">{t('alignmentIndex.helper')}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="gaps" className="mb-6">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="gaps">
                {t('tabs.gaps', { count: data.report.gaps.length })}
              </TabsTrigger>
              <TabsTrigger value="strengths">
                {t('tabs.strengths', { count: data.report.strengths.length })}
              </TabsTrigger>
              <TabsTrigger value="trend">{t('tabs.trend')}</TabsTrigger>
              <TabsTrigger value="recs">
                {t('tabs.recommendations', { count: data.recommendations?.length ?? 0 })}
              </TabsTrigger>
              <TabsTrigger value="placements">{t('tabs.placements')}</TabsTrigger>
              <TabsTrigger value="partners">{t('tabs.partners')}</TabsTrigger>
              <TabsTrigger value="events">{t('tabs.events')}</TabsTrigger>
              <TabsTrigger value="credentials">{t('tabs.credentials')}</TabsTrigger>
            </TabsList>

            <TabsContent value="gaps" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {data.report.gaps.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t('empty.gaps')}</p>
                    ) : (
                      data.report.gaps.map(g => (
                        <div key={g.skill} className="flex items-center gap-3 text-sm">
                          <div className="w-40 truncate">
                            <span className="font-medium">{g.skill}</span>
                            {g.escoUri && (
                              <Badge variant="outline" className="ml-2 text-xs" title={g.escoUri}>
                                ESCO
                              </Badge>
                            )}
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${severityColor(g.gapSeverity)}`}
                              style={{ width: `${Math.min(100, g.gapSeverity)}%` }}
                            />
                          </div>
                          <div className="w-24 text-right text-xs text-muted-foreground">
                            {t('gapRow.demandCoverage', { demand: g.demandScore, coverage: g.coverage })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strengths" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {data.report.strengths.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t('empty.strengths')}</p>
                    ) : (
                      data.report.strengths.map(s => (
                        <div key={s.skill} className="flex items-center gap-3 text-sm">
                          <div className="w-40 truncate">
                            <span className="font-medium">{s.skill}</span>
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${Math.min(100, Math.abs(s.gapSeverity))}%` }}
                            />
                          </div>
                          <div className="w-32 text-right text-xs text-muted-foreground">
                            {t('strengthRow.coverageDemand', { coverage: s.coverage, demand: s.demandScore })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trend" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {!data.trend || data.trend.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {t('empty.trend')}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-red-500" />
                          {t('trend.gapLegend')}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-emerald-500" />
                          {t('trend.alignmentLegend')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {data.trend.map(tr => (
                          <div key={tr.month} className="flex items-center gap-3 text-sm">
                            <div className="w-20 text-muted-foreground">{tr.month}</div>
                            <div className="flex-1 flex gap-1">
                              <div
                                className="bg-red-500 h-5"
                                style={{ width: `${tr.gapIndex}%` }}
                                title={`${t('trend.gapLegend')} ${tr.gapIndex}`}
                              />
                              <div
                                className="bg-emerald-500 h-5"
                                style={{ width: `${tr.alignmentIndex}%` }}
                                title={`${t('trend.alignmentLegend')} ${tr.alignmentIndex}`}
                              />
                            </div>
                            <div className="w-24 text-xs text-muted-foreground text-right">
                              {t('trend.studentsCount', { count: tr.studentCount })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recs" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {!data.recommendations || data.recommendations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {t('empty.recs')}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {data.recommendations.map((r, idx) => (
                        <Card key={idx} className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={r.type === 'ADD_COURSE' ? 'destructive' : 'default'}>
                                {r.type.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {t('recs.confidence', { pct: Math.round(r.confidence * 100) })}
                              </span>
                            </div>
                            <h3 className="font-semibold mb-1">{r.suggestion}</h3>
                            <p className="text-sm text-muted-foreground">{r.rationale}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="placements" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <ZeroMetric
                      icon={<Briefcase className="h-4 w-4" />}
                      label={t('placements.rate.label')}
                      value="—"
                      unit="%"
                      helper={t('placements.rate.helper')}
                    />
                    <ZeroMetric
                      icon={<Clock className="h-4 w-4" />}
                      label={t('placements.timeToJob.label')}
                      value="—"
                      unit={t('placements.timeToJob.unit')}
                      helper={t('placements.timeToJob.helper')}
                    />
                    <ZeroMetric
                      icon={<Euro className="h-4 w-4" />}
                      label={t('placements.salary.label')}
                      value="—"
                      unit={t('placements.salary.unit')}
                      helper={t('placements.salary.helper')}
                    />
                    <ZeroMetric
                      icon={<Target className="h-4 w-4" />}
                      label={t('placements.fit.label')}
                      value="—"
                      unit="/ 100"
                      helper={t('placements.fit.helper')}
                    />
                  </div>
                  <EmptyStateBanner
                    badge={t('readyBadge')}
                    title={t('placements.banner.title')}
                    body={t('placements.banner.body')}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partners" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <ZeroMetric
                      icon={<Building2 className="h-4 w-4" />}
                      label={t('partners.active.label')}
                      value="0"
                      helper={t('partners.active.helper')}
                    />
                    <ZeroMetric
                      icon={<Briefcase className="h-4 w-4" />}
                      label={t('partners.openJobs.label')}
                      value="0"
                      helper={t('partners.openJobs.helper')}
                    />
                    <ZeroMetric
                      icon={<Users className="h-4 w-4" />}
                      label={t('partners.applications.label')}
                      value="0"
                      helper={t('partners.applications.helper')}
                    />
                    <ZeroMetric
                      icon={<Target className="h-4 w-4" />}
                      label={t('partners.conversion.label')}
                      value="—"
                      unit="%"
                      helper={t('partners.conversion.helper')}
                    />
                  </div>
                  <EmptyStateBanner
                    badge={t('readyBadge')}
                    title={t('partners.banner.title')}
                    body={t('partners.banner.body')}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <ZeroMetric
                      icon={<Calendar className="h-4 w-4" />}
                      label={t('events.scheduled.label')}
                      value="0"
                      helper={t('events.scheduled.helper')}
                    />
                    <ZeroMetric
                      icon={<Users className="h-4 w-4" />}
                      label={t('events.attendance.label')}
                      value="0"
                      helper={t('events.attendance.helper')}
                    />
                    <ZeroMetric
                      icon={<Building2 className="h-4 w-4" />}
                      label={t('events.employers.label')}
                      value="0"
                      helper={t('events.employers.helper')}
                    />
                    <ZeroMetric
                      icon={<Briefcase className="h-4 w-4" />}
                      label={t('events.applications.label')}
                      value="0"
                      helper={t('events.applications.helper')}
                    />
                  </div>
                  <EmptyStateBanner
                    badge={t('readyBadge')}
                    title={t('events.banner.title')}
                    body={t('events.banner.body')}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credentials" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <ZeroMetric
                      icon={<Award className="h-4 w-4" />}
                      label={t('credentials.openBadges.label')}
                      value="0"
                      helper={t('credentials.openBadges.helper')}
                    />
                    <ZeroMetric
                      icon={<Award className="h-4 w-4" />}
                      label={t('credentials.edci.label')}
                      value="0"
                      helper={t('credentials.edci.helper')}
                    />
                    <ZeroMetric
                      icon={<Target className="h-4 w-4" />}
                      label={t('credentials.esco.label')}
                      value="—"
                      unit="%"
                      helper={t('credentials.esco.helper')}
                    />
                    <ZeroMetric
                      icon={<Users className="h-4 w-4" />}
                      label={t('credentials.verified.label')}
                      value="0"
                      helper={t('credentials.verified.helper')}
                    />
                  </div>
                  <EmptyStateBanner
                    badge={t('readyBadge')}
                    title={t('credentials.banner.title')}
                    body={t('credentials.banner.body')}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
