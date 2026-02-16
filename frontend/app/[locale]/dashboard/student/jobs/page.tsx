'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  MapPin,
  Clock,
  ExternalLink,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Target,
  FolderPlus,
} from 'lucide-react'
import { Link } from '@/navigation'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'

interface JobData {
  id: string
  title: string
  companyName: string
  companyLogo: string | null
  location: string | null
  jobType: string
  workLocation: string
  description: string
  requiredSkills: string[]
  preferredSkills: string[]
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  showSalary: boolean
  postedAt: string | null
  createdAt: string
  expiresAt: string | null
  _count: { applications: number }
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  matchedPreferred: string[]
  disciplineMatch: boolean
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  TEMPORARY: 'Temporary',
  FREELANCE: 'Freelance',
}

const WORK_LOCATION_LABELS: Record<string, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ON_SITE: 'On-site',
}

const getMatchColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 text-green-800 border-green-300'
  if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300'
  if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  return 'bg-muted text-muted-foreground border-border'
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobData[]>([])
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('match')
  const [applying, setApplying] = useState<string | null>(null)
  const [hasProjects, setHasProjects] = useState(true)
  const [studentSkillCount, setStudentSkillCount] = useState(0)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (typeFilter !== 'all') params.set('jobType', typeFilter)
      if (locationFilter !== 'all') params.set('workLocation', locationFilter)

      const [jobsRes, appsRes] = await Promise.all([
        fetch(`/api/dashboard/student/job-matches?${params.toString()}`),
        fetch('/api/applications'),
      ])

      if (!jobsRes.ok) throw new Error('Failed to load jobs')

      const jobsData = await jobsRes.json()
      setJobs(jobsData.jobs || [])
      setHasProjects(jobsData.hasProjects !== false)
      setStudentSkillCount(jobsData.studentSkillCount || 0)

      if (appsRes.ok) {
        const appsData = await appsRes.json()
        const ids = new Set<string>()
        const apps = appsData.applications || []
        for (let i = 0; i < apps.length; i++) {
          ids.add(apps[i].jobId)
        }
        setAppliedJobIds(ids)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, typeFilter, locationFilter])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const applyToJob = async (jobId: string) => {
    setApplying(jobId)
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        const newSet = new Set(Array.from(appliedJobIds))
        newSet.add(jobId)
        setAppliedJobIds(newSet)
      }
    } catch {
      // Silently fail - user can try again
    } finally {
      setApplying(null)
    }
  }

  const formatSalary = (job: JobData) => {
    if (!job.showSalary || !job.salaryMin) return null
    const currency = job.salaryCurrency || '€'
    const min = Math.round(job.salaryMin / 1000)
    const max = job.salaryMax ? Math.round(job.salaryMax / 1000) : min
    return `${currency}${min}k - ${currency}${max}k`
  }

  const getDaysAgo = (dateStr: string | null) => {
    if (!dateStr) return 'Recently'
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  // Client-side sorting
  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'match':
        return (b.matchScore || 0) - (a.matchScore || 0)
      case 'recent':
        return new Date(b.postedAt || b.createdAt).getTime() - new Date(a.postedAt || a.createdAt).getTime()
      case 'salary': {
        const aSal = a.salaryMax || a.salaryMin || 0
        const bSal = b.salaryMax || b.salaryMin || 0
        return bSal - aSal
      }
      case 'company':
        return a.companyName.localeCompare(b.companyName)
      case 'applicants':
        return (a._count?.applications || 0) - (b._count?.applications || 0)
      default:
        return 0
    }
  })

  const appliedJobs = sortedJobs.filter(j => appliedJobIds.has(j.id))
  const highMatchJobs = sortedJobs.filter(j => (j.matchScore || 0) >= 70)

  const avgMatch = jobs.length > 0
    ? Math.round(jobs.reduce((sum, j) => sum + (j.matchScore || 0), 0) / jobs.length)
    : 0

  const renderJobCard = (job: JobData) => {
    const salary = formatSalary(job)
    const isApplied = appliedJobIds.has(job.id)
    const score = job.matchScore || 0
    const matchedSet = new Set((job.matchedSkills || []).map(s => s.toLowerCase()))

    return (
      <Card key={job.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold border ${getMatchColor(score)}`}
                    >
                      {score}% match
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-medium">{job.companyName}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/80 mb-3">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location || WORK_LOCATION_LABELS[job.workLocation] || 'Not specified'}
                </span>
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                </span>
                {salary && (
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {salary}
                  </span>
                )}
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {getDaysAgo(job.postedAt || job.createdAt)}
                </span>
              </div>

              {job.description && (
                <p className="text-foreground/80 mb-4 line-clamp-2 text-sm">
                  {job.description.slice(0, 200)}
                </p>
              )}

              {/* Color-coded skill badges */}
              {job.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requiredSkills.slice(0, 8).map((skill) => {
                    const isMatched = matchedSet.has(skill.toLowerCase())
                    return (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className={`text-xs ${
                          isMatched
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {isMatched ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {skill}
                      </Badge>
                    )
                  })}
                  {job.requiredSkills.length > 8 && (
                    <Badge variant="secondary" className="text-xs">
                      +{job.requiredSkills.length - 8} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Matched preferred skills */}
              {job.matchedPreferred && job.matchedPreferred.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.matchedPreferred.slice(0, 4).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {skill} (preferred)
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4 text-xs text-foreground/80">
                <span className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {job._count?.applications || 0} applicants
                </span>
                {job.expiresAt && (
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Apply by {new Date(job.expiresAt).toLocaleDateString()}
                  </span>
                )}
                <Badge variant="outline" className="text-xs">
                  {WORK_LOCATION_LABELS[job.workLocation] || job.workLocation}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-3 ml-4">
              {isApplied ? (
                <Badge variant="default" className="text-xs">Applied</Badge>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    size="sm"
                    onClick={() => applyToJob(job.id)}
                    disabled={applying === job.id}
                  >
                    {applying === job.id ? 'Applying...' : 'Apply Now'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/50 via-white to-muted/50 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Job Opportunities</h1>
          <p className="text-muted-foreground">Discover jobs matched to your skills and projects</p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/50 via-white to-muted/50 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Job Opportunities</h1>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchJobs}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 via-white to-muted/50 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Job Opportunities</h1>
        <p className="text-muted-foreground mt-1">
          Discover positions matched to your skills and projects
          {studentSkillCount > 0 && ` (${studentSkillCount} skills detected)`}
        </p>
      </div>

      {/* No projects prompt */}
      {!hasProjects && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FolderPlus className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Upload projects to see match scores</h3>
                <p className="text-amber-800 text-sm mb-3">
                  Add your projects so we can match your skills against job requirements and show you personalized match percentages.
                </p>
                <Link href="/dashboard/student/projects/new">
                  <Button size="sm" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                    Add Your First Project
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
              <div className="ml-2 text-sm text-muted-foreground">Available Jobs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">{appliedJobIds.size}</div>
              <div className="ml-2 text-sm text-muted-foreground">Applied</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">
                {jobs.filter(j => j.jobType === 'INTERNSHIP').length}
              </div>
              <div className="ml-2 text-sm text-muted-foreground">Internships</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`text-2xl font-bold ${avgMatch >= 60 ? 'text-green-600' : avgMatch >= 40 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                {avgMatch}%
              </div>
              <div className="ml-2 text-sm text-muted-foreground">Avg Match</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Jobs ({sortedJobs.length})</TabsTrigger>
          <TabsTrigger value="highMatch">
            <Target className="h-3 w-3 mr-1" />
            High Match ({highMatchJobs.length})
          </TabsTrigger>
          <TabsTrigger value="applied">Applied ({appliedJobs.length})</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search jobs, companies, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                  <SelectItem value="ON_SITE">On-site</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FULL_TIME">Full-time</SelectItem>
                  <SelectItem value="PART_TIME">Part-time</SelectItem>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                  <SelectItem value="company">Company Name</SelectItem>
                  <SelectItem value="applicants">Fewest Applicants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="all" className="space-y-4">
          {sortedJobs.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={Search}
                  title="No jobs found"
                  description="Try adjusting your filters or search criteria"
                  action={{
                    label: 'Clear Filters',
                    onClick: () => {
                      setSearchQuery('')
                      setLocationFilter('all')
                      setTypeFilter('all')
                    },
                    variant: 'outline',
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            sortedJobs.map(renderJobCard)
          )}
        </TabsContent>

        <TabsContent value="highMatch" className="space-y-4">
          {highMatchJobs.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={Target}
                  title="No high-match jobs yet"
                  description="Complete your profile to improve job matching"
                />
              </CardContent>
            </Card>
          ) : (
            highMatchJobs.map(renderJobCard)
          )}
        </TabsContent>

        <TabsContent value="applied" className="space-y-4">
          {appliedJobs.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={Briefcase}
                  title="No applications yet"
                  description="Start applying to jobs that match your skills"
                />
              </CardContent>
            </Card>
          ) : (
            appliedJobs.map(renderJobCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
