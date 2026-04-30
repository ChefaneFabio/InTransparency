'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft, Building2, Briefcase, GraduationCap, Clock, Target, Calendar,
  Users, CheckCircle2, AlertTriangle, TrendingUp,
  FileText, Loader2, Download, Mail, MapPin,
} from 'lucide-react'

interface Stage { id: string; name: string; order: number; type: string }
interface Evaluation {
  id: string; kind: string; submitterRole: string; comments: string | null;
  submittedAt: string; scores: any;
  submittedBy: { id: string; firstName: string | null; lastName: string | null }
}
interface HoursLog {
  id: string; periodStart: string; periodEnd: string; hours: number;
  source: string | null; confirmedByTutor: boolean; notes: string | null;
  loggedByRole: string;
}
interface Deadline { id: string; label: string; dueAt: string; completedAt: string | null; type: string }
interface Placement {
  id: string
  studentId: string
  companyName: string
  jobTitle: string
  offerType: string
  startDate: string
  endDate: string | null
  plannedHours: number | null
  completedHours: number
  lastHoursLoggedAt: string | null
  stageEnteredAt: string | null
  outcome: string | null
  outcomeNotes: string | null
  status: string
  student: null | { id: string; firstName: string | null; lastName: string | null; email: string; degree: string | null; photo: string | null }
  academicTutor: null | { id: string; firstName: string | null; lastName: string | null; email: string | null }
  companyTutor: null | { id: string; firstName: string | null; lastName: string | null; email: string | null }
  currentStage: Stage | null
  convention: null | { id: string; companyName: string; status: string }
  evaluations: Evaluation[]
  deadlines: Deadline[]
  hoursLogs: HoursLog[]
}

interface Detail {
  placement: Placement
  viewerRole: string
  canEdit: boolean
  stages: Stage[]
}

function fullName(u: { firstName: string | null; lastName: string | null } | null, fallback = '—'): string {
  if (!u) return fallback
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || fallback
}

function initials(s: string): string {
  return s.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase() || '?'
}

function fmtDate(d: string, locale: string = 'it'): string {
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

const OFFER_TYPE_LABEL: Record<string, string> = {
  TIROCINIO_CURRICULARE: 'Tirocinio curriculare',
  TIROCINIO_EXTRA: 'Tirocinio extracurriculare',
  APPRENDISTATO: 'Apprendistato',
  PLACEMENT: 'Placement',
  PART_TIME: 'Part-time',
}

export default function PlacementDetailPage() {
  const params = useParams()
  const locale = useLocale()
  const isIt = locale === 'it'
  const placementId = params?.id as string

  const [data, setData] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  const [hoursOpen, setHoursOpen] = useState(false)
  const [hoursForm, setHoursForm] = useState({ periodStart: '', periodEnd: '', hours: '', notes: '' })
  const [hoursSaving, setHoursSaving] = useState(false)

  const [evalOpen, setEvalOpen] = useState(false)
  const [evalForm, setEvalForm] = useState({ kind: 'MID', comments: '' })
  const [evalSaving, setEvalSaving] = useState(false)

  const [stageOpen, setStageOpen] = useState(false)
  const [stageTarget, setStageTarget] = useState('')
  const [stageNote, setStageNote] = useState('')
  const [stageSaving, setStageSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/placements/${placementId}`)
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [placementId])

  useEffect(() => { load() }, [load])

  const logHours = async () => {
    if (!hoursForm.periodStart || !hoursForm.periodEnd || !hoursForm.hours) return
    setHoursSaving(true)
    try {
      const res = await fetch(`/api/placements/${placementId}/hours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodStart: hoursForm.periodStart,
          periodEnd: hoursForm.periodEnd,
          hours: Number(hoursForm.hours),
          notes: hoursForm.notes || undefined,
        }),
      })
      if (res.ok) {
        setHoursOpen(false)
        setHoursForm({ periodStart: '', periodEnd: '', hours: '', notes: '' })
        load()
      }
    } finally {
      setHoursSaving(false)
    }
  }

  const submitEvaluation = async () => {
    setEvalSaving(true)
    try {
      const res = await fetch(`/api/placements/${placementId}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: evalForm.kind, comments: evalForm.comments || undefined }),
      })
      if (res.ok) {
        setEvalOpen(false)
        setEvalForm({ kind: 'MID', comments: '' })
        load()
      }
    } finally {
      setEvalSaving(false)
    }
  }

  const changeStage = async () => {
    if (!stageTarget) return
    setStageSaving(true)
    try {
      const res = await fetch(`/api/placements/${placementId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toStageId: stageTarget, note: stageNote || undefined }),
      })
      if (res.ok) {
        setStageOpen(false)
        setStageTarget('')
        setStageNote('')
        load()
      }
    } finally {
      setStageSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <Skeleton className="h-8 w-24 mb-4" />
        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!data?.placement) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold mb-1">{isIt ? 'Placement non trovato' : 'Placement not found'}</h2>
        <p className="text-muted-foreground mb-4">{isIt ? 'Il tirocinio non esiste o non hai i permessi per visualizzarlo.' : 'This internship does not exist or you don\'t have permission to view it.'}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/university/placement-pipeline">
            <ArrowLeft className="h-4 w-4 mr-2" /> {isIt ? 'Torna alla pipeline' : 'Back to pipeline'}
          </Link>
        </Button>
      </div>
    )
  }

  const p = data.placement
  const hoursPct = p.plannedHours ? Math.min(100, Math.round((p.completedHours / p.plannedHours) * 100)) : null
  const daysSinceHours = p.lastHoursLoggedAt
    ? Math.max(0, Math.round((Date.now() - new Date(p.lastHoursLoggedAt).getTime()) / 86_400_000))
    : null
  const overdueDeadlines = p.deadlines.filter(d => !d.completedAt && new Date(d.dueAt) < new Date())
  const upcomingDeadlines = p.deadlines.filter(d => !d.completedAt && new Date(d.dueAt) >= new Date())
  const studentName = fullName(p.student, isIt ? 'Studente non assegnato' : 'Student not assigned')
  const currentOrder = p.currentStage?.order || 0

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-4">
      {/* Breadcrumb */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/dashboard/university/placement-pipeline">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Pipeline
        </Link>
      </Button>

      {/* Stage timeline strip — sits above grid for full width */}
      {data.stages.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-1 overflow-x-auto">
              {data.stages.map((s, i) => {
                const isDone = s.order < currentOrder
                const isCurrent = s.id === p.currentStage?.id
                return (
                  <div key={s.id} className="flex items-center gap-1.5 flex-shrink-0">
                    <div
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-primary ring-4 ring-primary/20'
                          : isDone
                            ? 'bg-primary'
                            : 'bg-muted border border-muted-foreground/30'
                      }`}
                    />
                    <span
                      className={`text-xs whitespace-nowrap ${
                        isCurrent
                          ? 'font-semibold text-foreground'
                          : isDone
                            ? 'text-muted-foreground'
                            : 'text-muted-foreground/60'
                      }`}
                    >
                      {s.name}
                    </span>
                    {i < data.stages.length - 1 && (
                      <div className={`h-px w-6 md:w-10 ${isDone ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2-column layout: sticky sidebar + tabbed main */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-5 items-start">
        {/* ── Sidebar ── */}
        <aside className="space-y-4 lg:sticky lg:top-4">
          {/* Identity + actions */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col items-center text-center">
                {p.student ? (
                  <Avatar className="h-16 w-16 mb-3">
                    <AvatarImage src={p.student.photo || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {initials(studentName)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-16 w-16 mb-3 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-7 w-7 text-muted-foreground" />
                  </div>
                )}
                <h1 className="text-lg font-semibold leading-tight">{studentName}</h1>
                {p.student?.degree && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" /> {p.student.degree}
                  </p>
                )}
                {p.student?.email && (
                  <a
                    href={`mailto:${p.student.email}`}
                    className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 hover:text-primary"
                  >
                    <Mail className="h-3 w-3" /> {p.student.email}
                  </a>
                )}
              </div>

              {/* Placement */}
              <div className="space-y-1.5 pt-3 border-t text-sm">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                  <Briefcase className="h-3 w-3" /> {isIt ? 'Ruolo' : 'Role'}
                </div>
                <div className="font-medium">{p.jobTitle}</div>
                <div className="text-xs text-muted-foreground">
                  {OFFER_TYPE_LABEL[p.offerType] || p.offerType}
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t text-sm">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                  <Building2 className="h-3 w-3" /> {isIt ? 'Azienda' : 'Company'}
                </div>
                <div className="font-medium">{p.companyName}</div>
              </div>

              {p.currentStage && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">
                    <Target className="h-3 w-3" /> {isIt ? 'Stage' : 'Stage'}
                  </div>
                  <Badge className="font-medium">{p.currentStage.name}</Badge>
                </div>
              )}

              {/* Actions */}
              {data.canEdit && (
                <div className="pt-3 border-t space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                    title={isIt ? 'Scarica la bozza di convenzione di tirocinio (PDF)' : 'Download the internship convention draft (PDF)'}
                  >
                    <a href={`/api/placements/${p.id}/convention`} target="_blank" rel="noopener">
                      <Download className="h-3.5 w-3.5 mr-2" /> {isIt ? 'Convenzione PDF' : 'Convention PDF'}
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setStageOpen(true)}
                  >
                    <TrendingUp className="h-3.5 w-3.5 mr-2" /> {isIt ? 'Cambia stage' : 'Change stage'}
                  </Button>
                  <Button size="sm" className="w-full justify-start" onClick={() => setHoursOpen(true)}>
                    <Clock className="h-3.5 w-3.5 mr-2" /> {isIt ? 'Log ore' : 'Log hours'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setEvalOpen(true)}
                  >
                    <FileText className="h-3.5 w-3.5 mr-2" /> {isIt ? 'Valutazione' : 'Evaluation'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tutors */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                <Users className="h-3 w-3" /> {isIt ? 'Tutor' : 'Tutor'}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{isIt ? 'Accademico' : 'Academic'}</div>
                <div className="text-sm font-medium">{fullName(p.academicTutor)}</div>
                {p.academicTutor?.email && (
                  <a href={`mailto:${p.academicTutor.email}`} className="text-xs text-muted-foreground hover:text-primary">
                    {p.academicTutor.email}
                  </a>
                )}
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">{isIt ? 'Aziendale' : 'Company'}</div>
                <div className="text-sm font-medium">{fullName(p.companyTutor)}</div>
                {p.companyTutor?.email && (
                  <a href={`mailto:${p.companyTutor.email}`} className="text-xs text-muted-foreground hover:text-primary">
                    {p.companyTutor.email}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Convention */}
          {p.convention && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                  <FileText className="h-3 w-3" /> {isIt ? 'Convenzione' : 'Convention'}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{p.convention.status}</Badge>
                  <span className="text-sm font-medium">{p.convention.companyName}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </aside>

        {/* ── Main area ── */}
        <main>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <span>{isIt ? 'Panoramica' : 'Overview'}</span>
              </TabsTrigger>
              <TabsTrigger value="hours">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                {isIt ? 'Ore' : 'Hours'}
                {p.hoursLogs.length > 0 && (
                  <span className="ml-1.5 text-[10px] font-mono bg-muted rounded px-1">
                    {p.hoursLogs.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="evaluations">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                {isIt ? 'Valutazioni' : 'Evaluations'}
                {p.evaluations.length > 0 && (
                  <span className="ml-1.5 text-[10px] font-mono bg-muted rounded px-1">
                    {p.evaluations.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="deadlines">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                {isIt ? 'Scadenze' : 'Deadlines'}
                {overdueDeadlines.length > 0 && (
                  <span className="ml-1.5 text-[10px] font-mono bg-red-100 text-red-700 rounded px-1">
                    {overdueDeadlines.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Overview tab — 3 key metrics + quick summary */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Hours */}
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                      <Target className="h-3 w-3" /> {isIt ? 'Ore' : 'Hours'}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold">{p.completedHours}</span>
                      {p.plannedHours && (
                        <span className="text-sm text-muted-foreground">/ {p.plannedHours}h</span>
                      )}
                    </div>
                    {hoursPct !== null && <Progress value={hoursPct} className="h-1.5" />}
                    {daysSinceHours !== null && (
                      <p
                        className={`text-xs ${
                          daysSinceHours > 7 ? 'text-red-600 font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {daysSinceHours > 7 && <AlertTriangle className="inline h-3 w-3 mr-1" />}
                        {isIt ? `Ultimo log: ${daysSinceHours === 0 ? 'oggi' : `${daysSinceHours}g fa`}` : `Last log: ${daysSinceHours === 0 ? 'today' : `${daysSinceHours}d ago`}`}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Dates */}
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                      <Calendar className="h-3 w-3" /> {isIt ? 'Date' : 'Dates'}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{fmtDate(p.startDate, locale)}</div>
                      {p.endDate && (
                        <div className="text-xs text-muted-foreground">→ {fmtDate(p.endDate, locale)}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Outcome */}
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                      <CheckCircle2 className="h-3 w-3" /> {isIt ? 'Esito' : 'Outcome'}
                    </div>
                    {p.outcome ? (
                      <Badge className="font-medium">{p.outcome}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Deadline alerts — only shown if any urgent */}
              {overdueDeadlines.length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      {isIt
                        ? `${overdueDeadlines.length} scadenz${overdueDeadlines.length === 1 ? 'a' : 'e'} scaduta${overdueDeadlines.length === 1 ? '' : 'e'}`
                        : `${overdueDeadlines.length} overdue deadline${overdueDeadlines.length === 1 ? '' : 's'}`}
                    </div>
                    <div className="space-y-1">
                      {overdueDeadlines.slice(0, 3).map(d => (
                        <div key={d.id} className="flex items-center gap-2 text-xs">
                          <span className="flex-1">{d.label}</span>
                          <span className="text-red-600 font-medium">{fmtDate(d.dueAt, locale)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {p.outcomeNotes && (
                <Card>
                  <CardContent className="p-4 space-y-1.5">
                    <div className="text-xs uppercase tracking-wide font-medium text-muted-foreground">{isIt ? 'Note esito' : 'Outcome notes'}</div>
                    <p className="text-sm whitespace-pre-wrap">{p.outcomeNotes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Hours tab */}
            <TabsContent value="hours" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {p.hoursLogs.length === 0 ? (
                    <div className="py-12 text-center">
                      <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground mb-1">{isIt ? 'Nessuna registrazione ore' : 'No hours logged'}</p>
                      {data.canEdit && (
                        <p className="text-xs text-muted-foreground">
                          {isIt ? 'Usa il pulsante "Log ore" per registrare la prima settimana.' : 'Use the "Log hours" button to record the first week.'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {p.hoursLogs.map(h => (
                        <div key={h.id} className="flex items-center gap-3 py-2.5 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground tabular-nums">
                            {fmtDate(h.periodStart, locale)} → {fmtDate(h.periodEnd, locale)}
                          </span>
                          <span className="font-semibold tabular-nums">{h.hours}h</span>
                          {h.confirmedByTutor && (
                            <span title={isIt ? 'Confermato dal tutor' : 'Confirmed by tutor'}>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto uppercase tracking-wide">
                            {h.loggedByRole}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evaluations tab */}
            <TabsContent value="evaluations" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {p.evaluations.length === 0 ? (
                    <div className="py-12 text-center">
                      <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground mb-1">{isIt ? 'Nessuna valutazione' : 'No evaluations'}</p>
                      {data.canEdit && (
                        <p className="text-xs text-muted-foreground">
                          {isIt ? 'Invia una valutazione intermedia o finale dal pulsante laterale.' : 'Submit a mid or final evaluation from the sidebar button.'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {p.evaluations.map(e => (
                        <div key={e.id} className="p-3.5 rounded-lg border bg-muted/20">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className="text-[10px]">{e.kind}</Badge>
                            <span className="text-sm font-medium">{fullName(e.submittedBy)}</span>
                            <span className="text-xs text-muted-foreground">({e.submitterRole})</span>
                            <span className="text-xs text-muted-foreground ml-auto">{fmtDate(e.submittedAt, locale)}</span>
                          </div>
                          {e.comments && (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {e.comments}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deadlines tab */}
            <TabsContent value="deadlines" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {p.deadlines.length === 0 ? (
                    <div className="py-12 text-center">
                      <Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">{isIt ? 'Nessuna scadenza' : 'No deadlines'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {overdueDeadlines.length > 0 && (
                        <div>
                          <div className="text-xs uppercase tracking-wide font-semibold text-red-600 mb-2">
                            {isIt ? 'Scadute' : 'Overdue'} ({overdueDeadlines.length})
                          </div>
                          <div className="space-y-1.5">
                            {overdueDeadlines.map(d => (
                              <div
                                key={d.id}
                                className="flex items-center gap-2 p-2.5 rounded border border-red-200 bg-red-50 text-sm"
                              >
                                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                                <span className="flex-1">{d.label}</span>
                                <span className="text-red-600 font-medium text-xs">{fmtDate(d.dueAt, locale)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {upcomingDeadlines.length > 0 && (
                        <div>
                          <div className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                            {isIt ? 'Prossime' : 'Upcoming'} ({upcomingDeadlines.length})
                          </div>
                          <div className="space-y-1.5">
                            {upcomingDeadlines.map(d => (
                              <div
                                key={d.id}
                                className="flex items-center gap-2 p-2.5 rounded border bg-muted/30 text-sm"
                              >
                                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="flex-1">{d.label}</span>
                                <span className="text-xs text-muted-foreground">{fmtDate(d.dueAt, locale)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Dialogs */}
      <Dialog open={stageOpen} onOpenChange={setStageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isIt ? 'Cambia stage' : 'Change stage'}</DialogTitle>
            <DialogDescription>{isIt ? 'Sposta il tirocinio a una nuova fase.' : 'Move the internship to a new phase.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{isIt ? 'Nuovo stage' : 'New stage'}</Label>
              <Select value={stageTarget} onValueChange={setStageTarget}>
                <SelectTrigger><SelectValue placeholder={isIt ? 'Seleziona…' : 'Select…'} /></SelectTrigger>
                <SelectContent>
                  {data.stages.filter(s => s.id !== p.currentStage?.id).map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isIt ? 'Nota (opzionale)' : 'Note (optional)'}</Label>
              <Textarea value={stageNote} onChange={e => setStageNote(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStageOpen(false)} disabled={stageSaving}>{isIt ? 'Annulla' : 'Cancel'}</Button>
            <Button onClick={changeStage} disabled={stageSaving || !stageTarget}>
              {stageSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isIt ? 'Conferma' : 'Confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={hoursOpen} onOpenChange={setHoursOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isIt ? 'Registra ore settimanali' : 'Log weekly hours'}</DialogTitle>
            <DialogDescription>{isIt ? 'Le ore inserite dai tutor sono auto-confermate.' : 'Hours entered by tutors are auto-confirmed.'}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{isIt ? 'Dal' : 'From'}</Label>
              <Input type="date" value={hoursForm.periodStart} onChange={e => setHoursForm(f => ({ ...f, periodStart: e.target.value }))} />
            </div>
            <div>
              <Label>{isIt ? 'Al' : 'To'}</Label>
              <Input type="date" value={hoursForm.periodEnd} onChange={e => setHoursForm(f => ({ ...f, periodEnd: e.target.value }))} />
            </div>
            <div>
              <Label>{isIt ? 'Ore totali' : 'Total hours'}</Label>
              <Input type="number" min={0} max={168} value={hoursForm.hours} onChange={e => setHoursForm(f => ({ ...f, hours: e.target.value }))} placeholder="40" />
            </div>
            <div className="col-span-2">
              <Label>{isIt ? 'Note (opzionale)' : 'Notes (optional)'}</Label>
              <Textarea rows={2} value={hoursForm.notes} onChange={e => setHoursForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHoursOpen(false)} disabled={hoursSaving}>{isIt ? 'Annulla' : 'Cancel'}</Button>
            <Button onClick={logHours} disabled={hoursSaving || !hoursForm.periodStart || !hoursForm.periodEnd || !hoursForm.hours}>
              {hoursSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isIt ? 'Registra' : 'Log')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={evalOpen} onOpenChange={setEvalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isIt ? 'Invia valutazione' : 'Submit evaluation'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{isIt ? 'Tipo' : 'Type'}</Label>
              <Select value={evalForm.kind} onValueChange={v => setEvalForm(f => ({ ...f, kind: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MID">{isIt ? 'Intermedia' : 'Mid'}</SelectItem>
                  <SelectItem value="FINAL">{isIt ? 'Finale' : 'Final'}</SelectItem>
                  {data.viewerRole !== 'STUDENT' && <SelectItem value="INCIDENT">{isIt ? 'Incident' : 'Incident'}</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isIt ? 'Commenti' : 'Comments'}</Label>
              <Textarea rows={4} value={evalForm.comments} onChange={e => setEvalForm(f => ({ ...f, comments: e.target.value }))} placeholder={isIt ? 'Punti di forza, aree di miglioramento, raccomandazioni…' : 'Strengths, areas for improvement, recommendations…'} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvalOpen(false)} disabled={evalSaving}>{isIt ? 'Annulla' : 'Cancel'}</Button>
            <Button onClick={submitEvaluation} disabled={evalSaving}>
              {evalSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isIt ? 'Invia' : 'Submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
