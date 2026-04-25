'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Mail, School, Save, Edit3, Camera, Github, Globe, Eye, FileText,
  AlertCircle, Users, Briefcase, MapPin, Calendar, Shield, X, Check,
  Download, Share2, ExternalLink,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { DonutChart } from '@/components/dashboard/shared/DonutChart'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { StaggerContainer, StaggerItem } from '@/components/ui/animated-card'
import PremiumBadge from '@/components/shared/PremiumBadge'

interface WorkExperienceEntry {
  company: string; role: string; startDate: string; endDate: string
  description: string; current: boolean; contractType?: string | null
  companySector?: string | null; businessArea?: string | null
}
interface LanguageProfEntry {
  id: string; language: string; motherTongue: boolean
  reading: string | null; writing: string | null; listening: string | null
  speaking: string | null; interaction: string | null
}
interface CertificationEntry {
  id: string; name: string; issuer: string
  dateObtained: string | null; expiryDate: string | null
  credentialId: string | null; credentialUrl: string | null
}
interface ProfileData {
  user: {
    id: string; firstName: string | null; lastName: string | null; email: string
    photo: string | null; bio: string | null; tagline: string | null
    university: string | null; degree: string | null; graduationYear: string | null
    gpa: string | null; gpaPublic: boolean; profilePublic: boolean
    portfolioUrl: string | null; subscriptionTier: string
    showLocation: boolean; showEmail: boolean; showPhone: boolean
    location: string | null; interests: string[]; availableFor: string
    workExperience: WorkExperienceEntry[] | null
    thesisTitle: string | null; thesisSubject: string | null
    thesisSupervisor: string | null; thesisKeywords: string[]
    desiredOccupation: string | null; preferredSectors: string[]
    preferredAreas: string[]; preferredLocations: string[]
    willingToRelocate: boolean; willingToRelocateAbroad: boolean
    willingToTravel: boolean; continuingStudies: boolean; continuingStudiesType: string | null
    languageProficiencies: LanguageProfEntry[]; certifications: CertificationEntry[]
  }
  skills: Array<{ name: string; level: number; projectCount: number }>
  stats: { profileViews: number; recruiterViews: number; totalApplications: number; totalProjects: number }
  profileCompletion: number
  completionItems: Array<{ field: string; label: string; filled: boolean }>
  projects: Array<{ id: string; title: string; skills: string[]; technologies: string[]; views: number; recruiterViews: number; githubUrl: string | null }>
  githubUrl: string | null
}

export default function ProfileEditPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations('studentProfile')
  const ts = useTranslations('shared')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [editBio, setEditBio] = useState('')
  const [editTagline, setEditTagline] = useState('')
  const [editPortfolioUrl, setEditPortfolioUrl] = useState('')
  const [editProfilePublic, setEditProfilePublic] = useState(false)
  const [editShowEmail, setEditShowEmail] = useState(false)
  const [editGpaPublic, setEditGpaPublic] = useState(false)

  const fetchProfile = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/student/profile')
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.json() })
      .then((data: ProfileData) => {
        setProfile(data)
        setEditBio(data.user.bio || '')
        setEditTagline(data.user.tagline || '')
        setEditPortfolioUrl(data.user.portfolioUrl || '')
        setEditProfilePublic(data.user.profilePublic)
        setEditShowEmail(data.user.showEmail)
        setEditGpaPublic(data.user.gpaPublic)
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: editBio, tagline: editTagline, portfolioUrl: editPortfolioUrl,
          profilePublic: editProfilePublic, showEmail: editShowEmail, gpaPublic: editGpaPublic,
        }),
      })
      if (!res.ok) { const d = await res.json(); alert(d.error || t('saveFailed')); return }
      setEditing(false)
      fetchProfile()
    } catch { alert(t('saveFailed')) } finally { setSaving(false) }
  }

  const downloadCV = async () => {
    try {
      const res = await fetch('/api/dashboard/student/cv')
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CV_${profile?.user.firstName || 'student'}_${profile?.user.lastName || ''}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch { alert(t('cvFailed')) }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <Card><CardContent className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{t('errorTitle')}</h2>
          <p className="text-muted-foreground mb-4">{error || t('notFound')}</p>
          <Button onClick={fetchProfile}>{t('tryAgain')}</Button>
        </CardContent></Card>
      </div>
    )
  }

  const { user, skills, stats, profileCompletion, completionItems, projects, githubUrl } = profile

  const availabilityConfig: Record<string, { label: string; className: string }> = {
    BOTH: { label: t('available'), className: 'bg-green-100 text-green-800 border-green-200' },
    HIRING: { label: t('openToOffers'), className: 'bg-blue-100 text-blue-800 border-blue-200' },
    PROJECTS: { label: t('projectsOnly'), className: 'bg-purple-100 text-purple-800 border-purple-200' },
    NONE: { label: t('notLooking'), className: 'bg-muted text-muted-foreground border-border' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Header */}
      <GlassCard delay={0} gradient="primary">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar + basic info */}
            <div className="flex items-start gap-5">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-white/50 shadow-lg">
                  <AvatarImage src={user.photo || ''} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {(user.firstName || '?')[0]}{(user.lastName || '?')[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                {user.tagline && <p className="text-muted-foreground text-sm mt-0.5">{user.tagline}</p>}
                {user.degree && user.university && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <School className="h-3.5 w-3.5" /> {user.degree} — {user.university}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {user.location && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {user.location}
                    </span>
                  )}
                  {user.graduationYear && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {user.graduationYear}
                    </span>
                  )}
                  {availabilityConfig[user.availableFor] && (
                    <Badge variant="outline" className={`text-[10px] ${availabilityConfig[user.availableFor].className}`}>
                      {availabilityConfig[user.availableFor].label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Actions + completion */}
            <div className="flex flex-col items-end gap-3 md:ml-auto">
              <DonutChart value={profileCompletion} size={80} strokeWidth={8} sublabel={ts('complete')} />
              <div className="flex gap-2">
                <Button size="sm" variant={editing ? 'default' : 'outline'} onClick={() => editing ? saveProfile() : setEditing(true)} disabled={saving}>
                  {editing ? <><Save className="h-3.5 w-3.5 mr-1" />{saving ? t('saving') : t('save')}</> : <><Edit3 className="h-3.5 w-3.5 mr-1" />{t('edit')}</>}
                </Button>
                {editing && <Button size="sm" variant="ghost" onClick={() => setEditing(false)}><X className="h-3.5 w-3.5" /></Button>}
                <Button size="sm" variant="outline" onClick={downloadCV}><Download className="h-3.5 w-3.5 mr-1" />CV</Button>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Row */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem><StatCard label={t('stats.views')} value={stats.profileViews} icon={<Eye className="h-5 w-5" />} variant="blue" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.recruiterViews')} value={stats.recruiterViews} icon={<Users className="h-5 w-5" />} variant="purple" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.projects')} value={stats.totalProjects} icon={<Briefcase className="h-5 w-5" />} variant="green" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.applications')} value={stats.totalApplications} icon={<Mail className="h-5 w-5" />} variant="rose" /></StaggerItem>
      </StaggerContainer>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="skills">{t('tabs.skills')}</TabsTrigger>
              <TabsTrigger value="projects">{t('tabs.projects')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Edit mode */}
              {editing ? (
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div><Label>{t('fields.tagline')}</Label><Input value={editTagline} onChange={e => setEditTagline(e.target.value)} placeholder={t('placeholders.tagline')} /></div>
                    <div><Label>{t('fields.bio')}</Label><Textarea rows={4} value={editBio} onChange={e => setEditBio(e.target.value)} placeholder={t('placeholders.bio')} /></div>
                    <div>
                      <Label className="flex items-center gap-2">
                        {t('fields.portfolio')}
                        <PremiumBadge audience="student" variant="chip" label="Premium" />
                      </Label>
                      <Input value={editPortfolioUrl} onChange={e => setEditPortfolioUrl(e.target.value)} placeholder="https://yourname.intransparency.com" />
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Premium feature: custom portfolio URL on your own subdomain.
                      </p>
                    </div>
                    <div className="space-y-3 border-t pt-4">
                      <h4 className="text-sm font-medium">{t('privacy.title')}</h4>
                      <div className="flex items-center justify-between"><Label>{t('privacy.publicProfile')}</Label><Switch checked={editProfilePublic} onCheckedChange={setEditProfilePublic} /></div>
                      <div className="flex items-center justify-between"><Label>{t('privacy.showEmail')}</Label><Switch checked={editShowEmail} onCheckedChange={setEditShowEmail} /></div>
                      <div className="flex items-center justify-between"><Label>{t('privacy.showGpa')}</Label><Switch checked={editGpaPublic} onCheckedChange={setEditGpaPublic} /></div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Bio */}
                  <Card>
                    <CardContent className="p-5">
                      {user.bio ? (
                        <p className="text-sm leading-relaxed text-foreground/80">{user.bio}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">{t('empty.bio')}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Education */}
                  {(user.university || user.degree) && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><School className="h-4 w-4" />{t('sections.education')}</CardTitle></CardHeader>
                      <CardContent className="pt-0">
                        {user.degree && <p className="font-medium text-sm">{user.degree}</p>}
                        {user.university && <p className="text-sm text-muted-foreground">{user.university}</p>}
                        <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                          {user.graduationYear && <span>{user.graduationYear}</span>}
                          {user.gpa && user.gpaPublic && <span>GPA: {user.gpa}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Thesis */}
                  {user.thesisTitle && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" />{t('sections.thesis')}</CardTitle></CardHeader>
                      <CardContent className="pt-0 space-y-1">
                        <p className="font-medium text-sm">{user.thesisTitle}</p>
                        {user.thesisSubject && <p className="text-xs text-muted-foreground">{user.thesisSubject}</p>}
                        {user.thesisSupervisor && <p className="text-xs text-muted-foreground">{t('fields.supervisor')}: {user.thesisSupervisor}</p>}
                        {user.thesisKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">{user.thesisKeywords.map(kw => <Badge key={kw} variant="secondary" className="text-[10px]">{kw}</Badge>)}</div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Work Experience */}
                  {Array.isArray(user.workExperience) && user.workExperience.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Briefcase className="h-4 w-4" />{t('sections.experience')}</CardTitle></CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {user.workExperience.map((exp, i) => (
                            <div key={i} className="relative pl-5 border-l-2 border-muted pb-3 last:pb-0">
                              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                              <p className="font-medium text-sm">{exp.role}</p>
                              <p className="text-xs text-muted-foreground">{exp.company}</p>
                              <p className="text-xs text-muted-foreground/70 mt-0.5">{exp.startDate} — {exp.current ? t('present') : exp.endDate}</p>
                              {exp.description && <p className="text-xs text-foreground/70 mt-1">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Languages */}
                  {user.languageProficiencies.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm">{t('sections.languages')}</CardTitle></CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {user.languageProficiencies.map(lp => (
                            <div key={lp.id} className="flex items-center justify-between text-sm">
                              <span className="font-medium">{lp.language}</span>
                              {lp.motherTongue ? (
                                <Badge variant="outline" className="text-[10px]">{t('motherTongue')}</Badge>
                              ) : (
                                <div className="flex gap-1">
                                  {[lp.reading, lp.writing, lp.speaking].filter(Boolean).map((level, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px]">{level}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Certifications */}
                  {user.certifications.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm">{t('sections.certifications')}</CardTitle></CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {user.certifications.map(cert => (
                            <div key={cert.id} className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-sm">{cert.name}</p>
                                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                              </div>
                              {cert.credentialUrl && (
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />{ts('view')}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Career Preferences */}
                  {(user.desiredOccupation || user.preferredSectors.length > 0) && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Share2 className="h-4 w-4" />{t('sections.careerPrefs')}</CardTitle></CardHeader>
                      <CardContent className="pt-0 space-y-2 text-sm">
                        {user.desiredOccupation && <div className="flex justify-between"><span className="text-muted-foreground">{t('fields.desiredRole')}</span><span className="font-medium">{user.desiredOccupation}</span></div>}
                        {user.preferredSectors.length > 0 && (
                          <div className="flex flex-wrap gap-1">{user.preferredSectors.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}</div>
                        )}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {user.willingToRelocate && <Badge variant="outline" className="text-[10px]">{t('badges.relocate')}</Badge>}
                          {user.willingToRelocateAbroad && <Badge variant="outline" className="text-[10px]">{t('badges.abroad')}</Badge>}
                          {user.willingToTravel && <Badge variant="outline" className="text-[10px]">{t('badges.travel')}</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Links */}
                  {(githubUrl || user.portfolioUrl) && (
                    <Card>
                      <CardContent className="p-4 flex flex-wrap gap-2">
                        {githubUrl && <Button variant="outline" size="sm" asChild><a href={githubUrl} target="_blank" rel="noopener noreferrer"><Github className="h-3.5 w-3.5 mr-1.5" />GitHub</a></Button>}
                        {user.portfolioUrl && <Button variant="outline" size="sm" asChild><a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer"><Globe className="h-3.5 w-3.5 mr-1.5" />Portfolio</a></Button>}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('sections.skills')}</CardTitle>
                  <CardDescription className="text-xs">{t('skillsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {skills.length > 0 ? (
                    <div className="space-y-3">
                      {skills.map(skill => (
                        <div key={skill.name}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">{skill.level}% · {skill.projectCount} {skill.projectCount === 1 ? t('project') : t('projects')}</span>
                          </div>
                          <Progress value={skill.level} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">{t('empty.skills')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-3 mt-4">
              {projects.length > 0 ? projects.map(project => (
                <Link key={project.id} href={`/dashboard/student/projects/${project.id}`}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm">{project.title}</h3>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {project.skills.concat(project.technologies).slice(0, 6).map(s => (
                              <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground ml-3">
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{project.views}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{project.recruiterViews}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">{t('empty.projects')}</p>
                    <Button size="sm" asChild><Link href="/dashboard/student/projects/new">{t('addProject')}</Link></Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Completion checklist */}
          <GlassCard delay={0.2}>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-3">{t('completion')}</h3>
              <Progress value={profileCompletion} className="h-2 mb-3" />
              <div className="space-y-1.5">
                {completionItems.map(item => (
                  <div key={item.field} className="flex items-center gap-2 text-xs">
                    {item.filled ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
                    )}
                    <span className={item.filled ? 'text-muted-foreground' : 'text-foreground'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Interests */}
          {user.interests.length > 0 && (
            <GlassCard delay={0.3}>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2">{t('sections.interests')}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map(i => <Badge key={i} variant="outline" className="text-[10px]">{i}</Badge>)}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
