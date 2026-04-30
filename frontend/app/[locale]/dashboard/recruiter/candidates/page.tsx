'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  Eye,
  MapPin,
  Code,
  Mail,
  Bookmark,
  Grid3X3,
  List,
  Users,
  Award,
  Plus,
  GraduationCap,
  CheckCircle,
  ArrowLeft,
  Download,
  Briefcase,
  X,
  Sparkles,
  ChevronDown,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { exportCandidatesToCsv } from '@/lib/export-csv'
import { useTranslations, useLocale } from 'next-intl'

const DISCIPLINE_KEYS = [
  { value: 'all', key: 'allDisciplines' },
  { value: 'TECHNOLOGY', key: 'technology' },
  { value: 'BUSINESS', key: 'business' },
  { value: 'DESIGN', key: 'design' },
  { value: 'HEALTHCARE', key: 'healthcare' },
  { value: 'ENGINEERING', key: 'engineering' },
  { value: 'TRADES', key: 'skilledTrades' },
  { value: 'ARCHITECTURE', key: 'architecture' },
  { value: 'MEDIA', key: 'filmMedia' },
  { value: 'WRITING', key: 'writing' },
  { value: 'SOCIAL_SCIENCES', key: 'socialSciences' },
  { value: 'ARTS', key: 'arts' },
  { value: 'LAW', key: 'law' },
  { value: 'EDUCATION', key: 'education' },
  { value: 'SCIENCE', key: 'science' },
  { value: 'OTHER', key: 'other' }
]

interface MatchFactorLite {
  name: string
  weight: number
  contribution: number
  value: string | number
  evidence?: Array<{ type: string; label: string; detail?: string }>
  humanReason?: string
}

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string | null
  university: string
  degree: string
  graduationYear: string
  photo: string | null
  bio: string | null
  availableFor: 'HIRING' | 'PROJECTS' | 'BOTH'
  projects: {
    id: string
    title: string
    discipline: string
    innovationScore: number | null
    universityVerified: boolean
  }[]
  _count: {
    projects: number
  }
  match?: {
    matchScore: number
    decisionLabel: 'STRONG_MATCH' | 'MATCH' | 'WEAK_MATCH' | 'NO_MATCH'
    matchedSkills: string[]
    missingSkills: string[]
    matchedPreferred: string[]
    verifiedCount: number
    totalProjects: number
    factors: MatchFactorLite[]
  } | null
}

interface OutreachTemplateOption {
  id: string
  name: string
  stepCount: number
}

function StartOutreachAction({
  candidateId,
  templates,
  onStarted,
}: {
  candidateId: string
  templates: OutreachTemplateOption[]
  onStarted?: () => void
}) {
  const locale = useLocale()
  const isIt = locale === 'it'
  const [busyId, setBusyId] = useState<string | null>(null)
  const [result, setResult] = useState<'ok' | 'err' | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const start = async (templateId: string) => {
    setBusyId(templateId)
    setResult(null)
    try {
      const res = await fetch('/api/dashboard/recruiter/outreach/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, templateId }),
      })
      if (res.ok) {
        setResult('ok')
        onStarted?.()
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.error || `HTTP ${res.status}`)
        setResult('err')
      }
    } catch (err: any) {
      setErrorMsg(err?.message || (isIt ? 'Errore di rete' : 'Network error'))
      setResult('err')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" title={isIt ? 'Avvia una sequenza di outreach' : 'Start an outreach sequence'}>
          <Send className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-3 border-b">
          <div className="text-sm font-semibold">{isIt ? 'Avvia sequenza outreach' : 'Start outreach sequence'}</div>
          <p className="text-xs text-muted-foreground">{isIt ? 'Scegli un template. Lo step 1 parte al prossimo cron tick.' : 'Pick a template. Step 1 goes out on the next cron tick.'}</p>
        </div>
        <div className="p-2 max-h-72 overflow-y-auto">
          {templates.length === 0 ? (
            <div className="p-3 text-xs text-muted-foreground">
              {isIt ? 'Nessun template ancora.' : 'No templates yet.'}{' '}
              <Link href="/dashboard/recruiter/outreach" className="text-primary underline">
                {isIt ? 'Creane uno' : 'Create one'}
              </Link>
              .
            </div>
          ) : (
            templates.map(t => (
              <button
                key={t.id}
                disabled={!!busyId}
                onClick={() => start(t.id)}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-muted/60 flex items-center justify-between gap-2 text-xs disabled:opacity-60"
              >
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-muted-foreground text-[11px]">{t.stepCount} {isIt ? 'step' : 'steps'}</div>
                </div>
                {busyId === t.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                ) : (
                  <Send className="h-3.5 w-3.5 opacity-60" />
                )}
              </button>
            ))
          )}
        </div>
        {result === 'ok' && (
          <div className="p-3 border-t bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> {isIt ? 'Sequenza avviata.' : 'Sequence started.'}
          </div>
        )}
        {result === 'err' && (
          <div className="p-3 border-t bg-red-50 text-red-800 text-xs">{isIt ? 'Errore' : 'Failed'}: {errorMsg}</div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function MatchScoreBadge({ match }: { match: NonNullable<Candidate['match']> }) {
  const locale = useLocale()
  const isIt = locale === 'it'
  const s = match.matchScore
  // Quiet match-score chip — bordered, not filled. Color signals tier subtly.
  const tone =
    s >= 80 ? { bg: 'bg-card', text: 'text-emerald-700 dark:text-emerald-400', ring: 'ring-emerald-300/60' } :
    s >= 60 ? { bg: 'bg-card', text: 'text-blue-700 dark:text-blue-400', ring: 'ring-blue-300/60' } :
    s >= 40 ? { bg: 'bg-card', text: 'text-amber-700 dark:text-amber-400', ring: 'ring-amber-300/60' } :
              { bg: 'bg-card', text: 'text-muted-foreground', ring: 'ring-border' }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${tone.bg} ${tone.text} ${tone.ring} text-xs font-semibold hover:ring-2 transition-all`}
          title={isIt ? 'Clicca per vedere i fattori di match' : 'Click to see match factors'}
        >
          <Sparkles className="h-3 w-3" />
          {s}%
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{s}% match · {match.decisionLabel.replace('_', ' ').toLowerCase()}</div>
            <Badge variant="outline" className="text-[10px]">
              {match.verifiedCount}/{match.totalProjects} {isIt ? 'progetti verificati' : 'verified projects'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isIt
              ? 'Punteggio pesato per evidenze. Competenze verificate contano 1.0×, autodichiarate 0.6×.'
              : 'Evidence-weighted score. Verified skills count 1.0×, self-declared 0.6×.'}
          </p>
        </div>
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          {match.factors.map(f => (
            <div key={f.name} className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium capitalize">{f.name.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-muted-foreground">
                  +{f.contribution} / {f.weight}
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, (f.contribution / Math.max(1, f.weight)) * 100)}%` }}
                />
              </div>
              {f.humanReason && (
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{f.humanReason}</p>
              )}
              {f.evidence && f.evidence.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {f.evidence.slice(0, 6).map((e, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] h-5">
                      {e.label}
                    </Badge>
                  ))}
                  {f.evidence.length > 6 && (
                    <span className="text-[10px] text-muted-foreground self-center">
                      +{f.evidence.length - 6} {isIt ? 'altri' : 'more'}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          {match.missingSkills.length > 0 && (
            <div className="pt-2 border-t text-xs">
              <div className="font-medium text-amber-700 mb-1">{isIt ? 'Gap da colmare:' : 'Gaps to close:'}</div>
              <div className="flex flex-wrap gap-1">
                {match.missingSkills.slice(0, 8).map(sk => (
                  <Badge key={sk} variant="outline" className="text-[10px] h-5 border-amber-200 text-amber-800">
                    {sk}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function CandidatesPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const jobIdFromUrl = searchParams?.get('jobId') || ''
  const t = useTranslations('recruiterDashboard.candidates')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobContext, setJobContext] = useState<{ id: string; title: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [universityFilter, setUniversityFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [engagementFilter, setEngagementFilter] = useState('all')
  const [skillsFilter, setSkillsFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [gradYearFilter, setGradYearFilter] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())
  const [outreachTemplates, setOutreachTemplates] = useState<OutreachTemplateOption[]>([])

  useEffect(() => {
    fetchCandidates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, skillsFilter, locationFilter, gradYearFilter, universityFilter, jobIdFromUrl])

  useEffect(() => {
    // Pull available outreach templates once so the inline "Send" popover can list them.
    fetch('/api/dashboard/recruiter/outreach')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data?.templates) return
        setOutreachTemplates(
          data.templates.map((t: any) => ({
            id: t.id,
            name: t.name,
            stepCount: Array.isArray(t.steps) ? t.steps.length : 0,
          }))
        )
      })
      .catch(() => { /* silent — templates stay empty, popover shows "Create one" link */ })
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ limit: '100' })
      if (searchQuery) params.set('search', searchQuery)
      if (skillsFilter) params.set('skills', skillsFilter)
      if (locationFilter) params.set('location', locationFilter)
      if (gradYearFilter !== 'all') params.set('graduationYear', gradYearFilter)
      if (universityFilter !== 'all') params.set('university', universityFilter)
      if (jobIdFromUrl) params.set('jobId', jobIdFromUrl)
      const response = await fetch(`/api/dashboard/recruiter/search/students?${params}`)
      if (response.ok) {
        const data = await response.json()
        setJobContext(data.jobContext || null)
        const students = data.students || []
        // s.name is pre-formatted "First Last" from API; split for display.
        const split = (n: string) => {
          const parts = (n || '').split(/\s+/)
          return { first: parts[0] || '', last: parts.slice(1).join(' ') }
        }
        setCandidates(students.map((s: any) => {
          const nm = split(s.name || '')
          return {
            id: s.id,
            firstName: s.firstName || nm.first,
            lastName: s.lastName || nm.last,
            username: s.username || null,
            email: s.email || '',
            university: s.university || 'University not specified',
            degree: s.degree || '',
            graduationYear: s.graduationYear || '',
            photo: s.photo || null,
            bio: s.bio || null,
            availableFor: s.availableFor || 'BOTH',
            projects: (s.projects || []).map((p: any) => ({
              id: p.id,
              title: p.title,
              discipline: p.discipline || 'OTHER',
              innovationScore: p.innovationScore || null,
              universityVerified: p.verificationStatus === 'VERIFIED',
            })),
            _count: { projects: s.projectCount ?? s._count?.projects ?? 0 },
            match: s.match || null,
          }
        }))
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCandidates = candidates.filter(candidate => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(query)
      const matchesUniversity = candidate.university.toLowerCase().includes(query)
      const matchesProject = candidate.projects.some(p => p.title.toLowerCase().includes(query))
      if (!matchesName && !matchesUniversity && !matchesProject) return false
    }

    // Discipline filter
    if (disciplineFilter !== 'all') {
      const hasDiscipline = candidate.projects.some(p => p.discipline === disciplineFilter)
      if (!hasDiscipline) return false
    }

    // University filter
    if (universityFilter !== 'all' && candidate.university !== universityFilter) {
      return false
    }

    // Engagement type filter
    if (engagementFilter !== 'all') {
      const avail = candidate.availableFor
      if (engagementFilter === 'HIRING' && avail !== 'HIRING' && avail !== 'BOTH') return false
      if (engagementFilter === 'PROJECTS' && avail !== 'PROJECTS' && avail !== 'BOTH') return false
    }

    // Verified only
    if (verifiedOnly && !candidate.projects.some(p => p.universityVerified)) return false

    return true
  })

  const universities = Array.from(new Set(candidates.map(c => c.university))).sort()

  // Persist bookmarks to the saved-candidates pipeline. Was previously
  // just local state — nothing was actually written to the DB, so the
  // /dashboard/recruiter/pipeline kanban always appeared empty.
  const toggleBookmark = async (candidateId: string) => {
    const wasBookmarked = bookmarked.has(candidateId)
    // Optimistic UI
    setBookmarked(prev => {
      const next = new Set(prev)
      if (wasBookmarked) next.delete(candidateId)
      else next.add(candidateId)
      return next
    })
    try {
      if (wasBookmarked) {
        await fetch('/api/dashboard/recruiter/saved-candidates', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId }),
        })
      } else {
        await fetch('/api/dashboard/recruiter/saved-candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId, folder: 'discovered' }),
        })
      }
    } catch {
      // Revert on failure
      setBookmarked(prev => {
        const next = new Set(prev)
        if (wasBookmarked) next.add(candidateId)
        else next.delete(candidateId)
        return next
      })
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'
  }

  const getTopScore = (projects: Candidate['projects']) => {
    const scores = projects.map(p => p.innovationScore).filter(Boolean) as number[]
    return scores.length > 0 ? Math.max(...scores) : 0
  }

  const clearFilters = () => {
    setSearchQuery('')
    setDisciplineFilter('all')
    setUniversityFilter('all')
    setEngagementFilter('all')
    setSkillsFilter('')
    setLocationFilter('')
    setGradYearFilter('all')
    setVerifiedOnly(false)
  }

  const activeFilterCount = [
    disciplineFilter !== 'all',
    universityFilter !== 'all',
    engagementFilter !== 'all',
    skillsFilter !== '',
    locationFilter !== '',
    gradYearFilter !== 'all',
    verifiedOnly,
  ].filter(Boolean).length

  const handleExportCsv = () => {
    const dataToExport = filteredCandidates.map((c) => ({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      university: c.university,
      degree: c.degree,
      graduationYear: c.graduationYear,
      projects: c._count.projects,
      topProject: c.projects[0]?.title || '',
      avgInnovationScore: c.projects.length > 0
        ? Math.round(c.projects.reduce((sum, p) => sum + (p.innovationScore || 0), 0) / c.projects.length)
        : 0,
    }))
    exportCandidatesToCsv(dataToExport)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/recruiter">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('back')}
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <MetricHero gradient="company">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/recruiter">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('back')}
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
              <p className="text-muted-foreground">{t('subtitle')}</p>
              {jobContext && (
                <div className="mt-2 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                  <Briefcase className="h-3.5 w-3.5" />
                  Ranked for: {jobContext.title}
                  <Link href="/dashboard/recruiter/candidates" className="hover:opacity-80">
                    <X className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {filteredCandidates.length > 0 && (
              <Button variant="outline" onClick={handleExportCsv}>
                <Download className="h-4 w-4 mr-2" />
                {t('exportCsv')}
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard/recruiter/jobs/new">
                <Plus className="h-4 w-4 mr-2" />
                {t('postJob')}
              </Link>
            </Button>
          </div>
        </div>
      </MetricHero>

      {/* Stats — neutral surfaces, hairline borders, no rainbow gradients */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard gradient="none" hover={false}>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('stats.candidates')}</p>
            <p className="text-2xl font-bold tracking-tight mt-1">{filteredCandidates.length}</p>
          </div>
        </GlassCard>
        <GlassCard gradient="none" hover={false}>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('stats.projects')}</p>
            <p className="text-2xl font-bold tracking-tight mt-1">
              {filteredCandidates.reduce((acc, c) => acc + c._count.projects, 0)}
            </p>
          </div>
        </GlassCard>
        <GlassCard gradient="none" hover={false}>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('stats.verified')}</p>
            <p className="text-2xl font-bold tracking-tight mt-1">
              {filteredCandidates.filter(c => c.projects.some(p => p.universityVerified)).length}
            </p>
          </div>
        </GlassCard>
        <GlassCard gradient="none" hover={false}>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('stats.saved')}</p>
            <p className="text-2xl font-bold tracking-tight mt-1">{bookmarked.size}</p>
          </div>
        </GlassCard>
      </div>

      {/* Search and Filters */}
      <GlassCard hover={false}>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-4 w-4" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('filters.discipline')} />
              </SelectTrigger>
              <SelectContent>
                {DISCIPLINE_KEYS.map(disc => (
                  <SelectItem key={disc.value} value={disc.value}>
                    {t(`disciplines.${disc.key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('filters.university')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allUniversities')}</SelectItem>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={engagementFilter} onValueChange={setEngagementFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('filters.engagement')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allTypes')}</SelectItem>
                <SelectItem value="HIRING">{t('filters.openToHiring')}</SelectItem>
                <SelectItem value="PROJECTS">{t('filters.openToProjects')}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showAdvanced ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-1"
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">{activeFilterCount}</Badge>}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {activeFilterCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                {t('filters.clear')}
              </Button>
            )}
          </div>

          {/* Advanced filters */}
          {showAdvanced && (
            <div className="border-t pt-4 mt-4 grid gap-4 grid-cols-2 md:grid-cols-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('filters.skills')}</label>
                <Input
                  placeholder={t('filters.skillsPlaceholder')}
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('filters.location')}</label>
                <Input
                  placeholder={t('filters.locationPlaceholder')}
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('filters.gradYear')}</label>
                <Select value={gradYearFilter} onValueChange={setGradYearFilter}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.anyYear')}</SelectItem>
                    {['2024', '2025', '2026', '2027', '2028'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('filters.verified')}</label>
                <Button
                  variant={verifiedOnly ? 'default' : 'outline'}
                  size="sm"
                  className="w-full h-9 text-sm"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  {t('filters.verifiedOnly')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Results */}
      {filteredCandidates.length === 0 ? (
        <GlassCard hover={false}>
          <div className="p-5">
            <EmptyState
              icon={Users}
              tone="company"
              title={t('empty.title')}
              description={t('empty.description')}
              action={{
                label: t('filters.clearFilters'),
                onClick: clearFilters,
                variant: 'outline',
              }}
            />
          </div>
        </GlassCard>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.photo || undefined} />
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(candidate.firstName, candidate.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{candidate.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {candidate.match && <MatchScoreBadge match={candidate.match} />}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(candidate.id)}
                      className={bookmarked.has(candidate.id) ? 'text-primary' : 'text-muted-foreground/60'}
                    >
                      <Star className={`h-4 w-4 ${bookmarked.has(candidate.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Code className="h-4 w-4 mr-2" />
                    {t('projectCount', { count: candidate._count.projects })}
                  </div>
                  {getTopScore(candidate.projects) > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Award className="h-4 w-4 mr-2" />
                      {t('topScore', { score: getTopScore(candidate.projects) })}
                    </div>
                  )}
                </div>

                {candidate.projects.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground line-clamp-1">
                        {candidate.projects[0].title}
                      </h4>
                      {candidate.projects[0].universityVerified && (
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {candidate.projects[0].discipline}
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/recruiter/candidates/${candidate.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      {t('viewProfile')}
                    </Link>
                  </Button>
                  <StartOutreachAction
                    candidateId={candidate.id}
                    templates={outreachTemplates}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={candidate.photo || undefined} />
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(candidate.firstName, candidate.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        {candidate.projects.some(p => p.universityVerified) && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{candidate.university}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{t('projectCount', { count: candidate._count.projects })}</span>
                        {getTopScore(candidate.projects) > 0 && (
                          <span>{t('topScore', { score: getTopScore(candidate.projects) })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {candidate.match && <MatchScoreBadge match={candidate.match} />}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(candidate.id)}
                      className={bookmarked.has(candidate.id) ? 'text-primary' : 'text-muted-foreground/60'}
                    >
                      <Star className={`h-4 w-4 ${bookmarked.has(candidate.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <StartOutreachAction
                      candidateId={candidate.id}
                      templates={outreachTemplates}
                    />
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/recruiter/candidates/${candidate.id}`}>
                        {t('viewProfile')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
