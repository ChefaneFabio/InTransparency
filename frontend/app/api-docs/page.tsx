import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code, Book, Download, ExternalLink, Play } from 'lucide-react'

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              API Documentation
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Integrate InTransparency's powerful features into your applications with our comprehensive REST API
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Play className="h-5 w-5 mr-2" />
                Quick Start Guide
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Download className="h-5 w-5 mr-2" />
                Download OpenAPI Spec
              </Button>
            </div>
          </div>
        </section>

        {/* API Overview */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-6 w-6 mr-2 text-blue-600" />
                    REST API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Full REST API with JSON responses, supporting all major operations for students, recruiters, and universities.</p>
                  <Badge>v2.1</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="h-6 w-6 mr-2 text-green-600" />
                    GraphQL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Flexible GraphQL endpoint for complex queries and real-time subscriptions.</p>
                  <Badge variant="secondary">Beta</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ExternalLink className="h-6 w-6 mr-2 text-purple-600" />
                    Webhooks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Real-time notifications for important events like new matches, applications, and more.</p>
                  <Badge>Stable</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">Getting Started</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">1. Authentication</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div>curl -H "Authorization: Bearer YOUR_API_KEY" \</div>
                    <div>     "https://api.intransparency.com/v2/profile"</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">2. Make Your First Request</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div>GET /api/v2/students/search</div>
                    <div>POST /api/v2/projects/analyze</div>
                    <div>PUT /api/v2/profile/update</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">3. Handle Responses</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div>{`{`}</div>
                    <div>  "status": "success",</div>
                    <div>  "data": {"{...}"},</div>
                    <div>  "pagination": {"{...}"}</div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}