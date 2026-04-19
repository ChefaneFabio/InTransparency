'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Target, CheckCircle2, AlertCircle, MapPin, Briefcase, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'

interface RoleMatch {
  id: string
  title: string
  companyName: string
  companyLogo: string | null
  location: string | null
  workLocation: string | null
  jobType: string | null
  createdAt: string
  matchScore: number
  evidence: {
    requiredMatched: number
    requiredTotal: number
    verifiedMatches: number
    selfMatches: number
    missingRequired: string[]
    strongestVerified: Array<{ skill: string; level: number }>
  }
}

interface ApiResponse {
  roles: RoleMatch[]
  graphSize: number
  context: {
    hasVerifiedSkills: boolean
    totalJobsScanned: number
  }
}

const LEVEL_LABELS = ['—', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

export default function RolesForYouPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/roles-for-you')
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 space-y-3">
        <Skeleton className="h-24 w-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Target className="h-7 w-7 text-primary" />
          Roles for you
        </h1>
        <p className="text-muted-foreground">
          Personalized role matches from your verified skill graph{' '}
          {data.graphSize > 0 && (
            <span>
              ({data.graphSize} verified skill{data.graphSize !== 1 ? 's' : ''})
            </span>
          )}
          . The same evidence-weighted logic recruiters use to rank you, inverted to help you find
          roles where you actually fit.
        </p>
      </div>

      {!data.context.hasVerifiedSkills && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-5 pb-5 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Your verified skill graph is empty</h3>
              <p className="text-sm text-muted-foreground">
                These matches use your self-declared skills only. Complete a stage or get a
                professor endorsement to unlock evidence-weighted matching — your scores will jump,
                and recruiters will see the difference.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.roles.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No strong matches right now</h3>
            <p className="text-sm text-muted-foreground">
              We scanned {data.context.totalJobsScanned} active jobs but none scored above the
              threshold. Check back in a week, or add more verified skills.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.roles.map(r => (
            <RoleCard key={r.id} role={r} />
          ))}
        </div>
      )}
    </div>
  )
}

function RoleCard({ role }: { role: RoleMatch }) {
  const coverage =
    role.evidence.requiredTotal > 0
      ? Math.round((role.evidence.requiredMatched / role.evidence.requiredTotal) * 100)
      : 100

  return (
    <Card className="hover:border-primary transition-colors">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-4">
          {role.companyLogo ? (
            <img src={role.companyLogo} alt="" className="w-12 h-12 object-contain bg-white rounded border flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h3 className="font-semibold">{role.title}</h3>
                <div className="text-sm text-muted-foreground">{role.companyName}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-primary">{role.matchScore}</div>
                <div className="text-xs text-muted-foreground">match score</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
              {role.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {role.location}
                </span>
              )}
              {role.workLocation && <span>{role.workLocation}</span>}
              {role.jobType && <span>{role.jobType}</span>}
              <span>Posted {new Date(role.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Evidence */}
            <div className="space-y-2 mb-3">
              {role.evidence.strongestVerified.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span className="text-muted-foreground">Your verified strengths:</span>
                  {role.evidence.strongestVerified.map(s => (
                    <Badge key={s.skill} variant="secondary" className="text-xs">
                      {s.skill} · {LEVEL_LABELS[s.level]}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Required skills: {role.evidence.requiredMatched}/{role.evidence.requiredTotal} covered (
                {role.evidence.verifiedMatches} verified, {role.evidence.selfMatches} self-declared)
                {coverage < 100 && coverage >= 60 && (
                  <span className="text-amber-600"> — close but not perfect</span>
                )}
              </div>

              {role.evidence.missingRequired.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  <span className="text-muted-foreground">Gaps to close:</span>
                  {role.evidence.missingRequired.map(s => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" asChild>
                <Link href={`/dashboard/student/jobs/${role.id}` as any}>
                  View & apply
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
