import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lightbulb, ThumbsUp, Clock, CheckCircle, Send, TrendingUp } from 'lucide-react'

export default function FeatureRequestsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Feature Requests
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Help shape the future of InTransparency by suggesting new features
            </p>

            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Lightbulb className="h-5 w-5 mr-2" />
              Submit Feature Request
            </Button>
          </div>
        </section>

        {/* Feature Request Form */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Feature Request</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feature Category
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>User Interface</option>
                      <option>AI & Matching</option>
                      <option>Portfolio Tools</option>
                      <option>Analytics</option>
                      <option>Integrations</option>
                      <option>Mobile App</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Type
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Student</option>
                      <option>Recruiter</option>
                      <option>University</option>
                      <option>All Users</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feature Title
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of the feature"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Problem Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What problem would this feature solve?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Solution
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How would you like this feature to work?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Use Case Examples
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific examples of how you would use this feature"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Nice to Have</option>
                      <option>Would be Helpful</option>
                      <option>Important</option>
                      <option>Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  <Send className="h-5 w-5 mr-2" />
                  Submit Feature Request
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Feature Status Guide */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Feature Development Process
              </h2>
              <p className="text-lg text-gray-600">
                How we evaluate and implement feature requests
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Under Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Feature request received and being evaluated by our product team.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <ThumbsUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg">Community Voting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Community members vote on the importance and priority of the feature.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">In Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Feature has been prioritized and development team is building it.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Released</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Feature has been implemented and is available to all users.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Requests */}
        <section className="py-16 bg-purple-50">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Feature Requests
              </h2>
              <p className="text-lg text-gray-600">
                Most requested features from our community
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Mobile App for iOS and Android', votes: 234, status: 'In Development' },
                { title: 'Advanced Portfolio Templates', votes: 189, status: 'Under Review' },
                { title: 'Video Interview Integration', votes: 156, status: 'Community Voting' },
                { title: 'Real-time Collaboration Tools', votes: 134, status: 'Under Review' },
                { title: 'Advanced Analytics Dashboard', votes: 98, status: 'Community Voting' }
              ].map((request, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {request.votes} votes
                          </div>
                          <Badge variant={
                            request.status === 'In Development' ? 'default' :
                            request.status === 'Under Review' ? 'secondary' : 'outline'
                          }>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Vote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}