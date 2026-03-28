'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ReferralPrompt } from '@/components/referrals/ReferralPrompt'
import {
  Users,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Code,
  ExternalLink,
  Star,
  CheckCircle,
  Eye
} from 'lucide-react'
import { trackUpgradePrompt, trackUpgradeInteraction, ConversionTrigger, PlanType } from '@/lib/analytics'
import { useTranslations } from 'next-intl'

interface StatsData {
  totalStudents: number
  verifiedStudents: number
  activeProfiles: number
  recruiterViews: number
}

interface RecentStudent {
  id: string
  name: string
  initials: string
  course: string
  year: string | number
  projects: number
  verified: boolean
  photo: string | null
}

interface TopRecruiter {
  name: string
  views: number
  contacts: number
}

export default function InstitutionDashboard() {
  const router = useRouter()
  const { data: session } = useSession()
  const t = useTranslations('universityDashboard.institution')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([])
  const [topRecruiters, setTopRecruiters] = useState<TopRecruiter[]>([])
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  const subscriptionTier = (session?.user as any)?.subscriptionTier || 'FREE'
  const isFree = subscriptionTier === 'FREE' || subscriptionTier === 'INSTITUTION_ENTERPRISE' ? subscriptionTier === 'FREE' : true
  const institutionName = (session?.user as any)?.company || 'Your Institution'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/university/stats')
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStats(data.stats)
        setRecentStudents(data.recentStudents || [])
        setTopRecruiters(data.topRecruiters || [])
      } catch (err) {
        console.error('Error loading institution stats:', err)
        setStats({ totalStudents: 0, verifiedStudents: 0, activeProfiles: 0, recruiterViews: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    if (isFree && stats && stats.totalStudents > 0) {
      setShowUpgradePrompt(true)
      trackUpgradePrompt(ConversionTrigger.EMBED_PROMPT, PlanType.PREMIUM_EMBED, {
        activeStudents: stats.totalStudents,
        companyInterests: topRecruiters.length
      })
    }
  }, [isFree, stats, topRecruiters.length])

  const handleUpgradeClick = () => {
    trackUpgradeInteraction(
      'clicked',
      ConversionTrigger.EMBED_PROMPT,
      PlanType.PREMIUM_EMBED
    )
    router.push('/pricing?highlight=premium_embed')
  }

  const handleDismissPrompt = () => {
    trackUpgradeInteraction(
      'dismissed',
      ConversionTrigger.EMBED_PROMPT,
      PlanType.PREMIUM_EMBED
    )
    setShowUpgradePrompt(false)
  }

  const handleConfigureWidget = () => {
    router.push('/dashboard/institution/embed-config')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{institutionName}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        {isFree && (
          <Button onClick={() => router.push('/pricing')} className="gap-2">
            <Code className="h-4 w-4" />
            {t('getWidget')}
          </Button>
        )}
      </div>

      {/* Upgrade Prompt - Premium Embed */}
      {showUpgradePrompt && isFree && (
        <div className="mb-6">
          <ReferralPrompt
            triggerType="institution-company-interest"
            contextData={{
              companyName: `${topRecruiters.length} companies`
            }}
            onDismiss={handleDismissPrompt}
            onAction={handleUpgradeClick}
          />
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats?.totalStudents ?? 0}</div>
                  <div className="text-sm text-gray-600">{t('totalStudents')}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats?.verifiedStudents ?? 0}</div>
                  <div className="text-sm text-gray-600">{t('verifiedStudents')}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats?.activeProfiles ?? 0}</div>
                  <div className="text-sm text-gray-600">{t('activeProfiles')}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{stats?.recruiterViews ?? 0}</div>
                  <div className="text-sm text-gray-600">{t('recruiterViews')}</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Recent Students */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('recentStudents')}</h2>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentStudents.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No students found yet. Students will appear here once they register and associate with your institution.</p>
            ) : (
              <div className="space-y-3">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-gray-700 font-bold text-sm flex items-center justify-center">
                      {student.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {student.name}
                        {student.verified && (
                          <CheckCircle className="inline-block h-3.5 w-3.5 text-primary ml-1" />
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {student.course} {student.year ? `· ${student.year}` : ''} · {student.projects} project{student.projects !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top Recruiters */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('topRecruiters')}</h2>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </div>
                ))}
              </div>
            ) : topRecruiters.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No recruiter activity yet. Recruiters viewing your students will appear here.</p>
            ) : (
              <div className="space-y-3">
                {topRecruiters.map((recruiter, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Briefcase className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium">{recruiter.name}</h3>
                      <p className="text-sm text-gray-600">
                        {recruiter.views} views · {recruiter.contacts} contacts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Premium Embed Preview */}
          {isFree && (
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center">
                  <Code className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Drive 40% More Student Sign-ups with Embeddable Widget
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Add the InTransparency widget to your career portal showing live matches like
                    &quot;3 students matched to BMW today&quot;. &euro;500/year vs. &euro;2,500+ for competitors.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleUpgradeClick} className="bg-primary hover:bg-primary/90">
                      Get Widget - &euro;500/year
                    </Button>
                    <Button variant="outline" onClick={() => window.open('/embed/demo', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Demo
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Widget Config (Premium users) */}
          {!isFree && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Embeddable Widget</h2>
                <Badge className="bg-primary">Premium Embed</Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Widget Status</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Active:</span>
                      <span className="ml-2 font-medium text-primary">Live</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Students:</span>
                      <span className="ml-2 font-medium">{stats?.totalStudents ?? 0}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleConfigureWidget} className="w-full">
                  <Code className="h-4 w-4 mr-2" />
                  Configure Widget
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {isFree ? (
                <Badge variant="secondary">Free Plan</Badge>
              ) : (
                <Badge className="bg-primary">
                  {subscriptionTier === 'INSTITUTION_ENTERPRISE' ? 'Enterprise' : 'Premium Embed'}
                </Badge>
              )}
            </div>

            <div className="space-y-3 text-sm">
              {isFree ? (
                <>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-gray-600">Unlimited students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-gray-600">Basic analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-gray-600">Company connections</span>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-600 mb-3">Upgrade for:</p>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li>Embeddable widget (+40% signups)</li>
                      <li>Custom placement reports</li>
                      <li>Branded integration</li>
                    </ul>
                  </div>

                  <Button onClick={handleUpgradeClick} className="w-full mt-4">
                    Upgrade - &euro;500/year
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-gray-600">Embeddable widget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-gray-600">Custom branding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-gray-600">Placement reports</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Pricing Info */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-gray-900 mb-2">Your Plan</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Platform Access:</span>
                <span className="font-medium text-primary">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Student Verification:</span>
                <span className="font-medium text-primary">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Analytics Dashboard:</span>
                <span className="font-medium text-primary">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-primary/20">
                <span>Optional Widget:</span>
                <span className="font-medium">&euro;500</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                All core features included at no cost
              </p>
            </div>
          </Card>

          {/* Referral Program */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-gray-900 mb-2">Institutional Referrals</h3>
            <p className="text-sm text-gray-700 mb-4">
              Refer other universities and earn &euro;250 per signup to ITS network!
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/referrals')}
            >
              Get Referral Link
            </Button>
          </Card>

          {/* Support */}
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Contact our institutional support team
            </p>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
