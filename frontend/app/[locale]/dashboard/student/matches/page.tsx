'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Eye, ChevronRight, Briefcase } from 'lucide-react'
import { Link } from '@/navigation'

interface Match {
  id: string
  matchScore: number
  decisionLabel: string | null
  companyName: string
  jobTitle: string | null
  recruiterName: string | null
  viewed: boolean
  modelVersion: string
  createdAt: string
}

interface MatchesResponse {
  matches: Match[]
  summary: { total: number; strong: number; unviewed: number }
}

const LABEL_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  STRONG_MATCH: 'default',
  MATCH: 'default',
  WEAK_MATCH: 'secondary',
  NO_MATCH: 'outline',
}

export default function StudentMatches() {
  const t = useTranslations('studentMatches')
  const [data, setData] = useState<MatchesResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const LABEL_TEXT: Record<string, string> = {
    STRONG_MATCH: t('labelStrongMatch'),
    MATCH: t('labelMatch'),
    WEAK_MATCH: t('labelWeakMatch'),
    NO_MATCH: t('labelNoMatch'),
  }

  useEffect(() => {
    fetch('/api/student/matches')
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-24 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!data || data.matches.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t('noMatchesTitle')}</h1>
            <p className="text-muted-foreground max-w-md mx-auto">{t('noMatchesDesc')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { matches, summary } = data

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{summary.total}</div>
            <div className="text-sm text-muted-foreground">{t('totalMatches')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-600">{summary.strong}</div>
            <div className="text-sm text-muted-foreground">{t('strongMatches')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-600">{summary.unviewed}</div>
            <div className="text-sm text-muted-foreground">{t('unviewed')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {matches.map(m => (
          <Link key={m.id} href={`/dashboard/student/matches/${m.id}` as any} className="block">
            <Card className="hover:bg-muted/30 transition-colors">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">
                        {m.jobTitle ? `${m.jobTitle} — ${m.companyName}` : m.companyName}
                      </h3>
                      {!m.viewed && (
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                          {t('new')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{t('matchedOn', { date: new Date(m.createdAt).toLocaleDateString() })}</span>
                      {m.viewed && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {t('viewed')}
                        </span>
                      )}
                      <span>{t('model')} {m.modelVersion}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(m.matchScore)}
                    </div>
                    {m.decisionLabel && (
                      <Badge variant={LABEL_VARIANT[m.decisionLabel] ?? 'outline'} className="text-xs">
                        {LABEL_TEXT[m.decisionLabel] ?? m.decisionLabel}
                      </Badge>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>{t('yourRightsTitle')}</strong> {t('yourRightsBody')}{' '}
            <Link href="/algorithm-registry" className="underline text-primary">
              {t('readHowModelWorks')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
