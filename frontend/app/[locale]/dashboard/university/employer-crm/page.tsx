'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search, Building2, Users, Briefcase, TrendingUp, Eye,
  Mail, Calendar, ChevronRight, ArrowUpRight, Star, Clock
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { useInstitution } from '@/lib/institution-context'

interface Company {
  name: string
  stage: string
  views: number
  recentViews: number
  contacts: number
  hires: number
  avgSalary: number
  engagementScore: number
  events: Array<{ title: string; date: string }>
  roles: string[]
  firstSeen: string
  lastActivity: string
}

interface Pipeline {
  prospect: number
  engaged: number
  partner: number
  inactive: number
}

const stageConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Eye }> = {
  prospect: { label: 'Prospect', color: 'text-blue-700', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: Eye },
  engaged: { label: 'Engaged', color: 'text-amber-700', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Mail },
  partner: { label: 'Partner', color: 'text-emerald-700', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: Star },
  inactive: { label: 'Inactive', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', icon: Clock },
}

export default function EmployerCRMPage() {
  const t = useTranslations('employerCRM')
  const inst = useInstitution()
  const [companies, setCompanies] = useState<Company[]>([])
  const [pipeline, setPipeline] = useState<Pipeline>({ prospect: 0, engaged: 0, partner: 0, inactive: 0 })
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (stageFilter) params.set('stage', stageFilter)
      const res = await fetch(`/api/dashboard/university/employer-crm?${params}`)
      if (res.ok) {
        const data = await res.json()
        setCompanies(data.companies)
        setPipeline(data.pipeline)
        setTotal(data.totalCompanies)
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [searchTerm, stageFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const formatDate = (d: string) => {
    if (!d || d === new Date(0).toISOString()) return '—'
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
    if (diff < 1) return t('today')
    if (diff < 7) return t('daysAgo', { count: diff })
    if (diff < 30) return t('weeksAgo', { count: Math.floor(diff / 7) })
    return new Date(d).toLocaleDateString()
  }

  const pipelineStages = [
    { key: 'prospect', icon: Eye, variant: 'blue' as const },
    { key: 'engaged', icon: Mail, variant: 'amber' as const },
    { key: 'partner', icon: Star, variant: 'green' as const },
    { key: 'inactive', icon: Clock, variant: 'slate' as const },
  ]

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="dark">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{inst.crmTitle}</h1>
          <p className="text-white/60 mt-1">{inst.crmSubtitle}</p>
        </div>
      </MetricHero>

      {/* Pipeline funnel */}
      <div className="grid gap-4 md:grid-cols-4">
        {pipelineStages.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            onClick={() => setStageFilter(stageFilter === s.key ? '' : s.key)}
            className="cursor-pointer"
          >
            <StatCard
              label={t(`pipeline.${s.key}`)}
              value={pipeline[s.key as keyof Pipeline] || 0}
              icon={<s.icon className="h-5 w-5" />}
              variant={s.variant}
            />
          </motion.div>
        ))}
      </div>

      {/* Search + active filter */}
      <GlassCard delay={0.1}>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {stageFilter && (
              <Button variant="outline" size="sm" onClick={() => setStageFilter('')}>
                {t(`pipeline.${stageFilter}`)} &times;
              </Button>
            )}
            <Badge variant="outline">{total} {t('companiesTotal')}</Badge>
          </div>
        </div>
      </GlassCard>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /></div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {/* Company list */}
      {!loading && (
        <div className="grid gap-3">
          {companies.map((company, i) => {
            const config = stageConfig[company.stage] || stageConfig.prospect
            const StageIcon = config.icon

            return (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-4">
                      {/* Company icon */}
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-7 w-7 text-primary" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">{company.name}</h3>
                          <Badge className={`${config.bg} ${config.color} border-0 text-xs`}>
                            <StageIcon className="h-3 w-3 mr-1" />{t(`pipeline.${company.stage}`)}
                          </Badge>
                          {company.engagementScore >= 50 && (
                            <Badge variant="outline" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />{t('highEngagement')}
                            </Badge>
                          )}
                        </div>

                        {/* Metrics row */}
                        <div className="flex items-center gap-5 mt-2 text-sm flex-wrap">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" />
                            {company.views} {t('views')}
                            {company.recentViews > 0 && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 ml-1">+{company.recentViews} {t('thisMonth')}</Badge>
                            )}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {company.contacts} {t('contacts')}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                            {company.hires} {t('hires')}
                          </span>
                          {company.avgSalary > 0 && (
                            <span className="text-muted-foreground">
                              {t('avgSalary')}: €{(company.avgSalary / 1000).toFixed(0)}k
                            </span>
                          )}
                        </div>

                        {/* Roles hired */}
                        {company.roles.length > 0 && (
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {company.roles.map(role => (
                              <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                            ))}
                          </div>
                        )}

                        {/* Events attended */}
                        {company.events.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {company.events.map(e => e.title).slice(0, 3).join(', ')}
                            {company.events.length > 3 && ` +${company.events.length - 3}`}
                          </div>
                        )}
                      </div>

                      {/* Right side — timeline */}
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <p className="text-xs text-muted-foreground">{t('lastActivity')}</p>
                        <p className="text-sm font-medium">{formatDate(company.lastActivity)}</p>
                        <p className="text-xs text-muted-foreground mt-2">{t('firstSeen')}</p>
                        <p className="text-sm">{formatDate(company.firstSeen)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {companies.length === 0 && !loading && (
            <GlassCard delay={0.1}>
              <div className="p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-lg">{t('noCompanies')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('noCompaniesHint')}</p>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  )
}
