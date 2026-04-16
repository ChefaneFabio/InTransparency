'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Building2, Users, Briefcase, TrendingUp, Mail, Eye, Heart } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Recruiter {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  studentsHired: number
  studentsContacted: number
  avgSalaryOffered: number
  isPartner: boolean
  lastActivity: string
  status: string
}

interface Stats {
  total: number
  partners: number
  totalHired: number
  activeThisMonth: number
}

export default function RecruitersPage() {
  const t = useTranslations('universityRecruiters')
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchRecruiters = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/university/recruiters')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRecruiters(data.recruiters)
      setStats(data.stats)
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { fetchRecruiters() }, [fetchRecruiters])

  const formatRelativeTime = (dateString: string): string => {
    if (!dateString) return t('never')
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
    if (diffDays < 1) return t('today')
    if (diffDays < 7) return t('daysAgo', { count: diffDays })
    if (diffDays < 30) return t('weeksAgo', { count: Math.floor(diffDays / 7) })
    return date.toLocaleDateString()
  }

  const filtered = recruiters.filter(r => {
    const matchSearch = !searchTerm ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contactName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const statCards = [
    { label: t('stats.totalCompanies'), value: stats?.total ?? 0, icon: Building2, delay: 0.1 },
    { label: t('stats.partners'), value: stats?.partners ?? 0, icon: Heart, delay: 0.15 },
    { label: t('stats.totalHired'), value: stats?.totalHired ?? 0, icon: Briefcase, delay: 0.2 },
    { label: t('stats.activeThisMonth'), value: stats?.activeThisMonth ?? 0, icon: TrendingUp, delay: 0.25 },
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
        {statCards.map(card => (
          <GlassCard key={card.label} delay={card.delay}>
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

      {/* Filters */}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('filters.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.all')}</SelectItem>
                <SelectItem value="active">{t('filters.active')}</SelectItem>
                <SelectItem value="inactive">{t('filters.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive text-center">{error}</p>
            <div className="flex justify-center mt-2">
              <Button variant="outline" size="sm" onClick={fetchRecruiters}>{t('retry')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="text-center">
                      <Skeleton className="h-6 w-10 mx-auto mb-1" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recruiter List */}
      {!loading && !error && (
        <div className="grid gap-4">
          {filtered.map(recruiter => (
            <Card key={recruiter.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{recruiter.companyName}</h3>
                        {recruiter.isPartner && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">{t('partner')}</Badge>
                        )}
                      </div>
                      {recruiter.contactName && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Users className="h-3.5 w-3.5" /> {recruiter.contactName}
                          {recruiter.contactEmail && (
                            <span className="flex items-center gap-1 ml-3">
                              <Mail className="h-3.5 w-3.5" /> {recruiter.contactEmail}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={recruiter.status === 'active' ? 'default' : 'secondary'}>
                    {recruiter.status === 'active' ? t('active') : t('inactive')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{recruiter.studentsHired}</p>
                    <p className="text-xs text-muted-foreground">{t('metrics.hired')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{recruiter.studentsContacted}</p>
                    <p className="text-xs text-muted-foreground">{t('metrics.contacted')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {recruiter.avgSalaryOffered > 0 ? `€${(recruiter.avgSalaryOffered / 1000).toFixed(0)}k` : '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('metrics.avgSalary')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm">{formatRelativeTime(recruiter.lastActivity)}</p>
                    <p className="text-xs text-muted-foreground">{t('metrics.lastActivity')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <GlassCard delay={0.1}>
              <div className="p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-lg">{t('noRecruiters')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('noRecruitersHint')}</p>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  )
}
