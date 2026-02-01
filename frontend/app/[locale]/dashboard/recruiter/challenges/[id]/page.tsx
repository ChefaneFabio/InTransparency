'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}`)
      if (response.ok) {
        const data = await response.json()
        setChallenge(data)
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error)
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
        fetchChallenge() // Refresh data
      }
    } catch (error) {
      console.error('Failed to update submission:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
      PENDING_REVIEW: { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-700' },
      APPROVED: { label: 'Approved', className: 'bg-blue-100 text-blue-700' },
      ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-700' },
      IN_PROGRESS: { label: 'In Progress', className: 'bg-purple-100 text-purple-700' },
      CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-700' },
      COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-700' }
    }
    const config = configs[status] || configs.DRAFT
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Challenge not found</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/recruiter/challenges">Back to Challenges</Link>
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
              Back
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
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">{challenge.title}</h1>
                {getStatusBadge(challenge.status)}
              </div>
              <p className="text-gray-600 mt-1">{challenge.companyName}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/recruiter/challenges/${challenge.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-xs text-gray-600">Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{challenge.universityApprovals.length}</p>
                <p className="text-xs text-gray-600">Universities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{challenge.views}</p>
                <p className="text-xs text-gray-600">Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{groupedSubmissions.approved.length}</p>
                <p className="text-xs text-gray-600">Approved</p>
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
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-700">{challenge.description}</p>
              </div>

              {challenge.problemStatement && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Problem Statement</h4>
                  <p className="text-gray-700">{challenge.problemStatement}</p>
                </div>
              )}

              {challenge.expectedOutcome && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Expected Outcome</h4>
                  <p className="text-gray-700">{challenge.expectedOutcome}</p>
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
              <CardTitle>Submissions</CardTitle>
              <CardDescription>
                {submissions.length} of {challenge.maxSubmissions} maximum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="applied">
                <TabsList className="mb-4">
                  <TabsTrigger value="applied">
                    Applied ({groupedSubmissions.applied.length})
                  </TabsTrigger>
                  <TabsTrigger value="in-progress">
                    In Progress ({groupedSubmissions.inProgress.length + groupedSubmissions.selected.length})
                  </TabsTrigger>
                  <TabsTrigger value="submitted">
                    Submitted ({groupedSubmissions.submitted.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({groupedSubmissions.approved.length + groupedSubmissions.rejected.length})
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
                    <p className="text-center text-gray-500 py-8">No pending applications</p>
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
                    <p className="text-center text-gray-500 py-8">No submissions in progress</p>
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
                    <p className="text-center text-gray-500 py-8">No submissions awaiting review</p>
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
                    <p className="text-center text-gray-500 py-8">No completed submissions</p>
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
              <CardTitle className="text-base">Challenge Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Type:</span>
                <span>{challenge.challengeType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Team:</span>
                <span>{challenge.teamSizeMin}-{challenge.teamSizeMax} people</span>
              </div>
              {challenge.estimatedDuration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Duration:</span>
                  <span>{challenge.estimatedDuration}</span>
                </div>
              )}
              {challenge.applicationDeadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Deadline:</span>
                  <span>{new Date(challenge.applicationDeadline).toLocaleDateString()}</span>
                </div>
              )}
              {challenge.mentorshipOffered && (
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Mentorship Offered
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
              <CardTitle className="text-base">University Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {challenge.universityApprovals.length > 0 ? (
                <div className="space-y-3">
                  {challenge.universityApprovals.map((approval) => (
                    <div key={approval.id} className="p-3 rounded-lg bg-gray-50 border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{approval.universityName}</span>
                        <Badge
                          className={
                            approval.status === 'APPROVED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {approval.status}
                        </Badge>
                      </div>
                      {approval.courseName && (
                        <p className="text-xs text-gray-600">
                          {approval.courseCode} - {approval.courseName}
                        </p>
                      )}
                      {approval.professorName && (
                        <p className="text-xs text-gray-500">
                          Prof. {approval.professorName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No university approvals yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
