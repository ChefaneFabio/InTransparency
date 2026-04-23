'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Download, Loader2, Mail, Globe, Github, Linkedin, MapPin, Calendar,
  GraduationCap, Briefcase, FileText, Languages, Award, Target, AlertCircle, CheckCircle,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface ProfileData {
  user: {
    firstName: string | null; lastName: string | null; email: string | null
    bio: string | null; tagline: string | null; university: string | null
    degree: string | null; graduationYear: number | null; gpa: string | null; gpaPublic: boolean
    location: string | null; linkedinUrl: string | null; githubUrl: string | null; portfolioUrl: string | null
    thesisTitle: string | null; thesisSubject: string | null; thesisSupervisor: string | null
    languageProficiencies: Array<{ language: string; motherTongue: boolean; reading: string | null; writing: string | null; listening: string | null; speaking: string | null; interaction: string | null }>
    certifications: Array<{ name: string; issuer: string; dateObtained: string | null }>
    workExperience: Array<{ company: string; role: string; startDate: string; endDate: string; current: boolean; description: string; contractType?: string | null }> | null
    desiredOccupation: string | null; preferredSectors: string[]
    willingToRelocate: boolean; willingToRelocateAbroad: boolean
  }
  skills: Array<{ name: string; level: number; projectCount: number }>
  projects: Array<{ id: string; title: string; skills: string[]; description?: string }>
  profileCompletion: number
  githubUrl: string | null
}

export default function CVPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations('studentCv')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard/student/profile')
        if (res.ok) setProfile(await res.json())
      } catch (err) { console.error('Failed to load:', err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/dashboard/student/cv')
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const name = [profile?.user.firstName, profile?.user.lastName].filter(Boolean).join('-') || 'student'
      a.download = `CV-${name}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch { alert(t('downloadFailed')) }
    finally { setDownloading(false) }
  }, [profile, t])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[700px] w-full rounded-xl" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 text-center py-16">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">{t('empty')}</p>
      </div>
    )
  }

  const u = profile.user
  const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ')
  const hasLanguages = u.languageProficiencies && u.languageProficiencies.length > 0
  // workExperience is Json? in Prisma — defend against non-array values
  // (older schema shapes / manual edits can deliver objects or null).
  const workExperience = Array.isArray(u.workExperience) ? u.workExperience : []
  const hasExperience = workExperience.length > 0
  const hasCerts = u.certifications && u.certifications.length > 0
  const hasProjects = profile.projects.length > 0
  const hasSkills = profile.skills.length > 0

  // Completeness check
  const sections = [
    { key: 'bio', filled: !!u.bio, label: t('sections.aboutYou') },
    { key: 'education', filled: !!(u.university && u.degree), label: t('sections.education') },
    { key: 'skills', filled: hasSkills, label: t('sections.skills') },
    { key: 'projects', filled: hasProjects, label: t('sections.projects') },
    { key: 'languages', filled: hasLanguages, label: t('sections.languages') },
    { key: 'experience', filled: hasExperience, label: t('sections.experience') },
  ]
  const filledCount = sections.filter(s => s.filled).length
  const cvStrength = Math.round((filledCount / sections.length) * 100)

  return (
    <div className={embedded ? 'space-y-6' : 'max-w-4xl mx-auto px-4 space-y-6'}>
      {/* Top bar */}
      {embedded ? (
        <div className="flex justify-end">
          <Button onClick={handleDownload} disabled={downloading} size="sm">
            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {downloading ? t('downloading') : t('download')}
          </Button>
        </div>
      ) : (
      <MetricHero gradient="primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('subtitle')}</p>
          </div>
          <Button onClick={handleDownload} disabled={downloading} size="lg">
            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {downloading ? t('downloading') : t('download')}
          </Button>
        </div>
      </MetricHero>
      )}

      {/* CV Strength indicator */}
      <GlassCard hover={false}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{t('strength')}</span>
            <span className="text-sm text-muted-foreground">{cvStrength}%</span>
          </div>
          <Progress value={cvStrength} className="h-2 mb-3" />
          <div className="flex flex-wrap gap-2">
            {sections.map(s => (
              <div key={s.key} className="flex items-center gap-1 text-xs">
                {s.filled ? <CheckCircle className="h-3 w-3 text-green-500" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />}
                <span className={s.filled ? 'text-muted-foreground' : 'text-foreground'}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* CV Document Preview */}
      <Card className="shadow-xl border-2">
        <CardContent className="p-0">
          {/* Document-style CV */}
          <div className="bg-white dark:bg-slate-950 rounded-lg overflow-hidden">
            {/* Header band */}
            <div className="bg-primary/5 border-b px-8 py-6">
              <h2 className="text-2xl font-bold text-foreground">{fullName || t('yourName')}</h2>
              {u.tagline && <p className="text-muted-foreground mt-1">{u.tagline}</p>}

              {/* Contact row */}
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-sm text-muted-foreground">
                {u.email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{u.email}</span>}
                {u.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{u.location}</span>}
                {u.linkedinUrl && <a href={u.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline"><Linkedin className="h-3.5 w-3.5" />LinkedIn</a>}
                {(u.githubUrl || profile.githubUrl) && <a href={u.githubUrl || profile.githubUrl || ''} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline"><Github className="h-3.5 w-3.5" />GitHub</a>}
                {u.portfolioUrl && <a href={u.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline"><Globe className="h-3.5 w-3.5" />Portfolio</a>}
              </div>

              {/* Mobility badges */}
              {(u.willingToRelocate || u.willingToRelocateAbroad) && (
                <div className="flex gap-2 mt-2">
                  {u.willingToRelocate && <Badge variant="outline" className="text-[10px]">{t('badges.relocate')}</Badge>}
                  {u.willingToRelocateAbroad && <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{t('badges.abroad')}</Badge>}
                </div>
              )}
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* About */}
              {u.bio && (
                <CvSection icon={<FileText className="h-4 w-4" />} title={t('sections.aboutYou')}>
                  <p className="text-sm leading-relaxed text-foreground/80">{u.bio}</p>
                </CvSection>
              )}

              {/* Education */}
              {(u.university || u.degree) && (
                <CvSection icon={<GraduationCap className="h-4 w-4" />} title={t('sections.education')}>
                  <div>
                    <p className="font-medium text-sm">{u.degree}</p>
                    <p className="text-sm text-muted-foreground">{u.university}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                      {u.graduationYear && <span>{u.graduationYear}</span>}
                      {u.gpa && u.gpaPublic && <span>GPA: {u.gpa}</span>}
                    </div>
                  </div>
                  {u.thesisTitle && (
                    <div className="mt-3 pl-3 border-l-2 border-primary/20">
                      <p className="text-xs font-medium text-muted-foreground">{t('thesis')}</p>
                      <p className="text-sm font-medium">{u.thesisTitle}</p>
                      {u.thesisSupervisor && <p className="text-xs text-muted-foreground">{t('supervisor')}: {u.thesisSupervisor}</p>}
                    </div>
                  )}
                </CvSection>
              )}

              {/* Work Experience */}
              {hasExperience && (
                <CvSection icon={<Briefcase className="h-4 w-4" />} title={t('sections.experience')}>
                  <div className="space-y-4">
                    {workExperience.map((exp, i) => (
                      <div key={i}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{exp.role}</p>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                            {exp.startDate} — {exp.current ? t('present') : exp.endDate}
                          </span>
                        </div>
                        {exp.contractType && <Badge variant="outline" className="text-[10px] mt-1">{exp.contractType}</Badge>}
                        {exp.description && <p className="text-xs text-foreground/70 mt-1.5 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </CvSection>
              )}

              {/* Skills */}
              {hasSkills && (
                <CvSection icon={<Target className="h-4 w-4" />} title={t('sections.skills')}>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.skills.slice(0, 12).map(skill => (
                      <div key={skill.name} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground">{skill.projectCount}p</span>
                          </div>
                          <Progress value={skill.level} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CvSection>
              )}

              {/* Projects */}
              {hasProjects && (
                <CvSection icon={<FileText className="h-4 w-4" />} title={t('sections.projects')}>
                  <div className="space-y-3">
                    {profile.projects.slice(0, 5).map(project => (
                      <div key={project.id}>
                        <p className="font-medium text-sm">{project.title}</p>
                        {project.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.skills.slice(0, 6).map(s => (
                              <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CvSection>
              )}

              {/* Languages — Europass CEFR style */}
              {hasLanguages && (
                <CvSection icon={<Languages className="h-4 w-4" />} title={t('sections.languages')}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-1.5 font-medium">{t('lang.language')}</th>
                          <th className="text-center py-1.5 font-medium">{t('lang.reading')}</th>
                          <th className="text-center py-1.5 font-medium">{t('lang.writing')}</th>
                          <th className="text-center py-1.5 font-medium">{t('lang.listening')}</th>
                          <th className="text-center py-1.5 font-medium">{t('lang.speaking')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {u.languageProficiencies.map(lp => (
                          <tr key={lp.language} className="border-b last:border-0">
                            <td className="py-1.5 font-medium">{lp.language}</td>
                            {lp.motherTongue ? (
                              <td colSpan={4} className="py-1.5 text-center text-muted-foreground italic">{t('lang.motherTongue')}</td>
                            ) : (
                              <>
                                <td className="py-1.5 text-center"><CefrBadge level={lp.reading} /></td>
                                <td className="py-1.5 text-center"><CefrBadge level={lp.writing} /></td>
                                <td className="py-1.5 text-center"><CefrBadge level={lp.listening} /></td>
                                <td className="py-1.5 text-center"><CefrBadge level={lp.speaking} /></td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CvSection>
              )}

              {/* Certifications */}
              {hasCerts && (
                <CvSection icon={<Award className="h-4 w-4" />} title={t('sections.certifications')}>
                  <div className="space-y-2">
                    {u.certifications.map((cert, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{cert.name}</p>
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                        </div>
                        {cert.dateObtained && (
                          <span className="text-xs text-muted-foreground">{new Date(cert.dateObtained).getFullYear()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CvSection>
              )}

              {/* Career Preferences */}
              {(u.desiredOccupation || u.preferredSectors.length > 0) && (
                <CvSection icon={<Target className="h-4 w-4" />} title={t('sections.career')}>
                  {u.desiredOccupation && <p className="text-sm font-medium">{u.desiredOccupation}</p>}
                  {u.preferredSectors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {u.preferredSectors.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                    </div>
                  )}
                </CvSection>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-3 bg-muted/30 border-t text-center">
              <p className="text-[10px] text-muted-foreground">
                {t('footer', { platform: 'InTransparency' })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/** CV Section with icon + title + content */
function CvSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 pb-1 border-b">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

/** CEFR level badge with color coding */
function CefrBadge({ level }: { level: string | null }) {
  if (!level) return <span className="text-muted-foreground">—</span>
  const colors: Record<string, string> = {
    A1: 'bg-red-100 text-red-700',
    A2: 'bg-orange-100 text-orange-700',
    B1: 'bg-yellow-100 text-yellow-700',
    B2: 'bg-green-100 text-green-700',
    C1: 'bg-blue-100 text-blue-700',
    C2: 'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[level] || 'bg-muted text-muted-foreground'}`}>
      {level}
    </span>
  )
}
