'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Link } from '@/navigation'
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
  const t = useTranslations('applicationsPage')
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
        title: t('toastErrorTitle'),
        description: t('toastFetchFailed'),
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
        title: t('toastErrorTitle'),
        description: t('toastLoadFailed'),
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
          title: t('toastUpdatedTitle'),
          description: t('toastUpdatedDesc')
        })
        setShowDetailDialog(false)
        fetchApplications()
      } else {
        toast({
          title: t('toastUpdateFailed'),
          description: data.error || t('toastUpdateFailedDesc'),
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error updating application:', error)
      toast({
        title: t('toastErrorTitle'),
        description: t('toastUpdateFailedDesc'),
        variant: 'destructive'
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm(t('confirmWithdraw'))) return

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: t('toastWithdrawnTitle'),
          description: t('toastWithdrawnDesc')
        })
        fetchApplications()
      } else {
        const data = await response.json()
        toast({
          title: t('toastWithdrawFailed'),
          description: data.error || t('toastWithdrawFailedDesc'),
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error withdrawing application:', error)
      toast({
        title: t('toastErrorTitle'),
        description: t('toastWithdrawFailedDesc'),
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      PENDING: { label: t('statusPending'), variant: 'secondary' },
      REVIEWING: { label: t('statusReviewing'), variant: 'default' },
      SHORTLISTED: { label: t('statusShortlisted'), variant: 'default' },
      INTERVIEW: { label: t('statusInterview'), variant: 'default' },
      OFFER: { label: t('statusOffer'), variant: 'default' },
      ACCEPTED: { label: t('statusAccepted'), variant: 'default' },
      REJECTED: { label: t('statusRejected'), variant: 'destructive' },
      WITHDRAWN: { label: t('statusWithdrawn'), variant: 'outline' },
    }

    const config = statusConfig[status] || { label: status, variant: 'outline' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTimeSince = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return t('timeToday')
    if (diffInDays === 1) return t('timeYesterday')
    if (diffInDays < 7) return t('timeDaysAgo', { n: diffInDays })
    if (diffInDays < 30) return t('timeWeeksAgo', { n: Math.floor(diffInDays / 7) })
    return t('timeMonthsAgo', { n: Math.floor(diffInDays / 30) })
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
            {isRecruiter ? t('titleRecruiter') : t('titleStudent')}
          </h1>
          <p className="text-muted-foreground">
            {isRecruiter
              ? t('subtitleRecruiter')
              : t('subtitleStudent')}
          </p>
        </div>

        <Link href="/explore">
          <Button size="lg" className="mt-4 md:mt-0">
            {t('browseJobs')}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>{t('filterByStatus')}</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="PENDING">{t('statusPending')}</SelectItem>
                <SelectItem value="REVIEWING">{t('statusReviewing')}</SelectItem>
                <SelectItem value="SHORTLISTED">{t('statusShortlisted')}</SelectItem>
                <SelectItem value="INTERVIEW">{t('statusInterview')}</SelectItem>
                <SelectItem value="OFFER">{t('statusOffer')}</SelectItem>
                <SelectItem value="ACCEPTED">{t('statusAccepted')}</SelectItem>
                <SelectItem value="REJECTED">{t('statusRejected')}</SelectItem>
                <SelectItem value="WITHDRAWN">{t('statusWithdrawn')}</SelectItem>
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
            <h3 className="text-xl font-semibold mb-2">{t('emptyTitle')}</h3>
            <p className="text-muted-foreground mb-4">
              {isRecruiter
                ? t('emptyDescRecruiter')
                : t('emptyDescStudent')}
            </p>
            <Link href="/explore">
              <Button>{t('browseJobs')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                {isRecruiter && <TableHead>{t('colApplicant')}</TableHead>}
                <TableHead>{t('colJobTitle')}</TableHead>
                <TableHead>{t('colCompany')}</TableHead>
                <TableHead>{t('colStatus')}</TableHead>
                <TableHead>{t('colApplied')}</TableHead>
                {isRecruiter && <TableHead>{t('colRating')}</TableHead>}
                <TableHead className="text-right">{t('colActions')}</TableHead>
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
                        {t('view')}
                      </Button>

                      {!isRecruiter && application.status === 'PENDING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(application.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {t('withdraw')}
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
            <DialogTitle>{t('detailsTitle')}</DialogTitle>
            <DialogDescription>
              {isRecruiter ? t('detailsDescRecruiter') : t('detailsDescStudent')}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Job Info */}
              <div>
                <h3 className="font-semibold mb-2">{t('positionHeading')}</h3>
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
                  <h3 className="font-semibold mb-2">{t('applicantHeading')}</h3>
                  <div className="space-y-2">
                    <p><strong>{t('nameLabel')}</strong> {selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}</p>
                    <p><strong>{t('emailLabel')}</strong> {selectedApplication.applicant.email}</p>
                    {selectedApplication.applicant.university && (
                      <p><strong>{t('universityLabel')}</strong> {selectedApplication.applicant.university}</p>
                    )}
                    {selectedApplication.applicant.degree && (
                      <p><strong>{t('degreeLabel')}</strong> {selectedApplication.applicant.degree}</p>
                    )}
                    {selectedApplication.applicant.gpa && (
                      <p><strong>{t('gpaLabel')}</strong> {selectedApplication.applicant.gpa}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Application Materials */}
              <div>
                <h3 className="font-semibold mb-2">{t('materialsHeading')}</h3>

                {selectedApplication.coverLetter && (
                  <div className="mb-4">
                    <Label>{t('coverLetterLabel')}</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedApplication.cvUrl && (
                    <div>
                      <Label>{t('cvLabel')}</Label>
                      <a
                        href={selectedApplication.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block"
                      >
                        {t('viewCv')}
                      </a>
                    </div>
                  )}

                  {selectedApplication.portfolioUrl && (
                    <div>
                      <Label>{t('portfolioLabel')}</Label>
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block"
                      >
                        {t('viewPortfolio')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Management (for recruiters) */}
              {isRecruiter && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="status">{t('applicationStatusLabel')}</Label>
                    <Select value={updateStatus} onValueChange={setUpdateStatus}>
                      <SelectTrigger id="status" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">{t('statusPending')}</SelectItem>
                        <SelectItem value="REVIEWING">{t('statusReviewing')}</SelectItem>
                        <SelectItem value="SHORTLISTED">{t('statusShortlisted')}</SelectItem>
                        <SelectItem value="INTERVIEW">{t('statusInterview')}</SelectItem>
                        <SelectItem value="OFFER">{t('statusOffer')}</SelectItem>
                        <SelectItem value="ACCEPTED">{t('statusAccepted')}</SelectItem>
                        <SelectItem value="REJECTED">{t('statusRejected')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating">{t('ratingLabel')}</Label>
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
                    <Label htmlFor="notes">{t('recruiterNotesLabel')}</Label>
                    <Textarea
                      id="notes"
                      value={recruiterNotes}
                      onChange={(e) => setRecruiterNotes(e.target.value)}
                      rows={4}
                      placeholder={t('recruiterNotesPlaceholder')}
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={handleUpdateApplication} disabled={updating} className="w-full">
                    {updating ? t('updating') : t('updateApplication')}
                  </Button>
                </div>
              )}

              {/* Application Timeline */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">{t('timelineHeading')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{t('appliedOn', { time: getTimeSince(selectedApplication.createdAt) })}</span>
                  </div>
                  {selectedApplication.respondedAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('updatedOn', { time: getTimeSince(selectedApplication.respondedAt) })}</span>
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
