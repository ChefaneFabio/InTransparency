'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Euro,
  Users,
  Globe,
  Calendar,
  FileText,
  ArrowLeft,
  Send,
  Edit,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  description: string
  responsibilities?: string
  requirements?: string
  niceToHave?: string
  companyName: string
  companyLogo?: string
  companyWebsite?: string
  companySize?: string
  companyIndustry?: string
  location?: string
  jobType: string
  workLocation: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  showSalary: boolean
  requiredSkills: string[]
  preferredSkills: string[]
  education?: string
  experience?: string
  languages: string[]
  targetDisciplines: string[]
  postedAt: string
  expiresAt?: string
  views: number
  isFeatured: boolean
  requireCV: boolean
  requireCoverLetter: boolean
  internalApply: boolean
  applicationUrl?: string
  applicationEmail?: string
  _count?: {
    applications: number
  }
  recruiter?: {
    id: string
    firstName: string
    lastName: string
    company?: string
    email: string
  }
}

export default function JobDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  // Application form state
  const [coverLetter, setCoverLetter] = useState('')
  const [cvUrl, setCvUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  useEffect(() => {
    fetchJob()
  }, [params.id])

  const fetchJob = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/jobs/${params.id}`)
      const data = await response.json()

      if (data.job) {
        setJob(data.job)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Job not found',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching job:', error)
      toast({
        title: 'Error',
        description: 'Failed to load job details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to apply for this job',
        variant: 'destructive'
      })
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'STUDENT') {
      toast({
        title: 'Permission denied',
        description: 'Only students can apply for jobs',
        variant: 'destructive'
      })
      return
    }

    if (job?.requireCoverLetter && !coverLetter.trim()) {
      toast({
        title: 'Cover letter required',
        description: 'This job requires a cover letter',
        variant: 'destructive'
      })
      return
    }

    if (job?.requireCV && !cvUrl.trim()) {
      toast({
        title: 'CV required',
        description: 'This job requires a CV',
        variant: 'destructive'
      })
      return
    }

    setApplying(true)
    try {
      const response = await fetch(`/api/jobs/${params.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coverLetter: coverLetter.trim() || undefined,
          cvUrl: cvUrl.trim() || undefined,
          portfolioUrl: portfolioUrl.trim() || undefined,
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Application submitted!',
          description: 'Your application has been sent to the recruiter'
        })
        setShowApplicationForm(false)
        setCoverLetter('')
        setCvUrl('')
        setPortfolioUrl('')
        router.push('/dashboard')
      } else {
        toast({
          title: 'Application failed',
          description: data.error || 'Failed to submit application',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error applying:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive'
      })
    } finally {
      setApplying(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Job deleted',
          description: 'The job has been deleted successfully'
        })
        router.push('/jobs')
      } else {
        const data = await response.json()
        toast({
          title: 'Delete failed',
          description: data.error || 'Failed to delete job',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete job',
        variant: 'destructive'
      })
    }
  }

  const formatSalary = (job: Job) => {
    if (!job.showSalary || (!job.salaryMin && !job.salaryMax)) {
      return 'Competitive salary'
    }

    const currency = job.salaryCurrency === 'EUR' ? '€' : job.salaryCurrency

    if (job.salaryMin && job.salaryMax) {
      return `${currency}${(job.salaryMin / 1000).toFixed(0)}k - ${currency}${(job.salaryMax / 1000).toFixed(0)}k per year`
    }

    if (job.salaryMin) {
      return `From ${currency}${(job.salaryMin / 1000).toFixed(0)}k per year`
    }

    if (job.salaryMax) {
      return `Up to ${currency}${(job.salaryMax / 1000).toFixed(0)}k per year`
    }

    return 'Competitive salary'
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

    if (diffInDays === 0) return 'Posted today'
    if (diffInDays === 1) return 'Posted yesterday'
    if (diffInDays < 7) return `Posted ${diffInDays} days ago`
    if (diffInDays < 30) return `Posted ${Math.floor(diffInDays / 7)} weeks ago`
    return `Posted ${Math.floor(diffInDays / 30)} months ago`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl text-center">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <Link href="/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    )
  }

  const isRecruiter = session?.user?.id === job.recruiter?.id
  const isStudent = session?.user?.role === 'STUDENT'

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back button */}
      <Link href="/jobs">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-3xl">{job.title}</CardTitle>
                      {job.isFeatured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                    <CardDescription className="text-lg">{job.companyName}</CardDescription>
                  </div>
                </div>

                {isRecruiter && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/jobs/${job.id}/edit`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.location || 'Location not specified'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{getJobTypeLabel(job.jobType)} • {getWorkLocationLabel(job.workLocation)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <span>{formatSalary(job)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{getTimeSince(job.postedAt)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{job._count?.applications || 0} applicants</span>
                </div>

                {job.companyWebsite && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Company website
                    </a>
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3">About the role</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{job.responsibilities}</p>
                  </div>
                </>
              )}

              {/* Requirements */}
              {job.requirements && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                </>
              )}

              {/* Nice to Have */}
              {job.niceToHave && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Nice to have</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{job.niceToHave}</p>
                  </div>
                </>
              )}

              {/* Skills */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {job.preferredSkills && job.preferredSkills.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Preferred Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Experience */}
              {(job.education || job.experience) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.education && (
                      <div>
                        <h4 className="font-semibold mb-2">Education</h4>
                        <p className="text-sm text-muted-foreground">{job.education}</p>
                      </div>
                    )}
                    {job.experience && (
                      <div>
                        <h4 className="font-semibold mb-2">Experience</h4>
                        <p className="text-sm text-muted-foreground">{job.experience}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Languages */}
              {job.languages && job.languages.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.languages.map((lang) => (
                        <Badge key={lang} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          {isStudent && job.internalApply && (
            <Card>
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
                <CardDescription>Submit your application</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to submit your application
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {job.requireCoverLetter && (
                        <div>
                          <Label htmlFor="coverLetter">
                            Cover Letter <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="coverLetter"
                            placeholder="Tell us why you're a great fit for this role..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={8}
                            className="mt-2"
                          />
                        </div>
                      )}

                      {job.requireCV && (
                        <div>
                          <Label htmlFor="cvUrl">
                            CV URL <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="cvUrl"
                            type="url"
                            placeholder="https://example.com/my-cv.pdf"
                            value={cvUrl}
                            onChange={(e) => setCvUrl(e.target.value)}
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload your CV to cloud storage and paste the link here
                          </p>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="portfolioUrl">Portfolio URL (optional)</Label>
                        <Input
                          id="portfolioUrl"
                          type="url"
                          placeholder="https://example.com/portfolio"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          className="mt-2"
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleApply}
                          disabled={applying}
                          className="flex-1"
                        >
                          {applying ? 'Submitting...' : 'Submit Application'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowApplicationForm(false)}
                          disabled={applying}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          {/* External Application */}
          {job.applicationUrl && !job.internalApply && (
            <Card>
              <CardHeader>
                <CardTitle>Apply externally</CardTitle>
                <CardDescription>This job uses an external application system</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" size="lg">
                    Apply on Company Website
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.companyName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.companyIndustry && (
                <div>
                  <p className="text-sm font-medium">Industry</p>
                  <p className="text-sm text-muted-foreground">{job.companyIndustry}</p>
                </div>
              )}

              {job.companySize && (
                <div>
                  <p className="text-sm font-medium">Company Size</p>
                  <p className="text-sm text-muted-foreground">{job.companySize}</p>
                </div>
              )}

              {job.companyWebsite && (
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {job.companyWebsite}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recruiter Info */}
          {isRecruiter && job.recruiter && (
            <Card>
              <CardHeader>
                <CardTitle>Your Posting</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/recruiter/jobs/${job.id}/applications`}>
                  <Button variant="outline" className="w-full">
                    View Applications ({job._count?.applications || 0})
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
