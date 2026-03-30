'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

type CvStyle = 'classic' | 'modern'

interface ProfileData {
  user: {
    firstName: string | null
    lastName: string | null
    email: string | null
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
  githubUrl: string | null
}

interface PersonalityData {
  bigFive: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number } | null
}

const TRAIT_KEYS = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const

export default function CvPage() {
  const t = useTranslations('studentCv')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [personality, setPersonality] = useState<PersonalityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [style, setStyle] = useState<CvStyle>('classic')

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, personalityRes] = await Promise.all([
          fetch('/api/dashboard/student/profile'),
          fetch('/api/dashboard/student/personality'),
        ])
        if (profileRes.ok) setProfile(await profileRes.json())
        if (personalityRes.ok) {
          const data = await personalityRes.json()
          setPersonality(data)
        }
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      const res = await fetch(`/api/dashboard/student/cv?style=${style}`)
      if (!res.ok) throw new Error('Download failed')
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
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }, [style, profile])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-muted-foreground">{t('empty')}</p>
      </div>
    )
  }

  const u = profile.user
  const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ')
  const hasProjects = profile.projects.length > 0
  const hasBio = !!u.bio
  const hasPersonality = !!personality?.bigFive

  const topTraits = hasPersonality
    ? TRAIT_KEYS
        .map((k) => ({ key: k, score: personality!.bigFive![k] }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : []

  const missing: Array<{ key: string; href: string }> = []
  if (!hasBio) missing.push({ key: 'bio', href: '/dashboard/student/profile/edit' })
  if (!hasProjects) missing.push({ key: 'projects', href: '/dashboard/student/projects/new' })
  if (!hasPersonality) missing.push({ key: 'personality', href: '/dashboard/student/personality' })

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden text-sm">
            <button
              onClick={() => setStyle('classic')}
              className={`px-3 py-1.5 transition-colors ${style === 'classic' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              {t('style.classic')}
            </button>
            <button
              onClick={() => setStyle('modern')}
              className={`px-3 py-1.5 transition-colors ${style === 'modern' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              {t('style.modern')}
            </button>
          </div>
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {downloading ? t('downloading') : t('download')}
          </Button>
        </div>
      </div>

      {/* Live CV preview */}
      <Card className="shadow-lg">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold">{fullName || 'Your Name'}</h2>
            {u.tagline && <p className="text-muted-foreground mt-1">{u.tagline}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
              {u.university && <span>{u.university}</span>}
              {u.degree && <span>{u.degree}</span>}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t('preview.contact')}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {u.email && <span>{u.email}</span>}
              {u.linkedinUrl && <a href={u.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>}
              {(u.githubUrl || profile.githubUrl) && <a href={u.githubUrl || profile.githubUrl || ''} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>}
              {u.portfolioUrl && <a href={u.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Portfolio</a>}
            </div>
          </div>

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t('preview.skills')}</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <Badge key={s.name} variant="secondary">{s.name}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasProjects && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t('preview.projects')}</h3>
              <ul className="space-y-2">
                {profile.projects.map((p) => (
                  <li key={p.id}>
                    <span className="font-medium">{p.title}</span>
                    {p.skills.length > 0 && (
                      <span className="text-sm text-muted-foreground ml-2">{p.skills.join(', ')}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {(u.university || u.degree) && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t('preview.education')}</h3>
              <p className="font-medium">{u.university}</p>
              <p className="text-sm text-muted-foreground">
                {[u.degree, u.graduationYear].filter(Boolean).join(' — ')}
              </p>
            </div>
          )}

          {/* Personality */}
          {hasPersonality && topTraits.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t('preview.personality')}</h3>
              <div className="flex flex-wrap gap-2">
                {topTraits.map((trait) => (
                  <Badge key={trait.key} variant="outline" className="capitalize">{trait.key}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Missing data nudges */}
      {missing.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">{t('missing.title')}</h3>
            <ul className="space-y-2">
              {missing.map((m) => (
                <li key={m.key}>
                  <Link href={m.href as any} className="text-sm text-primary hover:underline">
                    {t(`missing.${m.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
