'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ShareButtons } from '@/components/social/ShareButtons'
import { Users, Send, TrendingUp, CheckCircle, Clock, Mail, UserPlus, Copy, Gift, Trophy, Crown } from 'lucide-react'

interface ReferralData {
  referralCode: string
  referralLink: string
  totalReferrals: number
  activeReferrals: number
  pendingReferrals: number
  currentTier: string
  nextTier: {
    tier: string
    referralsNeeded: number
    reward: string
  }
  premiumMonthsEarned: number
  referrals: Array<{
    id: string
    name: string
    email: string
    signupDate: string
    status: string
    profileCompleted: boolean
  }>
  leaderboard: Array<{
    rank: number
    name: string
    university: string
    referrals: number
  }>
}

interface Referral {
  id: string
  referredEmail: string
  referredName?: string
  createdAt: string
  status: 'pending' | 'signed-up' | 'profile-completed' | 'first-application'
}

interface ReferralStats {
  total: number
  pending: number
  signedUp: number
  profileCompleted: number
  firstApplication: number
}

const tierColors = {
  BRONZE: 'bg-orange-100 text-orange-700 border-orange-300',
  SILVER: 'bg-gray-100 text-gray-700 border-gray-300',
  GOLD: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  PLATINUM: 'bg-purple-100 text-purple-700 border-purple-300'
}

const tierIcons = {
  BRONZE: Trophy,
  SILVER: Trophy,
  GOLD: Crown,
  PLATINUM: Crown
}

export default function StudentReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState<ReferralStats>({
    total: 0,
    pending: 0,
    signedUp: 0,
    profileCompleted: 0,
    firstApplication: 0
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Referral form
  const [referralForm, setReferralForm] = useState({
    referredEmail: '',
    referredName: ''
  })

  useEffect(() => {
    fetchReferrals()
  }, [])

  const fetchReferrals = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/advocacy/referrals?referrerId=student_123') // Replace with actual auth
      const data = await response.json()

      if (data.success) {
        setReferrals(data.referrals)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching referrals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/advocacy/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerId: 'student_123', // Replace with actual auth
          referrerName: 'Current Student', // Replace with actual name
          institutionId: 'inst_123', // Replace with actual institution
          ...referralForm
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        setReferralForm({ referredEmail: '', referredName: '' })
        fetchReferrals()
      } else {
        alert(data.error || 'Failed to send referral')
      }
    } catch (error) {
      console.error('Error submitting referral:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
      'signed-up': { color: 'bg-blue-100 text-blue-800', label: 'Registered', icon: CheckCircle },
      'profile-completed': { color: 'bg-purple-100 text-purple-800', label: 'Profile Ready', icon: UserPlus },
      'first-application': { color: 'bg-green-100 text-green-800', label: 'Active', icon: TrendingUp }
    }

    const { color, label, icon: Icon } = config[status as keyof typeof config] || config.pending

    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold">Student Network</h1>
          </div>
          <p className="text-gray-600">
            Help fellow students discover InTransparency and build a stronger academic professional network
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Students Invited</p>
                  <p className="text-3xl font-bold text-primary">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-full">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Joined Platform</p>
                  <p className="text-3xl font-bold">{stats.signedUp}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Users</p>
                  <p className="text-3xl font-bold">{stats.firstApplication}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Invites</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Referral Form */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-primary/30 sticky top-4">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Invite a Student
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitReferral} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={referralForm.referredEmail}
                      onChange={(e) => setReferralForm({ ...referralForm, referredEmail: e.target.value })}
                      placeholder="colleague@university.edu"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={referralForm.referredName}
                      onChange={(e) => setReferralForm({ ...referralForm, referredName: e.target.value })}
                      placeholder="Colleague's name"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </form>

                {/* Network Benefits */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <h4 className="font-semibold text-sm">Why Invite Colleagues?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Help peers discover verified skill opportunities</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Build a stronger institutional network</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Career centers gain insights from network growth</span>
                    </div>
                  </div>
                </div>

                {/* Impact Preview */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Your Network Impact</h4>
                  </div>
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {stats.signedUp}
                    </div>
                    <p className="text-xs text-gray-600">
                      students joined through your invitations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referrals List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Network</CardTitle>
                  <Badge variant="outline">{stats.total} invited</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : referrals.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No Invitations Sent Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start building your professional network by inviting fellow students to join the platform
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">
                                {referral.referredName || referral.referredEmail}
                              </h4>
                              {getStatusBadge(referral.status)}
                            </div>
                            {referral.referredName && (
                              <p className="text-sm text-gray-600">{referral.referredEmail}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Invited on {new Date(referral.createdAt).toLocaleDateString()}</span>
                          {referral.status === 'pending' && (
                            <span className="text-yellow-600">Awaiting registration</span>
                          )}
                          {referral.status === 'first-application' && (
                            <span className="text-green-600">Actively using platform</span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Onboarding Progress</span>
                            <span className="text-gray-600">
                              {referral.status === 'first-application' ? 'Complete' :
                               referral.status === 'profile-completed' ? 'Profile Ready' :
                               referral.status === 'signed-up' ? 'Registered' : 'Invited'}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                              style={{
                                width: referral.status === 'first-application' ? '100%' :
                                       referral.status === 'profile-completed' ? '75%' :
                                       referral.status === 'signed-up' ? '50%' : '25%'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">How Student Invitations Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Send Invitation</p>
                      <p className="text-gray-600">Enter a fellow student's email and we'll send them a personalized invitation to join the platform</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <div>
                      <p className="font-medium">They Register</p>
                      <p className="text-gray-600">When they sign up, they join your institutional network with verified credentials</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Network Grows</p>
                      <p className="text-gray-600">Track their progress as they complete profiles and apply for opportunities through the platform</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
