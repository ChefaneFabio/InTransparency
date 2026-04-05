'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Calendar, MapPin, Clock, Building2, AlertCircle, Briefcase, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { StaggerContainer, StaggerItem } from '@/components/ui/animated-card'

interface ApplicationData {
  id: string; status: string; createdAt: string; updatedAt: string
  interviewDate: string | null; interviewType: string | null; interviewNotes: string | null
  offerDetails: any | null; coverLetter: string | null
  job: { id: string; title: string; companyName: string; companyLogo: string | null; jobType: string; workLocation: string; location: string | null }
}

export default function StudentApplications() {
  const t = useTranslations('studentApplications')
  const [applications, setApplications] = useState<ApplicationData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setApplications(data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = applications.filter(app => {
    if (!searchTerm) return true
    const q = searchTerm.toLowerCase()
    return app.job.title.toLowerCase().includes(q) || app.job.companyName.toLowerCase().includes(q)
  })

  const active = filtered.filter(a => !['REJECTED', 'WITHDRAWN', 'ACCEPTED'].includes(a.status))
  const interviews = filtered.filter(a => a.status === 'INTERVIEW')
  const offers = filtered.filter(a => a.status === 'OFFER' || a.status === 'ACCEPTED')
  const archived = filtered.filter(a => ['REJECTED', 'WITHDRAWN'].includes(a.status))

  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: t('status.applied'), variant: 'secondary' },
    REVIEWING: { label: t('status.reviewing'), variant: 'outline' },
    SHORTLISTED: { label: t('status.shortlisted'), variant: 'default' },
    INTERVIEW: { label: t('status.interview'), variant: 'default' },
    OFFER: { label: t('status.offer'), variant: 'default' },
    ACCEPTED: { label: t('status.accepted'), variant: 'default' },
    REJECTED: { label: t('status.rejected'), variant: 'destructive' },
    WITHDRAWN: { label: t('status.withdrawn'), variant: 'secondary' },
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <MetricHero gradient="primary">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
      </MetricHero>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem><StatCard label={t('stats.total')} value={applications.length} icon={<Briefcase className="h-5 w-5" />} variant="blue" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.active')} value={active.length} icon={<Clock className="h-5 w-5" />} variant="amber" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.interviews')} value={interviews.length} icon={<Calendar className="h-5 w-5" />} variant="purple" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.offers')} value={offers.length} icon={<CheckCircle className="h-5 w-5" />} variant="green" /></StaggerItem>
      </StaggerContainer>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t('tabs.all')} ({filtered.length})</TabsTrigger>
          <TabsTrigger value="active">{t('tabs.active')} ({active.length})</TabsTrigger>
          {interviews.length > 0 && <TabsTrigger value="interviews">{t('tabs.interviews')} ({interviews.length})</TabsTrigger>}
          {offers.length > 0 && <TabsTrigger value="offers">{t('tabs.offers')} ({offers.length})</TabsTrigger>}
          {archived.length > 0 && <TabsTrigger value="archived">{t('tabs.archived')} ({archived.length})</TabsTrigger>}
        </TabsList>

        {(['all', 'active', 'interviews', 'offers', 'archived'] as const).map(tab => {
          const list = tab === 'all' ? filtered : tab === 'active' ? active : tab === 'interviews' ? interviews : tab === 'offers' ? offers : archived
          return (
            <TabsContent key={tab} value={tab} className="mt-4 space-y-2">
              {list.length === 0 ? (
                <GlassCard delay={0.1}>
                  <div className="p-10 text-center">
                    <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{t('empty')}</p>
                  </div>
                </GlassCard>
              ) : list.map((app) => {
                const config = statusConfig[app.status] || { label: app.status, variant: 'secondary' as const }
                return (
                  <Card key={app.id} className="hover:shadow-md hover:border-primary/20 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{app.job.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span>{app.job.companyName}</span>
                              {app.job.location && <><span className="text-muted-foreground/30">·</span><span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{app.job.location}</span></>}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={config.variant} className="text-[10px]">{config.label}</Badge>
                              <span className="text-[10px] text-muted-foreground">{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                            {app.interviewDate && (
                              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary">
                                <Calendar className="h-3 w-3" />
                                {t('interviewOn')} {new Date(app.interviewDate).toLocaleDateString()}
                                {app.interviewType && <span className="text-muted-foreground">({app.interviewType})</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/dashboard/student/apply/${app.job.id}`}><ArrowRight className="h-3.5 w-3.5" /></Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
