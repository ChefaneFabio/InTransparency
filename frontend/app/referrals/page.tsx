'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Gift,
  Users,
  Star,
  Trophy,
  Share2,
  Mail,
  Copy,
  CheckCircle,
  Crown,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  MessageCircle,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthContext'
import Link from 'next/link'

// Mock data - in production, fetch from API
const mockReferralData = {
  totalReferrals: 2,
  activeReferrals: 2,
  pendingReferrals: 1,
  rewardTier: 'bronze', // bronze, silver, gold, platinum
  premiumMonthsEarned: 0,
  referralLink: 'https://intransparency.com/join?ref=alex2024',
  referrals: [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 's.chen@mit.edu',
      status: 'completed', // pending, completed
      signupDate: '2024-09-15',
      profileCompleted: true
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      email: 'm.rodriguez@mit.edu',
      status: 'completed',
      signupDate: '2024-09-20',
      profileCompleted: true
    },
    {
      id: '3',
      name: 'Emily Park',
      email: 'e.park@mit.edu',
      status: 'pending',
      signupDate: '2024-09-25',
      profileCompleted: false
    }
  ]
}

const rewardTiers = [
  {
    tier: 'bronze',
    name: 'Bronze Referrer',
    icon: Gift,
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    referralsNeeded: 3,
    reward: '1 month Premium FREE',
    benefits: ['Premium features for 1 month', 'Referrer badge on profile']
  },
  {
    tier: 'silver',
    name: 'Silver Referrer',
    icon: Award,
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    referralsNeeded: 10,
    reward: '6 months Premium FREE',
    benefits: ['Premium features for 6 months', 'Silver referrer badge', 'Priority support access']
  },
  {
    tier: 'gold',
    name: 'Gold Referrer',
    icon: Trophy,
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    referralsNeeded: 50,
    reward: 'Lifetime Premium FREE',
    benefits: ['Lifetime Premium access', 'Gold ambassador badge', 'Featured on homepage', 'Exclusive swag']
  },
  {
    tier: 'platinum',
    name: 'Platinum Ambassador',
    icon: Crown,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    referralsNeeded: 100,
    reward: 'Lifetime Premium + $500 cash',
    benefits: ['Everything in Gold', '$500 cash reward', 'Platinum ambassador badge', 'Feature in case studies', 'Direct line to founders']
  }
]

export default function ReferralsPage() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const referralData = mockReferralData
  const nextTier = rewardTiers.find(tier => tier.referralsNeeded > referralData.totalReferrals) || rewardTiers[rewardTiers.length - 1]
  const progress = (referralData.totalReferrals / nextTier.referralsNeeded) * 100

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralData.referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnLinkedIn = () => {
    const text = "I'm using InTransparency to build my professional portfolio and get discovered by recruiters. Join me!"
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralData.referralLink)}`, '_blank')
  }

  const shareOnTwitter = () => {
    const text = "Building my career portfolio on InTransparency 🚀 Join me and unlock premium features!"
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralData.referralLink)}&text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareViaEmail = () => {
    const subject = "Check out InTransparency - Build Your Career Portfolio"
    const body = `Hey!\n\nI've been using InTransparency to build my professional portfolio and it's been amazing. You should check it out too!\n\nUse my referral link to get started: ${referralData.referralLink}\n\nIt's 100% free for students and helps you get discovered by recruiters.\n\nLet me know what you think!`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Gift className="h-4 w-4 mr-2" />
              Referral Program
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Invite Friends,{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Unlock Premium FREE
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Share InTransparency with your classmates and unlock premium features for free.
              The more you refer, the more you earn!
            </p>
          </div>

          {/* Current Progress */}
          <div className="mb-12">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 mr-2 text-purple-600" />
                  Your Progress
                </CardTitle>
                <CardDescription className="text-center text-gray-700">
                  {referralData.totalReferrals} of {nextTier.referralsNeeded} referrals to unlock {nextTier.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress to Next Tier</span>
                      <span className="text-sm font-bold text-purple-600">
                        {referralData.totalReferrals}/{nextTier.referralsNeeded}
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center shadow-md">
                      <div className="text-3xl font-bold text-blue-600">{referralData.totalReferrals}</div>
                      <div className="text-sm text-gray-700">Total Referrals</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-md">
                      <div className="text-3xl font-bold text-green-600">{referralData.activeReferrals}</div>
                      <div className="text-sm text-gray-700">Active Referrals</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-md">
                      <div className="text-3xl font-bold text-purple-600">{referralData.premiumMonthsEarned}</div>
                      <div className="text-sm text-gray-700">Premium Months Earned</div>
                    </div>
                  </div>

                  {/* Next Reward */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Next Reward</h3>
                        <p className="text-2xl font-bold text-purple-600">{nextTier.reward}</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {nextTier.referralsNeeded - referralData.totalReferrals} more referrals to unlock
                        </p>
                      </div>
                      {React.createElement(nextTier.icon, {
                        className: 'h-16 w-16 text-purple-400'
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Share Section */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-blue-600" />
                  Share Your Referral Link
                </CardTitle>
                <CardDescription>
                  Copy your unique link or share directly on social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Referral Link */}
                  <div className="flex gap-2">
                    <Input
                      value={referralData.referralLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={copyReferralLink} className="shrink-0">
                      {copied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Social Share Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      onClick={shareOnLinkedIn}
                      className="bg-[#0077B5] hover:bg-[#006399] text-white"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      Share on LinkedIn
                    </Button>
                    <Button
                      onClick={shareOnTwitter}
                      className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                    >
                      <Twitter className="mr-2 h-4 w-4" />
                      Share on Twitter
                    </Button>
                    <Button onClick={shareViaEmail} variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Share via Email
                    </Button>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Pro Tips for More Referrals
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Share in class GroupChats or Discord servers</li>
                      <li>• Post on your university's student Facebook group</li>
                      <li>• Add to your LinkedIn/Twitter bio</li>
                      <li>• Share during career fair or club meetings</li>
                      <li>• Email your study group or project teammates</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reward Tiers */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Reward Tiers</h2>
              <p className="text-lg text-gray-700">
                The more friends you refer, the better the rewards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewardTiers.map((tier) => {
                const Icon = tier.icon
                const isUnlocked = referralData.totalReferrals >= tier.referralsNeeded
                const isCurrent = tier.tier === nextTier.tier

                return (
                  <Card
                    key={tier.tier}
                    className={`relative overflow-hidden transition-all ${
                      isCurrent ? 'ring-2 ring-purple-500 shadow-xl scale-105' : ''
                    } ${isUnlocked ? 'bg-gradient-to-br ' + tier.bgColor : 'opacity-75'}`}
                  >
                    {isCurrent && (
                      <div className="absolute top-0 right-0">
                        <Badge className="bg-purple-600 text-white rounded-none rounded-bl-lg">
                          Next Goal
                        </Badge>
                      </div>
                    )}
                    {isUnlocked && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    )}

                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className={tier.textColor}>{tier.name}</CardTitle>
                      <CardDescription className="font-semibold">
                        {tier.referralsNeeded} referrals
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-sm font-medium text-gray-800 mb-1">Reward</div>
                          <div className={`text-lg font-bold ${tier.textColor}`}>
                            {tier.reward}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Benefits:</div>
                          <ul className="space-y-1">
                            {tier.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start">
                                <CheckCircle className="h-3 w-3 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Your Referrals */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Your Referrals ({referralData.referrals.length})
                </CardTitle>
                <CardDescription>
                  Track your referrals and their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {referralData.referrals.length > 0 ? (
                  <div className="space-y-3">
                    {referralData.referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            referral.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            {referral.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Zap className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>

                          <div>
                            <div className="font-medium text-gray-900">{referral.name}</div>
                            <div className="text-sm text-gray-800">{referral.email}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge className={
                            referral.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }>
                            {referral.status === 'completed' ? 'Completed' : 'Pending'}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            Joined {new Date(referral.signupDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No referrals yet. Start sharing!</p>
                    <Button onClick={copyReferralLink}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Referral Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Trophy className="h-6 w-6 mr-2 text-orange-600" />
                  Top Referrers This Month
                </CardTitle>
                <CardDescription className="text-center text-gray-700">
                  Compete with students across all universities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'Sarah Johnson', university: 'MIT', referrals: 127 },
                    { rank: 2, name: 'Michael Chen', university: 'Stanford', referrals: 98 },
                    { rank: 3, name: 'Emily Rodriguez', university: 'Berkeley', referrals: 85 },
                    { rank: 4, name: 'David Kim', university: 'Georgia Tech', referrals: 73 },
                    { rank: 5, name: 'You', university: user?.university || 'Your University', referrals: referralData.totalReferrals }
                  ].map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        entry.name === 'You'
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                          entry.rank === 2 ? 'bg-gray-300 text-gray-800' :
                          entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          #{entry.rank}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {entry.name}
                            {entry.rank === 1 && <Crown className="inline h-4 w-4 ml-1 text-yellow-600" />}
                          </div>
                          <div className="text-sm text-gray-600">{entry.university}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{entry.referrals}</div>
                        <div className="text-xs text-gray-600">referrals</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">How does it work?</h4>
                    <p className="text-sm text-gray-600">
                      Share your unique referral link with friends. When they sign up and complete their profile
                      (upload at least 1 project), you both get credit towards Premium rewards.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">When do I get my rewards?</h4>
                    <p className="text-sm text-gray-600">
                      Rewards are automatically applied to your account once you hit a tier threshold.
                      For example, once you get 3 referrals, you'll instantly get 1 month of Premium.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Can I refer anyone?</h4>
                    <p className="text-sm text-gray-600">
                      Yes! You can refer students from any university, not just yours. The more diverse your
                      referrals, the better for growing the InTransparency community.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Is there a limit?</h4>
                    <p className="text-sm text-gray-600">
                      No limit! Keep referring and keep earning. Platinum ambassadors (100+ referrals) get
                      ongoing benefits and even cash rewards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
