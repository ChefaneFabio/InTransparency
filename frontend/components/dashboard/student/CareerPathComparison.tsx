'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Minus, TrendingDown, CheckCircle2, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CareerPath } from '@/lib/skill-path'

interface CareerPathComparisonProps {
  paths: CareerPath[]
}

export function CareerPathComparison({ paths }: CareerPathComparisonProps) {
  const t = useTranslations('skillPath.careerPaths')

  const trendConfig = {
    rising: { icon: TrendingUp, color: 'text-primary', label: t('risingDemand') },
    stable: { icon: Minus, color: 'text-muted-foreground', label: t('stableDemand') },
    declining: { icon: TrendingDown, color: 'text-destructive', label: t('decliningDemand') },
  }

  if (paths.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        {t('empty')}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {paths.map((path, index) => {
        const trend = trendConfig[path.demandTrend]
        const TrendIcon = trend.icon

        return (
          <div key={index} className="p-4 bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm text-foreground">{path.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{path.description}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <span className="text-2xl font-bold text-primary">{path.matchScore}%</span>
                <p className="text-[10px] text-muted-foreground">{t('match')}</p>
              </div>
            </div>

            <Progress value={path.matchScore} className="h-1.5 mb-3" />

            <div className="grid grid-cols-2 gap-3 mb-3">
              {path.presentSkills.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {t('skillsYouHave')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {path.presentSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {path.missingSkills.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-amber-500" />
                    {t('skillsToLearn')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {path.missingSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-[10px] text-amber-700 border-amber-200 dark:text-amber-400 px-1.5 py-0">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
