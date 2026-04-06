'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Hammer, Award, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { RoadmapMilestone } from '@/lib/skill-path'

interface SkillRoadmapProps {
  milestones: RoadmapMilestone[]
}

export function SkillRoadmap({ milestones }: SkillRoadmapProps) {
  const t = useTranslations('skillPath.roadmap')

  const typeConfig = {
    learn: { icon: BookOpen, color: 'bg-primary/50', bgLight: 'bg-primary/5 border-primary/20', label: t('learn') },
    build: { icon: Hammer, color: 'bg-primary/50', bgLight: 'bg-primary/5 border-primary/20', label: t('build') },
    certify: { icon: Award, color: 'bg-primary/50', bgLight: 'bg-primary/5 border-primary/20', label: t('certify') },
    apply: { icon: Send, color: 'bg-amber-500', bgLight: 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30', label: t('apply') },
  }

  if (milestones.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        {t('empty')}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const config = typeConfig[milestone.type]
          const Icon = config.icon
          return (
            <motion.div key={milestone.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.3 }} className="relative flex gap-4">
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${config.color} flex-shrink-0`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className={`flex-1 p-3 rounded-lg border ${config.bgLight}`}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{milestone.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{milestone.description}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] flex-shrink-0 ml-2">{config.label}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {t('week')} {milestone.weekNumber}{milestone.duration > 1 ? ` — ${milestone.weekNumber + milestone.duration - 1}` : ''}
                  </span>
                  <div className="flex gap-1">
                    {milestone.skills.map(skill => <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">{skill}</Badge>)}
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
