'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Star,
  XCircle
} from 'lucide-react'

interface Application {
  id: string
  status: string
  coverLetter?: string
  cvUrl?: string
  portfolioUrl?: string
  isRead: boolean
  isStarred: boolean
  createdAt: string
  updatedAt: string
  respondedAt?: string
  recruiterNotes?: string
  rating?: number
  job: {
    id: string
    title: string
    companyName: string
    companyLogo?: string
    jobType: string
    workLocation: string
    location?: string
  }
  applicant?: {
    id: string
    firstName: string
    lastName: string
    email: string
    photo?: string
    university?: string
    degree?: string
    gpa?: number
  }
}

export default function ApplicationsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  // Recruiter update state
  const [updating, setUpdating] = useState(false)
  const [updateStatus, setUpdateStatus] = useState('')
  const [recruiterNotes, setRecruiterNotes] = useState('')
  const [rating, setRating] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [statusFilter])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/applications?${params.toString()}`)
      const data = await response.json()

      if (data.applications) {
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch applications',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const viewApplication = async (application: Application) => {
    // Fetch full details
    try {
      const response = await fetch(`/api/applications/${application.id}`)
      const data = await response.json()

      if (data.application) {
        setSelectedApplication(data.application)
        setUpdateStatus(data.application.status)
        setRecruiterNotes(data.application.recruiterNotes || '')
        setRating(data.application.rating?.toString() || '')
        setShowDetailDialog(true)
      }
    } catch (error) {
      console.error('Error fetching application:', error)
      toast({
        title: 'Error',
        description: 'Failed to load application details',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateApplication = async () => {
    if (!selectedApplication) return

    setUpdating(true)
    try {
      const payload: any = {}

      if (updateStatus !== selectedApplication.status) {
        payload.status = updateStatus
      }

      if (recruiterNotes.trim() !== (selectedApplication.recruiterNotes || '')) {
        payload.recruiterNotes = recruiterNotes.trim() || null
      }

      if (rating && parseInt(rating) !== selectedApplication.rating) {
        payload.rating = parseInt(rating)
      }

      const response = await fetch(`/api/applications/${selectedApplication.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Application updated',
          description: 'The application status has been updated'
        })
        setShowDetailDialog(false)
        fetchApplications()
      } else {
        toast({
          title: 'Update failed',
          description: data.error || 'Failed to update application',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error updating application:', error)
      toast({
        title: 'Error',
        description: 'Failed to update application',
        variant: 'destructive'
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Application withdrawn',
          description: 'Your application has been withdrawn'
        })
        fetchApplications()
      } else {
        const data = await response.json()
        toast({
          title: 'Withdrawal failed',
          description: data.error || 'Failed to withdraw application',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error withdrawing application:', error)
      toast({
        title: 'Error',
        description: 'Failed to withdraw application',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      PENDING: { label: 'Pending', variant: 'secondary' },
      REVIEWING: { label: 'Reviewing', variant: 'default' },
      SHORTLISTED: { label: 'Shortlisted', variant: 'default' },
      INTERVIEW: { label: 'Interview', variant: 'default' },
      OFFER: { label: 'Offer', variant: 'default' },
      ACCEPTED: { label: 'Accepted', variant: 'default' },
      REJECTED: { label: 'Rejected', variant: 'destructive' },
      WITHDRAWN: { label: 'Withdrawn', variant: 'outline' },
    }

    const config = statusConfig[status] || { label: status, variant: 'outline' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTimeSince = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const isRecruiter = session?.user?.role === 'RECRUITER'

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {isRecruiter ? 'Job Applications' : 'My Applications'}
          </h1>
          <p className="text-muted-foreground">
            {isRecruiter
              ? 'Manage applications to your job postings'
              : 'Track the status of your job applications'}
          </p>
        </div>

        <Link href="/jobs">
          <Button size="lg" className="mt-4 md:mt-0">
            Browse Jobs
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Filter by status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWING">Reviewing</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="INTERVIEW">Interview</SelectItem>
                <SelectItem value="OFFER">Offer</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-4">
              {isRecruiter
                ? 'No applications have been submitted to your jobs yet'
                : "You haven't applied to any jobs yet"}
            </p>
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                {isRecruiter && <TableHead>Applicant</TableHead>}
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                {isRecruiter && <TableHead>Rating</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  {isRecruiter && application.applicant && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {application.applicant.photo ? (
                          <img
                            src={application.applicant.photo}
                            alt={`${application.applicant.firstName} ${application.applicant.lastName}`}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold">
                              {application.applicant.firstName[0]}{application.applicant.lastName[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {application.applicant.firstName} {application.applicant.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {application.applicant.university}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {application.job.jobType} • {application.job.workLocation}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {application.job.companyLogo ? (
                        <img
                          src={application.job.companyLogo}
                          alt={application.job.companyName}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      )}
                      <span>{application.job.companyName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {getTimeSince(application.createdAt)}
                    </div>
                  </TableCell>
                  {isRecruiter && (
                    <TableCell>
                      {application.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{application.rating}/5</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewApplication(application)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>

                      {!isRecruiter && application.status === 'PENDING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(application.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {isRecruiter ? 'Review and manage this application' : 'Your application details'}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Job Info */}
              <div>
                <h3 className="font-semibold mb-2">Position</h3>
                <div className="flex items-start gap-4">
                  {selectedApplication.job.companyLogo ? (
                    <img
                      src={selectedApplication.job.companyLogo}
                      alt={selectedApplication.job.companyName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-lg">{selectedApplication.job.title}</p>
                    <p className="text-muted-foreground">{selectedApplication.job.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedApplication.job.location} • {selectedApplication.job.jobType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Applicant Info (for recruiters) */}
              {isRecruiter && selectedApplication.applicant && (
                <div>
                  <h3 className="font-semibold mb-2">Applicant</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}</p>
                    <p><strong>Email:</strong> {selectedApplication.applicant.email}</p>
                    {selectedApplication.applicant.university && (
                      <p><strong>University:</strong> {selectedApplication.applicant.university}</p>
                    )}
                    {selectedApplication.applicant.degree && (
                      <p><strong>Degree:</strong> {selectedApplication.applicant.degree}</p>
                    )}
                    {selectedApplication.applicant.gpa && (
                      <p><strong>GPA:</strong> {selectedApplication.applicant.gpa}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Application Materials */}
              <div>
                <h3 className="font-semibold mb-2">Application Materials</h3>

                {selectedApplication.coverLetter && (
                  <div className="mb-4">
                    <Label>Cover Letter</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedApplication.cvUrl && (
                    <div>
                      <Label>CV</Label>
                      <a
                        href={selectedApplication.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block"
                      >
                        View CV
                      </a>
                    </div>
                  )}

                  {selectedApplication.portfolioUrl && (
                    <div>
                      <Label>Portfolio</Label>
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block"
                      >
                        View Portfolio
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Management (for recruiters) */}
              {isRecruiter && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="status">Application Status</Label>
                    <Select value={updateStatus} onValueChange={setUpdateStatus}>
                      <SelectTrigger id="status" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REVIEWING">Reviewing</SelectItem>
                        <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                        <SelectItem value="INTERVIEW">Interview</SelectItem>
                        <SelectItem value="OFFER">Offer</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Recruiter Notes</Label>
                    <Textarea
                      id="notes"
                      value={recruiterNotes}
                      onChange={(e) => setRecruiterNotes(e.target.value)}
                      rows={4}
                      placeholder="Add notes about this candidate..."
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={handleUpdateApplication} disabled={updating} className="w-full">
                    {updating ? 'Updating...' : 'Update Application'}
                  </Button>
                </div>
              )}

              {/* Application Timeline */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Applied {getTimeSince(selectedApplication.createdAt)}</span>
                  </div>
                  {selectedApplication.respondedAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Updated {getTimeSince(selectedApplication.respondedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
