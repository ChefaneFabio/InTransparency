'use client'

import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import { normalizeGrade, type EctsGradeLetter } from '@/lib/grades/ects-normalization'
import { cn } from '@/lib/utils'

interface EctsGradeBadgeProps {
  grade: string
  country: string
  showOriginal?: boolean
  className?: string
}

const GRADE_COLORS: Record<EctsGradeLetter, string> = {
  A: 'bg-green-100 text-green-800 border-green-200',
  B: 'bg-blue-100 text-blue-800 border-blue-200',
  C: 'bg-teal-100 text-teal-800 border-teal-200',
  D: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  E: 'bg-orange-100 text-orange-800 border-orange-200',
  F: 'bg-red-100 text-red-800 border-red-200',
}

export function EctsGradeBadge({ grade, country, showOriginal = false, className }: EctsGradeBadgeProps) {
  const t = useTranslations('grades')
  const result = normalizeGrade(grade, country)

  if (!result) return null

  const colorClass = GRADE_COLORS[result.ectsGrade]
  const label = t(`ects.${result.ectsGrade}`)

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {showOriginal && (
        <span className="text-sm text-muted-foreground">{grade}</span>
      )}
      <Badge
        variant="outline"
        className={cn(colorClass, 'font-medium')}
      >
        {result.ectsGrade} &middot; {label}
      </Badge>
    </span>
  )
}
