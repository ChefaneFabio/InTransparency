'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  RefreshCw,
  Sparkles,
  Target,
  Map,
  Lightbulb,
  Briefcase,
  Lock,
  FolderOpen,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { Link } from '@/navigation'
import { useSkillPath } from '@/lib/use-skill-path'
import { HireabilityGauge } from '@/components/dashboard/student/HireabilityGauge'
import { SkillRadarChart } from '@/components/dashboard/student/SkillRadarChart'
import { SkillGapCard } from '@/components/dashboard/student/SkillGapCard'
import { ProjectIdeaCard } from '@/components/dashboard/student/ProjectIdeaCard'
import { SkillRoadmap } from '@/components/dashboard/student/SkillRoadmap'
import { CareerPathComparison } from '@/components/dashboard/student/CareerPathComparison'

export default function SkillPathPage() {
  const { data: session } = useSession()
  const t = useTranslations('skillPath')
  const { data, loading, error, refreshing, refresh } = useSkillPath()

  if (loading) {
    return <SkillPathSkeleton />
  }

  if (error === 'unauthorized') {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center">
        <p className="text-gray-500">{t('unauthorized')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center">
        <p className="text-red-500 mb-4">{t('error')}</p>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-1" />
          {t('tryAgain')}
        </Button>
      </div>
    )
  }

  // Empty state - no projects
  if (!data?.data || (data as any).isEmpty) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">{t('title')}</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">{t('emptyState.title')}</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              {t('emptyState.description')}
            </p>
            <Button asChild>
              <Link href="/dashboard/student/projects/new">
                <Plus className="h-4 w-4 mr-1" />
                {t('emptyState.cta')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const skillData = data.data
  const tierLimits = data.tierLimits
  const isLimited = data.isLimited

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <HireabilityGauge score={skillData.hireabilityScore} size={140} />
          <div className="pt-2">
            <h1 className="text-xl font-semibold text-gray-900">{t('title')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {t('lastUpdated', { date: new Date(skillData.generatedAt).toLocaleDateString() })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {tierLimits.tier.replace('_', ' ')}
          </Badge>
          <Button
            onClick={refresh}
            disabled={refreshing}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t('refreshing') : t('refresh')}
          </Button>
        </div>
      </div>

      {/* Premium upsell for FREE tier */}
      {isLimited && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg flex items-center justify-between">
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
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Target className="h-3.5 w-3.5" />
            {t('tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            {t('tabs.skills')}
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center gap-1">
            {!tierLimits.hasRoadmap && <Lock className="h-3 w-3" />}
            <Map className="h-3.5 w-3.5" />
            {t('tabs.roadmap')}
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            {t('tabs.projects')}
          </TabsTrigger>
          <TabsTrigger value="careers" className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {t('tabs.careers')}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Radar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('overview.radarTitle')}</CardTitle>
                <CardDescription className="text-xs">{t('overview.radarDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillRadarChart
                  currentSkills={skillData.currentSkills}
                  skillGaps={skillData.skillGaps}
                />
              </CardContent>
            </Card>

            {/* Top Gaps Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('overview.topGapsTitle')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('overview.topGapsDescription')}
                  {isLimited && (
                    <span className="text-blue-600 ml-1">
                      ({t('overview.showingLimited', { count: tierLimits.maxGaps, total: (data as any).totalGaps || 0 })})
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {skillData.skillGaps.slice(0, 3).map((gap) => (
                  <div key={gap.skill} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{gap.skill}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            gap.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            gap.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {gap.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={gap.currentLevel} className="h-1.5 flex-1" />
                        <span className="text-xs text-gray-500">{gap.currentLevel}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('overview.quickStatsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-700">{skillData.currentSkills.length}</p>
                    <p className="text-xs text-blue-600">{t('overview.skillsDetected')}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-700">{skillData.skillGaps.length}</p>
                    <p className="text-xs text-orange-600">{t('overview.skillGaps')}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-700">{skillData.careerPaths.length}</p>
                    <p className="text-xs text-green-600">{t('overview.careerMatches')}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-700">{skillData.projectIdeas.length}</p>
                    <p className="text-xs text-purple-600">{t('overview.projectIdeas')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Career Match */}
            {skillData.careerPaths.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('overview.topCareerTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{skillData.careerPaths[0].title}</h4>
                    <span className="text-xl font-bold text-green-600">
                      {skillData.careerPaths[0].matchScore}%
                    </span>
                  </div>
                  <Progress value={skillData.careerPaths[0].matchScore} className="h-2 mb-3" />
                  {skillData.careerPaths[0].missingSkills.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t('overview.skillsToLearn')}</p>
                      <div className="flex flex-wrap gap-1">
                        {skillData.careerPaths[0].missingSkills.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <div className="space-y-4">
            {/* Full Radar */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('skills.radarTitle')}</CardTitle>
                <CardDescription className="text-xs">{t('skills.radarDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillRadarChart
                  currentSkills={skillData.currentSkills}
                  skillGaps={skillData.skillGaps}
                  maxItems={12}
                />
              </CardContent>
            </Card>

            {/* Skill Gaps */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">{t('skills.gapsTitle')}</h3>
              {isLimited && skillData.skillGaps.length >= tierLimits.maxGaps && (
                <div className="mb-3 p-3 bg-gray-50 border rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    <Lock className="h-3.5 w-3.5 inline mr-1" />
                    {t('skills.limitedGaps', { shown: tierLimits.maxGaps, total: (data as any).totalGaps || 0 })}
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/pricing">{t('unlock')}</Link>
                  </Button>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-3">
                {skillData.skillGaps.map((gap) => (
                  <SkillGapCard key={gap.skill} gap={gap} />
                ))}
              </div>
            </div>

            {/* Current Skills List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('skills.currentTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {skillData.currentSkills.slice(0, 15).map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-32 truncate">{skill.name}</span>
                      <Progress value={skill.level} className="h-1.5 flex-1" />
                      <span className="text-xs text-gray-500 w-8 text-right">{skill.level}%</span>
                      <Badge variant="secondary" className="text-xs">
                        {skill.projectCount} {skill.projectCount === 1 ? 'project' : 'projects'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap">
          {!tierLimits.hasRoadmap ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Lock className="h-8 w-8 mx-auto text-gray-300 mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">{t('roadmap.lockedTitle')}</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                  {t('roadmap.lockedDescription')}
                </p>
                <Button asChild>
                  <Link href="/pricing">
                    {t('premiumUpsell.cta')}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('roadmap.title')}</CardTitle>
                <CardDescription className="text-xs">{t('roadmap.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillRoadmap milestones={skillData.roadmap} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{t('projects.title')}</h3>
              {isLimited && (
                <Badge variant="outline" className="text-xs">
                  {t('projects.showingLimited', {
                    shown: skillData.projectIdeas.length,
                    total: (data as any).totalProjectIdeas || 0,
                  })}
                </Badge>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {skillData.projectIdeas.map((idea) => (
                <ProjectIdeaCard key={idea.id} idea={idea} />
              ))}
            </div>

            {isLimited && skillData.projectIdeas.length < ((data as any).totalProjectIdeas || 0) && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {t('projects.moreAvailable', { count: ((data as any).totalProjectIdeas || 0) - skillData.projectIdeas.length })}
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/pricing">{t('unlock')}</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Career Paths Tab */}
        <TabsContent value="careers">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{t('careers.title')}</h3>
              {isLimited && (
                <Badge variant="outline" className="text-xs">
                  {t('careers.showingLimited', {
                    shown: skillData.careerPaths.length,
                    total: (data as any).totalCareerPaths || 0,
                  })}
                </Badge>
              )}
            </div>

            <CareerPathComparison paths={skillData.careerPaths} />

            {isLimited && skillData.careerPaths.length < ((data as any).totalCareerPaths || 0) && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {t('careers.moreAvailable', { count: ((data as any).totalCareerPaths || 0) - skillData.careerPaths.length })}
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/pricing">{t('unlock')}</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SkillPathSkeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="flex items-start gap-4 mb-6">
        <Skeleton className="w-36 h-20 rounded-full" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mb-4" />
      <div className="grid lg:grid-cols-2 gap-4">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}
