'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  Mail,
  Globe,
  Phone,
  MapPin,
  Upload,
  Save,
  Bell,
  Shield,
  Users,
  Code,
  Palette,
  CheckCircle,
  AlertCircle,
  Eye,
  Lock,
  Loader2
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { useTranslations, useLocale } from 'next-intl'
import { AccountDangerZone } from '@/components/dashboard/shared/AccountDangerZone'

interface UniversitySettingsData {
  name: string
  shortName: string
  description: string
  website: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  logo: string
  notifyNewStudents: boolean
  notifyProjectSubmissions: boolean
  notifyRecruiterActivity: boolean
  notifyPlacements: boolean
  showInDirectory: boolean
  allowStudentDiscovery: boolean
  shareAnalytics: boolean
  requireEmailVerification: boolean
  primaryColor: string
  accentColor: string
  customDomain: string
}

export default function UniversitySettingsPage() {
  const t = useTranslations('universityDashboard.settings')
  const locale = useLocale()
  const isIt = locale === 'it'
  const [settings, setSettings] = useState<UniversitySettingsData>({
    name: '', shortName: '', description: '', website: '', email: '', phone: '',
    address: '', city: '', region: '', logo: '',
    notifyNewStudents: true, notifyProjectSubmissions: true, notifyRecruiterActivity: true, notifyPlacements: true,
    showInDirectory: true, allowStudentDiscovery: true, shareAnalytics: false, requireEmailVerification: false,
    primaryColor: '#004B93', accentColor: '#FF6B00', customDomain: ''
  })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isValidUrl = (url: string) => /^https?:\/\/.+\..+/.test(url)
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidHex = (hex: string) => /^#[0-9a-fA-F]{6}$/.test(hex)

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!settings.name.trim()) {
      errs.name = t('validation.nameRequired')
    }
    if (settings.website && !isValidUrl(settings.website)) {
      errs.website = t('validation.invalidUrl')
    }
    if (settings.email && !isValidEmail(settings.email)) {
      errs.email = t('validation.invalidEmail')
    }
    if (settings.primaryColor && !isValidHex(settings.primaryColor)) {
      errs.primaryColor = t('validation.invalidHexColor')
    }
    if (settings.accentColor && !isValidHex(settings.accentColor)) {
      errs.accentColor = t('validation.invalidHexColor')
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const updateSetting = (field: keyof UniversitySettingsData, value: string | boolean) => {
    setSettings({ ...settings, [field]: value })
    if (fieldErrors[field]) {
      const next = { ...fieldErrors }
      delete next[field]
      setFieldErrors(next)
    }
  }

  const fetchSettings = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch('/api/dashboard/university/settings')
      if (!res.ok) throw new Error(t('validation.failedToLoad'))
      const data = await res.json()
      if (data.settings) {
        setSettings({
          name: data.settings.name || '',
          shortName: data.settings.shortName || '',
          description: data.settings.description || '',
          website: data.settings.website || '',
          email: data.settings.email || '',
          phone: data.settings.phone || '',
          address: data.settings.address || '',
          city: data.settings.city || '',
          region: data.settings.region || '',
          logo: data.settings.logo || '',
          notifyNewStudents: data.settings.notifyNewStudents ?? true,
          notifyProjectSubmissions: data.settings.notifyProjectSubmissions ?? true,
          notifyRecruiterActivity: data.settings.notifyRecruiterActivity ?? true,
          notifyPlacements: data.settings.notifyPlacements ?? true,
          showInDirectory: data.settings.showInDirectory ?? true,
          allowStudentDiscovery: data.settings.allowStudentDiscovery ?? true,
          shareAnalytics: data.settings.shareAnalytics ?? false,
          requireEmailVerification: data.settings.requireEmailVerification ?? false,
          primaryColor: data.settings.primaryColor || '#004B93',
          accentColor: data.settings.accentColor || '#FF6B00',
          customDomain: data.settings.customDomain || '',
        })
      }
    } catch (err: any) {
      setLoadError(err.message || t('validation.failedToLoad'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    if (!validate()) return
    setIsSaving(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard/university/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError(isIt ? 'Errore durante il salvataggio delle impostazioni' : 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen space-y-6 py-8">
        <div className="container max-w-4xl mx-auto px-4 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen space-y-6 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('validation.failedToLoad')}</h3>
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <Button onClick={fetchSettings}>{t('validation.tryAgain')}</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-6 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <MetricHero gradient="primary">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
              <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('saving')}</>
              ) : (
                <><Save className="h-4 w-4 mr-2" />{t('save')}</>
              )}
            </Button>
          </div>
        </MetricHero>

        {saveSuccess && (
          <Alert className="mb-6 bg-primary/5 border-primary/20">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground/80">
              {t('savedSuccess')}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {isIt ? 'Profilo' : 'Profile'}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {isIt ? 'Notifiche' : 'Notifications'}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Branding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <GlassCard delay={0.1}>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{isIt ? 'Informazioni Istituzione' : 'Institution information'}</h3>
                <p className="text-sm text-muted-foreground mb-4">{isIt ? 'Gestisci le informazioni pubbliche della tua istituzione' : 'Manage your institution\'s public information'}</p>
                <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Building2 className="h-10 w-10 text-muted-foreground/60" />
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      {isIt ? 'Carica Logo' : 'Upload Logo'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">{isIt ? 'PNG, JPG fino a 2MB' : 'PNG, JPG up to 2MB'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{isIt ? 'Nome Completo' : 'Full name'}</Label>
                    <Input id="name" value={settings.name} onChange={(e) => updateSetting('name', e.target.value)} className={fieldErrors.name ? 'border-red-500' : ''} />
                    {fieldErrors.name && <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">{isIt ? 'Nome Breve' : 'Short name'}</Label>
                    <Input id="shortName" value={settings.shortName} onChange={(e) => updateSetting('shortName', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{isIt ? 'Descrizione' : 'Description'}</Label>
                  <Textarea id="description" value={settings.description} onChange={(e) => updateSetting('description', e.target.value)} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">{isIt ? 'Sito Web' : 'Website'}</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <Input id="website" value={settings.website} onChange={(e) => updateSetting('website', e.target.value)} className={`pl-10 ${fieldErrors.website ? 'border-red-500' : ''}`} />
                    </div>
                    {fieldErrors.website && <p className="text-sm text-red-500 mt-1">{fieldErrors.website}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <Input id="email" type="email" value={settings.email} onChange={(e) => updateSetting('email', e.target.value)} className={`pl-10 ${fieldErrors.email ? 'border-red-500' : ''}`} />
                    </div>
                    {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{isIt ? 'Telefono' : 'Phone'}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <Input id="phone" value={settings.phone} onChange={(e) => updateSetting('phone', e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{isIt ? 'Città' : 'City'}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <Input id="city" value={settings.city} onChange={(e) => updateSetting('city', e.target.value)} className="pl-10" />
                    </div>
                  </div>
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{isIt ? 'Indirizzo' : 'Address'}</Label>
                    <Input id="address" value={settings.address} onChange={(e) => updateSetting('address', e.target.value)} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="notifications">
            <GlassCard delay={0.1}>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{isIt ? 'Preferenze Notifiche' : 'Notification preferences'}</h3>
                <p className="text-sm text-muted-foreground mb-4">{isIt ? 'Scegli quali notifiche ricevere via email' : 'Choose which notifications to receive by email'}</p>
                <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{isIt ? 'Nuovo Studente Iscritto' : 'New student enrolled'}</Label>
                    <p className="text-sm text-muted-foreground">{isIt ? 'Ricevi una notifica quando uno studente si registra' : 'Get a notification when a student registers'}</p>
                  </div>
                  <Switch checked={settings.notifyNewStudents} onCheckedChange={(checked) => setSettings({ ...settings, notifyNewStudents: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{isIt ? 'Nuovi Progetti' : 'New projects'}</Label>
                    <p className="text-sm text-muted-foreground">{isIt ? 'Notifica quando uno studente carica un progetto' : 'Notify when a student uploads a project'}</p>
                  </div>
                  <Switch checked={settings.notifyProjectSubmissions} onCheckedChange={(checked) => setSettings({ ...settings, notifyProjectSubmissions: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{isIt ? 'Attività Recruiter' : 'Recruiter activity'}</Label>
                    <p className="text-sm text-muted-foreground">{isIt ? 'Notifica quando un recruiter visualizza i tuoi studenti' : 'Notify when a recruiter views your students'}</p>
                  </div>
                  <Switch checked={settings.notifyRecruiterActivity} onCheckedChange={(checked) => setSettings({ ...settings, notifyRecruiterActivity: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{isIt ? 'Nuovo Placement' : 'New placement'}</Label>
                    <p className="text-sm text-muted-foreground">{isIt ? 'Notifica quando uno studente trova lavoro' : 'Notify when a student gets placed'}</p>
                  </div>
                    <Switch checked={settings.notifyPlacements} onCheckedChange={(checked) => setSettings({ ...settings, notifyPlacements: checked })} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="privacy">
            <GlassCard delay={0.1}>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{isIt ? 'Impostazioni Privacy' : 'Privacy settings'}</h3>
                <p className="text-sm text-muted-foreground mb-4">{isIt ? 'Controlla quali dati sono visibili pubblicamente' : 'Control which data is publicly visible'}</p>
                <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="font-medium">{isIt ? 'Mostra nella Directory' : 'Show in directory'}</Label>
                      <p className="text-sm text-muted-foreground">{isIt ? 'Rendi visibile la tua istituzione nella directory' : 'Make your institution visible in the directory'}</p>
                    </div>
                  </div>
                  <Switch checked={settings.showInDirectory} onCheckedChange={(checked) => setSettings({ ...settings, showInDirectory: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="font-medium">{isIt ? 'Directory Studenti' : 'Student directory'}</Label>
                      <p className="text-sm text-muted-foreground">{isIt ? 'Permetti alle aziende di cercare studenti' : 'Allow companies to search students'}</p>
                    </div>
                  </div>
                  <Switch checked={settings.allowStudentDiscovery} onCheckedChange={(checked) => setSettings({ ...settings, allowStudentDiscovery: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="font-medium">{isIt ? 'Condividi Analytics' : 'Share analytics'}</Label>
                      <p className="text-sm text-muted-foreground">{isIt ? 'Condividi dati aggregati per benchmark' : 'Share aggregated data for benchmarking'}</p>
                    </div>
                  </div>
                  <Switch checked={settings.shareAnalytics} onCheckedChange={(checked) => setSettings({ ...settings, shareAnalytics: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="font-medium">{isIt ? 'Verifica Email Richiesta' : 'Email verification required'}</Label>
                      <p className="text-sm text-muted-foreground">{isIt ? 'Richiedi verifica email istituzionale per gli studenti' : 'Require institutional email verification for students'}</p>
                    </div>
                  </div>
                    <Switch checked={settings.requireEmailVerification} onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="branding">
            <GlassCard delay={0.1}>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{isIt ? 'Personalizzazione' : 'Customization'}</h3>
                <p className="text-sm text-muted-foreground mb-4">{isIt ? 'Personalizza l\'aspetto della tua pagina istituzionale' : 'Customize the look of your institution page'}</p>
                <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">{isIt ? 'Colore Primario' : 'Primary color'}</Label>
                    <div className="flex gap-2">
                      <Input id="primaryColor" type="color" value={settings.primaryColor} onChange={(e) => updateSetting('primaryColor', e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={settings.primaryColor} onChange={(e) => updateSetting('primaryColor', e.target.value)} className={`flex-1 ${fieldErrors.primaryColor ? 'border-red-500' : ''}`} />
                    </div>
                    {fieldErrors.primaryColor && <p className="text-sm text-red-500 mt-1">{fieldErrors.primaryColor}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">{isIt ? 'Colore Accento' : 'Accent color'}</Label>
                    <div className="flex gap-2">
                      <Input id="accentColor" type="color" value={settings.accentColor} onChange={(e) => updateSetting('accentColor', e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={settings.accentColor} onChange={(e) => updateSetting('accentColor', e.target.value)} className={`flex-1 ${fieldErrors.accentColor ? 'border-red-500' : ''}`} />
                    </div>
                    {fieldErrors.accentColor && <p className="text-sm text-red-500 mt-1">{fieldErrors.accentColor}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customDomain">{isIt ? 'Dominio Personalizzato' : 'Custom domain'}</Label>
                  <div className="flex gap-2">
                    <Input id="customDomain" value={settings.customDomain} onChange={(e) => updateSetting('customDomain', e.target.value)} placeholder="careers.polimi.it" />
                    <Button variant="outline">
                      <Code className="h-4 w-4 mr-2" />
                      {isIt ? 'Verifica' : 'Verify'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{isIt ? 'Richiede piano Premium Embed. Contatta il supporto per configurare.' : 'Requires the Premium Embed plan. Contact support to configure.'}</p>
                </div>
                <div className="border rounded-lg p-6 mt-6">
                  <h4 className="font-medium text-foreground mb-4">{isIt ? 'Anteprima' : 'Preview'}</h4>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: settings.primaryColor + '10' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: settings.primaryColor }}>
                        {(settings.shortName || settings.name || '').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: settings.primaryColor }}>{settings.name || (isIt ? 'Nome Istituzione' : 'Institution name')}</h3>
                        <p className="text-sm text-muted-foreground">{settings.city || (isIt ? 'Città' : 'City')}</p>
                      </div>
                    </div>
                    <Button size="sm" style={{ backgroundColor: settings.accentColor }} className="text-white">
                      {isIt ? 'Scopri di più' : 'Learn more'}
                    </Button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        <AccountDangerZone />
      </div>
    </div>
  )
}
