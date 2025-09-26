import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, FileText } from 'lucide-react'

const securityFeatures = [
  {
    title: 'Data Encryption',
    icon: Lock,
    description: 'End-to-end encryption for all data in transit and at rest using AES-256.',
    status: 'Active'
  },
  {
    title: 'Secure Authentication',
    icon: Shield,
    description: 'Multi-factor authentication and OAuth 2.0 integration.',
    status: 'Active'
  },
  {
    title: 'Infrastructure Security',
    icon: Server,
    description: 'AWS cloud infrastructure with SOC 2 Type II compliance.',
    status: 'Active'
  },
  {
    title: 'Privacy Controls',
    icon: Eye,
    description: 'Granular privacy settings and GDPR compliance tools.',
    status: 'Active'
  },
  {
    title: 'Threat Monitoring',
    icon: AlertTriangle,
    description: '24/7 security monitoring and incident response.',
    status: 'Active'
  },
  {
    title: 'Code Security',
    icon: FileText,
    description: 'Secure code analysis and vulnerability scanning.',
    status: 'Active'
  }
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Security & Trust
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Enterprise-grade security protecting your data and privacy
            </p>

            <div className="flex items-center justify-center space-x-6 mb-8">
              <Badge className="bg-green-600 text-lg px-6 py-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                SOC 2 Compliant
              </Badge>
              <Badge className="bg-blue-600 text-lg px-6 py-2">
                <Shield className="h-5 w-5 mr-2" />
                GDPR Ready
              </Badge>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Security Features
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive security measures protecting your information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-slate-600" />
                        </div>
                        <Badge className="bg-green-600">
                          {feature.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Security Standards */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Compliance & Standards
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Industry Standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span>SOC 2 Type II Certified</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span>ISO 27001 Compliant</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span>GDPR Compliant</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span>OWASP Security Guidelines</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span>Regular Security Audits</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span>Penetration Testing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span>Vulnerability Assessments</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span>Employee Security Training</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Incident Response */}
        <section className="py-16 bg-slate-100">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Incident Response
              </h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      24/7 Security Monitoring
                    </h3>
                    <p className="text-gray-700">
                      Our security team monitors the platform around the clock to detect and respond to potential threats.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Incident Response Plan
                    </h3>
                    <p className="text-gray-700">
                      We have a comprehensive incident response plan that includes immediate containment, investigation,
                      and communication procedures.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      User Notification
                    </h3>
                    <p className="text-gray-700">
                      In the unlikely event of a security incident affecting your data, we will notify affected users
                      within 72 hours as required by GDPR.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Security Team */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Security Concerns?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              If you have security concerns or discover a vulnerability, please contact our security team immediately.
            </p>

            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="space-y-4">
                <div>
                  <strong>Security Team:</strong> security@intransparency.com
                </div>
                <div>
                  <strong>Vulnerability Reports:</strong> security@intransparency.com
                </div>
                <div>
                  <strong>Response Time:</strong> Within 4 hours for critical issues
                </div>
              </div>

              <div className="mt-6">
                <Button size="lg">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Report Security Issue
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}