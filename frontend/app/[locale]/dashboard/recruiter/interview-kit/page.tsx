'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ClipboardList, Loader2, Sparkles, Copy, Check, FileText, Briefcase } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import ReactMarkdown from 'react-markdown'

interface Job {
  id: string
  title: string
  jobType: string
  status: string
}

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
          jobId: selectedJob || null,
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

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="primary">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/20">
            <ClipboardList className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
      </MetricHero>

      {/* Configuration */}
      <GlassCard delay={0.1}>
        <div className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('selectJob')}</Label>
              {jobsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectJobPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">{t('customRole')}</SelectItem>
                    {jobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.title}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t('additionalContext')}</Label>
              <Textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder={t('contextPlaceholder')}
                rows={2}
              />
            </div>
          </div>
          <Button onClick={generateKit} disabled={loading || (!selectedJob && !customPrompt)}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? t('generating') : t('generate')}
          </Button>
        </div>
      </GlassCard>

      {/* Loading */}
      {loading && (
        <GlassCard delay={0.1} hover={false}>
          <div className="p-8 text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">{t('generatingMessage')}</p>
          </div>
        </GlassCard>
      )}

      {/* Kit Result */}
      {kit && !loading && (
        <GlassCard delay={0.1} hover={false}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('resultTitle')}</h3>
              </div>
              <Button variant="outline" size="sm" onClick={copyKit}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? t('copied') : t('copy')}
              </Button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{kit}</ReactMarkdown>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Empty State */}
      {!kit && !loading && (
        <GlassCard delay={0.15}>
          <div className="p-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg">{t('emptyTitle')}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{t('emptyDescription')}</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
