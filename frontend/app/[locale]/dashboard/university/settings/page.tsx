'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  Lock
} from 'lucide-react'

interface UniversitySettings {
  // Profile
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

  // Notifications
  emailNewStudent: boolean
  emailNewPlacement: boolean
  emailWeeklyReport: boolean
  emailCompanyInterest: boolean

  // Privacy
  showPlacementStats: boolean
  showSalaryData: boolean
  allowStudentDirectory: boolean
  requireStudentApproval: boolean

  // Branding
  primaryColor: string
  accentColor: string
  customDomain: string
}

export default function UniversitySettingsPage() {
  const [settings, setSettings] = useState<UniversitySettings>({
    name: 'Politecnico di Milano',
    shortName: 'PoliMi',
    description: 'Il Politecnico di Milano è la più grande università tecnica in Italia, con oltre 45.000 studenti.',
    website: 'https://www.polimi.it',
    email: 'career.services@polimi.it',
    phone: '+39 02 2399 1',
    address: 'Piazza Leonardo da Vinci, 32',
    city: 'Milano',
    region: 'Lombardia',
    logo: '',
    emailNewStudent: true,
    emailNewPlacement: true,
    emailWeeklyReport: true,
    emailCompanyInterest: false,
    showPlacementStats: true,
    showSalaryData: false,
    allowStudentDirectory: true,
    requireStudentApproval: true,
    primaryColor: '#004B93',
    accentColor: '#FF6B00',
    customDomain: ''
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Impostazioni</h1>
            <p className="text-gray-600">Gestisci le impostazioni della tua istituzione</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>Salvataggio...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salva Modifiche
              </>
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

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Istituzione</CardTitle>
                <CardDescription>
                  Gestisci le informazioni pubbliche della tua università
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo */}
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
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">Nome Breve</Label>
                    <Input
                      id="shortName"
                      value={settings.shortName}
                      onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Sito Web</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        value={settings.website}
                        onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Città</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="city"
                        value={settings.city}
                        onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferenze Notifiche</CardTitle>
                <CardDescription>
                  Scegli quali notifiche ricevere via email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Nuovo Studente Iscritto</Label>
                    <p className="text-sm text-gray-600">Ricevi una notifica quando uno studente si registra</p>
                  </div>
                  <Switch
                    checked={settings.emailNewStudent}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNewStudent: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Nuovo Placement</Label>
                    <p className="text-sm text-gray-600">Notifica quando uno studente trova lavoro</p>
                  </div>
                  <Switch
                    checked={settings.emailNewPlacement}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNewPlacement: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Report Settimanale</Label>
                    <p className="text-sm text-gray-600">Riepilogo settimanale delle attività</p>
                  </div>
                  <Switch
                    checked={settings.emailWeeklyReport}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailWeeklyReport: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Interesse Aziende</Label>
                    <p className="text-sm text-gray-600">Notifica quando un'azienda mostra interesse</p>
                  </div>
                  <Switch
                    checked={settings.emailCompanyInterest}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailCompanyInterest: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Impostazioni Privacy</CardTitle>
                <CardDescription>
                  Controlla quali dati sono visibili pubblicamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="font-medium">Mostra Statistiche Placement</Label>
                      <p className="text-sm text-gray-600">Rendi visibili le statistiche di placement alle aziende</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.showPlacementStats}
                    onCheckedChange={(checked) => setSettings({ ...settings, showPlacementStats: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="font-medium">Mostra Dati Stipendi</Label>
                      <p className="text-sm text-gray-600">Rendi visibili i range salariali medi</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.showSalaryData}
                    onCheckedChange={(checked) => setSettings({ ...settings, showSalaryData: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="font-medium">Directory Studenti</Label>
                      <p className="text-sm text-gray-600">Permetti alle aziende di cercare studenti</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowStudentDirectory}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowStudentDirectory: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="font-medium">Approvazione Studenti</Label>
                      <p className="text-sm text-gray-600">Richiedi approvazione prima che studenti siano visibili</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.requireStudentApproval}
                    onCheckedChange={(checked) => setSettings({ ...settings, requireStudentApproval: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Personalizzazione</CardTitle>
                <CardDescription>
                  Personalizza l'aspetto della tua pagina istituzionale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Colore Primario</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Colore Accento</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings.accentColor}
                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customDomain">Dominio Personalizzato</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customDomain"
                      value={settings.customDomain}
                      onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                      placeholder="careers.polimi.it"
                    />
                    <Button variant="outline">
                      <Code className="h-4 w-4 mr-2" />
                      Verifica
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Richiede piano Premium Embed. Contatta il supporto per configurare.
                  </p>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-6 mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Anteprima</h4>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: settings.primaryColor + '10' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        {settings.shortName.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: settings.primaryColor }}>
                          {settings.name}
                        </h3>
                        <p className="text-sm text-gray-600">{settings.city}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      style={{ backgroundColor: settings.accentColor }}
                      className="text-white"
                    >
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
