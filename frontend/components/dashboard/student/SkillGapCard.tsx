'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, TrendingUp, AlertTriangle, ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { SkillGap } from '@/lib/skill-path'

interface SkillGapCardProps {
  gap: SkillGap
}

export function SkillGapCard({ gap }: SkillGapCardProps) {
  const t = useTranslations('skillPath.gaps')

  const priorityConfig = {
    critical: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle, label: t('critical') },
    high: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: ArrowUp, label: t('high') },
    medium: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: TrendingUp, label: t('medium') },
    low: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: TrendingUp, label: t('low') },
  }

  const config = priorityConfig[gap.priority]
  const PriorityIcon = config.icon

  return (
    <div className="p-4 bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 rounded-xl hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-sm text-foreground">{gap.skill}</h4>
          <span className="text-xs text-muted-foreground capitalize">{gap.category}</span>
        </div>
        <Badge className={`${config.color} text-[10px]`} variant="secondary">
          <PriorityIcon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t('yourLevel')}</span>
            <span className="font-medium">{gap.currentLevel}%</span>
          </div>
          <Progress value={gap.currentLevel} className="h-1.5" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t('targetLevel')}</span>
            <span className="font-medium">{gap.targetLevel}%</span>
          </div>
          <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-purple-300 dark:bg-purple-600 rounded-full" style={{ width: `${gap.targetLevel}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{gap.demand}% {t('demand')}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />~{gap.estimatedHours}h {t('toLearn')}</span>
        <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" />+{gap.impact} {t('impact')}</span>
      </div>
    </div>
  )
}
