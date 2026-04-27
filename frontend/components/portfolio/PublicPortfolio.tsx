'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShareButtons } from '@/components/social/ShareButtons'
import TrustScoreBadge from '@/components/portfolio/TrustScoreBadge'
import {
  ArrowRight,
  Check,
  CheckCircle,
  Github,
  ExternalLink,
  GraduationCap,
  Play,
} from 'lucide-react'
import { Link } from '@/navigation'
import { SKILL_CATEGORIES } from '@/lib/explore/data'

interface Endorsement {
  id: string
  professorName: string
  professorTitle?: string | null
  endorsementText?: string | null
  createdAt?: string
}

interface Project {
  id: string
  title: string
  description: string
  courseCode?: string | null
  courseName?: string | null
  category?: string | null
  skills?: string[]
  technologies?: string[]
  videos?: string[]
  githubUrl?: string | null
  liveUrl?: string | null
  grade?: string | null
  createdAt?: string
  universityVerified?: boolean
  professor?: string | null
  endorsements?: Endorsement[]
}

interface PublicPortfolioProps {
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    photo?: string
    bio?: string
    university: string
    degree: string
    graduationYear: number
    projects: Project[]
    stats: {
      projectsCount: number
      verifiedProjectsCount: number
      verificationScore: number
      skillsCount: number
    }
  }
}

/**
 * Lookup table — skill → category — built once from SKILL_CATEGORIES.
 * Used by the Skills section to group an arbitrary aggregated skill list
 * back into the same buckets shown by the /explore filter.
 */
const SKILL_TO_CATEGORY: Map<string, string> = (() => {
  const map = new Map<string, string>()
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    for (const skill of skills) map.set(skill.toLowerCase(), category)
  }
  return map
})()

export function PublicPortfolio({ user }: PublicPortfolioProps) {
  const t = useTranslations('studentProfilePublic')
  const tFilters = useTranslations('explore.filters.skillCategories')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://in-transparency.com'
  const portfolioUrl = `${appUrl}/students/${user.username}/public`

  const totalEndorsements = useMemo(
    () =>
      user.projects.reduce((sum, p) => sum + (p.endorsements?.length || 0), 0),
    [user.projects]
  )

  // Aggregate skills + tech across projects (case-preserving), then bucket
  // them by category for the grouped display.
  const groupedSkills = useMemo(() => {
    const seen = new Map<string, string>() // lowercase → original casing
    user.projects.forEach(project => {
      ;(project.skills || []).forEach(s => {
        if (typeof s === 'string' && !seen.has(s.toLowerCase())) seen.set(s.toLowerCase(), s)
      })
      ;(project.technologies || []).forEach(t => {
        if (typeof t === 'string' && !seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t)
      })
    })

    const groups: Record<string, string[]> = {}
    seen.forEach((original, lower) => {
      const category = SKILL_TO_CATEGORY.get(lower) || '__uncategorized'
      if (!groups[category]) groups[category] = []
      groups[category].push(original)
    })

    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length)
  }, [user.projects])

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Hero — clean editorial card aesthetic, no gradient */}
      <section className="border-b border-border bg-muted/20 print:border-0 print:bg-white">
        <div className="container max-w-5xl mx-auto px-6 pt-32 pb-10 lg:pt-36 print:pt-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 md:items-start">
            <Avatar className="w-24 h-24 md:w-28 md:h-28 border-2 border-white shadow-md flex-shrink-0">
              <AvatarImage src={user.photo} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-2xl bg-primary text-white">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {user.firstName} {user.lastName}
                </h1>
                {user.stats.verificationScore > 0 && (
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/5 text-primary text-xs uppercase tracking-wider font-semibold"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {t('hero.verifiedBadge', { score: user.stats.verificationScore })}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-base text-muted-foreground mb-1">
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span>
                  {user.degree} @ {user.university}
                </span>
              </div>
              <div className="text-sm text-muted-foreground/80 mb-2">
                {t('hero.classOf', { year: user.graduationYear })}
              </div>
              <div className="mb-4">
                <TrustScoreBadge userId={user.id} compact />
              </div>

              {user.bio && (
                <p className="text-foreground/90 max-w-2xl mb-5 leading-relaxed">{user.bio}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 print:hidden">
                <Button asChild>
                  <Link href="/auth/register/recruiter">
                    {t('hero.ctaContact')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`${user.firstName} ${user.lastName} — verified portfolio`)}&body=${encodeURIComponent(portfolioUrl)}`}
                  >
                    {t('hero.ctaShare')}
                  </a>
                </Button>

                {/* Inline share — no fixed-floating overlay */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {t('share.label')}
                  </span>
                  <ShareButtons
                    url={portfolioUrl}
                    title={`${user.firstName} ${user.lastName} — InTransparency`}
                    description={t('share.shareDescription', {
                      degree: user.degree,
                      university: user.university,
                      count: user.stats.projectsCount,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Stats — compact 3-column row, not big icon cards */}
        <section className="grid grid-cols-3 gap-4 print:gap-6">
          <Stat
            value={user.stats.projectsCount}
            label={t('stats.projects')}
          />
          <Stat
            value={`${user.stats.verificationScore}%`}
            label={t('stats.verification')}
          />
          <Stat
            value={user.stats.skillsCount}
            label={t('stats.skills')}
          />
        </section>

        {/* Evidence row — what's actually verified */}
        <section className="border-l-2 border-primary/40 pl-5 py-2 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80 mb-3">
            {t('evidence.title')}
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{t('evidence.skillsExtracted', { n: user.stats.projectsCount })}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{t('evidence.gradesNormalized')}</span>
            </li>
            <li className="flex items-start gap-2">
              {totalEndorsements > 0 ? (
                <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : (
                <span className="h-4 w-4 inline-block rounded-full border border-muted-foreground/40 mt-0.5 flex-shrink-0" />
              )}
              <span>
                {totalEndorsements > 0
                  ? t('evidence.endorsementsCount', { n: totalEndorsements })
                  : t('evidence.noEndorsements')}
              </span>
            </li>
          </ul>
          <p className="mt-3 text-xs italic text-muted-foreground/80 max-w-xl">
            {t('evidence.explainer')}
          </p>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-2">{t('projects.title')}</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{t('projects.subtitle')}</p>

          {user.projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>{t('projects.empty')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
              {user.projects.map(project => (
                <ProjectCard key={project.id} project={project} t={t} />
              ))}
            </div>
          )}
        </section>

        {/* Skills — categorized */}
        {groupedSkills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-2">{t('skills.title')}</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{t('skills.subtitle')}</p>
            <div className="space-y-5">
              {groupedSkills.map(([category, skills]) => (
                <div key={category}>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    {category === '__uncategorized'
                      ? t('skills.uncategorized')
                      : tFilters(category)}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Viral CTA */}
        <section className="py-12 px-6 bg-primary text-primary-foreground rounded-2xl text-center print:hidden">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            {t('viralCta.title')}
          </h3>
          <p className="text-base md:text-lg mb-7 max-w-xl mx-auto opacity-90">
            {t('viralCta.subtitle', { firstName: user.firstName })}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/register/student">
              {t('viralCta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-xs mt-4 opacity-80">
            {t('viralCta.poweredBy')}{' '}
            <a href="/" className="underline hover:opacity-100">
              InTransparency
            </a>
          </p>
        </section>
      </div>

      {/* Print-friendly: hide CTA section, header, and Footer-class content via global @media print */}
      <style jsx global>{`
        @media print {
          header,
          footer,
          [data-no-print] {
            display: none !important;
          }
          body {
            background: white !important;
          }
          a {
            color: black !important;
            text-decoration: none !important;
          }
        }
      `}</style>
    </div>
  )
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <Card className="border-2 hover:shadow-md transition-shadow">
      <CardContent className="pt-5 pb-4 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary tabular-nums leading-none mb-2">
          {value}
        </div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

function ProjectCard({
  project,
  t,
}: {
  project: Project
  t: (key: string, params?: Record<string, any>) => string
}) {
  const [videoOpen, setVideoOpen] = useState(false)
  const hasVideo = project.videos && project.videos.length > 0
  const videoSrc = hasVideo ? project.videos![0] : null
  const endorsements = project.endorsements || []

  return (
    <Card className="hover:shadow-xl transition-all border-2 border-border hover:border-primary/30 overflow-hidden flex flex-col">
      {/* Video — poster + play button instead of inline controls */}
      {hasVideo && (
        <div className="relative aspect-video bg-slate-900">
          {videoOpen ? (
            <video className="w-full h-full object-cover" controls autoPlay preload="metadata">
              <source src={videoSrc!} type="video/mp4" />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-900/80 hover:bg-slate-900/60 transition-colors group"
              aria-label={t('projects.playVideo')}
            >
              {/* Lightweight poster — no thumbnail extraction; play overlay */}
              <span className="rounded-full bg-white/90 group-hover:bg-white p-4 shadow-lg transition-colors">
                <Play className="h-6 w-6 text-slate-900 fill-slate-900" />
              </span>
            </button>
          )}
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between mb-2 gap-2">
          <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
          {project.grade && (
            <Badge className="bg-primary/80 text-white flex-shrink-0">{project.grade}</Badge>
          )}
        </div>
        {project.courseName && (
          <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
            <GraduationCap className="h-4 w-4 flex-shrink-0" />
            <span>
              {t('projects.courseLine', {
                name: project.courseName,
                code: project.courseCode || 'none',
              })}
            </span>
          </div>
        )}
        <CardDescription className="line-clamp-3">{project.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Verification badges — university + named endorsers */}
        {(project.universityVerified || endorsements.length > 0) && (
          <div className="space-y-2 mb-3">
            {project.universityVerified && (
              <Badge
                variant="outline"
                className="border-emerald-500 text-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {t('projects.universityVerified')}
              </Badge>
            )}
            {endorsements.length > 0 && (
              <div className="space-y-1">
                {endorsements.slice(0, 2).map(e => (
                  <div
                    key={e.id}
                    className="flex items-start gap-1.5 text-xs text-blue-700 dark:text-blue-400 leading-snug"
                  >
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>
                      {t('projects.endorsedBy', {
                        name: e.professorName,
                        title: e.professorTitle || 'none',
                      })}
                    </span>
                  </div>
                ))}
                {endorsements.length > 2 && (
                  <div className="text-xs text-muted-foreground pl-4.5">
                    {t('projects.endorsementsLabel', { n: endorsements.length - 2 })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 5).map((tech, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                {t('projects.moreTechnologies', { n: project.technologies.length - 5 })}
              </Badge>
            )}
          </div>
        )}

        {/* Project links */}
        <div className="flex gap-2 mt-auto print:hidden">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1" />
                {t('projects.links.code')}
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                {t('projects.links.live')}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
