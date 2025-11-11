'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, MapPin, Clock, Briefcase, Euro, Users } from 'lucide-react'

interface Job {
  id: string
  title: string
  companyName: string
  companyLogo?: string
  location?: string
  jobType: string
  workLocation: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  showSalary: boolean
  requiredSkills: string[]
  targetDisciplines: string[]
  postedAt: string
  expiresAt?: string
  views: number
  isFeatured: boolean
  _count?: {
    applications: number
  }
}

export default function JobsPage() {
  const { data: session } = useSession()
  const t = useTranslations('jobs')

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchJobs()
  }, [searchQuery, jobTypeFilter, locationFilter, page])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      })

      if (searchQuery) params.append('search', searchQuery)
      if (jobTypeFilter !== 'all') params.append('jobType', jobTypeFilter)
      if (locationFilter !== 'all') params.append('workLocation', locationFilter)

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json()

      if (data.jobs) {
        setJobs(data.jobs)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatSalary = (job: Job) => {
    if (!job.showSalary || (!job.salaryMin && !job.salaryMax)) {
      return 'Competitive'
    }

    const currency = job.salaryCurrency === 'EUR' ? '€' : job.salaryCurrency

    if (job.salaryMin && job.salaryMax) {
      return `${currency}${(job.salaryMin / 1000).toFixed(0)}k - ${currency}${(job.salaryMax / 1000).toFixed(0)}k`
    }

    if (job.salaryMin) {
      return `From ${currency}${(job.salaryMin / 1000).toFixed(0)}k`
    }

    if (job.salaryMax) {
      return `Up to ${currency}${(job.salaryMax / 1000).toFixed(0)}k`
    }

    return 'Competitive'
  }

  const getJobTypeLabel = (jobType: string) => {
    const labels: Record<string, string> = {
      FULL_TIME: 'Full-time',
      PART_TIME: 'Part-time',
      CONTRACT: 'Contract',
      INTERNSHIP: 'Internship',
      TEMPORARY: 'Temporary',
      FREELANCE: 'Freelance'
    }
    return labels[jobType] || jobType
  }

  const getWorkLocationLabel = (workLocation: string) => {
    const labels: Record<string, string> = {
      REMOTE: 'Remote',
      HYBRID: 'Hybrid',
      ON_SITE: 'On-site'
    }
    return labels[workLocation] || workLocation
  }

  const getTimeSince = (date: string) => {
    const now = new Date()
    const posted = new Date(date)
    const diffInDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Job Opportunities</h1>
          <p className="text-muted-foreground">Find your next career opportunity</p>
        </div>

        {session?.user?.role === 'RECRUITER' && (
          <Link href="/jobs/new">
            <Button size="lg" className="mt-4 md:mt-0">
              Post a Job
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FULL_TIME">Full-time</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Work Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="REMOTE">Remote</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
                <SelectItem value="ON_SITE">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                          <CardDescription>{job.companyName}</CardDescription>
                        </div>
                      </div>
                      {job.isFeatured && (
                        <Badge variant="default" className="ml-2">Featured</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location || 'Location not specified'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{getJobTypeLabel(job.jobType)} • {getWorkLocationLabel(job.workLocation)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Euro className="w-4 h-4" />
                      <span>{formatSalary(job)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeSince(job.postedAt)}</span>
                    </div>

                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.requiredSkills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.requiredSkills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{job._count?.applications || 0} applicants</span>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
