'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Award, ShieldCheck, XCircle, Clock, Plus, ExternalLink, Copy } from 'lucide-react'

interface Certificate {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseId: string | null
  title: string
  description: string | null
  issueDate: string
  expiryDate: string | null
  credentialId: string
  status: string
  revokedAt: string | null
  revokedReason: string | null
}

interface Stats {
  total: number
  issued: number
  revoked: number
  expired: number
}

export default function CertificatesPage() {
  const t = useTranslations('universityCertificates')
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, issued: 0, revoked: 0, expired: 0 })
  const [loading, setLoading] = useState(true)

  // Form
  const [showForm, setShowForm] = useState(false)
  const [formStudentId, setFormStudentId] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCourseId, setFormCourseId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/certificates')
      const data = await res.json()
      setCertificates(data.certificates || [])
      setStats(data.stats || { total: 0, issued: 0, revoked: 0, expired: 0 })
    } catch (err) {
      console.error('Failed to fetch certificates:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleIssue = async () => {
    if (!formStudentId || !formTitle) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/university/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formStudentId,
          title: formTitle,
          description: formDescription || undefined,
          courseId: formCourseId || undefined,
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setFormStudentId('')
        setFormTitle('')
        setFormDescription('')
        setFormCourseId('')
        await fetchData()
      }
    } catch (err) {
      console.error('Failed to issue certificate:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'outline'; icon: any }> = {
    ISSUED: { label: t('status.issued'), variant: 'default', icon: ShieldCheck },
    REVOKED: { label: t('status.revoked'), variant: 'destructive', icon: XCircle },
    EXPIRED: { label: t('status.expired'), variant: 'outline', icon: Clock },
  }

  const copyVerifyUrl = (credentialId: string) => {
    const url = `${window.location.origin}/verify/credential/${credentialId}`
    navigator.clipboard.writeText(url).catch(() => {})
    alert(t('alerts.verifyLinkCopied'))
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('it-IT')

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('header.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('header.subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> {t('header.issueButton')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2"><Award className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">{t('stats.totalIssued')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2"><ShieldCheck className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.issued}</p>
                <p className="text-sm text-muted-foreground">{t('stats.valid')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2"><XCircle className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.revoked + stats.expired}</p>
                <p className="text-sm text-muted-foreground">{t('stats.revokedExpired')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('form.title')}</CardTitle>
            <CardDescription>{t('form.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">{t('form.studentIdLabel')}</label>
                <Input
                  placeholder={t('form.studentIdPlaceholder')}
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('form.certificateTitleLabel')}</label>
                <Input
                  placeholder={t('form.certificateTitlePlaceholder')}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('form.descriptionLabel')}</label>
                <Input
                  placeholder={t('form.descriptionPlaceholder')}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('form.courseIdLabel')}</label>
                <Input
                  placeholder={t('form.courseIdPlaceholder')}
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>{t('form.cancel')}</Button>
              <Button onClick={handleIssue} disabled={submitting || !formStudentId || !formTitle}>
                {submitting ? t('form.submitting') : t('form.submit')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificates List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('list.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t('list.empty')}</p>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => {
                const cfg = statusConfig[cert.status] || { label: cert.status, variant: 'outline' as const, icon: Clock }
                const StatusIcon = cfg.icon
                return (
                  <div key={cert.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{cert.title}</p>
                        <Badge variant={cfg.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" /> {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cert.studentName} | {t('list.issuedOn')}: {formatDate(cert.issueDate)}
                        {cert.expiryDate && ` | ${t('list.expiresOn')}: ${formatDate(cert.expiryDate)}`}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{t('list.idLabel')}: {cert.credentialId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => copyVerifyUrl(cert.credentialId)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/verify/credential/${cert.credentialId}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
