'use client'

import { type LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'

interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'default' | 'outline'
}

export type EmptyStateTone = 'student' | 'company' | 'institution' | 'neutral'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: EmptyStateAction
  /** Optional secondary CTA — rendered as a smaller link-style button. */
  secondaryAction?: EmptyStateAction
  /**
   * Segment tone for the iconography + decorative backdrop.
   * Defaults to neutral (current behavior, fully backwards-compatible).
   */
  tone?: EmptyStateTone
  className?: string
}

const TONE_THEME: Record<
  EmptyStateTone,
  {
    blobA: string
    blobB: string
    iconBg: string
    iconText: string
    iconRing: string
    accentText: string
  }
> = {
  student: {
    blobA: 'from-violet-400/25 to-fuchsia-400/15',
    blobB: 'from-fuchsia-400/15 to-purple-400/25',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconText: 'text-white',
    iconRing: 'ring-violet-200 dark:ring-violet-800/40',
    accentText: 'text-violet-600 dark:text-violet-300',
  },
  company: {
    blobA: 'from-blue-400/25 to-cyan-400/15',
    blobB: 'from-cyan-400/15 to-teal-400/25',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    iconText: 'text-white',
    iconRing: 'ring-blue-200 dark:ring-blue-800/40',
    accentText: 'text-blue-600 dark:text-blue-300',
  },
  institution: {
    blobA: 'from-amber-400/25 to-orange-400/15',
    blobB: 'from-orange-400/15 to-rose-400/25',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    iconText: 'text-white',
    iconRing: 'ring-amber-200 dark:ring-amber-800/40',
    accentText: 'text-amber-600 dark:text-amber-300',
  },
  neutral: {
    blobA: 'from-slate-400/15 to-slate-300/10',
    blobB: 'from-slate-300/10 to-slate-400/15',
    iconBg: 'bg-muted',
    iconText: 'text-muted-foreground',
    iconRing: 'ring-transparent',
    accentText: 'text-muted-foreground',
  },
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  tone = 'neutral',
  className = '',
}: EmptyStateProps) {
  const theme = TONE_THEME[tone]
  const prefersReducedMotion = useReducedMotion()
  const isToned = tone !== 'neutral'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden py-12 px-4 text-center ${
        isToned ? 'rounded-2xl border border-border/40 bg-card/60' : ''
      } ${className}`}
    >
      {/* Decorative drifting blobs — purely cosmetic, hidden from a11y tree */}
      {isToned && (
        <>
          <motion.div
            aria-hidden
            className={`pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-br ${theme.blobA} blur-3xl`}
            animate={prefersReducedMotion ? undefined : { x: [0, 12, 0], y: [0, 8, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className={`pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-tr ${theme.blobB} blur-3xl`}
            animate={prefersReducedMotion ? undefined : { x: [0, -12, 0], y: [0, -8, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="relative">
        {/* Quieter icon presentation — small mono outline, no gradient tile.
            The icon is supportive, not the visual hook. */}
        <Icon className={`mx-auto h-6 w-6 mb-4 ${isToned ? theme.accentText : 'text-muted-foreground/50'}`} strokeWidth={1.6} />

        <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          {description}
        </p>

        {(action || secondaryAction) && (
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2">
            {action && (
              action.href ? (
                <Button variant={action.variant || 'default'} asChild>
                  <Link href={action.href as any}>{action.label}</Link>
                </Button>
              ) : action.onClick ? (
                <Button variant={action.variant || 'default'} onClick={action.onClick}>
                  {action.label}
                </Button>
              ) : null
            )}
            {secondaryAction && (
              secondaryAction.href ? (
                <Button variant="ghost" size="sm" asChild className={theme.accentText}>
                  <Link href={secondaryAction.href as any}>{secondaryAction.label}</Link>
                </Button>
              ) : secondaryAction.onClick ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={secondaryAction.onClick}
                  className={theme.accentText}
                >
                  {secondaryAction.label}
                </Button>
              ) : null
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
