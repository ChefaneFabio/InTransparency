'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, GraduationCap, Briefcase, TrendingUp, Users, Plus, Building2, MapPin, ExternalLink } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Alumni {
  id: string
  userId: string
  name: string
  email: string
  photo: string | null
  graduationYear: string
  degree: string | null
  department: string | null
  currentCompany: string | null
  currentRole: string | null
  currentIndustry: string | null
  employmentStatus: string
  salary: number | null
  salaryCurrency: string | null
  location: string | null
  linkedInUrl: string | null
}

interface Stats {
  total: number
  employed: number
  seeking: number
  furtherStudy: number
  avgSalary: number
  employmentRate: number
}

interface IndustryItem {
  name: string
  count: number
}

const BAR_OPACITIES = ['bg-primary', 'bg-primary/80', 'bg-primary/60', 'bg-primary/40', 'bg-primary/25']

const statusColors: Record<string, string> = {
  EMPLOYED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  SEEKING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  FURTHER_STUDY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  OTHER: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

export default function AlumniPage() {
  const t = useTranslations('universityAlumni')
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [industryBreakdown, setIndustryBreakdown] = useState<IndustryItem[]>([])
  const [filterYears, setFilterYears] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  const fetchAlumni = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (statusFilter) params.set('status', statusFilter)
      if (yearFilter) params.set('year', yearFilter)

      const res = await fetch(`/api/dashboard/university/alumni?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAlumni(data.alumni)
      setStats(data.stats)
      setIndustryBreakdown(data.industryBreakdown)
      setFilterYears(data.filters.years)
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFilter, yearFilter, t])

  useEffect(() => { fetchAlumni() }, [fetchAlumni])

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      EMPLOYED: t('statusEmployed'),
      SEEKING: t('statusSeeking'),
      FURTHER_STUDY: t('statusFurtherStudy'),
      OTHER: t('statusOther'),
    }
    return labels[status] || status
  }

  const statCards = [
    { label: t('stats.total'), value: stats?.total ?? 0, icon: GraduationCap },
    { label: t('stats.employmentRate'), value: stats ? `${stats.employmentRate}%` : '0%', icon: TrendingUp },
    { label: t('stats.avgSalary'), value: stats && stats.avgSalary > 0 ? `€${(stats.avgSalary / 1000).toFixed(0)}k` : '—', icon: Briefcase },
    { label: t('stats.seeking'), value: stats?.seeking ?? 0, icon: Users },
  ]

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="primary">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
      </MetricHero>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <GlassCard key={card.label} delay={0.1 + i * 0.05}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{card.label}</span>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">{t('tabs.list')}</TabsTrigger>
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
        </TabsList>

        {/* Alumni List */}
        <TabsContent value="list" className="space-y-6">
          <GlassCard delay={0.1}>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder={t('filters.year')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allYears')}</SelectItem>
                    {filterYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('filters.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
                    <SelectItem value="EMPLOYED">{t('statusEmployed')}</SelectItem>
                    <SelectItem value="SEEKING">{t('statusSeeking')}</SelectItem>
                    <SelectItem value="FURTHER_STUDY">{t('statusFurtherStudy')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassCard>

          {error && (
            <Card><CardContent className="pt-6">
              <p className="text-sm text-destructive text-center">{error}</p>
              <div className="flex justify-center mt-2">
                <Button variant="outline" size="sm" onClick={fetchAlumni}>{t('retry')}</Button>
              </div>
            </CardContent></Card>
          )}

          {loading && (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i}><CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent></Card>
              ))}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4">
              {alumni.map(a => (
                <Card key={a.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={a.photo || ''} />
                        <AvatarFallback>{a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{a.name}</h3>
                          <Badge variant="outline">{a.graduationYear}</Badge>
                          <Badge className={statusColors[a.employmentStatus] || statusColors.OTHER}>
                            {statusLabel(a.employmentStatus)}
                          </Badge>
                        </div>
                        {a.degree && <p className="text-sm text-muted-foreground mt-0.5">{a.degree}</p>}
                        <div className="flex items-center gap-4 mt-2 flex-wrap text-sm">
                          {a.currentCompany && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                              {a.currentRole ? `${a.currentRole} @ ${a.currentCompany}` : a.currentCompany}
                            </span>
                          )}
                          {a.location && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" /> {a.location}
                            </span>
                          )}
                          {a.salary && (
                            <span className="font-medium">
                              €{(a.salary / 1000).toFixed(0)}k/{t('year')}
                            </span>
                          )}
                        </div>
                      </div>
                      {a.linkedInUrl && (
                        <a href={a.linkedInUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {alumni.length === 0 && (
                <GlassCard delay={0.1}>
                  <div className="p-12 text-center">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="font-semibold text-lg">{t('noAlumni')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('noAlumniHint')}</p>
                  </div>
                </GlassCard>
              )}
            </div>
          )}
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Employment Status */}
            <Card>
              <CardHeader>
                <CardTitle>{t('overview.statusTitle')}</CardTitle>
                <CardDescription>{t('overview.statusDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    ))}
                  </div>
                ) : stats && stats.total > 0 ? (
                  <div className="space-y-4">
                    {[
                      { key: 'EMPLOYED', count: stats.employed, label: t('statusEmployed') },
                      { key: 'SEEKING', count: stats.seeking, label: t('statusSeeking') },
                      { key: 'FURTHER_STUDY', count: stats.furtherStudy, label: t('statusFurtherStudy') },
                      { key: 'OTHER', count: stats.total - stats.employed - stats.seeking - stats.furtherStudy, label: t('statusOther') },
                    ].map((item, i) => {
                      const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0
                      return (
                        <div key={item.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{item.label}</span>
                            <span className="text-sm font-medium tabular-nums">{item.count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`${BAR_OPACITIES[i] || 'bg-primary/20'} h-2 rounded-full transition-all`}
                              style={{ width: `${Math.max(pct, 1)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('noData')}</p>
                )}
              </CardContent>
            </Card>

            {/* Industry Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>{t('overview.industryTitle')}</CardTitle>
                <CardDescription>{t('overview.industryDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    ))}
                  </div>
                ) : industryBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {industryBreakdown.slice(0, 8).map((item, i) => {
                      const maxCount = industryBreakdown[0]?.count || 1
                      const barWidth = Math.round((item.count / maxCount) * 100)
                      return (
                        <div key={item.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.name}</span>
                            <span className="font-medium tabular-nums">{item.count}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className={`${BAR_OPACITIES[i % BAR_OPACITIES.length]} h-1.5 rounded-full transition-all`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('noData')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
