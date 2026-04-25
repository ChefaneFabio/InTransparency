'use client'

import { Link } from '@/navigation'
import { Sparkles, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export type PremiumAudience = 'student' | 'institution' | 'company'

const COPY: Record<PremiumAudience, { label: string; href: string; tooltip: string }> = {
  student: {
    label: 'Premium',
    href: '/dashboard/student/upgrade',
    tooltip: 'Student Premium feature · €3.99/mo or €29/yr (free for partner-institution students)',
  },
  institution: {
    label: 'Institutional Premium',
    href: '/dashboard/university/billing?addon=institutional-premium',
    tooltip: 'Institutional Premium feature · €39/mo or €390/yr · 30-day trial',
  },
  company: {
    label: 'Subscription',
    href: '/pricing?for=companies&plan=subscription',
    tooltip: 'Subscription feature · €89/mo · unlimited contacts + full AI suite',
  },
}

interface Props {
  audience: PremiumAudience
  /**
   * Visual style:
   * - `chip` (default): inline pill, sits next to a heading or label
   * - `corner`: absolutely-positioned corner ribbon for cards
   * - `lock`: small lock icon only, for tabs/list items
   */
  variant?: 'chip' | 'corner' | 'lock'
  /** Override default copy. */
  label?: string
  /** Disable the link wrapper (still shows badge). */
  static?: boolean
  className?: string
}

const VARIANTS = {
  student: {
    bg: 'bg-gradient-to-r from-violet-500 to-purple-600',
    text: 'text-white',
    border: 'border-violet-300/40',
    glow: 'shadow-[0_2px_12px_-2px_rgba(139,92,246,0.45)]',
    chipBg: 'bg-violet-50 dark:bg-violet-950/40',
    chipText: 'text-violet-700 dark:text-violet-300',
    chipBorder: 'border-violet-200 dark:border-violet-800',
  },
  institution: {
    bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    text: 'text-white',
    border: 'border-amber-300/40',
    glow: 'shadow-[0_2px_12px_-2px_rgba(245,158,11,0.45)]',
    chipBg: 'bg-amber-50 dark:bg-amber-950/40',
    chipText: 'text-amber-700 dark:text-amber-300',
    chipBorder: 'border-amber-200 dark:border-amber-800',
  },
  company: {
    bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    text: 'text-white',
    border: 'border-blue-300/40',
    glow: 'shadow-[0_2px_12px_-2px_rgba(59,130,246,0.45)]',
    chipBg: 'bg-blue-50 dark:bg-blue-950/40',
    chipText: 'text-blue-700 dark:text-blue-300',
    chipBorder: 'border-blue-200 dark:border-blue-800',
  },
}

export default function PremiumBadge({
  audience,
  variant = 'chip',
  label,
  static: isStatic = false,
  className = '',
}: Props) {
  const copy = COPY[audience]
  const v = VARIANTS[audience]
  const display = label ?? copy.label

  // ── Lock variant: tiny icon only (for tabs / sidebar / list items) ──
  if (variant === 'lock') {
    const inner = (
      <span
        className={`inline-flex items-center gap-0.5 ${v.chipText} ${className}`}
        title={copy.tooltip}
        aria-label={`${display} feature`}
      >
        <Lock className="h-3 w-3" />
      </span>
    )
    return isStatic ? inner : <Link href={copy.href as any}>{inner}</Link>
  }

  // ── Corner ribbon: for upper-right of cards ──
  if (variant === 'corner') {
    const inner = (
      <motion.span
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${v.bg} ${v.text} ${v.border} ${v.glow} ${className}`}
        title={copy.tooltip}
      >
        <Sparkles className="h-2.5 w-2.5" />
        {display}
      </motion.span>
    )
    return isStatic ? inner : <Link href={copy.href as any}>{inner}</Link>
  }

  // ── Chip (default): inline pill ──
  const chip = (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${v.chipBg} ${v.chipText} ${v.chipBorder} ${className}`}
      title={copy.tooltip}
    >
      <Sparkles className="h-2.5 w-2.5" />
      {display}
    </span>
  )
  return isStatic ? chip : <Link href={copy.href as any}>{chip}</Link>
}
