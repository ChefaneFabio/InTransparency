'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  Clock,
  Building2,
  Download,
  Briefcase,
  BarChart3,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface DashboardData {
  stats: {
    totalStudents: number
    studentsContacted: number
    confirmedHired: number
    placementRate: number
  }
  monthlyTrend: Array<{ month: string; contacts: number; hires: number }>
  topCompanies: Array<{ company: string; hires: number }>
  recentPlacements: Array<{
    id: string
    studentName: string
    department: string
    company: string
    jobTitle: string
    startDate: string | null
    confirmedDate: string | null
  }>
  avgTimeToHireDays: number
  departmentBreakdown: Array<{
    department: string
    contacted: number
    hired: number
    rate: number
  }>
}

export default function UniversityPlacementsPage() {
  const t = useTranslations('universityPlacements')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/university/placements?view=dashboard')
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
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-5 w-96" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-64" />
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

  const { stats, monthlyTrend, topCompanies, recentPlacements, avgTimeToHireDays, departmentBreakdown } = data

  const statCards = [
    {
      icon: Users,
      label: t('stats.totalStudents'),
      value: stats.totalStudents,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: MessageSquare,
      label: t('stats.studentsContacted'),
      value: stats.studentsContacted,
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      icon: CheckCircle,
      label: t('stats.confirmedHired'),
      value: stats.confirmedHired,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: TrendingUp,
      label: t('stats.placementRate'),
      value: `${stats.placementRate}%`,
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      icon: Clock,
      label: t('stats.avgTimeToHire'),
      value: avgTimeToHireDays > 0 ? `${avgTimeToHireDays}d` : 'N/A',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          {t('exportReport')}
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('trendChart.title')}</CardTitle>
            <p className="text-sm text-gray-500">{t('trendChart.subtitle')}</p>
          </CardHeader>
          <CardContent>
            {monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="contacts"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name={t('trendChart.contacts')}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hires"
                    stroke="#10b981"
                    strokeWidth={2}
                    name={t('trendChart.hires')}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400">
                {t('noData')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Hiring Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('topCompanies.title')}</CardTitle>
            <p className="text-sm text-gray-500">{t('topCompanies.subtitle')}</p>
          </CardHeader>
          <CardContent>
            {topCompanies.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topCompanies} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="company"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip />
                  <Bar dataKey="hires" fill="#10b981" radius={[0, 4, 4, 0]} name={t('topCompanies.hires')} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Building2 className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p>{t('noData')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown + Recent Placements */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">{t('tabs.recentPlacements')}</TabsTrigger>
          <TabsTrigger value="departments">{t('tabs.departments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">{t('table.student')}</th>
                      <th className="text-left p-4 font-medium text-gray-600">{t('table.company')}</th>
                      <th className="text-left p-4 font-medium text-gray-600">{t('table.jobTitle')}</th>
                      <th className="text-left p-4 font-medium text-gray-600">{t('table.startDate')}</th>
                      <th className="text-left p-4 font-medium text-gray-600">{t('table.confirmedDate')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentPlacements.length > 0 ? (
                      recentPlacements.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">{p.studentName}</p>
                              {p.department && (
                                <p className="text-sm text-gray-500">{p.department}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{p.company}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-900">{p.jobTitle || '-'}</td>
                          <td className="p-4 text-gray-600">
                            {p.startDate
                              ? new Date(p.startDate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </td>
                          <td className="p-4">
                            {p.confirmedDate ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {new Date(p.confirmedDate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </Badge>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">{t('noRecentPlacements')}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">{t('deptTable.department')}</th>
                      <th className="text-left p-4 font-medium text-gray-600">{t('deptTable.contacted')}</th>
                      <th className="text-left p-4 font-medium text-gray-600">{t('deptTable.hired')}</th>
                      <th className="text-left p-4 font-medium text-gray-600">{t('deptTable.placementRate')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {departmentBreakdown.length > 0 ? (
                      departmentBreakdown.map((dept) => (
                        <tr key={dept.department} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{dept.department}</td>
                          <td className="p-4 text-gray-600">{dept.contacted}</td>
                          <td className="p-4">
                            <span className="font-semibold text-emerald-600">{dept.hired}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${Math.min(dept.rate, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{dept.rate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-12 text-center">
                          <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">{t('noDepartmentData')}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
