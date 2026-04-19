'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, Award, FileText, Globe, User, ChevronRight } from 'lucide-react'
import { Link } from '@/navigation'

interface PendingData {
  endorsements: Array<{
    id: string
    professorName: string
    university: string
    projectTitle: string
    requestedAt: string
    daysWaiting: number
  }>
  stages: Array<{
    id: string
    role: string
    companyName: string
    supervisorName: string | null
    endDate: string | null
    status: string
  }>
  projects: Array<{ id: string; title: string; createdAt: string }>
  exchanges: Array<{
    id: string
    hostUniversityName: string
    hostCountry: string
    endDate: string | null
  }>
  total: number
}

/**
 * Shows the student everything that's "in flight" — endorsements, stage evals,
 * project verifications, exchange completions. Closes the "I don't know what's
 * happening" information gap.
 */
export function PendingVerificationsCard() {
  const [data, setData] = useState<PendingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/pending-verifications')
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Skeleton className="h-48 w-full" />
  }
  if (!data || data.total === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600" />
          Pending verifications ({data.total})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.endorsements.map(e => (
          <PendingRow
            key={e.id}
            icon={<User className="h-4 w-4" />}
            label={`Endorsement from ${e.professorName}`}
            subLabel={`Project: ${e.projectTitle} — waiting ${e.daysWaiting}d`}
            badge={e.daysWaiting > 5 ? { text: 'overdue', variant: 'destructive' } : undefined}
            href={`/dashboard/student/projects`}
          />
        ))}
        {data.projects.map(p => (
          <PendingRow
            key={p.id}
            icon={<FileText className="h-4 w-4" />}
            label={`Project awaiting verification`}
            subLabel={p.title}
            href={`/dashboard/student/projects/${p.id}`}
          />
        ))}
        {data.stages.map(s => (
          <PendingRow
            key={s.id}
            icon={<Award className="h-4 w-4" />}
            label={`${s.role} @ ${s.companyName}`}
            subLabel={`Supervisor evaluation pending${s.supervisorName ? ` — ${s.supervisorName}` : ''}`}
          />
        ))}
        {data.exchanges.map(e => (
          <PendingRow
            key={e.id}
            icon={<Globe className="h-4 w-4" />}
            label={`Exchange at ${e.hostUniversityName}`}
            subLabel={`Awaiting host completion${e.endDate ? ` — ended ${new Date(e.endDate).toLocaleDateString()}` : ''}`}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function PendingRow({
  icon,
  label,
  subLabel,
  href,
  badge,
}: {
  icon: React.ReactNode
  label: string
  subLabel: string
  href?: string
  badge?: { text: string; variant: 'default' | 'destructive' | 'secondary' }
}) {
  const content = (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/40 transition-colors">
      <span className="text-muted-foreground flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{subLabel}</div>
      </div>
      {badge && <Badge variant={badge.variant} className="text-xs">{badge.text}</Badge>}
      {href && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  )
  return href ? (
    <Link href={href as any} className="block">
      {content}
    </Link>
  ) : (
    content
  )
}
