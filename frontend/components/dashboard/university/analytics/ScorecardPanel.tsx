'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'
import {
  Users, Eye, Briefcase, GraduationCap, Database,
  AlertTriangle, CheckCircle, ArrowRight, TrendingUp,
  Target, BookOpen, Building2, Award, ChevronRight
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { DonutChart } from '@/components/dashboard/shared/DonutChart'
import { useInstitution } from '@/lib/institution-context'

interface Dimension {
  key: string
  score: number
  grade: string
  metrics: Record<string, any>
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  area: string
  titleKey: string
  descriptionKey: string
  metric: string
}

interface ScorecardData {
  overall: { score: number; grade: string }
  dimensions: Dimension[]
  recommendations: Recommendation[]
  raw: Record<string, number | boolean>
}

const gradeColors: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  A: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', ring: 'hsl(var(--chart-2))' },
  B: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', ring: 'hsl(var(--chart-1))' },
  C: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', ring: 'hsl(var(--chart-4))' },
  D: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', ring: 'hsl(var(--chart-3))' },
  F: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', ring: 'hsl(var(--destructive))' },
}

const dimensionIcons: Record<string, typeof Users> = {
  studentActivation: Users,
  employerVisibility: Eye,
  placementPerformance: Briefcase,
  academicQuality: GraduationCap,
  dataCompleteness: Database,
}

const dimensionColors: Record<string, string> = {
  studentActivation: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40',
  employerVisibility: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40',
  placementPerformance: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40',
  academicQuality: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40',
  dataCompleteness: 'text-slate-600 bg-slate-100 dark:bg-slate-900/40',
}

const priorityConfig: Record<string, { color: string; icon: typeof AlertTriangle }> = {
  high: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
  medium: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Target },
  low: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: TrendingUp },
}

const actionLinks: Record<string, string> = {
  activation: '/dashboard/university/students',
  profiles: '/dashboard/university/students',
  projects: '/dashboard/university/projects',
  visibility: '/dashboard/university/analytics',
  alumni: '/dashboard/university/alumni',
  courses: '/dashboard/university/courses',
  verification: '/dashboard/university/projects',
  engagement: '/dashboard/university/recruiters',
}

export default function ScorecardPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations('universityScorecard')
  const [data, setData] = useState<ScorecardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const inst = useInstitution()

  const fetchScorecard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/university/scorecard')
      if (!res.ok) throw new Error('Failed to fetch')
      setData(await res.json())
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { fetchScorecard() }, [fetchScorecard])

  if (loading) {
    return (
      <div className="min-h-screen space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card><CardContent className="pt-6 text-center">
          <p className="text-destructive">{error || t('error')}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchScorecard}>{t('retry')}</Button>
        </CardContent></Card>
      </div>
    )
  }

  const gc = gradeColors[data.overall.grade] || gradeColors.C

  return (
    <div className={embedded ? 'space-y-6' : 'min-h-screen space-y-6'}>
      {/* Hero — Overall Score */}
      {!embedded && (
      <MetricHero gradient="dark">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
          >
            <DonutChart
              value={data.overall.score}
              size={140}
              strokeWidth={10}
              color={gc.ring}
              trackColor="rgba(255,255,255,0.1)"
              label={data.overall.grade}
              sublabel={`${data.overall.score}/100`}
            />
          </motion.div>
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold tracking-tight text-white"
            >
              {inst.scoreLabel}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 mt-1 max-w-lg"
            >
              {inst.type === 'its' ? `Valutazione delle performance per il monitoraggio ${inst.complianceBody}.` : inst.type === 'school' ? `Stato di salute della scuola per il reporting ${inst.complianceBody}.` : t('subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 mt-4 flex-wrap justify-center md:justify-start"
            >
              <Badge className={`${gc.bg} ${gc.text} border ${gc.border} text-sm px-3 py-1`}>
                {t('overallGrade')}: {data.overall.grade}
              </Badge>
              <span className="text-white/40 text-sm">
                {data.raw.totalStudents} {t('students')} &middot; {data.raw.companies} {t('companies')} &middot; {data.raw.placements} {t('placements')}
              </span>
            </motion.div>
          </div>
        </div>
      </MetricHero>
      )}

      {/* Dimension Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {data.dimensions.map((dim, i) => {
          const Icon = dimensionIcons[dim.key] || Database
          const dg = gradeColors[dim.grade] || gradeColors.C
          const iconColor = dimensionColors[dim.key] || 'text-slate-600 bg-slate-100'

          return (
            <GlassCard key={dim.key} delay={0.1 + i * 0.08}>
              <div className="p-5 text-center space-y-3">
                <div className={`mx-auto w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t(`dimensions.${dim.key}`)}</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 + i * 0.08 }}
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${dg.bg} border ${dg.border}`}
                >
                  <span className={`text-2xl font-bold ${dg.text}`}>{dim.grade}</span>
                </motion.div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.08 }}
                    className="h-1.5 rounded-full bg-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">{dim.score}/100</p>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Dimension Details */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.dimensions.map((dim, i) => {
          const Icon = dimensionIcons[dim.key] || Database
          const iconColor = dimensionColors[dim.key] || 'text-slate-600 bg-slate-100'

          return (
            <GlassCard key={dim.key} delay={0.15 + i * 0.05}>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${iconColor}`}><Icon className="h-4 w-4" /></div>
                  <h3 className="font-semibold text-sm">{t(`dimensions.${dim.key}`)}</h3>
                  <Badge variant="outline" className="ml-auto">{dim.grade}</Badge>
                </div>
                <div className="space-y-2.5">
                  {Object.entries(dim.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t(`metrics.${key}`)}</span>
                      <span className="font-medium tabular-nums">
                        {typeof value === 'boolean' ? (value ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <span className="text-muted-foreground/40">—</span>) : typeof value === 'number' && key.includes('Rate') || key.includes('Completeness') || key.includes('Participation') || key.includes('Density') ? `${value}%` : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <GlassCard delay={0.2} gradient="amber">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-lg">{t('recommendationsTitle')}</h3>
              <Badge variant="outline" className="ml-auto">{data.recommendations.length} {t('actions')}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{t('recommendationsSubtitle')}</p>

            <div className="space-y-3">
              {data.recommendations.map((rec, i) => {
                const config = priorityConfig[rec.priority]
                const PIcon = config.icon

                return (
                  <motion.div
                    key={rec.titleKey}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border hover:shadow-sm transition-shadow group"
                  >
                    <div className={`p-2 rounded-xl ${config.color} flex-shrink-0`}>
                      <PIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-sm">{t(rec.titleKey)}</h4>
                        <Badge variant="outline" className="text-[10px]">{rec.metric}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{t(rec.descriptionKey)}</p>
                    </div>
                    {actionLinks[rec.area] && (
                      <Link href={actionLinks[rec.area]}>
                        <Button variant="ghost" size="sm" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </GlassCard>
      )}

      {data.recommendations.length === 0 && (
        <GlassCard delay={0.2} gradient="green">
          <div className="p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
            <h3 className="font-bold text-lg">{t('allGood')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('allGoodDesc')}</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
