'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClipboardList, CheckCircle, Clock, BarChart3, Play } from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts'

interface Assessment {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  assessmentType: string
  status: string
  completedAt: string | null
  result: {
    interestProfile: Record<string, number>
    suggestedPaths: Array<{ type: string; name: string; matchScore: number; reasons: string[] }>
  } | null
}

interface Stats {
  total: number
  completed: number
  inProgress: number
  avgInterestAreas: Record<string, number>
}

export default function OrientationPage() {
  const t = useTranslations('orientation')
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, inProgress: 0, avgInterestAreas: {} })
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Assessment | null>(null)
  const [starting, setStarting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/orientation')
      const data = await res.json()
      setAssessments(data.assessments || [])
      setStats(data.stats || { total: 0, completed: 0, inProgress: 0, avgInterestAreas: {} })
    } catch (err) {
      console.error('Failed to fetch orientation data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleStartAssessment = async (studentId: string) => {
    setStarting(true)
    try {
      const res = await fetch('/api/dashboard/university/orientation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, assessmentType: 'combined' }),
      })
      if (res.ok) {
        await fetchData()
        alert(t('alerts.assessmentStarted'))
      }
    } catch (err) {
      console.error('Failed to start assessment:', err)
    } finally {
      setStarting(false)
    }
  }

  // Prepare radar chart data from avgInterestAreas
  const radarData = Object.entries(stats.avgInterestAreas).map(([area, score]) => ({
    area: area.charAt(0).toUpperCase() + area.slice(1).replace(/_/g, ' '),
    score,
    fullMark: 100,
  }))

  // Prepare individual student radar data
  const studentRadarData = selectedStudent?.result?.interestProfile
    ? Object.entries(selectedStudent.result.interestProfile).map(([area, score]) => ({
        area: area.charAt(0).toUpperCase() + area.slice(1).replace(/_/g, ' '),
        score,
        fullMark: 100,
      }))
    : []

  const pathTypeLabels: Record<string, string> = {
    university: t('pathTypes.university'),
    its: t('pathTypes.its'),
    work: t('pathTypes.work'),
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
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
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2"><ClipboardList className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">{t('stats.total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">{t('stats.completed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2"><Clock className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">{t('stats.inProgress')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Average Interest Profile Radar */}
      {radarData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> {t('radar.avgTitle')}
            </CardTitle>
            <CardDescription>{t('radar.avgDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="area" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name={t('radar.avgSeriesName')} dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">{t('tabs.students')}</TabsTrigger>
          <TabsTrigger value="detail">{t('tabs.detail')}</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-3 mt-4">
          {assessments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t('students.empty')}</p>
              </CardContent>
            </Card>
          ) : (
            assessments.map((a) => (
              <Card key={a.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStudent(a)}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{a.studentName}</p>
                      <p className="text-sm text-muted-foreground">{a.studentEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={a.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {a.status === 'COMPLETED' ? t('status.completed') : t('status.inProgress')}
                      </Badge>
                      <Badge variant="outline">{a.assessmentType}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="detail" className="mt-4">
          {!selectedStudent ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t('detail.selectPrompt')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedStudent.studentName}</CardTitle>
                  <CardDescription>
                    {t('detail.typeLabel')}: {selectedStudent.assessmentType} | {t('detail.statusLabel')}: {selectedStudent.status === 'COMPLETED' ? t('status.completed') : t('status.inProgress')}
                  </CardDescription>
                </CardHeader>
              </Card>

              {studentRadarData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('detail.interestProfileTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={studentRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="area" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name={t('detail.interestSeriesName')} dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedStudent.result?.suggestedPaths && selectedStudent.result.suggestedPaths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('detail.suggestedPathsTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedStudent.result.suggestedPaths.map((path, i) => (
                      <div key={i} className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <p className="font-medium">{path.name}</p>
                          <Badge variant="outline" className="mt-1">{pathTypeLabels[path.type] || path.type}</Badge>
                          {path.reasons && path.reasons.length > 0 && (
                            <ul className="text-xs text-muted-foreground mt-2 space-y-0.5">
                              {path.reasons.map((r, j) => <li key={j}>- {r}</li>)}
                            </ul>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{path.matchScore}%</p>
                          <p className="text-xs text-muted-foreground">{t('detail.compatibility')}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Avvia Assessment button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t('startCard.title')}</p>
              <p className="text-sm text-muted-foreground">{t('startCard.description')}</p>
            </div>
            <Button onClick={() => {
              const studentId = prompt(t('startCard.promptStudentId'))
              if (studentId) handleStartAssessment(studentId)
            }} disabled={starting}>
              <Play className="h-4 w-4 mr-2" /> {t('startCard.button')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
