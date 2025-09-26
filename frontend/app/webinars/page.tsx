import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users, Play, Download, ExternalLink } from 'lucide-react'

const upcomingWebinars = [
  {
    title: 'AI-Powered Career Development: The Future is Now',
    date: '2024-04-15',
    time: '14:00 CET',
    duration: '60 min',
    speaker: 'Dr. Maria Rossi, Head of AI',
    description: 'Discover how artificial intelligence is transforming career development and student outcomes.',
    attendees: 1247,
    status: 'upcoming'
  },
  {
    title: 'Building Your Portfolio: From Code to Career',
    date: '2024-04-22',
    time: '16:00 CET',
    duration: '45 min',
    speaker: 'Marco Bianchi, Senior Developer',
    description: 'Learn best practices for showcasing your programming projects to potential employers.',
    attendees: 892,
    status: 'upcoming'
  },
  {
    title: 'University Partnerships: Bridging Academia and Industry',
    date: '2024-04-29',
    time: '11:00 CET',
    duration: '90 min',
    speaker: 'Prof. Anna Verdi, Partnership Director',
    description: 'How universities can leverage technology to improve student career outcomes.',
    attendees: 567,
    status: 'upcoming'
  }
]

const pastWebinars = [
  {
    title: 'Getting Started with InTransparency: A Complete Guide',
    date: '2024-03-18',
    views: 3421,
    rating: 4.8,
    duration: '55 min'
  },
  {
    title: 'Resume Optimization for the Digital Age',
    date: '2024-03-04',
    views: 2156,
    rating: 4.6,
    duration: '40 min'
  },
  {
    title: 'Networking in the Tech Industry',
    date: '2024-02-19',
    views: 1987,
    rating: 4.7,
    duration: '50 min'
  }
]

export default function WebinarsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Webinars & Events
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Learn from industry experts and advance your career with our educational webinar series
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Play className="h-5 w-5 mr-2" />
                Watch Past Events
              </Button>
            </div>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upcoming Webinars
              </h2>
              <p className="text-lg text-gray-600">
                Join our live sessions and interact with industry experts
              </p>
            </div>

            <div className="space-y-6">
              {upcomingWebinars.map((webinar, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className="bg-emerald-600">Live Event</Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            {webinar.attendees} registered
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {webinar.title}
                        </h3>

                        <p className="text-gray-600 mb-4">
                          {webinar.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(webinar.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {webinar.time} • {webinar.duration}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Speaker:</strong> {webinar.speaker}
                        </p>
                      </div>

                      <div className="flex flex-col justify-center space-y-3">
                        <Button className="w-full">
                          Register Now
                        </Button>
                        <Button variant="outline" className="w-full">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Past Webinars */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Watch Past Webinars
              </h2>
              <p className="text-lg text-gray-600">
                Catch up on previous sessions available on-demand
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastWebinars.map((webinar, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg">{webinar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Duration: {webinar.duration}</span>
                        <span>★ {webinar.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{webinar.views.toLocaleString()} views</span>
                        <span>{new Date(webinar.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Host a Webinar CTA */}
        <section className="py-16 bg-emerald-50">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Want to Host a Webinar?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Share your expertise with our community of students, educators, and professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Propose a Topic
                <ExternalLink className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Speaker Guidelines
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}