'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Briefcase,
  FileText,
  Clock,
  Users,
  Plus,
  Building2,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface PCTOActivity {
  id: string
  title: string
  description: string | null
  activityType: string
  companyName: string | null
  location: string | null
  startDate: string
  endDate: string | null
  totalHours: number
  maxStudents: number | null
  status: string
  conventionId: string | null
  convention: { id: string; companyName: string; status: string } | null
  hoursSummary: { totalHoursLogged: number; uniqueStudents: number }
}

interface PCTOConvention {
  id: string
  companyName: string
  companyContact: string | null
  companyEmail: string | null
  companyAddress: string | null
  signedDate: string | null
  expiryDate: string | null
  status: string
  activities: Array<{ id: string; title: string; status: string }>
}

interface StudentSummary {
  studentId: string
  totalHours: number
  entries: number
  activitiesCount: number
}

const ACTIVITY_TYPES = [
  { value: 'stage', label: 'Stage' },
  { value: 'project', label: 'Progetto' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'simulation', label: 'Simulazione' },
  { value: 'visit', label: 'Visita aziendale' },
]

const STATUS_COLORS: Record<string, string> = {
  PLANNED: 'bg-blue-50 text-blue-700 border-blue-200',
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  COMPLETED: 'bg-slate-50 text-slate-700 border-slate-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  DRAFT: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  EXPIRED: 'bg-red-50 text-red-700 border-red-200',
  REVOKED: 'bg-red-50 text-red-700 border-red-200',
}

export default function UniversityPCTOPage() {
  const [activities, setActivities] = useState<PCTOActivity[]>([])
  const [conventions, setConventions] = useState<PCTOConvention[]>([])
  const [studentSummaries, setStudentSummaries] = useState<StudentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form states
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showConventionForm, setShowConventionForm] = useState(false)
  const [showHoursForm, setShowHoursForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Activity form
  const [actForm, setActForm] = useState({
    title: '',
    description: '',
    activityType: 'stage',
    companyName: '',
    location: '',
    startDate: '',
    endDate: '',
    totalHours: '',
    maxStudents: '',
    conventionId: '',
  })

  // Convention form
  const [convForm, setConvForm] = useState({
    companyName: '',
    companyContact: '',
    companyEmail: '',
    companyAddress: '',
    signedDate: '',
    expiryDate: '',
  })

  // Hours form
  const [hoursForm, setHoursForm] = useState({
    studentId: '',
    activityId: '',
    date: '',
    hours: '',
    notes: '',
  })

  const fetchAll = useCallback(async () => {
    try {
      const [actRes, convRes, hoursRes] = await Promise.all([
        fetch('/api/dashboard/university/pcto'),
        fetch('/api/dashboard/university/pcto/conventions'),
        fetch('/api/dashboard/university/pcto/hours'),
      ])

      if (actRes.ok) {
        const actData = await actRes.json()
        setActivities(actData.activities || [])
      }
      if (convRes.ok) {
        const convData = await convRes.json()
        setConventions(convData.conventions || [])
      }
      if (hoursRes.ok) {
        const hoursData = await hoursRes.json()
        setStudentSummaries(hoursData.studentSummaries || [])
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const createActivity = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/university/pcto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actForm),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore')
      }
      setActForm({
        title: '', description: '', activityType: 'stage', companyName: '',
        location: '', startDate: '', endDate: '', totalHours: '', maxStudents: '', conventionId: '',
      })
      setShowActivityForm(false)
      await fetchAll()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const createConvention = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/university/pcto/conventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(convForm),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore')
      }
      setConvForm({
        companyName: '', companyContact: '', companyEmail: '', companyAddress: '',
        signedDate: '', expiryDate: '',
      })
      setShowConventionForm(false)
      await fetchAll()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const logHours = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/university/pcto/hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hoursForm),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore')
      }
      setHoursForm({ studentId: '', activityId: '', date: '', hours: '', notes: '' })
      setShowHoursForm(false)
      await fetchAll()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
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

  // Compute stats
  const totalActivities = activities.length
  const activeConventions = conventions.filter((c) => c.status === 'ACTIVE').length
  let totalHoursLogged = 0
  for (let i = 0; i < studentSummaries.length; i++) {
    totalHoursLogged += studentSummaries[i].totalHours
  }
  const studentsTracked = studentSummaries.length

  const statCards = [
    {
      icon: Briefcase,
      label: 'Attivita totali',
      value: totalActivities,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: FileText,
      label: 'Convenzioni attive',
      value: activeConventions,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Clock,
      label: 'Ore registrate',
      value: Math.round(totalHoursLogged),
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      icon: Users,
      label: 'Studenti tracciati',
      value: studentsTracked,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <MetricHero gradient="primary">
        <div className="flex items-center gap-3">
          <Briefcase className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestione PCTO</h1>
            <p className="text-sm text-muted-foreground">
              Percorsi per le Competenze Trasversali e per l&apos;Orientamento
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

      {/* Tabs */}
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">Attivita</TabsTrigger>
          <TabsTrigger value="conventions">Convenzioni</TabsTrigger>
          <TabsTrigger value="hours">Ore</TabsTrigger>
        </TabsList>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <GlassCard delay={0.1}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Attivita PCTO</h3>
                <Button
                  size="sm"
                  onClick={() => setShowActivityForm(!showActivityForm)}
                >
                  {showActivityForm ? (
                    <><ChevronUp className="h-4 w-4 mr-1" /> Chiudi</>
                  ) : (
                    <><Plus className="h-4 w-4 mr-1" /> Nuova attivita</>
                  )}
                </Button>
              </div>

              {/* Activity create form */}
              {showActivityForm && (
                <div className="mb-6 p-4 bg-muted/30 rounded-lg border space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">Titolo *</label>
                      <input
                        type="text"
                        value={actForm.title}
                        onChange={(e) => setActForm({ ...actForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Tipo *</label>
                      <select
                        value={actForm.activityType}
                        onChange={(e) => setActForm({ ...actForm, activityType: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        {ACTIVITY_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Azienda</label>
                      <input
                        type="text"
                        value={actForm.companyName}
                        onChange={(e) => setActForm({ ...actForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Luogo</label>
                      <input
                        type="text"
                        value={actForm.location}
                        onChange={(e) => setActForm({ ...actForm, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Data inizio *</label>
                      <input
                        type="date"
                        value={actForm.startDate}
                        onChange={(e) => setActForm({ ...actForm, startDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Data fine</label>
                      <input
                        type="date"
                        value={actForm.endDate}
                        onChange={(e) => setActForm({ ...actForm, endDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Ore totali *</label>
                      <input
                        type="number"
                        value={actForm.totalHours}
                        onChange={(e) => setActForm({ ...actForm, totalHours: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Max studenti</label>
                      <input
                        type="number"
                        value={actForm.maxStudents}
                        onChange={(e) => setActForm({ ...actForm, maxStudents: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Descrizione</label>
                    <textarea
                      value={actForm.description}
                      onChange={(e) => setActForm({ ...actForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    />
                  </div>
                  {conventions.length > 0 && (
                    <div>
                      <label className="text-sm font-medium block mb-1">Convenzione (opzionale)</label>
                      <select
                        value={actForm.conventionId}
                        onChange={(e) => setActForm({ ...actForm, conventionId: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">-- Nessuna --</option>
                        {conventions.map((c) => (
                          <option key={c.id} value={c.id}>{c.companyName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <Button onClick={createActivity} disabled={submitting} size="sm">
                    {submitting ? 'Salvataggio...' : 'Crea attivita'}
                  </Button>
                </div>
              )}

              {/* Activities list */}
              {activities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Attivita</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Tipo</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Azienda</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Ore</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Stato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {activities.map((a) => (
                        <tr key={a.id} className="hover:bg-muted/50">
                          <td className="p-4">
                            <p className="font-medium text-foreground">{a.title}</p>
                            {a.convention && (
                              <p className="text-xs text-muted-foreground">
                                Conv: {a.convention.companyName}
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">
                              {ACTIVITY_TYPES.find((t) => t.value === a.activityType)?.label || a.activityType}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {a.companyName ? (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5 text-muted-foreground/60" />
                                <span>{a.companyName}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(a.startDate).toLocaleDateString('it-IT')}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold">{a.hoursSummary.totalHoursLogged}</span>
                            <span className="text-muted-foreground">/{a.totalHours}h</span>
                            <p className="text-xs text-muted-foreground">
                              {a.hoursSummary.uniqueStudents} studenti
                            </p>
                          </td>
                          <td className="p-4">
                            <Badge className={STATUS_COLORS[a.status] || 'bg-slate-50'}>
                              {a.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p>Nessuna attivita PCTO registrata</p>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Conventions Tab */}
        <TabsContent value="conventions">
          <GlassCard delay={0.1}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Convenzioni</h3>
                <Button
                  size="sm"
                  onClick={() => setShowConventionForm(!showConventionForm)}
                >
                  {showConventionForm ? (
                    <><ChevronUp className="h-4 w-4 mr-1" /> Chiudi</>
                  ) : (
                    <><Plus className="h-4 w-4 mr-1" /> Nuova convenzione</>
                  )}
                </Button>
              </div>

              {/* Convention create form */}
              {showConventionForm && (
                <div className="mb-6 p-4 bg-muted/30 rounded-lg border space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">Nome azienda *</label>
                      <input
                        type="text"
                        value={convForm.companyName}
                        onChange={(e) => setConvForm({ ...convForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Referente</label>
                      <input
                        type="text"
                        value={convForm.companyContact}
                        onChange={(e) => setConvForm({ ...convForm, companyContact: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Email</label>
                      <input
                        type="email"
                        value={convForm.companyEmail}
                        onChange={(e) => setConvForm({ ...convForm, companyEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Indirizzo</label>
                      <input
                        type="text"
                        value={convForm.companyAddress}
                        onChange={(e) => setConvForm({ ...convForm, companyAddress: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Data firma</label>
                      <input
                        type="date"
                        value={convForm.signedDate}
                        onChange={(e) => setConvForm({ ...convForm, signedDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Data scadenza</label>
                      <input
                        type="date"
                        value={convForm.expiryDate}
                        onChange={(e) => setConvForm({ ...convForm, expiryDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                  </div>
                  <Button onClick={createConvention} disabled={submitting} size="sm">
                    {submitting ? 'Salvataggio...' : 'Crea convenzione'}
                  </Button>
                </div>
              )}

              {/* Conventions list */}
              {conventions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Azienda</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Referente</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Scadenza</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Attivita</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Stato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {conventions.map((c) => (
                        <tr key={c.id} className="hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground/60" />
                              <span className="font-medium">{c.companyName}</span>
                            </div>
                            {c.companyEmail && (
                              <p className="text-xs text-muted-foreground ml-6">{c.companyEmail}</p>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {c.companyContact || '-'}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {c.expiryDate
                              ? new Date(c.expiryDate).toLocaleDateString('it-IT')
                              : '-'}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold">{c.activities.length}</span>
                          </td>
                          <td className="p-4">
                            <Badge className={STATUS_COLORS[c.status] || 'bg-slate-50'}>
                              {c.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p>Nessuna convenzione registrata</p>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Hours Tab */}
        <TabsContent value="hours">
          <GlassCard delay={0.1}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Registro Ore</h3>
                <Button
                  size="sm"
                  onClick={() => setShowHoursForm(!showHoursForm)}
                >
                  {showHoursForm ? (
                    <><ChevronUp className="h-4 w-4 mr-1" /> Chiudi</>
                  ) : (
                    <><Plus className="h-4 w-4 mr-1" /> Registra ore</>
                  )}
                </Button>
              </div>

              {/* Hours log form */}
              {showHoursForm && (
                <div className="mb-6 p-4 bg-muted/30 rounded-lg border space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">ID Studente *</label>
                      <input
                        type="text"
                        value={hoursForm.studentId}
                        onChange={(e) => setHoursForm({ ...hoursForm, studentId: e.target.value })}
                        placeholder="ID dello studente"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Attivita *</label>
                      <select
                        value={hoursForm.activityId}
                        onChange={(e) => setHoursForm({ ...hoursForm, activityId: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">-- Seleziona --</option>
                        {activities.map((a) => (
                          <option key={a.id} value={a.id}>{a.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Data *</label>
                      <input
                        type="date"
                        value={hoursForm.date}
                        onChange={(e) => setHoursForm({ ...hoursForm, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Ore *</label>
                      <input
                        type="number"
                        step="0.5"
                        value={hoursForm.hours}
                        onChange={(e) => setHoursForm({ ...hoursForm, hours: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Note</label>
                    <input
                      type="text"
                      value={hoursForm.notes}
                      onChange={(e) => setHoursForm({ ...hoursForm, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    />
                  </div>
                  <Button onClick={logHours} disabled={submitting} size="sm">
                    {submitting ? 'Salvataggio...' : 'Registra ore'}
                  </Button>
                </div>
              )}

              {/* Per-student summaries */}
              {studentSummaries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Studente</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Ore totali</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Registrazioni</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Attivita</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {studentSummaries.map((s) => (
                        <tr key={s.studentId} className="hover:bg-muted/50">
                          <td className="p-4">
                            <p className="font-medium text-foreground font-mono text-sm">
                              {s.studentId.slice(0, 12)}...
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-primary">{s.totalHours}h</span>
                          </td>
                          <td className="p-4 text-muted-foreground">{s.entries}</td>
                          <td className="p-4 text-muted-foreground">{s.activitiesCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p>Nessuna ora registrata</p>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
