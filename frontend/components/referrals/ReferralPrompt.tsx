'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Gift, Share2, TrendingUp, Users, Building2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type ReferralTriggerType =
  | 'student-after-match'
  | 'student-project-limit'
  | 'student-campus-ambassador'
  | 'institution-student-upgrade'
  | 'institution-company-interest'
  | 'company-after-contact'
  | 'company-enterprise-upgrade'

interface ReferralPromptProps {
  triggerType: ReferralTriggerType
  contextData?: {
    matchCount?: number
    projectCount?: number
    studentUpgradeCount?: number
    companyName?: string
    viewCount?: number
    contactCount?: number
  }
  onDismiss?: () => void
  onAction?: () => void
}

const promptConfig: Record<ReferralTriggerType, {
  title: string
  description: string
  reward: string
  cta: string
  icon: any
  color: string
}> = {
  'student-after-match': {
    title: 'Share with Friends & Earn €5',
    description: 'You got a 92% match! Share InTransparency with classmates - earn €5 per Pro upgrade + they get 1 month free.',
    reward: '€5 per friend',
    cta: 'Get Referral Link',
    icon: Share2,
    color: 'from-blue-500 to-cyan-500'
  },
  'student-project-limit': {
    title: 'Upgrade to Pro or Refer Your Institution',
    description: 'You\'ve uploaded 5 projects (limit reached). Upgrade to Pro for unlimited uploads, or invite your institution to verify students.',
    reward: '10% of Year 1',
    cta: 'View Options',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500'
  },
  'student-campus-ambassador': {
    title: 'Become Campus Ambassador',
    description: 'You\'ve referred 10+ students! Apply to become official Campus Ambassador: €50/month + exclusive perks.',
    reward: '€50/month',
    cta: 'Apply Now',
    icon: Users,
    color: 'from-green-500 to-emerald-500'
  },
  'institution-student-upgrade': {
    title: 'Promote Pro Upgrades to Students',
    description: '50% of your verified students are on Pro. Promote bulk upgrades and earn 10% of all Pro fees.',
    reward: '10% revenue share',
    cta: 'View Dashboard',
    icon: TrendingUp,
    color: 'from-purple-500 to-indigo-500'
  },
  'institution-company-interest': {
    title: 'Invite Company to Partner',
    description: 'Deloitte viewed 31 of your students. Invite them officially and earn 20% of their Year 1 spend.',
    reward: '20% of revenue',
    cta: 'Send Invitation',
    icon: Building2,
    color: 'from-green-500 to-teal-500'
  },
  'company-after-contact': {
    title: 'Hired via InTransparency? Refer the Institution',
    description: 'Nominate the student\'s institution (e.g., ITS G. Natta) for exclusive verified talent access. Get 50 free credits.',
    reward: '50 credits (€500)',
    cta: 'Nominate Institution',
    icon: Building2,
    color: 'from-blue-500 to-purple-500'
  },
  'company-enterprise-upgrade': {
    title: 'Upgrade to Enterprise & Save 90%',
    description: 'You\'ve contacted 10+ candidates this month (€100+). Enterprise gives unlimited contacts for €99/month.',
    reward: 'Save €901/year',
    cta: 'Upgrade Now',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500'
  }
}

export function ReferralPrompt({ triggerType, contextData, onDismiss, onAction }: ReferralPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const config = promptConfig[triggerType]
  const Icon = config.icon

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  const handleAction = () => {
    onAction?.()
    // Track conversion event here
    console.log(`Referral action triggered: ${triggerType}`)
  }

  // Interpolate context data into description
  let description = config.description
  if (contextData) {
    if (contextData.companyName) {
      description = description.replace('Deloitte', contextData.companyName)
    }
    if (contextData.viewCount) {
      description = description.replace('31', contextData.viewCount.toString())
    }
    if (contextData.contactCount) {
      description = description.replace('10+', contextData.contactCount.toString())
    }
  }

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`border-2 bg-gradient-to-r ${config.color} text-white border-0 shadow-xl`}>
            <CardContent className="py-4 relative">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex-shrink-0">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{config.title}</h3>
                    <Badge className="bg-white/30 text-white border-0">
                      <Gift className="h-3 w-3 mr-1" />
                      {config.reward}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/90 mb-3">{description}</p>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAction}
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      {config.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="text-white hover:bg-white/10"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Example usage in a dashboard:
// <ReferralPrompt
//   triggerType="student-after-match"
//   contextData={{ matchCount: 5 }}
//   onAction={() => router.push('/referrals')}
// />
