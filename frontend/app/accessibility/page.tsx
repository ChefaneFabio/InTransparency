'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Ear,
  Hand,
  Brain,
  Keyboard,
  Monitor,
  Volume2,
  Type,
  Contrast,
  MousePointer,
  CheckCircle,
  Mail,
  Users
} from 'lucide-react'

export default function AccessibilityPage() {
  const accessibilityFeatures = [
    {
      icon: Eye,
      title: 'Visual Accessibility',
      features: [
        'High contrast color schemes available',
        'Scalable fonts up to 200% zoom',
        'Alternative text for all images',
        'Clear visual indicators for interactive elements',
        'Consistent navigation and layout patterns'
      ]
    },
    {
      icon: Keyboard,
      title: 'Keyboard Navigation',
      features: [
        'Full keyboard navigation support',
        'Visible focus indicators',
        'Skip navigation links',
        'Logical tab order throughout the platform',
        'Keyboard shortcuts for common actions'
      ]
    },
    {
      icon: Ear,
      title: 'Audio & Hearing',
      features: [
        'Captions for all video content',
        'Visual alerts and notifications',
        'Text alternatives for audio content',
        'Adjustable notification preferences',
        'Sign language support in key areas'
      ]
    },
    {
      icon: Brain,
      title: 'Cognitive Accessibility',
      features: [
        'Clear, simple language throughout',
        'Consistent navigation and terminology',
        'Progress indicators for multi-step processes',
        'Error prevention and clear error messages',
        'Customizable interface complexity'
      ]
    },
    {
      icon: Hand,
      title: 'Motor & Mobility',
      features: [
        'Large click targets (minimum 44px)',
        'Drag and drop alternatives',
        'Adjustable time limits',
        'Voice control compatibility',
        'Single-hand operation support'
      ]
    },
    {
      icon: Type,
      title: 'Screen Reader Support',
      features: [
        'ARIA landmarks and labels',
        'Semantic HTML structure',
        'Screen reader tested',
        'Descriptive headings and lists',
        'Live region updates for dynamic content'
      ]
    }
  ]

  const standards = [
    {
      name: 'WCAG 2.1 Level AA',
      status: 'Compliant',
      description: 'Web Content Accessibility Guidelines 2.1 AA compliance'
    },
    {
      name: 'Section 508',
      status: 'Compliant',
      description: 'US Federal accessibility requirements'
    },
    {
      name: 'ADA Compliance',
      status: 'Compliant',
      description: 'Americans with Disabilities Act digital accessibility'
    },
    {
      name: 'EN 301 549',
      status: 'In Progress',
      description: 'European accessibility standard'
    }
  ]

  const tools = [
    {
      category: 'Screen Readers',
      tools: ['NVDA', 'JAWS', 'VoiceOver', 'TalkBack', 'Dragon Naturally Speaking']
    },
    {
      category: 'Browsers',
      tools: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Internet Explorer 11+']
    },
    {
      category: 'Operating Systems',
      tools: ['Windows 10+', 'macOS 10.14+', 'iOS 13+', 'Android 9+', 'Linux (Ubuntu, CentOS)']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Accessibility Statement
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              InTransparency is committed to providing an inclusive digital experience for all users, regardless of ability
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                WCAG 2.1 AA Compliant
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                Continuously Improving
              </Badge>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Commitment to Accessibility
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that everyone should have equal access to educational and career opportunities.
                Our platform is designed to be usable by people of all abilities, and we continuously work
                to improve the accessibility of our services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Inclusive Design</h3>
                  <p className="text-gray-600 text-sm">
                    Built with accessibility in mind from the ground up, not as an afterthought
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Standards Compliance</h3>
                  <p className="text-gray-600 text-sm">
                    Following WCAG 2.1 AA guidelines and other accessibility standards
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Regular Testing</h3>
                  <p className="text-gray-600 text-sm">
                    Ongoing accessibility audits and user testing with assistive technologies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Accessibility Features
              </h2>
              <p className="text-lg text-gray-600">
                We've implemented comprehensive accessibility features across our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accessibilityFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Standards Compliance */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Standards & Compliance
              </h2>
              <p className="text-lg text-gray-600">
                We adhere to internationally recognized accessibility standards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {standards.map((standard, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{standard.name}</h3>
                      <Badge
                        className={
                          standard.status === 'Compliant'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {standard.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{standard.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Compatible Tools */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Compatible Assistive Technologies
              </h2>
              <p className="text-lg text-gray-600">
                Our platform works with a wide range of assistive technologies and devices
              </p>
            </div>

            <div className="space-y-8">
              {tools.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.tools.map((tool, toolIndex) => (
                        <Badge key={toolIndex} variant="outline" className="text-sm">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Keyboard Shortcuts
              </h2>
              <p className="text-lg text-gray-600">
                Use these keyboard shortcuts to navigate more efficiently
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Skip to main content</span>
                        <Badge variant="outline">Alt + S</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Go to dashboard</span>
                        <Badge variant="outline">Alt + D</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Open help menu</span>
                        <Badge variant="outline">Alt + H</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Search</span>
                        <Badge variant="outline">Ctrl + K</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Submit form</span>
                        <Badge variant="outline">Ctrl + Enter</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Cancel/Close</span>
                        <Badge variant="outline">Escape</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Save draft</span>
                        <Badge variant="outline">Ctrl + S</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Open notifications</span>
                        <Badge variant="outline">Alt + N</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feedback & Contact */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Accessibility Feedback
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're always working to improve. If you encounter any accessibility barriers or have suggestions,
              please let us know.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Send accessibility feedback directly to our team
                  </p>
                  <Button variant="outline" className="w-full">
                    accessibility@intransparency.com
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Join Our Testing</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Help us test new features for accessibility
                  </p>
                  <Button variant="outline" className="w-full">
                    Become a Tester
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Response Commitment</h3>
              <p className="text-gray-600 text-sm">
                We aim to respond to all accessibility feedback within 2 business days and
                implement fixes based on severity within 30 days.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}