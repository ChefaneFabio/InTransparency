'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'
import {
  ArrowLeftRight,
  Building2,
  MapPin,
  Globe,
  BookOpen,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface Partner {
  id: string
  name: string
  city: string | null
  country: string
}

interface CourseEquivalency {
  id: string
  sourceCourseName: string
  targetCourseName: string
  sourceCredits: number | null
  targetCredits: number | null
  approved: boolean
}

interface Partnership {
  id: string
  partner: Partner
  status: string
  exchangeType: string
  maxStudents: number | null
  startDate: string | null
  endDate: string | null
  courseEquivalencies: CourseEquivalency[]
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  ACTIVE: { label: 'Active', color: 'bg-primary/10 text-primary', icon: CheckCircle },
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  EXPIRED: { label: 'Expired', color: 'bg-gray-100 text-gray-600', icon: XCircle },
  REVOKED: { label: 'Revoked', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        const res = await fetch('/api/dashboard/university/partnerships')
        if (res.ok) {
          const data = await res.json()
          setPartnerships(data.partnerships || [])
        }
      } catch (error) {
        console.error('Failed to fetch partnerships:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPartnerships()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">
            <ArrowLeftRight className="h-10 w-10 mx-auto text-blue-300" />
          </div>
          <p className="text-gray-500">Loading partnerships...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exchange Partnerships</h1>
          <p className="text-gray-600 mt-1">
            Manage bilateral agreements with other universities and ITS for student exchange
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Partnership
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {partnerships.filter((p) => p.status === 'ACTIVE').length}
                </p>
                <p className="text-sm text-gray-600">Active partnerships</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {partnerships.reduce((sum, p) => sum + p.courseEquivalencies.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Course equivalencies</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(partnerships.map((p) => p.partner.country)).size}
                </p>
                <p className="text-sm text-gray-600">Countries connected</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partnerships List */}
      {partnerships.length > 0 ? (
        <div className="space-y-4">
          {partnerships.map((partnership) => {
            const status = statusConfig[partnership.status] || statusConfig.PENDING
            const StatusIcon = status.icon
            return (
              <Card key={partnership.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {partnership.partner.name}
                          </h3>
                          <Badge className={status.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          {partnership.partner.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {partnership.partner.city}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5" />
                            {partnership.partner.country}
                          </span>
                          <span className="flex items-center gap-1">
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            {partnership.exchangeType === 'BILATERAL' ? 'Bilateral' : 'Unidirectional'}
                          </span>
                        </div>

                        {/* Course Equivalencies Summary */}
                        {partnership.courseEquivalencies.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">
                              Course Equivalencies ({partnership.courseEquivalencies.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {partnership.courseEquivalencies.slice(0, 3).map((eq) => (
                                <Badge key={eq.id} variant="outline" className="text-xs">
                                  {eq.sourceCourseName} → {eq.targetCourseName}
                                  {eq.approved && (
                                    <CheckCircle className="ml-1 h-2.5 w-2.5 text-primary" />
                                  )}
                                </Badge>
                              ))}
                              {partnership.courseEquivalencies.length > 3 && (
                                <Badge variant="outline" className="text-xs text-gray-400">
                                  +{partnership.courseEquivalencies.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {partnership.maxStudents && (
                          <p className="text-xs text-gray-500 mt-2">
                            Max {partnership.maxStudents} students per year
                          </p>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <div className="text-center">
              <ArrowLeftRight className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No partnerships yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create bilateral agreements with other universities and ITS institutions
                to enable student exchange programs and course credit transfers.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Partnership
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">European Credit Transfer System (ECTS)</h4>
              <p className="text-sm text-blue-800 mt-1">
                Course equivalencies use ECTS credits for standardized comparison across European
                institutions. This enables seamless student mobility within the Bologna Process framework.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
