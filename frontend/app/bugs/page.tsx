import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bug, AlertTriangle, CheckCircle, Clock, Send } from 'lucide-react'

export default function BugsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-red-600 to-orange-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bug Reports
            </h1>
            <p className="text-xl text-red-100 mb-8">
              Help us improve InTransparency by reporting bugs and issues
            </p>

            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Bug className="h-5 w-5 mr-2" />
              Report a Bug
            </Button>
          </div>
        </section>

        {/* Bug Report Form */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Bug Report</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bug Type
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option>UI/UX Issue</option>
                      <option>Functionality Bug</option>
                      <option>Performance Issue</option>
                      <option>Security Concern</option>
                      <option>Data Issue</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bug Title
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of the issue"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Steps to Reproduce
                  </label>
                  <textarea
                    rows={4}
                    placeholder="1. Go to... 2. Click on... 3. See error..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected vs Actual Behavior
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What should happen vs what actually happens"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Browser/Device
                    </label>
                    <input
                      type="text"
                      placeholder="Chrome 120, iPhone 14, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screenshots/Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input type="file" multiple className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-gray-600">
                        <p>Click to upload screenshots or drag and drop</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  <Send className="h-5 w-5 mr-2" />
                  Submit Bug Report
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Bug Status Guide */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bug Status Guide
              </h2>
              <p className="text-lg text-gray-600">
                Understanding how we handle and prioritize bug reports
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg">Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Bug report received and awaiting review by our team.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">In Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Our team is investigating and reproducing the issue.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Bug className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Development team is working on a fix for the issue.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Bug has been fixed and deployed to production.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Response Times */}
        <section className="py-16 bg-slate-100">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Response Times
              </h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Levels</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Badge className="bg-red-600 mr-3">Critical</Badge>
                        <span className="text-gray-700">&lt; 2 hours</span>
                      </li>
                      <li className="flex items-center">
                        <Badge className="bg-orange-600 mr-3">High</Badge>
                        <span className="text-gray-700">&lt; 24 hours</span>
                      </li>
                      <li className="flex items-center">
                        <Badge className="bg-yellow-600 mr-3">Medium</Badge>
                        <span className="text-gray-700">&lt; 3 days</span>
                      </li>
                      <li className="flex items-center">
                        <Badge className="bg-gray-600 mr-3">Low</Badge>
                        <span className="text-gray-700">&lt; 1 week</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Initial acknowledgment within 24 hours</li>
                      <li>• Regular status updates on progress</li>
                      <li>• Email notification when resolved</li>
                      <li>• Follow-up to ensure satisfaction</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}