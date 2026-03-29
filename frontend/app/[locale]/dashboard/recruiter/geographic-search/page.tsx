'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Search,
  Users,
  GraduationCap,
  Globe,
  RefreshCw,
  Zap,
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
      <div>
        <Skeleton className="h-8 w-72 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-10 w-full mb-4" />
        </CardContent>
      </Card>
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
      <Card>
        <CardHeader><Skeleton className="h-6 w-56" /></CardHeader>
        <CardContent>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-3" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default function RecruiterGeographicSearchPage() {
  const t = useTranslations('dashboard.recruiter.geographicSearch')
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState<TalentAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/recruiter/talent-analytics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch talent data')
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

  const { talentPool, universityDistribution, skillsFrequency, disciplineDistribution } = data

  // Filter universities by search query
  const filteredUniversities = universityDistribution.filter(uni =>
    searchQuery === '' || uni.university.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalStudentsInTop = universityDistribution.reduce((sum, u) => sum + u.count, 0)

  return (
    <div className="min-h-screen space-y-6 space-y-6">
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

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchUniversities')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

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
                <p className="text-sm text-muted-foreground">{t('universities')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {universityDistribution.length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {t('withRegisteredStudents')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('studentsInTopUnis')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalStudentsInTop.toLocaleString()}
                </p>
              </div>
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Across top {universityDistribution.length} universities
            </div>
          </CardContent>
        </Card>
      </div>

      {/* University Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            {t('universityDistribution')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {universityDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={universityDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="university" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              No university data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* University Directory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              {t('universityDirectory')}
            </span>
            <Badge variant="outline">
              {filteredUniversities.length} {filteredUniversities.length === 1 ? 'university' : 'universities'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUniversities.length > 0 ? (
            <div className="space-y-3">
              {filteredUniversities.map((uni, index) => {
                const percentage = totalStudentsInTop > 0
                  ? ((uni.count / totalStudentsInTop) * 100).toFixed(1)
                  : '0'

                return (
                  <div key={uni.university} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{uni.university}</h3>
                          <p className="text-sm text-muted-foreground">
                            {uni.count} {uni.count === 1 ? 'student' : 'students'} ({percentage}% of tracked pool)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {uni.count} students
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? `No universities matching "${searchQuery}"`
                : 'No university data available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills & Disciplines side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              {t('topSkillsAvailable')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {skillsFrequency.length > 0 ? (
              <div className="space-y-3">
                {skillsFrequency.slice(0, 10).map((skill) => (
                  <div key={skill.skill} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                    <Badge variant="outline">{skill.count} projects</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No skills data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              {t('disciplineDistribution')}
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
                No discipline data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
