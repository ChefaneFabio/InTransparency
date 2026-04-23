'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Link } from '@/navigation'
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
  Users,
  Building2,
} from 'lucide-react'
import type { FitScore } from '@/lib/fit-profile'
import FitScoreBreakdown from '@/components/dashboard/shared/FitScoreBreakdown'

interface ApplyFitHeroProps {
  userId: string
  jobId: string
  jobTitle: string
  companyName: string
  /** When true, the whole hero starts collapsed to a compact summary. */
  compact?: boolean
}

interface ComputeResponse {
  fitScore: FitScore | null
  cached: boolean
  error?: string
}

const verdict = (score: FitScore | null): {
  label: string
  sub: string
  grad: string
  icon: typeof CheckCircle2
  accent: string
} => {
  if (!score) {
    return {
      label: 'Fit unknown',
      sub: 'Complete your fit profile to see how you match.',
      grad: 'from-slate-600 via-slate-500 to-slate-600',
      icon: Sparkles,
      accent: 'text-slate-500',
    }
  }
  if (score.dealBreakerHit) {
    return {
      label: 'Dealbreaker triggered',
      sub: score.dealBreakerReason || 'A hard no in your profile conflicts with this role.',
      grad: 'from-red-600 via-red-500 to-red-600',
      icon: AlertTriangle,
      accent: 'text-red-500',
    }
  }
  if (score.composite >= 75) {
    return {
      label: 'Strong fit',
      sub: "Your goals, motivation and profile line up with this role. You're well-positioned.",
      grad: 'from-emerald-500 via-emerald-600 to-emerald-500',
      icon: CheckCircle2,
      accent: 'text-emerald-500',
    }
  }
  if (score.composite >= 50) {
    return {
      label: 'Solid match',
      sub: 'Skills and motivation align. A couple of axes could be stronger — worth applying with a clear cover letter.',
      grad: 'from-blue-500 via-blue-600 to-blue-500',
      icon: Target,
      accent: 'text-blue-500',
    }
  }
  return {
    label: 'Stretch — apply with intent',
    sub: 'Skills or motivation are weaker than typical matches. Lead with why you care.',
    grad: 'from-amber-500 via-amber-600 to-amber-500',
    icon: Lightbulb,
    accent: 'text-amber-500',
  }
}

function AnimatedBigNumber({ to, delay = 0 }: { to: number; delay?: number }) {
  const v = useMotionValue(0)
  const rounded = useTransform(v, val => Math.round(val))
  useEffect(() => {
    const ctrl = animate(v, to, { duration: 1.3, ease: [0.16, 1, 0.3, 1], delay })
    return () => ctrl.stop()
  }, [to, delay, v])
  return <motion.span>{rounded}</motion.span>
}

function improvementHints(score: FitScore): string[] {
  const tips: string[] = []
  if (score.position.score < 50) tips.push("Add your preferred position types to your fit profile")
  if (score.dimension.score < 50) tips.push("Set your preferred company size")
  if (score.motivation.score < 50) tips.push("Refine your motivations — what really drives you")
  if (score.cultureFit.score < 50) tips.push("Pick 3-5 culture tags that describe your ideal team")
  if (score.industry.score < 50) tips.push("List the industries you want to work in")
  if (score.geography.score < 50) tips.push("Add your target cities or 'remote'")
  return tips.slice(0, 3)
}

export default function ApplyFitHero({
  userId,
  jobId,
  jobTitle,
  companyName,
  compact,
}: ApplyFitHeroProps) {
  const [data, setData] = useState<ComputeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(!compact)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/matching/compute-fit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, jobId }),
    })
      .then(r => r.json().catch(() => ({ fitScore: null })))
      .then(d => {
        if (!cancelled) setData(d)
      })
      .catch(() => {
        if (!cancelled) setData({ fitScore: null, cached: false })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [userId, jobId])

  const fitScore = data?.fitScore ?? null
  const v = verdict(fitScore)
  const Icon = v.icon
  const hints = fitScore && !fitScore.dealBreakerHit && fitScore.composite < 75 ? improvementHints(fitScore) : []
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const composite = fitScore?.composite ?? 0

  return (
    <div className="relative overflow-hidden rounded-3xl border shadow-xl">
      {/* Gradient canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />
      {/* Mesh gradient accents */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-violet-500/30 via-blue-500/20 to-transparent blur-3xl -z-10"
        animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-transparent blur-3xl -z-10"
        animate={{ x: [0, -16, 0], y: [0, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="p-6 sm:p-8 text-white">
        {/* Title row */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs text-white/60 mb-2 uppercase tracking-wider"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Fit preview
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-xl sm:text-2xl font-bold mb-0.5"
        >
          {jobTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm text-white/70 mb-6"
        >
          {companyName}
        </motion.p>

        {/* Score + Verdict row */}
        <div className="grid md:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center">
          {/* Large radial score */}
          <div className="relative shrink-0 w-32 h-32 mx-auto md:mx-0">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
              <defs>
                <linearGradient id="applyFitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(168 85 247)" />
                  <stop offset="50%" stopColor="rgb(59 130 246)" />
                  <stop offset="100%" stopColor="rgb(16 185 129)" />
                </linearGradient>
              </defs>
              <circle
                cx="64"
                cy="64"
                r={radius}
                strokeWidth={6}
                className="fill-none stroke-white/10"
              />
              <motion.circle
                cx="64"
                cy="64"
                r={radius}
                strokeWidth={6}
                strokeLinecap="round"
                stroke={fitScore?.dealBreakerHit ? 'rgb(239 68 68)' : 'url(#applyFitGrad)'}
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset: loading
                    ? circumference
                    : circumference - (composite / 100) * circumference,
                }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {fitScore?.dealBreakerHit ? (
                <AlertTriangle className="h-8 w-8 text-red-400" />
              ) : loading ? (
                <div className="w-8 h-2 bg-white/20 rounded-full animate-pulse" />
              ) : (
                <>
                  <span className="text-4xl font-bold tabular-nums leading-none">
                    <AnimatedBigNumber to={composite} delay={0.25} />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/60 mt-1">
                    fit
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Verdict */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="min-w-0"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${v.grad} flex items-center justify-center shrink-0`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">{v.label}</h2>
            </div>
            <p className="text-sm text-white/75 mt-2 leading-relaxed">{v.sub}</p>

            {hints.length > 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80 mb-1.5">
                  <Lightbulb className="h-3 w-3 text-amber-300" />
                  Improve your match
                </div>
                <ul className="space-y-1">
                  {hints.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.05 }}
                      className="text-xs text-white/70 flex items-start gap-1.5"
                    >
                      <span className="text-white/40 mt-0.5">•</span>
                      <span>{h}</span>
                    </motion.li>
                  ))}
                </ul>
                <Link
                  href="/dashboard/student/profile?tab=fit"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-violet-300 hover:text-violet-200 transition-colors"
                >
                  Edit fit profile
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}

            {fitScore && !fitScore.dealBreakerHit && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white transition-colors"
              >
                {expanded ? 'Hide breakdown' : 'Why this fit?'}
                <ArrowRight
                  className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
              </button>
            )}
          </motion.div>
        </div>

        {/* Per-axis breakdown — styled for dark canvas */}
        <motion.div
          initial={false}
          animate={{ height: expanded && fitScore ? 'auto' : 0, opacity: expanded && fitScore ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          {fitScore && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
                {/* Reuse FitScoreBreakdown but in a 2-col grid — the component
                    renders vertically, so wrap each half. Simpler: render
                    once and let content flow. */}
                <div className="sm:col-span-2">
                  <div className="[&_.text-muted-foreground]:text-white/60">
                    <FitScoreBreakdown score={fitScore} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
