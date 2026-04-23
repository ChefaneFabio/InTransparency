'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Circle,
  GraduationCap,
  Sparkles,
} from 'lucide-react'

interface JourneyPreviewData {
  user: {
    firstName: string | null
    graduationYear: string | null
  }
  graduationProgress: {
    percentComplete: number | null
    monthsToGraduation: number | null
    yearsEnrolled: number
  }
  projects: { total: number; verified: number }
  placements: { active: { id: string } | null }
  applications: { total: number; byStatus: Record<string, number> }
  milestones: Array<{ key: string; label: string; done: boolean }>
}

/**
 * Compact journey preview — lives on /dashboard/student home, above the
 * legacy stats. Gives students immediate context on where they are in
 * their arc and drives them into the full /journey page for depth.
 */
export function JourneyPreview() {
  const [data, setData] = useState<JourneyPreviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/dashboard/student/journey')
        if (res.ok) setData(await res.json())
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <Skeleton className="h-44 w-full rounded-2xl" />
  if (!data) return null

  const firstName = data.user.firstName || 'Studente'
  const completed = data.milestones.filter(m => m.done).length
  const milestonePct = Math.round((completed / data.milestones.length) * 100)
  const nextMilestone = data.milestones.find(m => !m.done)

  return (
    <Link
      href="/dashboard/student/journey"
      className="block group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-purple-600 text-white p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-5">
        {/* Left: identity + countdown */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 text-xs text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wide font-medium">Il tuo percorso</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Ciao, {firstName}</h2>

          {data.graduationProgress.percentComplete !== null && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.graduationProgress.yearsEnrolled} ann
                  {data.graduationProgress.yearsEnrolled === 1 ? 'o' : 'i'} iscritto
                </span>
                <span className="font-semibold">
                  {data.graduationProgress.monthsToGraduation === 0
                    ? 'In laurea'
                    : `${data.graduationProgress.monthsToGraduation} mesi alla laurea`}
                </span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${data.graduationProgress.percentComplete}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Middle: milestone summary */}
        <div className="flex-shrink-0 lg:w-60">
          <div className="text-xs text-white/80 uppercase tracking-wide font-medium mb-1.5">
            Tappe
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {data.milestones.map(m => (
              <span
                key={m.key}
                title={m.label}
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                  m.done
                    ? 'bg-white text-primary'
                    : 'bg-white/20 text-white/60'
                }`}
              >
                {m.done ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-white/80 mt-1.5">
            <span className="font-semibold text-white">
              {completed}/{data.milestones.length}
            </span>{' '}
            · {milestonePct}% completato
            {nextMilestone && <> · prossima: {nextMilestone.label}</>}
          </p>
        </div>

        {/* Right: quick stats + CTA */}
        <div className="flex-shrink-0 flex lg:flex-col items-center lg:items-end gap-3 lg:gap-1">
          <div className="flex gap-3 lg:gap-2 text-right">
            <div>
              <div className="text-base font-bold">{data.projects.verified}</div>
              <div className="text-[10px] text-white/70 uppercase">Progetti ✓</div>
            </div>
            <div>
              <div className="text-base font-bold">{data.applications.total}</div>
              <div className="text-[10px] text-white/70 uppercase">Candidature</div>
            </div>
            {data.placements.active && (
              <div>
                <div className="text-base font-bold">1</div>
                <div className="text-[10px] text-white/70 uppercase">Tirocinio</div>
              </div>
            )}
          </div>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-white/90 group-hover:text-white group-hover:gap-2 transition-all">
            <GraduationCap className="h-4 w-4" />
            Apri il percorso
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
