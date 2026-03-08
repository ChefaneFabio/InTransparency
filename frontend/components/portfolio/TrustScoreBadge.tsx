'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Shield, ChevronDown, ChevronUp } from 'lucide-react'

interface ScoreData {
  score: number
  badgeLevel: string
  verificationScore: number
  endorsementScore: number
  completenessScore: number
  aiAnalysisScore: number
  activityScore: number
  predictionScore: number
}

interface Props {
  userId: string
  compact?: boolean
}

const levelConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PLATINUM: { label: 'Platinum', color: 'text-purple-700', bg: 'bg-primary/10', border: 'border-purple-300' },
  GOLD: { label: 'Gold', color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-300' },
  SILVER: { label: 'Silver', color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' },
  BRONZE: { label: 'Bronze', color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300' },
}

const componentLabels: Record<string, string> = {
  verificationScore: 'Verification',
  endorsementScore: 'Endorsements',
  completenessScore: 'Completeness',
  aiAnalysisScore: 'AI Analysis',
  activityScore: 'Activity',
  predictionScore: 'Prediction',
}

export default function TrustScoreBadge({ userId, compact = false }: Props) {
  const [data, setData] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await fetch(`/api/portfolio-score/${userId}`)
        if (res.ok) {
          setData(await res.json())
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchScore()
  }, [userId])

  if (loading || !data) return null

  const level = levelConfig[data.badgeLevel] || levelConfig.BRONZE

  if (compact) {
    return (
      <Badge className={`${level.bg} ${level.color} border ${level.border}`}>
        <Shield className="mr-1 h-3 w-3" />
        {data.score} · {level.label}
      </Badge>
    )
  }

  return (
    <Card className={`border ${level.border}`}>
      <CardContent className="p-4">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${level.bg} flex items-center justify-center`}>
              <span className={`text-lg font-bold ${level.color}`}>{data.score}</span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Trust Score</p>
              <Badge className={`text-xs ${level.bg} ${level.color}`}>
                {level.label}
              </Badge>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {expanded && (
          <div className="mt-4 space-y-2 border-t pt-3">
            {Object.entries(componentLabels).map(([key, label]) => {
              const value = data[key as keyof ScoreData] as number
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium">{value}/100</span>
                  </div>
                  <Progress value={value} className="h-1.5" />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
