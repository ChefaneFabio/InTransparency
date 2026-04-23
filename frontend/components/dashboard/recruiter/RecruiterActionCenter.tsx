'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  Briefcase,
  MessageSquare,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Eye,
  Zap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

interface ActionCenterData {
  isFirstRun: boolean
  pipeline: {
    total: number
    byStage: Record<string, number>
  }
  jobs: {
    activeCount: number
    totalCount: number
    viewsLast7d: number
    active: Array<{
      id: string
      title: string
      location: string | null
      postedAt: string | null
      pendingApplications: number
    }>
  }
  applications: { newToday: number }
  messages: { unread: number }
  assistant: { queriesLast7d: number }
}

const STAGE_ORDER: Array<{ key: string; label: string; color: string }> = [
  { key: 'discovered',   label: 'Scoperti',    color: 'bg-slate-400' },
  { key: 'contacted',    label: 'Contattati',  color: 'bg-blue-500' },
  { key: 'interviewing', label: 'Colloqui',    color: 'bg-amber-500' },
  { key: 'offered',      label: 'Offerti',     color: 'bg-purple-500' },
  { key: 'hired',        label: 'Assunti',     color: 'bg-green-600' },
]

export function RecruiterActionCenter() {
  const [data, setData] = useState<ActionCenterData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/dashboard/recruiter/action-center')
        if (res.ok) setData(await res.json())
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div>
        <Skeleton className="h-6 w-48 mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!data) return null

  const pendingActions =
    data.applications.newToday +
    data.messages.unread +
    data.jobs.active.reduce((sum, j) => sum + j.pendingApplications, 0)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Cosa ti aspetta oggi
          </h2>
          <p className="text-xs text-muted-foreground">
            {pendingActions > 0
              ? `${pendingActions} cos${pendingActions === 1 ? 'a' : 'e'} richied${pendingActions === 1 ? 'e' : 'ono'} la tua attenzione`
              : data.isFirstRun
                ? 'Benvenuto — inizia cercando talenti o pubblicando un lavoro'
                : 'Tutto sotto controllo'}
          </p>
        </div>
        {pendingActions === 0 && !data.isFirstRun && (
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Inbox zero
          </div>
        )}
      </div>

      {/* 4 top metrics — mirrors the uni action center layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Pipeline */}
        <Link
          href="/dashboard/recruiter/pipeline"
          className="group relative rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-medium">Pipeline</h3>
          </div>
          <div className="text-2xl font-bold">{data.pipeline.total}</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {data.pipeline.total > 0
              ? `${data.pipeline.byStage.interviewing ?? 0} in colloquio · ${data.pipeline.byStage.hired ?? 0} assunti`
              : 'Nessun candidato salvato'}
          </p>
        </Link>

        {/* Jobs */}
        <Link
          href="/dashboard/recruiter/jobs"
          className="group relative rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-medium">Offerte attive</h3>
          </div>
          <div className="text-2xl font-bold">{data.jobs.activeCount}</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {data.jobs.viewsLast7d > 0
              ? `${data.jobs.viewsLast7d} view · 7g`
              : 'Nessuna view recente'}
          </p>
        </Link>

        {/* Applications today */}
        <Link
          href="/dashboard/recruiter/jobs"
          className="group relative rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 hover:shadow-md hover:border-primary/40 transition-all"
        >
          {data.applications.newToday > 0 && (
            <div className="absolute top-2 right-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-medium">Candidature oggi</h3>
          </div>
          <div
            className={`text-2xl font-bold ${
              data.applications.newToday > 0 ? 'text-emerald-600' : ''
            }`}
          >
            {data.applications.newToday}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {data.applications.newToday > 0
              ? 'Nelle ultime 24h'
              : 'Nessuna nelle ultime 24h'}
          </p>
        </Link>

        {/* Messages */}
        <Link
          href="/dashboard/recruiter/messages"
          className="group relative rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 hover:shadow-md hover:border-primary/40 transition-all"
        >
          {data.messages.unread > 0 && (
            <div className="absolute top-2 right-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-medium">Messaggi</h3>
          </div>
          <div
            className={`text-2xl font-bold ${
              data.messages.unread > 0 ? 'text-red-600' : ''
            }`}
          >
            {data.messages.unread}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {data.messages.unread > 0 ? 'Non letti' : 'Nessun messaggio non letto'}
          </p>
        </Link>
      </div>

      {/* Pipeline stage strip — visual funnel */}
      {data.pipeline.total > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Pipeline candidati
            </h3>
            <Link
              href="/dashboard/recruiter/pipeline"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Apri kanban
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {STAGE_ORDER.map((s, i) => {
              const count = data.pipeline.byStage[s.key] ?? 0
              return (
                <div key={s.key} className="flex items-center gap-1">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      count > 0 ? 'bg-muted' : 'bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
                    <span>{s.label}</span>
                    <span className="font-mono tabular-nums">{count}</span>
                  </div>
                  {i < STAGE_ORDER.length - 1 && (
                    <span className="text-muted-foreground/40 text-xs">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* AI Assistant CTA — highlight the differentiator */}
      <Link
        href="/dashboard/recruiter/assistant"
        className="block rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">Talent Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {data.assistant.queriesLast7d > 0
                ? `${data.assistant.queriesLast7d} quer${data.assistant.queriesLast7d === 1 ? 'y' : 'ies'} negli ultimi 7 giorni — cerca candidati in linguaggio naturale`
                : "Cerca candidati in linguaggio naturale — es. 'ingegneri meccanici con CFD al Politecnico'"}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </Link>

      {/* First-run CTA */}
      {data.isFirstRun && (
        <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Primo passo: cerca talenti o pubblica un lavoro</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Usa il Talent Assistant per trovare candidati verificati, o pubblica
              un'offerta per raccogliere candidature.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/dashboard/recruiter/assistant"
              className="inline-flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90"
            >
              Cerca <Sparkles className="h-3 w-3" />
            </Link>
            <Link
              href="/dashboard/recruiter/jobs"
              className="inline-flex items-center gap-1 text-xs font-medium border border-primary text-primary px-3 py-1.5 rounded-md hover:bg-primary/5"
            >
              Posta
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
