'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  CheckCircle,
  TrendingUp,
  Zap,
  Share2,
  Copy,
  Trash2,
  Plus,
  Building2,
  BarChart3,
  AlertTriangle,
  BookOpen,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface BoardData {
  universityName: string
  placementStats: {
    totalStudents: number
    confirmedHired: number
    placementRate: number
  }
  skillsGapSummary: Array<{ skill: string; gap: number }>
  topCompanies: Array<{ company: string; hires: number }>
  activationRate: number
  shareLinks: Array<{
    id: string
    token: string
    label: string | null
    expiresAt: string
    accessCount: number
    lastAccessedAt: string | null
    createdAt: string
  }>
}

export default function UniversityBoardPage() {
  const [data, setData] = useState<BoardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/university/board')
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

  useEffect(() => {
    fetchData()
  }, [])

  const createLink = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/dashboard/university/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newLinkLabel || null }),
      })
      if (!res.ok) throw new Error('Failed to create link')
      setNewLinkLabel('')
      await fetchData()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  const revokeLink = async (linkId: string) => {
    try {
      const res = await fetch('/api/dashboard/university/board', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId }),
      })
      if (!res.ok) throw new Error('Failed to revoke')
      await fetchData()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/board/${token}`
    navigator.clipboard.writeText(url)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

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
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
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

  const { placementStats, skillsGapSummary, topCompanies, activationRate, shareLinks } = data

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
      color: 'text-primary',
      bg: 'bg-primary/5',
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
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <MetricHero gradient="primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Board CTS</h1>
              <p className="text-sm text-muted-foreground">
                Dashboard di sintesi per il Consiglio Tecnico Scientifico
              </p>
            </div>
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

      {/* Main content tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="skills">Skills Gap</TabsTrigger>
          <TabsTrigger value="share">Condividi</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Hiring Companies */}
            <GlassCard delay={0.2}>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">Aziende che assumono</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Top aziende per numero di assunzioni confermate
                </p>
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
                      <Bar dataKey="hires" fill="#10b981" radius={[0, 4, 4, 0]} name="Assunzioni" />
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

            {/* Curriculum Recommendations */}
            <GlassCard delay={0.25}>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">Raccomandazioni curriculari</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Suggerimenti basati sui gap di competenze rilevati
                </p>
                {skillsGapSummary.length > 0 ? (
                  <div className="space-y-3">
                    {skillsGapSummary.slice(0, 5).map((item) => (
                      <div
                        key={item.skill}
                        className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100"
                      >
                        <BookOpen className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.skill}</p>
                          <p className="text-sm text-muted-foreground">
                            Gap: {Math.round(item.gap * 100)}% — Considerare integrazione nel piano di studi
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-muted-foreground/60">
                    <div className="text-center">
                      <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                      <p>Analisi gap non ancora disponibile</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Skills Gap Tab */}
        <TabsContent value="skills">
          <GlassCard delay={0.1}>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">Dettaglio Skills Gap</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Competenze dove il mercato richiede di piu rispetto a cio che gli studenti possiedono
              </p>
              {skillsGapSummary.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Competenza</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Gap</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Priorita</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {skillsGapSummary.map((item) => {
                        const gapPct = Math.round(item.gap * 100)
                        let priority = 'Bassa'
                        let priorityColor = 'bg-green-50 text-green-700 border-green-200'
                        if (gapPct > 50) {
                          priority = 'Alta'
                          priorityColor = 'bg-red-50 text-red-700 border-red-200'
                        } else if (gapPct > 25) {
                          priority = 'Media'
                          priorityColor = 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                        return (
                          <tr key={item.skill} className="hover:bg-muted/50">
                            <td className="p-4 font-medium text-foreground">{item.skill}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-red-400 rounded-full"
                                    style={{ width: `${Math.min(gapPct, 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-foreground/80">{gapPct}%</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={priorityColor}>{priority}</Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p>Nessuna analisi gap disponibile</p>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Share Links Tab */}
        <TabsContent value="share">
          <GlassCard delay={0.1}>
            <div className="p-5 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Link di condivisione</h3>
                <p className="text-sm text-muted-foreground">
                  Crea link pubblici per condividere la board con i membri del CTS
                </p>
              </div>

              {/* Create new link */}
              <div className="flex items-end gap-3 p-4 bg-muted/30 rounded-lg border">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Etichetta (opzionale)
                  </label>
                  <input
                    type="text"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    placeholder="es. CTS Riunione Aprile 2026"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  />
                </div>
                <Button onClick={createLink} disabled={creating} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  {creating ? 'Creazione...' : 'Crea link'}
                </Button>
              </div>

              {/* Existing links */}
              {shareLinks.length > 0 ? (
                <div className="space-y-3">
                  {shareLinks.map((link) => {
                    const isExpired = new Date(link.expiresAt) < new Date()
                    return (
                      <div
                        key={link.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isExpired ? 'bg-red-50/50 border-red-200' : 'bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Share2 className={`h-5 w-5 shrink-0 ${isExpired ? 'text-red-400' : 'text-primary'}`} />
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {link.label || 'Link senza etichetta'}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>
                                Scade: {new Date(link.expiresAt).toLocaleDateString('it-IT')}
                              </span>
                              <span>Accessi: {link.accessCount}</span>
                              {isExpired && (
                                <Badge className="bg-red-50 text-red-700 border-red-200">Scaduto</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {!isExpired && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyLink(link.token)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              {copied === link.token ? 'Copiato!' : 'Copia'}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => revokeLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Share2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p>Nessun link di condivisione creato</p>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
