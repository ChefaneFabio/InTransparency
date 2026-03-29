'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, ArrowDownLeft, ArrowUpRight, Users, CheckCircle, Shield } from 'lucide-react'
import ErasmusBadge from '@/components/profile/ErasmusBadge'

interface ExchangeStudent {
  id: string
  student: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    degree: string | null
    country: string
  }
  homeUniversityName: string
  homeCountry: string
  hostUniversityName: string
  hostCountry: string
  programType: string
  startDate: string
  endDate: string | null
  status: string
  verifiedByHome: boolean
  verifiedByHost: boolean
}

interface ExchangeData {
  incoming: ExchangeStudent[]
  outgoing: ExchangeStudent[]
  stats: {
    totalIncoming: number
    totalOutgoing: number
    activeIncoming: number
    activeOutgoing: number
    countries: string[]
  }
}

export default function UniversityExchangeStudentsPage() {
  const t = useTranslations('erasmusBridge')
  const [data, setData] = useState<ExchangeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/university/exchange-students')
        if (res.ok) {
          setData(await res.json())
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleVerify = async (enrollmentId: string) => {
    try {
      const res = await fetch('/api/dashboard/university/exchange-students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, verified: true }),
      })
      if (res.ok) {
        // Refresh data
        const refreshRes = await fetch('/api/dashboard/university/exchange-students')
        if (refreshRes.ok) setData(await refreshRes.json())
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!data) return null

  const renderStudentList = (students: ExchangeStudent[], direction: 'incoming' | 'outgoing') => {
    if (students.length === 0) {
      return (
        <Card className="border-dashed">
          <CardContent className="pt-8 pb-8 text-center">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-sm text-muted-foreground">{t(`university.no${direction === 'incoming' ? 'Incoming' : 'Outgoing'}`)}</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-3">
        {students.map((enrollment) => {
          const studentName = `${enrollment.student.firstName || ''} ${enrollment.student.lastName || ''}`.trim() || 'Anonymous'
          const needsVerification = direction === 'incoming' ? !enrollment.verifiedByHost : !enrollment.verifiedByHome

          return (
            <Card key={enrollment.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                      {(enrollment.student.firstName?.[0] || '') + (enrollment.student.lastName?.[0] || '')}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment.student.degree || 'No degree specified'}
                      </p>
                      <div className="mt-1">
                        <ErasmusBadge
                          programType={enrollment.programType}
                          homeCountry={enrollment.homeCountry}
                          hostCountry={enrollment.hostCountry}
                          verifiedByHome={enrollment.verifiedByHome}
                          verifiedByHost={enrollment.verifiedByHost}
                          compact
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{new Date(enrollment.startDate).toLocaleDateString()}</p>
                      <Badge variant="outline" className="text-xs">{enrollment.status}</Badge>
                    </div>

                    {needsVerification ? (
                      <Button size="sm" variant="outline" onClick={() => handleVerify(enrollment.id)}>
                        <Shield className="h-3.5 w-3.5 mr-1" />
                        Verify
                      </Button>
                    ) : (
                      <Badge className="bg-primary/10 text-primary text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Globe className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('university.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('university.subtitle')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/5">
                <ArrowDownLeft className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.stats.totalIncoming}</p>
                <p className="text-xs text-muted-foreground">{t('university.incoming')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/5">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.stats.totalOutgoing}</p>
                <p className="text-xs text-muted-foreground">{t('university.outgoing')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/5">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.stats.activeIncoming + data.stats.activeOutgoing}</p>
                <p className="text-xs text-muted-foreground">{t('university.active')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Globe className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.stats.countries.length}</p>
                <p className="text-xs text-muted-foreground">{t('university.countries')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="incoming">
        <TabsList>
          <TabsTrigger value="incoming">
            <ArrowDownLeft className="h-4 w-4 mr-1" />
            {t('university.incoming')} ({data.incoming.length})
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            {t('university.outgoing')} ({data.outgoing.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-4">
          {renderStudentList(data.incoming, 'incoming')}
        </TabsContent>
        <TabsContent value="outgoing" className="mt-4">
          {renderStudentList(data.outgoing, 'outgoing')}
        </TabsContent>
      </Tabs>
    </div>
  )
}
