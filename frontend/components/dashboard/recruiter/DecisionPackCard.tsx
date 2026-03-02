'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, TrendingUp, Shield } from 'lucide-react'

interface Props {
  candidateId: string
  candidateName: string
  university?: string | null
  verifiedProjects?: number
  endorsements?: number
}

export default function DecisionPackCard({
  candidateId,
  candidateName,
  university,
  verifiedProjects = 0,
  endorsements = 0,
}: Props) {
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    // Navigation handled by Link — this is just for the loading state
  }

  return (
    <Card className="border-blue-100 hover:border-blue-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{candidateName}</p>
              {university && (
                <p className="text-xs text-gray-500">{university}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {verifiedProjects > 0 && (
              <Badge variant="outline" className="text-xs">
                <Shield className="mr-1 h-3 w-3 text-green-500" />
                {verifiedProjects} verified
              </Badge>
            )}
            {endorsements > 0 && (
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-blue-500" />
                {endorsements} endorsed
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          className="w-full mt-3"
          asChild
          onClick={handleGenerate}
        >
          <Link href={`/dashboard/recruiter/decision-pack/${candidateId}`}>
            {generating ? 'Generating...' : 'Generate Full Dossier'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
