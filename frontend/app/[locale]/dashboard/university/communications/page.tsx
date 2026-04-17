'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Send, Users, Building2, GraduationCap, Filter, CheckCircle,
  Loader2, Mail, Clock, AlertCircle, MessageSquare
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { useInstitution } from '@/lib/institution-context'

interface Audiences {
  students: {
    total: number
    verified: number
    byDegree: Array<{ degree: string; count: number }>
    byYear: Array<{ year: string; count: number }>
  }
  companies: {
    total: number
    list: string[]
  }
}

interface SentMessage {
  id: string
  subject: string
  recipient: string
  sentAt: string
  read: boolean
}

export default function CommunicationsPage() {
  const t = useTranslations('universityCommunications')
  const inst = useInstitution()
  const [audiences, setAudiences] = useState<Audiences | null>(null)
  const [filters, setFilters] = useState<{ degrees: string[]; gradYears: string[] }>({ degrees: [], gradYears: [] })
  const [history, setHistory] = useState<SentMessage[]>([])
  const [loading, setLoading] = useState(true)

  // Compose state
  const [audience, setAudience] = useState<'students' | 'companies'>('students')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [degreeFilter, setDegreeFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; total: number } | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/communications')
      if (res.ok) {
        const data = await res.json()
        setAudiences(data.audiences)
        setFilters(data.filters)
        setHistory(data.history)
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const recipientCount = () => {
    if (!audiences) return 0
    if (audience === 'companies') return audiences.companies.total
    let count = audiences.students.total
    if (degreeFilter) {
      const match = audiences.students.byDegree.find(d => d.degree === degreeFilter)
      count = match ? match.count : 0
    }
    if (yearFilter) {
      const match = audiences.students.byYear.find(y => y.year === yearFilter)
      if (match) count = Math.min(count, match.count)
    }
    return count
  }

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) return
    setSending(true)
    setSendError(null)
    setSendResult(null)
    try {
      const body: any = { audience, subject, content, filters: {} }
      if (audience === 'students') {
        if (degreeFilter) body.filters.degree = degreeFilter
        if (yearFilter) body.filters.graduationYear = yearFilter
      }
      const res = await fetch('/api/dashboard/university/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult({ sent: data.sent, total: data.total })
        setSubject('')
        setContent('')
        await fetchData()
      } else {
        setSendError(data.error || t('sendError'))
      }
    } catch {
      setSendError(t('sendError'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="dark">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
          <p className="text-white/60 mt-1">{t('subtitle')}</p>
        </div>
      </MetricHero>

      {/* Audience stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label={inst.studentsLabel} value={audiences?.students.total || 0} icon={<GraduationCap className="h-5 w-5" />} variant="blue" />
        <StatCard label={t('verifiedStudents')} value={audiences?.students.verified || 0} icon={<CheckCircle className="h-5 w-5" />} variant="green" />
        <StatCard label={inst.employersLabel} value={audiences?.companies.total || 0} icon={<Building2 className="h-5 w-5" />} variant="purple" />
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compose">{t('tabs.compose')}</TabsTrigger>
          <TabsTrigger value="history">{t('tabs.history')}</TabsTrigger>
        </TabsList>

        {/* Compose */}
        <TabsContent value="compose" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Message form */}
            <GlassCard delay={0.1} hover={false}>
              <div className="p-6 space-y-5">
                {/* Audience selector */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t('sendTo')}</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={audience === 'students' ? 'default' : 'outline'}
                      onClick={() => setAudience('students')}
                      className="flex-1"
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />{inst.studentsLabel}
                    </Button>
                    <Button
                      variant={audience === 'companies' ? 'default' : 'outline'}
                      onClick={() => setAudience('companies')}
                      className="flex-1"
                    >
                      <Building2 className="h-4 w-4 mr-2" />{inst.employersLabel}
                    </Button>
                  </div>
                </div>

                {/* Student filters */}
                {audience === 'students' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t('filterDegree')}</Label>
                      <Select value={degreeFilter} onValueChange={setDegreeFilter}>
                        <SelectTrigger><SelectValue placeholder={t('allDegrees')} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('allDegrees')}</SelectItem>
                          {filters.degrees.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t('filterYear')}</Label>
                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger><SelectValue placeholder={t('allYears')} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('allYears')}</SelectItem>
                          {filters.gradYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-2">
                  <Label>{t('subject')}</Label>
                  <Input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder={t('subjectPlaceholder')}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>{t('message')}</Label>
                  <Textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={t('messagePlaceholder')}
                    rows={6}
                  />
                </div>

                {/* Errors and results */}
                {sendError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />{sendError}
                  </div>
                )}
                {sendResult && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    {t('sendSuccess', { sent: sendResult.sent, total: sendResult.total })}
                  </div>
                )}

                {/* Send button */}
                <Button
                  onClick={handleSend}
                  disabled={sending || !subject.trim() || !content.trim()}
                  size="lg"
                  className="w-full"
                >
                  {sending ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
                  {sending ? t('sending') : t('send', { count: recipientCount() })}
                </Button>
              </div>
            </GlassCard>

            {/* Audience preview sidebar */}
            <div className="space-y-4">
              <GlassCard delay={0.15}>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">{t('audiencePreview')}</h3>
                  </div>
                  <div className="text-3xl font-bold">{recipientCount()}</div>
                  <p className="text-xs text-muted-foreground">{t('recipients')}</p>

                  {audience === 'students' && audiences && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">{t('byDegree')}</p>
                      {audiences.students.byDegree.slice(0, 6).map(d => (
                        <div key={d.degree} className="flex items-center justify-between text-sm">
                          <span className="truncate">{d.degree}</span>
                          <Badge variant="secondary" className="text-xs ml-2">{d.count}</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {audience === 'companies' && audiences && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">{t('companiesReached')}</p>
                      {audiences.companies.list.slice(0, 8).map(c => (
                        <div key={c} className="flex items-center gap-2 text-sm">
                          <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{c}</span>
                        </div>
                      ))}
                      {audiences.companies.list.length > 8 && (
                        <p className="text-xs text-muted-foreground">+{audiences.companies.list.length - 8} {t('more')}</p>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard delay={0.2} gradient="amber">
                <div className="p-5 space-y-2">
                  <h3 className="font-semibold text-sm">{t('tips.title')}</h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li>{t('tips.tip1')}</li>
                    <li>{t('tips.tip2')}</li>
                    <li>{t('tips.tip3')}</li>
                  </ul>
                </div>
              </GlassCard>
            </div>
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <GlassCard delay={0.1} hover={false}>
            <div className="p-6">
              <h3 className="font-semibold mb-4">{t('historyTitle')}</h3>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">{t('noHistory')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center gap-4 p-3 rounded-xl border hover:bg-muted/30 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.read ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{msg.subject}</p>
                        <p className="text-xs text-muted-foreground">{msg.recipient}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">{new Date(msg.sentAt).toLocaleDateString()}</p>
                        <Badge variant={msg.read ? 'default' : 'secondary'} className="text-[10px]">
                          {msg.read ? t('read') : t('unread')}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
