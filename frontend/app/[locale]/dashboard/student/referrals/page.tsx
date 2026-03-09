'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ShareButtons } from '@/components/social/ShareButtons'
import { useTranslations } from 'next-intl'
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
  Check,
  DollarSign,
  MessageCircle,
  Star,
  Sparkles,
  Clipboard
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
  cashRewardEarned?: number
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

const tierColors: Record<string, string> = {
  BRONZE: 'bg-orange-100 text-orange-700 border-orange-300',
  SILVER: 'bg-muted text-foreground/80 border-gray-400',
  GOLD: 'bg-yellow-100 text-yellow-700 border-yellow-400',
  PLATINUM: 'bg-primary/10 text-primary border-primary/40'
}

const tierGradients: Record<string, string> = {
  BRONZE: 'from-orange-500 to-amber-600',
  SILVER: 'from-gray-400 to-gray-500',
  GOLD: 'from-yellow-400 to-amber-500',
  PLATINUM: 'from-primary to-primary'
}

const tierIcons: Record<string, typeof Trophy> = {
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
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null)
  const t = useTranslations('ambassador')

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

  const copyShareMessage = async (index: number, message: string) => {
    try {
      await navigator.clipboard.writeText(message)
      setCopiedMessage(index)
      setTimeout(() => setCopiedMessage(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; label: string; icon: typeof Clock }> = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: t('status.pending'), icon: Clock },
      'completed': { color: 'bg-primary/10 text-primary', label: t('status.completed'), icon: CheckCircle },
      'registered': { color: 'bg-primary/10 text-primary', label: t('status.registered'), icon: Users }
    }

    const { color, label, icon: Icon } = config[status] || config.pending

    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="p-8 bg-muted min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalReferrals = referralData?.totalReferrals || 0
  const nextTier = referralData?.nextTier
  const referralsToNextTier = nextTier ? nextTier.referralsNeeded - totalReferrals : 0
  const currentTier = referralData?.currentTier || 'BRONZE'
  const TierIcon = tierIcons[currentTier] || Trophy
  const cashEarned = (referralData?.cashRewardEarned || 0) / 100

  const shareMessages = [
    {
      platform: 'WhatsApp',
      icon: MessageCircle,
      message: t('shareMessages.whatsapp', { link: referralData?.referralLink || '' })
    },
    {
      platform: 'LinkedIn',
      icon: Share2,
      message: t('shareMessages.linkedin', { link: referralData?.referralLink || '' })
    },
    {
      platform: 'Instagram',
      icon: Star,
      message: t('shareMessages.instagram', { link: referralData?.referralLink || '' })
    },
    {
      platform: 'Email',
      icon: Gift,
      message: t('shareMessages.email', { link: referralData?.referralLink || '' })
    }
  ]

  return (
    <div className="p-8 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Ambassador Badge */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold">{t('title')}</h1>
          </div>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Ambassador Badge Card */}
        <Card className="mb-6 overflow-hidden">
          <div className={`bg-primary p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-full p-3">
                  <TierIcon className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{t('ambassadorBadge.title')}</h2>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="text-white/80 text-sm">
                    {t('ambassadorBadge.tier', { tier: currentTier })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{totalReferrals}</div>
                <div className="text-white/80 text-sm">{t('ambassadorBadge.totalReferrals')}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('earnings.totalEarned')}</p>
                  <p className="text-2xl font-bold text-primary">
                    {referralData?.premiumMonthsEarned || 0} {t('earnings.months')}
                    {cashEarned > 0 && ` + €${cashEarned}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('earnings.pending')}</p>
                  <p className="text-2xl font-bold text-primary">
                    {referralData?.pendingReferrals || 0} {t('earnings.referrals')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('earnings.active')}</p>
                  <p className="text-2xl font-bold text-primary">
                    {referralData?.activeReferrals || 0} {t('earnings.users')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Referral Link Card */}
            <Card className="border-2 border-primary shadow-lg">
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  {t('referralLink.title')}
                </CardTitle>
                <CardDescription>
                  {t('referralLink.description')}
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
                        {t('referralLink.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('referralLink.copy')}
                      </>
                    )}
                  </Button>
                </div>

                {/* Share Buttons */}
                <div>
                  <p className="text-sm font-medium mb-2">{t('referralLink.shareOn')}</p>
                  <ShareButtons
                    url={referralData?.referralLink || ''}
                    title="Join me on InTransparency!"
                    description="Build your verified portfolio and get discovered by top companies. Sign up with my link to get started!"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pre-written Share Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  {t('shareTemplates.title')}
                </CardTitle>
                <CardDescription>{t('shareTemplates.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shareMessages.map((msg, index) => {
                    const MsgIcon = msg.icon
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MsgIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{msg.platform}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyShareMessage(index, msg.message)}
                          >
                            {copiedMessage === index ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                {t('referralLink.copied')}
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                {t('referralLink.copy')}
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Progress & Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>{t('progress.title')}</CardTitle>
                <CardDescription>
                  {referralsToNextTier > 0
                    ? t('progress.nextTier', { count: referralsToNextTier, reward: nextTier?.reward || '' })
                    : t('progress.maxTier')
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nextTier && (
                    <div>
                      <Progress
                        value={(totalReferrals / nextTier.referralsNeeded) * 100}
                        className="h-3"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>{totalReferrals} {t('earnings.referrals')}</span>
                        <span>{nextTier.referralsNeeded} {t('progress.forTier', { tier: nextTier.tier })}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reward Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tiers.title')}</CardTitle>
                <CardDescription>{t('tiers.description')}</CardDescription>
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
                            ? 'bg-primary/5 border-primary'
                            : isNextTier
                            ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                            : 'bg-muted border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-6 w-6 text-${color}-600`} />
                            <span className="font-bold text-lg">{tier}</span>
                          </div>
                          {isUnlocked && (
                            <Badge className="bg-primary text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('tiers.unlocked')}
                            </Badge>
                          )}
                          {isNextTier && !isUnlocked && (
                            <Badge className="bg-primary text-white">
                              {t('tiers.nextGoal')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-foreground mb-1">{reward}</p>
                        <p className="text-xs text-muted-foreground">{referrals} {t('tiers.successfulReferrals')}</p>
                        {!isUnlocked && (
                          <div className="mt-3">
                            <Progress value={(totalReferrals / referrals) * 100} className="h-1" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {referrals - totalReferrals} {t('tiers.moreToGo')}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('activity.title')}</CardTitle>
                  <Badge variant="outline">{totalReferrals} {t('activity.total')}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!referralData?.referrals || referralData.referrals.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/60" />
                    <h3 className="text-lg font-semibold mb-2">{t('activity.noReferrals')}</h3>
                    <p className="text-muted-foreground mb-6">
                      {t('activity.noReferralsDescription')}
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-4">
                      {referralData.referrals.map((referral) => (
                        <div
                          key={referral.id}
                          className="relative pl-10"
                        >
                          {/* Timeline dot */}
                          <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-background ${
                            referral.profileCompleted ? 'bg-primary' : referral.status === 'pending' ? 'bg-yellow-500' : 'bg-primary'
                          }`} />
                          <div className="border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{referral.name}</h4>
                                  {getStatusBadge(referral.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">{referral.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                              <span>{t('activity.joined')} {new Date(referral.signupDate).toLocaleDateString()}</span>
                              {referral.profileCompleted && (
                                <span className="text-primary flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  {t('activity.profileComplete')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Trophy className="h-5 w-5" />
                  {t('leaderboard.title')}
                </CardTitle>
                <CardDescription>
                  {t('leaderboard.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {referralData?.leaderboard && referralData.leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {referralData.leaderboard.slice(0, 10).map((entry) => {
                      const medalColors: Record<number, string> = {
                        1: 'bg-yellow-400 text-yellow-900',
                        2: 'bg-gray-300 text-gray-700',
                        3: 'bg-orange-400 text-orange-900'
                      }
                      const isTopThree = entry.rank <= 3

                      return (
                        <div
                          key={entry.rank}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isTopThree ? 'bg-card shadow-md' : 'bg-white/50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              isTopThree
                                ? medalColors[entry.rank]
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {entry.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{entry.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{entry.university}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">{entry.referrals}</div>
                            <div className="text-xs text-muted-foreground">{t('leaderboard.refs')}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="text-sm">{t('leaderboard.beFirst')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('howItWorks.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">{step}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t(`howItWorks.step${step}.title`)}</p>
                        <p className="text-xs text-muted-foreground">{t(`howItWorks.step${step}.description`)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    {t('howItWorks.bonus')}
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
