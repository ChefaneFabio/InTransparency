'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Heart,
  Star,
  Coffee,
  Zap,
  Target,
  ArrowRight,
  CheckCircle,
  Globe
} from 'lucide-react'

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = [
    { id: 'all', name: 'All Positions', count: 12 },
    { id: 'engineering', name: 'Engineering', count: 5 },
    { id: 'product', name: 'Product', count: 2 },
    { id: 'design', name: 'Design', count: 2 },
    { id: 'sales', name: 'Sales & Marketing', count: 2 },
    { id: 'operations', name: 'Operations', count: 1 }
  ]

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision insurance plus wellness stipend'
    },
    {
      icon: Coffee,
      title: 'Flexible Work',
      description: 'Work from anywhere with flexible hours and unlimited PTO'
    },
    {
      icon: Zap,
      title: 'Growth & Learning',
      description: '$2,000 annual learning budget and conference attendance'
    },
    {
      icon: Target,
      title: 'Equity & Impact',
      description: 'Meaningful equity package and the chance to shape the future of education'
    },
    {
      icon: Users,
      title: 'Amazing Team',
      description: 'Work with brilliant, passionate people who care about making a difference'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Help students worldwide unlock their potential and connect with opportunities'
    }
  ]

  const jobListings = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$140k - $180k',
      posted: '2 days ago',
      description: 'Join our engineering team to build the AI-powered platform that\'s transforming how students showcase their work.',
      requirements: ['5+ years full-stack experience', 'React, Node.js, TypeScript', 'Experience with AI/ML integration', 'Strong system design skills'],
      featured: true
    },
    {
      id: 2,
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$150k - $200k',
      posted: '1 week ago',
      description: 'Develop and improve our AI algorithms for code analysis, skill extraction, and intelligent matching.',
      requirements: ['PhD or Masters in CS/ML', 'Python, TensorFlow/PyTorch', 'NLP and computer vision experience', 'Published research preferred'],
      featured: true
    },
    {
      id: 3,
      title: 'Product Manager - Student Experience',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $150k',
      posted: '3 days ago',
      description: 'Lead product strategy for our student-facing features and drive user engagement and success.',
      requirements: ['3+ years product management', 'B2C product experience', 'Data-driven decision making', 'Education or career tech background']
    },
    {
      id: 4,
      title: 'Senior UX Designer',
      department: 'Design',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$110k - $140k',
      posted: '5 days ago',
      description: 'Create beautiful, intuitive experiences that help students and recruiters connect more effectively.',
      requirements: ['5+ years UX design', 'Figma, user research skills', 'B2B and B2C experience', 'Design system experience']
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $160k',
      posted: '1 week ago',
      description: 'Build and maintain our cloud infrastructure to support millions of users and AI workloads.',
      requirements: ['AWS/GCP expertise', 'Kubernetes, Docker', 'CI/CD pipelines', 'Infrastructure as code']
    },
    {
      id: 6,
      title: 'Growth Marketing Manager',
      department: 'Sales & Marketing',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$90k - $120k',
      posted: '4 days ago',
      description: 'Drive user acquisition and engagement through data-driven marketing campaigns.',
      requirements: ['3+ years growth marketing', 'A/B testing experience', 'Analytics tools expertise', 'B2B and B2C marketing']
    }
  ]

  const filteredJobs = selectedDepartment === 'all'
    ? jobListings
    : jobListings.filter(job => job.department.toLowerCase().includes(selectedDepartment))

  const companyValues = [
    {
      title: 'Student First',
      description: 'Every decision we make prioritizes student success and career outcomes.'
    },
    {
      title: 'Innovation Through AI',
      description: 'We push the boundaries of what\'s possible with artificial intelligence in education.'
    },
    {
      title: 'Transparency & Trust',
      description: 'We build products and relationships based on openness and trust.'
    },
    {
      title: 'Global Impact',
      description: 'We\'re committed to democratizing opportunities for students worldwide.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Help us transform education and create equal opportunities for students worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Learn About Our Culture
              </Button>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">Growing</div>
                <div className="text-gray-600">Team Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">Funded</div>
                <div className="text-gray-600">Well Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">Building</div>
                <div className="text-gray-600">Students Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">Growing</div>
                <div className="text-gray-600">Partner Companies</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Work at InTransparency?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join a team that's passionate about using technology to create equal opportunities for students everywhere.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do and shape our company culture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {companyValues.map((value, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Open Positions
              </h2>
              <p className="text-lg text-gray-600">
                Find your next opportunity to make a meaningful impact
              </p>
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDepartment === dept.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept.name} ({dept.count})
                </button>
              ))}
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className={`hover:shadow-lg transition-shadow ${job.featured ? 'ring-2 ring-blue-200' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          {job.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.department}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Key Requirements:</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="ml-6 text-right">
                        <div className="text-sm text-gray-500 mb-4">Posted {job.posted}</div>
                        <Button>
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
                <p className="text-gray-600">Try selecting a different department</p>
              </div>
            )}
          </div>
        </section>

        {/* Application CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Don't See the Perfect Role?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We're always looking for exceptional talent. Send us your resume and let's talk!
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Send Us Your Resume
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}