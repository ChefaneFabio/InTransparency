'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'
import { Search, Download, UserPlus, GraduationCap, CheckCircle, Globe, TrendingUp, Database } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Student {
  id: string
  name: string
  email: string
  major: string
  year: string
  gpa: number | null
  projects: number
  applications: number
  verified: boolean
  profilePublic: boolean
  lastActive: string | null
  joinedAt: string
  avatar: string
  photo: string | null
}

interface Stats {
  totalStudents: number
  verifiedStudents: number
  activeProfiles: number
}

interface ApiResponse {
  students: Student[]
  total: number
  page: number
  totalPages: number
  stats: Stats
  filters: {
    degrees: string[]
  }
}

interface PerformanceData {
  gpaDistribution: Array<{ key: string; count: number; percentage: number }>
  employabilityDistribution: Array<{ key: string; count: number; percentage: number; color: string }>
  placementStatus: Array<{ key: string; count: number; color: string }>
  salaryDistribution: Array<{ key: string; count: number }>
  industryDistribution: Array<{ industry: string; count: number }>
  totalStudents: number
  totalWithGpa: number
  totalWithPredictions: number
  platformBenchmark: {
    avgSalary: number
    medianSalary: number
    p25Salary: number
    p75Salary: number
    totalDataPoints: number
    byIndustry: Array<{ industry: string; avgSalary: number; count: number }>
    byRole: Array<{ role: string; avgSalary: number; count: number }>
  }
  universityComparison: {
    yourAvgSalary: number
    yourMedianSalary: number
    yourDataPoints: number
    platformAvgSalary: number
    platformMedianSalary: number
    platformDataPoints: number
    differencePercent: number
    sources: { placements: number; alumni: number; jobPostings: number }
  }
  eurostatBenchmarks: Array<{ sector: string; naceCode: string; avgAnnualSalary: number; currency: string; country: string; year: number }>
  dataSources: { placements: number; alumni: number; jobPostings: number; platformTotal: number; eurostat: number }
}

// Bar opacity steps for ranked/tiered data — uses primary color at different opacities
const BAR_OPACITIES = ['bg-primary', 'bg-primary/80', 'bg-primary/60', 'bg-primary/40', 'bg-primary/25']

export default function UniversityStudents() {
  const t = useTranslations('universityStudents')
  const [searchTerm, setSearchTerm] = useState('')
  const [majorFilter, setMajorFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)

  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [degrees, setDegrees] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [perfData, setPerfData] = useState<PerformanceData | null>(null)
  const [perfLoading, setPerfLoading] = useState(false)

  const formatRelativeTime = useCallback((dateString: string | null): string => {
    if (!dateString) return t('time.never')
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return t('time.justNow')
    if (diffMinutes < 60) return t('time.minutesAgo', { count: diffMinutes })
    if (diffHours < 24) return t('time.hoursAgo', { count: diffHours })
    if (diffDays < 30) return t('time.daysAgo', { count: diffDays })
    return date.toLocaleDateString()
  }, [t])

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (majorFilter !== 'all') params.set('major', majorFilter)
      if (yearFilter !== 'all') params.set('year', yearFilter)
      params.set('page', String(currentPage))
      params.set('limit', '50')

      const res = await fetch(`/api/dashboard/university/students?${params.toString()}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch students (${res.status})`)
      }

      const data: ApiResponse = await res.json()
      setStudents(data.students)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setStats(data.stats)
      setDegrees(data.filters.degrees)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'))
    } finally {
      setLoading(false)
    }
  }, [searchTerm, majorFilter, yearFilter, currentPage, t])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, majorFilter, yearFilter])

  useEffect(() => {
    const fetchPerformance = async () => {
      setPerfLoading(true)
      try {
        const res = await fetch('/api/dashboard/university/students/performance')
        if (res.ok) {
          const data = await res.json()
          setPerfData(data)
        }
      } catch (err) {
        console.error('Error fetching performance data:', err)
      } finally {
        setPerfLoading(false)
      }
    }
    fetchPerformance()
  }, [])

  const sortedStudents = Array.from(students).sort((a, b) => {
    switch (sortBy) {
      case 'gpa':
        return (b.gpa ?? 0) - (a.gpa ?? 0)
      case 'projects':
        return b.projects - a.projects
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="institution">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('exportData')}
            </Button>
            <Link href="./students/add">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                {t('addStudent')}
              </Button>
            </Link>
          </div>
        </div>
      </MetricHero>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="students">{t('tabs.students')}</TabsTrigger>
          <TabsTrigger value="performance">{t('tabs.performance')}</TabsTrigger>
          <TabsTrigger value="placement">{t('tabs.placement')}</TabsTrigger>
          <TabsTrigger value="market">{t('market.title')}</TabsTrigger>
        </TabsList>

        {/* ─── Overview ─── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <GlassCard delay={0.1}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('stats.totalStudents')}</span>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </div>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.totalStudents ?? 0}</div>
                    <p className="text-xs text-muted-foreground">{t('stats.enrolledIn')}</p>
                  </>
                )}
              </div>
            </GlassCard>
            <GlassCard delay={0.15}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('stats.verifiedStudents')}</span>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.verifiedStudents ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('stats.verified', {
                        percentage: stats && stats.totalStudents > 0
                          ? Math.round((stats.verifiedStudents / stats.totalStudents) * 100) : 0
                      })}
                    </p>
                  </>
                )}
              </div>
            </GlassCard>
            <GlassCard delay={0.2}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('stats.activeProfiles')}</span>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.activeProfiles ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('stats.publicProfiles', {
                        percentage: stats && stats.totalStudents > 0
                          ? Math.round((stats.activeProfiles / stats.totalStudents) * 100) : 0
                      })}
                    </p>
                  </>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard delay={0.15}>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{t('topStudents.title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('topStudents.description')}</p>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(students)
                      .sort((a, b) => b.projects - a.projects)
                      .slice(0, 5)
                      .map((student, index) => (
                        <div key={student.id} className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photo || ''} />
                            <AvatarFallback className="text-xs">{student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.major || t('studentCard.noMajor')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{t('topStudents.projects', { count: student.projects })}</p>
                            <p className="text-xs text-muted-foreground">{t('topStudents.applications', { count: student.applications })}</p>
                          </div>
                        </div>
                      ))}
                    {students.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">{t('topStudents.noStudents')}</p>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard delay={0.2}>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{t('recentActivity.title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('recentActivity.description')}</p>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(students)
                      .filter(s => s.lastActive)
                      .sort((a, b) => new Date(b.lastActive!).getTime() - new Date(a.lastActive!).getTime())
                      .slice(0, 5)
                      .map((student) => (
                        <div key={student.id} className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photo || ''} />
                            <AvatarFallback className="text-xs">{student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.major || t('studentCard.noMajor')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{formatRelativeTime(student.lastActive)}</p>
                          </div>
                        </div>
                      ))}
                    {students.filter(s => s.lastActive).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">{t('recentActivity.noActivity')}</p>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* ─── Students ─── */}
        <TabsContent value="students" className="space-y-6">
          <GlassCard delay={0.1}>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={majorFilter} onValueChange={setMajorFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={t('filters.filterByMajor')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allMajors')}</SelectItem>
                    {degrees.map((degree) => (
                      <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder={t('filters.filterByYear')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allYears')}</SelectItem>
                    <SelectItem value="Freshman">{t('filters.freshman')}</SelectItem>
                    <SelectItem value="Sophomore">{t('filters.sophomore')}</SelectItem>
                    <SelectItem value="Junior">{t('filters.junior')}</SelectItem>
                    <SelectItem value="Senior">{t('filters.senior')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder={t('filters.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpa">{t('filters.gpa')}</SelectItem>
                    <SelectItem value="projects">{t('filters.projects')}</SelectItem>
                    <SelectItem value="name">{t('filters.name')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassCard>

          {error && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-destructive text-center">{error}</p>
                <div className="flex justify-center mt-2">
                  <Button variant="outline" size="sm" onClick={fetchStudents}>{t('retry')}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading && (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-56" />
                          <div className="flex gap-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="text-center">
                          <Skeleton className="h-8 w-10 mx-auto mb-1" />
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid gap-6">
                {sortedStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-sm transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.photo || ''} />
                            <AvatarFallback>{student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{student.name}</h3>
                              {student.verified && (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>{student.major || t('studentCard.noMajor')}</span>
                              {student.year && <Badge variant="outline">{student.year}</Badge>}
                              {student.gpa !== null && <span>{t('studentCard.gpaLabel')}: {student.gpa}</span>}
                            </div>
                          </div>
                        </div>
                        <div>
                          {student.profilePublic ? (
                            <Badge variant="outline" className="border-primary/50 text-primary">{t('studentCard.publicProfile')}</Badge>
                          ) : (
                            <Badge variant="secondary">{t('studentCard.privateProfile')}</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{student.projects}</p>
                            <p className="text-sm text-muted-foreground">{t('studentCard.projectsLabel')}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{student.applications}</p>
                            <p className="text-sm text-muted-foreground">{t('studentCard.applicationsLabel')}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm">{student.gpa !== null ? student.gpa.toFixed(2) : '—'}</p>
                            <p className="text-sm text-muted-foreground">{t('studentCard.gpaLabel')}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm">{formatRelativeTime(student.lastActive)}</p>
                            <p className="text-sm text-muted-foreground">{t('studentCard.lastActive')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm">{t('studentCard.viewProfile')}</Button>
                          <Button variant="outline" size="sm">{t('studentCard.sendMessage')}</Button>
                          <Button variant="outline" size="sm">{t('studentCard.exportReport')}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {sortedStudents.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center py-8">{t('noResults')}</p>
                  </CardContent>
                </Card>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t('pagination.showing', { count: sortedStudents.length, total })}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                      {t('pagination.previous')}
                    </Button>
                    <div className="flex items-center px-3 text-sm text-muted-foreground">
                      {t('pagination.page', { current: currentPage, total: totalPages })}
                    </div>
                    <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                      {t('pagination.next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* ─── Performance ─── */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('performance.gpaDistribution')}</CardTitle>
                <CardDescription>{t('performance.gpaDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {perfLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : perfData && perfData.totalWithGpa > 0 ? (
                  <div className="space-y-4">
                    {perfData.gpaDistribution.map((item, i) => (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{(item as any).label || t(`performance.gpaRanges.${item.key}`)}</span>
                          <span className="text-sm font-medium tabular-nums">
                            {t('performance.students', { count: item.count, percentage: item.percentage })}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`${BAR_OPACITIES[i] || 'bg-primary/20'} h-2 rounded-full transition-all`}
                            style={{ width: `${Math.max(item.percentage, 1)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('performance.noData')}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('performance.employabilityScores')}</CardTitle>
                <CardDescription>{t('performance.employabilityDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {perfLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : perfData && perfData.totalWithPredictions > 0 ? (
                  <div className="space-y-4">
                    {perfData.employabilityDistribution.map((item, i) => (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t(`performance.scoreRanges.${item.key}`)}</span>
                          <span className="text-sm font-medium tabular-nums">
                            {t('performance.students', { count: item.count, percentage: item.percentage })}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`${BAR_OPACITIES[i] || 'bg-primary/20'} h-2 rounded-full transition-all`}
                            style={{ width: `${Math.max(item.percentage, 1)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('performance.noData')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Placement ─── */}
        <TabsContent value="placement" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('placement.statusTitle')}</CardTitle>
                <CardDescription>{t('placement.statusDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {perfLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    ))}
                  </div>
                ) : perfData ? (
                  <div className="space-y-3">
                    {perfData.placementStatus.map((item, i) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${BAR_OPACITIES[i] || 'bg-primary/20'}`} />
                          <span className="text-sm">{t(`placement.statuses.${item.key}`)}</span>
                        </div>
                        <span className="text-sm font-medium tabular-nums">{item.count}</span>
                      </div>
                    ))}
                    {perfData.placementStatus.every(s => s.count === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-2">{t('placement.noData')}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('placement.noData')}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('placement.salaryTitle')}</CardTitle>
                <CardDescription>{t('placement.salaryDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {perfLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : perfData ? (
                  <div className="space-y-3">
                    {perfData.salaryDistribution.map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className="text-sm">{t(`placement.salaryRanges.${item.key}`)}</span>
                        <span className="text-sm font-medium tabular-nums">{t('placement.studentsCount', { count: item.count })}</span>
                      </div>
                    ))}
                    {perfData.salaryDistribution.every(s => s.count === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-2">{t('placement.noData')}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('placement.noData')}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('placement.industryTitle')}</CardTitle>
                <CardDescription>{t('placement.industryDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {perfLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                ) : perfData && perfData.industryDistribution.length > 0 ? (
                  <div className="space-y-3">
                    {perfData.industryDistribution.map((item) => (
                      <div key={item.industry} className="flex items-center justify-between">
                        <span className="text-sm">{item.industry}</span>
                        <span className="text-sm font-medium tabular-nums">{t('placement.studentsCount', { count: item.count })}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('placement.noData')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Market Context ─── */}
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>{t('market.comparisonTitle')}</CardTitle>
                  <CardDescription>{t('market.comparisonDescription')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {perfLoading ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              ) : perfData ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border-2 border-primary/30 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('market.yourUniversity')}</p>
                      <p className="text-2xl font-bold mt-2 tabular-nums">
                        {perfData.universityComparison.yourAvgSalary > 0
                          ? `€${(perfData.universityComparison.yourAvgSalary / 1000).toFixed(1)}k`
                          : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('market.avgSalary')} · {t('market.dataPoints', { count: perfData.universityComparison.yourDataPoints })}
                      </p>
                      {perfData.universityComparison.yourMedianSalary > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('market.medianSalary')}: €{(perfData.universityComparison.yourMedianSalary / 1000).toFixed(1)}k
                        </p>
                      )}
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('market.platformAvg')}</p>
                      <p className="text-2xl font-bold mt-2 tabular-nums">
                        {perfData.platformBenchmark.avgSalary > 0
                          ? `€${(perfData.platformBenchmark.avgSalary / 1000).toFixed(1)}k`
                          : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('market.avgSalary')} · {t('market.dataPoints', { count: perfData.platformBenchmark.totalDataPoints })}
                      </p>
                      {perfData.platformBenchmark.medianSalary > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('market.medianSalary')}: €{(perfData.platformBenchmark.medianSalary / 1000).toFixed(1)}k
                        </p>
                      )}
                    </div>

                    <div className="p-4 border rounded-lg flex flex-col justify-center">
                      {perfData.universityComparison.yourDataPoints > 0 && perfData.universityComparison.platformDataPoints > 0 ? (
                        <>
                          <p className="text-2xl font-bold tabular-nums">
                            {perfData.universityComparison.differencePercent > 0 ? '+' : ''}{perfData.universityComparison.differencePercent}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {perfData.universityComparison.differencePercent > 0
                              ? t('market.abovePlatform', { percent: perfData.universityComparison.differencePercent })
                              : perfData.universityComparison.differencePercent < 0
                                ? t('market.belowPlatform', { percent: Math.abs(perfData.universityComparison.differencePercent) })
                                : t('market.atPlatform')}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">{t('market.noMarketData')}</p>
                      )}
                    </div>
                  </div>

                  {perfData.dataSources && (
                    <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground border-t pt-4">
                      <Database className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="font-medium">{t('market.dataSources')}:</span>
                      <span>{t('market.sourcePlacements')} {perfData.dataSources.placements}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{t('market.sourceAlumni')} {perfData.dataSources.alumni}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{t('market.sourceJobs')} {perfData.dataSources.jobPostings}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{t('market.sourceEurostat')} {perfData.dataSources.eurostat}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">{t('market.noMarketData')}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('market.salaryByIndustry')}</CardTitle>
                <CardDescription>{t('market.salaryByIndustryDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {perfLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                ) : perfData && perfData.platformBenchmark.byIndustry.length > 0 ? (
                  <div className="space-y-3">
                    {perfData.platformBenchmark.byIndustry.map((item) => {
                      const maxSalary = perfData.platformBenchmark.byIndustry[0]?.avgSalary || 1
                      const barWidth = Math.round((item.avgSalary / maxSalary) * 100)
                      return (
                        <div key={item.industry} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.industry}</span>
                            <span className="font-medium tabular-nums">€{(item.avgSalary / 1000).toFixed(1)}k{t('market.perYear')}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div className="bg-primary/70 h-1.5 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground">{t('market.dataPoints', { count: item.count })}</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('market.noMarketData')}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('market.marketBenchmarks')}</CardTitle>
                <CardDescription>{t('market.marketBenchmarksDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {perfLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                ) : perfData && perfData.eurostatBenchmarks.length > 0 ? (
                  <div className="space-y-3">
                    {Array.from(perfData.eurostatBenchmarks)
                      .sort((a, b) => b.avgAnnualSalary - a.avgAnnualSalary)
                      .map((item) => {
                        const maxSalary = Math.max(...perfData.eurostatBenchmarks.map(b => b.avgAnnualSalary))
                        const barWidth = Math.round((item.avgAnnualSalary / maxSalary) * 100)
                        const platformMatch = perfData.platformBenchmark.byIndustry.find(
                          p => p.industry.toLowerCase() === item.sector.toLowerCase()
                        )
                        return (
                          <div key={item.naceCode} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span>{item.sector}</span>
                              <span className="font-medium tabular-nums">€{(item.avgAnnualSalary / 1000).toFixed(1)}k{t('market.perYear')}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div className="bg-primary/50 h-1.5 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                            </div>
                            {platformMatch && (
                              <p className="text-xs text-muted-foreground">
                                {t('market.platformAvg')}: €{(platformMatch.avgSalary / 1000).toFixed(1)}k
                              </p>
                            )}
                          </div>
                        )
                      })}
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                      {t('market.eurostat')} · {perfData.eurostatBenchmarks[0]?.year}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('market.noMarketData')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
