'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, TrendingUp, AlertTriangle, ArrowUp } from 'lucide-react'
import type { SkillGap } from '@/lib/skill-path'

interface SkillGapCardProps {
  gap: SkillGap
}

const priorityConfig = {
  critical: { color: 'bg-red-100 text-red-700', icon: AlertTriangle, label: 'Critical' },
  high: { color: 'bg-orange-100 text-orange-700', icon: ArrowUp, label: 'High' },
  medium: { color: 'bg-yellow-100 text-yellow-700', icon: TrendingUp, label: 'Medium' },
  low: { color: 'bg-green-100 text-green-700', icon: TrendingUp, label: 'Low' },
}

export function SkillGapCard({ gap }: SkillGapCardProps) {
  const config = priorityConfig[gap.priority]
  const PriorityIcon = config.icon

  return (
    <div className="p-4 bg-white border rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{gap.skill}</h4>
          <span className="text-xs text-gray-500 capitalize">{gap.category}</span>
        </div>
        <Badge className={`${config.color} text-xs`} variant="secondary">
          <PriorityIcon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      {/* Skill level bars */}
      <div className="space-y-2 mb-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Your Level</span>
            <span className="font-medium">{gap.currentLevel}%</span>
          </div>
          <Progress value={gap.currentLevel} className="h-1.5" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Target Level</span>
            <span className="font-medium">{gap.targetLevel}%</span>
          </div>
          <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-purple-300 rounded-full"
              style={{ width: `${gap.targetLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {gap.demand}% demand
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          ~{gap.estimatedHours}h to learn
        </span>
        <span className="flex items-center gap-1">
          <ArrowUp className="h-3 w-3" />
          +{gap.impact} impact
        </span>
      </div>
    </div>
  )
}
