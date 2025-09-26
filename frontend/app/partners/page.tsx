import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building, GraduationCap, Users, Handshake, ArrowRight, Star } from 'lucide-react'

const partnerCategories = [
  {
    title: 'University Partners',
    icon: GraduationCap,
    description: 'Leading academic institutions across Europe',
    count: '50+',
    partners: [
      { name: 'Università Bocconi', location: 'Milan, Italy', tier: 'Premium' },
      { name: 'Politecnico di Milano', location: 'Milan, Italy', tier: 'Premium' },
      { name: 'Università di Bologna', location: 'Bologna, Italy', tier: 'Standard' },
      { name: 'Sapienza Università', location: 'Rome, Italy', tier: 'Standard' }
    ]
  },
  {
    title: 'Corporate Partners',
    icon: Building,
    description: 'Fortune 500 and innovative companies',
    count: '200+',
    partners: [
      { name: 'Microsoft', location: 'Global', tier: 'Enterprise' },
      { name: 'Amazon', location: 'Europe', tier: 'Enterprise' },
      { name: 'Accenture', location: 'Italy', tier: 'Premium' },
      { name: 'Reply SpA', location: 'Italy', tier: 'Premium' }
    ]
  },
  {
    title: 'Technology Partners',
    icon: Users,
    description: 'Integration and platform partners',
    count: '25+',
    partners: [
      { name: 'GitHub', location: 'Global', tier: 'Integration' },
      { name: 'LinkedIn', location: 'Global', tier: 'Integration' },
      { name: 'AWS', location: 'Global', tier: 'Infrastructure' },
      { name: 'OpenAI', location: 'Global', tier: 'AI' }
    ]
  }
]

const benefits = [
  {
    title: 'For Universities',
    items: [
      'Increase graduate employment rates',
      'Enhanced industry connections',
      'Real-time student progress tracking',
      'Custom recruitment pipelines'
    ]
  },
  {
    title: 'For Companies',
    items: [
      'Access to pre-screened talent',
      'Reduced recruitment costs',
      'AI-powered candidate matching',
      'University partnership programs'
    ]
  },
  {
    title: 'For Technology Partners',
    items: [
      'API integration opportunities',
      'Co-marketing initiatives',
      'Revenue sharing programs',
      'Joint product development'
    ]
  }
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-teal-600 to-blue-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Partners & Ecosystem
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              Building the future of career development through strategic partnerships
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                <Handshake className="h-5 w-5 mr-2" />
                Become a Partner
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Building className="h-5 w-5 mr-2" />
                Partner Portal
              </Button>
            </div>
          </div>
        </section>

        {/* Partner Categories */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Partner Network
              </h2>
              <p className="text-lg text-gray-600">
                Connecting students, universities, and companies across Europe
              </p>
            </div>

            <div className="space-y-12">
              {partnerCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <div key={index}>
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                        <Icon className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                      <div className="ml-auto">
                        <Badge className="bg-teal-600 text-lg px-4 py-2">
                          {category.count}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {category.partners.map((partner, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{partner.name}</CardTitle>
                              {partner.tier === 'Premium' || partner.tier === 'Enterprise' ? (
                                <Star className="h-5 w-5 text-yellow-500" />
                              ) : null}
                            </div>
                            <p className="text-sm text-gray-600">{partner.location}</p>
                          </CardHeader>
                          <CardContent>
                            <Badge variant="outline">
                              {partner.tier}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Partnership Benefits */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Partnership Benefits
              </h2>
              <p className="text-lg text-gray-600">
                Unlock mutual value through strategic collaboration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-t-4 border-t-teal-600">
                  <CardHeader>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {benefit.items.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mr-3 mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership CTA */}
        <section className="py-16 bg-teal-50">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Partner with Us?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our growing ecosystem and help shape the future of career development in Europe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Apply for Partnership
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Download Partnership Guide
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}