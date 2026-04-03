'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MetricHeroProps {
  children: ReactNode
  gradient?: 'primary' | 'blue' | 'purple' | 'green' | 'dark'
  className?: string
}

const gradients: Record<string, string> = {
  primary: 'from-primary/15 via-primary/8 to-background',
  blue: 'from-blue-600/10 via-blue-500/5 to-background',
  purple: 'from-purple-600/10 via-purple-500/5 to-background',
  green: 'from-emerald-600/10 via-emerald-500/5 to-background',
  dark: 'from-slate-900 via-slate-800 to-slate-900',
}

export function MetricHero({ children, gradient = 'primary', className = '' }: MetricHeroProps) {
  const isDark = gradient === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${gradients[gradient]}
        ${isDark ? 'text-white' : ''}
        border ${isDark ? 'border-slate-700' : 'border-white/40'}
        p-6 md:p-8
        ${className}
      `}
    >
      {/* Decorative orbs */}
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full -translate-y-1/2 translate-x-1/3 ${isDark ? 'bg-white/5' : 'bg-primary/5'}`} />
      <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/4 ${isDark ? 'bg-white/3' : 'bg-primary/3'}`} />
      <div className={`absolute top-1/2 left-1/2 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 ${isDark ? 'bg-white/2' : 'bg-primary/2'}`} />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
