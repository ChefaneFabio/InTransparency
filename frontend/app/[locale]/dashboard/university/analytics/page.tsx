'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Button } from '@/components/ui/button'
import { useTranslations, useLocale } from 'next-intl'
import ScorecardPanel from '@/components/dashboard/university/analytics/ScorecardPanel'
import PremiumBadge from '@/components/shared/PremiumBadge'

// ---------------------------------------------------------------------------
// Types matching the API response shapes from /api/dashboard/university/analytics
// ---------------------------------------------------------------------------

interface OverviewData {
  totalStudents: number
  employerPartners: number
  placementRate: number
  avgSalary: number
}

interface PlacementTrend {
  year: string
  rate: number
  avgSalary: number
}

interface PlacementData {
  totalPlacements: number
  confirmed: number
  pending: number
  declined: number
  avgSalary: number
  placementRate: number
  placementTrends: PlacementTrend[]
}

interface IndustryItem {
  name: string
  value: number
  color: string
}

interface SkillGapItem {
  skill: string
  demand: number
  students: number
  gap: number
}

interface TopCompany {
  company: string
  views: number
  contacts: number
}

interface EmployersData {
  totalViews: number
  totalContacts: number
  uniqueCompanies: number
  topCompanies: TopCompany[]
}

interface SalaryItem {
  major: string
  avg: number
  min: number
  max: number
  count: number
}

interface BenchmarkItem {
  university: string
  placementRate: number
  avgSalary: number
  placements: number
  isOwn: boolean
  rank: number
}

interface TierLimits {
  hasOverview: boolean
  hasPlacement: boolean
  hasIndustryDistribution: boolean
  hasSkillsGap: boolean
  hasEmployers: boolean
  hasSalary: boolean
  hasBenchmark: boolean
}

interface AnalyticsData {
  overview?: OverviewData
  placement?: PlacementData
  industryDistribution?: IndustryItem[]
  skillsGap?: SkillGapItem[]
  employers?: EmployersData
  salary?: SalaryItem[]
  benchmark?: BenchmarkItem[]
  isLimited?: boolean
  tierLimits?: TierLimits
}

// ---------------------------------------------------------------------------
// Skeleton helpers
// ---------------------------------------------------------------------------

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="space-y-3 w-full">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}

function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-muted-foreground">
      <p>{message}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function UniversityAnalytics() {
  const t = useTranslations('universityDashboard.analytics')
  const locale = useLocale()
  const isIt = locale === 'it'
  const searchParams = useSearchParams()
  const initialTab = searchParams?.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [timeRange, setTimeRange] = useState('1year')
  const [data, setData] = useState<AnalyticsData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (tab: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/dashboard/university/analytics?tab=${tab}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch analytics (${res.status})`)
      }
      const json = await res.json()
      setData((prev) => ({ ...prev, ...json }))
    } catch (err: any) {
      setError(err.message || (isIt ? 'Si è verificato un errore inatteso' : 'An unexpected error occurred'))
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data when tab changes
  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab, fetchData])

  const overview = data.overview
  const placement = data.placement
  const industryDistribution = data.industryDistribution || []
  const skillsGap = data.skillsGap || []
  const employers = data.employers
  const salary = data.salary || []
  const benchmark = data.benchmark || []
  const placementTrends = placement?.placementTrends || []

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={isIt ? 'Seleziona intervallo' : 'Select time range'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">{isIt ? 'Ultimi 6 mesi' : 'Last 6 Months'}</SelectItem>
            <SelectItem value="1year">{isIt ? 'Ultimo anno' : 'Last Year'}</SelectItem>
            <SelectItem value="2years">{isIt ? 'Ultimi 2 anni' : 'Last 2 Years'}</SelectItem>
            <SelectItem value="5years">{isIt ? 'Ultimi 5 anni' : 'Last 5 Years'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Free Core: Overview + Placement basics. Everything else is Premium
            (advanced analytics: cross-cohort, market benchmark, scorecard etc.) */}
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">{isIt ? 'Panoramica' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="placement">{isIt ? 'Placement' : 'Placement'}</TabsTrigger>
          <TabsTrigger value="skills" className="gap-1">
            {isIt ? 'Gap competenze' : 'Skills Gap'}
            <PremiumBadge audience="institution" variant="lock" static />
          </TabsTrigger>
          <TabsTrigger value="employers" className="gap-1">
            {isIt ? 'Aziende' : 'Employers'}
            <PremiumBadge audience="institution" variant="lock" static />
          </TabsTrigger>
          <TabsTrigger value="salary" className="gap-1">
            {isIt ? 'Stipendi' : 'Salary'}
            <PremiumBadge audience="institution" variant="lock" static />
          </TabsTrigger>
          <TabsTrigger value="benchmark" className="gap-1">
            {isIt ? 'Benchmark' : 'Benchmark'}
            <PremiumBadge audience="institution" variant="lock" static />
          </TabsTrigger>
          <TabsTrigger value="scorecard" className="gap-1">
            {isIt ? 'Scorecard' : 'Scorecard'}
            <PremiumBadge audience="institution" variant="lock" static />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scorecard" className="space-y-6">
          <ScorecardPanel embedded />
        </TabsContent>

        {/* ===================== OVERVIEW TAB ===================== */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{isIt ? 'Tasso di placement' : 'Placement Rate'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview?.placementRate ?? 0}%</div>
                    <p className="text-xs text-muted-foreground">
                      {isIt ? 'Basato sui placement confermati' : 'Based on confirmed placements'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{isIt ? 'Stipendio medio iniziale' : 'Avg. Starting Salary'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${(overview?.avgSalary ?? 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isIt ? 'Da placement full-time confermati' : 'From confirmed full-time placements'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{isIt ? 'Aziende partner' : 'Employer Partners'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview?.employerPartners ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {isIt ? 'Aziende uniche confermate' : 'Unique confirmed companies'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{isIt ? 'Studenti totali' : 'Total Students'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview?.totalStudents ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {isIt ? 'Iscritti alla tua istituzione' : 'Enrolled at your institution'}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Trend del tasso di placement' : 'Placement Rate Trends'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Andamento dei tassi di placement nel tempo' : 'Trend of graduate placement rates over time'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : placementTrends.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato sui trend di placement' : 'No placement trend data available'} />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={placementTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="rate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Distribuzione per settore' : 'Industry Distribution'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Dove vengono inseriti i nostri laureati' : 'Where our graduates are being placed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : industryDistribution.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato sulla distribuzione per settore' : 'No industry distribution data available'} />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={industryDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {industryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===================== PLACEMENT TAB ===================== */}
        <TabsContent value="placement" className="space-y-6">
          <div className="flex items-center justify-end">
            <Button asChild variant="outline" size="sm">
              <a href="/api/dashboard/university/placements/export?format=csv" download>
                {isIt ? 'Esporta CSV (MIUR)' : 'Export CSV (MIUR format)'}
              </a>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Riepilogo placement' : 'Placement Summary'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Distribuzione degli stati di placement' : 'Breakdown of placement statuses'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={4} />
                ) : !placement ? (
                  <EmptyState message={isIt ? 'Nessun dato di placement disponibile' : 'No placement data available'} />
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: isIt ? 'Placement totali' : 'Total Placements', value: placement.totalPlacements },
                      { label: isIt ? 'Confermati' : 'Confirmed', value: placement.confirmed },
                      { label: isIt ? 'In attesa' : 'Pending', value: placement.pending },
                      { label: isIt ? 'Rifiutati' : 'Declined', value: placement.declined },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-sm text-muted-foreground">{item.value}</span>
                        </div>
                        <Progress
                          value={placement.totalPlacements > 0 ? (item.value / placement.totalPlacements) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{isIt ? 'Tasso di placement' : 'Placement Rate'}</span>
                        <span className="text-sm font-bold">{placement.placementRate}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-medium">{isIt ? 'Stipendio medio' : 'Average Salary'}</span>
                        <span className="text-sm font-bold">${placement.avgSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Tasso di placement nel tempo' : 'Placement Rate Over Time'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Andamento annuale del tasso di placement' : 'Yearly placement rate progression'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : placementTrends.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato di trend disponibile' : 'No trend data available'} />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={placementTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="rate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Placement Rate %" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isIt ? 'Esiti dei laureati nel tempo' : 'Graduate Outcomes Over Time'}</CardTitle>
              <CardDescription>
                {isIt ? 'Andamento del tasso di placement e dello stipendio medio dei laureati recenti' : 'Placement rate and average salary progression for recent graduates'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ChartSkeleton />
              ) : placementTrends.length === 0 ? (
                <EmptyState message={isIt ? 'Nessun dato sugli esiti disponibile' : 'No graduate outcome data available'} />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={placementTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="rate" fill="#8884d8" name="Placement Rate %" />
                    <Line yAxisId="right" type="monotone" dataKey="avgSalary" stroke="#82ca9d" strokeWidth={3} name="Avg Salary" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== SKILLS GAP TAB ===================== */}
        <TabsContent value="skills" className="space-y-6">
          <>
          <Card>
            <CardHeader>
              <CardTitle>{isIt ? 'Analisi gap competenze' : 'Skills Gap Analysis'}</CardTitle>
              <CardDescription>
                {isIt ? 'Domanda di mercato vs preparazione degli studenti nelle tecnologie chiave' : 'Market demand vs student proficiency in key technologies'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ListSkeleton rows={6} />
              ) : skillsGap.length === 0 ? (
                <EmptyState message={isIt ? 'Nessun dato sul gap competenze' : 'No skills gap data available'} />
              ) : (
                <div className="space-y-6">
                  {skillsGap.map((skill) => (
                    <div key={skill.skill} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{skill.skill}</h3>
                        <Badge variant={skill.gap > 30 ? 'destructive' : skill.gap > 15 ? 'default' : 'secondary'}>
                          {skill.gap}% {isIt ? 'gap' : 'gap'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{isIt ? 'Domanda di mercato' : 'Market Demand'}</span>
                            <span>{skill.demand}%</span>
                          </div>
                          <Progress value={skill.demand} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{isIt ? 'Preparazione studenti' : 'Student Proficiency'}</span>
                            <span>{skill.students}%</span>
                          </div>
                          <Progress value={skill.students} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Raccomandazioni curriculari' : 'Curriculum Recommendations'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Miglioramenti suggeriti in base ai gap di mercato' : 'Suggested improvements based on market gaps'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : skillsGap.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessuna raccomandazione disponibile' : 'No recommendations available'} />
                ) : (
                  <div className="space-y-4">
                    {skillsGap
                      .filter((s) => s.gap > 0)
                      .slice(0, 5)
                      .map((s) => {
                        const priority = s.gap > 30 ? 'High' : s.gap > 15 ? 'Medium' : 'Low'
                        const priorityLabel = isIt
                          ? (priority === 'High' ? 'Alta' : priority === 'Medium' ? 'Media' : 'Bassa')
                          : priority
                        return (
                          <div key={s.skill} className="flex items-start gap-3">
                            <Badge variant={
                              priority === 'High' ? 'destructive' :
                              priority === 'Medium' ? 'default' : 'secondary'
                            }>
                              {priorityLabel}
                            </Badge>
                            <p className="text-sm flex-1">
                              {isIt ? (
                                <>Migliora la copertura curriculare per <strong>{s.skill}</strong> ({s.gap}% gap fra domanda e preparazione studenti)</>
                              ) : (
                                <>Improve curriculum coverage for <strong>{s.skill}</strong> ({s.gap}% gap between demand and student proficiency)</>
                              )}
                            </p>
                          </div>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Competenze più richieste' : 'Top Skills in Demand'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Competenze con maggiore domanda dagli annunci di lavoro' : 'Highest market demand skills from job postings'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : skillsGap.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato sulla domanda disponibile' : 'No demand data available'} />
                ) : (
                  <div className="space-y-4">
                    {skillsGap
                      .sort((a, b) => b.demand - a.demand)
                      .slice(0, 6)
                      .map((s) => (
                        <div key={s.skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{s.skill}</span>
                            <Badge variant="outline">{s.demand}% {isIt ? 'domanda' : 'demand'}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {isIt ? 'Studenti' : 'Students'}: {s.students}%
                            </Badge>
                            <Badge
                              variant={s.gap > 20 ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {isIt ? 'Gap' : 'Gap'}: {s.gap}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          </>
        </TabsContent>

        {/* ===================== EMPLOYERS TAB ===================== */}
        <TabsContent value="employers" className="space-y-6">
          <>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{isIt ? 'Visualizzazioni profilo totali' : 'Total Profile Views'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{employers?.totalViews ?? 0}</div>
                    <p className="text-xs text-muted-foreground">{isIt ? 'Da recruiter negli ultimi 6 mesi' : 'By recruiters in last 6 months'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{isIt ? 'Contatti totali' : 'Total Contacts Made'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{employers?.totalContacts ?? 0}</div>
                    <p className="text-xs text-muted-foreground">{isIt ? 'Recruiter che hanno contattato studenti' : 'Recruiters reaching out to students'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{isIt ? 'Aziende uniche' : 'Unique Companies'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{employers?.uniqueCompanies ?? 0}</div>
                    <p className="text-xs text-muted-foreground">{isIt ? 'In contatto con i tuoi studenti' : 'Engaging with your students'}</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isIt ? 'Aziende più attive' : 'Top Engaging Companies'}</CardTitle>
              <CardDescription>
                {isIt ? 'Aziende che visualizzano e contattano di più i tuoi studenti' : 'Companies most actively viewing and contacting your students'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ChartSkeleton />
              ) : !employers || employers.topCompanies.length === 0 ? (
                <EmptyState message={isIt ? 'Nessun dato di interazione disponibile' : 'No employer engagement data available'} />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={employers.topCompanies.slice(0, 8)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="company" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" name="Profile Views" />
                    <Bar dataKey="contacts" fill="#82ca9d" name="Contacts" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Top aziende per visualizzazioni' : 'Top Companies by Views'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Aziende con maggiore interazione sui profili studenti' : 'Companies with highest student profile engagement'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : !employers || employers.topCompanies.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato sulle aziende disponibile' : 'No company data available'} />
                ) : (
                  <div className="space-y-4">
                    {employers.topCompanies.slice(0, 5).map((company) => (
                      <div key={company.company} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{company.company}</p>
                          <p className="text-sm text-muted-foreground">{company.views} {isIt ? 'visualizzazioni' : 'views'}, {company.contacts} {isIt ? 'contatti' : 'contacts'}</p>
                        </div>
                        <Badge variant="default">
                          {company.views} {isIt ? 'visualizzazioni' : 'views'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Riepilogo engagement' : 'Engagement Summary'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Metriche complessive di attività dei recruiter' : 'Overall recruiter activity metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={3} />
                ) : !employers ? (
                  <EmptyState message={isIt ? 'Nessun dato di engagement disponibile' : 'No engagement data available'} />
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{isIt ? 'Visualizzazioni profilo' : 'Profile Views'}</span>
                        <span className="text-sm text-muted-foreground">{employers.totalViews}</span>
                      </div>
                      <Progress value={Math.min(employers.totalViews, 100)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{isIt ? 'Contatti effettuati' : 'Contacts Made'}</span>
                        <span className="text-sm text-muted-foreground">{employers.totalContacts}</span>
                      </div>
                      <Progress value={Math.min(employers.totalContacts, 100)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{isIt ? 'Aziende uniche' : 'Unique Companies'}</span>
                        <span className="text-sm text-muted-foreground">{employers.uniqueCompanies}</span>
                      </div>
                      <Progress value={Math.min(employers.uniqueCompanies, 100)} className="h-2" />
                    </div>
                    {employers.totalViews > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          {isIt
                            ? `Tasso di contatto: ${((employers.totalContacts / employers.totalViews) * 100).toFixed(1)}% delle visualizzazioni ha portato a un contatto`
                            : `Contact rate: ${((employers.totalContacts / employers.totalViews) * 100).toFixed(1)}% of views led to contact`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          </>
        </TabsContent>

        {/* ===================== SALARY TAB ===================== */}
        <TabsContent value="salary" className="space-y-6">
          <>
          <Card>
            <CardHeader>
              <CardTitle>{isIt ? 'Stipendi per corso di laurea' : 'Salary by Major / Degree'}</CardTitle>
              <CardDescription>
                {isIt ? 'Stipendio medio, minimo e massimo per corso' : 'Average, minimum, and maximum salary across programs'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ChartSkeleton height={400} />
              ) : salary.length === 0 ? (
                <EmptyState message={isIt ? 'Nessun dato sugli stipendi disponibile' : 'No salary data available'} />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={salary} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="major" />
                    <YAxis tickFormatter={(value: number) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="min" fill="#8884d8" name="Minimum" />
                    <Bar dataKey="avg" fill="#82ca9d" name="Average" />
                    <Bar dataKey="max" fill="#ffc658" name="Maximum" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Dettagli stipendi per corso' : 'Salary Details by Major'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Dettaglio per ogni corso di studio' : 'Detailed breakdown per program'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : salary.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato sugli stipendi disponibile' : 'No salary data available'} />
                ) : (
                  <div className="space-y-4">
                    {salary.map((item) => (
                      <div key={item.major} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.major}</span>
                          <span className="text-sm font-bold">${item.avg.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{isIt ? 'Min' : 'Min'}: ${item.min.toLocaleString()}</span>
                          <span>|</span>
                          <span>{isIt ? 'Max' : 'Max'}: ${item.max.toLocaleString()}</span>
                          <span>|</span>
                          <span>{item.count} {isIt ? 'placement' : 'placements'}</span>
                        </div>
                        <Progress
                          value={salary[0] ? (item.avg / salary[0].avg) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Distribuzione range stipendi' : 'Salary Range Distribution'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Differenza fra stipendio minimo e massimo' : 'Spread between minimum and maximum salaries'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : salary.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato sugli stipendi disponibile' : 'No salary data available'} />
                ) : (
                  <div className="space-y-4">
                    {salary.map((item) => {
                      const range = item.max - item.min
                      return (
                        <div key={item.major} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.major}</p>
                            <p className="text-sm text-muted-foreground">
                              ${(item.min / 1000).toFixed(0)}k - ${(item.max / 1000).toFixed(0)}k
                            </p>
                          </div>
                          <Badge className="bg-primary">
                            {isIt ? `range $${(range / 1000).toFixed(0)}k` : `$${(range / 1000).toFixed(0)}k range`}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          </>
        </TabsContent>

        {/* ===================== BENCHMARK TAB ===================== */}
        <TabsContent value="benchmark" className="space-y-6">
          <>
          <Card>
            <CardHeader>
              <CardTitle>{isIt ? 'Analisi competitiva' : 'Competitive Analysis'}</CardTitle>
              <CardDescription>
                {isIt ? 'Come ci posizioniamo rispetto ad altre istituzioni' : 'How we compare to peer institutions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ListSkeleton rows={5} />
              ) : benchmark.length === 0 ? (
                <EmptyState message={isIt ? 'Nessun dato di benchmark disponibile' : 'No benchmark data available'} />
              ) : (
                <div className="space-y-4">
                  {benchmark.map((university) => (
                    <div key={university.university} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            #{university.rank}
                          </div>
                          <div>
                            <h3 className="font-medium">{university.university}</h3>
                            <p className="text-sm text-muted-foreground">
                              {university.isOwn ? (isIt ? 'Tua istituzione' : 'Current Institution') : (isIt ? 'Competitor' : 'Competitor')} - {university.placements} {isIt ? 'placement' : 'placements'}
                            </p>
                          </div>
                        </div>
                        {university.isOwn && (
                          <Badge variant="outline">{isIt ? 'Tu' : 'Us'}</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{isIt ? 'Tasso di placement' : 'Placement Rate'}</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-lg">{university.placementRate}%</p>
                            <Progress value={university.placementRate} className="flex-1 h-2" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{isIt ? 'Stipendio medio' : 'Average Salary'}</p>
                          <p className="font-medium text-lg">${(university.avgSalary / 1000).toFixed(0)}k</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Grafico benchmark' : 'Benchmark Chart'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Confronto del tasso di placement fra istituzioni' : 'Placement rate comparison across institutions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : benchmark.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato di benchmark disponibile' : 'No benchmark data available'} />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={benchmark} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="university" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="placementRate" name="Placement Rate %">
                        {benchmark.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isOwn ? '#8884d8' : '#ccc'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isIt ? 'Panoramica ranking' : 'Ranking Overview'}</CardTitle>
                <CardDescription>
                  {isIt ? 'Metriche chiave a confronto con altre istituzioni' : 'Key metrics compared to other institutions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : benchmark.length === 0 ? (
                  <EmptyState message={isIt ? 'Nessun dato di ranking disponibile' : 'No ranking data available'} />
                ) : (() => {
                  const own = benchmark.find((b) => b.isOwn)
                  const topRate = benchmark.length > 0 ? benchmark[0].placementRate : 0
                  const avgRate = benchmark.length > 0
                    ? Math.round(benchmark.reduce((sum, b) => sum + b.placementRate, 0) / benchmark.length)
                    : 0
                  const topSalary = benchmark.length > 0
                    ? Math.max(...benchmark.map(b => b.avgSalary))
                    : 0
                  const avgSalary = benchmark.length > 0
                    ? Math.round(benchmark.reduce((sum, b) => sum + b.avgSalary, 0) / benchmark.length)
                    : 0

                  return (
                    <div className="space-y-4">
                      {own && (
                        <div className="space-y-2 pb-3 border-b">
                          <p className="text-sm font-medium">{isIt ? 'La tua posizione' : 'Your Position'}</p>
                          <p className="text-2xl font-bold">{isIt ? `Posizione #${own.rank} su ${benchmark.length}` : `Rank #${own.rank} of ${benchmark.length}`}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{isIt ? 'Tasso di placement migliore' : 'Top Placement Rate'}</span>
                          <span className="text-sm font-medium">{topRate}%</span>
                        </div>
                        <Progress value={topRate} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{isIt ? 'Tasso di placement medio' : 'Average Placement Rate'}</span>
                          <span className="text-sm font-medium">{avgRate}%</span>
                        </div>
                        <Progress value={avgRate} className="h-2" />
                      </div>
                      {own && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{isIt ? 'Il tuo tasso di placement' : 'Your Placement Rate'}</span>
                            <span className="text-sm font-medium">{own.placementRate}%</span>
                          </div>
                          <Progress value={own.placementRate} className="h-2" />
                        </div>
                      )}
                      <div className="pt-2 border-t text-sm text-muted-foreground">
                        <p>{isIt ? `Stipendio top: $${(topSalary / 1000).toFixed(0)}k | Media: $${(avgSalary / 1000).toFixed(0)}k` : `Top salary: $${(topSalary / 1000).toFixed(0)}k | Average: $${(avgSalary / 1000).toFixed(0)}k`}</p>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
          </>
        </TabsContent>
      </Tabs>
    </div>
  )
}
