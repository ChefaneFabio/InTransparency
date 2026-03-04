'use client'

import { Badge } from '@/components/ui/badge'
import { Globe, CheckCircle } from 'lucide-react'

interface ErasmusBadgeProps {
  programType: string
  homeCountry: string
  hostCountry: string
  verifiedByHome: boolean
  verifiedByHost: boolean
  compact?: boolean
}

const COUNTRY_FLAGS: Record<string, string> = {
  IT: '🇮🇹', DE: '🇩🇪', FR: '🇫🇷', ES: '🇪🇸', UK: '🇬🇧', NL: '🇳🇱',
}

const PROGRAM_LABELS: Record<string, string> = {
  ERASMUS: 'Erasmus+',
  BILATERAL: 'Bilateral',
  FREE_MOVER: 'Free Mover',
}

export default function ErasmusBadge({
  programType,
  homeCountry,
  hostCountry,
  verifiedByHome,
  verifiedByHost,
  compact = false,
}: ErasmusBadgeProps) {
  const isFullyVerified = verifiedByHome && verifiedByHost
  const homeFlag = COUNTRY_FLAGS[homeCountry] || '🌍'
  const hostFlag = COUNTRY_FLAGS[hostCountry] || '🌍'
  const label = PROGRAM_LABELS[programType] || programType

  if (compact) {
    return (
      <Badge
        variant="outline"
        className={`text-xs ${
          isFullyVerified
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-blue-200 bg-blue-50 text-blue-700'
        }`}
      >
        <Globe className="h-3 w-3 mr-1" />
        {homeFlag} → {hostFlag}
        {isFullyVerified && <CheckCircle className="h-3 w-3 ml-1" />}
      </Badge>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <Globe className="h-4 w-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-800">
        {label}: {homeFlag} {homeCountry} → {hostFlag} {hostCountry}
      </span>
      {isFullyVerified && (
        <CheckCircle className="h-4 w-4 text-green-500" />
      )}
      {!isFullyVerified && (verifiedByHome || verifiedByHost) && (
        <span className="text-xs text-amber-600">Partially verified</span>
      )}
    </div>
  )
}
