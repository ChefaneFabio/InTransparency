'use client'

import { useEffect, useState, useCallback } from 'react'
import { Link, useRouter } from '@/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Briefcase, Users, Building2, Clock, CheckCircle2, AlertTriangle,
  Search, TrendingUp, Calendar, GraduationCap, Target,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { useMyInstitution } from '@/lib/hooks/use-my-institution'
import PremiumBadge from '@/components/shared/PremiumBadge'

interface Stage {
  id: string; name: string; order: number; type: string
}

interface Placement {
  id: string
  student: null | { id: string; name: string; email: string; degree: string | null; photo: string | null }
  companyName: string
  jobTitle: string
  offerType: string
  stage: null | { id: string; name: string; order: number; type: string }
  stageEnteredAt: string | null
  startDate: string
  endDate: string | null
  academicTutor: null | { id: string; name: string }
  companyTutor:  null | { id: string; name: string }
  plannedHours: number | null
  completedHours: number
  hoursPct: number | null
  daysSinceHoursLogged: number | null
  convention: null | { id: string; companyName: string; status: string }
  counts: { evaluations: number; hoursLogs: number; deadlines: number }
  outcome: string | null
  status: string
}

const OFFER_LABELS: Record<string, string> = {
  TIROCINIO_CURRICULARE: 'Curriculare',
  TIROCINIO_EXTRA: 'Extracurricolare',
  APPRENDISTATO: 'Apprendistato',
  PLACEMENT: 'Placement',
  PART_TIME: 'Part-time',
}

const STAGE_COLORS: Record<string, string> = {
  APPLICATION: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  INTERVIEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  MATCHED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  CONVENTION_SIGNED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  IN_PROGRESS: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  MID_EVALUATION: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  FINAL_EVALUATION: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  COMPLETED: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  FOLLOW_UP: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  DROPPED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

function daysSince(date: string | null): number | null {
  if (!date) return null
  return Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 86_400_000))
}

export default function PlacementPipelinePage() {
  const router = useRouter()
  const { institution } = useMyInstitution()
  const [placements, setPlacements] = useState<Placement[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [atRiskOnly, setAtRiskOnly] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/placements?limit=200')
      if (res.ok) {
        const data = await res.json()
        setPlacements(data.placements || [])
        const stageMap = new Map<string, Stage>()
        for (const p of data.placements || []) {
          if (p.stage) stageMap.set(p.stage.id, p.stage)
        }
        setStages(Array.from(stageMap.values()).sort((a, b) => a.order - b.order))
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = placements.filter(p => {
    if (stageFilter !== 'all' && p.stage?.id !== stageFilter) return false
    if (atRiskOnly) {
      const isRisk = (p.daysSinceHoursLogged !== null && p.daysSinceHoursLogged > 7) ||
                     (p.stage?.type === 'IN_PROGRESS' && (p.hoursPct === null || p.hoursPct < 50) &&
                       daysSince(p.startDate)! > 60)
      if (!isRisk) return false
    }
    if (filter.trim()) {
      const q = filter.toLowerCase()
      return (
        p.student?.name.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q) ||
        p.jobTitle.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Aggregates
  const stats = {
    total: placements.length,
    active: placements.filter(p => p.stage?.type === 'IN_PROGRESS').length,
    completed: placements.filter(p => p.stage?.type === 'COMPLETED' || p.stage?.type === 'FOLLOW_UP').length,
    atRisk: placements.filter(p => {
      if (p.stage?.type !== 'IN_PROGRESS') return false
      if (p.daysSinceHoursLogged !== null && p.daysSinceHoursLogged > 7) return true
      return false
    }).length,
    hiredConverted: placements.filter(p => p.outcome === 'HIRED').length,
  }

  return (
    <div className="space-y-6 pb-12">
      <MetricHero gradient="primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              Pipeline Placement
              <PremiumBadge audience="institution" variant="chip" label="Premium · automation" />
            </h1>
            <p className="text-muted-foreground mt-1">
              Dalla candidatura all'esito occupazionale. Tracciamento orario, valutazioni, scadenze — visibile a te, ai tutor, allo studente e all'azienda.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Free Core: tracciamento manuale fino a 50 placement attivi · Premium: reminder automatici (7/30/60gg), notifiche tutor/studente, esiti occupazionali e export.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <GlassCard hover={false}>
              <div className="px-4 py-2.5 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground leading-none">Totale</div>
                  <div className="text-lg font-bold">{stats.total}</div>
                </div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="px-4 py-2.5 flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-xs text-muted-foreground leading-none">In corso</div>
                  <div className="text-lg font-bold">{stats.active}</div>
                </div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="px-4 py-2.5 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <div>
                  <div className="text-xs text-muted-foreground leading-none">Conclusi</div>
                  <div className="text-lg font-bold">{stats.completed}</div>
                </div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="px-4 py-2.5 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-xs text-muted-foreground leading-none">Assunti</div>
                  <div className="text-lg font-bold">{stats.hiredConverted}</div>
                </div>
              </div>
            </GlassCard>
            {stats.atRisk > 0 && (
              <GlassCard hover={false}>
                <div className="px-4 py-2.5 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-xs text-muted-foreground leading-none">A rischio</div>
                    <div className="text-lg font-bold text-red-600">{stats.atRisk}</div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </MetricHero>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per studente, azienda, ruolo…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={atRiskOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAtRiskOnly(v => !v)}
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            Solo a rischio
          </Button>
        </div>

        {stages.length > 0 && (
          <Tabs value={stageFilter} onValueChange={setStageFilter}>
            <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap">
              <TabsTrigger value="all" className="text-xs">Tutti ({placements.length})</TabsTrigger>
              {stages.map(s => {
                const count = placements.filter(p => p.stage?.id === s.id).length
                return (
                  <TabsTrigger key={s.id} value={s.id} className="text-xs">
                    {s.name} <span className="ml-1 text-muted-foreground">({count})</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState
            icon={Briefcase}
            title="Nessun placement corrispondente"
            description="Prova a modificare i filtri, oppure crea un nuovo placement da un'applicazione accettata."
          />
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => {
            const isAtRisk = p.stage?.type === 'IN_PROGRESS' &&
              (p.daysSinceHoursLogged === null || p.daysSinceHoursLogged > 7)
            const stageColor = p.stage ? STAGE_COLORS[p.stage.type] : 'bg-slate-100'
            return (
              <Link
                key={p.id}
                href={`/dashboard/university/placement-pipeline/${p.id}`}
                className="block"
              >
                <div className={`rounded-lg border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all ${isAtRisk ? 'border-red-300' : ''}`}>
                  <div className="flex items-start gap-4">
                    {/* Student */}
                    {p.student ? (
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={p.student.photo || undefined} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {p.student.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm truncate">
                            {p.student?.name || 'Studente non assegnato'}
                          </span>
                          {p.stage && (
                            <Badge variant="outline" className={`text-[10px] border-0 ${stageColor}`}>
                              {p.stage.name}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px]">
                            {OFFER_LABELS[p.offerType] || p.offerType}
                          </Badge>
                          {isAtRisk && (
                            <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">
                              <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                              {p.daysSinceHoursLogged !== null ? `${p.daysSinceHoursLogged}g no ore` : 'Nessun log'}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                          <span className="flex items-center gap-1 truncate">
                            <Building2 className="h-3 w-3 flex-shrink-0" /> {p.companyName}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <Briefcase className="h-3 w-3 flex-shrink-0" /> {p.jobTitle}
                          </span>
                        </div>
                        {p.student?.degree && (
                          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" /> {p.student.degree}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        {/* Hours */}
                        {p.plannedHours && (
                          <div className="flex items-center gap-2 text-xs">
                            <Target className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <Progress value={p.hoursPct || 0} className="h-1.5 flex-1" />
                            <span className="text-muted-foreground tabular-nums">
                              {p.completedHours}/{p.plannedHours}h
                            </span>
                          </div>
                        )}
                        {/* Tutors */}
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                          {p.academicTutor && (
                            <span className="inline-flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />Acc: {p.academicTutor.name}
                            </span>
                          )}
                          {p.companyTutor && (
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="h-3 w-3" />Az: {p.companyTutor.name}
                            </span>
                          )}
                        </div>
                        {/* Dates */}
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(p.startDate).toLocaleDateString('it-IT')}
                          {p.endDate && ` — ${new Date(p.endDate).toLocaleDateString('it-IT')}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
