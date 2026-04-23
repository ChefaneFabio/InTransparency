'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Shield,
  ShieldCheck,
  School,
  Award,
  AlertTriangle,
  Clock,
  GraduationCap,
  FolderGit2,
  Github,
  ExternalLink,
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string | null
  discipline: string | null
  skills: string[]
  technologies: string[]
  tools: string[]
  innovationScore: number | null
  githubUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  verificationStatus: string
  createdAt: string
}

interface Candidate {
  id: string
  name: string
  photo: string | null
  tagline: string | null
  bio: string | null
  university: string | null
  degree: string | null
  graduationYear: number | null
  gpa: number | null
  projects: Project[]
  verifiedProjectCount: number
  topSkills: Array<{ skillTerm: string; currentLevel: number; sourceCount: number }>
}

interface SharePayload {
  candidate: Candidate
  share: { sharedBy: string; note: string | null; expiresAt: string; viewCount: number }
}

const LEVEL_LABEL = ['—', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
const LEVEL_COLOR = [
  'bg-muted text-muted-foreground',
  'bg-slate-100 text-slate-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
]

export default function SharedCandidatePage() {
  const params = useParams()
  const token = params?.token as string
  const [data, setData] = useState<SharePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ reason?: string; message: string } | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`/api/shared/candidate/${token}`)
      .then(async r => {
        if (r.status === 410) {
          const body = await r.json()
          setError({ reason: body.reason, message: body.error })
          return null
        }
        if (!r.ok) {
          const body = await r.json().catch(() => ({}))
          setError({ message: body.error || 'This link is not available.' })
          return null
        }
        return r.json()
      })
      .then(d => {
        if (d) setData(d)
      })
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-8 text-center">
            {error.reason === 'expired' ? (
              <Clock className="h-10 w-10 mx-auto text-amber-600 mb-3" />
            ) : (
              <AlertTriangle className="h-10 w-10 mx-auto text-amber-600 mb-3" />
            )}
            <h1 className="text-xl font-bold mb-1">
              {error.reason === 'expired'
                ? 'This link has expired'
                : error.reason === 'revoked'
                ? 'This link has been revoked'
                : 'Link not available'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {error.reason === 'expired'
                ? 'Ask the recruiter to send a fresh link.'
                : error.reason === 'revoked'
                ? 'The recruiter has revoked access to this profile.'
                : error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { candidate, share } = data
  const initials = candidate.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const expires = new Date(share.expiresAt)
  const daysLeft = Math.max(0, Math.ceil((expires.getTime() - Date.now()) / 86_400_000))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Sender banner */}
      <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-white p-4 flex items-center gap-3 dark:from-blue-950/20 dark:to-slate-900">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
        <div className="text-sm">
          <span className="font-medium">{share.sharedBy}</span> shared this verified candidate with you.
          <span className="text-muted-foreground ml-1">
            Link expires in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}.
          </span>
        </div>
      </div>

      {share.note && (
        <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Note</div>
          <p className="whitespace-pre-wrap">{share.note}</p>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 shrink-0 ring-4 ring-white dark:ring-slate-800 shadow-lg">
              <AvatarImage src={candidate.photo || undefined} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{candidate.name}</h1>
              {candidate.tagline && (
                <p className="text-base text-foreground/70 mt-1">{candidate.tagline}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap mt-2">
                {candidate.degree && (
                  <span className="inline-flex items-center gap-1.5">
                    <School className="h-4 w-4" />
                    {candidate.degree}
                  </span>
                )}
                {candidate.university && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="font-medium text-foreground/80">{candidate.university}</span>
                  </>
                )}
                {candidate.graduationYear && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span>Class of {candidate.graduationYear}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4">
              <div className="text-2xl font-bold tracking-tight">{candidate.projects.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Projects</div>
            </div>
            <div className="rounded-xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4">
              <div className="text-2xl font-bold tracking-tight text-emerald-600">
                {candidate.verifiedProjectCount}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
                Verified
              </div>
            </div>
            <div className="rounded-xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4">
              <div className="text-2xl font-bold tracking-tight">{candidate.topSkills.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Skills</div>
            </div>
            <div className="rounded-xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4">
              <div className="text-2xl font-bold tracking-tight">
                {candidate.gpa !== null ? candidate.gpa : '—'}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">GPA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {candidate.bio && (
        <Card>
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{candidate.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Verified skills */}
      {candidate.topSkills.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Verified Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {candidate.topSkills.map(s => (
                <div key={s.skillTerm} className="inline-flex items-center gap-1.5">
                  <Badge className={`${LEVEL_COLOR[s.currentLevel]} border-0 text-xs`}>
                    {s.skillTerm}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {LEVEL_LABEL[s.currentLevel]}
                    {s.sourceCount >= 2 && ` · ${s.sourceCount} sources`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {candidate.projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FolderGit2 className="h-4 w-4" />
            Projects
          </h2>
          {candidate.projects.map(p => (
            <Card key={p.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <CardTitle className="flex items-center gap-2 flex-wrap text-base">
                      <span>{p.title}</span>
                      {p.verificationStatus === 'VERIFIED' && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                          <ShieldCheck className="h-3 w-3 mr-0.5" />
                          Verified
                        </Badge>
                      )}
                      {p.innovationScore !== null && (
                        <Badge variant="outline" className="text-[10px]">
                          Score {p.innovationScore}
                        </Badge>
                      )}
                    </CardTitle>
                    {p.description && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 border rounded-md hover:bg-muted"
                      >
                        <Github className="h-3 w-3" /> Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 border rounded-md hover:bg-muted"
                      >
                        <ExternalLink className="h-3 w-3" /> Live
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {[...(p.technologies || []), ...(p.skills || []), ...(p.tools || [])]
                    .slice(0, 12)
                    .map(t => (
                      <Badge key={t} variant="secondary" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer — compliance */}
      <div className="text-center text-[11px] text-muted-foreground pt-4 border-t flex items-center justify-center gap-1.5">
        <Shield className="h-3 w-3" />
        This view is logged for AI Act compliance. The candidate may request a copy at any time.
      </div>
    </div>
  )
}
