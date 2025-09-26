import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Cookie, Shield, Settings, Info } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-amber-100 mb-8">
              Understanding how we use cookies to enhance your experience on InTransparency
            </p>
          </div>
        </section>

        {/* Cookie Policy Content */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  <strong>Last Updated:</strong> March 15, 2024
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This Cookie Policy explains how InTransparency ("we", "us", or "our") uses cookies and similar tracking technologies on our website and platform. By using our services, you consent to the use of cookies as described in this policy.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Cookie className="h-6 w-6 mr-2 text-amber-600" />
                    What Are Cookies?
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better user experience by remembering your preferences, keeping you logged in, and analyzing how you use our platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Badge className="bg-green-600 mr-3">Essential</Badge>
                          Strictly Necessary Cookies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">
                          These cookies are essential for the website to function properly. They enable basic features like page navigation, access to secure areas, and authentication.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Session management</li>
                          <li>Authentication tokens</li>
                          <li>Security features</li>
                          <li>Load balancing</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Badge className="bg-blue-600 mr-3">Functional</Badge>
                          Preference Cookies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">
                          These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Language preferences</li>
                          <li>Theme settings</li>
                          <li>Dashboard customization</li>
                          <li>Notification preferences</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Badge className="bg-purple-600 mr-3">Analytics</Badge>
                          Performance Cookies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">
                          These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Google Analytics</li>
                          <li>Page performance monitoring</li>
                          <li>User behavior analysis</li>
                          <li>Error tracking</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Badge className="bg-orange-600 mr-3">Marketing</Badge>
                          Targeting Cookies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">
                          These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Personalized content</li>
                          <li>Advertising optimization</li>
                          <li>Social media integration</li>
                          <li>Conversion tracking</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Settings className="h-6 w-6 mr-2 text-blue-600" />
                    Managing Your Cookie Preferences
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      You can control and manage cookies in several ways:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through their settings</li>
                      <li><strong>Cookie Banner:</strong> Use our cookie consent banner to customize your preferences</li>
                      <li><strong>Account Settings:</strong> Manage certain preferences through your InTransparency account</li>
                      <li><strong>Opt-out Tools:</strong> Use industry opt-out tools for advertising cookies</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may also use third-party services that set their own cookies. These include:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                    <li><strong>LinkedIn:</strong> For professional network integration</li>
                    <li><strong>GitHub:</strong> For code repository integration</li>
                    <li><strong>Stripe:</strong> For payment processing</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about this Cookie Policy, please contact us at:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <p className="text-gray-700">
                      <strong>Email:</strong> privacy@intransparency.com<br/>
                      <strong>Address:</strong> InTransparency, Via Innovation 1, 20121 Milan, Italy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Preferences CTA */}
        <section className="py-16 bg-amber-50">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Manage Your Cookie Preferences
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              You can customize your cookie settings at any time through your browser or account preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Settings className="h-5 w-5 mr-2" />
                Cookie Settings
              </Button>
              <Button size="lg" variant="outline">
                <Info className="h-5 w-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}