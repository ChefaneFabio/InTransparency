'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Link } from '@/navigation'
import {
  ArrowLeft, Building2, Calendar, Clock, Star, CheckCircle,
  AlertTriangle, Info, Plus, Loader2, MapPin, Mail, User,
  Briefcase, Award, ThumbsUp, TrendingUp, FileText
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Stage {
  id: string; studentName: string; studentEmail: string; studentPhoto: string | null; studentDegree: string | null
  companyName: string; companyIndustry: string | null; role: string; department: string | null
  supervisorName: string | null; supervisorEmail: string | null
  startDate: string; endDate: string | null; targetHours: number | null; completedHours: number
  stageType: string; status: string
  studentDescription: string | null; studentSkills: string[]; studentRating: number | null; studentHighlight: string | null
  supervisorCompleted: boolean; supervisorRating: number | null; supervisorCompetencies: any
  supervisorStrengths: string | null; supervisorImprovements: string | null; supervisorWouldHire: boolean | null
  verified: boolean; verifiedSkills: string[]
}

interface CheckIn {
  id: string; date: string; hoursWorked: number; activity: string | null; location: string | null
  status: string; checkInType: string; supervisorRating: number | null; supervisorNotes: string | null; studentNotes: string | null; verified: boolean
}

interface Alert { type: 'warning' | 'info' | 'success'; messageKey: string; data?: any }

const alertIcons = { warning: AlertTriangle, info: Info, success: CheckCircle }
const alertColors = {
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300',
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300',
}

export default function StageDetailPage() {
  const t = useTranslations('stageDetail')
  const params = useParams()
  const stageId = params.id as string

  const [stage, setStage] = useState<Stage | null>(null)
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [weeklyHours, setWeeklyHours] = useState<Array<{ week: string; hours: number }>>([])
  const [attendance, setAttendance] = useState({ present: 0, absent: 0, late: 0, excused: 0 })
  const [attendanceRate, setAttendanceRate] = useState(0)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const [addOpen, setAddOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], hoursWorked: '', activity: '', location: 'on-site', attendance: 'PRESENT', studentNotes: '' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/university/stages/${stageId}`)
      if (res.ok) {
        const data = await res.json()
        setStage(data.stage)
        setCheckIns(data.checkIns)
        setWeeklyHours(data.weeklyHours)
        setAttendance(data.attendance)
        setAttendanceRate(data.attendanceRate)
        setAlerts(data.alerts)
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [stageId])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAddCheckIn = async () => {
    if (!form.date || !form.hoursWorked) return
    setAddLoading(true)
    try {
      const res = await fetch(`/api/dashboard/university/stages/${stageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setAddOpen(false)
        setForm({ date: new Date().toISOString().split('T')[0], hoursWorked: '', activity: '', location: 'on-site', attendance: 'PRESENT', studentNotes: '' })
        await fetchData()
      }
    } catch { /* silent */ }
    finally { setAddLoading(false) }
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/20'}`} />
        ))}
      </span>
    )
  }

  if (loading) return (
    <div className="min-h-screen space-y-6">
      <Skeleton className="h-40 rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-4">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )

  if (!stage) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">{t('notFound')}</p>
      <Button asChild className="mt-4"><Link href="/dashboard/university/stages"><ArrowLeft className="h-4 w-4 mr-2" />{t('back')}</Link></Button>
    </div>
  )

  const hoursPercent = stage.targetHours ? Math.min(100, Math.round((stage.completedHours / stage.targetHours) * 100)) : 0
  const maxWeekly = Math.max(...weeklyHours.map(w => w.hours), 1)

  return (
    <div className="min-h-screen space-y-6">
      {/* Hero */}
      <MetricHero gradient="dark">
        <div className="flex items-start gap-4">
          <Link href="/dashboard/university/stages">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <Avatar className="h-14 w-14 border-2 border-white/20">
            <AvatarImage src={stage.studentPhoto || ''} />
            <AvatarFallback className="bg-white/10 text-white">{stage.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{stage.studentName}</h1>
            <p className="text-white/60">{stage.role} @ {stage.companyName}</p>
            <div className="flex items-center gap-3 mt-2 text-white/40 text-sm flex-wrap">
              {stage.department && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{stage.department}</span>}
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(stage.startDate).toLocaleDateString()}{stage.endDate && ` — ${new Date(stage.endDate).toLocaleDateString()}`}</span>
              {stage.supervisorName && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{stage.supervisorName}</span>}
            </div>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20"><Plus className="h-4 w-4 mr-2" />{t('addCheckIn')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('checkInForm.title')}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('checkInForm.date')}</Label>
                    <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('checkInForm.hours')}</Label>
                    <Input type="number" step="0.5" placeholder="8" value={form.hoursWorked} onChange={e => setForm(f => ({ ...f, hoursWorked: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('checkInForm.activity')}</Label>
                  <Textarea placeholder={t('checkInForm.activityPlaceholder')} value={form.activity} onChange={e => setForm(f => ({ ...f, activity: e.target.value }))} rows={2} />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('checkInForm.location')}</Label>
                    <Select value={form.location} onValueChange={v => setForm(f => ({ ...f, location: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-site">{t('checkInForm.onSite')}</SelectItem>
                        <SelectItem value="remote">{t('checkInForm.remote')}</SelectItem>
                        <SelectItem value="mixed">{t('checkInForm.mixed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('checkInForm.attendance')}</Label>
                    <Select value={form.attendance} onValueChange={v => setForm(f => ({ ...f, attendance: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRESENT">{t('checkInForm.present')}</SelectItem>
                        <SelectItem value="LATE">{t('checkInForm.late')}</SelectItem>
                        <SelectItem value="ABSENT">{t('checkInForm.absent')}</SelectItem>
                        <SelectItem value="EXCUSED">{t('checkInForm.excused')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('checkInForm.notes')}</Label>
                  <Textarea placeholder={t('checkInForm.notesPlaceholder')} value={form.studentNotes} onChange={e => setForm(f => ({ ...f, studentNotes: e.target.value }))} rows={2} />
                </div>
                <Button onClick={handleAddCheckIn} disabled={addLoading || !form.hoursWorked} className="w-full">
                  {addLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  {t('checkInForm.submit')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </MetricHero>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => {
            const Icon = alertIcons[alert.type]
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 p-4 rounded-xl border ${alertColors[alert.type]}`}>
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t(`alerts.${alert.messageKey}`, alert.data || {})}</span>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Progress cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <GlassCard delay={0.1}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{t('progress.hours')}</span>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{stage.completedHours}<span className="text-sm text-muted-foreground font-normal">/{stage.targetHours || '?'}h</span></p>
            <Progress value={hoursPercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">{hoursPercent}% {t('progress.complete')}</p>
          </div>
        </GlassCard>
        <GlassCard delay={0.15}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{t('progress.attendance')}</span>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{attendanceRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">{attendance.present} {t('progress.present')} / {checkIns.length} {t('progress.total')}</p>
          </div>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{t('progress.checkIns')}</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{checkIns.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('progress.logged')}</p>
          </div>
        </GlassCard>
        <GlassCard delay={0.25}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{t('progress.supervisorRating')}</span>
              <Star className="h-4 w-4 text-muted-foreground" />
            </div>
            {stage.supervisorRating ? (
              <div>{renderStars(stage.supervisorRating)}<p className="text-xs text-muted-foreground mt-1">{stage.supervisorRating}/5</p></div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('progress.pending')}</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Weekly hours chart */}
      {weeklyHours.length > 0 && (
        <GlassCard delay={0.15}>
          <div className="p-5">
            <h3 className="font-semibold mb-4">{t('weeklyChart')}</h3>
            <div className="flex items-end gap-1 h-32">
              {weeklyHours.map((w, i) => (
                <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground tabular-nums">{w.hours}h</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(w.hours / maxWeekly) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    className="w-full bg-primary/70 rounded-t min-h-[2px]"
                  />
                  <span className="text-[9px] text-muted-foreground">{w.week.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Check-in timeline */}
        <GlassCard delay={0.2} hover={false}>
          <div className="p-5">
            <h3 className="font-semibold mb-4">{t('timeline')}</h3>
            {checkIns.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">{t('noCheckIns')}</p>
                <Button size="sm" className="mt-3" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1" />{t('addCheckIn')}</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {checkIns.map((ci, i) => (
                  <motion.div key={ci.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex gap-3 p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0 text-center">
                      <span className="text-xs font-medium">{new Date(ci.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</span>
                      <Badge variant={ci.status === 'PRESENT' ? 'default' : ci.status === 'ABSENT' ? 'destructive' : 'secondary'} className="text-[9px] px-1">
                        {ci.status === 'PRESENT' ? 'P' : ci.status === 'ABSENT' ? 'A' : ci.status === 'LATE' ? 'R' : 'G'}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{ci.hoursWorked}h</span>
                        {ci.location && <Badge variant="outline" className="text-[10px]">{ci.location}</Badge>}
                        {ci.checkInType !== 'DAILY' && <Badge className="text-[10px] bg-purple-100 text-purple-700 border-0">{ci.checkInType}</Badge>}
                        {ci.supervisorRating && <span className="ml-auto">{renderStars(ci.supervisorRating)}</span>}
                      </div>
                      {ci.activity && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ci.activity}</p>}
                      {ci.studentNotes && <p className="text-xs text-muted-foreground/70 mt-1 italic">{ci.studentNotes}</p>}
                      {ci.supervisorNotes && <p className="text-xs text-primary/80 mt-1">{t('supervisorNote')}: {ci.supervisorNotes}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Sidebar: evaluation + student info */}
        <div className="space-y-4">
          {/* Supervisor evaluation */}
          <GlassCard delay={0.25}>
            <div className="p-5 space-y-3">
              <h3 className="font-semibold text-sm">{t('supervisorEval')}</h3>
              {stage.supervisorCompleted ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('overallRating')}</span>
                    {renderStars(stage.supervisorRating)}
                  </div>
                  {stage.supervisorStrengths && (
                    <div><p className="text-xs text-muted-foreground mb-1">{t('strengths')}</p><p className="text-sm">{stage.supervisorStrengths}</p></div>
                  )}
                  {stage.supervisorImprovements && (
                    <div><p className="text-xs text-muted-foreground mb-1">{t('improvements')}</p><p className="text-sm">{stage.supervisorImprovements}</p></div>
                  )}
                  {stage.supervisorWouldHire !== null && (
                    <div className="flex items-center gap-2">
                      <ThumbsUp className={`h-4 w-4 ${stage.supervisorWouldHire ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                      <span className="text-sm">{stage.supervisorWouldHire ? t('wouldHireYes') : t('wouldHireNo')}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t('evalPending')}</p>
              )}
            </div>
          </GlassCard>

          {/* Student self-assessment */}
          {(stage.studentHighlight || stage.studentSkills.length > 0) && (
            <GlassCard delay={0.3}>
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-sm">{t('studentAssessment')}</h3>
                {stage.studentHighlight && <p className="text-sm">{stage.studentHighlight}</p>}
                {stage.studentSkills.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {stage.studentSkills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                  </div>
                )}
                {stage.studentRating && <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{t('selfRating')}:</span>{renderStars(stage.studentRating)}</div>}
              </div>
            </GlassCard>
          )}

          {/* Verified skills */}
          {stage.verified && stage.verifiedSkills.length > 0 && (
            <GlassCard delay={0.35} gradient="green">
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-sm">{t('verifiedSkills')}</h3>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {stage.verifiedSkills.map(s => <Badge key={s} className="bg-emerald-100 text-emerald-700 border-0 text-xs">{s}</Badge>)}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
