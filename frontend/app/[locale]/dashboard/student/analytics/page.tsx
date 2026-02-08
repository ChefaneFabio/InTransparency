'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import {
  Lock, Sparkles, ArrowRight, Eye, Briefcase, FolderOpen,
  BarChart3, TrendingUp, Users, BookOpen,
} from 'lucide-react'
import { Link } from '@/navigation'

interface AnalyticsData {
  overview: {
    totalProfileViews: number
    totalProjects: number
    totalApplications: number
    skillScore: number
  }
  skills: Array<{ name: string; level: number; projectCount: number }>
  engagement: {
    viewsOverTime: Array<{ month: string; views: number }>
    topCompanies: Array<{ name: string; views: number }>
    avgViewDuration: number
  } | null
  applicationFunnel: Array<{ name: string; value: number }> | null
  applicationTrends: Array<{ month: string; applications: number }> | null
  recruiterInterest: {
    savedByCount: number
    contactedByCount: number
    messagesReceived: number
  } | null
  skillsVsMarket: Array<{ skill: string; yourLevel: number; marketDemand: number }> | null
  projectPerformance: Array<{
    id: string
    title: string
    views: number
    recruiterViews: number
    impactLevel: string
  }> | null
  careerReadiness: Array<{ title: string; matchScore: number }> | null
  industryInterest: Array<{ name: string; value: number; color: string }> | null
  salaryContext: {
    estimatedRange: string
    levels: Array<{ label: string; amount: number }>
  } | null
  isLimited: boolean
  tierLimits: {
    tier: string
    hasEngagement: boolean
    hasApplicationFunnel: boolean
    hasApplicationTrends: boolean
    hasRecruiterInterest: boolean
    hasSkillsVsMarket: boolean
    hasProjectPerformance: boolean
    hasCareerReadiness: boolean
    hasSalaryContext: boolean
  }
  premiumFeatureCount: number
}

const TIME_RANGES = [
  { value: '1month', freeAllowed: true },
  { value: '3months', freeAllowed: false },
  { value: '6months', freeAllowed: false },
  { value: '1year', freeAllowed: false },
]

export default function StudentAnalytics() {
  const { data: session } = useSession()
  const t = useTranslations('studentAnalytics')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('1month')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/dashboard/student/analytics?timeRange=${timeRange}`)
        if (res.status === 401) {
          setError('unauthorized')
          return
        }
        if (!res.ok) {
          setError('failed')
          return
        }
        const json = await res.json()
        setData(json)
      } catch {
        setError('failed')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return <AnalyticsSkeleton />
  }

  if (error === 'unauthorized') {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center">
        <p className="text-gray-500">{t('unauthorized')}</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center">
        <p className="text-red-500 mb-4">{t('error')}</p>
        <Button onClick={() => setTimeRange(timeRange)} variant="outline" size="sm">
          {t('tryAgain')}
        </Button>
      </div>
    )
  }

  const isLimited = data.isLimited

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {data.tierLimits.tier.replace('_', ' ')}
          </Badge>
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {TIME_RANGES.map((tr) => {
              const disabled = isLimited && !tr.freeAllowed
              return (
                <button
                  key={tr.value}
                  onClick={() => { if (!disabled) setTimeRange(tr.value) }}
                  disabled={disabled}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                    timeRange === tr.value
                      ? 'bg-white shadow-sm text-gray-900 font-medium'
                      : disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {disabled && <Lock className="h-3 w-3" />}
                  {t(`timeRange.${tr.value}`)}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Premium Upsell Banner */}
      {isLimited && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{t('premiumUpsell.title')}</p>
              <p className="text-xs text-gray-600">{t('premiumUpsell.description')}</p>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href="/pricing">
              {t('premiumUpsell.cta')}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-3.5 w-3.5" />
            {t('tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            {t('tabs.skills')}
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1">
            <FolderOpen className="h-3.5 w-3.5" />
            {t('tabs.projects')}
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {t('tabs.career')}
          </TabsTrigger>
        </TabsList>

        {/* ============ OVERVIEW TAB ============ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stat Cards (ALL tiers) */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t('stats.profileViews')}
              value={data.overview.totalProfileViews.toLocaleString()}
              icon={<Eye className="h-4 w-4 text-blue-600" />}
            />
            <StatCard
              title={t('stats.projects')}
              value={data.overview.totalProjects.toString()}
              icon={<FolderOpen className="h-4 w-4 text-green-600" />}
            />
            <StatCard
              title={t('stats.applications')}
              value={data.overview.totalApplications.toString()}
              icon={<Briefcase className="h-4 w-4 text-purple-600" />}
            />
            <StatCard
              title={t('stats.skillScore')}
              value={`${data.overview.skillScore}/100`}
              icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Views Over Time (PREMIUM) */}
            {data.engagement ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('overview.viewsOverTime')}</CardTitle>
                  <CardDescription className="text-xs">{t('overview.viewsOverTimeDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.engagement.viewsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <LockedSection
                title={t('overview.viewsOverTime')}
                description={t('locked.engagement')}
                ctaLabel={t('premiumUpsell.cta')}
              />
            )}

            {/* Industry Interest / Top Companies (PREMIUM) */}
            {data.industryInterest && data.industryInterest.length > 0 ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('overview.industryInterest')}</CardTitle>
                  <CardDescription className="text-xs">{t('overview.industryInterestDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={data.industryInterest}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.industryInterest.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : isLimited ? (
              <LockedSection
                title={t('overview.industryInterest')}
                description={t('locked.industryInterest')}
                ctaLabel={t('premiumUpsell.cta')}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Eye className="h-8 w-8 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">{t('empty.noCompanyViews')}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Top Companies (PREMIUM) */}
          {data.engagement && data.engagement.topCompanies.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('overview.topCompanies')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.engagement.topCompanies.map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{c.name}</span>
                      <Badge variant="secondary">{c.views} {t('overview.views')}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ============ SKILLS TAB ============ */}
        <TabsContent value="skills" className="space-y-6">
          {/* Skills Assessment (ALL tiers) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('skills.assessment')}</CardTitle>
              <CardDescription className="text-xs">{t('skills.assessmentDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data.skills.length > 0 ? (
                <div className="space-y-4">
                  {data.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <Badge variant="secondary" className="text-xs">{skill.projectCount} {skill.projectCount === 1 ? t('skills.project') : t('skills.projects')}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">{t('empty.noSkills')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills vs Market Demand (PREMIUM) */}
          {data.skillsVsMarket ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('skills.vsMarket')}</CardTitle>
                <CardDescription className="text-xs">{t('skills.vsMarketDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.skillsVsMarket}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="yourLevel" fill="#8884d8" name={t('skills.yourLevel')} />
                    <Bar dataKey="marketDemand" fill="#82ca9d" name={t('skills.marketDemand')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <LockedSection
              title={t('skills.vsMarket')}
              description={t('locked.skillsVsMarket')}
              ctaLabel={t('premiumUpsell.cta')}
            />
          )}
        </TabsContent>

        {/* ============ PROJECTS TAB ============ */}
        <TabsContent value="projects" className="space-y-6">
          {/* Project Performance (PREMIUM) */}
          {data.projectPerformance ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('projects.performance')}</CardTitle>
                <CardDescription className="text-xs">{t('projects.performanceDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {data.projectPerformance.length > 0 ? (
                  <div className="space-y-3">
                    {data.projectPerformance.map((p) => (
                      <div key={p.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate max-w-[200px]">{p.title}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{p.views} {t('projects.views')}</span>
                          <span className="text-xs text-muted-foreground">{p.recruiterViews} {t('projects.recruiterViews')}</span>
                          <Badge
                            variant={p.impactLevel === 'High Impact' ? 'default' : p.impactLevel === 'Medium Impact' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {p.impactLevel}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <FolderOpen className="h-8 w-8 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">{t('empty.noProjects')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <LockedSection
              title={t('projects.performance')}
              description={t('locked.projectPerformance')}
              ctaLabel={t('premiumUpsell.cta')}
            />
          )}

          {/* Technology Usage (ALL tiers) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('projects.techUsage')}</CardTitle>
              <CardDescription className="text-xs">{t('projects.techUsageDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data.skills.length > 0 ? (
                <div className="space-y-3">
                  {data.skills.slice(0, 8).map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <span className="text-sm">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={skill.level} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground w-8 text-right">{skill.level}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">{t('empty.noSkills')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ CAREER TAB ============ */}
        <TabsContent value="career" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Career Readiness (PREMIUM) */}
            {data.careerReadiness ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('career.readiness')}</CardTitle>
                  <CardDescription className="text-xs">{t('career.readinessDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.careerReadiness.length > 0 ? (
                    <div className="space-y-4">
                      {data.careerReadiness.map((path) => (
                        <div key={path.title} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{path.title}</span>
                            <span className="text-sm font-medium">{path.matchScore}%</span>
                          </div>
                          <Progress value={path.matchScore} className="h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-gray-500">{t('empty.noCareerData')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <LockedSection
                title={t('career.readiness')}
                description={t('locked.careerReadiness')}
                ctaLabel={t('premiumUpsell.cta')}
              />
            )}

            {/* Salary Insights (PREMIUM, EUR) */}
            {data.salaryContext ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('career.salaryInsights')}</CardTitle>
                  <CardDescription className="text-xs">{t('career.salaryInsightsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.salaryContext.estimatedRange}</div>
                      <p className="text-xs text-muted-foreground">{t('career.estimatedRange')}</p>
                    </div>
                    <div className="space-y-2">
                      {data.salaryContext.levels.map((level) => (
                        <div key={level.label} className="flex items-center justify-between">
                          <span className="text-sm">{level.label}</span>
                          <span className="text-sm font-medium">€{level.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : isLimited ? (
              <LockedSection
                title={t('career.salaryInsights')}
                description={t('locked.salaryContext')}
                ctaLabel={t('premiumUpsell.cta')}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-gray-500">{t('empty.noSalaryData')}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Application Funnel (PREMIUM) */}
          {data.applicationFunnel ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('career.applicationFunnel')}</CardTitle>
                <CardDescription className="text-xs">{t('career.applicationFunnelDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.applicationFunnel} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <LockedSection
              title={t('career.applicationFunnel')}
              description={t('locked.applicationFunnel')}
              ctaLabel={t('premiumUpsell.cta')}
            />
          )}

          {/* Recruiter Interest (PREMIUM) */}
          {data.recruiterInterest ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('career.recruiterInterest')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">{data.recruiterInterest.savedByCount}</p>
                    <p className="text-xs text-blue-600">{t('career.savedBy')}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{data.recruiterInterest.contactedByCount}</p>
                    <p className="text-xs text-green-600">{t('career.contactedBy')}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-700">{data.recruiterInterest.messagesReceived}</p>
                    <p className="text-xs text-purple-600">{t('career.messagesReceived')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedSection
              title={t('career.recruiterInterest')}
              description={t('locked.recruiterInterest')}
              ctaLabel={t('premiumUpsell.cta')}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ---- Helper Components ----

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
)

const LockedSection = ({ title, description, ctaLabel }: { title: string; description: string; ctaLabel: string }) => (
  <Card>
    <CardContent className="py-10 text-center">
      <Lock className="h-8 w-8 mx-auto text-gray-300 mb-3" />
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">{description}</p>
      <Button size="sm" asChild>
        <Link href="/pricing">
          {ctaLabel}
          <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </Button>
    </CardContent>
  </Card>
)

const AnalyticsSkeleton = () => (
  <div className="max-w-5xl mx-auto pb-8 space-y-6">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-8 w-64" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
    <Skeleton className="h-10 w-full" />
    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
    </div>
  </div>
)
