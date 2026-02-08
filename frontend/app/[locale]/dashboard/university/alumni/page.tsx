'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  GraduationCap,
  MapPin,
  Linkedin,
  Building2,
  BookOpen,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Alumni {
  id: string
  userId: string
  name: string
  email: string
  photo: string | null
  graduationYear: string
  degree: string | null
  department: string | null
  currentCompany: string | null
  currentRole: string | null
  currentIndustry: string | null
  employmentStatus: 'EMPLOYED' | 'SEEKING' | 'FURTHER_STUDY' | 'OTHER'
  salary: number | null
  salaryCurrency: string | null
  location: string | null
  linkedInUrl: string | null
}

interface AlumniStats {
  total: number
  employed: number
  seeking: number
  furtherStudy: number
  avgSalary: number
  employmentRate: number
}

interface IndustryBreakdownItem {
  name: string
  count: number
}

interface AlumniApiResponse {
  alumni: Alumni[]
  stats: AlumniStats
  industryBreakdown: IndustryBreakdownItem[]
  filters: {
    years: string[]
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusBadge(status: Alumni['employmentStatus']) {
  switch (status) {
    case 'EMPLOYED':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <Briefcase className="h-3 w-3 mr-1" />
          Occupato
        </Badge>
      )
    case 'SEEKING':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Search className="h-3 w-3 mr-1" />
          In Cerca
        </Badge>
      )
    case 'FURTHER_STUDY':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <BookOpen className="h-3 w-3 mr-1" />
          Studio Avanzato
        </Badge>
      )
    case 'OTHER':
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Altro
        </Badge>
      )
  }
}

// ---------------------------------------------------------------------------
// Skeleton components
// ---------------------------------------------------------------------------

function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div>
            <Skeleton className="h-7 w-14 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AlumniCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function IndustryBreakdownSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function UniversityAlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [stats, setStats] = useState<AlumniStats | null>(null)
  const [industryBreakdown, setIndustryBreakdown] = useState<IndustryBreakdownItem[]>([])
  const [years, setYears] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  const fetchAlumni = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
      if (yearFilter && yearFilter !== 'all') params.set('year', yearFilter)

      const qs = params.toString()
      const url = `/api/dashboard/university/alumni${qs ? `?${qs}` : ''}`
      const res = await fetch(url)

      if (!res.ok) {
        console.error('Failed to fetch alumni:', res.status)
        setAlumni([])
        setStats(null)
        setIndustryBreakdown([])
        return
      }

      const data: AlumniApiResponse = await res.json()
      setAlumni(data.alumni ?? [])
      setStats(data.stats ?? null)
      setIndustryBreakdown(data.industryBreakdown ?? [])
      setYears(data.filters?.years ?? [])
    } catch (err) {
      console.error('Error fetching alumni:', err)
      setAlumni([])
      setStats(null)
      setIndustryBreakdown([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter, yearFilter])

  useEffect(() => {
    fetchAlumni()
  }, [fetchAlumni])

  // Compute max count for proportional progress bars
  const maxIndustryCount =
    industryBreakdown.length > 0
      ? Math.max(...industryBreakdown.map((item) => item.count))
      : 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Alumni</h1>
          <p className="text-gray-600 mt-1">
            Monitora i risultati post-laurea dei tuoi laureati
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
                      <p className="text-sm text-gray-600">Totale Alumni</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats?.employmentRate ?? 0}%
                      </p>
                      <p className="text-sm text-gray-600">Tasso Occupazione</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {'\u20AC'}
                        {((stats?.avgSalary ?? 0) / 1000).toFixed(0)}k
                      </p>
                      <p className="text-sm text-gray-600">Stipendio Medio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.seeking ?? 0}</p>
                      <p className="text-sm text-gray-600">In Cerca di Lavoro</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca per nome, azienda o ruolo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="EMPLOYED">Occupati</SelectItem>
              <SelectItem value="SEEKING">In Cerca</SelectItem>
              <SelectItem value="FURTHER_STUDY">Studio Avanzato</SelectItem>
              <SelectItem value="OTHER">Altro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Anno di laurea" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli anni</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry Breakdown */}
        <div className="mb-8">
          {loading ? (
            <IndustryBreakdownSkeleton />
          ) : industryBreakdown.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Building2 className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Distribuzione per Settore
                  </h2>
                </div>
                <div className="space-y-4">
                  {industryBreakdown.map((item) => {
                    const percentage = maxIndustryCount > 0
                      ? Math.round((item.count / maxIndustryCount) * 100)
                      : 0
                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{item.name}</span>
                          <span className="text-gray-500">{item.count} alumni</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Alumni Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <AlumniCardSkeleton key={i} />
            ))}
          </div>
        ) : alumni.length === 0 ? (
          /* Empty state */
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nessun alumni trovato
                </h3>
                <p className="text-gray-600">
                  Prova a modificare i filtri di ricerca
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumni.map((person) => (
              <Card
                key={person.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      {person.photo && (
                        <AvatarImage src={person.photo} alt={person.name} />
                      )}
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
                        {getInitials(person.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {person.name}
                        </h3>
                        {person.linkedInUrl && (
                          <a
                            href={person.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                            aria-label={`Profilo LinkedIn di ${person.name}`}
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      {/* Graduation info */}
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                        <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {person.graduationYear}
                          {person.degree && ` \u00B7 ${person.degree}`}
                        </span>
                      </div>

                      {/* Current role */}
                      {person.employmentStatus === 'EMPLOYED' &&
                        (person.currentRole || person.currentCompany) && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                            <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                            <span className="truncate">
                              {person.currentRole}
                              {person.currentRole && person.currentCompany && ' @ '}
                              {person.currentCompany}
                            </span>
                          </div>
                        )}

                      {/* Location */}
                      {person.location && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{person.location}</span>
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="mt-2">
                        {getStatusBadge(person.employmentStatus)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
