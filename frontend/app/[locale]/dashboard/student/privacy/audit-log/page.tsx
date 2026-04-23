'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Shield,
  Download,
  Clock,
  ArrowLeft,
  Eye,
  User,
  Bot,
  Building2,
  GraduationCap,
  FileSignature,
  Briefcase,
  MessageSquare,
  Info,
  CheckCircle2,
  Mail,
} from 'lucide-react'

interface AuditItem {
  id: string
  action: string
  entityType: string
  entityId: string
  createdAt: string
  actor: string
  iAmSubject: boolean
  iAmActor: boolean
}

interface AuditData {
  items: AuditItem[]
  summary: { total: number; byActionPrefix: Record<string, number> }
}

const PREFIX_META: Record<string, { icon: any; color: string; label: string }> = {
  assistant:  { icon: Bot,           color: 'bg-purple-100 text-purple-700',   label: 'Ricerca AI' },
  placement:  { icon: GraduationCap, color: 'bg-blue-100 text-blue-700',       label: 'Tirocinio' },
  mediation:  { icon: MessageSquare, color: 'bg-emerald-100 text-emerald-700', label: 'Messaggio' },
  job:        { icon: Briefcase,     color: 'bg-amber-100 text-amber-700',     label: 'Offerta' },
  lead:       { icon: Building2,     color: 'bg-teal-100 text-teal-700',       label: 'Azienda' },
  convention: { icon: FileSignature, color: 'bg-indigo-100 text-indigo-700',   label: 'Convenzione' },
}

// Human-readable, student-facing description per action
function describe(action: string, actor: string, iAmSubject: boolean): string {
  const suffix = action.split('.').slice(1).join('.')
  if (action.startsWith('assistant.')) {
    if (action === 'assistant.search_candidates') {
      return `${actor} ha fatto una ricerca AI e il tuo profilo è stato tra i risultati`
    }
    if (action === 'assistant.get_candidate_details') {
      return `${actor} ha aperto il tuo profilo completo tramite l'AI Assistant`
    }
    return `${actor} ha interrogato l'AI Assistant`
  }
  if (action.startsWith('mediation.message.')) {
    const verb: Record<string, string> = {
      'approve': 'ha approvato un messaggio indirizzato a te',
      'reject': 'ha rifiutato un messaggio indirizzato a te',
      'edit': 'ha modificato un messaggio indirizzato a te',
      'submit': "ha inviato un messaggio per te (in attesa di revisione)",
    }
    return `${actor} ${verb[suffix.replace('message.', '')] || 'ha agito su un messaggio indirizzato a te'}`
  }
  if (action.startsWith('placement.')) {
    const verb: Record<string, string> = {
      'create': 'ha creato il tuo record di tirocinio',
      'update': 'ha aggiornato il tuo tirocinio',
      'stage_change': 'ha cambiato fase al tuo tirocinio',
      'evaluation.submit': 'ha inviato una valutazione del tuo tirocinio',
      'hours.log': 'ha registrato ore sul tuo tirocinio',
    }
    return `${actor} ${verb[suffix] || 'ha agito sul tuo tirocinio'}`
  }
  if (action.startsWith('convention.generate')) {
    return `${actor} ha generato la bozza di convenzione per il tuo tirocinio`
  }
  if (iAmSubject) return `${actor} ha fatto ${action} su un record che ti riguarda`
  return `${actor} ha fatto ${action}`
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  if (diff < 60_000) return 'pochi secondi fa'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m fa`
  if (diff < 86_400_000) return `${Math.floor(diff / 3600_000)}h fa`
  if (diff < 30 * 86_400_000) return `${Math.floor(diff / 86_400_000)}g fa`
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function StudentAuditLogPage() {
  const [data, setData] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [since, setSince] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 90)
    return d.toISOString().slice(0, 10)
  })

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/dashboard/student/privacy/audit-log?since=${since}&limit=200`,
        )
        if (res.ok) setData(await res.json())
      } finally {
        setLoading(false)
      }
    })()
  }, [since])

  const exportCsv = () => {
    if (!data) return
    const rows = [
      ['timestamp', 'actor', 'action', 'you_as', 'entity_type'],
      ...data.items.map(i => [
        new Date(i.createdAt).toISOString(),
        i.actor,
        i.action,
        i.iAmSubject ? 'subject' : i.iAmActor ? 'actor' : 'related',
        i.entityType,
      ]),
    ]
    const csv = rows
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `my-data-trail-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <Link
        href="/dashboard/student/privacy"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Privacy
      </Link>

      {/* Hero */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Chi ha visto i tuoi dati
            </h1>
            <p className="text-sm text-muted-foreground">
              Ogni volta che qualcuno interagisce con il tuo profilo, è qui — GDPR Art. 15.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-white/60 border border-emerald-100 mt-4">
          <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700 leading-relaxed">
            Questa pagina mostra ogni azione tracciata sui tuoi dati negli ultimi{' '}
            <span className="font-medium">90 giorni</span>: ricerche AI che ti hanno
            incluso, messaggi da aziende, aggiornamenti al tuo tirocinio, e ogni
            decisione del tuo ateneo che ti riguarda. Puoi scaricare tutto in CSV e
            farne quello che vuoi.
          </p>
        </div>
      </div>

      {/* Stats + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {!loading && data && data.summary.total > 0 && (
            <>
              <Badge variant="outline" className="text-xs font-mono">
                {data.summary.total} event{data.summary.total === 1 ? 'o' : 'i'}
              </Badge>
              {Object.entries(data.summary.byActionPrefix)
                .slice(0, 4)
                .map(([prefix, count]) => {
                  const meta = PREFIX_META[prefix] || PREFIX_META.assistant
                  const Icon = meta.icon
                  return (
                    <span
                      key={prefix}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${meta.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {meta.label}: {count}
                    </span>
                  )
                })}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={since}
            onChange={e => setSince(e.target.value)}
            className="text-xs bg-background border rounded px-2 py-1.5"
          >
            {[7, 30, 90, 365].map(days => {
              const d = new Date()
              d.setDate(d.getDate() - days)
              return (
                <option key={days} value={d.toISOString().slice(0, 10)}>
                  Ultimi {days} giorni
                </option>
              )
            })}
          </select>
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={!data}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            CSV
          </Button>
        </div>
      </div>

      {/* Event list */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : !data || data.items.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Shield className="h-10 w-10 mx-auto mb-3 text-emerald-500" />
            <h3 className="font-semibold mb-1">Nessun evento tracciato</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Nessuno ha ancora interagito con i tuoi dati nell'intervallo selezionato.
              Quando un recruiter ti cercherà o il tuo ateneo aggiornerà qualcosa, apparirà qui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.items.map(i => {
            const prefix = i.action.split('.')[0]
            const meta = PREFIX_META[prefix] || {
              icon: Shield,
              color: 'bg-gray-100 text-gray-700',
              label: 'Sistema',
            }
            const Icon = meta.icon
            return (
              <div
                key={i.id}
                className={`flex items-start gap-3 p-3.5 rounded-lg border bg-card ${
                  i.iAmActor ? 'bg-blue-50/40 border-blue-100' : ''
                }`}
              >
                <div
                  className={`shrink-0 w-9 h-9 rounded-lg ${meta.color} flex items-center justify-center`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">
                    {describe(i.action, i.actor, i.iAmSubject)}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{fmtTime(i.createdAt)}</span>
                    {i.iAmSubject && !i.iAmActor && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-0.5 text-emerald-700">
                          <Eye className="h-3 w-3" />I tuoi dati
                        </span>
                      </>
                    )}
                    {i.iAmActor && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-0.5 text-blue-700">
                          <User className="h-3 w-3" />
                          Azione tua
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Rights footer */}
      <Card className="border-emerald-200 bg-emerald-50/40">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />I tuoi diritti GDPR
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Il trattamento dei tuoi dati è sempre auditabile. Oltre alla consultazione
            qui sopra (Art. 15), puoi chiedere in qualsiasi momento:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1.5 ml-4 list-disc">
            <li>
              <span className="font-medium text-gray-700">Rettifica</span> di dati
              imprecisi (Art. 16)
            </li>
            <li>
              <span className="font-medium text-gray-700">Cancellazione</span> del tuo
              profilo (Art. 17)
            </li>
            <li>
              <span className="font-medium text-gray-700">Portabilità</span> dei dati in
              formato machine-readable (Art. 20)
            </li>
            <li>
              <span className="font-medium text-gray-700">Revisione umana</span> delle
              decisioni automatizzate che ti riguardano (Art. 22 + AI Act Art. 86)
            </li>
          </ul>
          <div className="flex items-center gap-2 pt-2 border-t border-emerald-100">
            <Link
              href="/dashboard/student/privacy"
              className="text-xs text-primary hover:underline"
            >
              Gestisci i tuoi diritti →
            </Link>
            <span className="text-muted-foreground text-xs">o</span>
            <a
              href="mailto:privacy@in-transparency.com"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              <Mail className="h-3 w-3" /> contatta il DPO
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
