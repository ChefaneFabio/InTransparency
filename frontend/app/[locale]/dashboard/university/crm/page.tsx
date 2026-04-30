'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Building2, Plus, Search, GripVertical, Calendar, Phone, Mail,
  TrendingUp, Target, AlertTriangle, CheckCircle2, FileSignature, RefreshCw,
  XCircle, Briefcase, Loader2, User,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Lead {
  id: string
  companyName: string
  domain: string | null
  sector: string | null
  sizeRange: string | null
  region: string | null
  city: string | null
  source: string | null
  owner: null | { id: string; name: string }
  stageEnteredAt: string
  daysInStage: number
  nextActionAt: string | null
  primaryContact: null | { name: string; email: string | null; phone: string | null }
  activitiesCount: number
}

interface StageColumn {
  id: string
  name: string
  order: number
  type: string
  count: number
  leads: Lead[]
}

interface Pipeline {
  stages: StageColumn[]
  summary: { totalLeads: number; signed: number; lost: number; atRisk: number }
}

const TYPE_ICONS: Record<string, typeof Building2> = {
  LEAD: Target,
  CONTACTED: Phone,
  MEETING: Calendar,
  PROPOSAL: Briefcase,
  SIGNED: FileSignature,
  ACTIVE: CheckCircle2,
  RENEWAL: RefreshCw,
  LOST: XCircle,
}

const TYPE_COLORS: Record<string, { bg: string; dot: string }> = {
  LEAD: { bg: 'bg-slate-50 dark:bg-slate-900/30', dot: 'bg-slate-400' },
  CONTACTED: { bg: 'bg-blue-50 dark:bg-blue-950/30', dot: 'bg-blue-500' },
  MEETING: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', dot: 'bg-indigo-500' },
  PROPOSAL: { bg: 'bg-amber-50 dark:bg-amber-950/30', dot: 'bg-amber-500' },
  SIGNED: { bg: 'bg-teal-50 dark:bg-teal-950/30', dot: 'bg-teal-500' },
  ACTIVE: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', dot: 'bg-emerald-500' },
  RENEWAL: { bg: 'bg-purple-50 dark:bg-purple-950/30', dot: 'bg-purple-500' },
  LOST: { bg: 'bg-red-50 dark:bg-red-950/30', dot: 'bg-red-400' },
}

const DEFAULT_FORM = {
  externalName: '', externalDomain: '', sector: '', sizeRange: '',
  region: '', city: '', source: '',
  primaryContactName: '', primaryContactEmail: '', primaryContactPhone: '',
}

export default function InstitutionCrmPage() {
  const router = useRouter()
  const locale = useLocale()
  const isIt = locale === 'it'
  const [institutionId, setInstitutionId] = useState<string | null>(null)
  const [institutionName, setInstitutionName] = useState<string | null>(null)
  const [institutionPlan, setInstitutionPlan] = useState<'CORE' | 'PREMIUM' | null>(null)
  const [pipeline, setPipeline] = useState<Pipeline | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [dragOver, setDragOver] = useState<string | null>(null)
  const draggedId = useRef<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)

  // Resolve the user's institution ID first
  useEffect(() => {
    fetch('/api/me/institutions')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.institutions?.length) { setLoading(false); return }
        // Pick the first institution where the user is staff
        const staffInst = data.institutions.find((i: any) =>
          ['INSTITUTION_ADMIN', 'INSTITUTION_STAFF'].includes(i.role)
        )
        const picked = staffInst || data.institutions[0]
        setInstitutionId(picked.id)
        setInstitutionName(picked.name || null)
        setInstitutionPlan(picked.plan || null)
      })
      .catch(() => setLoading(false))
  }, [])

  const fetchPipeline = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/institutions/${id}/pipeline`)
      if (res.ok) setPipeline(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (institutionId) fetchPipeline(institutionId)
  }, [institutionId, fetchPipeline])

  const handleDragStart = (e: React.DragEvent, id: string) => {
    draggedId.current = id
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOver !== stageId) setDragOver(stageId)
  }

  const handleDrop = async (e: React.DragEvent, toStageId: string) => {
    e.preventDefault()
    setDragOver(null)
    const id = draggedId.current
    draggedId.current = null
    if (!id || !pipeline) return

    // Find source stage
    let sourceStage: StageColumn | null = null
    let lead: Lead | null = null
    for (const s of pipeline.stages) {
      const l = s.leads.find(x => x.id === id)
      if (l) { sourceStage = s; lead = l; break }
    }
    if (!lead || !sourceStage || sourceStage.id === toStageId) return

    // Optimistic
    const prev = pipeline
    const next: Pipeline = {
      ...pipeline,
      stages: pipeline.stages.map(s => {
        if (s.id === sourceStage!.id) return { ...s, count: s.count - 1, leads: s.leads.filter(x => x.id !== id) }
        if (s.id === toStageId) return { ...s, count: s.count + 1, leads: [{ ...lead!, daysInStage: 0 }, ...s.leads] }
        return s
      }),
    }
    setPipeline(next)

    try {
      const res = await fetch(`/api/leads/${id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toStageId }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setPipeline(prev)
    }
  }

  const createLead = async () => {
    if (!institutionId || !form.externalName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId,
          externalName: form.externalName.trim(),
          externalDomain: form.externalDomain || null,
          sector: form.sector || null,
          sizeRange: form.sizeRange || null,
          region: form.region || null,
          city: form.city || null,
          source: form.source || null,
          primaryContactName: form.primaryContactName || null,
          primaryContactEmail: form.primaryContactEmail || null,
          primaryContactPhone: form.primaryContactPhone || null,
        }),
      })
      if (res.ok) {
        setCreateOpen(false)
        setForm(DEFAULT_FORM)
        if (institutionId) fetchPipeline(institutionId)
      }
    } finally {
      setSaving(false)
    }
  }

  const filterLead = (l: Lead) => {
    if (!filter.trim()) return true
    const q = filter.toLowerCase()
    return (
      l.companyName.toLowerCase().includes(q) ||
      l.sector?.toLowerCase().includes(q) ||
      l.city?.toLowerCase().includes(q) ||
      l.primaryContact?.name?.toLowerCase().includes(q) ||
      l.owner?.name?.toLowerCase().includes(q)
    )
  }

  if (!institutionId && !loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
        <h3 className="font-semibold mb-1">{isIt ? 'Accesso solo per staff istituzione' : 'Institution staff access only'}</h3>
        <p className="text-sm text-muted-foreground">
          {isIt ? 'Questa sezione è per career service e admin dell\'istituzione.' : 'This section is for career services and institution admins.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-12">
      <MetricHero gradient="institution">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{isIt ? 'CRM Aziende' : 'Company CRM'}</h1>
            <p className="text-muted-foreground mt-1">
              {isIt ? 'Pipeline di acquisizione: dal primo contatto alla convenzione firmata. Trascina per aggiornare lo stato.' : 'Acquisition pipeline: from first contact to signed agreement. Drag to update status.'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {pipeline && (
              <>
                <GlassCard hover={false}>
                  <div className="px-4 py-2.5 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground leading-none">{isIt ? 'Lead' : 'Leads'}</div>
                      <div className="text-lg font-bold">{pipeline.summary.totalLeads}</div>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="px-4 py-2.5 flex items-center gap-2">
                    <FileSignature className="h-4 w-4 text-emerald-600" />
                    <div>
                      <div className="text-xs text-muted-foreground leading-none">{isIt ? 'Firmate' : 'Signed'}</div>
                      <div className="text-lg font-bold">{pipeline.summary.signed}</div>
                    </div>
                  </div>
                </GlassCard>
                {pipeline.summary.atRisk > 0 && (
                  <GlassCard hover={false}>
                    <div className="px-4 py-2.5 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-xs text-muted-foreground leading-none">{isIt ? 'Next action scaduta' : 'Overdue next action'}</div>
                        <div className="text-lg font-bold text-red-600">{pipeline.summary.atRisk}</div>
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
            placeholder={isIt ? 'Cerca per azienda, settore, città, owner…' : 'Search by company, sector, city, owner…'}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1.5" /> {isIt ? 'Nuovo lead' : 'New lead'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isIt ? 'Nuovo lead azienda' : 'New company lead'}</DialogTitle>
              <DialogDescription>
                {isIt ? 'Aggiungi un\'azienda che vuoi contattare per una convenzione. Puoi completare i dettagli in seguito.' : 'Add a company you want to reach out to. You can complete the details later.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>{isIt ? 'Nome azienda *' : 'Company name *'}</Label>
                <Input value={form.externalName} onChange={e => setForm(f => ({ ...f, externalName: e.target.value }))} placeholder="Evoca Group" />
              </div>
              <div>
                <Label>{isIt ? 'Dominio' : 'Domain'}</Label>
                <Input value={form.externalDomain} onChange={e => setForm(f => ({ ...f, externalDomain: e.target.value }))} placeholder="evocagroup.com" />
              </div>
              <div>
                <Label>{isIt ? 'Settore' : 'Sector'}</Label>
                <Input value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} placeholder="Food & Beverage" />
              </div>
              <div>
                <Label>{isIt ? 'Dimensione' : 'Size'}</Label>
                <Select value={form.sizeRange} onValueChange={v => setForm(f => ({ ...f, sizeRange: v }))}>
                  <SelectTrigger><SelectValue placeholder={isIt ? 'N. dipendenti' : 'Employees'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="500+">500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{isIt ? 'Regione' : 'Region'}</Label>
                <Input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="Lombardia" />
              </div>
              <div>
                <Label>{isIt ? 'Città' : 'City'}</Label>
                <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Milano" />
              </div>
              <div className="col-span-2">
                <Label>{isIt ? 'Fonte' : 'Source'}</Label>
                <Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="career-day, referral, LinkedIn…" />
              </div>
              <div className="col-span-2 pt-2 border-t">
                <div className="text-xs font-semibold mb-2">{isIt ? 'Contatto principale' : 'Primary contact'}</div>
              </div>
              <div>
                <Label>{isIt ? 'Nome' : 'Name'}</Label>
                <Input value={form.primaryContactName} onChange={e => setForm(f => ({ ...f, primaryContactName: e.target.value }))} />
              </div>
              <div>
                <Label>{isIt ? 'Email' : 'Email'}</Label>
                <Input type="email" value={form.primaryContactEmail} onChange={e => setForm(f => ({ ...f, primaryContactEmail: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label>{isIt ? 'Telefono' : 'Phone'}</Label>
                <Input value={form.primaryContactPhone} onChange={e => setForm(f => ({ ...f, primaryContactPhone: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={saving}>{isIt ? 'Annulla' : 'Cancel'}</Button>
              <Button onClick={createLead} disabled={saving || !form.externalName.trim()}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isIt ? 'Crea lead' : 'Create lead')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="flex-shrink-0 w-72 space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              {[0, 1].map(j => <Skeleton key={j} className="h-24 w-full rounded-md" />)}
            </div>
          ))}
        </div>
      ) : !pipeline || pipeline.stages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">{isIt ? 'Pipeline vuota' : 'Empty pipeline'}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isIt ? 'Aggiungi il primo lead per iniziare a tracciare l\'acquisizione.' : 'Add your first lead to start tracking acquisition.'}
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> {isIt ? 'Nuovo lead' : 'New lead'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {pipeline.stages.map(stage => {
            const Icon = TYPE_ICONS[stage.type] || Target
            const colors = TYPE_COLORS[stage.type] || TYPE_COLORS.LEAD
            const isTarget = dragOver === stage.id
            const filteredLeads = stage.leads.filter(filterLead)
            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-72"
                onDragOver={e => handleDragOver(e, stage.id)}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => handleDrop(e, stage.id)}
              >
                <div className={`rounded-t-md px-3 py-2.5 ${colors.bg} border border-b-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${colors.dot}`} />
                      <span className="font-semibold text-sm">{stage.name}</span>
                      <Badge variant="outline" className="text-[10px] h-5">{stage.count}</Badge>
                    </div>
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>

                <div className={`rounded-b-md border border-t-0 p-2 space-y-2 min-h-[300px] transition-colors ${colors.bg} ${isTarget ? 'ring-2 ring-primary ring-offset-1' : ''}`}>
                  {filteredLeads.length === 0 ? (
                    <div className="flex items-center justify-center h-[240px]">
                      <p className="text-center text-xs text-muted-foreground px-3">
                        {filter
                          ? (isIt ? 'Nessun lead corrisponde al filtro' : 'No leads match the filter')
                          : isTarget
                            ? (isIt ? 'Rilascia qui per spostare' : 'Drop here to move')
                            : (isIt ? 'Nessun lead in questa fase' : 'No leads in this stage')}
                      </p>
                    </div>
                  ) : (
                    filteredLeads.map(l => {
                      const overdue = l.nextActionAt && new Date(l.nextActionAt) < new Date()
                      return (
                        <Link
                          key={l.id}
                          href={`/dashboard/university/crm/${l.id}`}
                          draggable
                          onDragStart={e => handleDragStart(e, l.id)}
                          className={`block rounded-md border bg-card p-3 text-xs shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${overdue ? 'border-red-300' : ''}`}
                        >
                          <div className="flex items-start gap-1.5 mb-1.5">
                            <GripVertical className="h-3 w-3 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold truncate">{l.companyName}</div>
                              {l.sector && <div className="text-muted-foreground truncate text-[10px]">{l.sector}</div>}
                            </div>
                            {overdue && <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />}
                          </div>
                          {l.city && (
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1">
                              <Building2 className="h-2.5 w-2.5" /> {l.city}{l.region && `, ${l.region}`}
                            </div>
                          )}
                          {l.primaryContact?.name && (
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1">
                              <User className="h-2.5 w-2.5" /> {l.primaryContact.name}
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-1.5 border-t text-[10px] text-muted-foreground mt-1">
                            {l.owner ? (
                              <span className="truncate">👤 {l.owner.name}</span>
                            ) : <span className="italic">{isIt ? 'No owner' : 'No owner'}</span>}
                            <span>{l.daysInStage}{isIt ? 'g' : 'd'}</span>
                          </div>
                        </Link>
                      )
                    })
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
