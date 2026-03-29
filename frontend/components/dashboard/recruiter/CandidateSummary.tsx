'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'

export default function CandidateSummary({ candidateId }: { candidateId: string }) {
  const t = useTranslations('candidateSummary')
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!candidateId) return
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/dashboard/recruiter/candidates/${candidateId}/summary`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setSummary(data.summary || null)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [candidateId])

  if (error || (!loading && !summary)) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-5 w-full" />
        ) : (
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        )}
      </CardContent>
    </Card>
  )
}
