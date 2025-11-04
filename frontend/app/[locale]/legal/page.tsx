'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState('privacy')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
            <FileText className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & Privacy
            </h1>
            <p className="text-xl text-white">
              Your privacy and trust are our top priorities
            </p>
            </motion.div>
          </div>
        </section>

        {/* Legal Content */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="privacy" className="text-lg">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </TabsTrigger>
                <TabsTrigger value="terms" className="text-lg">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </TabsTrigger>
              </TabsList>

              <TabsContent value="privacy">
                <Card>
                  <CardContent className="p-8 prose prose-blue max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
                    <p className="text-sm text-gray-600 mb-6">Last updated: October 2025</p>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
                      <p className="text-gray-700 mb-4">
                        We collect information that you provide directly to us, including:
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Account information (name, email, university affiliation)</li>
                        <li>Academic records (grades, courses, projects)</li>
                        <li>Professional information (skills, experience, achievements)</li>
                        <li>Profile data and uploaded content</li>
                        <li>Communications with us and other users</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
                      <p className="text-gray-700 mb-4">
                        We use the information we collect to:
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Connect students with educational and career opportunities</li>
                        <li>Verify academic credentials and achievements</li>
                        <li>Personalize your experience and provide recommendations</li>
                        <li>Communicate with you about services, updates, and opportunities</li>
                        <li>Ensure platform security and prevent fraud</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h3>
                      <p className="text-gray-700 mb-4">
                        We share information in the following circumstances:
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li><strong>With Universities:</strong> To verify academic credentials</li>
                        <li><strong>With Recruiters:</strong> Based on your privacy settings and consent</li>
                        <li><strong>With Service Providers:</strong> Who help us operate our platform</li>
                        <li><strong>For Legal Reasons:</strong> When required by law or to protect rights</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Your Privacy Controls</h3>
                      <p className="text-gray-700 mb-4">
                        You have control over your information:
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Choose what information to share publicly</li>
                        <li>Control who can view your profile and projects</li>
                        <li>Access, update, or delete your information</li>
                        <li>Opt out of marketing communications</li>
                        <li>Export your data at any time</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h3>
                      <p className="text-gray-700">
                        We implement industry-standard security measures to protect your information, including encryption,
                        secure servers, and regular security audits. However, no method of transmission over the internet
                        is 100% secure.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">6. GDPR Compliance</h3>
                      <p className="text-gray-700">
                        For users in the European Union, we comply with GDPR requirements. You have the right to access,
                        rectify, erase, restrict processing, data portability, and object to processing of your personal data.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h3>
                      <p className="text-gray-700">
                        For questions about this Privacy Policy, please contact us at{' '}
                        <a href="mailto:privacy@intransparency.com" className="text-blue-600 hover:underline">
                          privacy@intransparency.com
                        </a>
                      </p>
                    </section>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terms">
                <Card>
                  <CardContent className="p-8 prose prose-blue max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>
                    <p className="text-sm text-gray-600 mb-6">Last updated: October 2025</p>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
                      <p className="text-gray-700">
                        By accessing or using InTransparency, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">2. User Accounts</h3>
                      <p className="text-gray-700 mb-4">
                        When creating an account, you agree to:
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Notify us immediately of any unauthorized access</li>
                        <li>Be responsible for all activities under your account</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Content Guidelines</h3>
                      <p className="text-gray-700 mb-4">
                        You are responsible for the content you post. You agree not to:
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Post false, misleading, or fraudulent information</li>
                        <li>Upload copyrighted material without permission</li>
                        <li>Share content that is offensive, harmful, or illegal</li>
                        <li>Impersonate others or misrepresent your credentials</li>
                        <li>Engage in spam, harassment, or malicious activities</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Academic Integrity</h3>
                      <p className="text-gray-700">
                        InTransparency is built on trust and transparency. All academic credentials, grades, and
                        projects must be genuine. Falsifying academic records is grounds for immediate account termination
                        and may be reported to relevant institutions.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h3>
                      <p className="text-gray-700">
                        You retain ownership of content you upload. By posting content, you grant InTransparency
                        a license to display, distribute, and promote your work on the platform. The InTransparency
                        platform, logo, and features are our intellectual property.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Paid Services</h3>
                      <p className="text-gray-700">
                        Some features require paid subscriptions. Payments are non-refundable except as required by law.
                        We reserve the right to change pricing with 30 days notice to active subscribers.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Termination</h3>
                      <p className="text-gray-700">
                        We may suspend or terminate your account for violations of these terms, illegal activity,
                        or at our discretion with notice. You may close your account at any time.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h3>
                      <p className="text-gray-700">
                        InTransparency is provided "as is" without warranties. We are not liable for indirect,
                        incidental, or consequential damages arising from your use of the platform.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h3>
                      <p className="text-gray-700">
                        We may update these terms from time to time. We will notify users of significant changes
                        via email or platform notification.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h3>
                      <p className="text-gray-700">
                        Questions about these Terms? Contact us at{' '}
                        <a href="mailto:legal@intransparency.com" className="text-blue-600 hover:underline">
                          legal@intransparency.com
                        </a>
                      </p>
                    </section>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
