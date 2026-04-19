'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, PlaneTakeoff, PlaneLanding, Users, Plus, X, CheckCircle, ArrowUpRight } from 'lucide-react'

interface ExchangeRow {
  id: string
  student: {
    id: string
    name: string
    email: string
    photo: string | null
    degree: string | null
  }
  homeUniversityName?: string
  hostUniversityName?: string
  homeCountry?: string
  hostCountry?: string
  programType: string
  startDate: string
  endDate: string | null
  status: string
  verifiedByHome: boolean
  verifiedByHost: boolean
}

interface Partnership {
  id: string
  partnerName: string
  exchangeType: string
  status: string
  maxStudents: number | null
  startDate: string | null
  endDate: string | null
}

interface ExchangeData {
  universityName: string
  stats: {
    totalOutbound: number
    totalInbound: number
    activePartnerships: number
    byCountryOut: Record<string, number>
    byCountryIn: Record<string, number>
  }
  outbound: ExchangeRow[]
  inbound: ExchangeRow[]
  partnerships: Partnership[]
}

interface SkillInput {
  skill: string
  level: number
  evidence?: string
}

export default function UniversityExchangesPage() {
  const [data, setData] = useState<ExchangeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [skills, setSkills] = useState<SkillInput[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/dashboard/university/exchanges')
    if (res.ok) setData(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openComplete = (id: string) => {
    setCompletingId(id)
    setSkills([])
    setNewSkill('')
    setMessage(null)
  }

  const addSkill = () => {
    const trimmed = newSkill.trim()
    if (trimmed) {
      setSkills([...skills, { skill: trimmed, level: 2 }])
      setNewSkill('')
    }
  }

  const submit = async () => {
    if (!completingId) return
    setSubmitting(true)
    const res = await fetch(`/api/dashboard/university/exchanges/${completingId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillsAcquired: skills }),
    })
    if (res.ok) {
      const json = await res.json()
      setMessage(`Marked complete. ${json.deltasCreated ?? 0} skill deltas pushed to home institution.`)
      setCompletingId(null)
      await load()
    } else {
      const err = await res.json()
      setMessage(err.error || 'Failed to submit.')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Globe className="h-7 w-7 text-primary" />
          Cross-border exchanges
        </h1>
        <p className="text-muted-foreground">
          Inbound and outbound Erasmus / bilateral students. When you mark an inbound exchange
          complete, skill deltas automatically push back to the student&apos;s home institution.
        </p>
      </div>

      {message && (
        <Card className="mb-4 border-emerald-200 bg-emerald-50">
          <CardContent className="pt-4 pb-4 text-sm flex gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            {message}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Outbound" value={data.stats.totalOutbound} icon={<PlaneTakeoff className="h-5 w-5" />} />
        <StatCard label="Inbound" value={data.stats.totalInbound} icon={<PlaneLanding className="h-5 w-5" />} />
        <StatCard label="Active partnerships" value={data.stats.activePartnerships} icon={<Users className="h-5 w-5" />} />
        <StatCard
          label="Partner countries"
          value={new Set([...Object.keys(data.stats.byCountryOut), ...Object.keys(data.stats.byCountryIn)]).size}
          icon={<Globe className="h-5 w-5" />}
        />
      </div>

      <Tabs defaultValue="inbound">
        <TabsList>
          <TabsTrigger value="inbound">Inbound ({data.inbound.length})</TabsTrigger>
          <TabsTrigger value="outbound">Outbound ({data.outbound.length})</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships ({data.partnerships.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="inbound" className="mt-4 space-y-3">
          {data.inbound.length === 0 ? (
            <EmptyState text="No inbound exchange students." />
          ) : (
            data.inbound.map(e => (
              <Card key={e.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{e.student.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          from {e.homeUniversityName} · {e.homeCountry}
                        </Badge>
                        <Badge className="text-xs">{e.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {e.student.degree} · {e.programType} · {new Date(e.startDate).toLocaleDateString()}
                        {e.endDate && ` → ${new Date(e.endDate).toLocaleDateString()}`}
                      </div>
                    </div>
                    {e.status !== 'COMPLETED' && (
                      <Button size="sm" onClick={() => openComplete(e.id)}>
                        Mark complete & push skills
                      </Button>
                    )}
                  </div>

                  {completingId === e.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <h4 className="font-semibold text-sm">
                        Skills acquired during exchange at your institution
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Add skills the student demonstrably gained. These will flow back to their
                        home institution&apos;s verified skill graph.
                      </p>

                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={ev => setNewSkill(ev.target.value)}
                          onKeyDown={ev => ev.key === 'Enter' && (ev.preventDefault(), addSkill())}
                          placeholder="Add a skill (e.g., Machine Learning)"
                        />
                        <Button variant="outline" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {skills.map((s, idx) => (
                          <div key={idx} className="flex gap-2 items-center p-2 border rounded">
                            <span className="flex-1 font-medium text-sm">{s.skill}</span>
                            <select
                              value={s.level}
                              onChange={ev => {
                                const next = [...skills]
                                next[idx] = { ...s, level: parseInt(ev.target.value) }
                                setSkills(next)
                              }}
                              className="px-2 py-1 text-sm border rounded"
                            >
                              <option value={1}>Beginner</option>
                              <option value={2}>Intermediate</option>
                              <option value={3}>Advanced</option>
                              <option value={4}>Expert</option>
                            </select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setCompletingId(null)}>
                          Cancel
                        </Button>
                        <Button onClick={submit} disabled={submitting || skills.length === 0}>
                          {submitting ? 'Submitting…' : 'Mark complete'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="outbound" className="mt-4 space-y-3">
          {data.outbound.length === 0 ? (
            <EmptyState text="No outbound exchange students." />
          ) : (
            data.outbound.map(e => (
              <Card key={e.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{e.student.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          to {e.hostUniversityName} · {e.hostCountry}
                        </Badge>
                        <Badge className="text-xs">{e.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {e.student.degree} · {e.programType} · {new Date(e.startDate).toLocaleDateString()}
                        {e.endDate && ` → ${new Date(e.endDate).toLocaleDateString()}`}
                      </div>
                    </div>
                    {e.verifiedByHost && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Host verified
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="partnerships" className="mt-4 space-y-3">
          {data.partnerships.length === 0 ? (
            <EmptyState text="No partnerships yet." />
          ) : (
            data.partnerships.map(p => (
              <Card key={p.id}>
                <CardContent className="pt-4 pb-4 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{p.partnerName}</h3>
                    <div className="text-sm text-muted-foreground">
                      {p.exchangeType} · {p.status}
                      {p.maxStudents && ` · max ${p.maxStudents} students/year`}
                    </div>
                  </div>
                  <Badge>{p.status}</Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center py-8">
        <Globe className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}
