'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  BookOpen,
  RefreshCw,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3"><Skeleton className="h-4 w-28" /></CardHeader>
              <CardContent><Skeleton className="h-10 w-20" /></CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MarketIntelligencePage() {
  const [data, setData] = useState<TalentAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/recruiter/talent-analytics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch market intelligence')
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 font-medium mb-2">Error loading market intelligence</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { talentPool, universityDistribution, skillsFrequency, growthTrends, disciplineDistribution } = data

  const totalSkillMentions = skillsFrequency.reduce((sum, s) => sum + s.count, 0)
  const totalProjects = disciplineDistribution.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Market Intelligence
            </h1>
            <p className="text-gray-600 mt-2">
              Understand the talent pool, skill availability, and growth trends
            </p>
          </div>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Total Talent Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {talentPool.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Public student profiles</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-600" />
                Universities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {universityDistribution.length}
              </div>
              <p className="text-xs text-gray-600 mt-1">With active students</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                Skills Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {skillsFrequency.length}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {totalSkillMentions.toLocaleString()} total mentions
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-orange-600" />
                Public Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {totalProjects.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Across {disciplineDistribution.length} disciplines
              </p>
            </CardContent>
          </Card>
        </div>

        {/* University Distribution & Growth Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                University Distribution
              </CardTitle>
              <CardDescription>
                Where students on the platform come from
              </CardDescription>
            </CardHeader>
            <CardContent>
              {universityDistribution.length > 0 ? (
                <div className="space-y-3">
                  {universityDistribution.map((uni) => {
                    const percentage = talentPool > 0
                      ? (uni.count / talentPool) * 100
                      : 0
                    return (
                      <div key={uni.university} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{uni.university}</span>
                          <span className="text-gray-600">
                            {uni.count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage * 3, 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No university data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Student Growth Trends
              </CardTitle>
              <CardDescription>
                New student registrations over the last 6 months
              </CardDescription>
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
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No growth data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Skills Frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Top Skills in Talent Pool
            </CardTitle>
            <CardDescription>
              Most common skills and technologies from student projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {skillsFrequency.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={skillsFrequency.slice(0, 15)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="skill" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Mentions in Projects" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-500">
                No skills data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discipline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Project Discipline Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of student projects by discipline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {disciplineDistribution.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        `${(percent * 100).toFixed(0)}%`
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
                <div className="space-y-3">
                  {disciplineDistribution.map((disc, index) => {
                    const percentage = totalProjects > 0
                      ? ((disc.count / totalProjects) * 100).toFixed(1)
                      : '0'
                    return (
                      <div key={disc.discipline} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="font-medium text-gray-900">{disc.discipline}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold">{disc.count}</span>
                          <span className="text-xs text-gray-600 ml-1">({percentage}%)</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No discipline data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
