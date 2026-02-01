'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubmissionCard } from '@/components/challenges/SubmissionCard'
import { ArrowLeft, Loader2, Trophy, FileText, CheckCircle, Clock } from 'lucide-react'

interface Submission {
  id: string
  status: string
  applicationText?: string
  submissionTitle?: string
  submissionDescription?: string
  submissionUrl?: string
  documentationUrl?: string
  companyFeedback?: string
  companyRating?: number
  isTeamProject?: boolean
  teamName?: string
  teamMembers?: Array<{ name: string; email: string; role: string }>
  convertedToProject?: boolean
  createdAt: string
  submittedAt?: string
  challenge?: {
    id: string
    title: string
    companyName: string
    companyLogo?: string
    discipline?: string
    challengeType?: string
    slug?: string
  }
  project?: {
    id: string
    title: string
  }
}

interface Stats {
  total: number
  active: number
  submitted: number
  approved: number
  converted: number
}

interface GroupedSubmissions {
  active: Submission[]
  submitted: Submission[]
  completed: Submission[]
  withdrawn: Submission[]
}

export default function StudentSubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [grouped, setGrouped] = useState<GroupedSubmissions>({
    active: [],
    submitted: [],
    completed: [],
    withdrawn: []
  })
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    submitted: 0,
    approved: 0,
    converted: 0
  })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/student/submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
        setGrouped(data.grouped)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleAction = async (action: string, submission: Submission) => {
    setActionLoading(submission.id)

    try {
      if (action === 'convert') {
        const response = await fetch(`/api/student/submissions/${submission.id}/convert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })

        if (response.ok) {
          router.push('/dashboard/student/projects')
        }
      } else if (action === 'submit') {
        router.push(`/dashboard/student/challenges/${submission.challenge?.id}`)
      } else if (action === 'withdraw') {
        const response = await fetch(`/api/student/submissions/${submission.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'withdraw' })
        })

        if (response.ok) {
          fetchSubmissions()
        }
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-500">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/student/challenges">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Submissions</h1>
          <p className="text-gray-600 mt-1">
            Track your challenge applications and work
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.converted}</p>
                <p className="text-sm text-gray-600">In Portfolio</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions by Status */}
      {submissions.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="active">
              <TabsList className="mb-6">
                <TabsTrigger value="active">
                  Active ({grouped.active.length})
                </TabsTrigger>
                <TabsTrigger value="submitted">
                  Submitted ({grouped.submitted.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({grouped.completed.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({submissions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {grouped.active.length > 0 ? (
                  grouped.active.map((submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      variant="student"
                      onAction={handleAction}
                    />
                  ))
                ) : (
                  <EmptyState message="No active submissions" />
                )}
              </TabsContent>

              <TabsContent value="submitted" className="space-y-4">
                {grouped.submitted.length > 0 ? (
                  grouped.submitted.map((submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      variant="student"
                      onAction={handleAction}
                    />
                  ))
                ) : (
                  <EmptyState message="No submissions awaiting review" />
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {grouped.completed.length > 0 ? (
                  grouped.completed.map((submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      variant="student"
                      onAction={handleAction}
                    />
                  ))
                ) : (
                  <EmptyState message="No completed submissions yet" />
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {submissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    variant="student"
                    onAction={handleAction}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No submissions yet</h3>
              <p className="text-gray-600 mb-4">
                Apply to challenges to start working on real-world projects
              </p>
              <Button asChild>
                <Link href="/dashboard/student/challenges">
                  Browse Challenges
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-gray-500">
      {message}
    </div>
  )
}
