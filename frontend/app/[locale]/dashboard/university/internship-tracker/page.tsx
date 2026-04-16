'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Clock,
  Users,
  CheckCircle,
  Star,
  Search,
  Plus,
  CalendarDays,
  ClipboardList,
  BarChart3,
  AlertCircle,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

// --- Types ---

interface InternshipLog {
  id: string
  studentId: string
  studentName: string
  companyName: string
  supervisorName: string | null
  date: string
  hoursWorked: number
  activity: string | null
  location: string | null
  supervisorRating: number | null
  status: string
  verified: boolean
  studentNotes: string | null
  supervisorNotes: string | null
}

interface Summary {
  totalHours: number
  attendanceRate: number
  avgRating: number
  studentCount: number
  totalLogs: number
}

interface StudentSummary {
  studentId: string
  studentName: string
  companyName: string
  totalHours: number
  daysPresent: number
  daysAbsent: number
  daysExcused: number
  daysLate: number
  totalDays: number
  attendanceRate: number
  avgSupervisorRating: number | null
  lastLogDate: string | null
}

// --- Helpers ---

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; className: string }> = {
    PRESENT: { label: 'Presente', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ABSENT: { label: 'Assente', className: 'bg-red-50 text-red-700 border-red-200' },
    EXCUSED: { label: 'Giustificato', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    LATE: { label: 'In ritardo', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  }
  const info = map[status] || { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' }
  return <Badge className={info.className}>{info.label}</Badge>
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const renderStars = (rating: number | null) => {
  if (rating == null) return <span className="text-muted-foreground text-sm">-</span>
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </span>
  )
}

// --- Component ---

export default function InternshipTrackerPage() {
  const [activeTab, setActiveTab] = useState('panoramica')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Panoramica state
  const [summary, setSummary] = useState<Summary | null>(null)
  const [studentSummaries, setStudentSummaries] = useState<StudentSummary[]>([])

  // Registro state
  const [logs, setLogs] = useState<InternshipLog[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form state
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState('')
  const [formError, setFormError] = useState('')
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([])
  const [form, setForm] = useState({
    studentId: '',
    companyName: '',
    date: '',
    hoursWorked: '',
    activity: '',
    location: '',
    supervisorName: '',
    supervisorEmail: '',
    supervisorRating: '',
    status: 'PRESENT',
    studentNotes: '',
    supervisorNotes: '',
  })

  // Fetch data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [logsRes, summaryRes] = await Promise.all([
          fetch('/api/dashboard/university/internship-tracker'),
          fetch('/api/dashboard/university/internship-tracker/summary'),
        ])

        if (!logsRes.ok || !summaryRes.ok) {
          const err = !logsRes.ok ? await logsRes.json() : await summaryRes.json()
          throw new Error(err.error || 'Errore nel caricamento')
        }

        const logsData = await logsRes.json()
        const summaryData = await summaryRes.json()

        setLogs(logsData.logs || [])
        setSummary(logsData.summary || null)
        setStudentSummaries(summaryData.summaries || [])

        // Extract unique students for the form dropdown
        const uniqueMap = new Map<string, string>()
        const allLogs = logsData.logs as InternshipLog[]
        for (let i = 0; i < allLogs.length; i++) {
          const log = allLogs[i]
          if (!uniqueMap.has(log.studentId)) {
            uniqueMap.set(log.studentId, log.studentName)
          }
        }
        // Also from summaries
        const sums = summaryData.summaries as StudentSummary[]
        for (let i = 0; i < sums.length; i++) {
          if (!uniqueMap.has(sums[i].studentId)) {
            uniqueMap.set(sums[i].studentId, sums[i].studentName)
          }
        }
        setStudents(Array.from(uniqueMap.entries()).map(([id, name]) => ({ id, name })))
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')
    setFormSuccess('')

    try {
      const res = await fetch('/api/dashboard/university/internship-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: form.studentId,
          companyName: form.companyName,
          date: form.date,
          hoursWorked: parseFloat(form.hoursWorked),
          activity: form.activity || undefined,
          location: form.location || undefined,
          supervisorName: form.supervisorName || undefined,
          supervisorEmail: form.supervisorEmail || undefined,
          supervisorRating: form.supervisorRating ? parseInt(form.supervisorRating) : undefined,
          status: form.status,
          studentNotes: form.studentNotes || undefined,
          supervisorNotes: form.supervisorNotes || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore nel salvataggio')
      }

      setFormSuccess('Log registrato con successo!')
      setForm({
        studentId: '',
        companyName: '',
        date: '',
        hoursWorked: '',
        activity: '',
        location: '',
        supervisorName: '',
        supervisorEmail: '',
        supervisorRating: '',
        status: 'PRESENT',
        studentNotes: '',
        supervisorNotes: '',
      })

      // Refresh data
      const [logsRes, summaryRes] = await Promise.all([
        fetch('/api/dashboard/university/internship-tracker'),
        fetch('/api/dashboard/university/internship-tracker/summary'),
      ])
      if (logsRes.ok) {
        const d = await logsRes.json()
        setLogs(d.logs || [])
        setSummary(d.summary || null)
      }
      if (summaryRes.ok) {
        const d = await summaryRes.json()
        setStudentSummaries(d.summaries || [])
      }
    } catch (e: any) {
      setFormError(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchSearch = !searchQuery || log.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = !filterStatus || log.status === filterStatus
    return matchSearch && matchStatus
  })

  // --- Render ---

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
        <Skeleton className="h-80" />
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

  const statCards = [
    {
      icon: Clock,
      label: 'Ore totali registrate',
      value: summary?.totalHours ?? 0,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Users,
      label: 'Studenti monitorati',
      value: summary?.studentCount ?? 0,
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      icon: CheckCircle,
      label: 'Tasso di presenza',
      value: `${summary?.attendanceRate ?? 0}%`,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Star,
      label: 'Valutazione media tutor',
      value: summary?.avgRating ? `${summary.avgRating}/5` : 'N/A',
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
            <ClipboardList className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Registro Ore Tirocinio</h1>
              <p className="text-sm text-muted-foreground">
                Monitora le ore, la presenza e le valutazioni dei tutor aziendali
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="panoramica">
            <BarChart3 className="h-4 w-4 mr-1.5" />
            Panoramica
          </TabsTrigger>
          <TabsTrigger value="registro">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            Registro Ore
          </TabsTrigger>
          <TabsTrigger value="nuovo">
            <Plus className="h-4 w-4 mr-1.5" />
            Nuovo Log
          </TabsTrigger>
        </TabsList>

        {/* --- Panoramica Tab --- */}
        <TabsContent value="panoramica">
          <GlassCard delay={0.1}>
            <div className="p-0">
              <div className="px-5 pt-5 pb-3">
                <h3 className="text-lg font-semibold">Riepilogo per Studente</h3>
                <p className="text-sm text-muted-foreground">
                  Ore totali, presenze e valutazioni aggregate per ogni tirocinante
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Studente</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Azienda</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ore totali</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Giorni</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Presenza</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Valutazione</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ultimo log</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {studentSummaries.length > 0 ? (
                      studentSummaries.map((s) => (
                        <tr key={s.studentId} className="hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{s.studentName}</td>
                          <td className="p-4 text-muted-foreground">{s.companyName}</td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-600">{s.totalHours}h</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              <span className="text-emerald-600" title="Presente">{s.daysPresent}P</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-red-600" title="Assente">{s.daysAbsent}A</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-amber-600" title="Giustificato">{s.daysExcused}G</span>
                              {s.daysLate > 0 && (
                                <>
                                  <span className="text-muted-foreground">/</span>
                                  <span className="text-orange-600" title="In ritardo">{s.daysLate}R</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    s.attendanceRate >= 80
                                      ? 'bg-emerald-500'
                                      : s.attendanceRate >= 60
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(s.attendanceRate, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{s.attendanceRate}%</span>
                            </div>
                          </td>
                          <td className="p-4">{renderStars(s.avgSupervisorRating)}</td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {s.lastLogDate ? formatDate(s.lastLogDate) : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-12 text-center">
                          <ClipboardList className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                          <p className="text-muted-foreground">Nessun dato di tirocinio registrato</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* --- Registro Ore Tab --- */}
        <TabsContent value="registro">
          <GlassCard delay={0.1}>
            <div className="p-5 space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cerca per nome studente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Tutti gli stati</option>
                  <option value="PRESENT">Presente</option>
                  <option value="ABSENT">Assente</option>
                  <option value="EXCUSED">Giustificato</option>
                  <option value="LATE">In ritardo</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Data</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Studente</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Azienda</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ore</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Attivita</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Stato</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Valutazione</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Verificato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-muted/50">
                          <td className="p-4 text-sm">{formatDate(log.date)}</td>
                          <td className="p-4 font-medium text-foreground">{log.studentName}</td>
                          <td className="p-4 text-muted-foreground">{log.companyName}</td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-600">{log.hoursWorked}h</span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate">
                            {log.activity || '-'}
                          </td>
                          <td className="p-4">{statusBadge(log.status)}</td>
                          <td className="p-4">{renderStars(log.supervisorRating)}</td>
                          <td className="p-4">
                            {log.verified ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Si
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">No</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-12 text-center">
                          <CalendarDays className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                          <p className="text-muted-foreground">
                            {searchQuery || filterStatus
                              ? 'Nessun log trovato con i filtri selezionati'
                              : 'Nessun log registrato'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredLogs.length > 0 && (
                <p className="text-sm text-muted-foreground text-right">
                  {filteredLogs.length} {filteredLogs.length === 1 ? 'risultato' : 'risultati'}
                </p>
              )}
            </div>
          </GlassCard>
        </TabsContent>

        {/* --- Nuovo Log Tab --- */}
        <TabsContent value="nuovo">
          <GlassCard delay={0.1}>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">Registra Nuovo Log</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Inserisci i dati della giornata di tirocinio
              </p>

              {formSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {formSuccess}
                </div>
              )}

              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Student + Company */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Studente *</Label>
                    {students.length > 0 ? (
                      <select
                        id="studentId"
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                        required
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Seleziona studente...</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id="studentId"
                        placeholder="ID studente"
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                        required
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Azienda *</Label>
                    <Input
                      id="companyName"
                      placeholder="Nome azienda ospitante"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Date + Hours + Status */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoursWorked">Ore lavorate *</Label>
                    <Input
                      id="hoursWorked"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="8"
                      value={form.hoursWorked}
                      onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Stato</Label>
                    <select
                      id="status"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="PRESENT">Presente</option>
                      <option value="ABSENT">Assente</option>
                      <option value="EXCUSED">Giustificato</option>
                      <option value="LATE">In ritardo</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Activity + Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity">Attivita svolta</Label>
                    <Input
                      id="activity"
                      placeholder="Descrivi l'attivita..."
                      value={form.activity}
                      onChange={(e) => setForm({ ...form, activity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Sede</Label>
                    <select
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Seleziona...</option>
                      <option value="on-site">In sede</option>
                      <option value="remote">Da remoto</option>
                      <option value="mixed">Misto</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Supervisor */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supervisorName">Nome tutor aziendale</Label>
                    <Input
                      id="supervisorName"
                      placeholder="Nome e cognome"
                      value={form.supervisorName}
                      onChange={(e) => setForm({ ...form, supervisorName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisorEmail">Email tutor</Label>
                    <Input
                      id="supervisorEmail"
                      type="email"
                      placeholder="email@azienda.it"
                      value={form.supervisorEmail}
                      onChange={(e) => setForm({ ...form, supervisorEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisorRating">Valutazione tutor (1-5)</Label>
                    <select
                      id="supervisorRating"
                      value={form.supervisorRating}
                      onChange={(e) => setForm({ ...form, supervisorRating: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Nessuna</option>
                      <option value="1">1 - Insufficiente</option>
                      <option value="2">2 - Sufficiente</option>
                      <option value="3">3 - Buono</option>
                      <option value="4">4 - Ottimo</option>
                      <option value="5">5 - Eccellente</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Notes */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentNotes">Note studente</Label>
                    <Input
                      id="studentNotes"
                      placeholder="Osservazioni dello studente..."
                      value={form.studentNotes}
                      onChange={(e) => setForm({ ...form, studentNotes: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisorNotes">Note tutor</Label>
                    <Input
                      id="supervisorNotes"
                      placeholder="Osservazioni del tutor..."
                      value={form.supervisorNotes}
                      onChange={(e) => setForm({ ...form, supervisorNotes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <span className="animate-spin mr-2">&#9696;</span>
                        Salvataggio...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Registra Log
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
