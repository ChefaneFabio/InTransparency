'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'
import { Award, Clock, CheckCircle, XCircle, Users, Star, Loader2, ExternalLink } from 'lucide-react'

interface ProfessorStats {
  totalEndorsements: number
  pendingRequests: number
  verifiedCount: number
  declinedCount: number
  averageRating: number
  studentsEndorsed: number
}

interface PendingEndorsement {
  id: string
  studentName: string
  projectTitle: string
  courseName: string
  createdAt: string
  verificationToken: string
}

export default function ProfessorDashboardPage() {
  const t = useTranslations('professorDashboard')
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<ProfessorStats | null>(null)
  const [pending, setPending] = useState<PendingEndorsement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    const fetchData = async () => {
      try {
        const [statsRes, endorsementsRes] = await Promise.all([
          fetch('/api/professor/stats'),
          fetch('/api/professor/endorsements?status=PENDING'),
        ])
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
        if (endorsementsRes.ok) {
          const data = await endorsementsRes.json()
          setPending(data.endorsements || [])
        }
      } catch (err) {
        console.error('Failed to load professor dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [status, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-gray-600 mt-1">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.totalEndorsements || 0}</p>
            <p className="text-sm text-gray-500">{t('stats.total')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.pendingRequests || 0}</p>
            <p className="text-sm text-gray-500">{t('stats.pending')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.averageRating ? stats.averageRating.toFixed(1) : '—'}</p>
            <p className="text-sm text-gray-500">{t('stats.avgRating')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.studentsEndorsed || 0}</p>
            <p className="text-sm text-gray-500">{t('stats.students')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            {t('pendingRequests')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t('noPending')}</p>
          ) : (
            <div className="space-y-3">
              {pending.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.studentName}</p>
                    <p className="text-sm text-gray-600">{item.projectTitle}</p>
                    <p className="text-xs text-gray-400">{item.courseName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-amber-600 border-amber-200">
                      {t('pending')}
                    </Badge>
                    <Button size="sm" asChild>
                      <Link href={`/endorsements/verify/${item.verificationToken}`}>
                        {t('review')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/dashboard/professor/endorsements" className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">{t('links.allEndorsements')}</p>
                <p className="text-sm text-gray-500">{t('links.allEndorsementsDesc')}</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/dashboard/professor/students" className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">{t('links.students')}</p>
                <p className="text-sm text-gray-500">{t('links.studentsDesc')}</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
