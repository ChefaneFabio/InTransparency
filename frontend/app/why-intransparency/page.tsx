'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import {
  Zap,
  Eye,
  Users,
  Target,
  Brain,
  Shield,
  Globe,
  TrendingUp,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
  Rocket,
  Award,
  MapPin,
  GraduationCap,
  BarChart3,
  Heart,
  Lightbulb,
  ArrowRight,
  Play,
  Calendar,
  Building,
  ChevronRight,
  Linkedin,
  Search,
  FileText,
  Database
} from 'lucide-react'

export default function WhyInTransparencyPage() {
  const [activeComparison, setActiveComparison] = useState('linkedin')

  const competitorComparisons = {
    almalaurea: {
      name: 'AlmaLaurea',
      icon: GraduationCap,
      color: 'orange',
      ourAdvantages: [
        'AI-powered job matching beyond basic skills',
        'Real-time project portfolio analysis and validation',
        'Automated CV generation for each application',
        'Interactive geographic talent mapping',
        'Direct application to external job postings',
        'Comprehensive recruiter analytics dashboard',
        'Multi-language support and global reach'
      ],
      theirLimitations: [
        'Static profile database without AI matching',
        'Limited project showcase capabilities',
        'Manual CV creation required',
        'Basic search functionality',
        'No external job application integration',
        'Limited analytics for recruiters',
        'Primarily Italy-focused'
      ],
      keyDifferentiators: [
        'AI-First Approach: Smart matching and automated CV generation vs. static database',
        'Dynamic Portfolios: Live project analysis vs. basic profile information',
        'Global Integration: Connect to jobs worldwide vs. Italy-centric platform'
      ]
    },
    linkedin: {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'blue',
      ourAdvantages: [
        'AI-Generated CVs tailored for each application',
        'University-focused talent discovery with academic performance integration',
        'Real-time project analysis and skills validation',
        'Geographic talent mapping with university rankings',
        'Transparent salary and performance metrics',
        'Direct integration with external job applications',
        'Academic achievement verification system'
      ],
      theirLimitations: [
        'Generic profiles without personalization',
        'Limited academic performance visibility',
        'No automated CV generation',
        'Basic geographic search capabilities',
        'Unclear salary transparency',
        'Manual application processes',
        'No academic verification'
      ],
      keyDifferentiators: [
        'AI-Powered Personalization: Every CV is uniquely generated for each opportunity',
        'Academic Excellence Focus: Deep integration with university performance data',
        'Automated Application Process: One-click applications with personalized materials'
      ]
    },
    indeed: {
      name: 'Indeed',
      icon: Search,
      color: 'green',
      ourAdvantages: [
        'AI-driven job matching based on academic performance',
        'University talent pools with verified credentials',
        'Personalized CV generation for each application',
        'Real-time skills analysis from project portfolios',
        'Integrated talent analytics for recruiters',
        'Academic ranking and GPA transparency',
        'Direct university partnership integrations'
      ],
      theirLimitations: [
        'Basic keyword-based job matching',
        'No university-specific talent focus',
        'Generic resume templates',
        'Limited skills verification',
        'Basic recruiter analytics',
        'No academic performance data',
        'No educational institution partnerships'
      ],
      keyDifferentiators: [
        'University-Centric Approach: Built specifically for academic talent discovery',
        'Intelligent Matching: AI considers academic performance, not just keywords',
        'Verified Academic Credentials: Direct integration with educational institutions'
      ]
    },
    recruiting: {
      name: 'Traditional Recruiting Platforms',
      icon: Building,
      color: 'purple',
      ourAdvantages: [
        'Transparent candidate profiles with verified achievements',
        'AI-generated CVs eliminate bias and improve quality',
        'Real-time project portfolio analysis',
        'Geographic talent mapping with university data',
        'Automated candidate screening and matching',
        'Direct academic performance integration',
        'One-click application process'
      ],
      theirLimitations: [
        'Opaque candidate evaluation processes',
        'Manual CV review and screening',
        'Limited project portfolio visibility',
        'Basic geographic search',
        'Time-intensive screening processes',
        'No academic performance integration',
        'Complex multi-step applications'
      ],
      keyDifferentiators: [
        'Complete Transparency: Every metric and achievement is verified and visible',
        'AI-First Approach: Automation reduces bias and improves efficiency',
        'Academic Integration: Deep connection with educational performance data'
      ]
    }
  }

  const uniqueFeatures = [
    {
      icon: Brain,
      title: 'AI-Generated CVs',
      description: 'Every application gets a personalized, AI-crafted CV tailored to the specific role and company',
      benefit: 'Higher application success rates',
      color: 'blue'
    },
    {
      icon: GraduationCap,
      title: 'University-Centric Focus',
      description: 'Deep integration with academic institutions, rankings, and performance data',
      benefit: 'Target the best academic talent',
      color: 'purple'
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'All skills, projects, and achievements are verified and openly displayed',
      benefit: 'Make informed hiring decisions',
      color: 'green'
    },
    {
      icon: MapPin,
      title: 'Geographic Talent Mapping',
      description: 'Interactive maps showing talent distribution across universities and regions',
      benefit: 'Discover talent anywhere',
      color: 'orange'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive insights into talent pools, market trends, and hiring success',
      benefit: 'Data-driven recruitment',
      color: 'red'
    },
    {
      icon: Zap,
      title: 'One-Click Applications',
      description: 'Students apply to external jobs instantly using their InTransparency profile',
      benefit: 'Faster hiring processes',
      color: 'yellow'
    }
  ]

  const successMetrics = [
    { metric: 'AI-Powered', label: 'Job Match Technology', icon: Target },
    { metric: 'Streamlined', label: 'Hiring Process', icon: TrendingUp },
    { metric: 'Growing', label: 'Recruiter Network', icon: Heart },
    { metric: 'Verified', label: 'Student Profiles', icon: Users },
    { metric: 'Partner', label: 'University Network', icon: Award },
    { metric: 'Successful', label: 'Career Connections', icon: Rocket }
  ]

  const getCompetitorColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getFeatureColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-500 border border-blue-100',
      purple: 'bg-purple-50 text-purple-500 border border-purple-100',
      green: 'bg-green-50 text-green-500 border border-green-100',
      orange: 'bg-orange-50 text-orange-500 border border-orange-100',
      red: 'bg-red-50 text-red-500 border border-red-100',
      yellow: 'bg-yellow-50 text-yellow-500 border border-yellow-100'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8 pt-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              The Future of University Talent Discovery
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-blue-600">InTransparency</span>?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another job platform. We're revolutionizing how universities, students, and recruiters connect
              through AI-powered transparency, academic excellence, and automated efficiency.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

      {/* Success Metrics */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Proven Results</h2>
            <p className="text-gray-600">Numbers that speak for themselves</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {(successMetrics || []).map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{item.metric}</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Unique Features */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Revolutionary features that set us apart from traditional job platforms and recruiting tools
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(uniqueFeatures || []).map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-white shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getFeatureColor(feature.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-sm font-medium text-blue-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {feature.benefit}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Compare</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how InTransparency stacks up against traditional platforms
          </p>
        </div>

        {/* Competitor Selection */}
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {Object.entries(competitorComparisons || {}).map(([key, competitor]) => {
              const Icon = competitor.icon
              return (
                <button
                  key={key}
                  onClick={() => setActiveComparison(key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${
                    activeComparison === key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  vs {competitor.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-0">
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              {/* InTransparency Side */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600">InTransparency</h3>
                  <p className="text-gray-600">The AI-Powered Future</p>
                </div>
                <div className="space-y-3">
                  {((competitorComparisons as any)[activeComparison]?.ourAdvantages || []).map((advantage: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Side */}
              <div className="p-8 bg-gray-50">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border-2 ${getCompetitorColor((competitorComparisons as any)[activeComparison].color)}`}>
                    {React.createElement((competitorComparisons as any)[activeComparison].icon, { className: "h-8 w-8" })}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{(competitorComparisons as any)[activeComparison].name}</h3>
                  <p className="text-gray-600">Traditional Approach</p>
                </div>
                <div className="space-y-3">
                  {((competitorComparisons as any)[activeComparison]?.theirLimitations || []).map((limitation: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Differentiators */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-center">
              Key Differentiators vs {(competitorComparisons as any)[activeComparison].name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {((competitorComparisons as any)[activeComparison]?.keyDifferentiators || []).map((differentiator: string, index: number) => {
                const [title, description] = differentiator.split(': ')
                return (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                      <p className="text-gray-600">{description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Advantages */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Universities & Companies Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built for the modern education-to-employment pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                For Universities
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Showcase Student Excellence</p>
                    <p className="text-sm text-gray-600">Highlight academic achievements and project portfolios</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Career Services Integration</p>
                    <p className="text-sm text-gray-600">Direct integration with university career services</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Alumni Success Tracking</p>
                    <p className="text-sm text-gray-600">Monitor graduate employment outcomes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2 text-purple-600" />
                For Companies
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Quality Talent Pipeline</p>
                    <p className="text-sm text-gray-600">Access to verified, high-performing university talent</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Reduced Hiring Time</p>
                    <p className="text-sm text-gray-600">AI-powered matching and automated screening</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Data-Driven Insights</p>
                    <p className="text-sm text-gray-600">Comprehensive analytics on talent trends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join thousands of universities, students, and companies already using InTransparency
            to revolutionize talent discovery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" variant="outline" className="text-blue-600 bg-white hover:bg-gray-50">
              Start Free Trial
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
              <Calendar className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            ✓ No credit card required  ✓ 14-day free trial  ✓ Setup in minutes
          </p>
        </CardContent>
      </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}