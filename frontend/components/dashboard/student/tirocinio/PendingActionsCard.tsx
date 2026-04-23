'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  User,
  Building2,
  GraduationCap,
  ListChecks,
  ArrowRight,
} from 'lucide-react'

export interface PendingAction {
  key: string
  severity: 'overdue' | 'upcoming' | 'info'
  owner: 'student' | 'company_tutor' | 'academic_tutor' | 'staff'
  label: string
  detail?: string
  dueAt?: string
  actionHref?: string
  actionLabel?: string
}

interface PendingData {
  daysRemaining: number | null
  pctComplete: number | null
  weekNumber: number
  actions: PendingAction[]
  summary: { overdue: number; upcoming: number; total: number }
}

const SEVERITY_STYLES: Record<PendingAction['severity'], string> = {
  overdue: 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900',
  upcoming: 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900',
  info: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900',
}

const SEVERITY_ICON: Record<PendingAction['severity'], typeof AlertTriangle> = {
  overdue: AlertTriangle,
  upcoming: Clock,
  info: CheckCircle2,
}

const OWNER_ICON: Record<PendingAction['owner'], typeof User> = {
  student: User,
  company_tutor: Building2,
  academic_tutor: GraduationCap,
  staff: ListChecks,
}

const OWNER_LABEL: Record<PendingAction['owner'], string> = {
  student: 'You',
  company_tutor: 'Company tutor',
  academic_tutor: 'Academic tutor',
  staff: 'Institution staff',
}

export default function PendingActionsCard({ placementId }: { placementId: string }) {
  const [data, setData] = useState<PendingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/placements/${placementId}/pending`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled) setData(d)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [placementId])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const { actions, summary, daysRemaining } = data

  if (actions.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/10 dark:border-emerald-900">
        <CardContent className="p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">All caught up</h3>
            <p className="text-xs text-muted-foreground">
              Nothing pending on your stage right now.
              {daysRemaining !== null && ` ${daysRemaining} days to go.`}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Pending
          </CardTitle>
          <div className="flex items-center gap-2">
            {summary.overdue > 0 && (
              <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">
                {summary.overdue} overdue
              </Badge>
            )}
            {summary.upcoming > 0 && (
              <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700">
                {summary.upcoming} upcoming
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-5">
        {actions.map(a => {
          const SevIcon = SEVERITY_ICON[a.severity]
          const OwnerIcon = OWNER_ICON[a.owner]
          return (
            <div
              key={a.key}
              className={`rounded-xl border p-3 ${SEVERITY_STYLES[a.severity]}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <SevIcon
                    className={`h-4 w-4 ${
                      a.severity === 'overdue'
                        ? 'text-red-600'
                        : a.severity === 'upcoming'
                        ? 'text-amber-600'
                        : 'text-blue-600'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium">{a.label}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-white/60 dark:bg-slate-900/60 border rounded-full px-1.5 py-0.5">
                      <OwnerIcon className="h-2.5 w-2.5" />
                      {OWNER_LABEL[a.owner]}
                    </span>
                  </div>
                  {a.detail && (
                    <p className="text-xs text-muted-foreground mt-0.5">{a.detail}</p>
                  )}
                </div>
                {a.actionHref && (
                  <Button size="sm" variant="outline" asChild className="shrink-0">
                    <Link href={a.actionHref as any}>
                      {a.actionLabel || 'Open'}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
