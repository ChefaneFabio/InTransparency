'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Link } from '@/navigation'
import { ArrowLeft, Building2, Globe, MapPin, Users } from 'lucide-react'

export default function RecruiterSettingsPage() {
  const { data: session } = useSession()
  const user = session?.user

  const [companyData, setCompanyData] = useState({
    companyName: '',
    website: '',
    industry: '',
    size: '',
    location: '',
    description: ''
  })

  const handleSave = async () => {
    // TODO: Implement save functionality
    alert('Settings saved!')
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
          <h1 className="text-2xl font-semibold text-gray-900">Company Settings</h1>
          <p className="text-gray-600">Manage your company profile</p>
        </div>
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Profile
          </CardTitle>
          <CardDescription>
            This information will be visible to candidates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyData.companyName}
                onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                placeholder="Your Company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={companyData.industry}
                onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                placeholder="Technology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Input
                id="size"
                value={companyData.size}
                onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                placeholder="50-200 employees"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={companyData.location}
              onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
              placeholder="Milano, Italy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={companyData.description}
              onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
              placeholder="Tell candidates about your company..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
