'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { Sparkles, AlertTriangle } from 'lucide-react'

export type ScoreBucket = 'great' | 'strong' | 'ok' | 'weak' | 'blocked' | 'unknown'

export interface FitScoreTileProps {
  /** 0-100. If null, renders the dashed empty state. */
  score: number | null
  /** Tile label shown below the number ("skills", "fit", etc). */
  label?: string
  /** Size. `lg` = 64x64 (with progress ring), `md` = 56x56, `sm` = 44x44. */
  size?: 'sm' | 'md' | 'lg'
  /** Show dealbreaker variant regardless of score. */
  dealBreakerHit?: boolean
  dealBreakerReason?: string
  /** Disable the count-up animation. */
  animate?: boolean
  /** Render a radial progress ring around the number (auto-on for `lg`). */
  ring?: boolean
  className?: string
}

const bucketFor = (score: number, dealBreakerHit?: boolean): ScoreBucket => {
  if (dealBreakerHit) return 'blocked'
  if (score >= 75) return 'great'
  if (score >= 60) return 'strong'
  if (score >= 40) return 'ok'
  return 'weak'
}

const BUCKETS: Record<ScoreBucket, {
  bg: string
  text: string
  ring: string
  label: string
  stroke: string
  shadow: string
}> = {
  great: {
    bg: 'bg-gradient-to-br from-emerald-50 via-emerald-100/80 to-emerald-50 dark:from-emerald-950/60 dark:via-emerald-900/40 dark:to-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-200',
    ring: 'border-emerald-200/80 dark:border-emerald-800/80',
    label: 'text-emerald-700/70 dark:text-emerald-300/70',
    stroke: 'stroke-emerald-500 dark:stroke-emerald-400',
    shadow: 'shadow-[0_0_24px_-8px_rgba(16,185,129,0.4)]',
  },
  strong: {
    bg: 'bg-gradient-to-br from-blue-50 via-blue-100/80 to-blue-50 dark:from-blue-950/60 dark:via-blue-900/40 dark:to-blue-950/60',
    text: 'text-blue-700 dark:text-blue-200',
    ring: 'border-blue-200/80 dark:border-blue-800/80',
    label: 'text-blue-700/70 dark:text-blue-300/70',
    stroke: 'stroke-blue-500 dark:stroke-blue-400',
    shadow: 'shadow-[0_0_24px_-8px_rgba(59,130,246,0.35)]',
  },
  ok: {
    bg: 'bg-gradient-to-br from-amber-50 via-amber-100/80 to-amber-50 dark:from-amber-950/60 dark:via-amber-900/40 dark:to-amber-950/60',
    text: 'text-amber-700 dark:text-amber-200',
    ring: 'border-amber-200/80 dark:border-amber-800/80',
    label: 'text-amber-700/70 dark:text-amber-300/70',
    stroke: 'stroke-amber-500 dark:stroke-amber-400',
    shadow: 'shadow-[0_0_24px_-8px_rgba(245,158,11,0.3)]',
  },
  weak: {
    bg: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'border-slate-200/80 dark:border-slate-700/80',
    label: 'text-slate-600/70 dark:text-slate-400/70',
    stroke: 'stroke-slate-400 dark:stroke-slate-500',
    shadow: '',
  },
  blocked: {
    bg: 'bg-gradient-to-br from-red-50 via-red-100/80 to-red-50 dark:from-red-950/60 dark:via-red-900/40 dark:to-red-950/60',
    text: 'text-red-700 dark:text-red-200',
    ring: 'border-red-200/80 dark:border-red-800/80',
    label: 'text-red-700/70 dark:text-red-300/70',
    stroke: 'stroke-red-500 dark:stroke-red-400',
    shadow: 'shadow-[0_0_24px_-8px_rgba(239,68,68,0.35)]',
  },
  unknown: {
    bg: 'bg-gradient-to-br from-slate-50/60 to-white dark:from-slate-900/40 dark:to-slate-950',
    text: 'text-muted-foreground',
    ring: 'border-dashed border-slate-300 dark:border-slate-700',
    label: 'text-muted-foreground/60',
    stroke: 'stroke-slate-300',
    shadow: '',
  },
}

const SIZES: Record<NonNullable<FitScoreTileProps['size']>, {
  wrap: string
  svg: number
  radius: number
  number: string
  label: string
  icon: string
}> = {
  lg: { wrap: 'w-16 h-16 rounded-2xl', svg: 64, radius: 26, number: 'text-xl', label: 'text-[10px]', icon: 'h-5 w-5' },
  md: { wrap: 'w-14 h-14 rounded-xl',  svg: 56, radius: 22, number: 'text-lg', label: 'text-[9px]',  icon: 'h-4 w-4' },
  sm: { wrap: 'w-11 h-11 rounded-lg',  svg: 44, radius: 17, number: 'text-sm', label: 'text-[8px]',  icon: 'h-3.5 w-3.5' },
}

function AnimatedNumber({ to, enabled = true }: { to: number; enabled?: boolean }) {
  const v = useMotionValue(enabled ? 0 : to)
  const rounded = useTransform(v, val => Math.round(val))
  useEffect(() => {
    if (!enabled) { v.set(to); return }
    const controls = animate(v, to, { duration: 1.0, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [to, enabled, v])
  return <motion.span>{rounded}</motion.span>
}

export default function FitScoreTile({
  score,
  label = 'fit',
  size = 'md',
  dealBreakerHit,
  dealBreakerReason,
  animate: anim = true,
  ring,
  className = '',
}: FitScoreTileProps) {
  const sizes = SIZES[size]
  const showRing = ring ?? size === 'lg'

  // Empty / unknown state
  if (score === null) {
    const c = BUCKETS.unknown
    return (
      <div
        className={`relative ${sizes.wrap} border ${c.bg} ${c.ring} flex flex-col items-center justify-center ${className}`}
        title={`${label} score pending — complete your fit profile`}
      >
        <Sparkles className={`${sizes.icon} ${c.text} opacity-40`} />
        <span className={`${sizes.label} uppercase tracking-wide mt-0.5 ${c.label}`}>
          {label}
        </span>
      </div>
    )
  }

  const bucket = bucketFor(score, dealBreakerHit)
  const c = BUCKETS[bucket]
  const circumference = 2 * Math.PI * sizes.radius

  return (
    <motion.div
      initial={anim ? { scale: 0.85, opacity: 0 } : false}
      animate={anim ? { scale: 1, opacity: 1 } : false}
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative ${sizes.wrap} border ${c.bg} ${c.ring} ${c.shadow} flex flex-col items-center justify-center overflow-hidden ${className}`}
      title={dealBreakerHit ? dealBreakerReason || 'Dealbreaker triggered' : `${label}: ${score}`}
    >
      {/* Radial progress ring — premium feel, InTransparency style */}
      {showRing && !dealBreakerHit && (
        <svg
          className="absolute inset-0 -rotate-90 pointer-events-none"
          viewBox={`0 0 ${sizes.svg} ${sizes.svg}`}
          aria-hidden="true"
        >
          <circle
            cx={sizes.svg / 2}
            cy={sizes.svg / 2}
            r={sizes.radius}
            strokeWidth={2.5}
            className="fill-none stroke-slate-200/40 dark:stroke-slate-700/40"
          />
          <motion.circle
            cx={sizes.svg / 2}
            cy={sizes.svg / 2}
            r={sizes.radius}
            strokeWidth={2.5}
            strokeLinecap="round"
            className={`fill-none ${c.stroke}`}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: anim ? circumference : circumference - (score / 100) * circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      )}

      <span className={`${sizes.number} font-bold leading-none tabular-nums ${c.text} relative z-10`}>
        {dealBreakerHit ? (
          <AlertTriangle className={sizes.icon} />
        ) : (
          <AnimatedNumber to={score} enabled={anim} />
        )}
      </span>
      <span className={`${sizes.label} uppercase tracking-wide mt-0.5 font-medium ${c.label} relative z-10`}>
        {dealBreakerHit ? 'blocked' : label}
      </span>
    </motion.div>
  )
}
