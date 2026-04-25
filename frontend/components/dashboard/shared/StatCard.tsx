'use client'

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type StatVariant = 'blue' | 'purple' | 'amber' | 'green' | 'rose' | 'slate'

/**
 * Color is now used only for the small icon tile + a subtle left-edge
 * accent — the card surface stays neutral (bg-card) so a row of stat
 * cards reads as a quiet grid, not a rainbow. Icon-tile saturation is
 * ~50% lower than before (50/950→100, 100/900→50/30 swap drops it).
 */
const iconColors: Record<StatVariant, string> = {
  blue:   'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300',
  purple: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-300',
  amber:  'text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-300',
  green:  'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300',
  rose:   'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-300',
  slate:  'text-slate-600 bg-slate-50 dark:bg-slate-900/40 dark:text-slate-300',
}

const accentBars: Record<StatVariant, string> = {
  blue:   'bg-blue-500/60',
  purple: 'bg-purple-500/60',
  amber:  'bg-amber-500/60',
  green:  'bg-emerald-500/60',
  rose:   'bg-rose-500/60',
  slate:  'bg-slate-400/40',
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
    <Card className="relative overflow-hidden bg-card border shadow-sm hover:shadow-md transition-shadow">
      {/* Hairline accent on the left edge — color signal without dominating the card */}
      <span aria-hidden className={`absolute left-0 top-0 bottom-0 w-0.5 ${accentBars[variant]}`} />
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-1">
              <AnimatedCounter value={value} className="text-2xl font-bold text-foreground" prefix={prefix} suffix={suffix} />
            </div>
            {trend !== null && trend !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-medium ${
                trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-muted-foreground'
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
