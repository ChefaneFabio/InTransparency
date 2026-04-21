'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Building2, Users, Briefcase, Eye, CheckCircle2, Clock,
  AlertTriangle, TrendingUp, Search, Euro, Plus, MoreVertical,
  Pencil, Trash2, GripVertical,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

type Stage = 'LEAD' | 'CONVENZIONE' | 'MATCHING' | 'ATTIVO' | 'COMPLETATO' | 'ASSUNTO' | 'LOST'

interface PipelineCard {
  id: string
  stage: Stage
  company: string
  role: string | null
  industry: string | null
  contactName: string | null
  contactEmail: string | null
  tutorName: string | null
  tutorEmail: string | null
  notes: string | null
  startDate: string | null
  endDate: string | null
  student: null | { id: string; name: string; degree: string | null; photo: string | null }
  daysInStage: number
  salary: number | null
  salaryCurrency: string | null
  updatedAt: string
}

interface StageGroup {
  stage: Stage
  count: number
  cards: PipelineCard[]
}

interface Pipeline {
  stages: StageGroup[]
  summary: { total: number; conversionRate: number; activeStages: number; atRisk: number }
}

const STAGE_META: Record<Stage, { label: string; description: string; icon: typeof Eye; accent: string; dot: string }> = {
  LEAD: {
    label: 'Lead',
    description: 'Interesse azienda, nessuna convenzione',
    icon: Eye,
    accent: 'bg-slate-50 dark:bg-slate-900/30',
    dot: 'bg-slate-400',
  },
  CONVENZIONE: {
    label: 'Convenzione',
    description: 'Convenzione in preparazione',
    icon: Briefcase,
    accent: 'bg-blue-50 dark:bg-blue-950/30',
    dot: 'bg-blue-500',
  },
  MATCHING: {
    label: 'Matching',
    description: 'Studente assegnato, stage non iniziato',
    icon: Users,
    accent: 'bg-amber-50 dark:bg-amber-950/30',
    dot: 'bg-amber-500',
  },
  ATTIVO: {
    label: 'Stage attivo',
    description: 'Stage in corso',
    icon: Clock,
    accent: 'bg-purple-50 dark:bg-purple-950/30',
    dot: 'bg-purple-500',
  },
  COMPLETATO: {
    label: 'Completato',
    description: 'Stage concluso',
    icon: CheckCircle2,
    accent: 'bg-teal-50 dark:bg-teal-950/30',
    dot: 'bg-teal-500',
  },
  ASSUNTO: {
    label: 'Assunto',
    description: 'Convertito in assunzione',
    icon: TrendingUp,
    accent: 'bg-emerald-50 dark:bg-emerald-950/30',
    dot: 'bg-emerald-500',
  },
  LOST: {
    label: 'Perso',
    description: 'Opportunità chiusa',
    icon: AlertTriangle,
    accent: 'bg-red-50 dark:bg-red-950/30',
    dot: 'bg-red-400',
  },
}

const STAGE_ORDER: Stage[] = ['LEAD', 'CONVENZIONE', 'MATCHING', 'ATTIVO', 'COMPLETATO', 'ASSUNTO']

function daysLabel(d: number): string {
  if (d === 0) return 'oggi'
  if (d === 1) return '1 giorno'
  if (d < 30) return `${d} giorni`
  const months = Math.floor(d / 30)
  return months === 1 ? '1 mese' : `${months} mesi`
}

interface CardViewProps {
  card: PipelineCard
  onDragStart: (e: React.DragEvent, id: string) => void
  onEdit: (card: PipelineCard) => void
  onDelete: (card: PipelineCard) => void
}

function PipelineCardView({ card, onDragStart, onEdit, onDelete }: CardViewProps) {
  const atRisk = card.stage === 'ATTIVO' && card.daysInStage > 150
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, card.id)}
      className={`group rounded-md border bg-card p-3 text-xs shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${atRisk ? 'border-red-300 ring-1 ring-red-200' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <GripVertical className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0" />
            <Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <Link
              href={`/dashboard/university/employer-crm/${encodeURIComponent(card.company)}`}
              className="font-semibold text-foreground truncate hover:text-primary"
              onClick={e => e.stopPropagation()}
            >
              {card.company}
            </Link>
          </div>
          {card.role && (
            <div className="text-muted-foreground mt-0.5 truncate pl-5">{card.role}</div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {atRisk && <AlertTriangle className="h-4 w-4 text-red-500" aria-label="A rischio" />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={e => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem onClick={() => onEdit(card)}>
                <Pencil className="h-3.5 w-3.5 mr-2" /> Modifica
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(card)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {card.student ? (
        <Link
          href={`/dashboard/recruiter/candidates/${card.student.id}`}
          className="flex items-center gap-2 py-1.5 rounded hover:bg-muted/40 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={card.student.photo || undefined} />
            <AvatarFallback className="text-[9px]">
              {card.student.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{card.student.name}</div>
            {card.student.degree && (
              <div className="text-[10px] text-muted-foreground truncate">{card.student.degree}</div>
            )}
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-1.5 text-muted-foreground italic py-1.5">
          <Users className="h-3.5 w-3.5" /> Studente non assegnato
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />{daysLabel(card.daysInStage)}
        </span>
        {card.salary && (
          <span className="inline-flex items-center gap-0.5 font-medium text-foreground">
            <Euro className="h-3 w-3" />{(card.salary / 1000).toFixed(0)}k
          </span>
        )}
      </div>
    </div>
  )
}

interface DealFormValues {
  companyName: string
  role: string
  stage: Stage
  contactName: string
  contactEmail: string
  tutorName: string
  tutorEmail: string
  industry: string
  notes: string
  salaryAmount: string
}

const EMPTY_FORM: DealFormValues = {
  companyName: '', role: '', stage: 'LEAD',
  contactName: '', contactEmail: '', tutorName: '', tutorEmail: '',
  industry: '', notes: '', salaryAmount: '',
}

interface DealFormProps {
  values: DealFormValues
  onChange: (patch: Partial<DealFormValues>) => void
  onSubmit: () => void
  onCancel: () => void
  saving: boolean
  editing: boolean
}

function DealForm({ values, onChange, onSubmit, onCancel, saving, editing }: DealFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label htmlFor="company">Azienda *</Label>
          <Input
            id="company"
            value={values.companyName}
            onChange={e => onChange({ companyName: e.target.value })}
            placeholder="es. AC Monza"
          />
        </div>
        <div>
          <Label htmlFor="role">Ruolo</Label>
          <Input
            id="role"
            value={values.role}
            onChange={e => onChange({ role: e.target.value })}
            placeholder="Digital Marketing Intern"
          />
        </div>
        <div>
          <Label htmlFor="stage">Stage</Label>
          <select
            id="stage"
            value={values.stage}
            onChange={e => onChange({ stage: e.target.value as Stage })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {STAGE_ORDER.map(s => (
              <option key={s} value={s}>{STAGE_META[s].label}</option>
            ))}
            <option value="LOST">{STAGE_META.LOST.label}</option>
          </select>
        </div>
        <div>
          <Label htmlFor="contactName">Contatto azienda</Label>
          <Input
            id="contactName"
            value={values.contactName}
            onChange={e => onChange({ contactName: e.target.value })}
            placeholder="Nome Cognome"
          />
        </div>
        <div>
          <Label htmlFor="contactEmail">Email contatto</Label>
          <Input
            id="contactEmail"
            type="email"
            value={values.contactEmail}
            onChange={e => onChange({ contactEmail: e.target.value })}
            placeholder="hr@company.it"
          />
        </div>
        <div>
          <Label htmlFor="tutorName">Tutor accademico</Label>
          <Input
            id="tutorName"
            value={values.tutorName}
            onChange={e => onChange({ tutorName: e.target.value })}
            placeholder="Prof. ..."
          />
        </div>
        <div>
          <Label htmlFor="tutorEmail">Email tutor</Label>
          <Input
            id="tutorEmail"
            type="email"
            value={values.tutorEmail}
            onChange={e => onChange({ tutorEmail: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="industry">Settore</Label>
          <Input
            id="industry"
            value={values.industry}
            onChange={e => onChange({ industry: e.target.value })}
            placeholder="Sport / Marketing / Digital"
          />
        </div>
        <div>
          <Label htmlFor="salary">Compenso (€)</Label>
          <Input
            id="salary"
            type="number"
            value={values.salaryAmount}
            onChange={e => onChange({ salaryAmount: e.target.value })}
            placeholder="800"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="notes">Note</Label>
          <Textarea
            id="notes"
            value={values.notes}
            onChange={e => onChange({ notes: e.target.value })}
            placeholder="Referenze, esito colloqui, dettagli convenzione…"
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={saving}>Annulla</Button>
        <Button onClick={onSubmit} disabled={saving || !values.companyName.trim()}>
          {saving ? 'Salvataggio…' : editing ? 'Salva modifiche' : 'Crea opportunità'}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default function InternshipPipelinePage() {
  const [data, setData] = useState<Pipeline | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null)
  const draggedIdRef = useRef<string | null>(null)

  // Add / edit modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<PipelineCard | null>(null)
  const [formValues, setFormValues] = useState<DealFormValues>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/university/internship-pipeline/kanban')
      if (res.ok) setData(await res.json())
    } catch { /* silent */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredStage = (stage: StageGroup): StageGroup => {
    if (!filter.trim()) return stage
    const q = filter.toLowerCase()
    return {
      ...stage,
      cards: stage.cards.filter(c =>
        c.company.toLowerCase().includes(q) ||
        (c.role?.toLowerCase().includes(q) ?? false) ||
        (c.student?.name.toLowerCase().includes(q) ?? false)
      ),
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    draggedIdRef.current = id
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverStage !== stage) setDragOverStage(stage)
  }

  const handleDragLeave = () => setDragOverStage(null)

  const handleDrop = async (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault()
    setDragOverStage(null)
    const id = draggedIdRef.current || e.dataTransfer.getData('text/plain')
    draggedIdRef.current = null
    if (!id || !data) return

    // Find the card
    let foundCard: PipelineCard | null = null
    let sourceStage: Stage | null = null
    for (const s of data.stages) {
      const c = s.cards.find(x => x.id === id)
      if (c) { foundCard = c; sourceStage = s.stage; break }
    }
    if (!foundCard || sourceStage === targetStage) return

    // Optimistic UI update
    const prev = data
    const nextStages = data.stages.map(s => {
      if (s.stage === sourceStage) {
        return { ...s, count: s.count - 1, cards: s.cards.filter(c => c.id !== id) }
      }
      if (s.stage === targetStage && foundCard) {
        return {
          ...s,
          count: s.count + 1,
          cards: [{ ...foundCard, stage: targetStage, daysInStage: 0 }, ...s.cards],
        }
      }
      return s
    })
    const assuntoCount = nextStages.find(s => s.stage === 'ASSUNTO')?.count || 0
    const attivoStage = nextStages.find(s => s.stage === 'ATTIVO')
    const total = nextStages.reduce((sum, s) => sum + s.count, 0)
    setData({
      stages: nextStages,
      summary: {
        total,
        conversionRate: total > 0 ? Math.round((assuntoCount / total) * 100) : 0,
        activeStages: attivoStage?.count || 0,
        atRisk: attivoStage?.cards.filter(c => c.daysInStage > 150).length || 0,
      },
    })

    try {
      const res = await fetch(`/api/dashboard/university/internship-pipeline/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: targetStage }),
      })
      if (!res.ok) throw new Error('Update failed')
    } catch {
      // Roll back
      setData(prev)
    }
  }

  const openCreate = () => {
    setEditingCard(null)
    setFormValues(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (card: PipelineCard) => {
    setEditingCard(card)
    setFormValues({
      companyName: card.company,
      role: card.role || '',
      stage: card.stage,
      contactName: card.contactName || '',
      contactEmail: card.contactEmail || '',
      tutorName: card.tutorName || '',
      tutorEmail: card.tutorEmail || '',
      industry: card.industry || '',
      notes: card.notes || '',
      salaryAmount: card.salary ? String(card.salary) : '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (card: PipelineCard) => {
    if (!confirm(`Eliminare "${card.company}" dalla pipeline?`)) return
    try {
      const res = await fetch(`/api/dashboard/university/internship-pipeline/deals/${card.id}`, {
        method: 'DELETE',
      })
      if (res.ok) fetchData()
    } catch { /* silent */ }
  }

  const handleSubmit = async () => {
    if (!formValues.companyName.trim()) return
    setSaving(true)
    const payload: any = {
      companyName: formValues.companyName.trim(),
      role: formValues.role.trim() || null,
      stage: formValues.stage,
      contactName: formValues.contactName.trim() || null,
      contactEmail: formValues.contactEmail.trim() || null,
      tutorName: formValues.tutorName.trim() || null,
      tutorEmail: formValues.tutorEmail.trim() || null,
      industry: formValues.industry.trim() || null,
      notes: formValues.notes.trim() || null,
      salaryAmount: formValues.salaryAmount ? Number(formValues.salaryAmount) : null,
    }
    try {
      const url = editingCard
        ? `/api/dashboard/university/internship-pipeline/deals/${editingCard.id}`
        : `/api/dashboard/university/internship-pipeline/deals`
      const method = editingCard ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setModalOpen(false)
        fetchData()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <MetricHero gradient="primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pipeline Tirocini</h1>
            <p className="text-muted-foreground mt-1">
              Dal primo contatto all'assunzione — trascina le card tra le colonne per aggiornare lo stato.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {data && (
              <>
                <GlassCard hover={false}>
                  <div className="px-4 py-2.5 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground leading-none">Opportunità</div>
                      <div className="text-lg font-bold">{data.summary.total}</div>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="px-4 py-2.5 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <div>
                      <div className="text-xs text-muted-foreground leading-none">Conversione</div>
                      <div className="text-lg font-bold">{data.summary.conversionRate}%</div>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="px-4 py-2.5 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-xs text-muted-foreground leading-none">Stage attivi</div>
                      <div className="text-lg font-bold">{data.summary.activeStages}</div>
                    </div>
                  </div>
                </GlassCard>
                {data.summary.atRisk > 0 && (
                  <GlassCard hover={false}>
                    <div className="px-4 py-2.5 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-xs text-muted-foreground leading-none">A rischio</div>
                        <div className="text-lg font-bold text-red-600">{data.summary.atRisk}</div>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </>
            )}
          </div>
        </div>
      </MetricHero>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtra per azienda, ruolo o studente…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1.5" /> Nuova opportunità
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCard ? 'Modifica opportunità' : 'Nuova opportunità'}
              </DialogTitle>
              <DialogDescription>
                {editingCard
                  ? 'Aggiorna i dettagli del tirocinio — i cambi di stage sono tracciati.'
                  : 'Traccia un nuovo contatto azienda o convenzione. Puoi aggiungere lo studente in seguito.'}
              </DialogDescription>
            </DialogHeader>
            <DealForm
              values={formValues}
              onChange={patch => setFormValues(v => ({ ...v, ...patch }))}
              onSubmit={handleSubmit}
              onCancel={() => setModalOpen(false)}
              saving={saving}
              editing={!!editingCard}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGE_ORDER.map(s => (
            <div key={s} className="flex-shrink-0 w-72 space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              {[0, 1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-md" />)}
            </div>
          ))}
        </div>
      ) : !data || data.summary.total === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Nessuna opportunità in pipeline</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crea la prima opportunità o attendi che un'azienda visualizzi un profilo studente.
            </p>
            <Button onClick={openCreate} variant="outline">
              <Plus className="h-4 w-4 mr-1.5" /> Nuova opportunità
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {data.stages.map(stage => {
            const meta = STAGE_META[stage.stage]
            const Icon = meta.icon
            const filtered = filteredStage(stage)
            const isTarget = dragOverStage === stage.stage
            return (
              <div
                key={stage.stage}
                className="flex-shrink-0 w-72"
                onDragOver={e => handleDragOver(e, stage.stage)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, stage.stage)}
              >
                <div className={`rounded-t-md px-3 py-2.5 ${meta.accent} border border-b-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${meta.dot}`} />
                      <span className="font-semibold text-sm">{meta.label}</span>
                      <Badge variant="outline" className="text-[10px] h-5">{stage.count}</Badge>
                    </div>
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{meta.description}</p>
                </div>

                <div
                  className={`rounded-b-md border border-t-0 p-2 space-y-2 min-h-[300px] transition-colors ${meta.accent} ${isTarget ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                >
                  {filtered.cards.length === 0 ? (
                    <div className="text-center text-[11px] text-muted-foreground py-6 italic">
                      {filter ? 'Nessun risultato' : isTarget ? 'Rilascia qui' : 'Trascina qui o aggiungi una card'}
                    </div>
                  ) : (
                    filtered.cards.map(card => (
                      <PipelineCardView
                        key={card.id}
                        card={card}
                        onDragStart={handleDragStart}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                  {stage.count > stage.cards.length && !filter && (
                    <div className="text-center text-[11px] text-muted-foreground pt-1">
                      +{stage.count - stage.cards.length} altre
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
