'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import { useTranslations } from 'next-intl'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

const FUNNEL_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#f44336']

interface AnalyticsData {
  hiringFunnel: Array<{ name: string; value: number }>
  applicationTrends: Array<{ month: string; applications: number }>
  skillsGap: Array<{ skill: string; demand: number; supply: number; gap: number }>
  overviewStats: {
    totalApplications: number
    interviewsScheduled: number
    offersExtended: number
    avgTimeToHire: number
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RecruiterAnalytics() {
  const t = useTranslations('recruiterDashboard.analytics')
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('3months')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/dashboard/recruiter/analytics?timeRange=${timeRange}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch analytics')
        return res.json()
      })
      .then((result: AnalyticsData) => {
        setData(result)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [timeRange])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="min-h-screen space-y-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 font-medium mb-2">{t('errorLoading')}</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { hiringFunnel, applicationTrends, skillsGap, overviewStats } = data

  // Compute conversion rates from funnel data (excluding Rejected)
  const funnelSteps = hiringFunnel.filter(s => s.name !== 'Rejected')
  const conversionRates: Array<{ label: string; rate: number }> = []
  for (let i = 1; i < funnelSteps.length; i++) {
    const prev = funnelSteps[i - 1].value
    const curr = funnelSteps[i].value
    const rate = prev > 0 ? Math.round((curr / prev) * 100) : 0
    conversionRates.push({
      label: `${funnelSteps[i - 1].name} to ${funnelSteps[i].name}`,
      rate,
    })
  }

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="company">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectTimeRange')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">{t('timeRange.lastMonth')}</SelectItem>
              <SelectItem value="3months">{t('timeRange.last3Months')}</SelectItem>
              <SelectItem value="6months">{t('timeRange.last6Months')}</SelectItem>
              <SelectItem value="1year">{t('timeRange.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </MetricHero>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="funnel">{t('tabs.hiringFunnel')}</TabsTrigger>
          <TabsTrigger value="skills">{t('tabs.skillsGap')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <GlassCard hover={false}>
              <div className="p-5">
                <p className="text-sm font-medium mb-2">{t('stats.totalApplications')}</p>
                <div className="text-2xl font-bold">
                  {overviewStats.totalApplications.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('stats.inSelectedRange')}
                </p>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-5">
                <p className="text-sm font-medium mb-2">{t('stats.interviewsScheduled')}</p>
                <div className="text-2xl font-bold">
                  {overviewStats.interviewsScheduled}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('stats.currentlyInterviewing')}
                </p>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-5">
                <p className="text-sm font-medium mb-2">{t('stats.offersExtended')}</p>
                <div className="text-2xl font-bold">
                  {overviewStats.offersExtended}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('stats.offersAccepted')}
                </p>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-5">
                <p className="text-sm font-medium mb-2">{t('stats.avgTimeToHire')}</p>
                <div className="text-2xl font-bold">
                  {overviewStats.avgTimeToHire > 0 ? t('stats.days', { count: overviewStats.avgTimeToHire }) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('stats.fromApplicationToAcceptance')}
                </p>
              </div>
            </GlassCard>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard hover={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">{t('charts.applicationTrends')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('charts.applicationTrendsDesc')}
                </p>
                {applicationTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={applicationTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    {t('charts.noApplicationData')}
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">{t('charts.conversionRates')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('charts.conversionRatesDesc')}
                </p>
                <div className="space-y-4">
                  {conversionRates.length > 0 ? (
                    conversionRates.map((step) => (
                      <div key={step.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{step.label}</span>
                          <span className="text-sm font-medium">{step.rate}%</span>
                        </div>
                        <Progress value={step.rate} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                      {t('charts.noFunnelData')}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">{t('charts.hiringFunnel')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('charts.hiringFunnelDesc')}
              </p>
              {hiringFunnel.length > 0 && hiringFunnel[0].value > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    {hiringFunnel.map((stage, index) => (
                      <div key={stage.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{stage.name}</span>
                          <span className="text-sm text-muted-foreground">{stage.value}</span>
                        </div>
                        <Progress value={(stage.value / hiringFunnel[0].value) * 100} className="h-3" />
                        {index > 0 && hiringFunnel[index - 1].value > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {((stage.value / hiringFunnel[index - 1].value) * 100).toFixed(1)}% from previous stage
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={hiringFunnel}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
                        >
                          {hiringFunnel.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  {t('charts.noApplicationData')}
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">{t('charts.skillsGapAnalysis')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('charts.skillsGapDesc')}
              </p>
              {skillsGap.length > 0 ? (
                <div className="space-y-6">
                  {skillsGap.map((skill) => (
                    <div key={skill.skill} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{skill.skill}</h3>
                        <Badge variant={skill.gap > 2 ? 'destructive' : skill.gap > 0 ? 'default' : 'secondary'}>
                          {skill.gap > 0 ? `${skill.gap} gap` : 'Balanced'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{t('charts.jobsRequiring')}</span>
                            <span>{skill.demand}</span>
                          </div>
                          <Progress value={Math.min((skill.demand / Math.max(skill.demand, skill.supply)) * 100, 100)} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{t('charts.applicantsWithSkill')}</span>
                            <span>{skill.supply}</span>
                          </div>
                          <Progress value={Math.min((skill.supply / Math.max(skill.demand, skill.supply)) * 100, 100)} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6">
                    <h3 className="font-medium mb-4">{t('charts.skillsGapComparison')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={skillsGap}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="skill" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="demand" fill="#8884d8" name={t('charts.jobsRequiring')} />
                        <Bar dataKey="supply" fill="#82ca9d" name={t('charts.applicantsWithSkill')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  {t('charts.noSkillsGapData')}
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
