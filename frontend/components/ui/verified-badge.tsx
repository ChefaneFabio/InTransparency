'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  CheckCircle,
  GraduationCap,
  Shield,
  ExternalLink,
  Calendar,
  BookOpen,
  Award
} from 'lucide-react'

interface VerifiedBadgeProps {
  universityName: string
  universitySlug?: string
  universityLogo?: string | null
  verifiedAt?: Date | string | null
  program?: string | null
  graduationYear?: string | null
  variant?: 'default' | 'compact' | 'inline'
  showDetails?: boolean
}

export function VerifiedBadge({
  universityName,
  universitySlug,
  universityLogo,
  verifiedAt,
  program,
  graduationYear,
  variant = 'default',
  showDetails = true
}: VerifiedBadgeProps) {
  const [open, setOpen] = useState(false)

  const formattedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    : null

  // Compact inline version
  if (variant === 'inline') {
    return (
      <Badge
        variant="secondary"
        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Verified by {universityName}
      </Badge>
    )
  }

  // Compact badge without popover
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1 text-green-600">
          <Shield className="h-4 w-4" />
          <span className="font-medium">Verified</span>
        </div>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">{universityName}</span>
      </div>
    )
  }

  // Default: Full badge with popover
  const badgeContent = (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
        <CheckCircle className="h-5 w-5 text-green-600" />
      </div>
      <div className="text-left">
        <div className="text-xs text-green-600 font-medium">VERIFIED BY</div>
        <div className="text-sm font-semibold text-gray-900">{universityName}</div>
      </div>
    </div>
  )

  if (!showDetails) {
    return badgeContent
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {badgeContent}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Verified Student</h4>
              <p className="text-sm text-gray-500">Identity confirmed by institution</p>
            </div>
          </div>

          {/* Verification Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500">Institution</div>
                <div className="text-sm font-medium">{universityName}</div>
              </div>
            </div>

            {program && (
              <div className="flex items-start gap-3">
                <BookOpen className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Program</div>
                  <div className="text-sm font-medium">{program}</div>
                </div>
              </div>
            )}

            {graduationYear && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Expected Graduation</div>
                  <div className="text-sm font-medium">{graduationYear}</div>
                </div>
              </div>
            )}

            {formattedDate && (
              <div className="flex items-start gap-3">
                <Award className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Verified Since</div>
                  <div className="text-sm font-medium">{formattedDate}</div>
                </div>
              </div>
            )}
          </div>

          {/* What This Means */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">WHAT THIS MEANS</h5>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Identity verified by university
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Enrollment status confirmed
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Projects reviewed by institution
              </li>
            </ul>
          </div>

          {/* Link to University */}
          {universitySlug && (
            <Link href={`/university/${universitySlug}`}>
              <Button variant="outline" size="sm" className="w-full">
                View {universityName}
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Simple checkmark badge for lists
export function VerifiedCheckmark({ universityName }: { universityName: string }) {
  return (
    <span
      className="inline-flex items-center text-green-600"
      title={`Verified by ${universityName}`}
    >
      <CheckCircle className="h-4 w-4" />
    </span>
  )
}

// Badge for project cards
export function ProjectVerifiedBadge({
  universityName,
  grade
}: {
  universityName: string
  grade?: string | null
}) {
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-200 rounded text-xs">
      <CheckCircle className="h-3 w-3 text-green-600" />
      <span className="text-green-700">
        Verified by {universityName}
        {grade && <span className="font-semibold ml-1">• Grade: {grade}</span>}
      </span>
    </div>
  )
}
