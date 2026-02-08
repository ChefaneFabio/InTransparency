'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

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

interface AnalyticsData {
  overview?: OverviewData
  placement?: PlacementData
  industryDistribution?: IndustryItem[]
  skillsGap?: SkillGapItem[]
  employers?: EmployersData
  salary?: SalaryItem[]
  benchmark?: BenchmarkItem[]
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
  const [activeTab, setActiveTab] = useState('overview')
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
      setError(err.message || 'An unexpected error occurred')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">University Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into student outcomes and program effectiveness
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
            <SelectItem value="2years">Last 2 Years</SelectItem>
            <SelectItem value="5years">Last 5 Years</SelectItem>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="placement">Placement</TabsTrigger>
          <TabsTrigger value="skills">Skills Gap</TabsTrigger>
          <TabsTrigger value="employers">Employers</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
        </TabsList>

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
                    <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview?.placementRate ?? 0}%</div>
                    <p className="text-xs text-muted-foreground">
                      Based on confirmed placements
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Starting Salary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${(overview?.avgSalary ?? 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From confirmed full-time placements
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Employer Partners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview?.employerPartners ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Unique confirmed companies
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overview?.totalStudents ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Enrolled at your institution
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Placement Rate Trends</CardTitle>
                <CardDescription>
                  Trend of graduate placement rates over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : placementTrends.length === 0 ? (
                  <EmptyState message="No placement trend data available" />
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
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>
                  Where our graduates are being placed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : industryDistribution.length === 0 ? (
                  <EmptyState message="No industry distribution data available" />
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
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Placement Summary</CardTitle>
                <CardDescription>
                  Breakdown of placement statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={4} />
                ) : !placement ? (
                  <EmptyState message="No placement data available" />
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: 'Total Placements', value: placement.totalPlacements },
                      { label: 'Confirmed', value: placement.confirmed },
                      { label: 'Pending', value: placement.pending },
                      { label: 'Declined', value: placement.declined },
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
                        <span className="font-medium">Placement Rate</span>
                        <span className="text-sm font-bold">{placement.placementRate}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-medium">Average Salary</span>
                        <span className="text-sm font-bold">${placement.avgSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Placement Rate Over Time</CardTitle>
                <CardDescription>
                  Yearly placement rate progression
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : placementTrends.length === 0 ? (
                  <EmptyState message="No trend data available" />
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
              <CardTitle>Graduate Outcomes Over Time</CardTitle>
              <CardDescription>
                Placement rate and average salary progression for recent graduates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ChartSkeleton />
              ) : placementTrends.length === 0 ? (
                <EmptyState message="No graduate outcome data available" />
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
          <Card>
            <CardHeader>
              <CardTitle>Skills Gap Analysis</CardTitle>
              <CardDescription>
                Market demand vs student proficiency in key technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ListSkeleton rows={6} />
              ) : skillsGap.length === 0 ? (
                <EmptyState message="No skills gap data available" />
              ) : (
                <div className="space-y-6">
                  {skillsGap.map((skill) => (
                    <div key={skill.skill} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{skill.skill}</h3>
                        <Badge variant={skill.gap > 30 ? 'destructive' : skill.gap > 15 ? 'default' : 'secondary'}>
                          {skill.gap}% gap
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Market Demand</span>
                            <span>{skill.demand}%</span>
                          </div>
                          <Progress value={skill.demand} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Student Proficiency</span>
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
                <CardTitle>Curriculum Recommendations</CardTitle>
                <CardDescription>
                  Suggested improvements based on market gaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : skillsGap.length === 0 ? (
                  <EmptyState message="No recommendations available" />
                ) : (
                  <div className="space-y-4">
                    {skillsGap
                      .filter((s) => s.gap > 0)
                      .slice(0, 5)
                      .map((s) => {
                        const priority = s.gap > 30 ? 'High' : s.gap > 15 ? 'Medium' : 'Low'
                        return (
                          <div key={s.skill} className="flex items-start gap-3">
                            <Badge variant={
                              priority === 'High' ? 'destructive' :
                              priority === 'Medium' ? 'default' : 'secondary'
                            }>
                              {priority}
                            </Badge>
                            <p className="text-sm flex-1">
                              Improve curriculum coverage for <strong>{s.skill}</strong> ({s.gap}% gap between demand and student proficiency)
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
                <CardTitle>Top Skills in Demand</CardTitle>
                <CardDescription>
                  Highest market demand skills from job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : skillsGap.length === 0 ? (
                  <EmptyState message="No demand data available" />
                ) : (
                  <div className="space-y-4">
                    {skillsGap
                      .sort((a, b) => b.demand - a.demand)
                      .slice(0, 6)
                      .map((s) => (
                        <div key={s.skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{s.skill}</span>
                            <Badge variant="outline">{s.demand}% demand</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              Students: {s.students}%
                            </Badge>
                            <Badge
                              variant={s.gap > 20 ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              Gap: {s.gap}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===================== EMPLOYERS TAB ===================== */}
        <TabsContent value="employers" className="space-y-6">
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
                    <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{employers?.totalViews ?? 0}</div>
                    <p className="text-xs text-muted-foreground">By recruiters in last 6 months</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Contacts Made</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{employers?.totalContacts ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Recruiters reaching out to students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Companies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{employers?.uniqueCompanies ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Engaging with your students</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Engaging Companies</CardTitle>
              <CardDescription>
                Companies most actively viewing and contacting your students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ChartSkeleton />
              ) : !employers || employers.topCompanies.length === 0 ? (
                <EmptyState message="No employer engagement data available" />
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
                <CardTitle>Top Companies by Views</CardTitle>
                <CardDescription>
                  Companies with highest student profile engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : !employers || employers.topCompanies.length === 0 ? (
                  <EmptyState message="No company data available" />
                ) : (
                  <div className="space-y-4">
                    {employers.topCompanies.slice(0, 5).map((company) => (
                      <div key={company.company} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{company.company}</p>
                          <p className="text-sm text-muted-foreground">{company.views} views, {company.contacts} contacts</p>
                        </div>
                        <Badge variant="default">
                          {company.views} views
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Summary</CardTitle>
                <CardDescription>
                  Overall recruiter activity metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={3} />
                ) : !employers ? (
                  <EmptyState message="No engagement data available" />
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Profile Views</span>
                        <span className="text-sm text-muted-foreground">{employers.totalViews}</span>
                      </div>
                      <Progress value={Math.min(employers.totalViews, 100)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Contacts Made</span>
                        <span className="text-sm text-muted-foreground">{employers.totalContacts}</span>
                      </div>
                      <Progress value={Math.min(employers.totalContacts, 100)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Unique Companies</span>
                        <span className="text-sm text-muted-foreground">{employers.uniqueCompanies}</span>
                      </div>
                      <Progress value={Math.min(employers.uniqueCompanies, 100)} className="h-2" />
                    </div>
                    {employers.totalViews > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          Contact rate: {((employers.totalContacts / employers.totalViews) * 100).toFixed(1)}% of views led to contact
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===================== SALARY TAB ===================== */}
        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary by Major / Degree</CardTitle>
              <CardDescription>
                Average, minimum, and maximum salary across programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ChartSkeleton height={400} />
              ) : salary.length === 0 ? (
                <EmptyState message="No salary data available" />
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
                <CardTitle>Salary Details by Major</CardTitle>
                <CardDescription>
                  Detailed breakdown per program
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : salary.length === 0 ? (
                  <EmptyState message="No salary data available" />
                ) : (
                  <div className="space-y-4">
                    {salary.map((item) => (
                      <div key={item.major} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.major}</span>
                          <span className="text-sm font-bold">${item.avg.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Min: ${item.min.toLocaleString()}</span>
                          <span>|</span>
                          <span>Max: ${item.max.toLocaleString()}</span>
                          <span>|</span>
                          <span>{item.count} placements</span>
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
                <CardTitle>Salary Range Distribution</CardTitle>
                <CardDescription>
                  Spread between minimum and maximum salaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : salary.length === 0 ? (
                  <EmptyState message="No salary data available" />
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
                          <Badge className="bg-green-600">
                            ${(range / 1000).toFixed(0)}k range
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===================== BENCHMARK TAB ===================== */}
        <TabsContent value="benchmark" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
              <CardDescription>
                How we compare to peer institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ListSkeleton rows={5} />
              ) : benchmark.length === 0 ? (
                <EmptyState message="No benchmark data available" />
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
                              {university.isOwn ? 'Current Institution' : 'Competitor'} - {university.placements} placements
                            </p>
                          </div>
                        </div>
                        {university.isOwn && (
                          <Badge variant="outline">Us</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Placement Rate</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-lg">{university.placementRate}%</p>
                            <Progress value={university.placementRate} className="flex-1 h-2" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average Salary</p>
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
                <CardTitle>Benchmark Chart</CardTitle>
                <CardDescription>
                  Placement rate comparison across institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : benchmark.length === 0 ? (
                  <EmptyState message="No benchmark data available" />
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
                <CardTitle>Ranking Overview</CardTitle>
                <CardDescription>
                  Key metrics compared to other institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ListSkeleton rows={5} />
                ) : benchmark.length === 0 ? (
                  <EmptyState message="No ranking data available" />
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
                          <p className="text-sm font-medium">Your Position</p>
                          <p className="text-2xl font-bold">Rank #{own.rank} of {benchmark.length}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Top Placement Rate</span>
                          <span className="text-sm font-medium">{topRate}%</span>
                        </div>
                        <Progress value={topRate} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Average Placement Rate</span>
                          <span className="text-sm font-medium">{avgRate}%</span>
                        </div>
                        <Progress value={avgRate} className="h-2" />
                      </div>
                      {own && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Your Placement Rate</span>
                            <span className="text-sm font-medium">{own.placementRate}%</span>
                          </div>
                          <Progress value={own.placementRate} className="h-2" />
                        </div>
                      )}
                      <div className="pt-2 border-t text-sm text-muted-foreground">
                        <p>Top salary: ${(topSalary / 1000).toFixed(0)}k | Average: ${(avgSalary / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
