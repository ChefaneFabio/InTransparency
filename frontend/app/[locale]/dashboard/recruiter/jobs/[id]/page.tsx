'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Link, useRouter } from '@/navigation'
import { ArrowLeft, MapPin, Clock, Users, Eye, Edit, Trash2, AlertCircle } from 'lucide-react'

interface Application {
  id: string
  status: string
  createdAt: string
  applicant: {
    id: string
    firstName: string | null
    lastName: string | null
    photo: string | null
  }
}

interface JobDetail {
  id: string
  title: string
  slug: string
  status: string
  location: string | null
  jobType: string | null
  workLocation: string | null
  description: string | null
  responsibilities: string | null
  requirements: string | null
  niceToHave: string | null
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string | null
  salaryPeriod: string | null
  showSalary: boolean
  views: number
  postedAt: string | null
  createdAt: string
  requiredSkills: string[]
  preferredSkills: string[]
  companyName: string | null
  applications: Application[]
  _count: { applications: number }
  recruiter: {
    id: string
    firstName: string | null
    lastName: string | null
    company: string | null
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!jobId) return
    fetch(`/api/jobs/${jobId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch job')
        return res.json()
      })
      .then(data => { setJob(data.job); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [jobId])

  const formatJobType = (type: string | null) => {
    if (!type) return ''
    const map: Record<string, string> = {
      FULL_TIME: 'Full-time',
      PART_TIME: 'Part-time',
      CONTRACT: 'Contract',
      INTERNSHIP: 'Internship',
      TEMPORARY: 'Temporary',
      FREELANCE: 'Freelance',
    }
    return map[type] || type
  }

  const formatSalary = (j: JobDetail) => {
    if (!j.showSalary || (!j.salaryMin && !j.salaryMax)) return null
    const currency = j.salaryCurrency || 'EUR'
    const period = j.salaryPeriod || 'yearly'
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    })
    if (j.salaryMin && j.salaryMax) {
      return `${formatter.format(j.salaryMin)} - ${formatter.format(j.salaryMax)} / ${period}`
    } else if (j.salaryMin) {
      return `From ${formatter.format(j.salaryMin)} / ${period}`
    } else if (j.salaryMax) {
      return `Up to ${formatter.format(j.salaryMax)} / ${period}`
    }
    return null
  }

  const handleToggleStatus = async () => {
    if (!job) return
    const newStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE'
    setActionLoading(true)
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update job')
      }
      setJob({ ...job, status: newStatus })
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!job) return
    if (!confirm(`Are you sure you want to delete "${job.title}"?`)) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete job')
      }
      router.push('/dashboard/recruiter/jobs')
    } catch (err: any) {
      alert(err.message)
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-16" />
            <div>
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-48 mt-2" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Job Not Found'}
        </h1>
        <p className="text-gray-600 mb-6">The job posting you are looking for does not exist or could not be loaded.</p>
        <Button asChild>
          <Link href="/dashboard/recruiter/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>
    )
  }

  const appCount = job._count?.applications ?? job.applications?.length ?? 0
  const conversionRate = job.views > 0 ? Math.round((appCount / job.views) * 100) : 0
  const salaryDisplay = formatSalary(job)
  const postedDate = job.postedAt || job.createdAt

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/recruiter/jobs">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Posted {new Date(postedDate).toLocaleDateString()}
              </span>
              <Badge variant="secondary">
                {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={actionLoading}
          >
            {job.status === 'ACTIVE' ? 'Close Job' : 'Activate Job'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{appCount}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{job.views}</p>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{conversionRate}%</p>
                <p className="text-sm text-gray-600">Conversion</p>
              </div>
              <div className="h-8 w-8 flex items-center justify-center text-purple-500 font-bold text-lg">%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium">{formatJobType(job.jobType)}</p>
            </div>
            {salaryDisplay && (
              <div>
                <p className="text-sm text-gray-500">Salary Range</p>
                <p className="font-medium">{salaryDisplay}</p>
              </div>
            )}
          </div>

          {job.description && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {job.requirements && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Requirements</p>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          {job.responsibilities && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Responsibilities</p>
              <p className="text-gray-700 whitespace-pre-wrap">{job.responsibilities}</p>
            </div>
          )}

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {job.preferredSkills && job.preferredSkills.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Preferred Skills</p>
              <div className="flex flex-wrap gap-2">
                {job.preferredSkills.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Review candidates who applied for this position</CardDescription>
        </CardHeader>
        <CardContent>
          {job.applications && job.applications.length > 0 ? (
            <div className="space-y-3">
              {job.applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {(app.applicant.firstName?.[0] || '') + (app.applicant.lastName?.[0] || '')}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {app.applicant.firstName} {app.applicant.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {app.status.charAt(0) + app.status.slice(1).toLowerCase().replace(/_/g, ' ')}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/recruiter/candidates/${app.applicant.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No applications yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
