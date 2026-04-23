'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ShieldCheck,
  Award,
  FolderGit2,
  CheckCircle2,
  XCircle,
  School,
  ArrowRight,
  Inbox,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { FitScore } from '@/lib/fit-profile'
import FitScoreTile from '@/components/dashboard/shared/FitScoreTile'
import FitScoreBreakdown from '@/components/dashboard/shared/FitScoreBreakdown'
import EmptyState from '@/components/shared/EmptyState'

interface Project {
  id: string
  title: string
  discipline: string | null
  innovationScore: number | null
  verified: boolean
  skillHits: number
}

interface ApplicantEvidence {
  id: string
  status: string
  isRead: boolean
  isStarred: boolean
  createdAt: string
  applicant: {
    id: string
    name: string
    photo: string | null
    university: string | null
    degree: string | null
    graduationYear: string | null
    gpa: number | null
    hasFitProfile?: boolean
  }
  evidence: {
    matchScore: number
    matchedSkills: string[]
    missingSkills: string[]
    matchedPreferred: string[]
    topProjects: Project[]
    totalProjects: number
    verifiedProjectCount: number
    endorsementCount: number
    skillGraphSize: number
  }
  fitScore: FitScore | null
}

interface Response {
  applicants: ApplicantEvidence[]
  jobSkills: { required: string[]; preferred: string[] }
}


export default function ApplicantEvidenceList({ jobId }: { jobId: string }) {
  const [data, setData] = useState<Response | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/jobs/${jobId}/applicants-evidence`)
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
  }, [jobId])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!data || data.applicants.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No applications yet"
        description="When a student applies, their evidence pack — verified projects, skill match, fit score — shows up here ranked."
        gradient="primary"
      />
    )
  }

  return (
    <div className="space-y-3">
      {data.applicants.map(a => {
        const initials =
          a.applicant.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || '?'
        return (
          <div
            key={a.id}
            className="rounded-xl border bg-card hover:shadow-sm hover:border-primary/20 transition-all"
          >
            <div className="p-4 flex flex-col md:flex-row gap-4">
              {/* Left: score + identity */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Dual score tile: skills + fit */}
                <div className="shrink-0 flex gap-1.5">
                  <FitScoreTile score={a.evidence.matchScore} label="skills" size="md" />
                  <FitScoreTile
                    score={a.fitScore && a.applicant.hasFitProfile ? a.fitScore.composite : null}
                    label="fit"
                    size="md"
                    dealBreakerHit={a.fitScore?.dealBreakerHit}
                    dealBreakerReason={a.fitScore?.dealBreakerReason}
                  />
                </div>

                {/* Identity */}
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={a.applicant.photo || undefined} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm truncate">{a.applicant.name}</h4>
                    {!a.isRead && (
                      <Badge className="bg-amber-100 text-amber-700 border-0 text-[9px]">NEW</Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      {a.status.charAt(0) + a.status.slice(1).toLowerCase().replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                    {a.applicant.university && (
                      <span className="inline-flex items-center gap-1">
                        <School className="h-3 w-3" />
                        {a.applicant.university}
                      </span>
                    )}
                    {a.applicant.degree && <span className="truncate">{a.applicant.degree}</span>}
                    {a.applicant.graduationYear && <span>· {a.applicant.graduationYear}</span>}
                  </div>

                  {/* Skills row */}
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {a.evidence.matchedSkills.slice(0, 6).map(s => (
                      <Badge
                        key={s}
                        className="bg-emerald-50 text-emerald-700 border-0 text-[10px] dark:bg-emerald-950/30 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                        {s}
                      </Badge>
                    ))}
                    {a.evidence.missingSkills.slice(0, 3).map(s => (
                      <Badge
                        key={s}
                        className="bg-red-50 text-red-600 border-0 text-[10px] dark:bg-red-950/30 dark:text-red-400"
                      >
                        <XCircle className="h-2.5 w-2.5 mr-0.5" />
                        {s}
                      </Badge>
                    ))}
                  </div>

                  {/* Top projects */}
                  {a.evidence.topProjects.length > 0 && (
                    <div className="mt-2.5 space-y-1">
                      {a.evidence.topProjects.map(p => (
                        <div
                          key={p.id}
                          className="flex items-center gap-1.5 text-xs"
                        >
                          {p.verified ? (
                            <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                          ) : (
                            <FolderGit2 className="h-3 w-3 text-muted-foreground shrink-0" />
                          )}
                          <span className="truncate font-medium">{p.title}</span>
                          {p.innovationScore !== null && (
                            <span className="text-muted-foreground">
                              · score {p.innovationScore}
                            </span>
                          )}
                          {p.skillHits > 0 && (
                            <span className="text-emerald-600 font-medium">
                              · {p.skillHits} skill match
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Evidence strip */}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {a.evidence.verifiedProjectCount}/{a.evidence.totalProjects} verified
                    </span>
                    {a.evidence.endorsementCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {a.evidence.endorsementCount} endorsement
                        {a.evidence.endorsementCount === 1 ? '' : 's'}
                      </span>
                    )}
                    {a.evidence.skillGraphSize > 0 && (
                      <span>{a.evidence.skillGraphSize} verified skills</span>
                    )}
                    <span>
                      Applied {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex md:flex-col gap-2 md:items-end justify-end shrink-0">
                <Button size="sm" asChild>
                  <Link href={`/dashboard/recruiter/candidates/${a.applicant.id}`}>
                    View profile
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
                {a.fitScore && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className="text-xs"
                  >
                    {expanded === a.id ? (
                      <>
                        Hide fit <ChevronUp className="h-3 w-3 ml-1" />
                      </>
                    ) : (
                      <>
                        Why this fit <ChevronDown className="h-3 w-3 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Fit score expansion — per-axis breakdown (shared component, animated bars) */}
            <AnimatePresence initial={false}>
              {a.fitScore && expanded === a.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <div className="border-t pt-3">
                      <FitScoreBreakdown score={a.fitScore} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
