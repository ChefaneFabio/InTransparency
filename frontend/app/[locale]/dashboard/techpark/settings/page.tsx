'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft,
  Building2,
  Globe,
  Bell,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Palette,
  ImageIcon
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { AccountDangerZone } from '@/components/dashboard/shared/AccountDangerZone'

interface TechParkSettings {
  parkName: string
  parkType: 'PRIVATE' | 'PUBLIC' | 'MIXED'
  description: string
  website: string
  email: string
  phone: string
  city: string
  region: string
  focusAreas: string
  memberCompanyCount: number
  foundedYear: number | ''
  logo: string
  primaryColor: string
  accentColor: string
  notifyNewStudents: boolean
  notifyRecruiterActivity: boolean
  notifyPlacements: boolean
  showInDirectory: boolean
  allowStudentDiscovery: boolean
}

const defaultSettings: TechParkSettings = {
  parkName: '',
  parkType: 'MIXED',
  description: '',
  website: '',
  email: '',
  phone: '',
  city: '',
  region: '',
  focusAreas: '',
  memberCompanyCount: 0,
  foundedYear: '',
  logo: '',
  primaryColor: '#004B93',
  accentColor: '#FF6B00',
  notifyNewStudents: true,
  notifyRecruiterActivity: true,
  notifyPlacements: true,
  showInDirectory: true,
  allowStudentDiscovery: true
}

export default function TechParkSettingsPage() {
  const t = useTranslations('techparkDashboard')
  const { data: session } = useSession()
  const user = session?.user

  const [settings, setSettings] = useState<TechParkSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isValidUrl = (url: string) => /^https?:\/\/.+\..+/.test(url)
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidHex = (hex: string) => /^#[0-9a-fA-F]{6}$/.test(hex)
  const currentYear = new Date().getFullYear()

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!settings.parkName.trim()) {
      errs.parkName = t('settings.validation.parkNameRequired')
    }
    if (settings.website && !isValidUrl(settings.website)) {
      errs.website = t('settings.validation.invalidUrl')
    }
    if (settings.email && !isValidEmail(settings.email)) {
      errs.email = t('settings.validation.invalidEmail')
    }
    if (settings.primaryColor && !isValidHex(settings.primaryColor)) {
      errs.primaryColor = t('settings.validation.invalidHexColor')
    }
    if (settings.accentColor && !isValidHex(settings.accentColor)) {
      errs.accentColor = t('settings.validation.invalidHexColor')
    }
    if (settings.foundedYear !== '' && (settings.foundedYear < 1900 || settings.foundedYear > currentYear)) {
      errs.foundedYear = t('settings.validation.invalidFoundedYear')
    }
    if (settings.memberCompanyCount < 0) {
      errs.memberCompanyCount = t('settings.validation.invalidMemberCount')
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const updateSetting = (field: keyof TechParkSettings, value: string | boolean | number) => {
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
    fetch('/api/dashboard/techpark/settings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load settings')
        return res.json()
      })
      .then(data => {
        if (data.settings) {
          setSettings({
            parkName: data.settings.parkName || '',
            parkType: data.settings.parkType || 'MIXED',
            description: data.settings.description || '',
            website: data.settings.website || '',
            email: data.settings.email || '',
            phone: data.settings.phone || '',
            city: data.settings.city || '',
            region: data.settings.region || '',
            focusAreas: data.settings.focusAreas || '',
            memberCompanyCount: data.settings.memberCompanyCount || 0,
            foundedYear: data.settings.foundedYear || '',
            logo: data.settings.logo || '',
            primaryColor: data.settings.primaryColor || '#004B93',
            accentColor: data.settings.accentColor || '#FF6B00',
            notifyNewStudents: data.settings.notifyNewStudents ?? true,
            notifyRecruiterActivity: data.settings.notifyRecruiterActivity ?? true,
            notifyPlacements: data.settings.notifyPlacements ?? true,
            showInDirectory: data.settings.showInDirectory ?? true,
            allowStudentDiscovery: data.settings.allowStudentDiscovery ?? true
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
      const res = await fetch('/api/dashboard/techpark/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (!res.ok) throw new Error('Failed to save settings')
      setSaveMessage({ type: 'success', text: t('settings.savedSuccess') })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      setSaveMessage({ type: 'error', text: t('settings.savedError') })
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
            <Link href="/dashboard/techpark">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('back')}
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{t('settings.title')}</h1>
            <p className="text-muted-foreground">{t('settings.subtitle')}</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{t('settings.failedToLoad')}</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t('settings.tryAgain')}</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <MetricHero gradient="primary">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/techpark">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('back')}
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{t('settings.title')}</h1>
            <p className="text-muted-foreground">{t('settings.subtitle')}</p>
          </div>
        </div>
      </MetricHero>

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

      {/* Park Profile */}
      <GlassCard delay={0.1}>
        <div className="p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5" />
            {t('settings.parkProfile')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('settings.parkProfileDescription')}
          </p>
          <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parkName">{t('settings.parkName')}</Label>
              <Input
                id="parkName"
                value={settings.parkName}
                onChange={(e) => updateSetting('parkName', e.target.value)}
                placeholder="Your Tech Park"
                className={fieldErrors.parkName ? 'border-red-500' : ''}
              />
              {fieldErrors.parkName && <p className="text-sm text-red-500 mt-1">{fieldErrors.parkName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="parkType">{t('settings.parkType')}</Label>
              <Select
                value={settings.parkType}
                onValueChange={(value: 'PRIVATE' | 'PUBLIC' | 'MIXED') =>
                  setSettings({ ...settings, parkType: value })
                }
              >
                <SelectTrigger id="parkType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">{t('settings.private')}</SelectItem>
                  <SelectItem value="PUBLIC">{t('settings.public')}</SelectItem>
                  <SelectItem value="MIXED">{t('settings.mixed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('settings.description')}</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => updateSetting('description', e.target.value)}
              placeholder="Tell visitors about your tech park..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">{t('settings.website')}</Label>
              <Input
                id="website"
                value={settings.website}
                onChange={(e) => updateSetting('website', e.target.value)}
                placeholder="https://yourtechpark.com"
                className={fieldErrors.website ? 'border-red-500' : ''}
              />
              {fieldErrors.website && <p className="text-sm text-red-500 mt-1">{fieldErrors.website}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.email')}</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
                placeholder="info@yourtechpark.com"
                className={fieldErrors.email ? 'border-red-500' : ''}
              />
              {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('settings.phone')}</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => updateSetting('phone', e.target.value)}
                placeholder="+39 0471 123456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundedYear">{t('settings.foundedYear')}</Label>
              <Input
                id="foundedYear"
                type="number"
                value={settings.foundedYear}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value) : ''
                  setSettings({ ...settings, foundedYear: val })
                  if (fieldErrors.foundedYear) {
                    const next = { ...fieldErrors }
                    delete next.foundedYear
                    setFieldErrors(next)
                  }
                }}
                placeholder="2010"
                className={fieldErrors.foundedYear ? 'border-red-500' : ''}
              />
              {fieldErrors.foundedYear && <p className="text-sm text-red-500 mt-1">{fieldErrors.foundedYear}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">{t('settings.city')}</Label>
              <Input
                id="city"
                value={settings.city}
                onChange={(e) => updateSetting('city', e.target.value)}
                placeholder="Bolzano"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">{t('settings.region')}</Label>
              <Input
                id="region"
                value={settings.region}
                onChange={(e) => updateSetting('region', e.target.value)}
                placeholder="Trentino-Alto Adige"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="focusAreas">{t('settings.focusAreas')}</Label>
            <Input
              id="focusAreas"
              value={settings.focusAreas}
              onChange={(e) => updateSetting('focusAreas', e.target.value)}
              placeholder="AI, Green Tech, Digital Health, IoT"
            />
            <p className="text-xs text-muted-foreground">{t('settings.focusAreasHint')}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberCompanyCount">{t('settings.memberCompanyCount')}</Label>
            <Input
              id="memberCompanyCount"
              type="number"
              value={settings.memberCompanyCount}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0
                setSettings({ ...settings, memberCompanyCount: val })
                if (fieldErrors.memberCompanyCount) {
                  const next = { ...fieldErrors }
                  delete next.memberCompanyCount
                  setFieldErrors(next)
                }
              }}
              placeholder="50"
              className={fieldErrors.memberCompanyCount ? 'border-red-500' : ''}
            />
            {fieldErrors.memberCompanyCount && <p className="text-sm text-red-500 mt-1">{fieldErrors.memberCompanyCount}</p>}
          </div>
          </div>
        </div>
      </GlassCard>

      {/* Logo & Branding */}
      <GlassCard delay={0.15}>
        <div className="p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <Palette className="h-5 w-5" />
            {t('settings.branding')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('settings.brandingDescription')}
          </p>
          <div className="space-y-4">
          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logo">{t('settings.logoUrl')}</Label>
            <div className="flex items-center gap-4">
              {settings.logo && (
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
                  <img
                    src={settings.logo}
                    alt="Park logo"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
              {!settings.logo && (
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
                </div>
              )}
              <Input
                id="logo"
                value={settings.logo}
                onChange={(e) => updateSetting('logo', e.target.value)}
                placeholder="https://yourtechpark.com/logo.png"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">{t('settings.logoUrlHint')}</p>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">{t('settings.primaryColor')}</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  className={`flex-1 ${fieldErrors.primaryColor ? 'border-red-500' : ''}`}
                  placeholder="#004B93"
                />
              </div>
              {fieldErrors.primaryColor && <p className="text-sm text-red-500 mt-1">{fieldErrors.primaryColor}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">{t('settings.accentColor')}</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => updateSetting('accentColor', e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={settings.accentColor}
                  onChange={(e) => updateSetting('accentColor', e.target.value)}
                  className={`flex-1 ${fieldErrors.accentColor ? 'border-red-500' : ''}`}
                  placeholder="#FF6B00"
                />
              </div>
              {fieldErrors.accentColor && <p className="text-sm text-red-500 mt-1">{fieldErrors.accentColor}</p>}
            </div>
          </div>

          {/* Branding Preview */}
          <div className="border rounded-lg p-6 mt-2">
            <h4 className="font-medium text-foreground mb-4">{t('settings.brandingPreview')}</h4>
            <div className="p-4 rounded-lg" style={{ backgroundColor: settings.primaryColor + '10' }}>
              <div className="flex items-center gap-3 mb-3">
                {settings.logo ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img src={settings.logo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    {(settings.parkName || 'TP').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold" style={{ color: settings.primaryColor }}>
                    {settings.parkName || 'Your Tech Park'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{settings.city || 'City'}</p>
                </div>
              </div>
              <Button size="sm" style={{ backgroundColor: settings.accentColor }} className="text-white">
                {t('settings.brandingPreviewButton')}
              </Button>
            </div>
          </div>
          </div>
        </div>
      </GlassCard>

      {/* Notification Preferences */}
      <GlassCard delay={0.2}>
        <div className="p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <Bell className="h-5 w-5" />
            {t('settings.notifications')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('settings.notificationsDescription')}
          </p>
          <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('settings.newStudents')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.newStudentsDescription')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifyNewStudents}
              onClick={() => setSettings({ ...settings, notifyNewStudents: !settings.notifyNewStudents })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifyNewStudents ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifyNewStudents ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('settings.recruiterActivityLabel')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.recruiterActivityDescription')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifyRecruiterActivity}
              onClick={() => setSettings({ ...settings, notifyRecruiterActivity: !settings.notifyRecruiterActivity })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifyRecruiterActivity ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifyRecruiterActivity ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('settings.placementsLabel')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.placementsDescription')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifyPlacements}
              onClick={() => setSettings({ ...settings, notifyPlacements: !settings.notifyPlacements })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifyPlacements ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifyPlacements ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          </div>
        </div>
      </GlassCard>

      {/* Visibility */}
      <GlassCard delay={0.25}>
        <div className="p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <Eye className="h-5 w-5" />
            {t('settings.visibility')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('settings.visibilityDescription')}
          </p>
          <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('settings.showInDirectory')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.showInDirectoryDescription')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showInDirectory}
              onClick={() => setSettings({ ...settings, showInDirectory: !settings.showInDirectory })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showInDirectory ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showInDirectory ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('settings.allowStudentDiscovery')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.allowStudentDiscoveryDescription')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.allowStudentDiscovery}
              onClick={() => setSettings({ ...settings, allowStudentDiscovery: !settings.allowStudentDiscovery })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowStudentDiscovery ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowStudentDiscovery ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          </div>
        </div>
      </GlassCard>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {saving ? t('settings.saving') : t('settings.saveChanges')}
        </Button>
      </div>

      <AccountDangerZone />
    </div>
  )
}
