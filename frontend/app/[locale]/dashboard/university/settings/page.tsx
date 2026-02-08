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
  Eye,
  Lock,
  Loader2
} from 'lucide-react'

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
  const [settings, setSettings] = useState<UniversitySettingsData>({
    name: '', shortName: '', description: '', website: '', email: '', phone: '',
    address: '', city: '', region: '', logo: '',
    notifyNewStudents: true, notifyProjectSubmissions: true, notifyRecruiterActivity: true, notifyPlacements: true,
    showInDirectory: true, allowStudentDiscovery: true, shareAnalytics: false, requireEmailVerification: false,
    primaryColor: '#004B93', accentColor: '#FF6B00', customDomain: ''
  })
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/dashboard/university/settings')
        if (res.ok) {
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
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
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
      setError('Errore durante il salvataggio delle impostazioni')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="container max-w-4xl mx-auto px-4 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Impostazioni</h1>
            <p className="text-gray-600">Gestisci le impostazioni della tua istituzione</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvataggio...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Salva Modifiche</>
            )}
          </Button>
        </div>

        {saveSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Impostazioni salvate con successo!
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
              Profilo
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifiche
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
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Istituzione</CardTitle>
                <CardDescription>Gestisci le informazioni pubbliche della tua università</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Building2 className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Carica Logo
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG fino a 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">Nome Breve</Label>
                    <Input id="shortName" value={settings.shortName} onChange={(e) => setSettings({ ...settings, shortName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea id="description" value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Sito Web</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="website" value={settings.website} onChange={(e) => setSettings({ ...settings, website: e.target.value })} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="email" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="pl-10" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="phone" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Città</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="city" value={settings.city} onChange={(e) => setSettings({ ...settings, city: e.target.value })} className="pl-10" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input id="address" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferenze Notifiche</CardTitle>
                <CardDescription>Scegli quali notifiche ricevere via email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Nuovo Studente Iscritto</Label>
                    <p className="text-sm text-gray-600">Ricevi una notifica quando uno studente si registra</p>
                  </div>
                  <Switch checked={settings.notifyNewStudents} onCheckedChange={(checked) => setSettings({ ...settings, notifyNewStudents: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Nuovi Progetti</Label>
                    <p className="text-sm text-gray-600">Notifica quando uno studente carica un progetto</p>
                  </div>
                  <Switch checked={settings.notifyProjectSubmissions} onCheckedChange={(checked) => setSettings({ ...settings, notifyProjectSubmissions: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Attività Recruiter</Label>
                    <p className="text-sm text-gray-600">Notifica quando un recruiter visualizza i tuoi studenti</p>
                  </div>
                  <Switch checked={settings.notifyRecruiterActivity} onCheckedChange={(checked) => setSettings({ ...settings, notifyRecruiterActivity: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Nuovo Placement</Label>
                    <p className="text-sm text-gray-600">Notifica quando uno studente trova lavoro</p>
                  </div>
                  <Switch checked={settings.notifyPlacements} onCheckedChange={(checked) => setSettings({ ...settings, notifyPlacements: checked })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Impostazioni Privacy</CardTitle>
                <CardDescription>Controlla quali dati sono visibili pubblicamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="font-medium">Mostra nella Directory</Label>
                      <p className="text-sm text-gray-600">Rendi visibile la tua istituzione nella directory</p>
                    </div>
                  </div>
                  <Switch checked={settings.showInDirectory} onCheckedChange={(checked) => setSettings({ ...settings, showInDirectory: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="font-medium">Directory Studenti</Label>
                      <p className="text-sm text-gray-600">Permetti alle aziende di cercare studenti</p>
                    </div>
                  </div>
                  <Switch checked={settings.allowStudentDiscovery} onCheckedChange={(checked) => setSettings({ ...settings, allowStudentDiscovery: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="font-medium">Condividi Analytics</Label>
                      <p className="text-sm text-gray-600">Condividi dati aggregati per benchmark</p>
                    </div>
                  </div>
                  <Switch checked={settings.shareAnalytics} onCheckedChange={(checked) => setSettings({ ...settings, shareAnalytics: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="font-medium">Verifica Email Richiesta</Label>
                      <p className="text-sm text-gray-600">Richiedi verifica email istituzionale per gli studenti</p>
                    </div>
                  </div>
                  <Switch checked={settings.requireEmailVerification} onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Personalizzazione</CardTitle>
                <CardDescription>Personalizza l'aspetto della tua pagina istituzionale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Colore Primario</Label>
                    <div className="flex gap-2">
                      <Input id="primaryColor" type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Colore Accento</Label>
                    <div className="flex gap-2">
                      <Input id="accentColor" type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="flex-1" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customDomain">Dominio Personalizzato</Label>
                  <div className="flex gap-2">
                    <Input id="customDomain" value={settings.customDomain} onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })} placeholder="careers.polimi.it" />
                    <Button variant="outline">
                      <Code className="h-4 w-4 mr-2" />
                      Verifica
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Richiede piano Premium Embed. Contatta il supporto per configurare.</p>
                </div>
                <div className="border rounded-lg p-6 mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Anteprima</h4>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: settings.primaryColor + '10' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: settings.primaryColor }}>
                        {(settings.shortName || settings.name || '').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: settings.primaryColor }}>{settings.name || 'Nome Università'}</h3>
                        <p className="text-sm text-gray-600">{settings.city || 'Città'}</p>
                      </div>
                    </div>
                    <Button size="sm" style={{ backgroundColor: settings.accentColor }} className="text-white">
                      Scopri di più
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
