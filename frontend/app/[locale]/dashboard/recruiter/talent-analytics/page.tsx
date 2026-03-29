'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  TrendingUp,
  Users,
  GraduationCap,
  Zap,
  RefreshCw,
  BookOpen,
} from 'lucide-react'

const PIE_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#82ca9d', '#f44336', '#e91e63', '#9c27b0', '#3f51b5',
]

interface TalentAnalyticsData {
  talentPool: number
  universityDistribution: Array<{ university: string; count: number }>
  skillsFrequency: Array<{ skill: string; count: number }>
  growthTrends: Array<{ month: string; newStudents: number }>
  disciplineDistribution: Array<{ discipline: string; count: number }>
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen space-y-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-3" />
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-[350px] w-full" /></CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function TalentAnalyticsPage() {
  const t = useTranslations('dashboard.recruiter.talentAnalytics')
  const [data, setData] = useState<TalentAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/recruiter/talent-analytics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch talent analytics')
        return res.json()
      })
      .then((result: TalentAnalyticsData) => {
        setData(result)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="min-h-screen space-y-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 font-medium mb-2">{t('errorLoading')}</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { talentPool, universityDistribution, skillsFrequency, growthTrends, disciplineDistribution } = data

  const totalSkillMentions = skillsFrequency.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="min-h-screen space-y-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('subtitle')}
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('refresh')}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalTalentPool')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {talentPool.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {t('publicStudentProfiles')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('universitiesRepresented')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {universityDistribution.length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {t('topUniversitiesShown')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('uniqueSkillsTracked')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {skillsFrequency.length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {totalSkillMentions.toLocaleString()} total skill mentions
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* University Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              {t('topUniversities')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {universityDistribution.length > 0 ? (
              <div className="space-y-4">
                {universityDistribution.map((uni, index) => (
                  <div key={uni.university} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-foreground">{uni.university}</h4>
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{uni.count} students</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t('noUniversityData')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Frequency */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              {t('topSkills')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {skillsFrequency.length > 0 ? (
              <div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={skillsFrequency.slice(0, 15)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="skill" type="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Mentions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                {t('noSkillsData')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Growth Trends & Discipline Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              {t('studentGrowthTrends')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {growthTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="newStudents"
                    stroke="#0088FE"
                    strokeWidth={2}
                    name="New Students"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                {t('noGrowthData')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              {t('projectDisciplines')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {disciplineDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={disciplineDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    nameKey="discipline"
                    label={({ discipline, percent }: { discipline: string; percent: number }) =>
                      `${discipline}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {disciplineDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                {t('noDisciplineData')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
