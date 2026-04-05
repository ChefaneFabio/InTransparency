'use client'

import { useEffect, useState } from 'react'
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
  Download
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { exportCandidatesToCsv } from '@/lib/export-csv'
import { useTranslations } from 'next-intl'

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
}

export default function CandidatesPage() {
  const { data: session } = useSession()
  const t = useTranslations('recruiterDashboard.candidates')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [universityFilter, setUniversityFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [engagementFilter, setEngagementFilter] = useState('all')
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/recruiter/search/students?limit=100')
      if (response.ok) {
        const data = await response.json()
        const students = data.students || []
        setCandidates(students.map((s: any) => ({
          id: s.id,
          firstName: s.firstName || '',
          lastName: s.lastName || '',
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
        })))
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

    return true
  })

  const universities = Array.from(new Set(candidates.map(c => c.university))).sort()

  const toggleBookmark = (candidateId: string) => {
    setBookmarked(prev => {
      const next = new Set(prev)
      if (next.has(candidateId)) {
        next.delete(candidateId)
      } else {
        next.add(candidateId)
      }
      return next
    })
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
  }

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{filteredCandidates.length}</p>
                <p className="text-xs text-muted-foreground">{t('stats.candidates')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredCandidates.reduce((acc, c) => acc + c._count.projects, 0)}
                </p>
                <p className="text-xs text-muted-foreground">{t('stats.projects')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredCandidates.filter(c => c.projects.some(p => p.universityVerified)).length}
                </p>
                <p className="text-xs text-muted-foreground">{t('stats.verified')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{bookmarked.size}</p>
                <p className="text-xs text-muted-foreground">{t('stats.saved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
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

            {(searchQuery || disciplineFilter !== 'all' || universityFilter !== 'all') && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                {t('filters.clear')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredCandidates.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Users}
              title={t('empty.title')}
              description={t('empty.description')}
              action={{
                label: t('filters.clearFilters'),
                onClick: clearFilters,
                variant: 'outline',
              }}
            />
          </CardContent>
        </Card>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookmark(candidate.id)}
                    className={bookmarked.has(candidate.id) ? 'text-primary' : 'text-muted-foreground/60'}
                  >
                    <Star className={`h-4 w-4 ${bookmarked.has(candidate.id) ? 'fill-current' : ''}`} />
                  </Button>
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
                    <Link href={`/students/${candidate.username || candidate.id}/public`}>
                      <Eye className="h-4 w-4 mr-1" />
                      {t('viewProfile')}
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(candidate.id)}
                      className={bookmarked.has(candidate.id) ? 'text-primary' : 'text-muted-foreground/60'}
                    >
                      <Star className={`h-4 w-4 ${bookmarked.has(candidate.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/students/${candidate.username || candidate.id}/public`}>
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
