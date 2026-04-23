'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Sparkles,
  Target,
  Flame,
  Users,
  Briefcase,
  Building2,
  Tag,
  MapPin,
  type LucideIcon,
} from 'lucide-react'
import type { FitScore } from '@/lib/fit-profile'

type AxisKey = keyof Pick<
  FitScore,
  'skills' | 'intent' | 'motivation' | 'cultureFit' | 'position' | 'dimension' | 'industry' | 'geography'
>

const AXES: Array<{ key: AxisKey; label: string; icon: LucideIcon }> = [
  { key: 'skills', label: 'Skills', icon: Sparkles },
  { key: 'intent', label: 'Goal alignment', icon: Target },
  { key: 'motivation', label: 'Motivation', icon: Flame },
  { key: 'cultureFit', label: 'Culture fit', icon: Users },
  { key: 'position', label: 'Position', icon: Briefcase },
  { key: 'dimension', label: 'Company dimension', icon: Building2 },
  { key: 'industry', label: 'Industry', icon: Tag },
  { key: 'geography', label: 'Geography', icon: MapPin },
]

// Gradient bar colors per bucket — subtle left-to-right shimmer, matches
// FitScoreTile palette so the whole experience feels of a piece.
const barStyle = (score: number): { grad: string; text: string; iconBg: string; iconText: string } => {
  if (score >= 75) return {
    grad: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  }
  if (score >= 50) return {
    grad: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconText: 'text-blue-600 dark:text-blue-400',
  }
  if (score >= 25) return {
    grad: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    iconText: 'text-amber-600 dark:text-amber-400',
  }
  return {
    grad: 'bg-gradient-to-r from-red-400 via-red-500 to-red-400',
    text: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/50',
    iconText: 'text-red-500 dark:text-red-400',
  }
}

export interface FitScoreBreakdownProps {
  score: FitScore
  delay?: number
}

export default function FitScoreBreakdown({ score, delay = 0 }: FitScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      {score.dealBreakerHit && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-200/70 bg-gradient-to-r from-red-50 via-red-100/60 to-red-50 dark:from-red-950/40 dark:via-red-900/30 dark:to-red-950/40 dark:border-red-900/60 p-3 flex items-start gap-2.5 shadow-[0_0_24px_-12px_rgba(239,68,68,0.4)]"
        >
          <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/60 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-red-700 dark:text-red-300">Dealbreaker</div>
            <div className="text-red-700/80 dark:text-red-400/80 mt-0.5">
              {score.dealBreakerReason || 'A hard no was triggered.'}
            </div>
          </div>
        </motion.div>
      )}

      {AXES.map((a, i) => {
        const axis = score[a.key]
        const s = barStyle(axis.score)
        const Icon = a.icon
        return (
          <motion.div
            key={a.key}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.04, duration: 0.28 }}
            className="text-xs"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className={`w-6 h-6 rounded-md ${s.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-3 w-3 ${s.iconText}`} />
              </div>
              <span className="font-medium flex-1">{a.label}</span>
              <span className={`font-semibold tabular-nums ${s.text}`}>
                {axis.score}
              </span>
            </div>
            {/* Track with glass-morphism feel */}
            <div className="h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden ml-8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${axis.score}%` }}
                transition={{ delay: delay + i * 0.04 + 0.15, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full ${s.grad} relative`}
              >
                {/* Subtle shimmer sweep — hints at the data freshness */}
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '300%' }}
                  transition={{ delay: delay + i * 0.04 + 0.9, duration: 1.2, ease: 'easeInOut' }}
                />
              </motion.div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug pl-8">
              {axis.reason}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
