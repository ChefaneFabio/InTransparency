'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { ChallengeForm } from '@/components/challenges/ChallengeForm'
import { ArrowLeft } from 'lucide-react'

export default function NewChallengePage() {
  const t = useTranslations('dashboard.recruiter.challenges')

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/recruiter/challenges">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToChallenges', { defaultValue: 'Back to challenges' })}
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{t('createChallenge')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('createSubtitle', {
            defaultValue: 'Define a real problem for student teams. We route it to partner academic programs for review.',
          })}
        </p>
      </div>
      <ChallengeForm mode="create" />
    </div>
  )
}
