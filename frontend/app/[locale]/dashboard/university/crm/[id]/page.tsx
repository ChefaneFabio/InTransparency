'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft, Building2, Calendar, Mail, Phone, User, MapPin,
  TrendingUp, MessageCircle, Phone as PhoneIcon, Users2, FileText,
  Loader2, ExternalLink, Plus, Globe, Target,
} from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Stage { id: string; name: string; order: number; type: string }
interface Activity {
  id: string; type: string; content: string; createdAt: string;
  staff: { id: string; firstName: string | null; lastName: string | null }
}
interface Transition {
  id: string; createdAt: string; note: string | null;
  fromStage: null | { id: string; name: string }
  toStage: { id: string; name: string }
  staff: { id: string; firstName: string | null; lastName: string | null }
}
interface Lead {
  id: string
  institutionId: string
  externalName: string | null
  externalDomain: string | null
  sector: string | null
  sizeRange: string | null
  region: string | null
  city: string | null
  source: string | null
  lostReason: string | null
  nextActionAt: string | null
  primaryContactName: string | null
  primaryContactEmail: string | null
  primaryContactPhone: string | null
  currentStageId: string
  stageEnteredAt: string
  createdAt: string
  updatedAt: string
  ownerStaff: null | { id: string; firstName: string | null; lastName: string | null; email: string }
  currentStage: Stage
  activities: Activity[]
  transitions: Transition[]
}

const TYPE_ICONS: Record<string, typeof MessageCircle> = {
  NOTE: FileText,
  EMAIL: Mail,
  CALL: PhoneIcon,
  MEETING: Users2,
  DOCUMENT: FileText,
  STAGE_CHANGE: TrendingUp,
}

function personName(u: { firstName: string | null; lastName: string | null } | null): string {
  if (!u) return 'Sistema'
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Staff'
}

export default function CompanyLeadDetailPage() {
  const params = useParams()
  const leadId = params?.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)

  const [activityType, setActivityType] = useState('NOTE')
  const [activityContent, setActivityContent] = useState('')
  const [activitySaving, setActivitySaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const leadRes = await fetch(`/api/leads/${leadId}`)
      if (leadRes.ok) {
        const { lead: fetched } = await leadRes.json()
        setLead(fetched)
        // Fetch stages for this institution
        if (fetched?.institutionId) {
          const p = await fetch(`/api/institutions/${fetched.institutionId}/pipeline`)
          if (p.ok) {
            const { stages: s } = await p.json()
            setStages(s.map((x: any) => ({ id: x.id, name: x.name, order: x.order, type: x.type })))
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }, [leadId])

  useEffect(() => { load() }, [load])

  const addActivity = async () => {
    if (!activityContent.trim()) return
    setActivitySaving(true)
    try {
      const res = await fetch(`/api/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activityType, content: activityContent.trim() }),
      })
      if (res.ok) {
        setActivityContent('')
        load()
      }
    } finally {
      setActivitySaving(false)
    }
  }

  const transitionStage = async (toStageId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toStageId }),
      })
      if (res.ok) load()
    } catch { /* silent */ }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 p-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-muted-foreground">Lead non trovato o non autorizzato.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/university/crm"><ArrowLeft className="h-4 w-4 mr-2" /> Torna al CRM</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 p-4 pb-12">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/university/crm">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> CRM
        </Link>
      </Button>

      <MetricHero gradient="primary">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold truncate">{lead.externalName}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                {lead.sector && <span>{lead.sector}</span>}
                {lead.sizeRange && <Badge variant="outline" className="text-[10px]">{lead.sizeRange}</Badge>}
                {lead.externalDomain && (
                  <a href={`https://${lead.externalDomain}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                    <Globe className="h-3 w-3" /> {lead.externalDomain} <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge>{lead.currentStage.name}</Badge>
                {lead.nextActionAt && new Date(lead.nextActionAt) < new Date() && (
                  <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">
                    Next action scaduta
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground">Sposta a</Label>
            <Select onValueChange={transitionStage}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Cambia stage…" />
              </SelectTrigger>
              <SelectContent>
                {stages.filter(s => s.id !== lead.currentStageId).map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </MetricHero>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Contact */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <User className="h-4 w-4" /> Contatto principale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            {lead.primaryContactName ? (
              <>
                <div className="font-medium">{lead.primaryContactName}</div>
                {lead.primaryContactEmail && (
                  <a href={`mailto:${lead.primaryContactEmail}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                    <Mail className="h-3 w-3" /> {lead.primaryContactEmail}
                  </a>
                )}
                {lead.primaryContactPhone && (
                  <a href={`tel:${lead.primaryContactPhone}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                    <Phone className="h-3 w-3" /> {lead.primaryContactPhone}
                  </a>
                )}
              </>
            ) : (
              <span className="text-muted-foreground italic">Da compilare</span>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> Sede
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-0.5">
            {(lead.city || lead.region) ? (
              <div>{[lead.city, lead.region].filter(Boolean).join(', ')}</div>
            ) : (
              <span className="text-muted-foreground italic">Non specificata</span>
            )}
            {lead.source && (
              <div className="text-muted-foreground pt-1 border-t mt-1">
                Fonte: <span className="font-medium">{lead.source}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owner & dates */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Target className="h-4 w-4" /> Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <div>
              <span className="text-muted-foreground">Owner:</span>{' '}
              <span className="font-medium">{personName(lead.ownerStaff)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">In stage da:</span>{' '}
              {Math.max(0, Math.round((Date.now() - new Date(lead.stageEnteredAt).getTime()) / 86_400_000))}g
            </div>
            {lead.nextActionAt && (
              <div>
                <span className="text-muted-foreground">Next action:</span>{' '}
                <span className="font-medium">{new Date(lead.nextActionAt).toLocaleDateString('it-IT')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> Attività
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* New activity form */}
          <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
            <div className="flex gap-2">
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOTE">Nota</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="CALL">Chiamata</SelectItem>
                  <SelectItem value="MEETING">Meeting</SelectItem>
                  <SelectItem value="DOCUMENT">Documento</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                value={activityContent}
                onChange={e => setActivityContent(e.target.value)}
                placeholder="Descrivi l'attività, allegare decisioni o prossimi step…"
                rows={2}
                className="flex-1"
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={addActivity} disabled={activitySaving || !activityContent.trim()}>
                {activitySaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Plus className="h-3.5 w-3.5 mr-1" /> Aggiungi</>}
              </Button>
            </div>
          </div>

          {/* Timeline */}
          {lead.activities.length === 0 && lead.transitions.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground italic">
              Nessuna attività. Aggiungi la prima sopra.
            </div>
          ) : (
            <div className="space-y-2">
              {/* Interleave activities + transitions by date */}
              {[
                ...lead.activities.map(a => ({ kind: 'activity' as const, date: a.createdAt, data: a })),
                ...lead.transitions.map(t => ({ kind: 'transition' as const, date: t.createdAt, data: t })),
              ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(item => {
                  if (item.kind === 'transition') {
                    const t = item.data
                    return (
                      <div key={t.id} className="flex items-start gap-2 p-2 rounded bg-primary/5 text-xs">
                        <TrendingUp className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div>
                            <span className="font-medium">{personName(t.staff)}</span>
                            <span className="text-muted-foreground"> ha spostato il lead: </span>
                            {t.fromStage && <Badge variant="outline" className="text-[10px] mr-1">{t.fromStage.name}</Badge>}
                            <span className="text-muted-foreground">→</span>
                            <Badge className="text-[10px] ml-1">{t.toStage.name}</Badge>
                          </div>
                          {t.note && <p className="text-muted-foreground mt-1">{t.note}</p>}
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(t.createdAt).toLocaleString('it-IT')}
                          </div>
                        </div>
                      </div>
                    )
                  }
                  const a = item.data
                  const Icon = TYPE_ICONS[a.type] || FileText
                  return (
                    <div key={a.id} className="flex items-start gap-2 p-2 rounded border bg-card text-xs">
                      <div className="h-6 w-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                          <span className="font-medium">{personName(a.staff)}</span>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {new Date(a.createdAt).toLocaleString('it-IT')}
                          </span>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap mt-1">{a.content}</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
