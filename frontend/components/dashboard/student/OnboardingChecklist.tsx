'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Circle,
  User,
  GraduationCap,
  FolderPlus,
  Mail,
  FileText,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
} from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  description: string
  href: string
  completed: boolean
  icon: React.ReactNode
  priority: number // lower = more important
}

interface OnboardingChecklistProps {
  profile: {
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    tagline?: string | null
    photo?: string | null
    university?: string | null
    degree?: string | null
    graduationYear?: string | null
    gpa?: string | null
    emailVerified?: boolean
  } | null
  projectCount: number
  endorsementCount: number
  universityVerified: boolean
  onDismiss?: () => void
}

export default function OnboardingChecklist({
  profile,
  projectCount,
  endorsementCount,
  universityVerified,
  onDismiss,
}: OnboardingChecklistProps) {
  const [expanded, setExpanded] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  const items: ChecklistItem[] = [
    {
      id: 'name',
      label: 'Add your name',
      description: 'First and last name so recruiters know who you are',
      href: '/dashboard/student/profile/edit',
      completed: !!(profile?.firstName && profile?.lastName),
      icon: <User className="h-4 w-4" />,
      priority: 1,
    },
    {
      id: 'bio',
      label: 'Write a bio',
      description: 'A short paragraph about your background and interests',
      href: '/dashboard/student/profile/edit',
      completed: !!(profile?.bio && profile.bio.length > 10),
      icon: <FileText className="h-4 w-4" />,
      priority: 2,
    },
    {
      id: 'university',
      label: 'Add university details',
      description: 'University, degree, and graduation year',
      href: '/dashboard/student/profile/edit',
      completed: !!(profile?.university && profile?.degree),
      icon: <GraduationCap className="h-4 w-4" />,
      priority: 3,
    },
    {
      id: 'project',
      label: 'Upload your first project',
      description: 'Showcase your work — this is what recruiters look at most',
      href: '/dashboard/student/projects/new',
      completed: projectCount > 0,
      icon: <FolderPlus className="h-4 w-4" />,
      priority: 4,
    },
    {
      id: 'verify-email',
      label: 'Verify your email',
      description: 'Confirms your account and enables notifications',
      href: '/dashboard/student/profile/edit#email',
      completed: !!profile?.emailVerified,
      icon: <Mail className="h-4 w-4" />,
      priority: 5,
    },
    {
      id: 'verify-uni',
      label: 'Connect university email',
      description: 'Gets you the verified badge that recruiters trust',
      href: '/dashboard/student/profile/edit#university',
      completed: universityVerified,
      icon: <Award className="h-4 w-4" />,
      priority: 6,
    },
    {
      id: 'endorsement',
      label: 'Request a professor endorsement',
      description: 'The highest-trust signal on the platform',
      href: '/dashboard/student/projects',
      completed: endorsementCount > 0,
      icon: <Sparkles className="h-4 w-4" />,
      priority: 7,
    },
  ]

  const completedCount = items.filter((i) => i.completed).length
  const totalCount = items.length
  const percentage = Math.round((completedCount / totalCount) * 100)
  const allDone = completedCount === totalCount

  // Find the next action to take
  const nextItem = items
    .filter((i) => !i.completed)
    .sort((a, b) => a.priority - b.priority)[0]

  if (dismissed || allDone) return null

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base">Get started</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {completedCount}/{totalCount}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {onDismiss && (
              <button
                onClick={() => {
                  setDismissed(true)
                  onDismiss()
                }}
                className="p-1 hover:bg-blue-100 rounded transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
        <Progress value={percentage} className="h-2 mt-2" />
        <p className="text-xs text-gray-500 mt-1">
          {percentage}% complete — {allDone ? 'All done!' : `Next: ${nextItem?.label}`}
        </p>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-2 pb-4">
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  item.completed
                    ? 'opacity-60'
                    : 'hover:bg-white/60'
                } ${item.id === nextItem?.id ? 'bg-white/80 shadow-sm' : ''}`}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  {!item.completed && (
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  )}
                </div>
                {item.id === nextItem?.id && !item.completed && (
                  <Badge className="text-xs bg-blue-600 flex-shrink-0">Next</Badge>
                )}
              </Link>
            ))}
          </div>

          {nextItem && (
            <Button size="sm" className="w-full mt-3" asChild>
              <Link href={nextItem.href}>
                {nextItem.icon}
                <span className="ml-2">{nextItem.label}</span>
              </Link>
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}
