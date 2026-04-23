'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/navigation'
import {
  Search, Target, Sparkles, Loader2, ChevronRight, CheckCircle,
  XCircle, Star, Building2, GraduationCap, Briefcase, MapPin,
  FolderOpen, ThumbsUp, ArrowRight, Plus, X, Award
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Match {
  id: string
  name: string
  photo: string | null
  university: string | null
  degree: string | null
  graduationYear: string | null
  location: string | null
  bio: string | null
  skills: string[]
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  missingPreferred: string[]
  reasons: Array<{ factor: string; score: number; detail: string }>
  projectCount: number
  verifiedProjectCount: number
  topProjects: Array<{ title: string; grade: string | null; verified: boolean; innovationScore: number | null }>
  internships: Array<{ company: string; role: string; rating: number | null; wouldHire: boolean | null }>
  availableFor: string
}

interface Job {
  id: string
  title: string
  requiredSkills: string[]
  preferredSkills: string[]
}

const factorLabels: Record<string, { label: string; icon: typeof CheckCircle }> = {
  requiredSkills: { label: 'Required skills match', icon: CheckCircle },
  preferredSkills: { label: 'Preferred skills', icon: Star },
  verifiedProjects: { label: 'Verified projects', icon: FolderOpen },
  internshipExperience: { label: 'Internship experience', icon: Briefcase },
  academicPerformance: { label: 'Academic performance', icon: GraduationCap },
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-muted-foreground'
}

const scoreBg = (score: number) => {
  if (score >= 80) return 'bg-emerald-100 dark:bg-emerald-900/30'
  if (score >= 60) return 'bg-blue-100 dark:bg-blue-900/30'
  if (score >= 40) return 'bg-amber-100 dark:bg-amber-900/30'
  return 'bg-muted'
}

interface MatchPanelProps { embedded?: boolean }

export default function MatchPanel({ embedded = false }: MatchPanelProps = {}) {
  const t = useTranslations('talentMatch')
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState('')
  const [customSkills, setCustomSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs?own=true&limit=20')
        if (res.ok) {
          const data = await res.json()
          setJobs(data.jobs || [])
        }
      } catch {}
    }
    fetchJobs()
  }, [])

  const addSkill = () => {
    const skill = skillInput.trim()
    if (skill && !customSkills.includes(skill)) {
      setCustomSkills(prev => [...prev, skill])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setCustomSkills(prev => prev.filter(s => s !== skill))
  }

  const handleMatch = async () => {
    setLoading(true)
    setSearched(true)
    setMatches([])
    try {
      const body: any = {}
      if (selectedJob && selectedJob !== 'custom') {
        body.jobId = selectedJob
      }
      if (customSkills.length > 0) {
        body.requiredSkills = customSkills
      }
      const res = await fetch('/api/dashboard/recruiter/talent-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        setMatches(data.matches)
      }
    } catch {}
    finally { setLoading(false) }
  }

  const selectedJobData = jobs.find(j => j.id === selectedJob)

  return (
    <div className={embedded ? 'space-y-6' : 'min-h-screen space-y-6'}>
      {!embedded && (
        <MetricHero gradient="dark">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-white/10"
            >
              <Target className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
              <p className="text-white/60 mt-1">{t('subtitle')}</p>
            </div>
          </div>
        </MetricHero>
      )}

      {/* Criteria */}
      <GlassCard delay={0.1} gradient="primary">
        <div className="p-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t('selectRole')}</Label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={t('selectRolePlaceholder')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">{t('customCriteria')}</SelectItem>
                  {jobs.map(j => (
                    <SelectItem key={j.id} value={j.id}>
                      <span className="flex items-center gap-2"><Briefcase className="h-3.5 w-3.5" />{j.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedJobData && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {selectedJobData.requiredSkills.map(s => <Badge key={s} variant="default" className="text-xs">{s}</Badge>)}
                  {selectedJobData.preferredSkills.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t('addSkills')}</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={t('skillPlaceholder')}
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="rounded-xl"
                />
                <Button variant="outline" onClick={addSkill} className="rounded-xl"><Plus className="h-4 w-4" /></Button>
              </div>
              {customSkills.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {customSkills.map(s => (
                    <Badge key={s} variant="secondary" className="text-xs gap-1">
                      {s}
                      <button onClick={() => removeSkill(s)}><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleMatch}
            disabled={loading || (!selectedJob && customSkills.length === 0)}
            size="lg"
            className="rounded-xl shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Target className="h-5 w-5 mr-2" />}
            {loading ? t('matching') : t('findTalent')}
          </Button>
        </div>
      </GlassCard>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassCard delay={0} hover={false}>
              <div className="p-10 text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"
                >
                  <Target className="h-7 w-7 text-primary" />
                </motion.div>
                <p className="font-medium">{t('scanning')}</p>
                <p className="text-sm text-muted-foreground">{t('scanningDesc')}</p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {!loading && searched && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">{t('results', { count: matches.length })}</h2>
            {matches.length > 0 && (
              <Badge variant="outline">{t('rankedBy')}</Badge>
            )}
          </div>

          {matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    {/* Score circle */}
                    <div className={`w-16 h-16 rounded-2xl ${scoreBg(match.matchScore)} flex flex-col items-center justify-center flex-shrink-0`}>
                      <span className={`text-xl font-bold ${scoreColor(match.matchScore)}`}>{match.matchScore}</span>
                      <span className="text-[9px] text-muted-foreground">/ 100</span>
                    </div>

                    {/* Profile */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={match.photo || ''} />
                          <AvatarFallback>{match.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{match.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {match.university && <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{match.university}</span>}
                            {match.degree && <span>{match.degree}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Matched + missing skills */}
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {match.matchedSkills.map(s => (
                          <Badge key={s} className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                            <CheckCircle className="h-3 w-3 mr-0.5" />{s}
                          </Badge>
                        ))}
                        {match.missingSkills.map(s => (
                          <Badge key={s} className="bg-red-50 text-red-600 border-0 text-xs">
                            <XCircle className="h-3 w-3 mr-0.5" />{s}
                          </Badge>
                        ))}
                      </div>

                      {/* Evidence row */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><FolderOpen className="h-3 w-3" />{match.verifiedProjectCount} verified / {match.projectCount} total</span>
                        {match.internships.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {match.internships.map(s => s.company).join(', ')}
                            {match.internships.some(s => s.wouldHire) && <ThumbsUp className="h-3 w-3 text-emerald-600 ml-0.5" />}
                          </span>
                        )}
                        {match.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{match.location}</span>}
                      </div>

                      {/* Expandable: why this student */}
                      <button
                        onClick={() => setExpanded(expanded === match.id ? null : match.id)}
                        className="text-xs text-primary font-medium mt-2 flex items-center gap-1 hover:underline"
                      >
                        {expanded === match.id ? t('hideDetails') : t('whyThisStudent')}
                        <ChevronRight className={`h-3 w-3 transition-transform ${expanded === match.id ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {expanded === match.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 p-4 rounded-xl bg-muted/50 space-y-3">
                              {/* Score breakdown */}
                              <div className="space-y-2">
                                {match.reasons.map(r => {
                                  const config = factorLabels[r.factor]
                                  const Icon = config?.icon || Star
                                  return (
                                    <div key={r.factor} className="flex items-start gap-2">
                                      <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium">{config?.label || r.factor}</span>
                                          <span className="text-sm font-bold tabular-nums text-primary">+{r.score}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{r.detail}</p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Top projects */}
                              {match.topProjects.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">{t('relevantProjects')}</p>
                                  <div className="space-y-1">
                                    {match.topProjects.map((p, pi) => (
                                      <div key={pi} className="flex items-center gap-2 text-sm">
                                        {p.verified ? <Award className="h-3.5 w-3.5 text-emerald-600" /> : <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />}
                                        <span>{p.title}</span>
                                        {p.grade && <Badge variant="outline" className="text-[10px]">{p.grade}</Badge>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Internship detail */}
                              {match.internships.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">{t('internshipRecord')}</p>
                                  {match.internships.map((s, si) => (
                                    <div key={si} className="flex items-center gap-2 text-sm">
                                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>{s.role} @ {s.company}</span>
                                      {s.rating && (
                                        <span className="flex items-center gap-0.5">
                                          {Array.from({ length: s.rating }, (_, i) => <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />)}
                                        </span>
                                      )}
                                      {s.wouldHire && <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[10px]"><ThumbsUp className="h-3 w-3 mr-0.5" />Would hire</Badge>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/students/${match.id}/public`}>{t('viewProfile')}<ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {matches.length === 0 && searched && !loading && (
            <GlassCard delay={0.1}>
              <div className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg">{t('noMatches')}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{t('noMatchesHint')}</p>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Empty state */}
      {!searched && !loading && (
        <GlassCard delay={0.15}>
          <div className="p-16 text-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/30 flex items-center justify-center mb-6 border"
            >
              <Target className="h-10 w-10 text-primary" />
            </motion.div>
            <h3 className="text-xl font-bold">{t('emptyTitle')}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">{t('emptyDesc')}</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
