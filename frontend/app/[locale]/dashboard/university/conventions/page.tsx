'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Search, FileSignature, Plus, Building2, Users, Calendar,
  Clock, CheckCircle, AlertCircle, Loader2, FileText,
  Send, PenTool, Shield
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { useInstitution } from '@/lib/institution-context'
import PremiumBadge from '@/components/shared/PremiumBadge'

interface Convention {
  id: string
  companyName: string
  companyContact: string | null
  companyEmail: string | null
  studentName: string | null
  conventionType: string
  objectives: string | null
  department: string | null
  totalHours: number | null
  startDate: string | null
  endDate: string | null
  status: string
  signedByUniversity: boolean
  signedByCompany: boolean
  signedByStudent: boolean
  documentUrl: string | null
  createdAt: string
}

interface Stats {
  total: number; draft: number; pending: number; active: number; completed: number; expired: number
}

const statusConfig: Record<string, { color: string; icon: typeof FileText }> = {
  DRAFT: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: FileText },
  PENDING_SIGNATURES: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: PenTool },
  ACTIVE: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  COMPLETED: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Shield },
  EXPIRED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
  REVOKED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
}

const typeLabels: Record<string, string> = {
  TIROCINIO_CURRICULARE: 'Tirocinio Curriculare',
  TIROCINIO_EXTRACURRICULARE: 'Tirocinio Extracurriculare',
  APPRENDISTATO: 'Apprendistato',
  STAGE_ESTIVO: 'Stage Estivo',
}

export default function ConventionsPage() {
  const t = useTranslations('conventions')
  const inst = useInstitution()
  const [conventions, setConventions] = useState<Convention[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Create form
  const [addOpen, setAddOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [form, setForm] = useState({
    companyName: '', companyContact: '', companyEmail: '', companyVAT: '',
    studentName: '', conventionType: 'TIROCINIO_CURRICULARE',
    objectives: '', department: '', totalHours: '', startDate: '', endDate: '',
    insuranceINAIL: '', ccnlReference: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/dashboard/university/conventions?${params}`)
      if (res.ok) {
        const data = await res.json()
        setConventions(data.conventions)
        setStats(data.stats)
      }
    } catch {}
    finally { setLoading(false) }
  }, [searchTerm, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleCreate = async () => {
    if (!form.companyName) { setAddError(t('form.companyRequired')); return }
    setAddLoading(true); setAddError(null)
    try {
      const res = await fetch('/api/dashboard/university/conventions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setAddOpen(false)
        setForm({ companyName: '', companyContact: '', companyEmail: '', companyVAT: '', studentName: '', conventionType: 'TIROCINIO_CURRICULARE', objectives: '', department: '', totalHours: '', startDate: '', endDate: '', insuranceINAIL: '', ccnlReference: '' })
        await fetchData()
      } else {
        const data = await res.json()
        setAddError(data.error || t('form.error'))
      }
    } catch { setAddError(t('form.error')) }
    finally { setAddLoading(false) }
  }

  const SignatureIndicator = ({ signed, label }: { signed: boolean; label: string }) => (
    <span className={`flex items-center gap-1 text-xs ${signed ? 'text-emerald-600' : 'text-muted-foreground/40'}`}>
      {signed ? <CheckCircle className="h-3 w-3" /> : <PenTool className="h-3 w-3" />}
      {label}
    </span>
  )

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="institutionDark">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
            <p className="text-white/60 mt-1">{t('subtitle')}</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Plus className="h-4 w-4 mr-2" />{t('create')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {t('form.title')}
                  <PremiumBadge audience="institution" variant="chip" label="AI · Premium" />
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Free Core: standard ministerial template. Premium: AI-personalized convention with company-specific clauses, INAIL/CCNL auto-fill, and bulk export.
                </p>
              </DialogHeader>
              <div className="space-y-5 pt-2">
                {/* Company section */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />{t('form.company')}</h4>
                  <div className="grid gap-3 grid-cols-2">
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.companyName')} *</Label><Input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} placeholder="Brembo S.p.A." /></div>
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.companyVAT')}</Label><Input value={form.companyVAT} onChange={e => setForm(f => ({ ...f, companyVAT: e.target.value }))} placeholder="IT01234567890" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.companyContact')}</Label><Input value={form.companyContact} onChange={e => setForm(f => ({ ...f, companyContact: e.target.value }))} placeholder={t('form.legalRep')} /></div>
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.companyEmail')}</Label><Input type="email" value={form.companyEmail} onChange={e => setForm(f => ({ ...f, companyEmail: e.target.value }))} placeholder="hr@company.it" /></div>
                  </div>
                </div>

                {/* Student + type */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{t('form.details')}</h4>
                  <div className="grid gap-3 grid-cols-2">
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.student')}</Label><Input value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} placeholder="Marco Colombo" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.type')}</Label>
                      <Select value={form.conventionType} onValueChange={v => setForm(f => ({ ...f, conventionType: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.department')}</Label><Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="R&D" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.totalHours')}</Label><Input type="number" value={form.totalHours} onChange={e => setForm(f => ({ ...f, totalHours: e.target.value }))} placeholder="500" /></div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid gap-3 grid-cols-2">
                  <div className="space-y-1.5"><Label className="text-xs">{t('form.startDate')}</Label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">{t('form.endDate')}</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
                </div>

                {/* Objectives */}
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('form.objectives')}</Label>
                  <Textarea value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))} placeholder={t('form.objectivesPlaceholder')} rows={3} />
                </div>

                {/* Compliance */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />{t('form.compliance')}</h4>
                  <div className="grid gap-3 grid-cols-2">
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.inail')}</Label><Input value={form.insuranceINAIL} onChange={e => setForm(f => ({ ...f, insuranceINAIL: e.target.value }))} placeholder={t('form.inailPlaceholder')} /></div>
                    <div className="space-y-1.5"><Label className="text-xs">{t('form.ccnl')}</Label><Input value={form.ccnlReference} onChange={e => setForm(f => ({ ...f, ccnlReference: e.target.value }))} placeholder={t('form.ccnlPlaceholder')} /></div>
                  </div>
                </div>

                {addError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />{addError}
                  </div>
                )}

                <Button onClick={handleCreate} disabled={addLoading} className="w-full" size="lg">
                  {addLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <FileSignature className="h-5 w-5 mr-2" />}
                  {addLoading ? t('form.creating') : t('form.submit')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </MetricHero>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label={t('stats.total')} value={stats.total} icon={<FileSignature className="h-5 w-5" />} variant="slate" />
          <StatCard label={t('stats.active')} value={stats.active} icon={<CheckCircle className="h-5 w-5" />} variant="slate" />
          <StatCard label={t('stats.pending')} value={stats.pending + stats.draft} icon={<PenTool className="h-5 w-5" />} variant="slate" />
          <StatCard label={t('stats.completed')} value={stats.completed} icon={<Shield className="h-5 w-5" />} variant="slate" />
        </div>
      )}

      {/* Search + filter */}
      <GlassCard delay={0.1}>
        <div className="p-5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('searchPlaceholder')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder={t('allStatuses')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              <SelectItem value="DRAFT">{t('status.draft')}</SelectItem>
              <SelectItem value="PENDING_SIGNATURES">{t('status.pending')}</SelectItem>
              <SelectItem value="ACTIVE">{t('status.active')}</SelectItem>
              <SelectItem value="COMPLETED">{t('status.completed')}</SelectItem>
              <SelectItem value="EXPIRED">{t('status.expired')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Loading */}
      {loading && <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>}

      {/* Convention list */}
      {!loading && (
        <div className="space-y-3">
          {conventions.map((conv, i) => {
            const sc = statusConfig[conv.status] || statusConfig.DRAFT
            const StatusIcon = sc.icon

            return (
              <motion.div key={conv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileSignature className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold">{conv.companyName}</h3>
                          <Badge className={`${sc.color} border-0 text-xs`}><StatusIcon className="h-3 w-3 mr-1" />{t(`status.${conv.status.toLowerCase()}`)}</Badge>
                          <Badge variant="outline" className="text-xs">{typeLabels[conv.conventionType] || conv.conventionType}</Badge>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                          {conv.studentName && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{conv.studentName}</span>}
                          {conv.department && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{conv.department}</span>}
                          {conv.totalHours && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{conv.totalHours}h</span>}
                          {conv.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(conv.startDate).toLocaleDateString()}
                              {conv.endDate && ` — ${new Date(conv.endDate).toLocaleDateString()}`}
                            </span>
                          )}
                        </div>

                        {conv.objectives && <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{conv.objectives}</p>}

                        {/* Signature status */}
                        <div className="flex items-center gap-4 mt-3">
                          <SignatureIndicator signed={conv.signedByUniversity} label={t('signatures.university')} />
                          <SignatureIndicator signed={conv.signedByCompany} label={t('signatures.company')} />
                          <SignatureIndicator signed={conv.signedByStudent} label={t('signatures.student')} />
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <p className="text-xs text-muted-foreground">{t('created')}</p>
                        <p className="text-sm">{new Date(conv.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {conventions.length === 0 && (
            <GlassCard delay={0.1}>
              <div className="p-12 text-center">
                <FileSignature className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg">{t('empty')}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{t('emptyHint')}</p>
                <Button className="mt-4" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-2" />{t('create')}</Button>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  )
}
