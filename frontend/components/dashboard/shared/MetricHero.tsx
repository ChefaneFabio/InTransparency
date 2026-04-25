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
    | 'student'
    | 'studentDark'
    | 'company'
    | 'companyDark'
  className?: string
  /** Disable the animated gradient blobs. */
  quiet?: boolean
}

/**
 * Hero container used on every dashboard page header. Cascades to 30+ pages.
 *
 * Aesthetic: restrained, gallery-quiet. Colors are tints, not fills.
 * Each palette is a *suggestion* of warmth/coolness rather than a saturated
 * brand block. The dark variant uses warm-cool slate-stone instead of pure
 * cold slate.
 *
 * `institution` / `institutionDark` lean warm stone + bronze + muted plum.
 * `student` / `studentDark` lean cool violet + soft plum.
 * `company` / `companyDark` lean steel blue + slate.
 * Older saturated names (primary/blue/purple/green/amber/dark) are kept
 * for compatibility but were softened in the same pass.
 */
const LIGHT_GRADIENTS: Record<string, string> = {
  primary:         'from-primary/8 via-primary/4 to-background',
  blue:            'from-blue-500/6 via-blue-400/3 to-background',
  purple:          'from-purple-500/6 via-purple-400/3 to-background',
  green:           'from-emerald-500/6 via-emerald-400/3 to-background',
  amber:           'from-amber-500/8 via-amber-400/3 to-background',
  dark:            'from-slate-900 via-slate-800 to-slate-900',
  institution:     'from-stone-100/70 via-amber-50/30 to-background',
  institutionDark: 'from-stone-950 via-stone-900 to-amber-950/40',
  student:         'from-violet-50/60 via-purple-50/30 to-background',
  studentDark:     'from-slate-950 via-violet-950/30 to-slate-900',
  company:         'from-slate-100/60 via-blue-50/30 to-background',
  companyDark:     'from-slate-950 via-slate-900 to-blue-950/40',
}

const BLOB_COLORS: Record<string, { a: string; b: string }> = {
  primary:         { a: 'from-primary/15',       b: 'from-violet-500/10' },
  blue:            { a: 'from-blue-500/14',      b: 'from-cyan-500/10' },
  purple:          { a: 'from-purple-500/14',    b: 'from-pink-500/10' },
  green:           { a: 'from-emerald-500/14',   b: 'from-teal-500/10' },
  amber:           { a: 'from-amber-500/14',     b: 'from-orange-500/10' },
  dark:            { a: 'from-violet-500/15',    b: 'from-blue-500/10' },
  // Bronze + plum — paper hall, not admin SaaS
  institution:     { a: 'from-amber-700/14',     b: 'from-rose-700/8' },
  institutionDark: { a: 'from-amber-500/16',     b: 'from-rose-400/10' },
  // Refined plum + ink violet
  student:         { a: 'from-violet-500/14',    b: 'from-fuchsia-400/8' },
  studentDark:     { a: 'from-violet-500/18',    b: 'from-fuchsia-400/10' },
  // Steel + soft mineral
  company:         { a: 'from-blue-500/12',      b: 'from-slate-500/8' },
  companyDark:     { a: 'from-blue-400/14',      b: 'from-cyan-400/8' },
}

export function MetricHero({ children, gradient = 'primary', className = '', quiet = false }: MetricHeroProps) {
  const isDark =
    gradient === 'dark' ||
    gradient === 'institutionDark' ||
    gradient === 'studentDark' ||
    gradient === 'companyDark'
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
