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
  ArrowLeft
} from 'lucide-react'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'

const DISCIPLINES = [
  { value: 'all', label: 'All Disciplines' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'TRADES', label: 'Skilled Trades' },
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'MEDIA', label: 'Film & Media' },
  { value: 'WRITING', label: 'Writing' },
  { value: 'SOCIAL_SCIENCES', label: 'Social Sciences' },
  { value: 'ARTS', label: 'Arts' },
  { value: 'LAW', label: 'Law' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'OTHER', label: 'Other' }
]

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  university: string
  degree: string
  graduationYear: string
  photo: string | null
  bio: string | null
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
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [universityFilter, setUniversityFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      // Fetch students with public profiles and projects
      const response = await fetch('/api/projects?isPublic=true&limit=50')
      if (response.ok) {
        const data = await response.json()
        // Transform projects data to candidates (group by user)
        const usersMap = new Map<string, Candidate>()

        for (const project of data.projects || []) {
          if (project.user) {
            const userId = project.user.id
            if (!usersMap.has(userId)) {
              usersMap.set(userId, {
                id: userId,
                firstName: project.user.firstName || '',
                lastName: project.user.lastName || '',
                email: '',
                university: project.user.university || 'University not specified',
                degree: '',
                graduationYear: '',
                photo: project.user.photo,
                bio: null,
                projects: [],
                _count: { projects: 0 }
              })
            }
            const user = usersMap.get(userId)!
            user.projects.push({
              id: project.id,
              title: project.title,
              discipline: project.discipline,
              innovationScore: project.innovationScore,
              universityVerified: project.universityVerified || false
            })
            user._count.projects = user.projects.length
          }
        }

        setCandidates(Array.from(usersMap.values()))
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
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/recruiter">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Candidate Search</h1>
            <p className="text-gray-600">Find and connect with talented graduates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Candidate Search</h1>
            <p className="text-gray-600">Find and connect with talented graduates</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/recruiter/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{filteredCandidates.length}</p>
                <p className="text-xs text-gray-600">Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredCandidates.reduce((acc, c) => acc + c._count.projects, 0)}
                </p>
                <p className="text-xs text-gray-600">Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredCandidates.filter(c => c.projects.some(p => p.universityVerified)).length}
                </p>
                <p className="text-xs text-gray-600">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{bookmarked.size}</p>
                <p className="text-xs text-gray-600">Saved</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, university, or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Discipline" />
              </SelectTrigger>
              <SelectContent>
                {DISCIPLINES.map(disc => (
                  <SelectItem key={disc.value} value={disc.value}>
                    {disc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
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
                Clear
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
              title="No candidates found"
              description="Try adjusting your search filters"
              action={{
                label: 'Clear Filters',
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
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {getInitials(candidate.firstName, candidate.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{candidate.university}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookmark(candidate.id)}
                    className={bookmarked.has(candidate.id) ? 'text-yellow-500' : 'text-gray-400'}
                  >
                    <Star className={`h-4 w-4 ${bookmarked.has(candidate.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Code className="h-4 w-4 mr-2" />
                    {candidate._count.projects} projects
                  </div>
                  {getTopScore(candidate.projects) > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      Top score: {getTopScore(candidate.projects)}
                    </div>
                  )}
                </div>

                {candidate.projects.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {candidate.projects[0].title}
                      </h4>
                      {candidate.projects[0].universityVerified && (
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {DISCIPLINES.find(d => d.value === candidate.projects[0].discipline)?.label || candidate.projects[0].discipline}
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/students/${candidate.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
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
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {getInitials(candidate.firstName, candidate.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        {candidate.projects.some(p => p.universityVerified) && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{candidate.university}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{candidate._count.projects} projects</span>
                        {getTopScore(candidate.projects) > 0 && (
                          <span>Score: {getTopScore(candidate.projects)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(candidate.id)}
                      className={bookmarked.has(candidate.id) ? 'text-yellow-500' : 'text-gray-400'}
                    >
                      <Star className={`h-4 w-4 ${bookmarked.has(candidate.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/students/${candidate.id}`}>
                        View Profile
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
