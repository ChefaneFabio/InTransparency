'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  CheckCircle,
  TrendingUp,
  Building2,
  Briefcase,
  BarChart3,
  AlertTriangle,
  GraduationCap,
  Eye,
  FileCheck,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
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

interface FunnelStage {
  stage: string
  count: number
  label: string
}

interface DegreeRow {
  degree: string
  students: number
  placements: number
  applications: number
  placementRate: number
}

interface CompanyRow {
  company: string
  contacts: number
  placements: number
}

interface MonthlyPoint {
  month: string
  placements: number
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  message: string
}

interface PipelineData {
  universityName: string
  period: { from: string; to: string }
  funnel: FunnelStage[]
  kpis: {
    placementRate: number
    verificationRate: number
    contactToPlacementRate: number
    avgProjectsPerStudent: number
    recruiterEngagement: number
  }
  byDegree: DegreeRow[]
  topRecruitingCompanies: CompanyRow[]
  monthlyTrend: MonthlyPoint[]
  recommendations: Recommendation[]
}

const FUNNEL_COLORS = [
  '#6366f1', '#818cf8', '#a5b4fc', '#93c5fd',
  '#67e8f9', '#6ee7b7', '#86efac', '#4ade80',
]

export default function InternshipPipelinePage() {
  const t = useTranslations()
  const [data, setData] = useState<PipelineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/university/internship-pipeline')
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Errore nel caricamento')
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
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

  const { funnel, kpis, byDegree, topRecruitingCompanies, monthlyTrend, recommendations } = data

  const registered = funnel.find(f => f.stage === 'registered')?.count || 0
  const placed = funnel.find(f => f.stage === 'placed')?.count || 0
  const interviewed = funnel.find(f => f.stage === 'interview')?.count || 0
  const viewed = funnel.find(f => f.stage === 'viewed')?.count || 0

  const statCards = [
    {
      icon: GraduationCap,
      label: 'Studenti registrati',
      value: registered,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Eye,
      label: 'Profili visualizzati',
      value: viewed,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Briefcase,
      label: 'Colloqui programmati',
      value: interviewed,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: CheckCircle,
      label: 'Placement confermati',
      value: placed,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ]

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <MetricHero gradient="primary">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pipeline Tirocini</h1>
            <p className="text-sm text-muted-foreground">
              Funnel completo: registrazione, verifica, contatto, colloquio, placement
              {data.universityName !== 'All Students' && ` — ${data.universityName}`}
            </p>
          </div>
        </div>
      </MetricHero>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <GlassCard key={stat.label} delay={0.1 + idx * 0.05}>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Funnel Visualization */}
      <GlassCard delay={0.15}>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-1">Funnel di conversione</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Ogni fase del percorso studente, dalla registrazione al placement
          </p>
          <div className="space-y-3">
            {funnel.map((stage, idx) => {
              const maxCount = funnel.length > 0 ? funnel[0].count : 1
              const pct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0
              return (
                <div key={stage.stage} className="flex items-center gap-4">
                  <div className="w-44 text-sm text-muted-foreground truncate">{stage.label}</div>
                  <div className="flex-1 h-8 bg-muted/30 rounded-md overflow-hidden relative">
                    <div
                      className="h-full rounded-md transition-all duration-700"
                      style={{
                        width: `${Math.max(pct, 2)}%`,
                        backgroundColor: FUNNEL_COLORS[idx % FUNNEL_COLORS.length],
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold">
                      {stage.count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          {/* KPI badges */}
          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t">
            <Badge variant="outline" className="text-xs px-3 py-1">
              <FileCheck className="h-3 w-3 mr-1" />
              Tasso verifica: {kpis.verificationRate}%
            </Badge>
            <Badge variant="outline" className="text-xs px-3 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Placement rate: {kpis.placementRate}%
            </Badge>
            <Badge variant="outline" className="text-xs px-3 py-1">
              <Users className="h-3 w-3 mr-1" />
              Contatto → Placement: {kpis.contactToPlacementRate}%
            </Badge>
            <Badge variant="outline" className="text-xs px-3 py-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Media progetti/studente: {kpis.avgProjectsPerStudent}
            </Badge>
          </div>
        </div>
      </GlassCard>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Recruiting Companies */}
        <GlassCard delay={0.2}>
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-1">Aziende che reclutano di piu</h3>
            <p className="text-sm text-muted-foreground mb-4">Top 10 per contatti con i tuoi studenti</p>
            {topRecruitingCompanies.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topRecruitingCompanies} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="company"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip />
                  <Bar dataKey="contacts" fill="#6366f1" radius={[0, 4, 4, 0]} name="Contatti" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground/60">
                <div className="text-center">
                  <Building2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                  <p>Nessun dato disponibile</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Monthly Trend */}
        <GlassCard delay={0.25}>
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-1">Trend mensile placement</h3>
            <p className="text-sm text-muted-foreground mb-4">Ultimi 12 mesi</p>
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
                    dataKey="placements"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Placement"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground/60">
                Nessun dato disponibile
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Degree Breakdown + Recommendations */}
      <Tabs defaultValue="degrees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="degrees">Per corso di laurea</TabsTrigger>
          <TabsTrigger value="recommendations">Raccomandazioni</TabsTrigger>
        </TabsList>

        <TabsContent value="degrees">
          <GlassCard delay={0.1}>
            <div className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Corso di laurea</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Studenti</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Placement</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Tasso placement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {byDegree.length > 0 ? (
                      byDegree.map((row) => (
                        <tr key={row.degree} className="hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{row.degree}</td>
                          <td className="p-4 text-muted-foreground">{row.students}</td>
                          <td className="p-4">
                            <span className="font-semibold text-emerald-600">{row.placements}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${Math.min(row.placementRate, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-foreground/80">
                                {row.placementRate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-12 text-center">
                          <GraduationCap className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                          <p className="text-muted-foreground">Nessun dato per corso di laurea</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="recommendations">
          <GlassCard delay={0.1}>
            <div className="p-5 space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      rec.priority === 'high'
                        ? 'border-red-200 bg-red-50/50'
                        : rec.priority === 'medium'
                          ? 'border-amber-200 bg-amber-50/50'
                          : 'border-blue-200 bg-blue-50/50'
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 mt-0.5 shrink-0 ${
                        rec.priority === 'high'
                          ? 'text-red-500'
                          : rec.priority === 'medium'
                            ? 'text-amber-500'
                            : 'text-blue-500'
                      }`}
                    />
                    <div>
                      <Badge
                        variant="outline"
                        className={`text-xs mb-1 ${
                          rec.priority === 'high'
                            ? 'border-red-300 text-red-700'
                            : rec.priority === 'medium'
                              ? 'border-amber-300 text-amber-700'
                              : 'border-blue-300 text-blue-700'
                        }`}
                      >
                        {rec.priority === 'high' ? 'Alta priorita' : rec.priority === 'medium' ? 'Media priorita' : 'Bassa priorita'}
                      </Badge>
                      <p className="text-sm text-foreground/80 mt-1">{rec.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-muted-foreground">Ottimo lavoro! Nessuna raccomandazione urgente.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
