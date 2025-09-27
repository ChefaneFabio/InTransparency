import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink, Calendar, FileText, Users, Award } from 'lucide-react'

const pressReleases = [
  {
    date: '2024-03-15',
    title: 'InTransparency Raises €2M Seed Round to Transform Student Career Outcomes',
    excerpt: 'Leading European VCs back innovative AI-powered platform connecting students with career opportunities',
    link: '#',
    featured: true
  },
  {
    date: '2024-02-28',
    title: 'StartUp Bergamo 2025/2026 - InTransparency Selected as Featured Innovation',
    excerpt: 'Platform chosen to represent next-generation career technology at premier Italian startup event',
    link: '#',
    featured: false
  },
  {
    date: '2024-01-20',
    title: 'University Partnership Program Launches with 50+ Italian Institutions',
    excerpt: 'Major milestone as InTransparency integrates with university systems across Italy',
    link: '#',
    featured: false
  }
]

const mediaAssets = [
  {
    name: 'Company Logo Pack',
    description: 'High-resolution logos in various formats',
    type: 'ZIP',
    size: '2.4 MB'
  },
  {
    name: 'Executive Photos',
    description: 'Professional headshots of leadership team',
    type: 'ZIP',
    size: '8.1 MB'
  },
  {
    name: 'Product Screenshots',
    description: 'Platform interface and feature screenshots',
    type: 'ZIP',
    size: '15.3 MB'
  },
  {
    name: 'Brand Guidelines',
    description: 'Complete brand identity guidelines',
    type: 'PDF',
    size: '1.8 MB'
  }
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Latest news, press releases, and media resources about InTransparency
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                <FileText className="h-5 w-5 mr-2" />
                Download Media Kit
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Users className="h-5 w-5 mr-2" />
                Contact Press Team
              </Button>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Press Releases
              </h2>
              <p className="text-lg text-gray-600">
                Stay updated with our latest announcements and milestones
              </p>
            </div>

            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <Card key={index} className={`hover:shadow-lg transition-shadow ${release.featured ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(release.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Badge>
                          {release.featured && (
                            <Badge className="bg-blue-600">
                              <Award className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {release.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {release.excerpt}
                        </p>
                      </div>
                      <div className="md:ml-6">
                        <Button variant="outline">
                          Read More
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Media Assets */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Media Assets
              </h2>
              <p className="text-lg text-gray-600">
                Download high-quality assets for your articles and presentations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaAssets.map((asset, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{asset.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                      <span>{asset.type}</span>
                      <span>{asset.size}</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Press Contact */}
        <section className="py-16 bg-slate-100">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Press Inquiries
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              For press inquiries, interviews, or additional information, please contact our media team.
            </p>
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="space-y-4">
                <div>
                  <strong>Press Contact:</strong> media@intransparency.com
                </div>
                <div>
                  <strong>Response Time:</strong> Within 24 hours
                </div>
                <div>
                  <strong>Languages:</strong> English, Italian
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