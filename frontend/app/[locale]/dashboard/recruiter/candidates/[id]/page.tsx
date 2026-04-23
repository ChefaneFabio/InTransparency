'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Mail,
  School,
  Calendar,
  Eye,
  Send,
  AlertCircle,
  Share2
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import ShareCandidateDialog from '@/components/dashboard/recruiter/ShareCandidateDialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import PlacementProbabilityBadge from '@/components/predictions/PlacementProbabilityBadge'
import DecisionPackCard from '@/components/dashboard/recruiter/DecisionPackCard'
import TrustScoreBadge from '@/components/portfolio/TrustScoreBadge'
import ReadinessBrief from '@/components/dashboard/recruiter/ReadinessBrief'
import { PositionUpsellBanner } from '@/components/dashboard/recruiter/PositionUpsellBanner'
import CandidateSummary from '@/components/dashboard/recruiter/CandidateSummary'

interface Project {
  id: string
  title: string
  description: string | null
  technologies: string[]
  skills: string[]
  innovationScore: number | null
  complexityScore: number | null
  githubUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  views: number
  createdAt: string
}

interface Candidate {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  university: string | null
  degree: string | null
  graduationYear: number | null
  gpa: number | null
  bio: string | null
  tagline: string | null
  photo: string | null
  profilePublic: boolean
  projectCount: number
  projects: Project[]
}

export default function CandidateProfilePage() {
  const params = useParams()
  const candidateId = params.id as string
  const t = useTranslations('recruiterDashboard.candidateProfile')

  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [positionUpsell, setPositionUpsell] = useState<{
    show: boolean
    recentContacts: number
    spentRecently: number
    positionPrice: number
    savings: number
  } | null>(null)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    if (!candidateId) return
    fetchCandidate()
  }, [candidateId])

  const fetchCandidate = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/dashboard/recruiter/candidates/${candidateId}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch candidate')
      }
      const data = await res.json()
      setCandidate(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = async () => {
    if (!candidate) return
    setBookmarkLoading(true)
    try {
      if (isBookmarked) {
        const res = await fetch('/api/dashboard/recruiter/saved-candidates', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: candidate.id }),
        })
        if (!res.ok) throw new Error('Failed to unsave candidate')
        setIsBookmarked(false)
      } else {
        const res = await fetch('/api/dashboard/recruiter/saved-candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: candidate.id }),
        })
        if (!res.ok) throw new Error('Failed to save candidate')
        setIsBookmarked(true)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setBookmarkLoading(false)
    }
  }

  const openContactForm = async () => {
    setShowContactForm(true)
    if (!candidate) return
    try {
      const res = await fetch('/api/recruiter/contacts/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: candidate.id }),
      })
      const data = await res.json()
      if (data.positionUpsell?.show) {
        setPositionUpsell(data.positionUpsell)
      }
    } catch {
      // Non-critical — don't block the form
    }
  }

  const sendMessage = async () => {
    if (!contactMessage.trim() || !contactSubject.trim() || !candidate) return

    // Need an email to send the message
    if (!candidate.email) {
      alert('This candidate has not made their email public. Unable to send a message.')
      return
    }

    setSendingMessage(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: candidate.id,
          recipientEmail: candidate.email,
          subject: contactSubject,
          content: contactMessage,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }
      setContactMessage('')
      setContactSubject('')
      setShowContactForm(false)
      setMessageSent(true)
      setTimeout(() => setMessageSent(false), 3000)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="relative">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="px-6 pb-6 -mt-16">
            <div className="flex items-end gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex-1 pt-20 space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !candidate) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {error || t('notFound')}
        </h1>
        <p className="text-muted-foreground mb-6">{t('notFoundDescription')}</p>
        <Button asChild>
          <Link href="/dashboard/recruiter/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToCandidates')}
          </Link>
        </Button>
      </div>
    )
  }

  const initials = `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`
  const allSkills = candidate.projects.reduce<string[]>((acc, project) => {
    const projectSkills = [
      ...(project.technologies || []),
      ...(project.skills || []),
    ]
    projectSkills.forEach(skill => {
      if (!acc.includes(skill)) acc.push(skill)
    })
    return acc
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
        <Link href="/dashboard/recruiter/candidates">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          {t('backToCandidates')}
        </Link>
      </Button>

      {/* Hero identity card — gradient + avatar + stats + actions */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
        {/* Subtle decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 blur-3xl" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 shrink-0 ring-4 ring-white dark:ring-slate-800 shadow-lg">
              <AvatarImage src={candidate.photo || undefined} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {candidate.firstName} {candidate.lastName}
              </h1>
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
                    <span>{t('classOf', { year: candidate.graduationYear })}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2 shrink-0 md:min-w-[180px]">
              <Button size="lg" onClick={openContactForm} className="shadow-sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t('contact')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShareOpen(true)}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleBookmark}
                disabled={bookmarkLoading}
                className={isBookmarked ? 'text-amber-600 border-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-700' : ''}
              >
                <Star className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? t('saved') : t('save')}
              </Button>
              {messageSent && (
                <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 justify-center">
                  ✓ {t('messageSent')}
                </span>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4">
              <div className="text-2xl font-bold tracking-tight">{candidate.projectCount}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">{t('projects')}</div>
            </div>
            <div className="rounded-xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4">
              <div className="text-2xl font-bold tracking-tight">{allSkills.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">{t('skills')}</div>
            </div>
            <div className="rounded-xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4">
              <div className="text-2xl font-bold tracking-tight">
                {candidate.projects.filter(p => p.innovationScore !== null).length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">{t('tabs.projects', { count: 0 }).replace(/\s*\(.*\)/, '')} ✓</div>
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

      {/* 2-column layout: sticky sidebar + main */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Sidebar — scores + profile summary */}
        <aside className="space-y-4 lg:sticky lg:top-4">
          <TrustScoreBadge userId={candidate.id} />
          <PlacementProbabilityBadge studentId={candidate.id} />
          <DecisionPackCard
            candidateId={candidate.id}
            candidateName={`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim()}
            university={candidate.university || undefined}
            verifiedProjects={candidate.projects.filter((p: Project) => p.innovationScore !== null).length}
          />

          {/* Contact quick-info */}
          {candidate.email && (
            <GlassCard hover={false}>
              <div className="p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {t('contactInfo')}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </div>
              </div>
            </GlassCard>
          )}
        </aside>

        {/* Main — AI summary + tabs */}
        <main className="space-y-5 min-w-0">
          <CandidateSummary candidateId={candidateId} />

          <Tabs defaultValue="overview" className="space-y-5">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="readiness">{t('tabs.readiness')}</TabsTrigger>
              <TabsTrigger value="projects">{t('tabs.projects', { count: candidate.projectCount })}</TabsTrigger>
              <TabsTrigger value="skills">{t('tabs.skills')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-5">
              {candidate.bio && (
                <GlassCard hover={false}>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-3">{t('about')}</h3>
                    <p className="text-foreground/80 leading-relaxed">{candidate.bio}</p>
                  </div>
                </GlassCard>
              )}

              {(candidate.university || candidate.degree) && (
                <GlassCard hover={false}>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <School className="h-5 w-5 text-muted-foreground" />
                      {t('education')}
                    </h3>
                    <div className="space-y-3">
                      {candidate.degree && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('summaryDegree')}</p>
                          <p className="font-semibold">{candidate.degree}</p>
                        </div>
                      )}
                      {candidate.university && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('summaryUniversity')}</p>
                          <p className="font-semibold">{candidate.university}</p>
                        </div>
                      )}
                      <div className="flex gap-6">
                        {candidate.graduationYear && (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('summaryGraduationYear')}</p>
                            <p className="font-semibold">{candidate.graduationYear}</p>
                          </div>
                        )}
                        {candidate.gpa !== null && (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('summaryGpa')}</p>
                            <p className="font-semibold">{candidate.gpa}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}
            </TabsContent>

            <TabsContent value="readiness" className="space-y-5">
              <ReadinessBrief studentId={candidate.id} />
            </TabsContent>

            <TabsContent value="projects" className="space-y-5">
              {candidate.projects.length === 0 ? (
                <GlassCard hover={false}>
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">{t('noProjects')}</p>
                  </div>
                </GlassCard>
              ) : (
                candidate.projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <CardTitle className="flex items-center gap-2 flex-wrap">
                            <span className="truncate">{project.title}</span>
                            {project.innovationScore !== null && (
                              <Badge variant="outline" className="shrink-0 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
                                Score {project.innovationScore}
                              </Badge>
                            )}
                          </CardTitle>
                          {project.description && (
                            <CardDescription className="mt-2 line-clamp-2">
                              {project.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                {t('code')}
                              </a>
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                {t('live')}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.technologies && project.technologies.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t('technologies')}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.skills && project.skills.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t('skills')}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {project.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {t('views', { count: project.views })}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={`${project.title} screenshot`}
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="skills" className="space-y-5">
              {allSkills.length === 0 ? (
                <GlassCard hover={false}>
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">{t('noSkills')}</p>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard hover={false}>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{t('skillsFromProjects')}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      {t('skillsDescription', { count: candidate.projectCount })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Share dialog */}
      <ShareCandidateDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        candidateId={candidate.id}
        candidateName={`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'candidate'}
      />

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{t('contactForm.title', { name: `${candidate.firstName} ${candidate.lastName}` })}</CardTitle>
              <CardDescription>
                {t('contactForm.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {positionUpsell && positionUpsell.show && (
                <PositionUpsellBanner
                  recentContacts={positionUpsell.recentContacts}
                  spentRecently={positionUpsell.spentRecently}
                  positionPrice={positionUpsell.positionPrice}
                  savings={positionUpsell.savings}
                />
              )}
              {!candidate.email && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  {t('contactForm.emailNotPublic')}
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground/80 mb-2 block">{t('contactForm.subject')}</label>
                <Input
                  placeholder={t('contactForm.subjectPlaceholder')}
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/80 mb-2 block">{t('contactForm.message')}</label>
                <Textarea
                  placeholder={t('contactForm.messagePlaceholder')}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowContactForm(false)} disabled={sendingMessage}>
                  {t('contactForm.cancel')}
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!contactMessage.trim() || !contactSubject.trim() || sendingMessage}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {sendingMessage ? t('contactForm.sending') : t('contactForm.send')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
