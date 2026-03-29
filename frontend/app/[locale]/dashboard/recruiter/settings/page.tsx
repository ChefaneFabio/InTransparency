'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Users,
  Bell,
  CheckCircle,
  AlertCircle,
  Loader2,
  Target
} from 'lucide-react'

interface RecruiterSettings {
  companyName: string
  companyWebsite: string
  companyIndustry: string
  companySize: string
  companyLocation: string
  companyDescription: string
  companyLogo: string
  seekingType: 'HIRE' | 'PROJECTS' | 'BOTH'
  notifyNewApplications: boolean
  notifyMessages: boolean
  notifySearchAlerts: boolean
}

const defaultSettings: RecruiterSettings = {
  companyName: '',
  companyWebsite: '',
  companyIndustry: '',
  companySize: '',
  companyLocation: '',
  companyDescription: '',
  companyLogo: '',
  seekingType: 'BOTH',
  notifyNewApplications: true,
  notifyMessages: true,
  notifySearchAlerts: false
}

export default function RecruiterSettingsPage() {
  const { data: session } = useSession()
  const t = useTranslations('recruiterDashboard.settings')
  const user = session?.user

  const [settings, setSettings] = useState<RecruiterSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isValidUrl = (url: string) => /^https?:\/\/.+\..+/.test(url)

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!settings.companyName.trim()) {
      errs.companyName = t('validation.companyNameRequired')
    }
    if (settings.companyWebsite && !isValidUrl(settings.companyWebsite)) {
      errs.companyWebsite = t('validation.invalidUrl')
    }
    if (settings.companyLogo && !isValidUrl(settings.companyLogo)) {
      errs.companyLogo = t('validation.invalidUrl')
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const updateSetting = (field: keyof RecruiterSettings, value: string | boolean) => {
    setSettings({ ...settings, [field]: value })
    if (fieldErrors[field]) {
      const next = { ...fieldErrors }
      delete next[field]
      setFieldErrors(next)
    }
  }

  // Fetch settings
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/recruiter/settings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load settings')
        return res.json()
      })
      .then(data => {
        if (data.settings) {
          setSettings({
            companyName: data.settings.companyName || '',
            companyWebsite: data.settings.companyWebsite || '',
            companyIndustry: data.settings.companyIndustry || '',
            companySize: data.settings.companySize || '',
            companyLocation: data.settings.companyLocation || '',
            companyDescription: data.settings.companyDescription || '',
            companyLogo: data.settings.companyLogo || '',
            seekingType: data.settings.seekingType || 'BOTH',
            notifyNewApplications: data.settings.notifyNewApplications ?? true,
            notifyMessages: data.settings.notifyMessages ?? true,
            notifySearchAlerts: data.settings.notifySearchAlerts ?? false
          })
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    setSaveMessage(null)
    try {
      const res = await fetch('/api/dashboard/recruiter/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (!res.ok) throw new Error('Failed to save settings')
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' })
      // Auto-clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-9 w-20" />
          <div className="space-y-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-36" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/recruiter">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('back')}
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{t('failedToLoad')}</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t('tryAgain')}</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/recruiter">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Company Settings</h1>
          <p className="text-muted-foreground">Manage your company profile</p>
        </div>
      </div>

      {/* Save Message Toast */}
      {saveMessage && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          saveMessage.type === 'success'
            ? 'bg-primary/5 text-green-800 border border-primary/20'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <p className="text-sm font-medium">{saveMessage.text}</p>
        </div>
      )}

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t('companyProfile')}
          </CardTitle>
          <CardDescription>
            {t('companyProfileDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">{t('form.companyName')}</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => updateSetting('companyName', e.target.value)}
                placeholder="Your Company"
                className={fieldErrors.companyName ? 'border-red-500' : ''}
              />
              {fieldErrors.companyName && <p className="text-sm text-red-500 mt-1">{fieldErrors.companyName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">{t('form.website')}</Label>
              <Input
                id="website"
                value={settings.companyWebsite}
                onChange={(e) => updateSetting('companyWebsite', e.target.value)}
                placeholder="https://yourcompany.com"
                className={fieldErrors.companyWebsite ? 'border-red-500' : ''}
              />
              {fieldErrors.companyWebsite && <p className="text-sm text-red-500 mt-1">{fieldErrors.companyWebsite}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyLogo">{t('form.companyLogo')}</Label>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                {settings.companyLogo ? (
                  <img
                    src={settings.companyLogo}
                    alt="Company logo"
                    className="h-12 w-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-muted-foreground/60" />
                )}
              </div>
              <Input
                id="companyLogo"
                value={settings.companyLogo}
                onChange={(e) => updateSetting('companyLogo', e.target.value)}
                placeholder="https://yourcompany.com/logo.png"
                className={`flex-1 ${fieldErrors.companyLogo ? 'border-red-500' : ''}`}
              />
            </div>
            {fieldErrors.companyLogo && <p className="text-sm text-red-500 mt-1">{fieldErrors.companyLogo}</p>}
            <p className="text-xs text-muted-foreground">Enter the URL of your company logo image</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">{t('form.industry')}</Label>
              <Input
                id="industry"
                value={settings.companyIndustry}
                onChange={(e) => updateSetting('companyIndustry', e.target.value)}
                placeholder="Technology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">{t('form.companySize')}</Label>
              <Input
                id="size"
                value={settings.companySize}
                onChange={(e) => updateSetting('companySize', e.target.value)}
                placeholder="50-200 employees"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('form.location')}</Label>
            <Input
              id="location"
              value={settings.companyLocation}
              onChange={(e) => updateSetting('companyLocation', e.target.value)}
              placeholder="Milano, Italy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('form.companyDescription')}</Label>
            <Textarea
              id="description"
              value={settings.companyDescription}
              onChange={(e) => updateSetting('companyDescription', e.target.value)}
              placeholder="Tell candidates about your company..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hiring Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('seekingTitle')}
          </CardTitle>
          <CardDescription>
            {t('seekingDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t('form.lookingFor')}</Label>
            <p className="text-sm text-muted-foreground mb-2">{t('form.lookingForDesc')}</p>
            <Select
              value={settings.seekingType}
              onValueChange={(value: 'HIRE' | 'PROJECTS' | 'BOTH') =>
                setSettings({ ...settings, seekingType: value })
              }
            >
              <SelectTrigger className="w-full md:w-[320px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIRE">{t('form.seekHire')}</SelectItem>
                <SelectItem value="PROJECTS">{t('form.seekProjects')}</SelectItem>
                <SelectItem value="BOTH">{t('form.seekBoth')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications.title')}
          </CardTitle>
          <CardDescription>
            {t('notifications.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('notifications.newApplications')}</p>
              <p className="text-sm text-muted-foreground">{t('notifications.newApplicationsDesc')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifyNewApplications}
              onClick={() => setSettings({ ...settings, notifyNewApplications: !settings.notifyNewApplications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifyNewApplications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifyNewApplications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('notifications.messages')}</p>
              <p className="text-sm text-muted-foreground">{t('notifications.messagesDesc')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifyMessages}
              onClick={() => setSettings({ ...settings, notifyMessages: !settings.notifyMessages })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifyMessages ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifyMessages ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('notifications.searchAlerts')}</p>
              <p className="text-sm text-muted-foreground">{t('notifications.searchAlertsDesc')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifySearchAlerts}
              onClick={() => setSettings({ ...settings, notifySearchAlerts: !settings.notifySearchAlerts })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifySearchAlerts ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifySearchAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {saving ? t('saving') : t('saveChanges')}
        </Button>
      </div>
    </div>
  )
}
