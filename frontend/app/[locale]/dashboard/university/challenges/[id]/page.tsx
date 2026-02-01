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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SubmissionCard } from '@/components/challenges/SubmissionCard'
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Trophy,
  Users,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Course {
  id: string
  courseName: string
  courseCode: string
  semester: string
  professorName?: string
}

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
  mentorshipOffered: boolean
  compensation?: string
  status: string
  maxSubmissions: number
  recruiter?: {
    id: string
    firstName?: string
    lastName?: string
    company?: string
    photo?: string
  }
  submissions?: Array<{
    id: string
    status: string
    isTeamProject?: boolean
    convertedToProject?: boolean
    student?: {
      id: string
      firstName?: string
      lastName?: string
      photo?: string
    }
    createdAt: string
  }>
  _count?: {
    submissions: number
  }
}

interface Approval {
  id: string
  status: string
  statusMessage?: string
  courseName?: string
  courseCode?: string
  semester?: string
  professorName?: string
  professorEmail?: string
  linkedCourseId?: string
  approvedAt?: string
}

export default function UniversityChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const challengeId = params.id as string

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [approval, setApproval] = useState<Approval | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Form state for approval
  const [formData, setFormData] = useState({
    linkedCourseId: '',
    courseName: '',
    courseCode: '',
    semester: '',
    professorName: '',
    professorEmail: '',
    statusMessage: ''
  })

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/dashboard/university/challenges/${challengeId}`)
      if (response.ok) {
        const data = await response.json()
        setChallenge(data.challenge)
        setCourses(data.courses || [])
        setApproval(data.approval)

        if (data.approval) {
          setFormData({
            linkedCourseId: data.approval.linkedCourseId || '',
            courseName: data.approval.courseName || '',
            courseCode: data.approval.courseCode || '',
            semester: data.approval.semester || '',
            professorName: data.approval.professorName || '',
            professorEmail: data.approval.professorEmail || '',
            statusMessage: data.approval.statusMessage || ''
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

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (course) {
      setFormData({
        ...formData,
        linkedCourseId: courseId,
        courseName: course.courseName,
        courseCode: course.courseCode,
        semester: course.semester,
        professorName: course.professorName || ''
      })
    }
  }

  const handleAction = async (action: 'approve' | 'reject' | 'request_changes') => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/dashboard/university/challenges/${challengeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ...formData
        })
      })

      if (response.ok) {
        fetchData() // Refresh
      }
    } catch (error) {
      console.error('Failed to update approval:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getApprovalStatusBadge = (status?: string) => {
    if (!status || status === 'PENDING') {
      return (
        <Badge className="bg-yellow-100 text-yellow-700">
          <Clock className="h-3 w-3 mr-1" />
          Pending Review
        </Badge>
      )
    }
    if (status === 'APPROVED') {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    }
    if (status === 'REJECTED') {
      return (
        <Badge className="bg-red-100 text-red-700">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    }
    return (
      <Badge className="bg-orange-100 text-orange-700">
        <AlertCircle className="h-3 w-3 mr-1" />
        Changes Requested
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
          <Link href="/dashboard/university/challenges">Back to Challenges</Link>
        </Button>
      </div>
    )
  }

  const isApproved = approval?.status === 'APPROVED'
  const submissions = challenge.submissions || []

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/university/challenges">
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
              <h1 className="text-2xl font-semibold text-gray-900">{challenge.title}</h1>
              <p className="text-gray-600 mt-1">{challenge.companyName}</p>
            </div>
          </div>
        </div>
        {getApprovalStatusBadge(approval?.status)}
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

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-gray-400" />
                  <span>{challenge.challengeType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{challenge.teamSizeMin}-{challenge.teamSizeMax} people</span>
                </div>
                {challenge.estimatedDuration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{challenge.estimatedDuration}</span>
                  </div>
                )}
                {challenge.applicationDeadline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Deadline: {new Date(challenge.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Student Submissions */}
          {isApproved && submissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>
                  Students from your university working on this challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {submissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    variant="university"
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Approval Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isApproved ? 'Approval Details' : 'Review Challenge'}
              </CardTitle>
              <CardDescription>
                {isApproved
                  ? 'This challenge is approved for your students'
                  : 'Link to a course and approve for your students'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.length > 0 && (
                <div className="space-y-2">
                  <Label>Link to Course</Label>
                  <Select
                    value={formData.linkedCourseId}
                    onValueChange={handleCourseSelect}
                    disabled={isApproved}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.courseCode} - {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Course Code</Label>
                  <Input
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    placeholder="CS401"
                    disabled={isApproved}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Input
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    placeholder="Fall 2025"
                    disabled={isApproved}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Course Name</Label>
                <Input
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder="Capstone Project"
                  disabled={isApproved}
                />
              </div>

              <div className="space-y-2">
                <Label>Professor Name</Label>
                <Input
                  value={formData.professorName}
                  onChange={(e) => setFormData({ ...formData, professorName: e.target.value })}
                  placeholder="Dr. Smith"
                  disabled={isApproved}
                />
              </div>

              <div className="space-y-2">
                <Label>Professor Email</Label>
                <Input
                  type="email"
                  value={formData.professorEmail}
                  onChange={(e) => setFormData({ ...formData, professorEmail: e.target.value })}
                  placeholder="professor@university.edu"
                  disabled={isApproved}
                />
              </div>

              {!isApproved && (
                <div className="space-y-2">
                  <Label>Comments (optional)</Label>
                  <Textarea
                    value={formData.statusMessage}
                    onChange={(e) => setFormData({ ...formData, statusMessage: e.target.value })}
                    placeholder="Any feedback or requirements..."
                    rows={3}
                  />
                </div>
              )}

              {!isApproved && (
                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve for Students
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleAction('request_changes')}
                      disabled={actionLoading}
                    >
                      Request Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction('reject')}
                      disabled={actionLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              )}

              {isApproved && approval?.approvedAt && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Approved on {new Date(approval.approvedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {challenge.mentorshipOffered && (
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Mentorship Provided
                </Badge>
              )}
              {challenge.compensation && (
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                  {challenge.compensation}
                </Badge>
              )}
              {!challenge.mentorshipOffered && !challenge.compensation && (
                <p className="text-sm text-gray-500">No additional benefits listed</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
