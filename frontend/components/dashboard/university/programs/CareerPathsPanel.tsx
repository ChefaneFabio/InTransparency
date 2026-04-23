'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search, TrendingUp, Building2, Briefcase, GraduationCap,
  ChevronRight, Globe, Users, FolderOpen, Award, ArrowRight
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { useInstitution } from '@/lib/institution-context'

interface Program {
  degree: string
  studentCount: number
  topSkills: Array<{ skill: string; studentsWithSkill: number; industriesCount: number }>
  matchingJobs: number
  matchingIndustries: Array<{ industry: string; jobCount: number }>
  matchingCompanies: string[]
  careerPaths: Array<{ role: string; weight: number }>
  demandScore: number
  placementCount: number
  alumniCount: number
  verifiedProjects: number
}

const demandColor = (score: number) => {
  if (score >= 70) return { text: 'text-emerald-700', bg: 'bg-emerald-100 dark:bg-emerald-900/30', bar: 'bg-emerald-500' }
  if (score >= 40) return { text: 'text-blue-700', bg: 'bg-blue-100 dark:bg-blue-900/30', bar: 'bg-blue-500' }
  if (score >= 20) return { text: 'text-amber-700', bg: 'bg-amber-100 dark:bg-amber-900/30', bar: 'bg-amber-500' }
  return { text: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800', bar: 'bg-slate-400' }
}

const demandLabel = (score: number, t: (key: string) => string) => {
  if (score >= 70) return t('demand.high')
  if (score >= 40) return t('demand.good')
  if (score >= 20) return t('demand.moderate')
  return t('demand.emerging')
}

export default function CareerPathsPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations('careerPaths')
  const inst = useInstitution()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/career-paths')
      if (res.ok) {
        const data = await res.json()
        setPrograms(data.programs)
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = programs.filter(p =>
    !searchTerm || p.degree.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={embedded ? 'space-y-6' : 'min-h-screen space-y-6'}>
      {!embedded && (
        <MetricHero gradient="dark">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
            <p className="text-white/60 mt-1 max-w-2xl">{t('subtitle')}</p>
          </div>
        </MetricHero>
      )}

      {/* Search */}
      <GlassCard delay={0.1}>
        <div className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </GlassCard>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      )}

      {/* Program cards */}
      {!loading && filtered.map((program, i) => {
        const dc = demandColor(program.demandScore)
        const isExpanded = expanded === program.degree

        return (
          <motion.div
            key={program.degree}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow overflow-hidden">
              {/* Header row */}
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Demand score */}
                  <div className={`w-16 h-16 rounded-2xl ${dc.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg font-bold ${dc.text}`}>{program.demandScore}</span>
                    <span className="text-[8px] text-muted-foreground uppercase tracking-wide">{t('demand.label')}</span>
                  </div>

                  {/* Program info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{program.degree}</h3>
                      <Badge className={`${dc.bg} ${dc.text} border-0 text-xs`}>
                        {demandLabel(program.demandScore, t)}
                      </Badge>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-5 mt-2 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{program.studentCount} {inst.studentsLabel.toLowerCase()}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{program.matchingJobs} {t('openRoles')}</span>
                      <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{program.matchingIndustries.length} {t('industries')}</span>
                      <span className="flex items-center gap-1"><FolderOpen className="h-3.5 w-3.5" />{program.verifiedProjects} {t('verifiedProjects')}</span>
                    </div>

                    {/* Career paths preview */}
                    {program.careerPaths.length > 0 && (
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {program.careerPaths.slice(0, 4).map(cp => (
                          <Badge key={cp.role} variant="outline" className="text-xs font-normal">
                            {cp.role}
                          </Badge>
                        ))}
                        {program.careerPaths.length > 4 && (
                          <Badge variant="secondary" className="text-xs">+{program.careerPaths.length - 4}</Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expand button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(isExpanded ? null : program.degree)}
                  >
                    <ChevronRight className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t grid gap-6 md:grid-cols-3">
                      {/* Transferable skills */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />{t('transferableSkills')}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3">{t('transferableSkillsDesc')}</p>
                        <div className="space-y-2">
                          {program.topSkills.slice(0, 8).map((s, si) => (
                            <div key={s.skill} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{s.skill}</span>
                                <span className="text-xs text-muted-foreground">{s.industriesCount} {t('industriesShort')}</span>
                              </div>
                              <Progress value={Math.min(100, s.industriesCount * 15)} className="h-1.5" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Matching industries */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-600" />{t('matchingIndustries')}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3">{t('matchingIndustriesDesc')}</p>
                        <div className="space-y-2">
                          {program.matchingIndustries.map(ind => (
                            <div key={ind.industry} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                              <span className="text-sm">{ind.industry}</span>
                              <Badge variant="secondary" className="text-xs">{ind.jobCount} {t('roles')}</Badge>
                            </div>
                          ))}
                          {program.matchingIndustries.length === 0 && (
                            <p className="text-xs text-muted-foreground">{t('noIndustries')}</p>
                          )}
                        </div>

                        {/* Companies */}
                        {program.matchingCompanies.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-medium text-muted-foreground mb-2">{t('companiesHiring')}</p>
                            <div className="flex gap-1 flex-wrap">
                              {program.matchingCompanies.slice(0, 6).map(c => (
                                <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Career paths + evidence */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-emerald-600" />{t('careerPathsTitle')}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3">{t('careerPathsDesc')}</p>
                        <div className="space-y-1.5">
                          {program.careerPaths.map(cp => (
                            <div key={cp.role} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                              <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                              <span className="text-sm">{cp.role}</span>
                            </div>
                          ))}
                          {program.careerPaths.length === 0 && (
                            <p className="text-xs text-muted-foreground">{t('noPaths')}</p>
                          )}
                        </div>

                        {/* Evidence */}
                        <div className="mt-4 p-3 rounded-lg border bg-muted/30">
                          <p className="text-xs font-medium text-muted-foreground mb-2">{t('evidence')}</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between"><span>{t('placements')}</span><span className="font-medium">{program.placementCount}</span></div>
                            <div className="flex justify-between"><span>{t('alumniTracked')}</span><span className="font-medium">{program.alumniCount}</span></div>
                            <div className="flex justify-between"><span>{t('verifiedProjectsLabel')}</span><span className="font-medium">{program.verifiedProjects}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}

      {!loading && filtered.length === 0 && (
        <GlassCard delay={0.1}>
          <div className="p-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg">{t('noPrograms')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('noProgramsHint')}</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
