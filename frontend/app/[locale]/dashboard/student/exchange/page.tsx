'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Globe, Plus, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react'
import ErasmusBridge from '@/components/dashboard/student/ErasmusBridge'
import ErasmusBadge from '@/components/profile/ErasmusBadge'

interface ExchangeEnrollment {
  id: string
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

const STATUS_CONFIG: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  PLANNED: { icon: Clock, color: 'text-amber-600', label: 'Planned' },
  ACTIVE: { icon: CheckCircle, color: 'text-primary', label: 'Active' },
  COMPLETED: { icon: CheckCircle, color: 'text-primary', label: 'Completed' },
  CANCELLED: { icon: XCircle, color: 'text-red-600', label: 'Cancelled' },
}

export default function StudentExchangePage() {
  const t = useTranslations('erasmusBridge')
  const { data: session } = useSession()
  const user = session?.user as any

  const [enrollments, setEnrollments] = useState<ExchangeEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchEnrollments = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/student/exchange')
      if (res.ok) {
        const data = await res.json()
        setEnrollments(data.enrollments)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exchange enrollment?')) return
    try {
      const res = await fetch(`/api/dashboard/student/exchange?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEnrollments((prev) => prev.filter((e) => e.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addExchange')}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <ErasmusBridge
          homeUniversity={user?.university}
          homeCountry={user?.country || 'IT'}
          onCreated={() => {
            setShowForm(false)
            fetchEnrollments()
          }}
        />
      )}

      {/* Enrollments list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-8 pb-8 text-center">
            <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-1">{t('noExchanges')}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('noExchangesDescription')}</p>
            <Button variant="outline" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('addExchange')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const statusConfig = STATUS_CONFIG[enrollment.status] || STATUS_CONFIG.PLANNED
            const StatusIcon = statusConfig.icon
            return (
              <Card key={enrollment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <ErasmusBadge
                        programType={enrollment.programType}
                        homeCountry={enrollment.homeCountry}
                        hostCountry={enrollment.hostCountry}
                        verifiedByHome={enrollment.verifiedByHome}
                        verifiedByHost={enrollment.verifiedByHost}
                      />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Home</p>
                          <p className="font-medium">{enrollment.homeUniversityName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Host</p>
                          <p className="font-medium">{enrollment.hostUniversityName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(enrollment.startDate).toLocaleDateString()}</span>
                        {enrollment.endDate && (
                          <span>→ {new Date(enrollment.endDate).toLocaleDateString()}</span>
                        )}
                        <div className={`flex items-center gap-1 ${statusConfig.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </div>
                      </div>

                      {/* Verification status */}
                      <div className="flex gap-2">
                        <Badge variant={enrollment.verifiedByHome ? 'default' : 'outline'} className="text-xs">
                          {enrollment.verifiedByHome ? '✓' : '○'} Home verified
                        </Badge>
                        <Badge variant={enrollment.verifiedByHost ? 'default' : 'outline'} className="text-xs">
                          {enrollment.verifiedByHost ? '✓' : '○'} Host verified
                        </Badge>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(enrollment.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
