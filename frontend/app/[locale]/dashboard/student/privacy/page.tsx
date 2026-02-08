'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, Eye, EyeOff, Lock, Globe, UserX, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState({
    profilePublic: true,
    showLocation: true,
    showEmail: false,
    showPhone: false,
    allowMessagesFrom: 'verified',
    showLastActive: true,
    showProjects: 'all',
    anonymousBrowsing: false,
    indexInSearchEngines: true,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [blockedCompanies, setBlockedCompanies] = useState<string[]>([])
  const [newBlockedCompany, setNewBlockedCompany] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/dashboard/student/profile')
        if (!res.ok) throw new Error('Failed to load settings')
        const data = await res.json()
        const u = data.user
        setSettings({
          profilePublic: u.profilePublic ?? true,
          showLocation: u.showLocation ?? true,
          showEmail: u.showEmail ?? false,
          showPhone: u.showPhone ?? false,
          allowMessagesFrom: u.allowMessagesFrom ?? 'verified',
          showLastActive: u.showLastActive ?? true,
          showProjects: u.showProjects ?? 'all',
          anonymousBrowsing: u.anonymousBrowsing ?? false,
          indexInSearchEngines: u.indexInSearchEngines ?? true,
        })
        setBlockedCompanies(u.blockedCompanies ?? [])
      } catch (error) {
        console.error('Failed to load privacy settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage(null)
    try {
      const res = await fetch('/api/dashboard/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          blockedCompanies,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaveMessage({ type: 'success', text: 'Privacy settings saved successfully!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const addBlockedCompany = () => {
    if (newBlockedCompany.trim() && !blockedCompanies.includes(newBlockedCompany.trim())) {
      setBlockedCompanies([...blockedCompanies, newBlockedCompany.trim()])
      setNewBlockedCompany('')
    }
  }

  const removeBlockedCompany = (company: string) => {
    setBlockedCompanies(blockedCompanies.filter(c => c !== company))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-16">
          <div className="container max-w-4xl space-y-6">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-5 w-96" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              Privacy & Visibility Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Control who can see your profile and what information is visible to recruiters.
            </p>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <Alert className={`mb-6 ${saveMessage.type === 'success' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
              {saveMessage.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {saveMessage.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Alert */}
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Your privacy is important</AlertTitle>
            <AlertDescription>
              These settings help you control your visibility on InTransparency. Changes take effect immediately.
            </AlertDescription>
          </Alert>

          {/* Profile Visibility */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Profile Visibility
              </CardTitle>
              <CardDescription>
                Control who can see your profile and projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profilePublic" className="text-base font-medium">
                    Make profile public
                  </Label>
                  <p className="text-sm text-gray-600">
                    Allow your profile to be visible to recruiters and in search results
                  </p>
                </div>
                <Switch
                  id="profilePublic"
                  checked={settings.profilePublic}
                  onCheckedChange={(checked) => setSettings({ ...settings, profilePublic: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="indexInSearchEngines" className="text-base font-medium">
                    Allow indexing by search engines
                  </Label>
                  <p className="text-sm text-gray-600">
                    Let Google and other search engines index your public portfolio
                  </p>
                </div>
                <Switch
                  id="indexInSearchEngines"
                  checked={settings.indexInSearchEngines}
                  onCheckedChange={(checked) => setSettings({ ...settings, indexInSearchEngines: checked })}
                  disabled={!settings.profilePublic}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base font-medium">Project visibility</Label>
                <div className="space-y-2">
                  {['all', 'featured', 'none'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`projects-${option}`}
                        name="projects"
                        value={option}
                        checked={settings.showProjects === option}
                        onChange={(e) => setSettings({ ...settings, showProjects: e.target.value })}
                        className="h-4 w-4 text-blue-600"
                      />
                      <Label htmlFor={`projects-${option}`} className="font-normal cursor-pointer">
                        {option === 'all' && 'Show all projects'}
                        {option === 'featured' && 'Show only featured projects'}
                        {option === 'none' && 'Hide all projects'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Personal Information Visibility
              </CardTitle>
              <CardDescription>
                Choose what personal information is visible on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showLocation" className="text-base font-medium">
                    Show location
                  </Label>
                  <p className="text-sm text-gray-600">
                    Display your city/state on your profile
                  </p>
                </div>
                <Switch
                  id="showLocation"
                  checked={settings.showLocation}
                  onCheckedChange={(checked) => setSettings({ ...settings, showLocation: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showEmail" className="text-base font-medium">
                    Show email address
                  </Label>
                  <p className="text-sm text-gray-600">
                    Allow recruiters to see your email address
                  </p>
                </div>
                <Switch
                  id="showEmail"
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => setSettings({ ...settings, showEmail: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showPhone" className="text-base font-medium">
                    Show phone number
                  </Label>
                  <p className="text-sm text-gray-600">
                    Allow recruiters to see your phone number
                  </p>
                </div>
                <Switch
                  id="showPhone"
                  checked={settings.showPhone}
                  onCheckedChange={(checked) => setSettings({ ...settings, showPhone: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Activity & Analytics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-blue-600" />
                Activity & Analytics
              </CardTitle>
              <CardDescription>
                Control visibility of your activity and profile analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showLastActive" className="text-base font-medium">
                    Show when you were last active
                  </Label>
                  <p className="text-sm text-gray-600">
                    Let recruiters see when you last logged in
                  </p>
                </div>
                <Switch
                  id="showLastActive"
                  checked={settings.showLastActive}
                  onCheckedChange={(checked) => setSettings({ ...settings, showLastActive: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymousBrowsing" className="text-base font-medium">
                    Anonymous browsing
                  </Label>
                  <p className="text-sm text-gray-600">
                    Browse job posts and company profiles without leaving a trace
                  </p>
                </div>
                <Switch
                  id="anonymousBrowsing"
                  checked={settings.anonymousBrowsing}
                  onCheckedChange={(checked) => setSettings({ ...settings, anonymousBrowsing: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Messaging Preferences */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                Messaging Preferences
              </CardTitle>
              <CardDescription>
                Control who can send you messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label className="text-base font-medium">Allow messages from</Label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Anyone (all recruiters)' },
                  { value: 'verified', label: 'Verified recruiters only' },
                  { value: 'none', label: 'No one (disable messaging)' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`messages-${option.value}`}
                      name="messages"
                      value={option.value}
                      checked={settings.allowMessagesFrom === option.value}
                      onChange={(e) => setSettings({ ...settings, allowMessagesFrom: e.target.value })}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={`messages-${option.value}`} className="font-normal cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Block Companies */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-blue-600" />
                Block Specific Companies
              </CardTitle>
              <CardDescription>
                Hide your profile from specific companies or recruiters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter company name..."
                  value={newBlockedCompany}
                  onChange={(e) => setNewBlockedCompany(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBlockedCompany()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={addBlockedCompany} variant="outline">
                  Block
                </Button>
              </div>

              {blockedCompanies.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Blocked companies:</Label>
                  {blockedCompanies.map((company) => (
                    <div key={company} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">{company}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlockedCompany(company)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {blockedCompanies.length === 0 && (
                <p className="text-sm text-gray-600 italic">No companies blocked</p>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
