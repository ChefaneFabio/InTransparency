'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, GraduationCap, BarChart3, Sparkles, Target, RefreshCw } from 'lucide-react'

interface GapRow {
  skill: string
  escoUri: string | null
  demandScore: number
  studentCount: number
  coverage: number
  gapSeverity: number
}

interface Report {
  universityName: string
  programName: string | null
  studentCount: number
  jobCount: number
  gaps: GapRow[]
  strengths: GapRow[]
  gapIndex: number
  alignmentIndex: number
  computedAt: string
}

interface TrendRow {
  month: string
  gapIndex: number
  alignmentIndex: number
  studentCount: number
}

interface Recommendation {
  type: string
  skill: string
  suggestion: string
  confidence: number
  rationale: string
}

interface ApiResponse {
  report: Report
  trend?: TrendRow[]
  recommendations?: Recommendation[]
}

function severityColor(severity: number): string {
  if (severity >= 60) return 'bg-red-500'
  if (severity >= 40) return 'bg-orange-500'
  if (severity >= 20) return 'bg-amber-400'
  return 'bg-blue-400'
}

export default function SkillsIntelligencePage() {
  const [programs, setPrograms] = useState<string[]>([])
  const [program, setProgram] = useState<string>('ALL')
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [snapshotting, setSnapshotting] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard/university/skills-gap-v2?programs=1')
      .then(r => r.json())
      .then(data => setPrograms(data.programs ?? []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      program,
      withTrend: '1',
      withRecs: '1',
    })
    fetch(`/api/dashboard/university/skills-gap-v2?${params}`)
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [program])

  const takeSnapshot = async () => {
    setSnapshotting(true)
    await fetch('/api/dashboard/university/skills-gap-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ program: program === 'ALL' ? null : program }),
    })
    // Re-fetch to pick up new trend point
    const res = await fetch(
      `/api/dashboard/university/skills-gap-v2?program=${program}&withTrend=1&withRecs=1`
    )
    if (res.ok) setData(await res.json())
    setSnapshotting(false)
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            Skills Intelligence
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Degree-program alignment with the labor market, monthly trends, and evidence-based
            curriculum recommendations. The measurement layer Cattolica asked for.
          </p>
        </div>
        <Button onClick={takeSnapshot} disabled={snapshotting} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${snapshotting ? 'animate-spin' : ''}`} />
          Save monthly snapshot
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 flex items-center gap-3 flex-wrap">
          <GraduationCap className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Program:</span>
          <select
            className="px-3 py-2 border rounded text-sm bg-background"
            value={program}
            onChange={e => setProgram(e.target.value)}
          >
            <option value="ALL">All programs</option>
            {programs.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {data?.report && (
            <>
              <Badge variant="outline" className="ml-auto">
                {data.report.studentCount} students
              </Badge>
              <Badge variant="outline">{data.report.jobCount} active jobs scanned</Badge>
            </>
          )}
        </CardContent>
      </Card>

      {loading && <Skeleton className="h-96 w-full" />}

      {!loading && data?.report && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Gap Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-red-600">{data.report.gapIndex}</span>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Higher = bigger mismatch between program output and market demand. Average of top
                  20 gap severities.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" />
                  Alignment Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-emerald-600">
                    {data.report.alignmentIndex}
                  </span>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Higher = better overall alignment between student skill coverage and market
                  demand.
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="gaps" className="mb-6">
            <TabsList>
              <TabsTrigger value="gaps">Gaps ({data.report.gaps.length})</TabsTrigger>
              <TabsTrigger value="strengths">Strengths ({data.report.strengths.length})</TabsTrigger>
              <TabsTrigger value="trend">12-month trend</TabsTrigger>
              <TabsTrigger value="recs">
                Recommendations ({data.recommendations?.length ?? 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gaps" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {data.report.gaps.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No significant gaps detected for this program.
                      </p>
                    ) : (
                      data.report.gaps.map(g => (
                        <div key={g.skill} className="flex items-center gap-3 text-sm">
                          <div className="w-40 truncate">
                            <span className="font-medium">{g.skill}</span>
                            {g.escoUri && (
                              <Badge variant="outline" className="ml-2 text-xs" title={g.escoUri}>
                                ESCO
                              </Badge>
                            )}
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${severityColor(g.gapSeverity)}`}
                              style={{ width: `${Math.min(100, g.gapSeverity)}%` }}
                            />
                          </div>
                          <div className="w-24 text-right text-xs text-muted-foreground">
                            demand {g.demandScore}% · coverage {g.coverage}%
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strengths" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {data.report.strengths.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No strong differentiators yet — could mean low market demand data or early
                        program stage.
                      </p>
                    ) : (
                      data.report.strengths.map(s => (
                        <div key={s.skill} className="flex items-center gap-3 text-sm">
                          <div className="w-40 truncate">
                            <span className="font-medium">{s.skill}</span>
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${Math.min(100, Math.abs(s.gapSeverity))}%` }}
                            />
                          </div>
                          <div className="w-32 text-right text-xs text-muted-foreground">
                            coverage {s.coverage}% vs demand {s.demandScore}%
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trend" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {!data.trend || data.trend.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No snapshots yet. Click <strong>Save monthly snapshot</strong> to begin
                      building a trend.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-red-500" />
                          Gap Index
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-emerald-500" />
                          Alignment Index
                        </span>
                      </div>
                      <div className="space-y-2">
                        {data.trend.map(t => (
                          <div key={t.month} className="flex items-center gap-3 text-sm">
                            <div className="w-20 text-muted-foreground">{t.month}</div>
                            <div className="flex-1 flex gap-1">
                              <div
                                className="bg-red-500 h-5"
                                style={{ width: `${t.gapIndex}%` }}
                                title={`Gap ${t.gapIndex}`}
                              />
                              <div
                                className="bg-emerald-500 h-5"
                                style={{ width: `${t.alignmentIndex}%` }}
                                title={`Alignment ${t.alignmentIndex}`}
                              />
                            </div>
                            <div className="w-24 text-xs text-muted-foreground text-right">
                              {t.studentCount} students
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recs" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {!data.recommendations || data.recommendations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No recommendations yet. Run a snapshot with more student data to generate
                      actionable curriculum suggestions.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {data.recommendations.map((r, idx) => (
                        <Card key={idx} className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={r.type === 'ADD_COURSE' ? 'destructive' : 'default'}>
                                {r.type.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                confidence {Math.round(r.confidence * 100)}%
                              </span>
                            </div>
                            <h3 className="font-semibold mb-1">{r.suggestion}</h3>
                            <p className="text-sm text-muted-foreground">{r.rationale}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
