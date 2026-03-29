'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'
import {
  Building2,
  Eye,
  Users,
  UserCheck,
  CalendarDays,
  ArrowLeft,
  AlertTriangle,
  Activity,
  Mail,
  Briefcase
} from 'lucide-react'

interface Company {
  id: string
  name: string
  views: number
  contacts: number
  hires: number
  uniqueStudentsViewed: number
  lastActivity: string
  topDegreesInterested: string[]
  engagementScore: number
}

interface ActivityItem {
  id: string
  companyName: string
  studentName: string
  actionType: 'view' | 'contact' | 'hire'
  timestamp: string
}

interface EngagementData {
  summary: {
    totalCompanies: number
    activeThisMonth: number
    totalViews: number
    totalContacts: number
  }
  companies: Company[]
  recentActivity: ActivityItem[]
}

const actionTypeConfig: Record<string, { icon: typeof Eye; color: string; bg: string; label: string }> = {
  view: { icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100', label: 'viewed' },
  contact: { icon: Mail, color: 'text-green-600', bg: 'bg-green-100', label: 'contacted' },
  hire: { icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100', label: 'hired' }
}

export default function CompanyEngagementPage() {
  const t = useTranslations('companyEngagement')
  const [data, setData] = useState<EngagementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/university/company-engagement')
        if (!response.ok) {
          throw new Error('Failed to fetch company engagement data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-40 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto pt-12">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-medium text-red-800 mb-1">{t('errorTitle')}</h3>
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const sortedCompanies = Array.from(data.companies).sort((a, b) => b.engagementScore - a.engagementScore)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
      ' ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/university">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.summary.totalCompanies}</p>
                <p className="text-sm text-muted-foreground">{t('totalCompanies')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{data.summary.activeThisMonth}</p>
                <p className="text-sm text-muted-foreground">{t('activeThisMonth')}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.summary.totalViews}</p>
                <p className="text-sm text-muted-foreground">{t('totalViews')}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.summary.totalContacts}</p>
                <p className="text-sm text-muted-foreground">{t('totalContacts')}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Company Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{t('companiesTitle')}</h2>
          {sortedCompanies.length > 0 ? (
            sortedCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground/60" />
                        {company.name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <CalendarDays className="h-3 w-3" />
                        {t('lastActive')}: {formatDate(company.lastActivity)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {t('score')}: {company.engagementScore}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-foreground">{company.views}</p>
                      <p className="text-xs text-muted-foreground">{t('views')}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-foreground">{company.contacts}</p>
                      <p className="text-xs text-muted-foreground">{t('contacts')}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-foreground">{company.hires}</p>
                      <p className="text-xs text-muted-foreground">{t('hires')}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-foreground">{company.uniqueStudentsViewed}</p>
                      <p className="text-xs text-muted-foreground">{t('uniqueStudents')}</p>
                    </div>
                  </div>

                  {company.topDegreesInterested.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('interestedIn')}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {company.topDegreesInterested.map((degree, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {degree}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-1">{t('noCompanies')}</h3>
                <p className="text-sm text-muted-foreground">{t('noCompaniesDescription')}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t('recentActivity')}
              </CardTitle>
              <CardDescription>{t('recentActivityDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivity.map((item) => {
                    const config = actionTypeConfig[item.actionType] || actionTypeConfig.view
                    const IconComponent = config.icon
                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full ${config.bg} shrink-0 mt-0.5`}>
                          <IconComponent className={`h-3 w-3 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{item.companyName}</span>
                            {' '}{t(config.label)}{' '}
                            <span className="font-medium">{item.studentName}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatTime(item.timestamp)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">{t('noActivity')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
