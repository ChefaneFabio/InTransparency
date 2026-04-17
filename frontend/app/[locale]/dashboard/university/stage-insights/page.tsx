'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrendingUp, BookOpen, Brain, MessageSquare, Star,
  AlertTriangle, Heart, Users, Lightbulb, BarChart3, GraduationCap
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { useInstitution } from '@/lib/institution-context'

interface Insights {
  totalEntries: number
  totalStages: number
  stagesWithJournals: number
  avgPreparedness: number | null
  avgSatisfaction: number | null
  prepTrend: Array<{ week: number; avg: number; count: number }>
  growthCurve: Array<{ week: number; confidence: number | null; independence: number | null }>
  topCourses: Array<{ course: string; count: number }>
  topSkills: Array<{ skill: string; count: number }>
  topNewSkills: Array<{ skill: string; count: number }>
  satDistribution: Array<{ rating: number; count: number }>
  challenges: Array<{ text: string; week: number }>
  advice: string[]
}

const BAR_COLORS = ['bg-primary', 'bg-primary/80', 'bg-primary/60', 'bg-primary/40', 'bg-primary/25']

export default function StageInsightsPage() {
  const t = useTranslations('stageInsights')
  const inst = useInstitution()
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/stage-insights')
      if (res.ok) {
        const data = await res.json()
        setInsights(data.insights)
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return (
    <div className="min-h-screen space-y-6">
      <Skeleton className="h-40 rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-4">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )

  if (!insights) return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="dark">
        <div><h1 className="text-3xl font-bold tracking-tight text-white">{inst.insightsTitle}</h1><p className="text-white/60 mt-1">{inst.insightsSubtitle}</p></div>
      </MetricHero>
      <GlassCard delay={0.1}>
        <div className="p-12 text-center">
          <Brain className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg">{t('noData')}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{t('noDataHint')}</p>
        </div>
      </GlassCard>
    </div>
  )

  const maxSkillCount = Math.max(...insights.topSkills.map(s => s.count), 1)
  const maxCourseCount = Math.max(...insights.topCourses.map(c => c.count), 1)
  const maxGrowthWeek = Math.max(...insights.growthCurve.map(g => g.week), 1)

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="dark">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{inst.insightsTitle}</h1>
          <p className="text-white/60 mt-1">{inst.insightsSubtitle}</p>
        </div>
      </MetricHero>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label={t('metrics.preparedness')} value={insights.avgPreparedness || 0} icon={<GraduationCap className="h-5 w-5" />} variant="blue" suffix="/5" />
        <StatCard label={t('metrics.satisfaction')} value={insights.avgSatisfaction || 0} icon={<Heart className="h-5 w-5" />} variant="rose" suffix="/5" />
        <StatCard label={t('metrics.journalEntries')} value={insights.totalEntries} icon={<BookOpen className="h-5 w-5" />} variant="purple" />
        <StatCard label={t('metrics.stagesTracked')} value={insights.stagesWithJournals} icon={<Users className="h-5 w-5" />} variant="green" suffix={`/${insights.totalStages}`} />
      </div>

      {/* Growth curve */}
      {insights.growthCurve.length > 1 && (
        <GlassCard delay={0.1}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-bold">{t('growth.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t('growth.description')}</p>
            <div className="h-48 flex items-end gap-3">
              {insights.growthCurve.map((point, i) => (
                <div key={point.week} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end h-36">
                    {point.confidence !== null && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(point.confidence / 5) * 100}%` }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                        className="flex-1 bg-blue-500/70 rounded-t"
                        title={`${t('growth.confidence')}: ${point.confidence}`}
                      />
                    )}
                    {point.independence !== null && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(point.independence / 5) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                        className="flex-1 bg-emerald-500/70 rounded-t"
                        title={`${t('growth.independence')}: ${point.independence}`}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">W{point.week}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/70" />{t('growth.confidence')}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/70" />{t('growth.independence')}</span>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Most referenced courses */}
        {insights.topCourses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-600" />{t('courses.title')}</CardTitle>
              <CardDescription>{t('courses.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.topCourses.map((c, i) => (
                  <div key={c.course} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.course}</span>
                      <span className="text-muted-foreground tabular-nums">{c.count}x</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.count / maxCourseCount) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                        className={`${BAR_COLORS[i % BAR_COLORS.length]} h-1.5 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills practiced in the workplace */}
        {insights.topSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4 text-purple-600" />{t('skills.title')}</CardTitle>
              <CardDescription>{t('skills.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.topSkills.map((s, i) => (
                  <div key={s.skill} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{s.skill}</span>
                      <span className="text-muted-foreground tabular-nums">{s.count}x</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.count / maxSkillCount) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                        className={`${BAR_COLORS[i % BAR_COLORS.length]} h-1.5 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* New skills learned on the job */}
        {insights.topNewSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-600" />{t('newSkills.title')}</CardTitle>
              <CardDescription>{t('newSkills.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {insights.topNewSkills.map(s => (
                  <Badge key={s.skill} variant="secondary" className="text-sm py-1 px-3">
                    {s.skill} <span className="ml-1 text-muted-foreground">({s.count})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Satisfaction distribution */}
        {insights.satDistribution.some(s => s.count > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Heart className="h-4 w-4 text-rose-600" />{t('satisfaction.title')}</CardTitle>
              <CardDescription>{t('satisfaction.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-24">
                {insights.satDistribution.map((s, i) => {
                  const maxCount = Math.max(...insights.satDistribution.map(d => d.count), 1)
                  return (
                    <div key={s.rating} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground tabular-nums">{s.count}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max((s.count / maxCount) * 100, 4)}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                        className={`w-full rounded-t ${i >= 3 ? 'bg-emerald-500/70' : i >= 1 ? 'bg-amber-500/70' : 'bg-red-500/70'}`}
                      />
                      <span className="text-xs font-medium">{s.rating}</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">{t('satisfaction.scale')}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Challenges & advice — the qualitative gold */}
      <div className="grid gap-6 md:grid-cols-2">
        {insights.challenges.length > 0 && (
          <GlassCard delay={0.2} gradient="amber">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold">{t('challenges.title')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t('challenges.description')}</p>
              <div className="space-y-3">
                {insights.challenges.slice(0, 8).map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border">
                    <Badge variant="outline" className="h-6 w-6 flex items-center justify-center rounded-full text-[10px] flex-shrink-0">W{c.week}</Badge>
                    <p className="text-sm leading-relaxed">{c.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {insights.advice.length > 0 && (
          <GlassCard delay={0.25} gradient="green">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold">{t('advice.title')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t('advice.description')}</p>
              <div className="space-y-3">
                {insights.advice.slice(0, 8).map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border">
                    <p className="text-sm leading-relaxed italic">&ldquo;{a}&rdquo;</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
