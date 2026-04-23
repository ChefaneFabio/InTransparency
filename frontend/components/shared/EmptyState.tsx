'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: ReactNode
  /** Optional action slot — any button or link. */
  action?: ReactNode
  /** Tweaks the look for inline cards vs full-page empties. */
  size?: 'sm' | 'md' | 'lg'
  /** Subtle gradient variant for hero-like empties. */
  gradient?: 'none' | 'primary' | 'emerald' | 'blue'
  className?: string
}

const SIZE: Record<NonNullable<EmptyStateProps['size']>, { wrap: string; icon: string; title: string; desc: string }> = {
  sm: { wrap: 'py-8 px-4',  icon: 'h-8 w-8',   title: 'text-sm font-semibold', desc: 'text-xs' },
  md: { wrap: 'py-12 px-6', icon: 'h-10 w-10', title: 'text-base font-semibold', desc: 'text-sm' },
  lg: { wrap: 'py-16 px-8', icon: 'h-12 w-12', title: 'text-lg font-bold', desc: 'text-sm' },
}

const GRAD: Record<NonNullable<EmptyStateProps['gradient']>, string> = {
  none: '',
  primary: 'bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/10',
  emerald: 'bg-gradient-to-br from-emerald-50/60 via-background to-emerald-100/40 border-emerald-200/50 dark:from-emerald-950/20 dark:to-emerald-900/10 dark:border-emerald-900/40',
  blue: 'bg-gradient-to-br from-blue-50/60 via-background to-blue-100/40 border-blue-200/50 dark:from-blue-950/20 dark:to-blue-900/10 dark:border-blue-900/40',
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = 'md',
  gradient = 'none',
  className = '',
}: EmptyStateProps) {
  const s = SIZE[size]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border ${GRAD[gradient]} ${s.wrap} text-center ${className}`}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-3 mb-3"
        >
          <Icon className={`${s.icon} text-primary/70`} />
        </motion.div>
      )}
      <h3 className={`${s.title}`}>{title}</h3>
      {description && (
        <p className={`${s.desc} text-muted-foreground max-w-md mx-auto mt-1.5`}>
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </motion.div>
  )
}
