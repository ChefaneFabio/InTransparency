'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Shield, Download, Search, Filter, Clock, User, Bot,
  MessageSquare, Briefcase, Building2, GraduationCap, FileSignature,
  CheckCircle2, XCircle, ExternalLink,
} from 'lucide-react'
import { Link } from '@/navigation'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import PremiumBadge from '@/components/shared/PremiumBadge'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { useMyInstitution } from '@/lib/hooks/use-my-institution'

interface AuditEvent {
  id: string
  action: string
  entityType: string
  entityId: string
  payload: any
  createdAt: string
  actor: { id: string; name: string; role: string | null } | null
}

interface AuditData {
  events: AuditEvent[]
  totalForInstitution: number
  actionBreakdown: Array<{ action: string; count: number }>
}

// Map action prefix → icon + color + i18n-ish label
function actionMeta(action: string): { icon: any; color: string; label: string } {
  if (action.startsWith('assistant.'))         return { icon: Bot,           color: 'text-purple-600 bg-purple-50',  label: 'AI Assistant' }
  if (action.startsWith('placement.'))         return { icon: GraduationCap, color: 'text-blue-600 bg-blue-50',      label: 'Placement' }
  if (action.startsWith('mediation.'))         return { icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50',label: 'Mediation' }
  if (action.startsWith('job.'))               return { icon: Briefcase,     color: 'text-amber-600 bg-amber-50',    label: 'Offerta' }
  if (action.startsWith('lead.'))              return { icon: Building2,     color: 'text-teal-600 bg-teal-50',      label: 'CRM' }
  if (action.startsWith('convention.'))        return { icon: FileSignature, color: 'text-indigo-600 bg-indigo-50',  label: 'Convenzione' }
  if (action.startsWith('reminder.'))          return { icon: Clock,         color: 'text-orange-600 bg-orange-50',  label: 'Reminder' }
  return { icon: Shield, color: 'text-gray-600 bg-gray-100', label: 'Sistema' }
}

function actionVerb(action: string): string {
  const suffix = action.split('.').slice(1).join('.')
  const verbs: Record<string, string> = {
    'create':                  'ha creato',
    'update':                  'ha aggiornato',
    'delete':                  'ha eliminato',
    'stage_change':            'ha cambiato stage',
    'approve':                 'ha approvato',
    'reject':                  'ha rifiutato',
    'edit':                    'ha modificato',
    'note':                    'ha aggiunto una nota a',
    'submit':                  'ha inviato',
    'reply':                   'ha risposto a',
    'generate':                'ha generato',
    'evaluation.submit':       'ha inviato una valutazione per',
    'hours.log':               'ha registrato ore su',
    'message.submit':          'ha inviato un messaggio su',
    'message.approve':         'ha approvato un messaggio su',
    'message.reject':          'ha rifiutato un messaggio su',
    'message.edit':            'ha modificato un messaggio su',
    'message.reply':           'ha risposto a un messaggio su',
    'message.note':            'ha annotato un messaggio su',
    'activity.log':            "ha registrato un'attività su",
    'search_candidates':       'ha cercato candidati',
    'get_candidate_details':   'ha aperto il dettaglio di',
    'list_at_risk_placements': "ha interrogato 'placement a rischio'",
    'list_students_without_placement': "ha interrogato 'studenti senza tirocinio'",
    'summarize_placement_stats': "ha interrogato 'statistiche placement'",
    'list_stale_company_leads': "ha interrogato 'aziende in silenzio'",
  }
  return verbs[suffix] || `ha eseguito ${suffix}`
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  if (diff < 60_000) return 'pochi secondi fa'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m fa`
  if (diff < 86_400_000) return `${Math.floor(diff / 3600_000)}h fa`
  if (diff < 30 * 86_400_000) return `${Math.floor(diff / 86_400_000)}g fa`
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
}

function entityDetailUrl(e: AuditEvent): string | null {
  switch (e.entityType) {
    case 'Placement':         return `/dashboard/university/placement-pipeline/${e.entityId}`
    case 'CompanyLead':       return `/dashboard/university/crm/${e.entityId}`
    case 'MediationMessage':  return `/dashboard/university/inbox`
    case 'Job':               return `/dashboard/university/offers`
    default: return null
  }
}

const ACTION_GROUPS = [
  { value: 'all',        label: 'Tutte le azioni' },
  { value: 'assistant',  label: 'AI Assistant' },
  { value: 'placement',  label: 'Placement' },
  { value: 'mediation',  label: 'Mediation Inbox' },
  { value: 'job',        label: 'Offerte' },
  { value: 'lead',       label: 'CRM' },
  { value: 'convention', label: 'Convenzioni' },
]

export default function AuditLogPage() {
  const { institution } = useMyInstitution()
  const [data, setData] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionGroup, setActionGroup] = useState('all')
  const [search, setSearch] = useState('')
  const [since, setSince] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().slice(0, 10)
  })

  const fetchLog = useCallback(async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (since) qs.set('since', since)
      qs.set('limit', '200')
      const res = await fetch(`/api/dashboard/university/audit-log?${qs}`)
      if (res.ok) setData(await res.json())
      else setData(null)
    } finally {
      setLoading(false)
    }
  }, [since])

  useEffect(() => { fetchLog() }, [fetchLog])

  const filteredEvents = (data?.events || []).filter(e => {
    if (actionGroup !== 'all' && !e.action.startsWith(actionGroup + '.')) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        e.action.toLowerCase().includes(q) ||
        e.entityType.toLowerCase().includes(q) ||
        (e.actor?.name.toLowerCase().includes(q) ?? false) ||
        e.entityId.toLowerCase().includes(q)
      )
    }
    return true
  })

  const exportCsv = () => {
    if (!data) return
    const rows = [
      ['timestamp', 'actor', 'actorRole', 'action', 'entityType', 'entityId'],
      ...filteredEvents.map(e => [
        new Date(e.createdAt).toISOString(),
        e.actor?.name ?? '',
        e.actor?.role ?? '',
        e.action,
        e.entityType,
        e.entityId,
      ]),
    ]
    const csv = rows
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5 pb-12 max-w-5xl mx-auto">

      <MetricHero gradient="primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 flex-wrap">
                Audit Log
                <PremiumBadge audience="institution" variant="chip" label="Premium · full export" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Ogni azione scritta o query AI, tracciata con actor + timestamp. Evidenza
                riproducibile per AI Act Art. 86 e GDPR Art. 22.
                <span className="block mt-1 text-xs">
                  Free Core: ultimi 30 giorni · Premium: storia completa + export CSV.
                </span>
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!data}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </MetricHero>

      {/* Stats strip */}
      {data && !loading && (
        <div className="flex items-center gap-2 flex-wrap">
          <GlassCard hover={false}>
            <div className="px-3 py-2 text-sm">
              <span className="text-muted-foreground">Totale eventi:</span>{' '}
              <span className="font-bold font-mono">{data.totalForInstitution}</span>
            </div>
          </GlassCard>
          {data.actionBreakdown.slice(0, 6).map(a => {
            const meta = actionMeta(a.action)
            return (
              <button
                key={a.action}
                onClick={() => {
                  const group = a.action.split('.')[0]
                  setActionGroup(
                    ACTION_GROUPS.some(g => g.value === group) ? group : 'all',
                  )
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs ${meta.color} hover:opacity-80 transition-opacity`}
              >
                <meta.icon className="h-3 w-3" />
                <span className="font-medium">{a.action}</span>
                <span className="font-mono tabular-nums">{a.count}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per attore, azione, entityId…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionGroup} onValueChange={setActionGroup}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_GROUPS.map(g => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={since}
            onChange={e => setSince(e.target.value)}
            className="w-full sm:w-[160px]"
            title="Dal"
          />
        </CardContent>
      </Card>

      {/* Events timeline */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState
              icon={Shield}
              tone="institution"
              title="Nessun evento nell'intervallo selezionato"
              description="Prova ad allargare l'intervallo di date o a rimuovere i filtri."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1">
          {filteredEvents.map(e => {
            const meta = actionMeta(e.action)
            const url = entityDetailUrl(e)
            const Icon = meta.icon
            return (
              <div
                key={e.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className={`shrink-0 w-8 h-8 rounded-lg ${meta.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-medium">
                      {e.actor?.name || 'Sistema'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {actionVerb(e.action)}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {e.entityType}
                    </Badge>
                    {e.actor?.role && (
                      <Badge variant="secondary" className="text-[10px]">
                        {e.actor.role}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(e.createdAt)}</span>
                    <span>·</span>
                    <span className="font-mono truncate">
                      {e.entityId.slice(0, 16)}…
                    </span>
                  </div>
                  {e.payload && typeof e.payload === 'object' && Object.keys(e.payload).length > 0 && (
                    <details className="mt-1.5 group">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Dettagli payload
                      </summary>
                      <pre className="mt-1 text-[10px] bg-muted p-2 rounded overflow-x-auto max-h-40">
                        {JSON.stringify(e.payload, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                {url && (
                  <Link
                    href={url as any}
                    className="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
        <Shield className="h-3 w-3" />
        Log immutabile. Esportabile per i diritti dell'interessato (GDPR Art. 15, 20).
      </p>
    </div>
  )
}
