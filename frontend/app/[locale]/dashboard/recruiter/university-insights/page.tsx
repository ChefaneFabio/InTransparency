'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  GraduationCap, Users, FolderOpen, CheckCircle, TrendingUp,
  Building2, BarChart3, Award
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface UniversityInsight {
  university: string
  studentCount: number
  matchingStudents: number
  matchRate: number
  verifiedProjects: number
  verificationRate: number
  topSkills: string[]
  topDisciplines: string[]
}

export default function UniversityInsightsPage() {
  const t = useTranslations('universityInsightsPage')
  const [insights, setInsights] = useState<UniversityInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/recruiter/university-insights')
        if (res.ok) {
          const data = await res.json()
          setInsights(data.universities || [])
        }
      } catch {}
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const maxStudents = Math.max(...insights.map(u => u.studentCount), 1)

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="dark">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
          <p className="text-white/60 mt-1">{t('subtitle')}</p>
        </div>
      </MetricHero>

      {loading && (
        <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>
      )}

      {!loading && insights.length === 0 && (
        <GlassCard delay={0.1}>
          <div className="p-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg">{t('noData')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('noDataHint')}</p>
          </div>
        </GlassCard>
      )}

      {!loading && insights.map((uni, i) => (
        <motion.div
          key={uni.university}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Match rate circle */}
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${
                  uni.matchRate >= 50 ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  uni.matchRate >= 25 ? 'bg-blue-100 dark:bg-blue-900/30' :
                  'bg-muted'
                }`}>
                  <span className={`text-lg font-bold ${
                    uni.matchRate >= 50 ? 'text-emerald-700' :
                    uni.matchRate >= 25 ? 'text-blue-700' :
                    'text-muted-foreground'
                  }`}>{uni.matchRate}%</span>
                  <span className="text-[8px] text-muted-foreground uppercase">{t('match')}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg">{uni.university}</h3>
                    {uni.verificationRate >= 70 && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                        <CheckCircle className="h-3 w-3 mr-0.5" />{t('highVerification')}
                      </Badge>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-5 mt-2 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{uni.studentCount} {t('students')}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{uni.matchingStudents} {t('matchYourRoles')}</span>
                    <span className="flex items-center gap-1"><FolderOpen className="h-3.5 w-3.5" />{uni.verifiedProjects} {t('verifiedProjects')}</span>
                    <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" />{uni.verificationRate}% {t('verificationRate')}</span>
                  </div>

                  {/* Talent pool bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{t('talentPool')}</span>
                      <span>{uni.matchingStudents} / {uni.studentCount}</span>
                    </div>
                    <Progress value={(uni.studentCount / maxStudents) * 100} className="h-2" />
                  </div>

                  {/* Skills + disciplines */}
                  <div className="flex gap-4 mt-3">
                    {uni.topSkills.length > 0 && (
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">{t('topSkills')}</p>
                        <div className="flex gap-1 flex-wrap">
                          {uni.topSkills.slice(0, 5).map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                        </div>
                      </div>
                    )}
                    {uni.topDisciplines.length > 0 && (
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">{t('topDisciplines')}</p>
                        <div className="flex gap-1 flex-wrap">
                          {uni.topDisciplines.slice(0, 3).map(d => <Badge key={d} variant="secondary" className="text-[10px]">{d}</Badge>)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
