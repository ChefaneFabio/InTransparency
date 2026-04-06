'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'
import { Award, Loader2, ExternalLink, Star, Filter } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Endorsement {
  id: string
  studentName: string
  projectTitle: string
  courseName: string
  status: 'PENDING' | 'VERIFIED' | 'DECLINED' | 'EXPIRED'
  rating: number | null
  endorsementText: string | null
  verifiedAt: string | null
  createdAt: string
  verificationToken: string | null
}

const statusColors: Record<string, string> = {
  PENDING: 'text-amber-600 border-amber-200 bg-amber-50',
  VERIFIED: 'text-primary border-primary/20 bg-primary/5',
  DECLINED: 'text-red-600 border-red-200 bg-red-50',
  EXPIRED: 'text-muted-foreground border-border bg-muted/50',
}

export default function ProfessorEndorsementsPage() {
  const t = useTranslations('professorDashboard')
  const { status: authStatus } = useSession()
  const router = useRouter()
  const [endorsements, setEndorsements] = useState<Endorsement[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  useEffect(() => {
    if (authStatus === 'loading') return
    if (authStatus === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    const fetchEndorsements = async () => {
      try {
        const url = filter === 'ALL'
          ? '/api/professor/endorsements'
          : `/api/professor/endorsements?status=${filter}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setEndorsements(data.endorsements || [])
        }
      } catch (err) {
        console.error('Failed to load endorsements:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEndorsements()
  }, [authStatus, router, filter])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const filters = ['ALL', 'PENDING', 'VERIFIED', 'DECLINED']

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <MetricHero gradient="primary">
        <h1 className="text-3xl font-bold">{t('endorsements.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('endorsements.subtitle')}</p>
      </MetricHero>

      {/* Filters */}
      <div className="flex gap-2">
        <Filter className="h-5 w-5 text-muted-foreground/60 mt-1" />
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilter(f); setLoading(true) }}
          >
            {f === 'ALL' ? t('endorsements.all') : f}
          </Button>
        ))}
      </div>

      {/* Endorsements List */}
      {endorsements.length === 0 ? (
        <GlassCard delay={0.1}>
          <div className="py-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">{t('endorsements.empty')}</p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {endorsements.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{e.studentName}</p>
                    <p className="text-sm text-foreground/80">{e.projectTitle}</p>
                    {e.courseName && (
                      <p className="text-xs text-muted-foreground">{e.courseName}</p>
                    )}
                    {e.endorsementText && (
                      <p className="text-sm text-muted-foreground mt-2 italic line-clamp-2">
                        &ldquo;{e.endorsementText}&rdquo;
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60">
                      {new Date(e.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={statusColors[e.status] || ''}>
                      {e.status}
                    </Badge>
                    {e.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{e.rating}/5</span>
                      </div>
                    )}
                    {e.status === 'PENDING' && e.verificationToken && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/endorsements/verify/${e.verificationToken}`}>
                          {t('review')}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
