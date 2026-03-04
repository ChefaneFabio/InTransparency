'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Download, CheckCircle, AlertCircle, GraduationCap, Briefcase, Code, Globe, Brain } from 'lucide-react'

type CvStyle = 'classic' | 'modern'

interface ProfileData {
  user: {
    firstName: string | null
    lastName: string | null
    bio: string | null
    tagline: string | null
    university: string | null
    degree: string | null
    graduationYear: number | null
    linkedinUrl: string | null
    githubUrl: string | null
    portfolioUrl: string | null
  }
  skills: Array<{ name: string; level: number; projectCount: number }>
  projects: Array<{ id: string; title: string; skills: string[] }>
  profileCompletion: number
}

export default function CvPage() {
  const t = useTranslations('studentCv')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const [style, setStyle] = useState<CvStyle>('classic')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/dashboard/student/profile')
        if (res.ok) {
          setProfile(await res.json())
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    setDownloadError('')
    try {
      const res = await fetch(`/api/dashboard/student/cv?style=${style}`)
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Download failed' }))
        throw new Error(errorData.error || 'Download failed')
      }
      const contentType = res.headers.get('Content-Type') || ''
      if (!contentType.includes('application/pdf')) {
        throw new Error('Server returned an invalid response. Please try again.')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const name = [profile?.user.firstName, profile?.user.lastName].filter(Boolean).join('-') || 'student'
      a.download = `cv-${name.toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Download error:', err)
      setDownloadError(err.message || 'Failed to generate CV. Please try again.')
    } finally {
      setDownloading(false)
    }
  }, [style, profile])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  const hasProjects = (profile?.projects.length ?? 0) > 0
  const hasBio = !!profile?.user.bio
  const warnings: Array<{ key: string; icon: typeof AlertCircle }> = []
  if (!hasBio) warnings.push({ key: 'bio', icon: AlertCircle })
  if (!hasProjects) warnings.push({ key: 'projects', icon: AlertCircle })

  const previewItems = [
    { key: 'profile', icon: CheckCircle, available: true },
    { key: 'education', icon: GraduationCap, available: !!profile?.user.university },
    { key: 'skills', icon: Code, available: (profile?.skills.length ?? 0) > 0 },
    { key: 'projects', icon: Briefcase, available: hasProjects },
    { key: 'exchange', icon: Globe, available: true },
    { key: 'personality', icon: Brain, available: true },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What's included */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('preview.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {previewItems.map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <item.icon className={`h-4 w-4 ${item.available ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span className={item.available ? '' : 'text-muted-foreground'}>
                  {t(`preview.${item.key}`)}
                </span>
                {item.available ? (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {t('preview.included')}
                  </Badge>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Style + Download */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('style.label')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStyle('classic')}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  style === 'classic'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{t('style.classic')}</div>
                <div className="text-xs text-muted-foreground mt-1">{t('style.classicDesc')}</div>
              </button>
              <button
                onClick={() => setStyle('modern')}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  style === 'modern'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{t('style.modern')}</div>
                <div className="text-xs text-muted-foreground mt-1">{t('style.modernDesc')}</div>
              </button>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                {warnings.map((w) => (
                  <div key={w.key} className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {t(`missing.${w.key}`)}
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleDownload}
              disabled={downloading || !hasProjects}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {downloading ? t('downloading') : t('download')}
            </Button>

            {downloadError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {downloadError}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
