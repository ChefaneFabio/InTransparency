'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, TrendingUp, Users, Building2, Target, BarChart3 } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'

interface AnalyticsData {
  totalPlacements: number
  activeCompanies: number
  totalCandidates: number
  avgTimeToHire: number
  monthlyPlacements: { month: string; count: number }[]
  topIndustries: { industry: string; placements: number }[]
}

const MOCK_ANALYTICS: AnalyticsData = {
  totalPlacements: 47,
  activeCompanies: 18,
  totalCandidates: 234,
  avgTimeToHire: 23,
  monthlyPlacements: [
    { month: 'Oct', count: 5 }, { month: 'Nov', count: 8 }, { month: 'Dec', count: 3 },
    { month: 'Jan', count: 7 }, { month: 'Feb', count: 11 }, { month: 'Mar', count: 13 },
  ],
  topIndustries: [
    { industry: 'Software Development', placements: 18 },
    { industry: 'Data Analytics', placements: 11 },
    { industry: 'IoT / Hardware', placements: 8 },
    { industry: 'Clean Energy', placements: 6 },
    { industry: 'Biotechnology', placements: 4 },
  ],
}

export default function TechParkAnalyticsPage() {
  const t = useTranslations('techparkDashboard')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/dashboard/techpark/analytics')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        } else {
          setData(MOCK_ANALYTICS)
        }
      } catch {
        setData(MOCK_ANALYTICS)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const maxPlacement = data ? Math.max(...data.monthlyPlacements.map(m => m.count)) : 1
  const maxIndustry = data ? Math.max(...data.topIndustries.map(i => i.placements)) : 1

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/techpark">
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('back')}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{t('analytics.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('analytics.subtitle')}</p>
        </div>
      </div>

      {loading || !data ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-2xl font-bold">{data.totalPlacements}</p><p className="text-sm text-muted-foreground">{t('analytics.totalPlacements')}</p></div>
                <div className="p-2 bg-primary/10 rounded-lg"><Target className="h-5 w-5 text-primary" /></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-2xl font-bold">{data.activeCompanies}</p><p className="text-sm text-muted-foreground">{t('analytics.activeCompanies')}</p></div>
                <div className="p-2 bg-primary/10 rounded-lg"><Building2 className="h-5 w-5 text-primary" /></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-2xl font-bold">{data.totalCandidates}</p><p className="text-sm text-muted-foreground">{t('analytics.candidates')}</p></div>
                <div className="p-2 bg-primary/10 rounded-lg"><Users className="h-5 w-5 text-primary" /></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-2xl font-bold">{data.avgTimeToHire}d</p><p className="text-sm text-muted-foreground">{t('analytics.avgTimeToHire')}</p></div>
                <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp className="h-5 w-5 text-primary" /></div>
              </div>
            </CardContent></Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" /> {t('analytics.monthlyPlacements')}</CardTitle>
                <CardDescription>{t('analytics.last6Months')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.monthlyPlacements.map(m => (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="text-sm w-8 text-muted-foreground">{m.month}</span>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(m.count / maxPlacement) * 100}%` }}
                        >
                          <span className="text-xs text-primary-foreground font-medium">{m.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5" /> {t('analytics.topIndustries')}</CardTitle>
                <CardDescription>{t('analytics.byPlacements')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topIndustries.map(ind => (
                    <div key={ind.industry} className="flex items-center gap-3">
                      <span className="text-sm w-40 truncate text-muted-foreground">{ind.industry}</span>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(ind.placements / maxIndustry) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">{ind.placements}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
