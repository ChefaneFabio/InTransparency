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
  Mail,
  Star,
  Lock,
  Crown,
  Search,
  Filter,
  Lightbulb
} from 'lucide-react'
import { trackUpgradePrompt, trackUpgradeInteraction, ConversionTrigger, PlanType } from '@/lib/analytics'

export default function CompanyDashboard() {
  const router = useRouter()
  const [userPlan, setUserPlan] = useState<'pay_per_contact' | 'enterprise'>('pay_per_contact')
  const [stats, setStats] = useState({
    contactsUsed: 8, // Example: Near 10-contact threshold
    savedCandidates: 15,
    activeSearches: 3
  })
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [promptTrigger, setPromptTrigger] = useState<any>('company-after-contact')

  useEffect(() => {
    // Check if we should show upgrade prompt
    if (userPlan === 'pay_per_contact') {
      // Trigger: After 10 contacts (show Enterprise value)
      if (stats.contactsUsed >= 10) {
        setPromptTrigger('company-after-contact')
        setShowUpgradePrompt(true)
        trackUpgradePrompt(ConversionTrigger.CONTACT_THRESHOLD_10, PlanType.ENTERPRISE_COMPANY, {
          contactCount: stats.contactsUsed
        })
      }
    }
  }, [userPlan, stats])

  const handleUpgradeClick = () => {
    trackUpgradeInteraction(
      'clicked',
      ConversionTrigger.CONTACT_THRESHOLD_10,
      PlanType.ENTERPRISE_COMPANY
    )
    router.push('/pricing?highlight=enterprise_company')
  }

  const handleDismissPrompt = () => {
    trackUpgradeInteraction(
      'dismissed',
      ConversionTrigger.CONTACT_THRESHOLD_10,
      PlanType.ENTERPRISE_COMPANY
    )
    setShowUpgradePrompt(false)
  }

  return (
    <div className="segment-recruiter container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, BMW Italia!</h1>
          <p className="text-muted-foreground">Find and connect with verified student talent</p>
        </div>
        {userPlan === 'pay_per_contact' && (
          <Button onClick={() => router.push('/pricing')} className="gap-2">
            <Crown className="h-4 w-4" />
            Upgrade to Enterprise
          </Button>
        )}
      </div>

      {/* Upgrade Prompt - Contextual based on usage */}
      {showUpgradePrompt && userPlan === 'pay_per_contact' && (
        <div className="mb-6">
          <ReferralPrompt
            triggerType={promptTrigger}
            contextData={{
              contactCount: stats.contactsUsed
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
            <Mail className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{stats.contactsUsed}</div>
              <div className="text-sm text-muted-foreground">
                Contacts Used
                {userPlan === 'pay_per_contact' && (
                  <span className="text-orange-600 font-medium ml-1">(€{stats.contactsUsed * 10})</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{stats.savedCandidates}</div>
              <div className="text-sm text-muted-foreground">Saved Candidates</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{stats.activeSearches}</div>
              <div className="text-sm text-muted-foreground">Active Searches</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-2xl font-bold">87%</div>
              <div className="text-sm text-muted-foreground">Match Quality</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Top Candidates */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Top Candidate Matches</h2>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Marco Rossi', degree: 'Computer Science', score: 95, skills: ['Python', 'TensorFlow', 'AWS'] },
                { name: 'Sofia Bianchi', degree: 'Data Science', score: 92, skills: ['R', 'SQL', 'Tableau'] },
                { name: 'Alessandro Costa', degree: 'Software Engineering', score: 89, skills: ['React', 'Node.js', 'Docker'] }
              ].map((candidate, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-foreground/80 font-bold text-lg flex items-center justify-center">
                    {candidate.score}%
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.degree}</p>
                    <div className="flex gap-1 mt-1">
                      {candidate.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  {userPlan === 'pay_per_contact' && (
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact - €10
                    </Button>
                  )}
                  {userPlan === 'enterprise' && (
                    <Button size="sm">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {userPlan === 'pay_per_contact' && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong><Lightbulb className="h-4 w-4 inline" /> Enterprise Tip:</strong> Unlimited contacts for €99/month. You have spent €{stats.contactsUsed * 10} already this month.
                </p>
              </div>
            )}
          </Card>

          {/* Advanced Filters - Enterprise Only */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Advanced Search</h2>

            {userPlan === 'enterprise' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Skills</label>
                    <input type="text" placeholder="Python, React..." className="mt-1 block w-full rounded-md border-border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Institution</label>
                    <select className="mt-1 block w-full rounded-md border-border">
                      <option>Politecnico di Milano</option>
                      <option>Università di Bologna</option>
                      <option>La Sapienza</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Graduation Year</label>
                    <input type="number" placeholder="2024" className="mt-1 block w-full rounded-md border-border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Min GPA</label>
                    <input type="number" step="0.1" max="30" className="mt-1 block w-full rounded-md border-border" />
                  </div>
                </div>
                <Button className="w-full">Apply Filters</Button>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg bg-muted/50">
                <Lock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                <h3 className="font-semibold text-foreground mb-2">Unlock Advanced Filters</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enterprise plan (€99/month) includes custom filters, API access, and unlimited contacts.
                </p>
                <Button onClick={handleUpgradeClick}>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Enterprise
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {userPlan === 'pay_per_contact' ? (
                <Badge variant="secondary">Pay Per Contact</Badge>
              ) : (
                <Badge className="bg-primary">Enterprise Plan</Badge>
              )}
            </div>

            <div className="space-y-3 text-sm">
              {userPlan === 'pay_per_contact' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Cost per contact:</span>
                    <span className="font-medium">€10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground/60" />
                    <span className="text-muted-foreground">Advanced filters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground/60" />
                    <span className="text-muted-foreground">API access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground/60" />
                    <span className="text-muted-foreground">Bulk export</span>
                  </div>

                  <Button onClick={handleUpgradeClick} className="w-full mt-4">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Enterprise - €99/mo
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Unlimited contacts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Advanced filters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">API access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Priority support</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Referral CTA */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-foreground mb-2">Refer & Earn Credits</h3>
            <p className="text-sm text-foreground/80 mb-4">
              Refer other companies and earn 50 contact credits per signup!
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/referrals')}
            >
              Get Referral Link
            </Button>
          </Card>

          {/* ROI Calculator */}
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Cost Calculator</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contacts this month:</span>
                <span className="font-medium">{stats.contactsUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost (€10 each):</span>
                <span className="font-medium">€{stats.contactsUsed * 10}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Enterprise would save:</span>
                  <span className="text-primary">
                    {stats.contactsUsed >= 10 ? `€${(stats.contactsUsed * 10) - 99}` : '-'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.contactsUsed >= 10
                    ? 'Enterprise pays off after 10 contacts/month'
                    : `${10 - stats.contactsUsed} more contacts to break even`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
