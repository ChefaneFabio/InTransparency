'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  delay?: number
  hover?: boolean
  gradient?: 'primary' | 'blue' | 'purple' | 'green' | 'amber' | 'rose' | 'none'
}

// Restrained tints — barely-there washes that hint at segment without
// dominating. Saturation cut by ~50% from the previous values.
const gradientMeshes: Record<string, string> = {
  primary: 'before:bg-gradient-to-br before:from-primary/5 before:via-primary/2 before:to-transparent',
  blue: 'before:bg-gradient-to-br before:from-blue-500/5 before:via-blue-400/2 before:to-transparent',
  purple: 'before:bg-gradient-to-br before:from-purple-500/5 before:via-purple-400/2 before:to-transparent',
  green: 'before:bg-gradient-to-br before:from-emerald-500/5 before:via-emerald-400/2 before:to-transparent',
  amber: 'before:bg-gradient-to-br before:from-amber-500/5 before:via-amber-400/2 before:to-transparent',
  rose: 'before:bg-gradient-to-br before:from-rose-500/5 before:via-rose-400/2 before:to-transparent',
  none: '',
}

export function GlassCard({ children, className = '', delay = 0, hover = true, gradient = 'none' }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' } : undefined}
      className={`
        relative overflow-hidden rounded-2xl
        backdrop-blur-xl bg-white/70 dark:bg-slate-900/70
        border border-white/30 dark:border-slate-700/30
        shadow-sm
        before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
        ${gradientMeshes[gradient]}
        ${className}
      `}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
