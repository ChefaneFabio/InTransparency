'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2, MapPin, Send, ArrowLeft, CheckCircle, Briefcase,
  Loader2, Shield, GraduationCap,
} from 'lucide-react'
import { Link } from '@/navigation'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface JobData {
  id: string; title: string; companyName: string; location: string | null
  jobType: string; requiredSkills: string[]; preferredSkills: string[]
  description: string; requirements: string | null
}

interface ProfileMatch {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  relevantProjects: Array<{ id: string; title: string; skills: string[]; verified: boolean }>
}

export default function ApplyPage() {
  const t = useTranslations('apply')
  const locale = useLocale()
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string

  const [job, setJob] = useState<JobData | null>(null)
  const [match, setMatch] = useState<ProfileMatch | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [whyThisRole, setWhyThisRole] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, profileRes] = await Promise.all([
          fetch(`/api/jobs/${jobId}`),
          fetch('/api/dashboard/student/profile'),
        ])

        if (jobRes.ok) {
          const jobData = await jobRes.json()
          setJob(jobData.job || jobData)
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json()

          // Compute match locally
          if (job || jobRes.ok) {
            const jobSkills = (jobRes.ok ? (await jobRes.json().catch(() => ({})))?.requiredSkills : job?.requiredSkills) || []
            const studentSkills = new Set(
              (profileData.skills || []).map((s: any) => (s.name || s).toLowerCase())
            )
            const matched = jobSkills.filter((s: string) => studentSkills.has(s.toLowerCase()))
            const missing = jobSkills.filter((s: string) => !studentSkills.has(s.toLowerCase()))

            setMatch({
              matchScore: jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0,
              matchedSkills: matched,
              missingSkills: missing,
              relevantProjects: (profileData.projects || []).slice(0, 5).map((p: any) => ({
                id: p.id, title: p.title, skills: p.skills || [],
                verified: p.verificationStatus === 'VERIFIED',
              })),
            })
          }
        }
      } catch { /* silent */ }
      finally { setLoading(false) }
    }

    // Fetch job first
    fetch(`/api/jobs/${jobId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const jobData = data.job || data
        setJob(jobData)
        return fetch('/api/dashboard/student/profile')
      })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(profileData => {
        const jobSkills = (job?.requiredSkills || []).map((s: string) => s.toLowerCase())
        const studentSkills = new Set(
          (profileData.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name || '').toLowerCase())
        )
        const matched = jobSkills.filter((s: string) => studentSkills.has(s))
        const missing = jobSkills.filter((s: string) => !studentSkills.has(s))

        setMatch({
          matchScore: jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0,
          matchedSkills: matched,
          missingSkills: missing,
          relevantProjects: (profileData.projects || []).slice(0, 5).map((p: any) => ({
            id: p.id, title: p.title, skills: p.skills || [],
            verified: p.verificationStatus === 'VERIFIED',
          })),
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [jobId])

  const handleSubmit = async () => {
    if (!job) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          coverLetter: coverLetter || undefined,
          whyThisRole: whyThisRole || undefined,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        alert(data.error || t('submitFailed'))
      }
    } catch {
      alert(t('submitFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-60 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">{t('jobNotFound')}</p>
        <Button asChild className="mt-4"><Link href="/dashboard/student/jobs">{t('backToJobs')}</Link></Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <GlassCard>
          <div className="p-10">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('submitted')}</h2>
            <p className="text-muted-foreground mb-6">{t('submittedDesc')}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" asChild><Link href="/dashboard/student/applications">{t('viewApplications')}</Link></Button>
              <Button asChild><Link href="/dashboard/student/jobs">{t('browseMore')}</Link></Button>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <MetricHero gradient="primary">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/student/jobs"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.companyName}</span>
              {job.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>}
              <Badge variant="outline" className="text-[10px]">{job.jobType?.replace('_', ' ')}</Badge>
            </div>
          </div>
        </div>
      </MetricHero>

      {/* Match Score */}
      {match && (
        <GlassCard delay={0.1} gradient={match.matchScore >= 60 ? 'green' : match.matchScore >= 30 ? 'blue' : 'amber'}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">{t('yourMatch')}</h2>
              <span className="text-2xl font-bold text-primary">{match.matchScore}%</span>
            </div>
            <Progress value={match.matchScore} className="h-2 mb-4" />

            {match.matchedSkills.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1.5">{t('matchedSkills')}</p>
                <div className="flex flex-wrap gap-1">
                  {match.matchedSkills.map(s => (
                    <Badge key={s} variant="secondary" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {match.missingSkills.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">{t('missingSkills')}</p>
                <div className="flex flex-wrap gap-1">
                  {match.missingSkills.map(s => (
                    <Badge key={s} variant="outline" className="text-[10px] text-amber-700 border-amber-200">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Your Relevant Projects — auto-selected from profile */}
      {match && match.relevantProjects.length > 0 && (
        <GlassCard delay={0.2}>
          <div className="p-5">
            <h2 className="font-semibold text-sm mb-3">{t('yourProjects')}</h2>
            <p className="text-xs text-muted-foreground mb-3">{t('projectsAutoSelected')}</p>
            <div className="space-y-2">
              {match.relevantProjects.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{p.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {p.verified && (
                        <Badge className="text-[9px] bg-green-100 text-green-700 border-0 h-4 px-1">
                          <Shield className="h-2.5 w-2.5 mr-0.5" />{t('verified')}
                        </Badge>
                      )}
                      {p.skills.slice(0, 3).map(s => (
                        <Badge key={s} variant="secondary" className="text-[9px]">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Optional: Cover Letter */}
      <GlassCard delay={0.3}>
        <div className="p-5 space-y-4">
          <div>
            <h2 className="font-semibold text-sm mb-1">{t('whyThisRole')}</h2>
            <p className="text-xs text-muted-foreground mb-2">{t('whyThisRoleHint')}</p>
            <Textarea
              value={whyThisRole}
              onChange={e => setWhyThisRole(e.target.value)}
              placeholder={t('whyThisRolePlaceholder')}
              rows={3}
              className="resize-none"
            />
          </div>
          <div>
            <h2 className="font-semibold text-sm mb-1">{t('coverLetter')}</h2>
            <p className="text-xs text-muted-foreground mb-2">{t('coverLetterHint')}</p>
            <Textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder={t('coverLetterPlaceholder')}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      </GlassCard>

      {/* Submit */}
      <div className="flex gap-3">
        <Button variant="outline" asChild className="flex-1">
          <Link href="/dashboard/student/jobs">{t('cancel')}</Link>
        </Button>
        <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
          {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {submitting ? t('submitting') : t('submit')}
        </Button>
      </div>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground py-2">
        <span className="flex items-center gap-1"><Shield className="h-3 w-3" />{t('trust.verified')}</span>
        <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{t('trust.institutional')}</span>
      </div>
    </div>
  )
}
