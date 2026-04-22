'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft, Building2, Briefcase, GraduationCap, Clock, Target, Calendar,
  Users, CheckCircle2, AlertTriangle, Plus, MessageCircle, TrendingUp,
  FileText, Loader2, Download,
} from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

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

function name(u: { firstName: string | null; lastName: string | null } | null, fallback = 'N/A'): string {
  if (!u) return fallback
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || fallback
}

function initials(s: string): string {
  return s.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()
}

export default function PlacementDetailPage() {
  const params = useParams()
  const placementId = params?.id as string

  const [data, setData] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)

  // Forms
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
        body: JSON.stringify({
          kind: evalForm.kind,
          comments: evalForm.comments || undefined,
        }),
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
      <div className="space-y-4 p-4 max-w-5xl mx-auto">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!data?.placement) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center">
        <p className="text-muted-foreground">Placement non trovato o non autorizzato.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/university/placement-pipeline"><ArrowLeft className="h-4 w-4 mr-2" /> Torna alla pipeline</Link>
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

  const studentName = name(p.student, 'Studente non assegnato')

  // Pipeline timeline — find position of current stage in the configured stages
  const currentOrder = p.currentStage?.order || 0
  const totalStages = data.stages.length

  return (
    <div className="space-y-5 pb-12 max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/university/placement-pipeline">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Pipeline
        </Link>
      </Button>

      <MetricHero gradient="primary">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-start gap-4 flex-1">
            {p.student ? (
              <Avatar className="h-14 w-14">
                <AvatarImage src={p.student.photo || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {initials(studentName)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold">{studentName}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {p.jobTitle}</span>
                <span>—</span>
                <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {p.companyName}</span>
              </div>
              {p.student?.degree && (
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" /> {p.student.degree}
                </div>
              )}
              {p.currentStage && (
                <Badge className="mt-2">{p.currentStage.name}</Badge>
              )}
            </div>
          </div>
          {data.canEdit && (
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                asChild
                title="Scarica la bozza di convenzione di tirocinio (PDF)"
              >
                <a href={`/api/placements/${p.id}/convention`} target="_blank" rel="noopener">
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Convenzione PDF
                </a>
              </Button>
              <Dialog open={stageOpen} onOpenChange={setStageOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> Cambia stage
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sposta a un altro stage</DialogTitle>
                    <DialogDescription>Il cambio sarà tracciato nell'audit trail.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Nuovo stage</Label>
                      <Select value={stageTarget} onValueChange={setStageTarget}>
                        <SelectTrigger><SelectValue placeholder="Seleziona…" /></SelectTrigger>
                        <SelectContent>
                          {data.stages.filter(s => s.id !== p.currentStage?.id).map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nota (opzionale)</Label>
                      <Textarea value={stageNote} onChange={e => setStageNote(e.target.value)} rows={2} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStageOpen(false)} disabled={stageSaving}>Annulla</Button>
                    <Button onClick={changeStage} disabled={stageSaving || !stageTarget}>
                      {stageSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Conferma'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={hoursOpen} onOpenChange={setHoursOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Clock className="h-3.5 w-3.5 mr-1.5" /> Log ore
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registra ore settimanali</DialogTitle>
                    <DialogDescription>Le ore inserite dai tutor sono auto-confermate.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Dal</Label>
                      <Input type="date" value={hoursForm.periodStart} onChange={e => setHoursForm(f => ({ ...f, periodStart: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Al</Label>
                      <Input type="date" value={hoursForm.periodEnd} onChange={e => setHoursForm(f => ({ ...f, periodEnd: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Ore totali</Label>
                      <Input type="number" min={0} max={168} value={hoursForm.hours} onChange={e => setHoursForm(f => ({ ...f, hours: e.target.value }))} placeholder="40" />
                    </div>
                    <div className="col-span-2">
                      <Label>Note (opzionale)</Label>
                      <Textarea rows={2} value={hoursForm.notes} onChange={e => setHoursForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setHoursOpen(false)} disabled={hoursSaving}>Annulla</Button>
                    <Button onClick={logHours} disabled={hoursSaving || !hoursForm.periodStart || !hoursForm.periodEnd || !hoursForm.hours}>
                      {hoursSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Registra'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={evalOpen} onOpenChange={setEvalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <FileText className="h-3.5 w-3.5 mr-1.5" /> Valutazione
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit valutazione</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Tipo</Label>
                      <Select value={evalForm.kind} onValueChange={v => setEvalForm(f => ({ ...f, kind: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MID">Intermedia</SelectItem>
                          <SelectItem value="FINAL">Finale</SelectItem>
                          {data.viewerRole !== 'STUDENT' && <SelectItem value="INCIDENT">Incident</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Commenti</Label>
                      <Textarea rows={4} value={evalForm.comments} onChange={e => setEvalForm(f => ({ ...f, comments: e.target.value }))} placeholder="Punti di forza, aree di miglioramento, raccomandazioni…" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEvalOpen(false)} disabled={evalSaving}>Annulla</Button>
                    <Button onClick={submitEvaluation} disabled={evalSaving}>
                      {evalSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Invia'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </MetricHero>

      {/* Stage timeline strip */}
      {data.stages.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {data.stages.map((s, i) => {
                const isDone = s.order < currentOrder
                const isCurrent = s.id === p.currentStage?.id
                return (
                  <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`h-2 w-2 rounded-full ${isCurrent ? 'bg-primary ring-2 ring-primary/30' : isDone ? 'bg-primary' : 'bg-muted'}`} />
                    <span className={`text-[11px] whitespace-nowrap ${isCurrent ? 'font-semibold text-foreground' : isDone ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                      {s.name}
                    </span>
                    {i < data.stages.length - 1 && <div className={`h-px w-6 ${isDone ? 'bg-primary' : 'bg-muted'}`} />}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* Hours card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Target className="h-4 w-4" /> Ore
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{p.completedHours}</span>
              {p.plannedHours && <span className="text-sm text-muted-foreground">/ {p.plannedHours}h</span>}
            </div>
            {hoursPct !== null && <Progress value={hoursPct} className="h-2" />}
            {daysSinceHours !== null && (
              <p className={`text-xs ${daysSinceHours > 7 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {daysSinceHours > 7 && <AlertTriangle className="inline h-3 w-3 mr-1" />}
                Ultimo log: {daysSinceHours}g fa
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tutors */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Tutor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Accademico:</span>{' '}
              <span className="font-medium">{name(p.academicTutor, '—')}</span>
              {p.academicTutor?.email && <div className="text-muted-foreground">{p.academicTutor.email}</div>}
            </div>
            <div>
              <span className="text-muted-foreground">Aziendale:</span>{' '}
              <span className="font-medium">{name(p.companyTutor, '—')}</span>
              {p.companyTutor?.email && <div className="text-muted-foreground">{p.companyTutor.email}</div>}
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Date
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            <div>Inizio: <span className="font-medium">{new Date(p.startDate).toLocaleDateString('it-IT')}</span></div>
            {p.endDate && (
              <div>Fine: <span className="font-medium">{new Date(p.endDate).toLocaleDateString('it-IT')}</span></div>
            )}
            {p.convention && (
              <div className="pt-1 border-t">
                Convenzione: <Badge variant="outline" className="text-[10px]">{p.convention.status}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Deadlines */}
      {(overdueDeadlines.length > 0 || upcomingDeadlines.length > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Scadenze
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {overdueDeadlines.map(d => (
              <div key={d.id} className="flex items-center gap-2 p-2 rounded border border-red-200 bg-red-50 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                <span className="flex-1">{d.label}</span>
                <span className="text-red-600 font-medium">Scaduta il {new Date(d.dueAt).toLocaleDateString('it-IT')}</span>
              </div>
            ))}
            {upcomingDeadlines.slice(0, 5).map(d => (
              <div key={d.id} className="flex items-center gap-2 p-2 rounded border bg-muted/30 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="flex-1">{d.label}</span>
                <span className="text-muted-foreground">{new Date(d.dueAt).toLocaleDateString('it-IT')}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Evaluations */}
      {p.evaluations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <FileText className="h-4 w-4" /> Valutazioni ({p.evaluations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {p.evaluations.map(e => (
              <div key={e.id} className="p-3 rounded border bg-muted/20 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">{e.kind}</Badge>
                  <span className="font-medium">{name(e.submittedBy)}</span>
                  <span className="text-muted-foreground">({e.submitterRole})</span>
                  <span className="text-muted-foreground ml-auto">
                    {new Date(e.submittedAt).toLocaleDateString('it-IT')}
                  </span>
                </div>
                {e.comments && <p className="text-muted-foreground whitespace-pre-wrap">{e.comments}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hours log history */}
      {p.hoursLogs.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Registrazioni ore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {p.hoursLogs.slice(0, 10).map(h => (
                <div key={h.id} className="flex items-center gap-3 text-xs py-1.5 px-2 rounded hover:bg-muted/30">
                  <span className="text-muted-foreground tabular-nums">
                    {new Date(h.periodStart).toLocaleDateString('it-IT')} → {new Date(h.periodEnd).toLocaleDateString('it-IT')}
                  </span>
                  <span className="font-semibold tabular-nums">{h.hours}h</span>
                  {h.confirmedByTutor && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                  <span className="text-muted-foreground ml-auto">{h.loggedByRole}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
