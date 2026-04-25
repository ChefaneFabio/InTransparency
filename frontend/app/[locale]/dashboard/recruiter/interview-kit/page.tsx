'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ClipboardList, Loader2, Sparkles, Copy, Check, FileText,
  Briefcase, MessageSquare, Users, Target, AlertTriangle,
  HelpCircle, CheckCircle
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { SimpleMarkdown } from '@/components/ui/simple-markdown'

interface Job {
  id: string
  title: string
  jobType: string
  status: string
}

const KIT_SECTIONS = [
  { icon: MessageSquare, label: 'Screening', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40' },
  { icon: Target, label: 'Technical', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40' },
  { icon: Users, label: 'Behavioral', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40' },
  { icon: CheckCircle, label: 'Culture Fit', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40' },
  { icon: ClipboardList, label: 'Rubric', color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/40' },
  { icon: AlertTriangle, label: 'Red Flags', color: 'text-red-600 bg-red-100 dark:bg-red-900/40' },
  { icon: HelpCircle, label: 'Closing', color: 'text-slate-600 bg-slate-100 dark:bg-slate-900/40' },
]

export default function InterviewKitPage() {
  const t = useTranslations('interviewKit')
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [kit, setKit] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs?own=true&limit=50')
        if (res.ok) {
          const data = await res.json()
          setJobs(data.jobs || [])
        }
      } catch { /* silent */ }
      finally { setJobsLoading(false) }
    }
    fetchJobs()
  }, [])

  const generateKit = async () => {
    setLoading(true)
    setKit(null)
    try {
      const res = await fetch('/api/dashboard/recruiter/interview-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob && selectedJob !== 'custom' ? selectedJob : null,
          customPrompt: customPrompt || null,
        }),
      })
      const data = await res.json()
      if (res.ok) setKit(data.kit)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const copyKit = async () => {
    if (!kit) return
    await navigator.clipboard.writeText(kit)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedJobTitle = jobs.find(j => j.id === selectedJob)?.title

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="companyDark">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-white/10"
          >
            <ClipboardList className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
            <p className="text-white/60 mt-1">{t('subtitle')}</p>
          </div>
        </div>
      </MetricHero>

      {/* What's included */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
      >
        {KIT_SECTIONS.map((section, i) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700/30"
          >
            <div className={`p-2 rounded-xl ${section.color}`}>
              <section.icon className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-medium text-center">{section.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Configuration */}
      <GlassCard delay={0.15} gradient="purple">
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">{t('selectJob')}</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t('selectJob')}</Label>
              {jobsLoading ? (
                <Skeleton className="h-11 w-full rounded-xl" />
              ) : (
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder={t('selectJobPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">
                      <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        {t('customRole')}
                      </span>
                    </SelectItem>
                    {jobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 text-primary" />
                          {job.title}
                          <Badge variant="outline" className="ml-1 text-[10px]">{job.status}</Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t('additionalContext')}</Label>
              <Textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder={t('contextPlaceholder')}
                rows={2}
                className="rounded-xl"
              />
            </div>
          </div>

          <Button
            onClick={generateKit}
            disabled={loading || (!selectedJob && !customPrompt)}
            size="lg"
            className="rounded-xl shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Sparkles className="h-5 w-5 mr-2" />}
            {loading ? t('generating') : t('generate')}
            {selectedJobTitle && !loading && (
              <Badge variant="secondary" className="ml-2 font-normal">{selectedJobTitle}</Badge>
            )}
          </Button>
        </div>
      </GlassCard>

      {/* Loading animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard delay={0} hover={false}>
              <div className="p-12 text-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center"
                >
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </motion.div>
                <div>
                  <p className="font-semibold">{t('generating')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('generatingMessage')}</p>
                </div>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [1, 2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 h-4 rounded-full bg-primary/40"
                    />
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kit Result */}
      <AnimatePresence>
        {kit && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard delay={0} hover={false} gradient="green">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">{t('resultTitle')}</h3>
                      {selectedJobTitle && (
                        <p className="text-xs text-muted-foreground">{selectedJobTitle}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyKit} className="rounded-xl">
                    {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-600" /> : <Copy className="h-4 w-4 mr-1.5" />}
                    {copied ? t('copied') : t('copy')}
                  </Button>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none bg-white/60 dark:bg-slate-800/60 rounded-2xl p-6 border [&_h2]:text-lg [&_h2]:font-bold [&_h2]:border-b [&_h2]:pb-2 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2:first-child]:mt-0 [&_h3]:text-base [&_h3]:font-semibold [&_ol]:my-3 [&_ul]:my-3 [&_li]:my-1 [&_strong]:text-foreground">
                  <SimpleMarkdown content={kit} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!kit && !loading && (
        <GlassCard delay={0.2}>
          <div className="p-16 text-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center mb-6 border border-purple-200/50"
            >
              <ClipboardList className="h-10 w-10 text-purple-600" />
            </motion.div>
            <h3 className="text-xl font-bold">{t('emptyTitle')}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">{t('emptyDescription')}</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
