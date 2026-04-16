'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  CheckCircle,
  TrendingUp,
  Zap,
  Building2,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface PublicBoardData {
  universityName: string
  placementStats: {
    totalStudents: number
    confirmedHired: number
    placementRate: number
  }
  skillsGapSummary: Array<{ skill: string; gap: number }>
  topCompanies: Array<{ company: string; hires: number }>
  activationRate: number
}

export default function PublicBoardPage() {
  const params = useParams()
  const token = params.token as string
  const [data, setData] = useState<PublicBoardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/board/${token}`)
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Board non trovata')
        }
        setData(await res.json())
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchData()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container max-w-5xl mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-10 w-80 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-sm text-red-500 mt-1">
              Il link potrebbe essere scaduto o non valido.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { universityName, placementStats, skillsGapSummary, topCompanies, activationRate } = data

  const statCards = [
    {
      icon: Users,
      label: 'Studenti totali',
      value: placementStats.totalStudents,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: CheckCircle,
      label: 'Assunti confermati',
      value: placementStats.confirmedHired,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: TrendingUp,
      label: 'Tasso di placement',
      value: `${placementStats.placementRate}%`,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: Zap,
      label: 'Tasso di attivazione',
      value: `${activationRate}%`,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{universityName}</h1>
          <p className="text-muted-foreground">Dashboard di outcome per il CTS</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Companies Chart */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-1">Aziende che assumono</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Top aziende per assunzioni confermate
            </p>
            {topCompanies.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topCompanies} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="company" type="category" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="hires" fill="#10b981" radius={[0, 4, 4, 0]} name="Assunzioni" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground/60">
                <div className="text-center">
                  <Building2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                  <p>Nessun dato disponibile</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Gap Highlights */}
        {skillsGapSummary.length > 0 && (
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">Skills Gap</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Competenze piu richieste dal mercato vs preparazione studenti
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {skillsGapSummary.map((item) => {
                  const gapPct = Math.round(item.gap * 100)
                  let priorityColor = 'bg-green-50 text-green-700 border-green-200'
                  if (gapPct > 50) {
                    priorityColor = 'bg-red-50 text-red-700 border-red-200'
                  } else if (gapPct > 25) {
                    priorityColor = 'bg-amber-50 text-amber-700 border-amber-200'
                  }
                  return (
                    <div
                      key={item.skill}
                      className="flex items-center justify-between p-3 rounded-lg border bg-background"
                    >
                      <span className="font-medium text-foreground">{item.skill}</span>
                      <Badge className={priorityColor}>{gapPct}%</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-4 border-t border-muted">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <span className="font-semibold text-primary">InTransparency</span>
          </p>
        </div>
      </div>
    </div>
  )
}
