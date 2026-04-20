'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain, Trophy, Users, BarChart3 } from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip
} from 'recharts'

interface AvgScore {
  dimension: string
  label: string
  avgScore: number
}

interface LeaderboardEntry {
  studentId: string
  name: string
  totalScore: number
  avgScore: number
}

export default function SoftSkillsPage() {
  const t = useTranslations('softSkillsPage')
  const [avgScores, setAvgScores] = useState<AvgScore[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [totalAssessments, setTotalAssessments] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [isMock, setIsMock] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/soft-skills')
      const data = await res.json()
      setAvgScores(data.avgScores || [])
      setLeaderboard(data.leaderboard || [])
      setTotalAssessments(data.totalAssessments || 0)
      setTotalStudents(data.totalStudents || 0)
      setIsMock(data.isMockData || false)
    } catch (err) {
      console.error('Failed to fetch soft skills data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const radarData = avgScores.map((s) => ({
    dimension: s.label,
    score: s.avgScore,
    fullMark: 100,
  }))

  const barData = avgScores.map((s) => ({
    name: s.label,
    score: s.avgScore,
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
        {isMock && (
          <Badge variant="outline" className="mt-2">{t('mockBadge')}</Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2"><Brain className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-2xl font-bold">{totalAssessments}</p>
                <p className="text-sm text-muted-foreground">{t('stats.assessmentsCompleted')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2"><Users className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{totalStudents}</p>
                <p className="text-sm text-muted-foreground">{t('stats.totalStudents')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2"><BarChart3 className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">
                  {avgScores.length > 0 ? Math.round(avgScores.reduce((s, a) => s + a.avgScore, 0) / avgScores.length) : 0}
                </p>
                <p className="text-sm text-muted-foreground">{t('stats.averageScore')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('radar.title')}</CardTitle>
            <CardDescription>{t('radar.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name={t('radar.seriesName')} dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('bar.title')}</CardTitle>
            <CardDescription>{t('bar.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> {t('leaderboard.title')}
          </CardTitle>
          <CardDescription>{t('leaderboard.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t('leaderboard.empty')}</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <div key={entry.studentId} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-gray-100 text-gray-700' :
                      i === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                    <p className="font-medium">{entry.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{entry.avgScore}/100</p>
                    <p className="text-xs text-muted-foreground">{t('leaderboard.totalLabel')}: {entry.totalScore}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
