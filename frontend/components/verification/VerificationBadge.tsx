'use client'

import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Shield,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export type VerificationLevel = 'university' | 'professor' | 'ai' | 'unverified'

interface VerificationBadgeProps {
  level: VerificationLevel
  institutionName?: string
  professorName?: string
  courseName?: string
  grade?: string
  verifiedDate?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function VerificationBadge({
  level,
  institutionName,
  professorName,
  courseName,
  grade,
  verifiedDate,
  onClick,
  size = 'md',
  showLabel = true,
  className = ''
}: VerificationBadgeProps) {
  const config = {
    university: {
      icon: ShieldCheck,
      label: 'University Verified',
      color: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
      iconColor: 'text-green-600',
      tooltip: institutionName
        ? `Authenticated via ${institutionName}'s official system`
        : 'Verified by university records'
    },
    professor: {
      icon: Award,
      label: 'Professor Endorsed',
      color: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
      iconColor: 'text-blue-600',
      tooltip: professorName
        ? `Endorsed by ${professorName}`
        : 'Endorsed by course professor'
    },
    ai: {
      icon: CheckCircle2,
      label: 'AI Validated',
      color: 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200',
      iconColor: 'text-purple-600',
      tooltip: 'Skills extracted and validated by AI analysis'
    },
    unverified: {
      icon: AlertCircle,
      label: 'Not Verified',
      color: 'bg-gray-100 text-gray-600 border-gray-300',
      iconColor: 'text-gray-500',
      tooltip: 'This project has not been verified'
    }
  }

  const { icon: Icon, label, color, iconColor, tooltip } = config[level]

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-1.5 px-4'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const buildTooltipContent = () => {
    let content = tooltip

    if (level === 'university' && (institutionName || courseName || grade)) {
      content = (
        <div className="space-y-1">
          <p className="font-semibold">{tooltip}</p>
          {institutionName && <p className="text-xs">Institution: {institutionName}</p>}
          {courseName && <p className="text-xs">Course: {courseName}</p>}
          {grade && <p className="text-xs">Grade: {grade}</p>}
          {verifiedDate && <p className="text-xs">Verified: {new Date(verifiedDate).toLocaleDateString()}</p>}
          <p className="text-xs text-muted-foreground mt-2">Click for details</p>
        </div>
      )
    } else if (level === 'professor' && professorName) {
      content = (
        <div className="space-y-1">
          <p className="font-semibold">{tooltip}</p>
          {courseName && <p className="text-xs">Course: {courseName}</p>}
          {grade && <p className="text-xs">Grade: {grade}</p>}
          <p className="text-xs text-muted-foreground mt-2">Click for details</p>
        </div>
      )
    }

    return content
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            onClick={onClick}
            className={`
              ${color}
              ${sizeClasses[size]}
              ${onClick ? 'cursor-pointer' : ''}
              inline-flex items-center gap-1.5 font-medium
              transition-all duration-200
              ${className}
            `}
          >
            <Icon className={`${iconSizes[size]} ${iconColor}`} />
            {showLabel && label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {typeof buildTooltipContent() === 'string' ? (
            <p>{buildTooltipContent()}</p>
          ) : (
            buildTooltipContent()
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Trust Score Badge (displays overall profile trust)
interface TrustScoreBadgeProps {
  score: number // 0-100
  verifiedProjects?: number
  verifiedGrades?: number
  videos?: number
  testsCompleted?: number
  professorEndorsements?: number
  onClick?: () => void
  className?: string
}

export function TrustScoreBadge({
  score,
  verifiedProjects = 0,
  verifiedGrades = 0,
  videos = 0,
  testsCompleted = 0,
  professorEndorsements = 0,
  onClick,
  className = ''
}: TrustScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: 'text-green-600'
    }
    if (score >= 75) return {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      icon: 'text-blue-600'
    }
    if (score >= 50) return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      icon: 'text-yellow-600'
    }
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      icon: 'text-gray-600'
    }
  }

  const colors = getScoreColor(score)

  const tooltipContent = (
    <div className="space-y-2">
      <p className="font-semibold">Profile Trust Score: {score}/100</p>
      <div className="space-y-1 text-xs">
        <p>✓ {verifiedProjects} University-Verified Projects</p>
        <p>✓ {verifiedGrades} Institution-Verified Grades</p>
        <p>✓ {videos} Video Presentations</p>
        <p>✓ {testsCompleted} Skills Tests Passed</p>
        <p>✓ {professorEndorsements} Professor Endorsements</p>
      </div>
      <p className="text-xs text-muted-foreground mt-2">This profile cannot be faked. All claims are verified.</p>
      {onClick && <p className="text-xs text-muted-foreground">Click for verification audit log</p>}
    </div>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            onClick={onClick}
            className={`
              ${colors.bg} ${colors.text} ${colors.border}
              ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
              inline-flex items-center gap-2 px-3 py-1.5 font-semibold
              transition-all duration-200
              ${className}
            `}
          >
            <Shield className={`h-4 w-4 ${colors.icon}`} />
            <span>Trust Score: {score}/100</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Fraud-Proof Badge (simple indicator)
export function FraudProofBadge({ onClick, className = '' }: { onClick?: () => void, className?: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            onClick={onClick}
            className={`
              bg-gradient-to-r from-green-100 to-blue-100
              text-green-800 border-green-300
              ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
              inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold
              transition-all duration-200
              ${className}
            `}
          >
            <ShieldCheck className="h-4 w-4 text-green-600" />
            FRAUD-PROOF PROFILE
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">This profile cannot be faked</p>
            <p className="text-xs">All projects and grades are institution-verified</p>
            <p className="text-xs text-muted-foreground mt-2">Click to view verification details</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
