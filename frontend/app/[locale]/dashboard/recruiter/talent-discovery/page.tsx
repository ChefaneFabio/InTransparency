'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Search,
  GraduationCap,
  Users,
  Zap,
  RefreshCw,
  BookOpen,
  Loader2,
  Eye,
} from 'lucide-react'
import { Link } from '@/navigation'

interface TalentAnalyticsData {
  talentPool: number
  universityDistribution: Array<{ university: string; count: number }>
  skillsFrequency: Array<{ skill: string; count: number }>
  growthTrends: Array<{ month: string; newStudents: number }>
  disciplineDistribution: Array<{ discipline: string; count: number }>
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen space-y-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-36" /></CardHeader>
            <CardContent>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mb-3" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent><Skeleton className="h-[350px] w-full" /></CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface FilteredCandidate {
  id: string
  firstName: string
  lastName: string
  university: string
  degree: string
  photo: string | null
  projectCount: number
  topSkills: string[]
}

export default function TalentDiscoveryPage() {
  const t = useTranslations('dashboard.recruiter.talentDiscovery')
  const [data, setData] = useState<TalentAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<FilteredCandidate[]>([])
  const [searching, setSearching] = useState(false)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/recruiter/talent-analytics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch talent data')
        return res.json()
      })
      .then((result: TalentAnalyticsData) => {
        setData(result)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  // Search candidates when filters change
  const searchCandidates = () => {
    if (!searchQuery && selectedSkills.length === 0) {
      setFilteredCandidates([])
      return
    }
    setSearching(true)
    const params = new URLSearchParams()
    if (searchQuery) params.set('university', searchQuery)
    if (selectedSkills.length > 0) params.set('skills', selectedSkills.join(','))
    params.set('limit', '20')

    fetch(`/api/dashboard/recruiter/search/students?${params.toString()}`)
      .then(res => res.json())
      .then(result => {
        setFilteredCandidates(result.students || [])
        setSearching(false)
      })
      .catch(() => {
        setSearching(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Debounced search when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCandidates()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedSkills])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="min-h-screen space-y-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 font-medium mb-2">{t('errorLoading')}</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { talentPool, universityDistribution, skillsFrequency, disciplineDistribution } = data

  // Filter universities by search
  const filteredUniversities = universityDistribution.filter(uni =>
    searchQuery === '' || uni.university.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen space-y-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('subtitle')}
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('refresh')}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalTalentPool')}</p>
                <p className="text-2xl font-bold text-foreground">{talentPool.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('publicStudentProfiles')}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('universities')}</p>
                <p className="text-2xl font-bold text-foreground">{universityDistribution.length}</p>
                <p className="text-xs text-muted-foreground">{t('withRegisteredStudents')}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('skillsTracked')}</p>
                <p className="text-2xl font-bold text-foreground">{skillsFrequency.length}</p>
                <p className="text-xs text-muted-foreground">{t('uniqueSkillsInProjects')}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* University Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                {t('universityFilter')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('searchUniversities')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredUniversities.map((uni, index) => (
                    <div
                      key={uni.university}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground text-sm">{uni.university}</h4>
                          <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{uni.count} students</p>
                      </div>
                    </div>
                  ))}
                  {filteredUniversities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {searchQuery ? `No universities matching "${searchQuery}"` : 'No university data'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                {t('skillsAndTechnologies')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {skillsFrequency.slice(0, 10).map((skill) => (
                  <label key={skill.skill} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedSkills.includes(skill.skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkills(prev => prev.concat([skill.skill]))
                          } else {
                            setSelectedSkills(prev => prev.filter(s => s !== skill.skill))
                          }
                        }}
                      />
                      <span className="text-sm">{skill.skill}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {skill.count}
                    </Badge>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Charts and Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* University Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                {t('topUniversitiesByStudentCount')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {universityDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={universityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="university" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                  {t('noUniversityData')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                {t('skillsDistribution')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {skillsFrequency.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillsFrequency.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="skill" type="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" name="Project Mentions" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  {t('noSkillsData')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matching Candidates — appears when filters are active */}
          {(searchQuery || selectedSkills.length > 0) && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    {t('matchingCandidates')}
                    {searching && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                  </span>
                  <Badge>{filteredCandidates.length} found</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredCandidates.length > 0 ? (
                  <div className="space-y-3">
                    {filteredCandidates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div>
                          <h4 className="font-medium text-foreground">{c.firstName} {c.lastName}</h4>
                          <p className="text-sm text-muted-foreground">{c.university} {c.degree ? `· ${c.degree}` : ''}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(c.topSkills || []).slice(0, 4).map((s: string) => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/recruiter/candidates/${c.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : searching ? (
                  <div className="text-center py-8 text-muted-foreground">{t('searching')}</div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('noCandidatesMatch')}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Discipline Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                {t('projectDisciplines')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {disciplineDistribution.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {disciplineDistribution.map((disc) => (
                    <div
                      key={disc.discipline}
                      className="text-center p-4 bg-muted/50 rounded-lg"
                    >
                      <p className="text-2xl font-bold text-foreground">{disc.count}</p>
                      <p className="text-sm text-muted-foreground">{disc.discipline}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t('noDisciplineData')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
