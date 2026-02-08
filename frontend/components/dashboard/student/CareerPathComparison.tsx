'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Minus, TrendingDown, CheckCircle2, XCircle } from 'lucide-react'
import type { CareerPath } from '@/lib/skill-path'

interface CareerPathComparisonProps {
  paths: CareerPath[]
}

const trendConfig = {
  rising: { icon: TrendingUp, color: 'text-green-600', label: 'Rising demand' },
  stable: { icon: Minus, color: 'text-gray-500', label: 'Stable demand' },
  declining: { icon: TrendingDown, color: 'text-red-500', label: 'Declining demand' },
}

export function CareerPathComparison({ paths }: CareerPathComparisonProps) {
  if (paths.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-500">
        No career paths to compare yet. Add more projects and skills.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {paths.map((path, index) => {
        const trend = trendConfig[path.demandTrend]
        const TrendIcon = trend.icon

        const matchColor = path.matchScore >= 75
          ? 'text-green-600'
          : path.matchScore >= 50
            ? 'text-yellow-600'
            : 'text-red-600'

        return (
          <div
            key={index}
            className="p-4 bg-white border rounded-lg hover:border-gray-300 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{path.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{path.description}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <span className={`text-2xl font-bold ${matchColor}`}>
                  {path.matchScore}%
                </span>
                <p className="text-xs text-gray-500">match</p>
              </div>
            </div>

            {/* Match bar */}
            <Progress value={path.matchScore} className="h-2 mb-3" />

            {/* Skills breakdown */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Skills you have */}
              {path.presentSkills.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Skills you have
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {path.presentSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs bg-green-50 text-green-700 px-1.5 py-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing skills */}
              {path.missingSkills.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-400" />
                    Skills to learn
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {path.missingSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs text-red-600 border-red-200 px-1.5 py-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Demand trend */}
            <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
              <TrendIcon className="h-3 w-3" />
              {trend.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
