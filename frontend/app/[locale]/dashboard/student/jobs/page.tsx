'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Loader2 } from 'lucide-react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'

interface JobData {
  id: string
  title: string
  companyName: string
  location: string | null
  jobType: string
  workLocation: string
  requiredSkills: string[]
  matchScore?: number
}

export default function StudentJobsPage() {
  const t = useTranslations('studentJobs')
  const [jobs, setJobs] = useState<JobData[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [jobType, setJobType] = useState('all')
  const [workMode, setWorkMode] = useState('all')
  const [location, setLocation] = useState('')
  const [profileSkills, setProfileSkills] = useState<string[]>([])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/student/jobs')
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs || [])
        setProfileSkills(data.profileSkills || [])
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

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
    if (jobType !== 'all' && job.jobType !== jobType) return false
    if (workMode !== 'all' && job.workLocation !== workMode) return false
    if (location && job.location && !job.location.toLowerCase().includes(location.toLowerCase())) return false
    return true
  })

  const formatType = (type: string) => {
    const map: Record<string, string> = {
      FULL_TIME: t('filters.fullTime'), PART_TIME: t('filters.partTime'),
      INTERNSHIP: t('filters.internship'), CONTRACT: t('filters.contract'),
    }
    return map[type] || type
  }

  const formatMode = (mode: string) => {
    const map: Record<string, string> = {
      REMOTE: t('filters.remote'), HYBRID: t('filters.hybrid'), ON_SITE: t('filters.onSite'),
    }
    return map[mode] || mode
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">{t('title')}</h1>
      <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Conversational search */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch() } }}
                  placeholder={t('searchPlaceholder')}
                  rows={2}
                  className="resize-none"
                />
                <Button onClick={handleSearch} disabled={searching || !query.trim()} className="w-full sm:w-auto">
                  {searching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                  {searching ? t('searching') : t('search')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="font-medium text-foreground mb-1">{t('empty')}</p>
                <p className="text-sm text-muted-foreground">{t('emptyDesc')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t('results', { count: filtered.length })}</p>
              {filtered.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {job.companyName}
                          {job.location && ` · ${job.location}`}
                          {` · ${formatType(job.jobType)}`}
                          {` · ${formatMode(job.workLocation)}`}
                        </p>
                        {job.requiredSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.requiredSkills.slice(0, 4).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {job.matchScore && (
                          <span className="text-sm font-medium text-primary">{t('match', { score: job.matchScore })}</span>
                        )}
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/student/apply/${job.id}`}>{t('apply')}</Link>
                        </Button>
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
          {/* Filters */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-sm">{t('filters.title')}</h3>

              <div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger><SelectValue placeholder={t('filters.jobType')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.all')}</SelectItem>
                    <SelectItem value="FULL_TIME">{t('filters.fullTime')}</SelectItem>
                    <SelectItem value="PART_TIME">{t('filters.partTime')}</SelectItem>
                    <SelectItem value="INTERNSHIP">{t('filters.internship')}</SelectItem>
                    <SelectItem value="CONTRACT">{t('filters.contract')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={workMode} onValueChange={setWorkMode}>
                  <SelectTrigger><SelectValue placeholder={t('filters.workMode')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.all')}</SelectItem>
                    <SelectItem value="REMOTE">{t('filters.remote')}</SelectItem>
                    <SelectItem value="HYBRID">{t('filters.hybrid')}</SelectItem>
                    <SelectItem value="ON_SITE">{t('filters.onSite')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('filters.location')} />
              </div>

              {(jobType !== 'all' || workMode !== 'all' || location) && (
                <Button variant="ghost" size="sm" onClick={() => { setJobType('all'); setWorkMode('all'); setLocation('') }}>
                  {t('filters.clear')}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Profile match */}
          {profileSkills.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-3">{t('profileMatch.title')}</h3>
                <p className="text-xs text-muted-foreground mb-2">{t('profileMatch.skills')}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {profileSkills.slice(0, 5).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/dashboard/student/profile/edit">{t('profileMatch.updateProfile')}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
