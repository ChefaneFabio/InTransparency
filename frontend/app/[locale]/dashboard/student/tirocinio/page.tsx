'use client'

import { useEffect, useState, useCallback } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Clock, Target, Calendar, Users, Briefcase, Building2, GraduationCap,
  CheckCircle2, AlertTriangle, FileText, MessageCircle, TrendingUp, Loader2,
  Zap,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Stage { id: string; name: string; order: number; type: string }
interface Placement {
  id: string
  companyName: string
  jobTitle: string
  offerType: string
  startDate: string
  endDate: string | null
  plannedHours: number | null
  completedHours: number
  hoursPct: number | null
  daysSinceHoursLogged: number | null
  stage: Stage | null
  academicTutor: null | { id: string; name: string }
  companyTutor: null | { id: string; name: string }
  counts: { evaluations: number; hoursLogs: number; deadlines: number }
  status: string
  outcome: string | null
}

/**
 * Student's own tirocinio dashboard. Lists all placements scoped to this
 * student (usually 1 active + history), with one-click hours logging for
 * the active one.
 */
export default function StudentPlacementPage() {
  const [placements, setPlacements] = useState<Placement[]>([])
  const [loading, setLoading] = useState(true)
  const [quickHoursOpen, setQuickHoursOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [form, setForm] = useState({ periodStart: '', periodEnd: '', hours: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/placements')
      if (res.ok) {
        const data = await res.json()
        setPlacements(data.placements || [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const active = placements.find(p =>
    ['MATCHED', 'CONVENTION_SIGNED', 'IN_PROGRESS', 'MID_EVALUATION'].includes(p.stage?.type || '')
  ) || placements[0]

  const history = placements.filter(p => p.id !== active?.id)

  const openQuickHours = (pid: string) => {
    setActiveId(pid)
    // Default to "this past week"
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1 - 7) // last week monday
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    setForm({
      periodStart: monday.toISOString().slice(0, 10),
      periodEnd: sunday.toISOString().slice(0, 10),
      hours: '40',
      notes: '',
    })
    setQuickHoursOpen(true)
  }

  const submitHours = async () => {
    if (!activeId || !form.periodStart || !form.periodEnd || !form.hours) return
    setSaving(true)
    try {
      const res = await fetch(`/api/placements/${activeId}/hours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodStart: form.periodStart,
          periodEnd: form.periodEnd,
          hours: Number(form.hours),
          notes: form.notes || undefined,
          source: 'manual',
        }),
      })
      if (res.ok) {
        setQuickHoursOpen(false)
        fetchData()
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 px-4 py-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (placements.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        <MetricHero gradient="primary">
          <div>
            <h1 className="text-2xl font-bold">Il mio tirocinio</h1>
            <p className="text-muted-foreground mt-1">Traccia il tuo stage, le ore, le valutazioni.</p>
          </div>
        </MetricHero>
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Nessun tirocinio attivo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Quando candidarti a un'offerta e l'istituzione approverà il matching,
              il tirocinio apparirà qui con tutte le informazioni per registrare le ore.
            </p>
            <Button asChild><Link href="/dashboard/student/jobs">Cerca opportunità</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 pb-12">
      <MetricHero gradient="primary">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Il mio tirocinio</h1>
          <p className="text-muted-foreground mt-1">
            Registra le ore settimanali in 10 secondi. Invia la tua valutazione a fine stage.
          </p>
        </div>
      </MetricHero>

      {active && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg">{active.companyName}</CardTitle>
                  {active.stage && <Badge>{active.stage.name}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> {active.jobTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(active.startDate).toLocaleDateString('it-IT')}
                  {active.endDate && ` — ${new Date(active.endDate).toLocaleDateString('it-IT')}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => openQuickHours(active.id)}>
                  <Zap className="h-4 w-4 mr-1.5" /> Log ore
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/university/placement-pipeline/${active.id}`}>
                    Dettaglio
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Hours progress — big and visible */}
            {active.plannedHours && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Ore completate</div>
                    <div className="text-3xl font-bold">
                      {active.completedHours}
                      <span className="text-lg text-muted-foreground">/{active.plannedHours}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Progresso</div>
                    <div className="text-2xl font-bold text-primary">{active.hoursPct || 0}%</div>
                  </div>
                </div>
                <Progress value={active.hoursPct || 0} className="h-2" />
                {active.daysSinceHoursLogged !== null && active.daysSinceHoursLogged > 7 && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Ultimo log {active.daysSinceHoursLogged} giorni fa — registra le ore ora per non perdere la scadenza ministeriale.
                  </div>
                )}
              </div>
            )}

            {/* Tutors */}
            <div className="grid sm:grid-cols-2 gap-3">
              {active.academicTutor && (
                <GlassCard hover={false}>
                  <div className="p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" /> Tutor accademico
                    </div>
                    <div className="font-medium text-sm mt-0.5">{active.academicTutor.name}</div>
                  </div>
                </GlassCard>
              )}
              {active.companyTutor && (
                <GlassCard hover={false}>
                  <div className="p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> Tutor aziendale
                    </div>
                    <div className="font-medium text-sm mt-0.5">{active.companyTutor.name}</div>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Secondary counts */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-2 border-t">
              <span className="inline-flex items-center gap-1">
                <FileText className="h-3 w-3" /> {active.counts.evaluations} valutazioni
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {active.counts.hoursLogs} log ore
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {active.counts.deadlines} scadenze
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm mb-2">Storico tirocini</h2>
          <div className="space-y-2">
            {history.map(p => (
              <Link
                key={p.id}
                href={`/dashboard/university/placement-pipeline/${p.id}`}
                className="block"
              >
                <div className="rounded-lg border bg-card p-3 hover:shadow-sm hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{p.companyName}</span>
                        <Badge variant="outline" className="text-[10px]">{p.stage?.name || p.status}</Badge>
                        {p.outcome && <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-0">{p.outcome}</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{p.jobTitle} · {new Date(p.startDate).toLocaleDateString('it-IT')}</div>
                    </div>
                    {p.plannedHours && p.hoursPct !== null && (
                      <div className="text-xs text-muted-foreground">{p.hoursPct}%</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick hours dialog */}
      <Dialog open={quickHoursOpen} onOpenChange={setQuickHoursOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registra ore settimanali</DialogTitle>
            <DialogDescription>
              Conferma o modifica il periodo e le ore. Il tutor aziendale confermerà al fine mese.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Dal</Label>
              <Input type="date" value={form.periodStart} onChange={e => setForm(f => ({ ...f, periodStart: e.target.value }))} />
            </div>
            <div>
              <Label>Al</Label>
              <Input type="date" value={form.periodEnd} onChange={e => setForm(f => ({ ...f, periodEnd: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <Label>Ore totali del periodo</Label>
              <Input type="number" min={0} max={168} value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} />
              <p className="text-[11px] text-muted-foreground mt-1">
                Settimana tipo: 5 giorni × 8h = 40h
              </p>
            </div>
            <div className="col-span-2">
              <Label>Attività svolte (opzionale)</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Es. Analisi dati vendite, riunione di team, preparazione campagna social…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickHoursOpen(false)} disabled={saving}>Annulla</Button>
            <Button onClick={submitHours} disabled={saving || !form.periodStart || !form.periodEnd || !form.hours}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Registra {form.hours}h</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
