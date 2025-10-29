'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ReferralPrompt } from '@/components/referrals/ReferralPrompt'
import {
  Users,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Code,
  ExternalLink,
  Star
} from 'lucide-react'
import { trackUpgradePrompt, trackUpgradeInteraction, ConversionTrigger, PlanType } from '@/lib/analytics'

export default function InstitutionDashboard() {
  const router = useRouter()
  const [userPlan, setUserPlan] = useState<'free' | 'premium_embed' | 'enterprise'>('free')
  const [stats, setStats] = useState({
    activeStudents: 234,
    verifiedProjects: 487,
    companyInterests: 23,
    placementRate: 78
  })
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  useEffect(() => {
    // Trigger Premium Embed promotion after viewing dashboard
    if (userPlan === 'free' && stats.activeStudents > 100) {
      setShowUpgradePrompt(true)
      trackUpgradePrompt(ConversionTrigger.EMBED_PROMPT, PlanType.PREMIUM_EMBED, {
        activeStudents: stats.activeStudents,
        companyInterests: stats.companyInterests
      })
    }
  }, [userPlan, stats])

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
          <h1 className="text-3xl font-bold">Politecnico di Milano</h1>
          <p className="text-gray-600">Student placement analytics and company connections</p>
        </div>
        {userPlan === 'free' && (
          <Button onClick={() => router.push('/pricing')} className="gap-2">
            <Code className="h-4 w-4" />
            Get Embeddable Widget
          </Button>
        )}
      </div>

      {/* Upgrade Prompt - Premium Embed */}
      {showUpgradePrompt && userPlan === 'free' && (
        <div className="mb-6">
          <ReferralPrompt
            triggerType="institution-company-interest"
            contextData={{
              companyName: `${stats.companyInterests} companies`
            }}
            onDismiss={handleDismissPrompt}
            onAction={handleUpgradeClick}
          />
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{stats.activeStudents}</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{stats.verifiedProjects}</div>
              <div className="text-sm text-gray-600">Verified Projects</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{stats.companyInterests}</div>
              <div className="text-sm text-gray-600">Company Interests</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-2xl font-bold">{stats.placementRate}%</div>
              <div className="text-sm text-gray-600">Placement Rate</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Recent Student Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Student Activity</h2>

            <div className="space-y-3">
              {[
                { name: 'Marco Rossi', action: 'uploaded project', title: 'ML Classifier', time: '2h ago' },
                { name: 'Sofia Bianchi', action: 'received company interest from', title: 'BMW Italia', time: '3h ago' },
                { name: 'Alessandro Costa', action: 'completed profile', title: 'Software Engineering', time: '5h ago' },
                { name: 'Giulia Ferrari', action: 'uploaded project', title: 'E-commerce Platform', time: '1d ago' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center">
                    {activity.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.name}</span> {activity.action}{' '}
                      <span className="font-medium">{activity.title}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Company Interest Tracker */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Companies Interested</h2>

            <div className="space-y-3">
              {[
                { company: 'BMW Italia', interests: 12, contacted: 8 },
                { company: 'Pirelli', interests: 9, contacted: 6 },
                { company: 'Leonardo S.p.A.', interests: 7, contacted: 4 },
                { company: 'Enel', interests: 5, contacted: 3 }
              ].map((company, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{company.company}</h3>
                    <p className="text-sm text-gray-600">
                      {company.interests} students viewed • {company.contacted} contacted
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Premium Embed Preview */}
          {userPlan === 'free' && (
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <Code className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    Drive 40% More Student Sign-ups with Embeddable Widget
                  </h3>
                  <p className="text-sm text-purple-800 mb-4">
                    Add the InTransparency widget to your career portal showing live matches like
                    "3 students matched to BMW today". €500/year vs. €2,500+ for competitors.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleUpgradeClick} className="bg-purple-600 hover:bg-purple-700">
                      Get Widget - €500/year
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
          {userPlan !== 'free' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Embeddable Widget</h2>
                <Badge className="bg-purple-600">Premium Embed</Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Widget Status</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Active:</span>
                      <span className="ml-2 font-medium text-green-600">✓ Live</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Views today:</span>
                      <span className="ml-2 font-medium">1,234</span>
                    </div>
                    <div>
                      <span className="text-gray-600">New signups:</span>
                      <span className="ml-2 font-medium text-green-600">+12 this week</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ROI:</span>
                      <span className="ml-2 font-medium text-green-600">+47% signups</span>
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
              {userPlan === 'free' && <Badge variant="secondary">Free Plan</Badge>}
              {userPlan === 'premium_embed' && <Badge className="bg-purple-600">Premium Embed</Badge>}
              {userPlan === 'enterprise' && <Badge className="bg-blue-600">Enterprise</Badge>}
            </div>

            <div className="space-y-3 text-sm">
              {userPlan === 'free' ? (
                <>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Unlimited students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Basic analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Company connections</span>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-600 mb-3">Upgrade for:</p>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li>🌐 Embeddable widget (+40% signups)</li>
                      <li>📊 Custom placement reports</li>
                      <li>🎨 Branded integration</li>
                    </ul>
                  </div>

                  <Button onClick={handleUpgradeClick} className="w-full mt-4">
                    Upgrade - €500/year
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">Embeddable widget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">Custom branding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">Placement reports</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* ROI Info */}
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Cost Comparison</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex justify-between">
                <span>AlmaLaurea:</span>
                <span className="font-medium">€2,500/yr</span>
              </div>
              <div className="flex justify-between">
                <span>Univariety:</span>
                <span className="font-medium">€500/yr</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-300 font-semibold">
                <span>InTransparency:</span>
                <span className="text-green-600">FREE (€500 widget)</span>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Save €2,500/year vs. competitors!
              </p>
            </div>
          </Card>

          {/* Referral Program */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Institutional Referrals</h3>
            <p className="text-sm text-blue-800 mb-4">
              Refer other universities and earn €250 per signup to ITS network!
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
