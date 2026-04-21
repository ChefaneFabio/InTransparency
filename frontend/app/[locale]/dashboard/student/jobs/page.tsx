'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Loader2, MapPin, Briefcase, Building2, ArrowRight, Filter, Bookmark, BookmarkCheck } from 'lucide-react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface JobData {
  id: string; title: string; companyName: string; location: string | null
  jobType: string; workLocation: string; requiredSkills: string[]; matchScore?: number
}

export default function StudentJobsPage() {
  const t = useTranslations('studentJobs')
  const [jobs, setJobs] = useState<JobData[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [jobType, setJobType] = useState('all')
  const [workMode, setWorkMode] = useState('all')
  const [location, setLocation] = useState('')
  const [profileSkills, setProfileSkills] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [jobsRes, recsRes, savedRes] = await Promise.all([
        fetch('/api/dashboard/student/jobs'),
        fetch('/api/dashboard/student/recommendations?limit=5'),
        fetch('/api/dashboard/student/saved-jobs'),
      ])
      if (jobsRes.ok) {
        const data = await jobsRes.json()
        setJobs(data.jobs || [])
        setProfileSkills(data.profileSkills || [])
      }
      if (recsRes.ok) {
        const data = await recsRes.json()
        setRecommendations(data.recommendations || [])
      }
      if (savedRes.ok) {
        const data = await savedRes.json()
        setSavedIds(new Set((data.savedJobs || []).map((s: any) => s.job.id)))
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  const toggleSave = async (jobId: string) => {
    const wasSaved = savedIds.has(jobId)
    // Optimistic
    const next = new Set(savedIds)
    if (wasSaved) next.delete(jobId)
    else next.add(jobId)
    setSavedIds(next)
    try {
      if (wasSaved) {
        await fetch(`/api/dashboard/student/saved-jobs?jobId=${encodeURIComponent(jobId)}`, { method: 'DELETE' })
      } else {
        await fetch('/api/dashboard/student/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId }),
        })
      }
    } catch {
      // Roll back
      setSavedIds(savedIds)
    }
  }

  useEffect(() => { fetchData() }, [fetchData])

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await fetch('/api/dashboard/student/ai-job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs || data.results || [])
      }
    } catch { /* silent */ }
    finally { setSearching(false) }
  }

  const filtered = jobs.filter(job => {
    if (showSavedOnly && !savedIds.has(job.id)) return false
    if (jobType !== 'all' && job.jobType !== jobType) return false
    if (workMode !== 'all' && job.workLocation !== workMode) return false
    if (location && job.location && !job.location.toLowerCase().includes(location.toLowerCase())) return false
    return true
  })

  const typeLabels: Record<string, string> = {
    FULL_TIME: t('filters.fullTime'), PART_TIME: t('filters.partTime'),
    INTERNSHIP: t('filters.internship'), CONTRACT: t('filters.contract'), FREELANCE: t('filters.freelance'),
  }
  const modeLabels: Record<string, string> = {
    REMOTE: t('filters.remote'), HYBRID: t('filters.hybrid'), ON_SITE: t('filters.onSite'), ONSITE: t('filters.onSite'),
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <MetricHero gradient="blue">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {filtered.length} {t('available')}</span>
          </div>
        </div>
      </MetricHero>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Search */}
          <GlassCard delay={0.1}>
            <div className="p-5">
              <div className="flex gap-2">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch() } }}
                  placeholder={t('searchPlaceholder')}
                  rows={2}
                  className="resize-none flex-1"
                />
                <Button onClick={handleSearch} disabled={searching || !query.trim()} className="self-end">
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <GlassCard delay={0.15} gradient="blue">
              <div className="p-5">
                <h2 className="font-semibold text-sm mb-3">{t('recommended')}</h2>
                <div className="space-y-2">
                  {recommendations.map((rec: any) => (
                    <div key={rec.jobId} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{rec.matchScore}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{rec.title}</p>
                        <p className="text-xs text-muted-foreground">{rec.companyName}{rec.location ? ` · ${rec.location}` : ''}</p>
                        {rec.matchedSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.matchedSkills.slice(0, 3).map((s: string) => (
                              <span key={s} className="text-[9px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/student/apply/${rec.jobId}`}><ArrowRight className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Job Listings */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <GlassCard delay={0.2}>
              <div className="p-10 text-center">
                <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-sm">{t('empty')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('emptyDesc')}</p>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{t('results', { count: filtered.length })}</p>
              {filtered.map((job) => (
                <Card key={job.id} className="hover:shadow-md hover:border-primary/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{job.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.companyName}</span>
                          {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-[10px]">{typeLabels[job.jobType] || job.jobType}</Badge>
                          <Badge variant="outline" className="text-[10px]">{modeLabels[job.workLocation] || job.workLocation}</Badge>
                          {job.requiredSkills.slice(0, 3).map(s => (
                            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {job.matchScore && <span className="text-xs font-semibold text-primary">{job.matchScore}%</span>}
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSave(job.id)}
                            aria-label={savedIds.has(job.id) ? 'Rimuovi dai salvati' : 'Salva opportunità'}
                          >
                            {savedIds.has(job.id)
                              ? <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                              : <Bookmark className="h-3.5 w-3.5" />}
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/student/apply/${job.id}`}>{t('apply')}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Saved jobs */}
          <GlassCard delay={0.18}>
            <button
              onClick={() => setShowSavedOnly(v => !v)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookmarkCheck className={`h-4 w-4 ${showSavedOnly ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <div className="font-semibold text-sm">Opportunità salvate</div>
                  <div className="text-xs text-muted-foreground">
                    {savedIds.size > 0
                      ? `${savedIds.size} ${savedIds.size === 1 ? 'salvata' : 'salvate'} — ${showSavedOnly ? 'mostra tutto' : 'filtra solo salvate'}`
                      : 'Clicca il segnalibro per salvare'}
                  </div>
                </div>
              </div>
              {savedIds.size > 0 && (
                <Badge variant={showSavedOnly ? 'default' : 'secondary'} className="text-[10px]">
                  {savedIds.size}
                </Badge>
              )}
            </button>
          </GlassCard>

          {/* Filters */}
          <GlassCard delay={0.2}>
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Filter className="h-3.5 w-3.5" />{t('filters.title')}</h3>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder={t('filters.jobType')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="FULL_TIME">{t('filters.fullTime')}</SelectItem>
                  <SelectItem value="PART_TIME">{t('filters.partTime')}</SelectItem>
                  <SelectItem value="INTERNSHIP">{t('filters.internship')}</SelectItem>
                  <SelectItem value="CONTRACT">{t('filters.contract')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={workMode} onValueChange={setWorkMode}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder={t('filters.workMode')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="REMOTE">{t('filters.remote')}</SelectItem>
                  <SelectItem value="HYBRID">{t('filters.hybrid')}</SelectItem>
                  <SelectItem value="ON_SITE">{t('filters.onSite')}</SelectItem>
                </SelectContent>
              </Select>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('filters.location')} className="h-9 text-xs" />
              {(jobType !== 'all' || workMode !== 'all' || location) && (
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => { setJobType('all'); setWorkMode('all'); setLocation('') }}>
                  {t('filters.clear')}
                </Button>
              )}
            </div>
          </GlassCard>

          {/* Your Skills */}
          {profileSkills.length > 0 && (
            <GlassCard delay={0.3}>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2">{t('profileMatch.title')}</h3>
                <p className="text-xs text-muted-foreground mb-2">{t('profileMatch.skills')}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {profileSkills.slice(0, 8).map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                  <Link href="/dashboard/student/profile">{t('profileMatch.updateProfile')}</Link>
                </Button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
