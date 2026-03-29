'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ArrowLeft } from 'lucide-react'

type Sections = 'links' | 'details'

export default function EditProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as Record<string, string> | undefined
  const t = useTranslations('profileEdit')

  const [expanded, setExpanded] = useState<Record<Sections, boolean>>({ links: false, details: false })
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', bio: '', university: '', major: '',
    graduationYear: String(new Date().getFullYear() + 1), location: '', languages: '',
    linkedinUrl: '', githubUrl: '', portfolioUrl: '', availableFor: 'BOTH',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard/student/profile')
        if (!res.ok) return
        const { user: u } = await res.json()
        setFormData({
          firstName: u.firstName || '', lastName: u.lastName || '',
          bio: u.bio || '', university: u.university || '', major: u.degree || '',
          graduationYear: u.graduationYear ? String(u.graduationYear) : String(new Date().getFullYear() + 1),
          location: u.location || '', languages: u.languages || '',
          linkedinUrl: u.linkedinUrl || '', githubUrl: u.githubUrl || '',
          portfolioUrl: u.portfolioUrl || '', availableFor: u.availableFor || 'BOTH',
        })
      } catch {
        if (user) {
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || prev.firstName,
            lastName: user.lastName || prev.lastName,
          }))
        }
      }
    }
    load()
  }, [user])

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName.trim() || !formData.lastName.trim()) return
    setSaveState('saving')
    try {
      const res = await fetch('/api/dashboard/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName, lastName: formData.lastName,
          bio: formData.bio, tagline: formData.bio?.slice(0, 120),
          university: formData.university, degree: formData.major,
          graduationYear: formData.graduationYear,
          location: formData.location, languages: formData.languages,
          linkedinUrl: formData.linkedinUrl, githubUrl: formData.githubUrl,
          portfolioUrl: formData.portfolioUrl, availableFor: formData.availableFor,
        }),
      })
      if (!res.ok) throw new Error()
      setSaveState('saved')
      setTimeout(() => router.push('/dashboard/student/profile'), 1500)
    } catch {
      setSaveState('idle')
    }
  }

  const toggle = (s: Sections) => setExpanded(prev => ({ ...prev, [s]: !prev[s] }))

  const linkCount = [formData.linkedinUrl, formData.githubUrl, formData.portfolioUrl]
    .filter(Boolean).length
  const linkNames = [
    formData.linkedinUrl && 'LinkedIn',
    formData.githubUrl && 'GitHub',
    formData.portfolioUrl && 'Portfolio',
  ].filter(Boolean)

  const detailSummary = [
    formData.graduationYear && formData.graduationYear,
    formData.location,
    formData.languages,
  ].filter(Boolean)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 16 }, (_, i) => String(currentYear - 5 + i))

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Basic Info — always visible */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('basic.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">{t('basic.firstName')}</Label>
                <Input id="firstName" value={formData.firstName}
                  onChange={e => set('firstName', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">{t('basic.lastName')}</Label>
                <Input id="lastName" value={formData.lastName}
                  onChange={e => set('lastName', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">{t('basic.bio')}</Label>
              <Textarea id="bio" rows={3} placeholder={t('basic.bioPlaceholder')}
                value={formData.bio} onChange={e => set('bio', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="university">{t('basic.university')}</Label>
                <Input id="university" value={formData.university}
                  onChange={e => set('university', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="major">{t('basic.degree')}</Label>
                <Input id="major" value={formData.major}
                  onChange={e => set('major', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Links — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('links.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('links')}>
                {expanded.links ? t('save') : linkCount > 0
                  ? `${linkNames.join(', ')} — ${t('links.summary', { count: linkCount })}`
                  : t('links.summary', { count: 0 })}
              </Button>
            </div>
          </CardHeader>
          {expanded.links && (
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedinUrl">{t('links.linkedin')}</Label>
                <Input id="linkedinUrl" placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="githubUrl">{t('links.github')}</Label>
                <Input id="githubUrl" placeholder="https://github.com/..."
                  value={formData.githubUrl} onChange={e => set('githubUrl', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portfolioUrl">{t('links.portfolio')}</Label>
                <Input id="portfolioUrl" placeholder="https://..."
                  value={formData.portfolioUrl} onChange={e => set('portfolioUrl', e.target.value)} />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 3: Details — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('details.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('details')}>
                {expanded.details ? t('save') : detailSummary.length > 0
                  ? detailSummary.join(' / ')
                  : t('details.title')}
              </Button>
            </div>
          </CardHeader>
          {expanded.details && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="graduationYear">{t('details.graduationYear')}</Label>
                  <Select value={formData.graduationYear}
                    onValueChange={v => set('graduationYear', v)}>
                    <SelectTrigger id="graduationYear"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">{t('details.location')}</Label>
                  <Input id="location" value={formData.location}
                    onChange={e => set('location', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="languages">{t('details.languages')}</Label>
                <Input id="languages" placeholder="English, Italian"
                  value={formData.languages} onChange={e => set('languages', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="availableFor">{t('details.availability')}</Label>
                <Select value={formData.availableFor}
                  onValueChange={v => set('availableFor', v)}>
                  <SelectTrigger id="availableFor"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOTH">{t('details.availabilityOptions.jobs')}</SelectItem>
                    <SelectItem value="HIRING">{t('details.availabilityOptions.internships')}</SelectItem>
                    <SelectItem value="PROJECTS">{t('details.availabilityOptions.freelance')}</SelectItem>
                    <SelectItem value="NONE">{t('details.availabilityOptions.notLooking')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" asChild>
            <Link href="/dashboard/student/profile">{t('back')}</Link>
          </Button>
          <Button type="submit" disabled={saveState === 'saving'}>
            {saveState === 'saving' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saveState === 'idle' && t('save')}
            {saveState === 'saving' && t('saving')}
            {saveState === 'saved' && t('saved')}
          </Button>
        </div>
      </form>
    </div>
  )
}
