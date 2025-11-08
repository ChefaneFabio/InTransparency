'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Building2, TrendingUp, CheckCircle, Mail, Filter, Search } from 'lucide-react'
import Link from 'next/link'

interface AlumniStory {
  id: string
  alumniName: string
  graduationYear: number
  degree: string
  institution: string
  currentRole: string
  currentCompany: string
  careerPath: Array<{
    role: string
    company: string
    duration: string
    year: number
  }>
  story: string
  keySkills: string[]
  adviceForStudents: string
  submissionDate: string
}

export default function AlumniStoriesPage() {
  const [stories, setStories] = useState<AlumniStory[]>([])
  const [loading, setLoading] = useState(true)
  const [filterInstitution, setFilterInstitution] = useState('')
  const [filterDegree, setFilterDegree] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStories()
  }, [filterInstitution, filterDegree])

  const fetchStories = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterInstitution) params.append('institutionId', filterInstitution)
      if (filterDegree) params.append('degree', filterDegree)

      const response = await fetch(`/api/advocacy/alumni-story?${params}`)
      const data = await response.json()

      if (data.success) {
        setStories(data.stories)
      }
    } catch (error) {
      console.error('Error fetching alumni stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStories = stories.filter(story => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      story.alumniName.toLowerCase().includes(search) ||
      story.currentRole.toLowerCase().includes(search) ||
      story.currentCompany.toLowerCase().includes(search) ||
      story.keySkills.some(skill => skill.toLowerCase().includes(search))
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-12 w-12 mr-3" />
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                Alumni Success Stories
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Verified career journeys from graduates who started where you are today.
              Learn from their experiences, skills, and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/advocacy/submit-story">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Share Your Story
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Join the Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">How Verification Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Submit Story</h3>
              <p className="text-sm text-gray-600">
                Alumni submit their career journey using their institutional (.edu) email
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Email Verification</h3>
              <p className="text-sm text-gray-600">
                We send a verification link to confirm institutional affiliation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Published</h3>
              <p className="text-sm text-gray-600">
                Verified stories are published to inspire current students
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, role, company, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterDegree}
                    onChange={(e) => setFilterDegree(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Degrees</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Design">Design</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterDegree('')
                      setFilterInstitution('')
                      setSearchTerm('')
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredStories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No Stories Yet</h3>
                <p className="text-gray-600 mb-6">
                  Be the first to share your success story and inspire current students!
                </p>
                <Link href="/advocacy/submit-story">
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Share Your Story
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredStories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{story.alumniName}</CardTitle>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>{story.degree} • {story.graduationYear}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{story.currentRole} at {story.currentCompany}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Career Path */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Career Journey
                      </h4>
                      <div className="space-y-2">
                        {story.careerPath.slice(0, 3).map((step, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium">{step.role}</div>
                              <div className="text-gray-600">{step.company} • {step.duration}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Story Excerpt */}
                    <div>
                      <h4 className="font-semibold mb-2">Success Story</h4>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {story.story}
                      </p>
                    </div>

                    {/* Key Skills */}
                    <div>
                      <h4 className="font-semibold mb-2">Key Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {story.keySkills.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {story.keySkills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{story.keySkills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Advice */}
                    {story.adviceForStudents && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <h4 className="font-semibold text-sm mb-1 text-blue-900">
                          Advice for Students
                        </h4>
                        <p className="text-sm text-blue-800 line-clamp-2">
                          {story.adviceForStudents}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Are You an Alumni?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Share your career journey and inspire the next generation of professionals.
            Your verified story helps students understand real career paths.
          </p>
          <Link href="/advocacy/submit-story">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Mail className="h-5 w-5 mr-2" />
              Submit Your Story
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
