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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 font-medium mb-2">Error loading analytics</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment Analytics</h1>
          <p className="text-muted-foreground">
            Track hiring performance and optimize your recruitment process
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Hiring Funnel</TabsTrigger>
          <TabsTrigger value="skills">Skills Gap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewStats.totalApplications.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  In selected time range
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewStats.interviewsScheduled}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently in interview stage
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewStats.offersExtended}
                </div>
                <p className="text-xs text-muted-foreground">
                  Offers + accepted
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewStats.avgTimeToHire > 0 ? `${overviewStats.avgTimeToHire} days` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  From application to acceptance
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>
                  Monthly applications over selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    No application data for selected period
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>
                  Success rates at each stage of the hiring process
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                      No funnel data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Funnel</CardTitle>
              <CardDescription>
                Candidate flow through the recruitment process
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  No application data for selected period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Gap Analysis</CardTitle>
              <CardDescription>
                Job requirements demand vs available applicant skills
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                            <span>Jobs Requiring</span>
                            <span>{skill.demand}</span>
                          </div>
                          <Progress value={Math.min((skill.demand / Math.max(skill.demand, skill.supply)) * 100, 100)} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Applicants With Skill</span>
                            <span>{skill.supply}</span>
                          </div>
                          <Progress value={Math.min((skill.supply / Math.max(skill.demand, skill.supply)) * 100, 100)} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Skills Gap Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={skillsGap}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="skill" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="demand" fill="#8884d8" name="Jobs Requiring" />
                        <Bar dataKey="supply" fill="#82ca9d" name="Applicants With Skill" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No skills gap data available. Post jobs with required skills to see this analysis.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
