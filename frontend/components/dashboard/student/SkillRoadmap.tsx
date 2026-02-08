'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Hammer, Award, Send } from 'lucide-react'
import type { RoadmapMilestone } from '@/lib/skill-path'

interface SkillRoadmapProps {
  milestones: RoadmapMilestone[]
}

const typeConfig = {
  learn: { icon: BookOpen, color: 'bg-blue-500', bgLight: 'bg-blue-50 border-blue-200', label: 'Learn' },
  build: { icon: Hammer, color: 'bg-green-500', bgLight: 'bg-green-50 border-green-200', label: 'Build' },
  certify: { icon: Award, color: 'bg-purple-500', bgLight: 'bg-purple-50 border-purple-200', label: 'Certify' },
  apply: { icon: Send, color: 'bg-orange-500', bgLight: 'bg-orange-50 border-orange-200', label: 'Apply' },
}

export function SkillRoadmap({ milestones }: SkillRoadmapProps) {
  if (milestones.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-500">
        No roadmap milestones to show yet
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const config = typeConfig[milestone.type]
          const Icon = config.icon

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative flex gap-4"
            >
              {/* Timeline dot */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${config.color} flex-shrink-0`}>
                <Icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className={`flex-1 p-3 rounded-lg border ${config.bgLight}`}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {milestone.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {milestone.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0 ml-2">
                    {config.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-500">
                    Week {milestone.weekNumber}
                    {milestone.duration > 1 ? ` - ${milestone.weekNumber + milestone.duration - 1}` : ''}
                  </span>
                  <div className="flex gap-1">
                    {milestone.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs px-1.5 py-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
