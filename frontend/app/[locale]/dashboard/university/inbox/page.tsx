'use client'

import { useEffect, useState, useCallback } from 'react'
import { Link } from '@/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tabs, TabsList, TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Inbox, Mail, Shield, CheckCircle2, XCircle, AlertTriangle, Clock,
  Edit3, MessageSquare, Loader2, Search, User, Building2,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'

interface Message {
  id: string
  threadId: string
  status: string
  bodyOriginal: string
  bodyApproved: string | null
  rejectionReason: string | null
  ageHours: number
  isOverdue: boolean
  createdAt: string
  subject: string
  student: null | { id: string; name: string; email: string; photo: string | null; degree: string | null }
  company: null | { id: string; name: string; email: string | null }
}

interface InboxData {
  messages: Message[]
  summary: { pending: number; approved: number; rejected: number; overdue: number }
}

function ageLabel(hours: number): string {
  if (hours < 1) return '<1h'
  if (hours < 24) return `${hours}h`
  return `${Math.round(hours / 24)}g`
}

export default function InstitutionInboxPage() {
  const [institutionId, setInstitutionId] = useState<string | null>(null)
  const [institutionName, setInstitutionName] = useState<string | null>(null)
  const [institutionPlan, setInstitutionPlan] = useState<'CORE' | 'PREMIUM' | null>(null)
  const [data, setData] = useState<InboxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW')
  const [search, setSearch] = useState('')

  // Detail dialog
  const [selected, setSelected] = useState<Message | null>(null)
  const [editBody, setEditBody] = useState('')
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [acting, setActing] = useState(false)

  useEffect(() => {
    fetch('/api/me/institutions')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.institutions?.length) { setLoading(false); return }
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

  const fetchInbox = useCallback(async (id: string, status: string) => {
    setLoading(true)
    try {
      const qs = status === 'all' ? '' : `?status=${status}`
      const res = await fetch(`/api/institutions/${id}/inbox${qs}`)
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (institutionId) fetchInbox(institutionId, statusFilter)
  }, [institutionId, statusFilter, fetchInbox])

  const openMessage = (m: Message) => {
    setSelected(m)
    setEditBody(m.bodyOriginal)
    setRejectOpen(false)
    setRejectReason('')
  }

  const approve = async (edited?: boolean) => {
    if (!selected) return
    setActing(true)
    try {
      const payload = edited && editBody !== selected.bodyOriginal ? { edit: editBody.trim() } : {}
      const res = await fetch(`/api/mediation/messages/${selected.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSelected(null)
        if (institutionId) fetchInbox(institutionId, statusFilter)
      }
    } finally {
      setActing(false)
    }
  }

  const reject = async () => {
    if (!selected || !rejectReason.trim()) return
    setActing(true)
    try {
      const res = await fetch(`/api/mediation/messages/${selected.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      })
      if (res.ok) {
        setSelected(null)
        setRejectOpen(false)
        if (institutionId) fetchInbox(institutionId, statusFilter)
      }
    } finally {
      setActing(false)
    }
  }

  const filtered = data?.messages.filter(m => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      m.subject.toLowerCase().includes(q) ||
      m.student?.name.toLowerCase().includes(q) ||
      m.company?.name?.toLowerCase().includes(q) ||
      m.bodyOriginal.toLowerCase().includes(q)
    )
  }) || []

  const STATUS_META: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    PENDING_REVIEW: { label: 'In attesa', color: 'bg-amber-100 text-amber-700', icon: Clock },
    APPROVED: { label: 'Approvato', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    EDITED: { label: 'Modificato', color: 'bg-indigo-100 text-indigo-700', icon: Edit3 },
    DELIVERED: { label: 'Consegnato', color: 'bg-blue-100 text-blue-700', icon: Mail },
    READ: { label: 'Letto', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
    REPLIED: { label: 'Risposto', color: 'bg-emerald-100 text-emerald-700', icon: MessageSquare },
    REJECTED: { label: 'Rifiutato', color: 'bg-red-100 text-red-700', icon: XCircle },
  }

  if (!institutionId && !loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
        <h3 className="font-semibold">Accesso riservato allo staff dell'istituzione</h3>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-12">
      <MetricHero gradient="primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Inbox className="h-6 w-6" /> Inbox Istituzionale
            </h1>
            <p className="text-muted-foreground mt-1">
              Modera i messaggi delle aziende verso i tuoi studenti. Approva, edita, o rifiuta — ogni azione è tracciata.
            </p>
          </div>
          {data && (
            <div className="flex gap-2 flex-wrap">
              <GlassCard hover={false}>
                <div className="px-4 py-2.5 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="text-xs text-muted-foreground leading-none">In attesa</div>
                    <div className="text-lg font-bold">{data.summary.pending}</div>
                  </div>
                </div>
              </GlassCard>
              <GlassCard hover={false}>
                <div className="px-4 py-2.5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <div>
                    <div className="text-xs text-muted-foreground leading-none">Approvati</div>
                    <div className="text-lg font-bold">{data.summary.approved}</div>
                  </div>
                </div>
              </GlassCard>
              {data.summary.overdue > 0 && (
                <GlassCard hover={false}>
                  <div className="px-4 py-2.5 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-xs text-muted-foreground leading-none">Oltre 48h</div>
                      <div className="text-lg font-bold text-red-600">{data.summary.overdue}</div>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          )}
        </div>
      </MetricHero>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per azienda, studente, soggetto…"
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="PENDING_REVIEW" className="text-xs">
            In attesa {data?.summary.pending ? `(${data.summary.pending})` : ''}
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="text-xs">Approvati</TabsTrigger>
          <TabsTrigger value="REJECTED" className="text-xs">Rifiutati</TabsTrigger>
          <TabsTrigger value="all" className="text-xs">Tutti</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState
              icon={Inbox}
              title={
                statusFilter === 'PENDING_REVIEW'
                  ? 'Nessun messaggio in attesa'
                  : 'Nessun messaggio'
              }
              description="Quando un'azienda contatterà uno studente mediato, il messaggio apparirà qui per la tua revisione."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(m => {
            const meta = STATUS_META[m.status] || STATUS_META.PENDING_REVIEW
            const Icon = meta.icon
            return (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className={`w-full text-left rounded-lg border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all ${m.isOverdue ? 'border-red-300' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {m.student ? (
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={m.student.photo || undefined} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {m.student.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm truncate">{m.company?.name || 'Azienda'}</span>
                      <span className="text-muted-foreground text-xs">→</span>
                      <span className="text-sm truncate">{m.student?.name || 'Studente'}</span>
                      <Badge className={`text-[10px] border-0 ml-auto ${meta.color}`}>
                        <Icon className="h-2.5 w-2.5 mr-0.5" /> {meta.label}
                      </Badge>
                      {m.isOverdue && (
                        <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">
                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" /> 48h+
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs font-medium mb-1">{m.subject}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{m.bodyOriginal}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                      <span>{ageLabel(m.ageHours)} fa</span>
                      {m.student?.degree && <span>· {m.student.degree}</span>}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Moderation drawer */}
      <Dialog open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
                <DialogDescription>
                  Da <span className="font-medium">{selected.company?.name}</span> per{' '}
                  <span className="font-medium">{selected.student?.name}</span> — {ageLabel(selected.ageHours)} fa
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Testo originale</Label>
                  <div className="rounded-md border bg-muted/20 p-3 text-sm whitespace-pre-wrap">
                    {selected.bodyOriginal}
                  </div>
                </div>

                {selected.status === 'PENDING_REVIEW' && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Testo da approvare (modifica se necessario)
                    </Label>
                    <Textarea
                      value={editBody}
                      onChange={e => setEditBody(e.target.value)}
                      rows={6}
                      className="text-sm"
                    />
                    {editBody !== selected.bodyOriginal && (
                      <p className="text-[11px] text-indigo-600 mt-1 flex items-center gap-1">
                        <Edit3 className="h-3 w-3" /> La versione modificata verrà consegnata allo studente.
                      </p>
                    )}
                  </div>
                )}

                {selected.bodyApproved && selected.status !== 'PENDING_REVIEW' && selected.bodyApproved !== selected.bodyOriginal && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Testo consegnato (editato)</Label>
                    <div className="rounded-md border bg-indigo-50 dark:bg-indigo-950/30 p-3 text-sm whitespace-pre-wrap">
                      {selected.bodyApproved}
                    </div>
                  </div>
                )}

                {selected.rejectionReason && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Motivo del rifiuto</Label>
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm whitespace-pre-wrap">
                      {selected.rejectionReason}
                    </div>
                  </div>
                )}
              </div>

              {selected.status === 'PENDING_REVIEW' && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRejectOpen(true)} disabled={acting}>
                    <XCircle className="h-4 w-4 mr-1.5" /> Rifiuta
                  </Button>
                  <Button onClick={() => approve(true)} disabled={acting}>
                    {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      {editBody !== selected.bodyOriginal ? 'Salva & invia modifica' : 'Approva & invia'}
                    </>}
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motiva il rifiuto</DialogTitle>
            <DialogDescription>
              Il motivo non verrà mostrato allo studente, ma verrà inviato all'azienda
              e tracciato nell'audit trail.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            rows={4}
            placeholder="Es. Linguaggio non conforme; richiesta informazioni fuori ambito; …"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={acting}>Annulla</Button>
            <Button onClick={reject} disabled={acting || !rejectReason.trim()} variant="destructive">
              {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Conferma rifiuto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
