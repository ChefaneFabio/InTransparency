'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ShareButtons } from '@/components/social/ShareButtons'
import {
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Copy,
  Gift,
  Trophy,
  Crown,
  Share2,
  Award,
  Check
} from 'lucide-react'

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

const tierColors = {
  BRONZE: 'bg-orange-100 text-orange-700 border-orange-300',
  SILVER: 'bg-gray-200 text-gray-700 border-gray-400',
  GOLD: 'bg-yellow-100 text-yellow-700 border-yellow-400',
  PLATINUM: 'bg-purple-100 text-purple-700 border-purple-400'
}

const tierIcons = {
  BRONZE: Trophy,
  SILVER: Trophy,
  GOLD: Crown,
  PLATINUM: Crown
}

const rewardTiers = [
  { tier: 'BRONZE', referrals: 3, reward: '1 month Premium FREE', icon: Trophy, color: 'orange' },
  { tier: 'SILVER', referrals: 10, reward: '6 months Premium FREE', icon: Trophy, color: 'gray' },
  { tier: 'GOLD', referrals: 50, reward: 'Lifetime Premium FREE', icon: Crown, color: 'yellow' },
  { tier: 'PLATINUM', referrals: 100, reward: 'Lifetime + €500 cash', icon: Crown, color: 'purple' }
]

export default function StudentReferralsPage() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No auth token found')
        setLoading(false)
        return
      }

      const response = await fetch('/api/referrals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (response.ok) {
        setReferralData(data)
      } else {
        console.error('Error fetching referral data:', data.error)
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = async () => {
    if (!referralData?.referralLink) return

    try {
      await navigator.clipboard.writeText(referralData.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle }
    }

    const { color, label, icon: Icon } = config[status as keyof typeof config] || config.pending

    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalReferrals = referralData?.totalReferrals || 0
  const nextTier = referralData?.nextTier
  const referralsToNextTier = nextTier ? nextTier.referralsNeeded - totalReferrals : 0

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold">Referral Program</h1>
          </div>
          <p className="text-gray-600">
            Invite friends and unlock Premium features for FREE! Every successful referral brings you closer to amazing rewards.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Referral Link Card */}
            <Card className="border-2 border-primary shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Your Referral Link
                </CardTitle>
                <CardDescription>
                  Share this link with friends to earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={referralData?.referralLink || 'Loading...'}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={copyReferralLink}
                    variant={copied ? "default" : "outline"}
                    className="min-w-[100px]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                {/* Share Buttons */}
                <div>
                  <p className="text-sm font-medium mb-2">Share on social media:</p>
                  <ShareButtons
                    url={referralData?.referralLink || ''}
                    title="Join me on InTransparency! 🎓"
                    description="Build your verified portfolio and get discovered by top companies. Sign up with my link to get started!"
                  />
                </div>

                {/* Sharing Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Success:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Share on your university WhatsApp/Discord groups</li>
                    <li>• Post on LinkedIn with your success story</li>
                    <li>• Email classmates from your project teams</li>
                    <li>• Add to your Instagram/Twitter bio</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  {referralsToNextTier > 0
                    ? `${referralsToNextTier} more referral${referralsToNextTier === 1 ? '' : 's'} to unlock ${nextTier?.reward}`
                    : 'Amazing! You\'ve reached the maximum tier!'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  {nextTier && (
                    <div>
                      <Progress
                        value={(totalReferrals / nextTier.referralsNeeded) * 100}
                        className="h-3"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>{totalReferrals} referrals</span>
                        <span>{nextTier.referralsNeeded} for {nextTier.tier}</span>
                      </div>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{totalReferrals}</div>
                      <div className="text-xs text-gray-600 mt-1">Total Invited</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{referralData?.activeReferrals || 0}</div>
                      <div className="text-xs text-gray-600 mt-1">Active Users</div>
                    </div>
                    <div className="bg-yellow-100 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{referralData?.pendingReferrals || 0}</div>
                      <div className="text-xs text-gray-600 mt-1">Pending</div>
                    </div>
                  </div>

                  {/* Current Tier Badge */}
                  {referralData?.currentTier && (
                    <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Current Tier:</span>
                      <Badge className={tierColors[referralData.currentTier as keyof typeof tierColors]}>
                        {referralData.currentTier}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reward Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>Reward Tiers</CardTitle>
                <CardDescription>
                  Unlock amazing rewards as you refer more friends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {rewardTiers.map(({ tier, referrals, reward, icon: Icon, color }) => {
                    const isUnlocked = totalReferrals >= referrals
                    const isNextTier = tier === nextTier?.tier

                    return (
                      <div
                        key={tier}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          isUnlocked
                            ? 'bg-green-50 border-green-500'
                            : isNextTier
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-6 w-6 text-${color}-600`} />
                            <span className="font-bold text-lg">{tier}</span>
                          </div>
                          {isUnlocked && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Unlocked
                            </Badge>
                          )}
                          {isNextTier && !isUnlocked && (
                            <Badge className="bg-blue-500 text-white">
                              Next Goal
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{reward}</p>
                        <p className="text-xs text-gray-600">{referrals} successful referrals</p>
                        {!isUnlocked && (
                          <div className="mt-3">
                            <Progress value={(totalReferrals / referrals) * 100} className="h-1" />
                            <p className="text-xs text-gray-500 mt-1">
                              {referrals - totalReferrals} more to go
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Referrals List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Referrals</CardTitle>
                  <Badge variant="outline">{totalReferrals} total</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!referralData?.referrals || referralData.referrals.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No Referrals Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start sharing your referral link to see your network grow here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referralData.referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{referral.name}</h4>
                              {getStatusBadge(referral.status)}
                            </div>
                            <p className="text-sm text-gray-600">{referral.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>Joined {new Date(referral.signupDate).toLocaleDateString()}</span>
                          {referral.profileCompleted && (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Profile Complete
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Trophy className="h-5 w-5" />
                  Top Referrers
                </CardTitle>
                <CardDescription>
                  See who's leading the way
                </CardDescription>
              </CardHeader>
              <CardContent>
                {referralData?.leaderboard && referralData.leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {referralData.leaderboard.slice(0, 10).map((entry) => {
                      const medalColors = {
                        1: 'bg-yellow-400 text-yellow-900',
                        2: 'bg-gray-300 text-gray-700',
                        3: 'bg-orange-400 text-orange-900'
                      }
                      const isTopThree = entry.rank <= 3

                      return (
                        <div
                          key={entry.rank}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isTopThree ? 'bg-white shadow-md' : 'bg-white/50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              isTopThree
                                ? medalColors[entry.rank as keyof typeof medalColors]
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {entry.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{entry.name}</div>
                            <div className="text-xs text-gray-600 truncate">{entry.university}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">{entry.referrals}</div>
                            <div className="text-xs text-gray-600">refs</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-600">
                    <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Be the first on the leaderboard!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Share Your Link</p>
                      <p className="text-xs text-gray-600">Copy and share your unique referral link with friends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Friends Sign Up</p>
                      <p className="text-xs text-gray-600">They create an account using your referral link</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">They Complete Profile</p>
                      <p className="text-xs text-gray-600">Once they finish setting up, the referral counts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">You Earn Rewards</p>
                      <p className="text-xs text-gray-600">Premium features unlock automatically at each milestone</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs text-gray-600 mb-2">🎁 <strong>Bonus:</strong></p>
                  <p className="text-xs text-gray-600">
                    Premium rewards are applied immediately when you hit each tier. No waiting, no hassle!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
