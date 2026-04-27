'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  Search, Building2, Clock, Star, CheckCircle, Users, Plus,
  Briefcase, Calendar, TrendingUp, ThumbsUp, Award, GraduationCap,
  Loader2, AlertCircle
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { useInstitution } from '@/lib/institution-context'

interface Stage {
  id: string
  studentName: string
  studentEmail: string
  studentPhoto: string | null
  studentDegree: string | null
  companyName: string
  companyIndustry: string | null
  role: string
  department: string | null
  supervisorName: string | null
  startDate: string
  endDate: string | null
  targetHours: number | null
  completedHours: number
  stageType: string
  status: string
  studentSkills: string[]
  studentRating: number | null
  studentHighlight: string | null
  supervisorRating: number | null
  supervisorCompetencies: any
  supervisorStrengths: string | null
  supervisorWouldHire: boolean | null
  verified: boolean
  verifiedSkills: string[]
}

interface Stats {
  total: number
  active: number
  completed: number
  evaluated: number
  totalHours: number
  avgRating: number
  wouldHireRate: number
  companies: number
  byType: Record<string, number>
}

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  PENDING: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Clock },
  ACTIVE: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Briefcase },
  COMPLETED: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: CheckCircle },
  EVALUATED: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Star },
  VERIFIED: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: Award },
  CANCELLED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
}

const typeLabels: Record<string, string> = {
  CURRICULARE: 'Curriculare',
  EXTRACURRICULARE: 'Extracurriculare',
  APPRENDISTATO: 'Apprendistato',
  TIROCINIO_POST: 'Post-laurea',
}

export default function StagesPage() {
  const t = useTranslations('universityStages')
  const inst = useInstitution()
  const [stages, setStages] = useState<Stage[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // New stage form
  const [addOpen, setAddOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [form, setForm] = useState({ studentId: '', companyName: '', role: '', department: '', supervisorName: '', supervisorEmail: '', startDate: '', targetHours: '', stageType: 'CURRICULARE' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (statusFilter) params.set('status', statusFilter)
      if (typeFilter) params.set('type', typeFilter)
      const res = await fetch(`/api/dashboard/university/stages?${params}`)
      if (res.ok) {
        const data = await res.json()
        setStages(data.stages)
        setStats(data.stats)
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [searchTerm, statusFilter, typeFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAdd = async () => {
    if (!form.studentId || !form.companyName || !form.role || !form.startDate) {
      setAddError(t('form.required'))
      return
    }
    setAddLoading(true)
    setAddError(null)
    try {
      const res = await fetch('/api/dashboard/university/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setAddOpen(false)
        setForm({ studentId: '', companyName: '', role: '', department: '', supervisorName: '', supervisorEmail: '', startDate: '', targetHours: '', stageType: 'CURRICULARE' })
        await fetchData()
      } else {
        const data = await res.json()
        setAddError(data.error || t('form.error'))
      }
    } catch { setAddError(t('form.error')) }
    finally { setAddLoading(false) }
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return '—'
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 inline ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/20'}`} />
    ))
  }

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="dark">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{inst.stageLabel}</h1>
            <p className="text-white/60 mt-1">{inst.type === 'school' ? 'Gestisci i PCTO dei tuoi studenti, monitora le ore e raccogli le valutazioni.' : inst.type === 'its' ? 'Traccia gli stage obbligatori, le ore in azienda e le valutazioni dei tutor.' : t('subtitle')}</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Plus className="h-4 w-4 mr-2" />{t('addStage')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>{t('form.title')}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('form.studentId')} *</Label>
                    <Input placeholder={t('form.studentIdPlaceholder')} value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('form.company')} *</Label>
                    <Input placeholder="Brembo" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('form.role')} *</Label>
                    <Input placeholder={t('form.rolePlaceholder')} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('form.type')}</Label>
                    <Select value={form.stageType} onValueChange={v => setForm(f => ({ ...f, stageType: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('form.startDate')} *</Label>
                    <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('form.targetHours')}</Label>
                    <Input type="number" placeholder="200" value={form.targetHours} onChange={e => setForm(f => ({ ...f, targetHours: e.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('form.supervisor')}</Label>
                    <Input placeholder={t('form.supervisorPlaceholder')} value={form.supervisorName} onChange={e => setForm(f => ({ ...f, supervisorName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('form.supervisorEmail')}</Label>
                    <Input type="email" placeholder="tutor@brembo.it" value={form.supervisorEmail} onChange={e => setForm(f => ({ ...f, supervisorEmail: e.target.value }))} />
                  </div>
                </div>
                {addError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />{addError}
                  </div>
                )}
                <Button onClick={handleAdd} disabled={addLoading} className="w-full">
                  {addLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  {addLoading ? t('form.adding') : t('form.submit')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </MetricHero>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats && (
          <>
            <StatCard label={t('stats.active')} value={stats.active} icon={<Briefcase className="h-5 w-5" />} variant="slate" />
            <StatCard label={t('stats.completed')} value={stats.completed} icon={<CheckCircle className="h-5 w-5" />} variant="slate" />
            <StatCard label={t('stats.avgRating')} value={stats.avgRating} icon={<Star className="h-5 w-5" />} variant="slate" suffix="/5" />
            <StatCard label={t('stats.wouldHire')} value={stats.wouldHireRate} icon={<ThumbsUp className="h-5 w-5" />} variant="slate" suffix="%" />
          </>
        )}
        {!stats && loading && [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>

      {/* Secondary stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard delay={0.1}>
            <div className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40"><Clock className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.totalHours.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('stats.totalHours')}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={0.15}>
            <div className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40"><Building2 className="h-5 w-5 text-emerald-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.companies}</p>
                <p className="text-xs text-muted-foreground">{t('stats.hostCompanies')}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={0.2}>
            <div className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40"><GraduationCap className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('stats.totalStages')}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Filters */}
      <GlassCard delay={0.1}>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('searchPlaceholder')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder={t('filterStatus')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                {Object.keys(statusConfig).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder={t('filterType')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Stage list */}
      {loading && <div className="grid gap-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>}

      {!loading && (
        <div className="grid gap-3">
          {stages.map((stage, i) => {
            const sc = statusConfig[stage.status] || statusConfig.PENDING
            const StatusIcon = sc.icon
            const hoursProgress = stage.targetHours ? Math.min(100, Math.round((stage.completedHours / stage.targetHours) * 100)) : 0

            return (
              <motion.div key={stage.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link href={`/dashboard/university/stages/${stage.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={stage.studentPhoto || ''} />
                        <AvatarFallback>{stage.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold">{stage.studentName}</h3>
                          <Badge className={`${sc.color} border-0 text-xs`}>
                            <StatusIcon className="h-3 w-3 mr-1" />{t(`status.${stage.status}`)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{typeLabels[stage.stageType] || stage.stageType}</Badge>
                          {stage.verified && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs"><Award className="h-3 w-3 mr-1" />{t('verified')}</Badge>}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">{stage.role}</span>
                          <span className="text-muted-foreground">@ {stage.companyName}</span>
                          {stage.department && <span className="text-muted-foreground">({stage.department})</span>}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(stage.startDate).toLocaleDateString()}
                            {stage.endDate && ` — ${new Date(stage.endDate).toLocaleDateString()}`}
                          </span>
                          {stage.supervisorName && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {t('supervisor')}: {stage.supervisorName}
                            </span>
                          )}
                        </div>

                        {/* Hours progress */}
                        {stage.targetHours && (
                          <div className="mt-3 flex items-center gap-3">
                            <Progress value={hoursProgress} className="flex-1 h-2" />
                            <span className="text-xs font-medium tabular-nums">{stage.completedHours}/{stage.targetHours}h</span>
                          </div>
                        )}

                        {/* Skills + evaluation */}
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          {stage.studentSkills.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {stage.studentSkills.slice(0, 4).map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                              {stage.studentSkills.length > 4 && <Badge variant="secondary" className="text-[10px]">+{stage.studentSkills.length - 4}</Badge>}
                            </div>
                          )}
                          {stage.supervisorRating && (
                            <span className="flex items-center gap-1">{renderStars(stage.supervisorRating)}</span>
                          )}
                          {stage.supervisorWouldHire && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[10px]">
                              <ThumbsUp className="h-3 w-3 mr-0.5" />{t('wouldHire')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              </motion.div>
            )
          })}

          {stages.length === 0 && (
            <GlassCard delay={0.1}>
              <div className="p-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-lg">{t('noStages')}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{t('noStagesHint')}</p>
                <Button className="mt-4" onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />{t('addStage')}
                </Button>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  )
}
