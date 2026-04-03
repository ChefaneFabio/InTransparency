'use client'

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type StatVariant = 'blue' | 'purple' | 'amber' | 'green' | 'rose' | 'slate'

const gradients: Record<StatVariant, string> = {
  blue: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
  purple: 'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20',
  amber: 'from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20',
  green: 'from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20',
  rose: 'from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20',
  slate: 'from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/20',
}

const iconColors: Record<StatVariant, string> = {
  blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400',
  purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400',
  amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400',
  green: 'text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400',
  rose: 'text-rose-600 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-400',
  slate: 'text-slate-600 bg-slate-100 dark:bg-slate-900/40 dark:text-slate-400',
}

interface StatCardProps {
  label: string
  value: number
  icon: ReactNode
  variant?: StatVariant
  trend?: number | null // positive = up, negative = down, null = no trend
  suffix?: string
  prefix?: string
}

export function StatCard({ label, value, icon, variant = 'blue', trend = null, suffix, prefix }: StatCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradients[variant]} border-0 shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-1">
              <AnimatedCounter value={value} className="text-2xl font-bold text-foreground" prefix={prefix} suffix={suffix} />
            </div>
            {trend !== null && trend !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-medium ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-rose-600' : 'text-muted-foreground'
              }`}>
                {trend > 0 ? <TrendingUp className="h-3 w-3" /> : trend < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                <span>{trend > 0 ? '+' : ''}{trend}%</span>
              </div>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${iconColors[variant]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
