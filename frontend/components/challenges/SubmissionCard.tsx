'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/navigation'
import {
  Calendar,
  ExternalLink,
  FileText,
  MessageSquare,
  Star,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Student {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  university?: string
  degree?: string
  photo?: string
  projects?: Array<{
    id: string
    title: string
    discipline: string
  }>
}

interface Submission {
  id: string
  status: string
  applicationText?: string
  proposalUrl?: string
  submissionTitle?: string
  submissionDescription?: string
  submissionUrl?: string
  documentationUrl?: string
  companyFeedback?: string
  companyRating?: number
  grade?: string
  isTeamProject?: boolean
  teamName?: string
  teamMembers?: Array<{ name: string; email: string; role: string }>
  convertedToProject?: boolean
  createdAt: string
  submittedAt?: string
  selectedAt?: string
  reviewedAt?: string
  student?: Student
  challenge?: {
    id: string
    title: string
    companyName: string
    companyLogo?: string
    discipline?: string
    challengeType?: string
    slug?: string
  }
}

interface SubmissionCardProps {
  submission: Submission
  variant?: 'recruiter' | 'student' | 'university'
  onAction?: (action: string, submission: Submission) => void | Promise<void>
}

export function SubmissionCard({ submission, variant = 'recruiter', onAction }: SubmissionCardProps) {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      APPLIED: {
        label: 'Applied',
        className: 'bg-blue-100 text-blue-700',
        icon: <Clock className="h-3.5 w-3.5" />
      },
      SELECTED: {
        label: 'Selected',
        className: 'bg-green-100 text-green-700',
        icon: <CheckCircle className="h-3.5 w-3.5" />
      },
      IN_PROGRESS: {
        label: 'In Progress',
        className: 'bg-purple-100 text-purple-700',
        icon: <Clock className="h-3.5 w-3.5" />
      },
      SUBMITTED: {
        label: 'Submitted',
        className: 'bg-orange-100 text-orange-700',
        icon: <FileText className="h-3.5 w-3.5" />
      },
      REVISION_REQUESTED: {
        label: 'Revision Needed',
        className: 'bg-yellow-100 text-yellow-700',
        icon: <AlertCircle className="h-3.5 w-3.5" />
      },
      APPROVED: {
        label: 'Approved',
        className: 'bg-green-100 text-green-700',
        icon: <CheckCircle className="h-3.5 w-3.5" />
      },
      REJECTED: {
        label: 'Rejected',
        className: 'bg-red-100 text-red-700',
        icon: <XCircle className="h-3.5 w-3.5" />
      },
      WITHDRAWN: {
        label: 'Withdrawn',
        className: 'bg-gray-100 text-gray-700',
        icon: <XCircle className="h-3.5 w-3.5" />
      }
    }
    return configs[status] || configs.APPLIED
  }

  const statusConfig = getStatusConfig(submission.status)
  const student = submission.student

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          {variant === 'recruiter' && student && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={student.photo || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                  {getInitials(student.firstName, student.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h4 className="font-medium">
                  {student.firstName} {student.lastName}
                </h4>
                <p className="text-sm text-gray-600">
                  {student.university || 'University not specified'}
                  {student.degree && ` • ${student.degree}`}
                </p>
              </div>
            </div>
          )}

          {variant === 'student' && submission.challenge && (
            <div className="flex-1 min-w-0">
              <Link href={`/dashboard/student/challenges/${submission.challenge.id}`}>
                <h4 className="font-medium hover:text-blue-600 transition-colors">
                  {submission.challenge.title}
                </h4>
              </Link>
              <p className="text-sm text-gray-600">{submission.challenge.companyName}</p>
            </div>
          )}

          <Badge className={`${statusConfig.className} flex items-center gap-1`}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {submission.isTeamProject && submission.teamName && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <span className="font-medium">Team:</span>
            <span className="text-gray-600">{submission.teamName}</span>
            {submission.teamMembers && Array.isArray(submission.teamMembers) && (
              <span className="text-gray-400">
                ({submission.teamMembers.length + 1} members)
              </span>
            )}
          </div>
        )}

        {submission.applicationText && (
          <p className="text-sm text-gray-600 line-clamp-2">{submission.applicationText}</p>
        )}

        {submission.submissionTitle && (
          <div className="p-3 rounded-lg bg-gray-50 border">
            <h5 className="font-medium text-sm">{submission.submissionTitle}</h5>
            {submission.submissionDescription && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {submission.submissionDescription}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              {submission.submissionUrl && (
                <a
                  href={submission.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Submission
                </a>
              )}
              {submission.documentationUrl && (
                <a
                  href={submission.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  Documentation
                </a>
              )}
            </div>
          </div>
        )}

        {submission.companyFeedback && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-blue-700">Company Feedback</span>
              {submission.companyRating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < submission.companyRating!
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700">{submission.companyFeedback}</p>
          </div>
        )}

        {submission.convertedToProject && (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Added to Portfolio
          </Badge>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Applied {formatDate(submission.createdAt)}
            </span>
            {submission.submittedAt && (
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                Submitted {formatDate(submission.submittedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {variant === 'recruiter' && (
              <>
                {submission.status === 'APPLIED' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAction?.('reject', submission)}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onAction?.('select', submission)}
                    >
                      Select
                    </Button>
                  </>
                )}
                {submission.status === 'SUBMITTED' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAction?.('request_revision', submission)}
                    >
                      Request Revision
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAction?.('reject', submission)}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onAction?.('approve', submission)}
                    >
                      Approve
                    </Button>
                  </>
                )}
                {student && (
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/students/${student.id}`}>
                      View Profile
                    </Link>
                  </Button>
                )}
              </>
            )}

            {variant === 'student' && (
              <>
                {['IN_PROGRESS', 'REVISION_REQUESTED'].includes(submission.status) && (
                  <Button size="sm" onClick={() => onAction?.('submit', submission)}>
                    Submit Work
                  </Button>
                )}
                {submission.status === 'APPROVED' && !submission.convertedToProject && (
                  <Button size="sm" onClick={() => onAction?.('convert', submission)}>
                    Add to Portfolio
                  </Button>
                )}
                {!['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(submission.status) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAction?.('withdraw', submission)}
                  >
                    Withdraw
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
