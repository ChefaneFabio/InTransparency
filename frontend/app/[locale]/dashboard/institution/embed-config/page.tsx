'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy, Check, ExternalLink, Settings, Eye } from 'lucide-react'
import InstitutionWidget from '@/components/embed/InstitutionWidget'

export default function EmbedConfigPage() {
  const { data: session } = useSession()
  const institutionId = session?.user?.id || ''
  const institutionName = (session?.user as any)?.company || session?.user?.name || 'Your Institution'

  const [logoUrl, setLogoUrl] = useState('')

  // Widget configuration
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [secondaryColor, setSecondaryColor] = useState('#10b981')
  const [showLogo, setShowLogo] = useState(true)
  const [maxMatches, setMaxMatches] = useState(5)
  const [refreshInterval, setRefreshInterval] = useState(30000)

  // UI state
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [loading, setLoading] = useState(true)

  // Load existing branding on mount
  useEffect(() => {
    if (!institutionId) return
    const loadBranding = async () => {
      try {
        const res = await fetch('/api/institutions/branding')
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.settings) {
            const s = data.settings
            if (s.primaryColor) setPrimaryColor(s.primaryColor)
            if (s.accentColor) setSecondaryColor(s.accentColor)
            if (s.logo) setLogoUrl(s.logo)
          }
        }
      } catch (error) {
        console.error('Failed to load branding:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBranding()
  }, [institutionId])

  const embedUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://intransparency.com'}/embed/${institutionId}?primaryColor=${encodeURIComponent(primaryColor)}&secondaryColor=${encodeURIComponent(secondaryColor)}&showLogo=${showLogo}&maxMatches=${maxMatches}&refreshInterval=${refreshInterval}`

  const embedCode = `<!-- InTransparency Widget -->
<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="no"
  style="border: none; max-width: 400px;"
  title="InTransparency Matches"
></iframe>`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveConfig = async () => {
    setSaveStatus('saving')

    try {
      const response = await fetch('/api/institutions/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandingConfig: {
            primaryColor,
            accentColor: secondaryColor,
            logo: logoUrl,
            showLogo,
            maxMatches,
            refreshInterval
          }
        })
      })

      if (response.ok) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('idle')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      setSaveStatus('idle')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">Embeddable Widget</h1>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Premium Embed
          </Badge>
        </div>
        <p className="text-gray-600">
          Customize and embed the InTransparency widget on your website to drive 40% more student sign-ups.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Widget Configuration</h2>
            </div>

            <div className="space-y-4">
              {/* Primary Color */}
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <Label htmlFor="secondaryColor">Secondary Color (Gradient)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <Label htmlFor="logoUrl">Institution Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="mt-1"
                />
              </div>

              {/* Show Logo Toggle */}
              <div className="flex items-center gap-2">
                <input
                  id="showLogo"
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label htmlFor="showLogo" className="cursor-pointer">
                  Show Institution Logo
                </Label>
              </div>

              {/* Max Matches */}
              <div>
                <Label htmlFor="maxMatches">Maximum Matches to Display</Label>
                <Input
                  id="maxMatches"
                  type="number"
                  min="1"
                  max="10"
                  value={maxMatches}
                  onChange={(e) => setMaxMatches(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              {/* Refresh Interval */}
              <div>
                <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                <Input
                  id="refreshInterval"
                  type="number"
                  min="10"
                  max="300"
                  value={refreshInterval / 1000}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value) * 1000)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How often to check for new matches (10-300 seconds)
                </p>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveConfig}
                disabled={saveStatus === 'saving'}
                className="w-full"
              >
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'saved' && 'Saved!'}
                {saveStatus === 'idle' && 'Save Configuration'}
              </Button>
            </div>
          </Card>

          {/* Embed Code */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Embed Code</h2>

            <div className="bg-gray-900 rounded-lg p-4 mb-4 relative">
              <pre className="text-green-400 text-xs overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCopyCode}
                className="absolute top-2 right-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Step 1:</strong> Copy the code above</p>
              <p><strong>Step 2:</strong> Paste into your website HTML (career portal, placement page, etc.)</p>
              <p><strong>Step 3:</strong> Widget will appear showing live matches!</p>
            </div>

            <Button variant="outline" className="w-full mt-4" asChild>
              <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Widget in New Tab
              </a>
            </Button>
          </Card>

          {/* ROI Info */}
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Expected Impact</h3>
            <ul className="space-y-1 text-sm text-green-800">
              <li><strong>40% increase</strong> in student sign-ups</li>
              <li><strong>Live updates</strong> create urgency and social proof</li>
              <li><strong>Brand visibility</strong> on your own website</li>
            </ul>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Live Preview</h2>
          </div>

          <div className="sticky top-4">
            <InstitutionWidget
              institutionId={institutionId}
              institutionName={institutionName}
              logoUrl={logoUrl || undefined}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              showLogo={showLogo}
              maxMatches={maxMatches}
              refreshInterval={refreshInterval}
            />

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Change colors above to match your institution branding.
                The widget updates in real-time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
