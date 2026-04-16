'use client'

import { useState, useEffect, useCallback } from 'react'
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
        alert('Assessment avviato con successo!')
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
    university: 'Universit\u00e0',
    its: 'ITS',
    work: 'Lavoro',
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
        <h1 className="text-2xl font-bold">Orientamento</h1>
        <p className="text-muted-foreground mt-1">
          Strumenti di orientamento per gli studenti della scuola
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
                <p className="text-sm text-muted-foreground">Assessment Totali</p>
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
                <p className="text-sm text-muted-foreground">Completati</p>
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
                <p className="text-sm text-muted-foreground">In Corso</p>
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
              <BarChart3 className="h-5 w-5" /> Profilo Interessi Medio
            </CardTitle>
            <CardDescription>Media delle aree di interesse degli studenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="area" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Media" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Studenti</TabsTrigger>
          <TabsTrigger value="detail">Dettaglio Studente</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-3 mt-4">
          {assessments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nessun assessment ancora avviato.</p>
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
                        {a.status === 'COMPLETED' ? 'Completato' : 'In Corso'}
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
                <p className="text-muted-foreground">Seleziona uno studente dalla lista per vedere il dettaglio.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedStudent.studentName}</CardTitle>
                  <CardDescription>
                    Tipo: {selectedStudent.assessmentType} | Stato: {selectedStudent.status === 'COMPLETED' ? 'Completato' : 'In Corso'}
                  </CardDescription>
                </CardHeader>
              </Card>

              {studentRadarData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profilo Interessi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={studentRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="area" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Interessi" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
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
                    <CardTitle>Percorsi Suggeriti</CardTitle>
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
                          <p className="text-xs text-muted-foreground">compatibilità</p>
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
              <p className="font-medium">Avvia Nuovo Assessment</p>
              <p className="text-sm text-muted-foreground">Inserisci l&apos;ID dello studente per avviare un assessment orientativo</p>
            </div>
            <Button onClick={() => {
              const studentId = prompt('Inserisci ID studente:')
              if (studentId) handleStartAssessment(studentId)
            }} disabled={starting}>
              <Play className="h-4 w-4 mr-2" /> Avvia Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
