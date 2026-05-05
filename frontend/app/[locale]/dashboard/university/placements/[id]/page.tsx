'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import { useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Clock,
  GraduationCap,
  User,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  ListChecks,
  ClipboardList,
} from 'lucide-react'

type TimelineKind = 'CREATED' | 'STAGE' | 'EVALUATION' | 'HOURS' | 'DEADLINE' | 'AUDIT'

interface TimelineItem {
  at: string
  kind: TimelineKind
  title: string
  detail?: string
  actor?: string
}

interface Stage {
  id: string
  name: string
  order: number
  type: string
}

interface PlacementDetail {
  id: string
  companyName: string
  jobTitle: string
  status: string
  offerType: string
  startDate: string
  endDate: string | null
  plannedHours: number | null
  completedHours: number | null
  lastHoursLoggedAt: string | null
  currentStage: { id: string; name: string; type: string; order: number } | null
  stageEnteredAt: string | null
  student: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    degree: string | null
  } | null
  academicTutor: { firstName: string | null; lastName: string | null; email: string } | null
  companyTutor: { firstName: string | null; lastName: string | null; email: string } | null
}

interface TimelineResponse {
  placement: PlacementDetail
  timeline: TimelineItem[]
  stages: Stage[]
}

const KIND_ICONS: Record<TimelineKind, typeof CheckCircle2> = {
  CREATED: Briefcase,
  STAGE: ListChecks,
  EVALUATION: ClipboardList,
  HOURS: Clock,
  DEADLINE: AlertCircle,
  AUDIT: CheckCircle2,
}

const KIND_COLORS: Record<TimelineKind, string> = {
  CREATED: 'bg-blue-100 text-blue-700',
  STAGE: 'bg-violet-100 text-violet-700',
  EVALUATION: 'bg-emerald-100 text-emerald-700',
  HOURS: 'bg-amber-100 text-amber-700',
  DEADLINE: 'bg-rose-100 text-rose-700',
  AUDIT: 'bg-slate-100 text-slate-600',
}

export default function PlacementDetailPage() {
  const params = useParams<{ id: string }>()
  const placementId = params?.id
  const locale = useLocale()
  const isIt = locale === 'it'
  const [data, setData] = useState<TimelineResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [stageNote, setStageNote] = useState('')
  const [targetStage, setTargetStage] = useState<string>('')

  const fetchData = useCallback(async () => {
    if (!placementId) return
    try {
      const res = await fetch(`/api/dashboard/university/placements/${placementId}/timeline`)
      if (!res.ok) {
        setError(isIt ? 'Tirocinio non trovato.' : 'Placement not found.')
        return
      }
      const json = (await res.json()) as TimelineResponse
      setData(json)
    } catch (err) {
      console.error(err)
      setError(isIt ? 'Errore di rete.' : 'Network error.')
    } finally {
      setLoading(false)
    }
  }, [placementId, isIt])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function transition() {
    if (!data || !targetStage) return
    setTransitioning(true)
    try {
      await fetch(`/api/placements/${data.placement.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toStageId: targetStage, note: stageNote || undefined }),
      })
      setStageNote('')
      setTargetStage('')
      await fetchData()
    } finally {
      setTransitioning(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/university/analytics?tab=placement">
            <ArrowLeft className="h-4 w-4 mr-1" /> {isIt ? 'Indietro' : 'Back'}
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const { placement, timeline, stages } = data
  const studentName = placement.student
    ? [placement.student.firstName, placement.student.lastName].filter(Boolean).join(' ') || placement.student.email
    : '—'
  const academicTutor = placement.academicTutor
    ? [placement.academicTutor.firstName, placement.academicTutor.lastName].filter(Boolean).join(' ')
    : null
  const companyTutor = placement.companyTutor
    ? [placement.companyTutor.firstName, placement.companyTutor.lastName].filter(Boolean).join(' ')
    : null

  const hoursPct =
    placement.plannedHours && placement.plannedHours > 0
      ? Math.min(100, Math.round(((placement.completedHours ?? 0) / placement.plannedHours) * 100))
      : null

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/university/analytics?tab=placement">
          <ArrowLeft className="h-4 w-4 mr-1" /> {isIt ? 'Tutti i tirocini' : 'All placements'}
        </Link>
      </Button>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-semibold">{placement.jobTitle}</h1>
          <Badge variant="outline">{placement.companyName}</Badge>
          <Badge variant="secondary">{placement.status}</Badge>
          {placement.currentStage && (
            <Badge className="bg-violet-100 text-violet-700">{placement.currentStage.name}</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          <User className="inline h-4 w-4 mr-1 -mt-0.5" />
          {studentName}
          {placement.student?.degree && <> · {placement.student.degree}</>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile
          icon={CalendarDays}
          label={isIt ? 'Inizio' : 'Start'}
          value={new Date(placement.startDate).toLocaleDateString(isIt ? 'it-IT' : 'en-GB')}
        />
        <SummaryTile
          icon={CalendarDays}
          label={isIt ? 'Fine' : 'End'}
          value={placement.endDate ? new Date(placement.endDate).toLocaleDateString(isIt ? 'it-IT' : 'en-GB') : '—'}
        />
        <SummaryTile
          icon={Clock}
          label={isIt ? 'Ore svolte / previste' : 'Hours done / planned'}
          value={
            placement.plannedHours
              ? `${placement.completedHours ?? 0} / ${placement.plannedHours}${hoursPct !== null ? ` (${hoursPct}%)` : ''}`
              : `${placement.completedHours ?? 0}`
          }
        />
        <SummaryTile
          icon={GraduationCap}
          label={isIt ? 'Tutor' : 'Tutor'}
          value={[academicTutor, companyTutor].filter(Boolean).join(' / ') || '—'}
        />
      </div>

      {stages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isIt ? 'Cambia fase' : 'Move to stage'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Select value={targetStage} onValueChange={setTargetStage}>
                  <SelectTrigger>
                    <SelectValue placeholder={isIt ? 'Seleziona fase…' : 'Select stage…'} />
                  </SelectTrigger>
                  <SelectContent>
                    {stages
                      .filter((s) => s.id !== placement.currentStage?.id)
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.order + 1}. {s.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <input
                type="text"
                value={stageNote}
                onChange={(e) => setStageNote(e.target.value)}
                placeholder={isIt ? 'Nota (opzionale)' : 'Note (optional)'}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <Button onClick={transition} disabled={!targetStage || transitioning}>
                {transitioning ? (isIt ? 'Sposto…' : 'Moving…') : isIt ? 'Sposta' : 'Move'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isIt ? 'Timeline' : 'Timeline'}</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {isIt ? 'Nessun evento registrato per questo tirocinio.' : 'No events recorded for this placement yet.'}
            </p>
          ) : (
            <ol className="space-y-4 relative border-l border-muted pl-6">
              {timeline.map((item, idx) => {
                const Icon = KIND_ICONS[item.kind]
                return (
                  <li key={idx} className="relative">
                    <span className={`absolute -left-[34px] flex h-7 w-7 items-center justify-center rounded-full ${KIND_COLORS[item.kind]}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.at).toLocaleString(isIt ? 'it-IT' : 'en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {item.detail && <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>}
                      {item.actor && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <Building2 className="inline h-3 w-3 mr-1 -mt-0.5" />
                          {item.actor}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryTile({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-4 space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
        <div className="text-sm font-medium">{value}</div>
      </CardContent>
    </Card>
  )
}
