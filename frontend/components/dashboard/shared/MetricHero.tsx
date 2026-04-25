'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MetricHeroProps {
  children: ReactNode
  gradient?:
    | 'primary'
    | 'blue'
    | 'purple'
    | 'green'
    | 'amber'
    | 'dark'
    | 'institution'
    | 'institutionDark'
  className?: string
  /** Disable the animated gradient blobs. */
  quiet?: boolean
}

/**
 * Hero container used on every dashboard page header. Upgraded to
 * InTransparency style: drifting gradient blobs + subtle grid overlay +
 * pop-in motion. One file, cascades to 30+ pages.
 *
 * `institution` / `institutionDark` are the refined "scholarly archival"
 * palette — warm stone + bronze + muted plum. Used across
 * /dashboard/university/* to give institutions a distinctive aesthetic
 * separate from the cool generic-corporate primary/blue palette.
 */
const LIGHT_GRADIENTS: Record<string, string> = {
  primary:         'from-primary/15 via-primary/8 to-background',
  blue:            'from-blue-600/10 via-blue-500/5 to-background',
  purple:          'from-purple-600/10 via-purple-500/5 to-background',
  green:           'from-emerald-600/10 via-emerald-500/5 to-background',
  amber:           'from-amber-500/15 via-amber-500/5 to-background',
  dark:            'from-slate-900 via-slate-800 to-slate-900',
  institution:     'from-stone-100/80 via-amber-50/40 to-background',
  institutionDark: 'from-stone-950 via-amber-950/30 to-stone-900',
}

const BLOB_COLORS: Record<string, { a: string; b: string }> = {
  primary:         { a: 'from-primary/25',       b: 'from-violet-500/20' },
  blue:            { a: 'from-blue-500/25',      b: 'from-cyan-500/20' },
  purple:          { a: 'from-purple-500/25',    b: 'from-pink-500/20' },
  green:           { a: 'from-emerald-500/25',   b: 'from-teal-500/20' },
  amber:           { a: 'from-amber-500/25',     b: 'from-orange-500/20' },
  dark:            { a: 'from-violet-500/25',    b: 'from-blue-500/20' },
  // Bronze + plum — feels like a paper hall, not an admin SaaS
  institution:     { a: 'from-amber-700/20',     b: 'from-rose-700/12' },
  institutionDark: { a: 'from-amber-500/25',     b: 'from-rose-400/15' },
}

export function MetricHero({ children, gradient = 'primary', className = '', quiet = false }: MetricHeroProps) {
  const isDark = gradient === 'dark' || gradient === 'institutionDark'
  const blobs = BLOB_COLORS[gradient] || BLOB_COLORS.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${LIGHT_GRADIENTS[gradient]}
        ${isDark ? 'text-white' : ''}
        border ${isDark ? 'border-slate-700/60' : 'border-slate-200/60 dark:border-slate-800/60'}
        p-6 md:p-8
        ${className}
      `}
    >
      {!quiet && (
        <>
          {/* Drifting gradient blob — top right */}
          <motion.div
            aria-hidden
            className={`absolute -top-32 -right-24 w-80 h-80 rounded-full bg-gradient-to-br ${blobs.a} to-transparent blur-3xl`}
            animate={{ x: [0, 20, 0], y: [0, -10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Drifting gradient blob — bottom left, phase-offset */}
          <motion.div
            aria-hidden
            className={`absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr ${blobs.b} to-transparent blur-3xl`}
            animate={{ x: [0, -18, 0], y: [0, 8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Subtle grid overlay — technical InTransparency signature */}
          <div
            aria-hidden
            className={`absolute inset-0 pointer-events-none ${isDark ? 'opacity-[0.05]' : 'opacity-[0.03]'}`}
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)'
                : 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </>
      )}
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
