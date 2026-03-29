'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { ChallengeForm } from '@/components/challenges/ChallengeForm'
import { ArrowLeft } from 'lucide-react'

export default function CreateChallengePage() {
  const t = useTranslations('dashboard.recruiter.challengesCreate')
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/recruiter/challenges">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('back')}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <ChallengeForm mode="create" />
    </div>
  )
}
