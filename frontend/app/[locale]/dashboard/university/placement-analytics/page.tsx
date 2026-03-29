'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Users, MessageSquare, Briefcase, Clock } from 'lucide-react'
import PlacementFunnelChart from '@/components/dashboard/university/PlacementFunnelChart'
import CompanyLeaderboard from '@/components/dashboard/university/CompanyLeaderboard'
import RecruiterFeed from '@/components/dashboard/university/RecruiterFeed'

interface AnalyticsData {
  funnel: { viewed: number; contacted: number; interviewed: number; hired: number }
  timeToHire: { averageDays: number; dataPoints: number }
  companyLeaderboard: Array<{ company: string; views: number; contacts: number; hires: number }>
  gradeComparison: { universityAvg: number; platformAvg: number }
  feed: Array<{ type: string; studentName: string; company: string; action: string; timestamp: string }>
}

export default function PlacementAnalyticsPage() {
  const t = useTranslations('universityAnalytics')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/university/placement-analytics')
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to load')
        }
        setData(await res.json())
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-80" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center text-red-700">{error}</CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const statCards = [
    { icon: Users, label: t('stats.viewed'), value: data.funnel.viewed, color: 'text-primary', bg: 'bg-primary/5' },
    { icon: MessageSquare, label: t('stats.contacted'), value: data.funnel.contacted, color: 'text-primary', bg: 'bg-primary/5' },
    { icon: Briefcase, label: t('stats.hired'), value: data.funnel.hired, color: 'text-primary', bg: 'bg-primary/5' },
    { icon: Clock, label: t('stats.avgTime'), value: data.timeToHire.averageDays > 0 ? `${data.timeToHire.averageDays}d` : 'N/A', color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grade comparison */}
      {data.gradeComparison.universityAvg > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground">{t('gradeComparison')}</span>
              <Badge variant="outline" className="text-primary border-primary/20">
                Your university: {data.gradeComparison.universityAvg}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                Platform avg: {data.gradeComparison.platformAvg}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funnel chart */}
      <PlacementFunnelChart funnel={data.funnel} timeToHire={data.timeToHire} />

      {/* Leaderboard + Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CompanyLeaderboard companies={data.companyLeaderboard} />
        <RecruiterFeed feed={data.feed} />
      </div>
    </div>
  )
}
