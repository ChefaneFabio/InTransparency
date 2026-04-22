'use client'

import { useEffect, useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tabs, TabsList, TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Briefcase, CheckCircle2, XCircle, Clock, Loader2, Building2,
  FileText, MapPin, Calendar, Users, Search, AlertCircle,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { PremiumUpgradeBanner } from '@/components/dashboard/shared/PremiumUpgradeBanner'

interface Offer {
  id: string
  title: string
  description: string
  companyName: string
  location: string | null
  jobType: string
  workLocation: string
  requiredSkills: string[]
  status: string
  offerType: string | null
  createdAt: string
  postedAt: string | null
  approvedAt: string | null
  convention: null | { id: string; companyName: string; status: string }
  recruiter: null | { id: string; firstName: string | null; lastName: string | null; email: string; company: string | null }
  _count: { applications: number }
}

interface OffersData {
  jobs: Offer[]
  summary: { pending: number; active: number; draft: number }
}

export default function OfferModerationPage() {
  const [institutionId, setInstitutionId] = useState<string | null>(null)
  const [institutionName, setInstitutionName] = useState<string | null>(null)
  const [institutionPlan, setInstitutionPlan] = useState<'CORE' | 'PREMIUM' | null>(null)
  const [data, setData] = useState<OffersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('PENDING_APPROVAL')
  const [search, setSearch] = useState('')

  const [selected, setSelected] = useState<Offer | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [acting, setActing] = useState(false)

  useEffect(() => {
    fetch('/api/me/institutions')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d?.institutions?.length) { setLoading(false); return }
        const staffInst = d.institutions.find((i: any) =>
          ['INSTITUTION_ADMIN', 'INSTITUTION_STAFF'].includes(i.role)
        )
        const picked = staffInst || d.institutions[0]
        setInstitutionId(picked.id)
        setInstitutionName(picked.name || null)
        setInstitutionPlan(picked.plan || null)
      })
      .catch(() => setLoading(false))
  }, [])

  const fetchOffers = useCallback(async (id: string, s: string) => {
    setLoading(true)
    try {
      const qs = s === 'all' ? '' : `?status=${s}`
      const res = await fetch(`/api/institutions/${id}/offers${qs}`)
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (institutionId) fetchOffers(institutionId, status)
  }, [institutionId, status, fetchOffers])

  const approve = async (jobId: string) => {
    setActing(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/approve`, { method: 'POST' })
      if (res.ok) {
        setSelected(null)
        if (institutionId) fetchOffers(institutionId, status)
      }
    } finally {
      setActing(false)
    }
  }

  const reject = async (jobId: string) => {
    if (!reason.trim()) return
    setActing(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      })
      if (res.ok) {
        setRejectOpen(false)
        setSelected(null)
        setReason('')
        if (institutionId) fetchOffers(institutionId, status)
      }
    } finally {
      setActing(false)
    }
  }

  const filtered = data?.jobs.filter(j => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      j.title.toLowerCase().includes(q) ||
      j.companyName.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q)
    )
  }) || []

  if (!institutionId && !loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
        <h3 className="font-semibold">Accesso riservato allo staff</h3>
      </div>
    )
  }

  const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-700',
    PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    PAUSED: 'bg-blue-100 text-blue-700',
    CLOSED: 'bg-muted text-muted-foreground',
    FILLED: 'bg-teal-100 text-teal-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-5 pb-12">
      <PremiumUpgradeBanner
        institutionName={institutionName}
        plan={institutionPlan}
        feature="offers"
      />
      <MetricHero gradient="primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Offerte da moderare</h1>
            <p className="text-muted-foreground mt-1">
              Approva le offerte di lavoro tirocinio prima che diventino visibili agli studenti.
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
                    <div className="text-xs text-muted-foreground leading-none">Attive</div>
                    <div className="text-lg font-bold">{data.summary.active}</div>
                  </div>
                </div>
              </GlassCard>
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
            placeholder="Cerca offerta o azienda…"
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList>
          <TabsTrigger value="PENDING_APPROVAL">
            In attesa {data?.summary.pending ? `(${data.summary.pending})` : ''}
          </TabsTrigger>
          <TabsTrigger value="ACTIVE">Attive</TabsTrigger>
          <TabsTrigger value="DRAFT">Bozza</TabsTrigger>
          <TabsTrigger value="all">Tutte</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Nessuna offerta in questo stato</h3>
            <p className="text-sm text-muted-foreground">
              Le offerte legate alla tua istituzione che richiedono approvazione appariranno qui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(j => (
            <button
              key={j.id}
              onClick={() => setSelected(j)}
              className="w-full text-left rounded-lg border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm truncate">{j.title}</span>
                    <Badge className={`text-[10px] border-0 ${STATUS_COLORS[j.status]}`}>{j.status}</Badge>
                    {j.convention && (
                      <Badge variant="outline" className="text-[10px]">
                        <FileText className="h-2.5 w-2.5 mr-0.5" />
                        Convenzione {j.convention.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{j.companyName}</span>
                    {j.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location}</span>}
                    {j._count.applications > 0 && (
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{j._count.applications} candidature</span>
                    )}
                    <span className="flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {new Date(j.createdAt).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{j.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Offer review dialog */}
      <Dialog open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  {selected.companyName}
                  {selected.recruiter && ` — ${[selected.recruiter.firstName, selected.recruiter.lastName].filter(Boolean).join(' ')}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                {!selected.convention && selected.status === 'PENDING_APPROVAL' && (
                  <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Questa offerta <strong>non ha una convenzione attiva</strong> collegata.
                      Valuta se procedere o richiedere l'adesione a una convenzione prima di approvare.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selected.location && (
                    <div><span className="text-muted-foreground">Sede:</span> {selected.location}</div>
                  )}
                  <div><span className="text-muted-foreground">Tipo:</span> {selected.jobType}</div>
                  <div><span className="text-muted-foreground">Modalità:</span> {selected.workLocation}</div>
                  {selected.offerType && (
                    <div><span className="text-muted-foreground">Offerta:</span> {selected.offerType}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Descrizione</div>
                  <div className="rounded-md border bg-muted/20 p-3 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {selected.description}
                  </div>
                </div>

                {selected.requiredSkills.length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Competenze richieste</div>
                    <div className="flex flex-wrap gap-1">
                      {selected.requiredSkills.map(s => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selected.status === 'PENDING_APPROVAL' && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRejectOpen(true)} disabled={acting}>
                    <XCircle className="h-4 w-4 mr-1.5" /> Rifiuta
                  </Button>
                  <Button onClick={() => approve(selected.id)} disabled={acting}>
                    {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Approva & pubblica</>}
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
              Il recruiter vedrà questo messaggio e potrà ri-sottomettere l'offerta dopo averla modificata.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={4}
            placeholder="Es. Descrizione troppo generica; richiesta mansioni non compatibili con il curriculum; …"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={acting}>Annulla</Button>
            <Button onClick={() => selected && reject(selected.id)} disabled={acting || !reason.trim()} variant="destructive">
              {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Conferma rifiuto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
