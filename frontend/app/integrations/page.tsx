import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, Gitlab, Figma, Slack, Linkedin, Database, Cloud, Zap } from 'lucide-react'

const integrations = [
  {
    name: 'GitHub',
    description: 'Connect your repositories for automatic project analysis and code quality assessment',
    icon: Github,
    category: 'Version Control',
    status: 'Live',
    features: ['Auto-sync repositories', 'Code analysis', 'Contribution tracking']
  },
  {
    name: 'GitLab',
    description: 'Sync projects from GitLab for comprehensive portfolio building',
    icon: Gitlab,
    category: 'Version Control',
    status: 'Live',
    features: ['Project import', 'CI/CD integration', 'Issue tracking']
  },
  {
    name: 'LinkedIn',
    description: 'Import professional information and expand your network',
    icon: Linkedin,
    category: 'Professional Network',
    status: 'Live',
    features: ['Profile sync', 'Connection import', 'Job matching']
  },
  {
    name: 'Slack',
    description: 'Get notifications and updates directly in your workspace',
    icon: Slack,
    category: 'Communication',
    status: 'Beta',
    features: ['Real-time notifications', 'Team updates', 'Match alerts']
  },
  {
    name: 'Figma',
    description: 'Showcase your design projects and collaborate with teams',
    icon: Figma,
    category: 'Design',
    status: 'Coming Soon',
    features: ['Design portfolio', 'Project sharing', 'Collaboration tracking']
  },
  {
    name: 'University LMS',
    description: 'Connect with learning management systems for academic integration',
    icon: Database,
    category: 'Education',
    status: 'Live',
    features: ['Grade sync', 'Course tracking', 'Transcript import']
  }
]

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Integrations
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Connect InTransparency with your favorite tools and platforms to streamline your workflow
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Zap className="h-5 w-5 mr-2" />
                Browse All Integrations
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Cloud className="h-5 w-5 mr-2" />
                Request Integration
              </Button>
            </div>
          </div>
        </section>

        {/* Integrations Grid */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Available Integrations
              </h2>
              <p className="text-lg text-gray-600">
                Seamlessly connect with the tools you already use
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {integrations.map((integration, index) => {
                const Icon = integration.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <Badge
                          variant={
                            integration.status === 'Live' ? 'default' :
                            integration.status === 'Beta' ? 'secondary' : 'outline'
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <CardTitle>{integration.name}</CardTitle>
                      <Badge variant="outline" className="w-fit">
                        {integration.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{integration.description}</p>

                      <ul className="space-y-2 mb-6">
                        {integration.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full"
                        disabled={integration.status === 'Coming Soon'}
                      >
                        {integration.status === 'Coming Soon' ? 'Coming Soon' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Custom Integration CTA */}
        <section className="py-16 bg-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need a Custom Integration?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Don't see your favorite tool? We can build custom integrations for enterprise customers.
            </p>
            <Button size="lg">
              Contact Our Integration Team
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}