'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  Loader2,
  Send,
  Trophy,
  Users,
  XCircle
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  problemStatement?: string
  expectedOutcome?: string
  companyName: string
  companyLogo?: string
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
  recruiter?: {
    id: string
    firstName?: string
    lastName?: string
    company?: string
    photo?: string
  }
  universityApprovals?: Array<{
    courseName?: string
    courseCode?: string
    semester?: string
    professorName?: string
  }>
  _count?: {
    submissions: number
  }
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
  createdAt: string
  submittedAt?: string
}

export default function StudentChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const challengeId = params.id as string

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [mySubmission, setMySubmission] = useState<Submission | null>(null)
  const [canApply, setCanApply] = useState(false)
  const [spotsRemaining, setSpotsRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)

  // Application form state
  const [applicationForm, setApplicationForm] = useState({
    applicationText: '',
    proposalUrl: '',
    resumeUrl: '',
    isTeamProject: false,
    teamName: '',
    courseName: '',
    courseCode: '',
    semester: ''
  })

  // Work submission form state
  const [submissionForm, setSubmissionForm] = useState({
    submissionTitle: '',
    submissionDescription: '',
    submissionUrl: '',
    documentationUrl: ''
  })

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/student/challenges/${challengeId}`)
      if (response.ok) {
        const data = await response.json()
        setChallenge(data.challenge)
        setMySubmission(data.mySubmission)
        setCanApply(data.canApply)
        setSpotsRemaining(data.spotsRemaining)

        if (data.mySubmission) {
          setSubmissionForm({
            submissionTitle: data.mySubmission.submissionTitle || '',
            submissionDescription: data.mySubmission.submissionDescription || '',
            submissionUrl: data.mySubmission.submissionUrl || '',
            documentationUrl: data.mySubmission.documentationUrl || ''
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (challengeId) {
      fetchData()
    }
  }, [challengeId])

  const handleApply = async () => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/student/challenges/${challengeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationForm)
      })

      if (response.ok) {
        fetchData()
        setShowApplyForm(false)
      }
    } catch (error) {
      console.error('Failed to apply:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmitWork = async () => {
    if (!mySubmission) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/student/submissions/${mySubmission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submissionForm,
          action: 'submit'
        })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to submit work:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleConvertToProject = async () => {
    if (!mySubmission) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/student/submissions/${mySubmission.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      if (response.ok) {
        router.push('/dashboard/student/projects')
      }
    } catch (error) {
      console.error('Failed to convert to project:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getSubmissionStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      APPLIED: { label: 'Applied', className: 'bg-blue-100 text-blue-700', icon: <Clock className="h-3 w-3" /> },
      SELECTED: { label: 'Selected', className: 'bg-green-100 text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
      IN_PROGRESS: { label: 'In Progress', className: 'bg-purple-100 text-purple-700', icon: <Clock className="h-3 w-3" /> },
      SUBMITTED: { label: 'Submitted', className: 'bg-orange-100 text-orange-700', icon: <Send className="h-3 w-3" /> },
      REVISION_REQUESTED: { label: 'Revision Needed', className: 'bg-yellow-100 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
      APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
      REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> }
    }
    const config = configs[status] || configs.APPLIED
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    )
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
          <Link href="/dashboard/student/challenges">Back to Challenges</Link>
        </Button>
      </div>
    )
  }

  const daysUntilDeadline = challenge.applicationDeadline
    ? Math.ceil((new Date(challenge.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/student/challenges">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div className="flex items-start gap-4 flex-1">
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
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">{challenge.title}</h1>
            <p className="text-gray-600 mt-1">{challenge.companyName}</p>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline">{challenge.challengeType.replace(/_/g, ' ')}</Badge>
              {challenge.mentorshipOffered && (
                <Badge className="bg-green-50 text-green-700">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Mentorship
                </Badge>
              )}
              {challenge.compensation && (
                <Badge className="bg-yellow-50 text-yellow-700">{challenge.compensation}</Badge>
              )}
            </div>
          </div>
          {mySubmission && getSubmissionStatusBadge(mySubmission.status)}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Details */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{challenge.description}</p>

              {challenge.problemStatement && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Problem Statement</h4>
                  <p className="text-gray-700">{challenge.problemStatement}</p>
                </div>
              )}

              {challenge.expectedOutcome && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Expected Outcome</h4>
                  <p className="text-gray-700">{challenge.expectedOutcome}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills & Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenge.requiredSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {challenge.tools.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.tools.map((tool) => (
                      <Badge key={tool} variant="outline">{tool}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Submission Status */}
          {mySubmission && (
            <Card>
              <CardHeader>
                <CardTitle>Your Submission</CardTitle>
                <CardDescription>
                  Applied on {new Date(mySubmission.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show submission form for IN_PROGRESS or REVISION_REQUESTED */}
                {['IN_PROGRESS', 'REVISION_REQUESTED', 'SELECTED'].includes(mySubmission.status) && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Submission Title</Label>
                      <Input
                        value={submissionForm.submissionTitle}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, submissionTitle: e.target.value })}
                        placeholder="Title of your work"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={submissionForm.submissionDescription}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, submissionDescription: e.target.value })}
                        placeholder="Describe your solution..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Submission URL (GitHub, Demo, etc.)</Label>
                      <Input
                        value={submissionForm.submissionUrl}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, submissionUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Documentation URL (optional)</Label>
                      <Input
                        value={submissionForm.documentationUrl}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, documentationUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <Button onClick={handleSubmitWork} disabled={actionLoading || !submissionForm.submissionUrl}>
                      {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <Send className="h-4 w-4 mr-2" />
                      Submit Work
                    </Button>
                  </div>
                )}

                {/* Show feedback for APPROVED */}
                {mySubmission.status === 'APPROVED' && (
                  <div className="space-y-4">
                    {mySubmission.companyFeedback && (
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <h4 className="font-medium text-green-800 mb-2">Company Feedback</h4>
                        <p className="text-green-700">{mySubmission.companyFeedback}</p>
                      </div>
                    )}
                    <Button onClick={handleConvertToProject} disabled={actionLoading}>
                      {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Add to My Portfolio
                    </Button>
                  </div>
                )}

                {/* Waiting states */}
                {mySubmission.status === 'APPLIED' && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-blue-700">
                      Your application is being reviewed by the company. You will be notified when selected.
                    </p>
                  </div>
                )}

                {mySubmission.status === 'SUBMITTED' && (
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <p className="text-orange-700">
                      Your work has been submitted and is being reviewed by the company.
                    </p>
                    {mySubmission.submissionUrl && (
                      <a
                        href={mySubmission.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-orange-600 hover:underline mt-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Submission
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Apply Form */}
          {showApplyForm && !mySubmission && (
            <Card>
              <CardHeader>
                <CardTitle>Apply to Challenge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Why do you want to work on this challenge? *</Label>
                  <Textarea
                    value={applicationForm.applicationText}
                    onChange={(e) => setApplicationForm({ ...applicationForm, applicationText: e.target.value })}
                    placeholder="Describe your interest and relevant experience..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Proposal URL (optional)</Label>
                  <Input
                    value={applicationForm.proposalUrl}
                    onChange={(e) => setApplicationForm({ ...applicationForm, proposalUrl: e.target.value })}
                    placeholder="Link to your project proposal"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resume URL (optional)</Label>
                  <Input
                    value={applicationForm.resumeUrl}
                    onChange={(e) => setApplicationForm({ ...applicationForm, resumeUrl: e.target.value })}
                    placeholder="Link to your resume"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>Team Project</Label>
                    <p className="text-sm text-gray-500">Are you applying as part of a team?</p>
                  </div>
                  <Switch
                    checked={applicationForm.isTeamProject}
                    onCheckedChange={(checked) => setApplicationForm({ ...applicationForm, isTeamProject: checked })}
                  />
                </div>

                {applicationForm.isTeamProject && (
                  <div className="space-y-2">
                    <Label>Team Name</Label>
                    <Input
                      value={applicationForm.teamName}
                      onChange={(e) => setApplicationForm({ ...applicationForm, teamName: e.target.value })}
                      placeholder="Your team name"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowApplyForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApply} disabled={actionLoading || !applicationForm.applicationText}>
                    {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply CTA */}
          {!mySubmission && !showApplyForm && (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Interested?</h3>
                {canApply ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      {spotsRemaining} spots remaining
                    </p>
                    <Button className="w-full" onClick={() => setShowApplyForm(true)}>
                      Apply Now
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">
                    {spotsRemaining <= 0
                      ? 'This challenge is full'
                      : 'Applications are closed'}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Challenge Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
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
              {daysUntilDeadline !== null && (
                <div className={`flex items-center gap-2 ${daysUntilDeadline <= 7 ? 'text-orange-600' : ''}`}>
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Deadline:</span>
                  <span>{daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Passed'}</span>
                </div>
              )}
              {challenge.startDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Starts:</span>
                  <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* University Approval */}
          {challenge.universityApprovals && challenge.universityApprovals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Credit</CardTitle>
              </CardHeader>
              <CardContent>
                {challenge.universityApprovals.map((approval, i) => (
                  <div key={i} className="text-sm">
                    {approval.courseCode && <p className="font-medium">{approval.courseCode}</p>}
                    {approval.courseName && <p className="text-gray-600">{approval.courseName}</p>}
                    {approval.semester && <p className="text-gray-500">{approval.semester}</p>}
                    {approval.professorName && <p className="text-gray-500">Prof. {approval.professorName}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
