'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  User,
  Building2,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Phone,
  Shield,
  FileText,
  Settings,
  TrendingUp,
  Users,
  Briefcase
} from 'lucide-react'

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: Home,
      pages: [
        { name: 'Home', url: '/', description: 'Platform overview and getting started' },
        { name: 'About', url: '/about', description: 'Learn about InTransparency' },
        { name: 'Pricing', url: '/pricing', description: 'Plans and pricing information' },
        { name: 'CV Samples', url: '/cv-samples', description: 'Sample AI-generated CVs' },
        { name: 'Demo', url: '/demo', description: 'Platform demonstration' }
      ]
    },
    {
      title: 'Authentication',
      icon: User,
      pages: [
        { name: 'Sign In', url: '/auth/login', description: 'User login' },
        { name: 'Sign Up', url: '/auth/register/role-selection', description: 'Account registration' },
        { name: 'Student Registration', url: '/auth/register/student', description: 'Student account setup' },
        { name: 'Recruiter Registration', url: '/auth/register/recruiter', description: 'Recruiter account setup' },
        { name: 'University Registration', url: '/auth/register/university', description: 'University account setup' },
        { name: 'Forgot Password', url: '/auth/forgot-password', description: 'Password recovery' }
      ]
    },
    {
      title: 'Student Dashboard',
      icon: GraduationCap,
      pages: [
        { name: 'Dashboard Home', url: '/dashboard/student', description: 'Student overview' },
        { name: 'Projects', url: '/dashboard/student/projects', description: 'Manage academic projects' },
        { name: 'New Project', url: '/dashboard/student/projects/new', description: 'Upload new project' },
        { name: 'Profile', url: '/dashboard/student/profile', description: 'View profile' },
        { name: 'Edit Profile', url: '/dashboard/student/profile/edit', description: 'Edit profile information' },
        { name: 'Job Opportunities', url: '/dashboard/student/jobs', description: 'Browse job opportunities' },
        { name: 'Applications', url: '/dashboard/student/applications', description: 'Track applications' },
        { name: 'Messages', url: '/dashboard/student/messages', description: 'Communication center' },
        { name: 'Courses', url: '/dashboard/student/courses', description: 'Academic courses' },
        { name: 'Analytics', url: '/dashboard/student/analytics', description: 'Performance analytics' }
      ]
    },
    {
      title: 'Recruiter Dashboard',
      icon: Briefcase,
      pages: [
        { name: 'Dashboard Home', url: '/dashboard/recruiter', description: 'Recruiter overview' },
        { name: 'Candidates', url: '/dashboard/recruiter/candidates', description: 'Browse candidates' },
        { name: 'Post Job', url: '/dashboard/recruiter/post-job', description: 'Create job posting' },
        { name: 'Job Listings', url: '/dashboard/recruiter/jobs', description: 'Manage job postings' },
        { name: 'Analytics', url: '/dashboard/recruiter/analytics', description: 'Hiring analytics' },
        { name: 'Student Search', url: '/dashboard/recruiter/students/search', description: 'Advanced candidate search' }
      ]
    },
    {
      title: 'University Dashboard',
      icon: Building2,
      pages: [
        { name: 'Dashboard Home', url: '/dashboard/university', description: 'University overview' },
        { name: 'Students', url: '/dashboard/university/students', description: 'Student management' },
        { name: 'Analytics', url: '/dashboard/university/analytics', description: 'Institution analytics' }
      ]
    },
    {
      title: 'Support & Help',
      icon: MessageSquare,
      pages: [
        { name: 'Help Center', url: '/help', description: 'Help articles and guides' },
        { name: 'Support', url: '/support', description: 'Technical support' },
        { name: 'Contact', url: '/contact', description: 'Contact information' },
        { name: 'Community', url: '/community', description: 'User community forum' },
        { name: 'Documentation', url: '/docs', description: 'Developer documentation' },
        { name: 'System Status', url: '/status', description: 'Platform status' }
      ]
    },
    {
      title: 'Company Information',
      icon: Building2,
      pages: [
        { name: 'Blog', url: '/blog', description: 'Latest news and insights' },
        { name: 'Careers', url: '/careers', description: 'Job opportunities' },
        { name: 'Contact Sales', url: '/contact-sales', description: 'Enterprise sales' }
      ]
    },
    {
      title: 'Legal & Privacy',
      icon: Shield,
      pages: [
        { name: 'Privacy Policy', url: '/legal/privacy', description: 'Privacy policy' },
        { name: 'Terms of Service', url: '/legal/terms', description: 'Terms of service' },
        { name: 'Accessibility', url: '/accessibility', description: 'Accessibility statement' },
        { name: 'Privacy Choices', url: '/privacy-choices', description: 'Privacy preferences' }
      ]
    },
    {
      title: 'Surveys',
      icon: FileText,
      pages: [
        { name: 'Survey Portal', url: '/survey', description: 'Survey landing page' },
        { name: 'Student Survey', url: '/survey/student', description: 'Student feedback survey' },
        { name: 'Company Survey', url: '/survey/company', description: 'Company feedback survey' },
        { name: 'University Survey', url: '/survey/university', description: 'University feedback survey' },
        { name: 'Thank You', url: '/survey/thank-you', description: 'Survey completion' }
      ]
    }
  ]

  const totalPages = sitemapSections.reduce((total, section) => total + section.pages.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Site Map
            </h1>
            <p className="text-xl text-white mb-8">
              Navigate through all {totalPages} pages of the InTransparency platform
            </p>
            <Badge className="bg-white text-blue-600 px-4 py-2">
              {sitemapSections.length} Main Sections
            </Badge>
          </div>
        </section>

        {/* Sitemap Content */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitemapSections.map((section, index) => {
                const Icon = section.icon
                return (
                  <Card key={index} className="h-fit">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        {section.title}
                        <Badge variant="outline" className="ml-auto">
                          {section.pages.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {section.pages.map((page, pageIndex) => (
                          <div key={pageIndex} className="border-l-2 border-gray-100 pl-4">
                            <a
                              href={page.url}
                              className="block text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              {page.name}
                            </a>
                            <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                            <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded border">
                              {page.url}
                            </code>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalPages}</div>
                <div className="text-gray-600">Total Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">{sitemapSections.length}</div>
                <div className="text-gray-600">Main Sections</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                <div className="text-gray-600">User Types</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                <div className="text-gray-600">Key Features</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Tips */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Need Help Finding Something?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Ask Our Support</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get personalized help from our support team
                  </p>
                  <a href="/support" className="text-blue-600 hover:text-blue-800 font-medium">
                    Contact Support →
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Browse Documentation</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Comprehensive guides and tutorials
                  </p>
                  <a href="/docs" className="text-green-600 hover:text-green-800 font-medium">
                    View Docs →
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Join Community</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Connect with other users and experts
                  </p>
                  <a href="/community" className="text-purple-600 hover:text-purple-800 font-medium">
                    Join Now →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}