'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

interface TopFactor {
  factor: string
  impact: number
  description: string
}

interface PredictionData {
  probability: number
  topFactors: TopFactor[]
  generatedAt: string
  cached: boolean
}

interface Props {
  studentId: string
  compact?: boolean
}

export default function PlacementProbabilityBadge({ studentId, compact = false }: Props) {
  const [data, setData] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await fetch(`/api/predictions/${studentId}`)
        if (res.ok) {
          setData(await res.json())
        }
      } catch {
        // Silently fail — badge just doesn't show
      } finally {
        setLoading(false)
      }
    }
    fetchPrediction()
  }, [studentId])

  if (loading || !data) return null

  const pct = Math.round(data.probability * 100)

  const getColor = (p: number) => {
    if (p >= 75) return { bg: 'bg-primary/10', text: 'text-green-700', border: 'border-green-300' }
    if (p >= 50) return { bg: 'bg-primary/10', text: 'text-blue-700', border: 'border-blue-300' }
    if (p >= 25) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' }
    return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' }
  }

  const colors = getColor(pct)

  if (compact) {
    return (
      <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
        <TrendingUp className="mr-1 h-3 w-3" />
        {pct}% placement
      </Badge>
    )
  }

  return (
    <Card className={`border ${colors.border}`}>
      <CardContent className="p-4">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-5 w-5 ${colors.text}`} />
            <span className="font-semibold text-gray-900">
              {pct}% placement probability
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {expanded && data.topFactors.length > 0 && (
          <div className="mt-3 space-y-2 border-t pt-3">
            <p className="text-xs text-gray-500 font-medium">Key factors:</p>
            {data.topFactors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span
                  className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    factor.impact > 0 ? 'bg-primary/50' : 'bg-red-400'
                  }`}
                />
                <span className="text-gray-700">{factor.description}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
