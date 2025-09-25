'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  HelpCircle,
  Book,
  MessageSquare,
  Video,
  Users,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const categories = [
    {
      title: 'Getting Started',
      icon: Book,
      color: 'bg-blue-100 text-blue-600',
      articles: [
        'How to create your first project',
        'Setting up your profile',
        'Understanding AI analysis',
        'Uploading your code'
      ]
    },
    {
      title: 'For Students',
      icon: Users,
      color: 'bg-green-100 text-green-600',
      articles: [
        'Optimizing your portfolio',
        'Getting discovered by recruiters',
        'Improving your project scores',
        'CV generation tips'
      ]
    },
    {
      title: 'For Recruiters',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-600',
      articles: [
        'Finding the right candidates',
        'Using search filters effectively',
        'Evaluating student projects',
        'Managing your hiring pipeline'
      ]
    },
    {
      title: 'Technical Support',
      icon: HelpCircle,
      color: 'bg-orange-100 text-orange-600',
      articles: [
        'Troubleshooting upload issues',
        'Browser compatibility',
        'Account management',
        'API documentation'
      ]
    }
  ]

  const faqs = [
    {
      question: 'How does InTransparency analyze my code?',
      answer: 'Our AI system analyzes multiple aspects of your code including complexity, innovation, code quality, best practices adherence, and technology stack usage. It then generates professional narratives that highlight your technical skills and project achievements.'
    },
    {
      question: 'Is my code and data secure?',
      answer: 'Yes, we take security very seriously. All code is encrypted in transit and at rest, we follow SOC 2 compliance standards, and we never share your code with third parties. You maintain full ownership of your intellectual property.'
    },
    {
      question: 'How do recruiters find my projects?',
      answer: 'Recruiters can search for candidates based on skills, technologies, project types, and other criteria. Your profile appears in search results based on the AI analysis of your projects and the skills we identify.'
    },
    {
      question: 'Can I control what information is visible?',
      answer: 'Absolutely! You have full control over your privacy settings. You can choose to make your profile public, visible only to verified recruiters, or completely private while you build your portfolio.'
    },
    {
      question: 'What file formats are supported for uploads?',
      answer: 'We support most common programming languages and file formats including .py, .js, .java, .cpp, .c, .go, .rs, .php, .rb, .swift, .kt, .ts, .html, .css, .sql, and many more. We also support documentation formats like .md, .txt, and .pdf.'
    },
    {
      question: 'How much does InTransparency cost?',
      answer: 'We offer a free tier for students with basic features. Premium plans start at $9/month for students and include advanced analytics, priority support, and enhanced visibility. Enterprise plans are available for universities and companies.'
    }
  ]

  const popularArticles = [
    {
      title: 'Complete Guide to Profile Optimization',
      category: 'Getting Started',
      readTime: '8 min read',
      views: '12.5k views',
      rating: 4.9
    },
    {
      title: 'Understanding Your AI Analysis Scores',
      category: 'For Students',
      readTime: '5 min read',
      views: '8.2k views',
      rating: 4.8
    },
    {
      title: 'Best Practices for Code Documentation',
      category: 'Technical',
      readTime: '12 min read',
      views: '6.1k views',
      rating: 4.7
    },
    {
      title: 'Recruiter Search Tips and Tricks',
      category: 'For Recruiters',
      readTime: '6 min read',
      views: '4.3k views',
      rating: 4.9
    }
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Find answers, get support, and learn how to make the most of InTransparency
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                  <p className="text-gray-600 text-sm mb-4">Get personalized help from our support team</p>
                  <Button variant="outline" size="sm">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                  <p className="text-gray-600 text-sm mb-4">Watch step-by-step video guides</p>
                  <Button variant="outline" size="sm">
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600 text-sm mb-4">Connect with other users and experts</p>
                  <Button variant="outline" size="sm">
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Categories */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => {
                  const Icon = category.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.articles.map((article, articleIndex) => (
                            <li key={articleIndex} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer flex items-center">
                              <ChevronRight className="h-3 w-3 mr-1" />
                              {article}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {popularArticles.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">{article.category}</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {article.rating}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {article.readTime}
                        </div>
                        <span>{article.views}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="max-w-4xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Still Need Help CTA */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline">
                <Users className="h-5 w-5 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}