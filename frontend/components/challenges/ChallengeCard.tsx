'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from '@/navigation'
import {
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  Users,
  Trophy,
  Briefcase,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  companyName: string
  companyLogo?: string
  companyIndustry?: string
  discipline: string
  challengeType: string
  requiredSkills: string[]
  teamSizeMin: number
  teamSizeMax: number
  estimatedDuration?: string
  applicationDeadline?: string
  startDate?: string
  endDate?: string
  mentorshipOffered: boolean
  compensation?: string
  status: string
  slug: string
  _count?: {
    submissions: number
  }
  maxSubmissions: number
  hasApplied?: boolean
  mySubmission?: {
    id: string
    status: string
  } | null
  spotsRemaining?: number
  isApprovedByMyUniversity?: boolean
  universityApprovals?: Array<{
    courseName?: string
    courseCode?: string
  }>
}

interface ChallengeCardProps {
  challenge: Challenge
  variant?: 'recruiter' | 'student' | 'university'
  onAction?: (action: string, challenge: Challenge) => void
}

export function ChallengeCard({ challenge, variant = 'student', onAction }: ChallengeCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
      PENDING_REVIEW: { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-700' },
      APPROVED: { label: 'Approved', className: 'bg-blue-100 text-blue-700' },
      ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-700' },
      IN_PROGRESS: { label: 'In Progress', className: 'bg-purple-100 text-purple-700' },
      CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-700' },
      COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-700' },
      CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700' }
    }
    const config = statusConfig[status] || statusConfig.DRAFT
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getChallengeTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      CAPSTONE: 'Capstone',
      INTERNSHIP: 'Internship',
      COURSE_PROJECT: 'Course Project',
      THESIS: 'Thesis',
      HACKATHON: 'Hackathon',
      RESEARCH: 'Research'
    }
    return types[type] || type
  }

  const getDisciplineLabel = (discipline: string) => {
    return discipline.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  const daysUntilDeadline = challenge.applicationDeadline
    ? Math.ceil((new Date(challenge.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const spotsRemaining = challenge.spotsRemaining ??
    (challenge.maxSubmissions - (challenge._count?.submissions || 0))

  const linkPath = variant === 'recruiter'
    ? `/dashboard/recruiter/challenges/${challenge.id}`
    : variant === 'university'
    ? `/dashboard/university/challenges/${challenge.id}`
    : `/dashboard/student/challenges/${challenge.id}`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {challenge.companyLogo ? (
              <img
                src={challenge.companyLogo}
                alt={challenge.companyName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link href={linkPath}>
                <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-1">
                  {challenge.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span>{challenge.companyName}</span>
                {challenge.companyIndustry && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{challenge.companyIndustry}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {getStatusBadge(challenge.status)}
            {challenge.hasApplied && (
              <Badge className="bg-blue-100 text-blue-700">Applied</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{challenge.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            {getChallengeTypeLabel(challenge.challengeType)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {getDisciplineLabel(challenge.discipline)}
          </Badge>
          {challenge.mentorshipOffered && (
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <GraduationCap className="h-3 w-3 mr-1" />
              Mentorship
            </Badge>
          )}
          {challenge.compensation && (
            <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {challenge.compensation}
            </Badge>
          )}
        </div>

        {challenge.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {challenge.requiredSkills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {challenge.requiredSkills.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{challenge.requiredSkills.length - 4} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {challenge.teamSizeMin === challenge.teamSizeMax
                ? `${challenge.teamSizeMin} person`
                : `${challenge.teamSizeMin}-${challenge.teamSizeMax} people`}
            </span>
            {challenge.estimatedDuration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {challenge.estimatedDuration}
              </span>
            )}
            {daysUntilDeadline !== null && (
              <span className={`flex items-center gap-1 ${daysUntilDeadline <= 7 ? 'text-orange-600' : ''}`}>
                <Calendar className="h-3.5 w-3.5" />
                {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Deadline passed'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {variant === 'student' && (
              <span className={`text-xs ${spotsRemaining <= 3 ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                {spotsRemaining} spots left
              </span>
            )}

            {variant === 'recruiter' && (
              <span className="text-xs text-gray-500">
                {challenge._count?.submissions || 0} / {challenge.maxSubmissions} submissions
              </span>
            )}

            {variant === 'university' && (
              <span className="flex items-center gap-1 text-xs">
                {challenge.isApprovedByMyUniversity ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-600">Approved</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
                    <span className="text-yellow-600">Pending</span>
                  </>
                )}
              </span>
            )}

            <Button size="sm" variant={challenge.hasApplied ? 'outline' : 'default'} asChild>
              <Link href={linkPath}>
                {variant === 'recruiter' ? 'Manage' : variant === 'university' ? 'Review' : challenge.hasApplied ? 'View Status' : 'View Details'}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
