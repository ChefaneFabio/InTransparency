'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'
import type { FitProfile } from '@/lib/fit-profile'

/**
 * Callout card that surfaces the student's fit-profile completion on
 * /journey and other hub pages. Hidden when the profile is already complete.
 * InTransparency style: gradient canvas + radial ring + floating sparkles.
 */
export default function FitProfileCallout() {
  const [profile, setProfile] = useState<FitProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/student/fit-profile')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!cancelled && data?.profile) setProfile(data.profile)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return null
  const completion = Math.round((profile?.completion ?? 0) * 100)
  if (completion >= 85) return null

  const isEmpty = completion < 10
  const radius = 24
  const circumference = 2 * Math.PI * radius

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-violet-200/40 dark:border-violet-900/40 p-4 sm:p-5"
    >
      {/* Layered gradient canvas — InTransparency feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/30 dark:via-slate-950 dark:to-blue-950/30 -z-10" />
      {/* Animated gradient blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-24 -left-12 w-48 h-48 rounded-full bg-gradient-to-br from-violet-400/20 to-transparent blur-3xl -z-10"
        animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-20 -right-16 w-56 h-56 rounded-full bg-gradient-to-tr from-blue-400/20 to-transparent blur-3xl -z-10"
        animate={{ x: [0, -10, 0], y: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Floating sparkle particles */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute rounded-full bg-violet-400/40 dark:bg-violet-300/40 -z-10"
          style={{
            width: 3 + i * 1.5,
            height: 3 + i * 1.5,
            left: `${30 + i * 25}%`,
            top: `${40 + i * 15}%`,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + i, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative flex items-center gap-4">
        {/* Radial progress */}
        <div className="relative shrink-0 w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="fitProfileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(168 85 247)" />
                <stop offset="100%" stopColor="rgb(59 130 246)" />
              </linearGradient>
            </defs>
            <circle
              cx="32"
              cy="32"
              r={radius}
              strokeWidth="4"
              className="fill-none stroke-violet-100 dark:stroke-violet-950/60"
            />
            <motion.circle
              cx="32"
              cy="32"
              r={radius}
              strokeWidth="4"
              strokeLinecap="round"
              stroke="url(#fitProfileGrad)"
              fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (completion / 100) * circumference }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold tabular-nums bg-gradient-to-br from-violet-600 to-blue-600 bg-clip-text text-transparent">
              {completion}%
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            <h3 className="font-semibold text-sm">
              {isEmpty ? 'Set your Fit Profile' : 'Finish your Fit Profile'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            {isEmpty
              ? 'Tell us what role would actually suit you — motivation, culture, company size. Matching gets 10× more accurate.'
              : 'A few more questions and we rank every role by how well it fits your goals, not just CV keywords.'}
          </p>
        </div>

        <Link
          href={'/dashboard/student/profile?tab=fit' as any}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-medium bg-gradient-to-br from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 px-3 py-2 rounded-lg shadow-[0_4px_16px_-4px_rgba(139,92,246,0.5)] transition-all"
        >
          {isEmpty ? 'Start' : 'Continue'}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  )
}
