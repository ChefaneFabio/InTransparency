'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Zap, Award, Mail, Calendar, Briefcase } from 'lucide-react'

interface FastTrackStudent {
  id: string
  name: string
  email: string
  skills: string[]
  certificates: Array<{
    id: string
    title: string
    issueDate: string
    credentialId: string
  }>
  certificateCount: number
  availableSince: string
}

export default function FastTrackPage() {
  const t = useTranslations('fastTrack')
  const [students, setStudents] = useState<FastTrackStudent[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/fast-track')
      const data = await res.json()
      setStudents(data.students || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error('Failed to fetch fast track data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('it-IT')

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-500" /> {t('header.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('header.subtitle')}
        </p>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2"><Briefcase className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-sm text-muted-foreground">{t('summary.label')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Cards */}
      {students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('empty')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {students.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {t('card.availableSince', { date: formatDate(student.availableSince) })}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" /> {student.certificateCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Skills */}
                {student.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">{t('card.skills')}</p>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 8).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{String(skill)}</Badge>
                      ))}
                      {student.skills.length > 8 && (
                        <Badge variant="outline" className="text-xs">+{student.skills.length - 8}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">{t('card.certificates')}</p>
                  <div className="space-y-1">
                    {student.certificates.slice(0, 3).map((cert) => (
                      <div key={cert.id} className="flex items-center gap-2 text-sm">
                        <Award className="h-3.5 w-3.5 text-primary" />
                        <span>{cert.title}</span>
                        <span className="text-xs text-muted-foreground">({formatDate(cert.issueDate)})</span>
                      </div>
                    ))}
                    {student.certificates.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        {t('card.moreCertificates', { count: student.certificates.length - 3 })}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = `mailto:${student.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" /> {t('card.contact')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
