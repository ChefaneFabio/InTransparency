import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Eye, Download, Trash2, Edit, Lock, FileText, CheckCircle } from 'lucide-react'

const gdprRights = [
  {
    title: 'Right to Information',
    icon: Eye,
    description: 'You have the right to know what personal data we collect and how we use it.',
    actions: ['View our Privacy Policy', 'Request data collection overview']
  },
  {
    title: 'Right of Access',
    icon: Download,
    description: 'You can request a copy of all personal data we hold about you.',
    actions: ['Download your data', 'Request data report']
  },
  {
    title: 'Right to Rectification',
    icon: Edit,
    description: 'You can correct any inaccurate or incomplete personal data.',
    actions: ['Update profile information', 'Correct data errors']
  },
  {
    title: 'Right to Erasure',
    icon: Trash2,
    description: 'You can request deletion of your personal data under certain circumstances.',
    actions: ['Delete account', 'Remove specific data']
  },
  {
    title: 'Right to Data Portability',
    icon: FileText,
    description: 'You can receive your data in a machine-readable format or transfer it.',
    actions: ['Export data', 'Transfer to another service']
  },
  {
    title: 'Right to Object',
    icon: Shield,
    description: 'You can object to certain types of processing of your personal data.',
    actions: ['Opt-out of marketing', 'Object to profiling']
  }
]

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              GDPR Compliance
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Your data protection rights under the General Data Protection Regulation
            </p>

            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-green-600 text-lg px-6 py-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                GDPR Compliant
              </Badge>
            </div>
          </div>
        </section>

        {/* GDPR Overview */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Data Protection Rights
              </h2>
              <p className="text-lg text-gray-600">
                InTransparency is committed to protecting your privacy and ensuring compliance with GDPR
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gdprRights.map((right, index) => {
                const Icon = right.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{right.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{right.description}</p>
                      <ul className="space-y-2">
                        {right.actions.map((action, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3" />
                            {action}
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

        {/* Data Processing Information */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How We Process Your Data
              </h2>
              <p className="text-lg text-gray-600">
                Transparency in our data processing activities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-6 w-6 mr-2 text-green-600" />
                    Legal Basis for Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li><strong>Consent:</strong> For marketing communications and optional features</li>
                    <li><strong>Contract:</strong> To provide our services and fulfill our obligations</li>
                    <li><strong>Legitimate Interest:</strong> To improve our platform and prevent fraud</li>
                    <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-blue-600" />
                    Data Protection Measures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li><strong>Encryption:</strong> All data encrypted in transit and at rest</li>
                    <li><strong>Access Controls:</strong> Strict access controls and authentication</li>
                    <li><strong>Regular Audits:</strong> Continuous security monitoring and audits</li>
                    <li><strong>Data Minimization:</strong> We only collect necessary data</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="py-16 bg-slate-100">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Retention Policy</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Data</h3>
                  <p className="text-gray-700">
                    We retain your account data for as long as your account remains active. After account deletion,
                    most data is removed within 30 days, with some data retained for legal compliance (up to 7 years).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Data</h3>
                  <p className="text-gray-700">
                    Project portfolios and related data are retained while your account is active.
                    You can delete individual projects at any time.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Data</h3>
                  <p className="text-gray-700">
                    Anonymized analytics data may be retained for up to 26 months to improve our services.
                    This data cannot be linked back to individual users.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Data</h3>
                  <p className="text-gray-700">
                    Marketing communication preferences and history are retained until you unsubscribe
                    or request deletion, plus any legally required retention period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* International Transfers */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                International Data Transfers
              </h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <p className="text-gray-700 mb-6">
                  InTransparency primarily processes data within the European Union. When data is transferred
                  outside the EU, we ensure adequate protection through:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Adequacy Decisions</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Countries with adequate protection levels</li>
                      <li>• EU Commission approved destinations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Safeguards</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Standard Contractual Clauses (SCCs)</li>
                      <li>• Binding Corporate Rules</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Exercise Rights CTA */}
        <section className="py-16 bg-blue-50">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exercise Your Rights
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              You can exercise your GDPR rights at any time. We typically respond within 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <FileText className="h-5 w-5 mr-2" />
                Submit Data Request
              </Button>
              <Button size="lg" variant="outline">
                <Download className="h-5 w-5 mr-2" />
                Download Your Data
              </Button>
            </div>

            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Data Protection Officer Contact</h3>
              <p className="text-gray-700">
                <strong>Email:</strong> dpo@intransparency.com<br/>
                <strong>Address:</strong> DPO, InTransparency, Via Innovation 1, 20121 Milan, Italy
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}