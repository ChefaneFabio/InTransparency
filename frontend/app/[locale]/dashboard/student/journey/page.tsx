'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  GraduationCap,
  Award,
  FolderGit2,
  Briefcase,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
  Target,
  Users,
  FileSignature,
  Clock,
  BookOpen,
  Star,
  Shield,
  ArrowRight,
  MapPin,
} from 'lucide-react'

interface Course {
  courseName: string
  courseCode: string | null
  semester: string | null
  academicYear: string | null
  projectCount: number
  verifiedProjectCount: number
  grade: string | null
  professor: string | null
}
interface Project {
  id: string
  title: string
  discipline: string | null
  verified: boolean
  innovationScore: number | null
  courseName: string | null
  grade: string | null
}
interface ActivePlacement {
  id: string
  jobTitle: string
  companyName: string
  offerType: string
  stage: string | null
  plannedHours: number | null
  completedHours: number
  progressPct: number | null
  startDate: string
  endDate: string | null
}
interface Milestone {
  key: string
  label: string
  done: boolean
  date: string | null
}
interface JourneyData {
  user: {
    firstName: string | null
    lastName: string | null
    university: string | null
    degree: string | null
    graduationYear: string | null
    gpa: string | null
    jobSearchStatus: string | null
  }
  affiliation: {
    program: string | null
    startDate: string
    institution: { name: string; type: string; city: string | null }
  } | null
  graduationProgress: {
    enrolledDate: string | null
    graduationYear: number | null
    yearsEnrolled: number
    percentComplete: number | null
    monthsToGraduation: number | null
  }
  courses: Course[]
  projects: {
    total: number
    verified: number
    avgInnovationScore: number | null
    topInnovationScore: number | null
    recent: Project[]
  }
  placements: {
    active: ActivePlacement | null
    completed: number
    total: number
  }
  applications: {
    total: number
    byStatus: Record<string, number>
    recent: Array<{
      id: string
      status: string
      jobTitle?: string
      companyName?: string
      createdAt: string
    }>
  }
  topSkills: Array<{ skill: string; count: number }>
  milestones: Milestone[]
}

const APP_STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-amber-100 text-amber-700',
  INTERVIEW: 'bg-purple-100 text-purple-700',
  OFFER: 'bg-emerald-100 text-emerald-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-100 text-gray-600',
}

const MILESTONE_ICONS: Record<string, any> = {
  enrolled: GraduationCap,
  firstProject: FolderGit2,
  firstVerified: Shield,
  firstApplication: Briefcase,
  firstInterview: Users,
  placement: FileSignature,
  graduation: Award,
}

function fmtDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function StudentJourneyPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<JourneyData | null>(null)
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

  if (loading) {
    return (
      <div className="space-y-5 pb-12 max-w-5xl mx-auto">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="py-12 text-center max-w-md mx-auto">
        <p className="text-muted-foreground">Impossibile caricare il tuo journey.</p>
      </div>
    )
  }

  const firstName = data.user.firstName || 'Studente'
  const hasCompleted = data.milestones.filter(m => m.done).length
  const milestonePct = Math.round((hasCompleted / data.milestones.length) * 100)

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ─── HERO — graduation countdown + identity ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-purple-600 text-white p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3 text-sm text-white/80">
            <Sparkles className="h-4 w-4" />
            <span>Il tuo percorso</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Ciao, {firstName}
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-5">
            {data.affiliation?.program || data.user.degree || 'Il tuo corso di studi'}
            {data.affiliation?.institution.name && (
              <>
                {' · '}
                <span className="font-medium">{data.affiliation.institution.name}</span>
              </>
            )}
          </p>

          {data.graduationProgress.percentComplete !== null && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-white/80">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Iscritto {data.graduationProgress.yearsEnrolled}{' '}
                  anno{data.graduationProgress.yearsEnrolled === 1 ? '' : 'i'} fa
                </span>
                <span className="font-semibold">
                  {data.graduationProgress.monthsToGraduation === 0
                    ? 'In laurea'
                    : `${data.graduationProgress.monthsToGraduation} mesi alla laurea`}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-1000"
                  style={{ width: `${data.graduationProgress.percentComplete}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{fmtDate(data.graduationProgress.enrolledDate)}</span>
                <span className="font-medium">
                  {data.graduationProgress.percentComplete}% completato
                </span>
                <span>
                  {data.graduationProgress.graduationYear
                    ? `Luglio ${data.graduationProgress.graduationYear}`
                    : '—'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── STATS STRIP ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
              <FolderGit2 className="h-3.5 w-3.5" />
              Progetti
            </div>
            <div className="text-2xl font-bold">{data.projects.total}</div>
            {data.projects.verified > 0 && (
              <div className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {data.projects.verified} verificat
                {data.projects.verified === 1 ? 'o' : 'i'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
              <Award className="h-3.5 w-3.5" />
              Innovation score
            </div>
            <div className="text-2xl font-bold">
              {data.projects.avgInnovationScore ?? '—'}
            </div>
            {data.projects.topInnovationScore && (
              <div className="text-xs text-muted-foreground mt-0.5">
                max {data.projects.topInnovationScore}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              Candidature
            </div>
            <div className="text-2xl font-bold">{data.applications.total}</div>
            {data.applications.byStatus.INTERVIEW && (
              <div className="text-xs text-purple-600 mt-0.5">
                {data.applications.byStatus.INTERVIEW} in colloquio
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
              <FileSignature className="h-3.5 w-3.5" />
              Tirocini
            </div>
            <div className="text-2xl font-bold">
              {(data.placements.active ? 1 : 0) + data.placements.completed}
            </div>
            {data.placements.active && (
              <div className="text-xs text-primary mt-0.5 font-medium">In corso</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── ACTIVE PLACEMENT (if any) ─── */}
      {data.placements.active && (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 uppercase tracking-wide font-medium mb-1.5">
                  <FileSignature className="h-3.5 w-3.5" />
                  Tirocinio attivo
                </div>
                <h3 className="text-lg font-bold">{data.placements.active.jobTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {data.placements.active.companyName}
                  {data.placements.active.stage && (
                    <>
                      {' · '}
                      <Badge variant="outline" className="text-[10px] ml-1">
                        {data.placements.active.stage}
                      </Badge>
                    </>
                  )}
                </p>
              </div>
              <Link href="/dashboard/student/tirocinio">
                <Button size="sm" variant="outline">
                  Apri
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
            {data.placements.active.plannedHours && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Ore: {data.placements.active.completedHours} /{' '}
                    {data.placements.active.plannedHours}h
                  </span>
                  <span className="font-medium text-emerald-700">
                    {data.placements.active.progressPct ?? 0}%
                  </span>
                </div>
                <Progress value={data.placements.active.progressPct ?? 0} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── MILESTONES TIMELINE ─── */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Tappe del tuo percorso
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hasCompleted} su {data.milestones.length} completate
              </p>
            </div>
            <div className="text-sm font-bold text-primary">{milestonePct}%</div>
          </div>

          <div className="space-y-3">
            {data.milestones.map((m, i) => {
              const Icon = MILESTONE_ICONS[m.key] || Circle
              const isNext = !m.done && data.milestones.slice(0, i).every(x => x.done)
              return (
                <div key={m.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        m.done
                          ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200'
                          : isNext
                            ? 'bg-primary/10 text-primary ring-2 ring-primary/30 animate-pulse'
                            : 'bg-muted text-muted-foreground/50'
                      }`}
                    >
                      {m.done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    {i < data.milestones.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 min-h-[1rem] mt-1 ${
                          m.done ? 'bg-emerald-200' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-3 pt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm ${m.done ? 'font-medium' : 'text-muted-foreground'}`}>
                        {m.label}
                      </span>
                      {isNext && (
                        <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                          Prossima
                        </Badge>
                      )}
                      {m.done && m.date && (
                        <span className="text-xs text-muted-foreground">{fmtDate(m.date)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ─── CURRENT COURSES ─── */}
      {data.courses.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-primary" />
              I tuoi corsi{' '}
              <Badge variant="secondary" className="text-xs font-mono">
                {data.courses.length}
              </Badge>
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.courses.slice(0, 6).map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">{c.courseName}</h3>
                      {c.courseCode && (
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {c.courseCode}
                        </p>
                      )}
                    </div>
                    {c.grade && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {c.grade}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {c.projectCount} progett{c.projectCount === 1 ? 'o' : 'i'}
                    </span>
                    {c.verifiedProjectCount > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600">
                        <Shield className="h-3 w-3" />
                        {c.verifiedProjectCount}
                      </span>
                    )}
                    {c.semester && <span>· {c.semester}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── RECENT PROJECTS ─── */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-primary" />I tuoi progetti recenti
            </h2>
            <Link href="/dashboard/student/projects">
              <Button size="sm" variant="ghost">
                Vedi tutti
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          {data.projects.recent.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Nessun progetto ancora. Aggiungi il tuo primo progetto dal portfolio.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.projects.recent.map(p => (
                <Link
                  key={p.id}
                  href={`/dashboard/student/projects/${p.id}`}
                  className="p-3 rounded-lg border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {p.verified ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                        <Shield className="h-2.5 w-2.5 mr-0.5" />
                        Verificato
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        In revisione
                      </Badge>
                    )}
                    {p.innovationScore && (
                      <span className="text-xs font-bold text-primary">
                        {p.innovationScore}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                    {p.title}
                  </h3>
                  {p.courseName && (
                    <p className="text-[11px] text-muted-foreground mt-1 truncate">
                      {p.courseName}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── TOP SKILLS ─── */}
      {data.topSkills.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              Le tue competenze più forti
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.topSkills.map(s => (
                <div
                  key={s.skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/20 text-xs"
                  style={{
                    fontSize: `${Math.min(1.2, 0.7 + s.count * 0.1)}rem`,
                  }}
                >
                  <Star className="h-3 w-3 text-primary" />
                  <span className="font-medium">{s.skill}</span>
                  <span className="text-muted-foreground font-mono">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── APPLICATIONS PIPELINE ─── */}
      {data.applications.total > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Pipeline candidature
              </h2>
              <Link href="/dashboard/student/applications">
                <Button size="sm" variant="ghost">
                  Apri
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {Object.entries(data.applications.byStatus).map(([status, count]) => (
                <div
                  key={status}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    APP_STATUS_COLOR[status] || 'bg-muted text-muted-foreground'
                  }`}
                >
                  <span>{status}</span>
                  <span className="font-mono">{count}</span>
                </div>
              ))}
            </div>
            {data.applications.recent.length > 0 && (
              <div className="space-y-1.5">
                {data.applications.recent.map(a => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-2 rounded text-sm hover:bg-muted/40"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium truncate">{a.jobTitle}</span>
                      <span className="text-muted-foreground text-xs ml-2">
                        {a.companyName}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${APP_STATUS_COLOR[a.status] || ''}`}
                    >
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
