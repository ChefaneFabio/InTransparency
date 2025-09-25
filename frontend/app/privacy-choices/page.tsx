'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Eye,
  Users,
  MessageSquare,
  Bell,
  Settings,
  CheckCircle,
  X,
  Info,
  Lock,
  Globe,
  Database,
  Mail
} from 'lucide-react'

export default function PrivacyChoicesPage() {
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
    personalization: true,
    communications: true,
    profileVisibility: 'verified-recruiters',
    dataSharing: false,
    locationTracking: false,
    cookiePreferences: 'essential',
    emailNotifications: true,
    browserNotifications: false
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const privacyCategories = [
    {
      id: 'analytics',
      title: 'Analytics & Performance',
      icon: Database,
      description: 'Help us improve our platform by allowing us to collect anonymized usage data',
      details: [
        'Page views and navigation patterns',
        'Feature usage statistics',
        'Performance metrics',
        'Error reporting'
      ],
      impact: 'Helps us identify and fix issues, improve user experience',
      enabled: preferences.analytics,
      required: false
    },
    {
      id: 'marketing',
      title: 'Marketing & Advertising',
      icon: Globe,
      description: 'Receive personalized content and targeted advertisements',
      details: [
        'Personalized content recommendations',
        'Targeted email campaigns',
        'Social media advertising',
        'Partner promotions'
      ],
      impact: 'More relevant content and job opportunities',
      enabled: preferences.marketing,
      required: false
    },
    {
      id: 'personalization',
      title: 'Personalization',
      icon: Users,
      description: 'Customize your experience based on your preferences and behavior',
      details: [
        'Customized dashboard layout',
        'Personalized job recommendations',
        'Skill-based content suggestions',
        'Saved preferences across sessions'
      ],
      impact: 'More relevant and efficient platform experience',
      enabled: preferences.personalization,
      required: false
    },
    {
      id: 'communications',
      title: 'Communications',
      icon: MessageSquare,
      description: 'Manage how we communicate with you about platform updates and opportunities',
      details: [
        'System notifications',
        'Job match alerts',
        'Platform updates',
        'Security notifications'
      ],
      impact: 'Stay informed about important updates and opportunities',
      enabled: preferences.communications,
      required: true
    }
  ]

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Your profile is visible to everyone',
      icon: Globe
    },
    {
      value: 'verified-recruiters',
      label: 'Verified Recruiters Only',
      description: 'Only verified company recruiters can view your profile',
      icon: Shield
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Your profile is not visible in searches',
      icon: Lock
    }
  ]

  const cookieOptions = [
    {
      value: 'essential',
      label: 'Essential Only',
      description: 'Only cookies necessary for the platform to function'
    },
    {
      value: 'functional',
      label: 'Essential + Functional',
      description: 'Essential cookies plus those that improve your experience'
    },
    {
      value: 'all',
      label: 'All Cookies',
      description: 'All cookies including analytics and marketing'
    }
  ]

  const handleToggle = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev]
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSaving(false)
    setSaveMessage('Your privacy preferences have been saved successfully.')

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Choices
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Control how your data is used and customize your privacy settings
            </p>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Your Privacy, Your Control
            </Badge>
          </div>
        </section>

        {/* Privacy Controls */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            {saveMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-800">{saveMessage}</span>
              </div>
            )}

            {/* Data Usage Preferences */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Data Usage Preferences
              </h2>
              <p className="text-gray-600 mb-8">
                Choose how we can use your data to improve your experience. You can change these settings at any time.
              </p>

              <div className="space-y-6">
                {privacyCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Card key={category.id} className={category.required ? 'border-blue-200 bg-blue-50/30' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <Icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                  {category.title}
                                  {category.required && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-gray-600 text-sm">{category.description}</p>
                              </div>
                            </div>

                            <div className="ml-14">
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-900 text-sm mb-2">What this includes:</h4>
                                <ul className="space-y-1">
                                  {category.details.map((detail, index) => (
                                    <li key={index} className="text-gray-600 text-sm flex items-center">
                                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center text-sm text-blue-800">
                                  <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span><strong>Impact:</strong> {category.impact}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="ml-6">
                            <button
                              onClick={() => !category.required && handleToggle(category.id)}
                              disabled={category.required}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                category.enabled
                                  ? 'bg-blue-600'
                                  : 'bg-gray-300'
                              } ${category.required ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  category.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Profile Visibility */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Profile Visibility
              </h2>
              <p className="text-gray-600 mb-6">
                Control who can see your profile and projects in search results.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visibilityOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        preferences.profileVisibility === option.value
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setPreferences(prev => ({ ...prev, profileVisibility: option.value }))}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          preferences.profileVisibility === option.value
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            preferences.profileVisibility === option.value
                              ? 'text-blue-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{option.label}</h3>
                        <p className="text-gray-600 text-sm">{option.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Cookie Preferences */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Cookie Preferences
              </h2>
              <p className="text-gray-600 mb-6">
                Choose what types of cookies you're comfortable with us using.
              </p>

              <div className="space-y-4">
                {cookieOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      preferences.cookiePreferences === option.value
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setPreferences(prev => ({ ...prev, cookiePreferences: option.value }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center ${
                          preferences.cookiePreferences === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {preferences.cookiePreferences === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{option.label}</h3>
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Notification Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                          <p className="text-gray-600 text-sm">Receive updates via email</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle('emailNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-purple-600 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Browser Notifications</h3>
                          <p className="text-gray-600 text-sm">Real-time browser alerts</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle('browserNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          preferences.browserNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.browserNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>
        </section>

        {/* Data Rights */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Your Data Rights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Access Your Data</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Request a copy of all personal data we have about you
                  </p>
                  <Button variant="outline" size="sm">
                    Request Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Correct Your Data</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Update or correct any inaccurate information
                  </p>
                  <Button variant="outline" size="sm">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <X className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Delete Your Data</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Request deletion of your personal data
                  </p>
                  <Button variant="outline" size="sm">
                    Request Deletion
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}