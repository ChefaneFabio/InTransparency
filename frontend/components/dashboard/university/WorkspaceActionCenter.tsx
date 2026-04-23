'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Inbox,
  FileSignature,
  Building2,
  GraduationCap,
  Sparkles,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Zap,
} from 'lucide-react'

interface ModuleInfo {
  key: string
  pendingCount?: number
  recentCount?: number
  overdueDeadlines?: number
  noHours?: number
  activeCount?: number
  totalCount?: number
  href: string
}

interface WorkspaceData {
  plan: 'CORE' | 'PREMIUM'
  isFirstRun: boolean
  totalStudents: number
  modules: {
    inbox: ModuleInfo
    offers: ModuleInfo
    crm: ModuleInfo
    placement: ModuleInfo
    assistant: ModuleInfo
    auditLog: ModuleInfo
  }
}

interface ModuleDef {
  key: keyof WorkspaceData['modules']
  icon: any
  title: string
  // Primary count label (the big number)
  primaryLabel: (m: ModuleInfo) => string
  // Secondary status text below
  secondary: (m: ModuleInfo) => string | null
  // True if module has something demanding attention NOW
  hasAlert: (m: ModuleInfo) => boolean
  accent: {
    border: string
    gradient: string
    icon: string
    chip: string
  }
}

const MODULES: ModuleDef[] = [
  {
    key: 'inbox',
    icon: Inbox,
    title: 'Mediation Inbox',
    primaryLabel: m => `${m.pendingCount ?? 0}`,
    secondary: m =>
      (m.pendingCount ?? 0) === 0
        ? 'Nessun messaggio in attesa'
        : `${m.pendingCount} da rivedere${
            (m.recentCount ?? 0) > 0 ? ` · ${m.recentCount} nuovi oggi` : ''
          }`,
    hasAlert: m => (m.pendingCount ?? 0) > 0,
    accent: {
      border: 'border-blue-200',
      gradient: 'from-blue-50 to-white',
      icon: 'bg-blue-100 text-blue-700',
      chip: 'bg-blue-600 text-white',
    },
  },
  {
    key: 'offers',
    icon: FileSignature,
    title: 'Offerte',
    primaryLabel: m => `${m.pendingCount ?? 0}`,
    secondary: m =>
      (m.pendingCount ?? 0) === 0
        ? 'Nessuna offerta in attesa'
        : `${m.pendingCount} da approvare${
            (m.recentCount ?? 0) > 0 ? ` · ${m.recentCount} nuove oggi` : ''
          }`,
    hasAlert: m => (m.pendingCount ?? 0) > 0,
    accent: {
      border: 'border-purple-200',
      gradient: 'from-purple-50 to-white',
      icon: 'bg-purple-100 text-purple-700',
      chip: 'bg-purple-600 text-white',
    },
  },
  {
    key: 'crm',
    icon: Building2,
    title: 'CRM Aziende',
    primaryLabel: m => `${m.totalCount ?? 0}`,
    secondary: m => {
      const stale = m.pendingCount ?? 0
      if ((m.totalCount ?? 0) === 0) return 'Nessun lead ancora'
      return stale > 0
        ? `${m.totalCount} lead · ${stale} in silenzio da 7+ giorni`
        : `${m.totalCount} lead · tutti seguiti`
    },
    hasAlert: m => (m.pendingCount ?? 0) > 0,
    accent: {
      border: 'border-emerald-200',
      gradient: 'from-emerald-50 to-white',
      icon: 'bg-emerald-100 text-emerald-700',
      chip: 'bg-emerald-600 text-white',
    },
  },
  {
    key: 'placement',
    icon: GraduationCap,
    title: 'Pipeline Tirocini',
    primaryLabel: m => `${m.activeCount ?? 0}`,
    secondary: m => {
      if ((m.activeCount ?? 0) === 0) return 'Nessun placement attivo'
      const risks = m.pendingCount ?? 0
      if (risks === 0) return `${m.activeCount} attivi · nessun rischio`
      return `${m.activeCount} attivi · ${risks} a rischio`
    },
    hasAlert: m => (m.pendingCount ?? 0) > 0,
    accent: {
      border: 'border-amber-200',
      gradient: 'from-amber-50 to-white',
      icon: 'bg-amber-100 text-amber-700',
      chip: 'bg-amber-600 text-white',
    },
  },
]

const SECONDARY_MODULES: ModuleDef[] = [
  {
    key: 'assistant',
    icon: Sparkles,
    title: 'AI Assistant',
    primaryLabel: () => '',
    secondary: () => 'Chiedi in linguaggio naturale',
    hasAlert: () => false,
    accent: {
      border: 'border-indigo-200',
      gradient: 'from-indigo-50 to-white',
      icon: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
      chip: 'bg-indigo-600 text-white',
    },
  },
  {
    key: 'auditLog',
    icon: Shield,
    title: 'Audit Log',
    primaryLabel: m => `${m.recentCount ?? 0}`,
    secondary: m =>
      (m.recentCount ?? 0) === 0
        ? 'Nessun evento nelle ultime 24h'
        : `${m.recentCount} event${(m.recentCount ?? 0) === 1 ? 'o' : 'i'} nelle ultime 24h`,
    hasAlert: () => false,
    accent: {
      border: 'border-teal-200',
      gradient: 'from-teal-50 to-white',
      icon: 'bg-teal-100 text-teal-700',
      chip: 'bg-teal-600 text-white',
    },
  },
]

export function WorkspaceActionCenter() {
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/dashboard/university/workspace-actions')
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

  const totalPending =
    (data.modules.inbox.pendingCount ?? 0) +
    (data.modules.offers.pendingCount ?? 0) +
    (data.modules.placement.pendingCount ?? 0)

  return (
    <div className="space-y-3">
      {/* Header + summary */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Cosa ti aspetta oggi
          </h2>
          <p className="text-xs text-muted-foreground">
            {totalPending > 0
              ? `${totalPending} cos${totalPending === 1 ? 'a' : 'e'} richied${totalPending === 1 ? 'e' : 'ono'} la tua attenzione`
              : data.isFirstRun
                ? 'Workspace pronta — importa studenti per iniziare'
                : 'Tutto sotto controllo — nessuna azione urgente'}
          </p>
        </div>
        {totalPending === 0 && !data.isFirstRun && (
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Inbox zero
          </div>
        )}
        {data.plan === 'CORE' && (
          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
            Piano CORE · funzionalità limitate
          </Badge>
        )}
      </div>

      {/* 4 primary module cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MODULES.map(def => {
          const info = data.modules[def.key]
          const Icon = def.icon
          const alerting = def.hasAlert(info)
          return (
            <Link
              key={def.key}
              href={info.href as any}
              className={`relative group rounded-xl border ${def.accent.border} bg-gradient-to-br ${def.accent.gradient} p-4 hover:shadow-md hover:border-primary/40 transition-all overflow-hidden`}
            >
              {alerting && (
                <div className="absolute top-2 right-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2.5 mb-3">
                <div className={`shrink-0 w-8 h-8 rounded-lg ${def.accent.icon} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium truncate">{def.title}</h3>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-bold ${
                    alerting ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {def.primaryLabel(info)}
                </span>
              </div>
              <p
                className={`text-[11px] mt-1 leading-tight ${
                  alerting ? 'text-red-700 font-medium' : 'text-muted-foreground'
                }`}
              >
                {def.secondary(info)}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Apri <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Secondary: AI Assistant + Audit Log */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SECONDARY_MODULES.map(def => {
          const info = data.modules[def.key]
          const Icon = def.icon
          return (
            <Link
              key={def.key}
              href={info.href as any}
              className={`group rounded-xl border ${def.accent.border} bg-gradient-to-br ${def.accent.gradient} p-4 hover:shadow-md hover:border-primary/40 transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`shrink-0 w-10 h-10 rounded-lg ${def.accent.icon} flex items-center justify-center shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">{def.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {def.secondary(info)}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* First-run CTA banner */}
      {data.isFirstRun && (
        <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Benvenuto! Primo passo: importa i tuoi studenti</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Senza studenti, la workspace è vuota. Puoi importarli da CSV o aggiungerli
              manualmente. Quando iniziano le loro prime iscrizioni, Inbox e Tirocini si
              popolano automaticamente.
            </p>
          </div>
          <Link
            href="/dashboard/university/students/import"
            className="shrink-0 inline-flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90"
          >
            Importa CSV
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
