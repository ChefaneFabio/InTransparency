'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubmissionCard } from '@/components/challenges/SubmissionCard'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Edit,
  Eye,
  GraduationCap,
  Loader2,
  Trophy,
  Users
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  problemStatement?: string
  expectedOutcome?: string
  companyName: string
  companyLogo?: string
  companyIndustry?: string
  discipline: string
  challengeType: string
  requiredSkills: string[]
  tools: string[]
  teamSizeMin: number
  teamSizeMax: number
  estimatedDuration?: string
  applicationDeadline?: string
  startDate?: string
  endDate?: string
  mentorshipOffered: boolean
  compensation?: string
  equipmentProvided?: string
  status: string
  maxSubmissions: number
  views: number
  slug: string
  createdAt: string
  universityApprovals: Array<{
    id: string
    universityName: string
    status: string
    courseName?: string
    courseCode?: string
    semester?: string
    professorName?: string
    approvedAt?: string
  }>
  submissions?: Array<{
    id: string
    status: string
    applicationText?: string
    submissionTitle?: string
    submissionUrl?: string
    companyFeedback?: string
    companyRating?: number
    isTeamProject: boolean
    teamName?: string
    teamMembers?: Array<{ name: string; email: string; role: string }>
    convertedToProject: boolean
    createdAt: string
    submittedAt?: string
    student?: {
      id: string
      firstName?: string
      lastName?: string
      email?: string
      university?: string
      degree?: string
      photo?: string
    }
  }>
  _count?: {
    submissions: number
    universityApprovals: number
  }
}

export default function ChallengeDetailPage() {
  const params = useParams()
  const challengeId = params.id as string
  const t = useTranslations('dashboard.recruiter.challengeDetail')
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchChallenge = async () => {
    try {
      setError(false)
      const response = await fetch(`/api/challenges/${challengeId}`)
      if (response.ok) {
        const data = await response.json()
        setChallenge(data)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Failed to fetch challenge:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (challengeId) {
      fetchChallenge()
    }
  }, [challengeId])

  const handleSubmissionAction = async (action: string, submission: { id: string }) => {
    setActionLoading(true)
    try {
      const statusMap: Record<string, string> = {
        select: 'SELECTED',
        reject: 'REJECTED',
        approve: 'APPROVED',
        request_revision: 'REVISION_REQUESTED'
      }

      const response = await fetch(`/api/challenges/${challengeId}/submissions/${submission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusMap[action] })
      })

      if (response.ok) {
        fetchChallenge()
      }
    } catch (err) {
      console.error('Failed to update submission:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusKeys: Record<string, string> = {
      DRAFT: 'statusDraft',
      PENDING_REVIEW: 'statusPendingReview',
      APPROVED: 'statusApproved',
      ACTIVE: 'statusActive',
      IN_PROGRESS: 'statusInProgress',
      CLOSED: 'statusClosed',
      COMPLETED: 'statusCompleted'
    }
    const classNames: Record<string, string> = {
      DRAFT: 'bg-muted text-foreground/80',
      PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-primary/10 text-blue-700',
      ACTIVE: 'bg-primary/10 text-green-700',
      IN_PROGRESS: 'bg-primary/10 text-purple-700',
      CLOSED: 'bg-muted text-foreground/80',
      COMPLETED: 'bg-primary/10 text-green-700'
    }
    const key = statusKeys[status] || 'statusDraft'
    const className = classNames[status] || classNames.DRAFT
    return <Badge className={className}>{t(key)}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">{t('notFound')}</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/recruiter/challenges">{t('backToChallenges')}</Link>
        </Button>
      </div>
    )
  }

  const submissions = challenge.submissions || []
  const groupedSubmissions = {
    applied: submissions.filter(s => s.status === 'APPLIED'),
    selected: submissions.filter(s => s.status === 'SELECTED'),
    inProgress: submissions.filter(s => s.status === 'IN_PROGRESS'),
    submitted: submissions.filter(s => s.status === 'SUBMITTED'),
    approved: submissions.filter(s => s.status === 'APPROVED'),
    rejected: submissions.filter(s => s.status === 'REJECTED')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/recruiter/challenges">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('back')}
            </Link>
          </Button>
          <div className="flex items-start gap-4">
            {challenge.companyLogo ? (
              <img
                src={challenge.companyLogo}
                alt={challenge.companyName}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">{challenge.title}</h1>
                {getStatusBadge(challenge.status)}
              </div>
              <p className="text-muted-foreground mt-1">{challenge.companyName}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/recruiter/challenges/${challenge.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              {t('edit')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-xs text-muted-foreground">{t('submissions')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{challenge.universityApprovals.length}</p>
                <p className="text-xs text-muted-foreground">{t('universities')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{challenge.views}</p>
                <p className="text-xs text-muted-foreground">{t('views')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{groupedSubmissions.approved.length}</p>
                <p className="text-xs text-muted-foreground">{t('approved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t('challengeDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('description')}</h4>
                <p className="text-foreground/80">{challenge.description}</p>
              </div>

              {challenge.problemStatement && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('problemStatement')}</h4>
                  <p className="text-foreground/80">{challenge.problemStatement}</p>
                </div>
              )}

              {challenge.expectedOutcome && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('expectedOutcome')}</h4>
                  <p className="text-foreground/80">{challenge.expectedOutcome}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {challenge.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('submissionsTitle')}</CardTitle>
              <CardDescription>
                {t('submissionsCount', { count: submissions.length, max: challenge.maxSubmissions })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="applied">
                <TabsList className="mb-4">
                  <TabsTrigger value="applied">
                    {t('applied')} ({groupedSubmissions.applied.length})
                  </TabsTrigger>
                  <TabsTrigger value="in-progress">
                    {t('inProgress')} ({groupedSubmissions.inProgress.length + groupedSubmissions.selected.length})
                  </TabsTrigger>
                  <TabsTrigger value="submitted">
                    {t('submitted')} ({groupedSubmissions.submitted.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    {t('completed')} ({groupedSubmissions.approved.length + groupedSubmissions.rejected.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="applied" className="space-y-4">
                  {groupedSubmissions.applied.length > 0 ? (
                    groupedSubmissions.applied.map((submission) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        variant="recruiter"
                        onAction={handleSubmissionAction}
                      />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">{t('noPendingApplications')}</p>
                  )}
                </TabsContent>

                <TabsContent value="in-progress" className="space-y-4">
                  {[...groupedSubmissions.selected, ...groupedSubmissions.inProgress].length > 0 ? (
                    [...groupedSubmissions.selected, ...groupedSubmissions.inProgress].map((submission) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        variant="recruiter"
                        onAction={handleSubmissionAction}
                      />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">{t('noInProgress')}</p>
                  )}
                </TabsContent>

                <TabsContent value="submitted" className="space-y-4">
                  {groupedSubmissions.submitted.length > 0 ? (
                    groupedSubmissions.submitted.map((submission) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        variant="recruiter"
                        onAction={handleSubmissionAction}
                      />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">{t('noAwaitingReview')}</p>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {[...groupedSubmissions.approved, ...groupedSubmissions.rejected].length > 0 ? (
                    [...groupedSubmissions.approved, ...groupedSubmissions.rejected].map((submission) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        variant="recruiter"
                        onAction={handleSubmissionAction}
                      />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">{t('noCompleted')}</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('challengeInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground/60" />
                <span className="text-muted-foreground">{t('type')}:</span>
                <span>{challenge.challengeType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground/60" />
                <span className="text-muted-foreground">{t('team')}:</span>
                <span>{challenge.teamSizeMin}-{challenge.teamSizeMax} {t('people')}</span>
              </div>
              {challenge.estimatedDuration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground/60" />
                  <span className="text-muted-foreground">{t('duration')}:</span>
                  <span>{challenge.estimatedDuration}</span>
                </div>
              )}
              {challenge.applicationDeadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground/60" />
                  <span className="text-muted-foreground">{t('deadline')}:</span>
                  <span>{new Date(challenge.applicationDeadline).toLocaleDateString()}</span>
                </div>
              )}
              {challenge.mentorshipOffered && (
                <Badge variant="secondary" className="bg-primary/5 text-green-700">
                  {t('mentorshipOffered')}
                </Badge>
              )}
              {challenge.compensation && (
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                  {challenge.compensation}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* University Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('universityApprovals')}</CardTitle>
            </CardHeader>
            <CardContent>
              {challenge.universityApprovals.length > 0 ? (
                <div className="space-y-3">
                  {challenge.universityApprovals.map((approval) => (
                    <div key={approval.id} className="p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{approval.universityName}</span>
                        <Badge
                          className={
                            approval.status === 'APPROVED'
                              ? 'bg-primary/10 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {approval.status}
                        </Badge>
                      </div>
                      {approval.courseName && (
                        <p className="text-xs text-muted-foreground">
                          {approval.courseCode} - {approval.courseName}
                        </p>
                      )}
                      {approval.professorName && (
                        <p className="text-xs text-muted-foreground">
                          Prof. {approval.professorName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('noApprovals')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
