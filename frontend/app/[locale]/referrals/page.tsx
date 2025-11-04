'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Gift,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Share2,
  Copy,
  CheckCircle,
  Euro,
  TrendingUp,
  Award,
  Target,
  Zap,
  ArrowRight,
  Mail,
  MessageSquare
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type ReferralSegment = 'student' | 'institution' | 'company'

const referralPrograms = {
  student: {
    title: 'Student Referral Program',
    subtitle: 'Earn rewards by inviting your institution and fellow students',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
    programs: [
      {
        id: 'refer-institution',
        title: 'Refer Your Institution',
        description: 'Invite your university/ITS to verify student profiles',
        icon: Building2,
        reward: '10% of first-year Pro fees',
        details: [
          'Your institution signs up and verifies students',
          'You earn 10% of all Pro subscriptions from your institution students in Year 1',
          'Example: 100 students upgrade to Pro (€9/month) = €90/month × 12 = €1,080/year × 10% = €108 reward',
          'Paid quarterly via PayPal/bank transfer',
          'Lifetime tracking - even students who join later count'
        ],
        cta: 'Get Referral Link',
        trigger: 'Share institution referral link → Institution verifies → Students upgrade → You earn'
      },
      {
        id: 'refer-students',
        title: 'Refer Fellow Students',
        description: 'Invite classmates to join and get verified',
        icon: Users,
        reward: '€5 per Pro upgrade',
        details: [
          'Share your referral link with classmates',
          'When they sign up and upgrade to Pro (€9/month), you earn €5',
          'Example: 20 friends upgrade = €100 bonus',
          'No limit on referrals',
          'Both you and your friend get bonus: Friend gets 1 month free Pro trial'
        ],
        cta: 'Get Referral Code',
        trigger: 'After 3 matches viewed → "Share with friends for €5 bonus per upgrade"'
      },
      {
        id: 'campus-ambassador',
        title: 'Campus Ambassador Program',
        description: 'Become official ambassador for your university',
        icon: Award,
        reward: '€50/month + exclusive perks',
        details: [
          'Host info sessions and promote InTransparency on campus',
          'Fixed €50/month stipend + performance bonuses',
          'Exclusive "Campus Ambassador" badge on profile (increases company interest)',
          'Early access to new features and beta tests',
          'Direct line to InTransparency team for feedback',
          'Resume builder: "Campus Ambassador, InTransparency - Drove 150+ sign-ups"'
        ],
        cta: 'Apply Now',
        trigger: 'After referring 10+ students → "Become Campus Ambassador?"'
      }
    ]
  },
  institution: {
    title: 'Institution Partner Program',
    subtitle: 'Earn bonuses by promoting Pro upgrades and company partnerships',
    icon: Building2,
    color: 'from-purple-500 to-pink-500',
    programs: [
      {
        id: 'student-upgrade-bonus',
        title: 'Student Pro Upgrade Bonus',
        description: 'Earn when your students upgrade to Pro',
        icon: TrendingUp,
        reward: '10% of student Pro fees',
        details: [
          'When your verified students upgrade to Pro (€9/month), you earn 10%',
          'Example: 50 students upgrade = €45/month × 12 = €540/year',
          'Automated tracking via your institution dashboard',
          'Promote Pro in career center emails: "Unlock unlimited projects for €9/month"',
          'Use funds for student scholarships or career services budget'
        ],
        cta: 'Enable Partner Tracking',
        trigger: 'In dashboard: "50% of your alumni on Pro - promote bulk upgrade?"'
      },
      {
        id: 'company-partnership',
        title: 'Company Partnership Referrals',
        description: 'Connect companies to InTransparency',
        icon: Briefcase,
        reward: '20% of first-year company revenue',
        details: [
          'Refer companies recruiting from your students',
          'Company signs up → Uses InTransparency → You earn 20% Year 1 revenue',
          'Example: Company spends €500 in Year 1 = €100 bonus to institution',
          'Win-win: Companies get verified talent, you prove placement impact',
          'Track in analytics: "BMW recruited 5 students via your referral - €87 earned"'
        ],
        cta: 'Get Company Referral Link',
        trigger: 'After dashboard views: "Deloitte viewed 31 students - invite them officially?"'
      },
      {
        id: 'its-network',
        title: 'ITS Academy Network',
        description: 'Refer other ITS academies to join',
        icon: Users,
        reward: '€250 per ITS signup',
        details: [
          'Refer fellow ITS academies (G. Natta, IFOA, Rizzoli, etc.)',
          'When they complete integration and verify 10+ students, you earn €250',
          'Help build verified ITS talent network across Italy',
          'Collaborative benefits: "47 ITS academies verified - companies trust ITS brand"',
          'Quarterly ITS partner summits for networking'
        ],
        cta: 'Refer ITS Academy',
        trigger: 'Free core hooks all → Upsell via in-dashboard tours'
      }
    ]
  },
  company: {
    title: 'Company Referral Program',
    subtitle: 'Earn credits by referring institutions and other companies',
    icon: Briefcase,
    color: 'from-green-500 to-emerald-500',
    programs: [
      {
        id: 'refer-institution',
        title: 'Refer Educational Institutions',
        description: 'Invite universities/ITS to verify their students',
        icon: Building2,
        reward: '50 free contact credits',
        details: [
          'Partner with institutions you hire from (Politecnico, Sapienza, ITS)',
          'When they join and verify 20+ students, you get 50 free credits (€500 value)',
          'Get "Institution-Recommended" badge on your company profile',
          'Priority access to newly verified students from that institution',
          'Example: Refer 3 ITS academies = 150 credits = €1,500 in hiring'
        ],
        cta: 'Nominate Institution',
        trigger: 'Post-contact: "Hired via InTransparency? Nominate this ITS for exclusive access"'
      },
      {
        id: 'refer-company',
        title: 'Refer Other Companies',
        description: 'Invite fellow recruiters to join platform',
        icon: Users,
        reward: '€20 credit per signup',
        details: [
          'Share with HR network and fellow recruiters',
          'When referred company makes first contact (€10), you both get €20 credit',
          'No limit on referrals',
          'Build recruiter network: "Join 500+ companies hiring verified talent"',
          'Quarterly networking events for referrers'
        ],
        cta: 'Get Referral Link',
        trigger: 'After 5 matches viewed → "Share InTransparency with HR network?"'
      },
      {
        id: 'enterprise-advocacy',
        title: 'Enterprise Advocate Program',
        description: 'Case studies and testimonials for marketing',
        icon: Award,
        reward: '3 months free Enterprise',
        details: [
          'Share your success story: "Hired 15 verified ITS students in 6 months"',
          'We create case study with your company logo and metrics',
          'Get 3 months free Enterprise tier (€297 value)',
          'Featured in marketing materials and institution presentations',
          'Speaking opportunities at ITS career fairs and events',
          'Build employer brand as verified talent champion'
        ],
        cta: 'Submit Success Story',
        trigger: 'After successful hire: "Share your hiring success for 3 months free?"'
      }
    ]
  }
}

export default function ReferralsPage() {
  const t = useTranslations('referrals')
  const [selectedSegment, setSelectedSegment] = useState<ReferralSegment>('student')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [referralCode] = useState('INTRANS-STU-A7B9C2') // Mock code

  const handleCopyCode = (programId: string) => {
    navigator.clipboard.writeText(`https://intransparency.app/ref/${referralCode}/${programId}`)
    setCopiedCode(programId)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const currentProgram = referralPrograms[selectedSegment]
  const Icon = currentProgram.icon

  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-5xl font-display font-bold mb-6">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              {t('hero.subtitle')}
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              20-30% additional revenue through referrals • €177K Year 1 projected from cross-selling
            </p>
          </motion.div>

          {/* Segment Selector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
              <div className="flex space-x-2">
                {(['student', 'institution', 'company'] as ReferralSegment[]).map((segment) => {
                  const config = {
                    student: { label: 'Students', icon: GraduationCap },
                    institution: { label: 'Institutions', icon: Building2 },
                    company: { label: 'Companies', icon: Briefcase }
                  }
                  const SegmentIcon = config[segment].icon
                  return (
                    <button
                      key={segment}
                      onClick={() => setSelectedSegment(segment)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedSegment === segment
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'text-gray-800 hover:text-gray-900 hover:bg-slate-100'
                      }`}
                    >
                      <SegmentIcon className="h-4 w-4 mr-2" />
                      {config[segment].label}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Program Overview */}
          <motion.div
            key={selectedSegment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Card className={`border-2 bg-gradient-to-r ${currentProgram.color} text-white border-0`}>
              <CardContent className="py-8 text-center">
                <Icon className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-3xl font-display font-bold mb-2">{currentProgram.title}</h2>
                <p className="text-lg text-white/90">{currentProgram.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Referral Programs Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {currentProgram.programs.map((program, index) => {
              const ProgramIcon = program.icon
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all border-2 border-gray-200 hover:border-primary/40">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-lg">
                          <ProgramIcon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {program.reward}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                      <p className="text-sm text-gray-600">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <p className="text-xs font-semibold text-gray-900 mb-2">How It Works:</p>
                        {program.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start text-xs text-gray-700">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>

                      {/* Trigger Point */}
                      <div className="bg-primary/5 border-l-4 border-primary p-3 rounded mb-4">
                        <p className="text-xs text-gray-700">
                          <strong className="text-primary">Trigger: </strong>
                          {program.trigger}
                        </p>
                      </div>

                      {/* CTA */}
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                        onClick={() => handleCopyCode(program.id)}
                      >
                        {copiedCode === program.id ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <Share2 className="h-4 w-4 mr-2" />
                            {program.cta}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Referral Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Your Referral Dashboard
            </h2>

            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Referral Performance</span>
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                    Live Demo
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">23</div>
                    <div className="text-xs text-gray-600">Total Referrals</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-xs text-green-600">87% conversion</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">20</div>
                    <div className="text-xs text-gray-600">Successful Sign-ups</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="h-5 w-5 text-secondary" />
                      <span className="text-xs text-secondary">4 this month</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-xs text-gray-600">Pro Upgrades</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <Euro className="h-5 w-5 text-green-600" />
                      <span className="text-xs text-green-600">+€23 pending</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">€87</div>
                    <div className="text-xs text-gray-600">Total Earned</div>
                  </div>
                </div>

                {/* Referral Link */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Your Referral Link:</p>
                  <div className="flex gap-2">
                    <Input
                      value={`https://intransparency.app/ref/${referralCode}`}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleCopyCode('main')}
                    >
                      {copiedCode === 'main' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Share via email, WhatsApp, or social media. Automatic tracking and payouts.
                  </p>
                </div>

                {/* Quick Share Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cross-Selling Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Cross-Segment Success Stories
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Real examples of referral ecosystem growth
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-blue-100 text-blue-800">Student → Institution</Badge>
                  <CardTitle className="text-base">ITS G. Natta Sign-Up</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p className="mb-3">
                    Marco (Chemistry student) referred ITS G. Natta → 120 students verified → 45 upgraded to Pro
                  </p>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-xs text-green-800">
                      <strong>Marco earned:</strong> €486/year (10% of €4,860 Pro fees)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-purple-100 text-purple-800">Institution → Company</Badge>
                  <CardTitle className="text-base">Politecnico → BMW Partnership</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p className="mb-3">
                    Politecnico Milano referred BMW → Company hired 12 verified engineers → €720 Year 1 spend
                  </p>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-xs text-green-800">
                      <strong>Politecnico earned:</strong> €144 (20% referral bonus for scholarships)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-green-100 text-green-800">Company → Institution</Badge>
                  <CardTitle className="text-base">Siemens → ITS IFOA</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p className="mb-3">
                    Siemens nominated ITS IFOA → 150 mechatronics students verified → Priority access granted
                  </p>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-xs text-green-800">
                      <strong>Siemens earned:</strong> 50 free credits (€500 value) + "Institution Partner" badge
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Terms & Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card>
              <CardHeader>
                <CardTitle>Referral Program Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Tracking:</strong> Automatic via cookies and referral codes. 90-day attribution window.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Payouts:</strong> Quarterly via PayPal or bank transfer. Minimum €25 threshold.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Eligibility:</strong> Active InTransparency account required. Self-referrals not allowed.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Transparency:</strong> Full referral dashboard with real-time tracking. GDPR compliant.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Updates:</strong> Referral rates subject to change with 30-day notice. Grandfathered for existing referrals.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-primary to-secondary border-0 text-white">
              <CardContent className="py-12 text-center">
                <Gift className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-3xl font-display font-bold mb-4">
                  Start Earning Today
                </h3>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Join {selectedSegment === 'student' ? '10,000+ students' : selectedSegment === 'institution' ? '100+ institutions' : '500+ companies'} earning through referrals. Transparent tracking, automatic payouts, win-win growth.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                  >
                    <Link href="/auth/register">
                      Get Your Referral Link
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
