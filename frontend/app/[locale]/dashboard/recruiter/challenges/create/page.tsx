'use client'

import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { ChallengeForm } from '@/components/challenges/ChallengeForm'
import { ArrowLeft } from 'lucide-react'

export default function CreateChallengePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/recruiter/challenges">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Challenge</h1>
          <p className="text-gray-600 mt-1">
            Propose a real-world project for students to work on
          </p>
        </div>
      </div>

      <ChallengeForm mode="create" />
    </div>
  )
}
