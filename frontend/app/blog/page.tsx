'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  Clock,
  TrendingUp,
  BookOpen,
  Tag,
  Filter
} from 'lucide-react'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'students', name: 'For Students', count: 8 },
    { id: 'recruiters', name: 'For Recruiters', count: 6 },
    { id: 'universities', name: 'For Universities', count: 4 },
    { id: 'ai-tech', name: 'AI & Technology', count: 6 }
  ]

  const featuredPost = {
    id: 1,
    title: 'The Future of AI in Academic Portfolio Assessment',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way we evaluate student projects and academic achievements, creating more fair and comprehensive assessment methods.',
    content: 'In-depth analysis of how machine learning algorithms can provide objective, data-driven insights into student capabilities...',
    author: 'Dr. Sarah Chen',
    authorRole: 'AI Research Lead',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'AI & Technology',
    image: '/api/placeholder/800/400',
    tags: ['AI', 'Education', 'Assessment', 'Machine Learning'],
    featured: true
  }

  const blogPosts = [
    {
      id: 2,
      title: '10 Tips to Optimize Your Project Portfolio',
      excerpt: 'Learn how to present your academic projects in a way that catches recruiters\' attention and showcases your technical skills effectively.',
      author: 'Alex Rodriguez',
      authorRole: 'Career Advisor',
      date: '2024-01-12',
      readTime: '6 min read',
      category: 'For Students',
      image: '/api/placeholder/400/250',
      tags: ['Portfolio', 'Career Tips', 'Projects']
    },
    {
      id: 3,
      title: 'How to Find the Right Technical Talent',
      excerpt: 'A comprehensive guide for recruiters on using project-based assessment to identify truly skilled developers and engineers.',
      author: 'Maria Lopez',
      authorRole: 'Talent Acquisition Specialist',
      date: '2024-01-10',
      readTime: '5 min read',
      category: 'For Recruiters',
      image: '/api/placeholder/400/250',
      tags: ['Recruiting', 'Talent', 'Assessment']
    },
    {
      id: 4,
      title: 'University Partnership Success Stories',
      excerpt: 'See how leading universities are using InTransparency to improve student outcomes and strengthen industry connections.',
      author: 'Prof. James Wilson',
      authorRole: 'Academic Director',
      date: '2024-01-08',
      readTime: '7 min read',
      category: 'For Universities',
      image: '/api/placeholder/400/250',
      tags: ['Universities', 'Partnerships', 'Success Stories']
    },
    {
      id: 5,
      title: 'Understanding Code Quality Metrics',
      excerpt: 'Deep dive into the technical metrics our AI uses to evaluate code quality, complexity, and innovation in student projects.',
      author: 'David Kim',
      authorRole: 'Senior Engineer',
      date: '2024-01-05',
      readTime: '9 min read',
      category: 'AI & Technology',
      image: '/api/placeholder/400/250',
      tags: ['Code Quality', 'Metrics', 'Engineering']
    },
    {
      id: 6,
      title: 'Building Your Personal Brand as a Student',
      excerpt: 'Strategies for students to build a strong online presence and professional brand that attracts top employers.',
      author: 'Emma Thompson',
      authorRole: 'Brand Strategist',
      date: '2024-01-03',
      readTime: '4 min read',
      category: 'For Students',
      image: '/api/placeholder/400/250',
      tags: ['Personal Brand', 'Career', 'Students']
    },
    {
      id: 7,
      title: 'The Evolution of Technical Interviews',
      excerpt: 'How project-based evaluation is changing the landscape of technical hiring and what it means for both candidates and companies.',
      author: 'Ryan Chang',
      authorRole: 'Head of Engineering',
      date: '2024-01-01',
      readTime: '6 min read',
      category: 'For Recruiters',
      image: '/api/placeholder/400/250',
      tags: ['Interviews', 'Hiring', 'Technology']
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === categories.find(c => c.id === selectedCategory)?.name
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              InTransparency Blog
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Insights, tips, and stories about the future of education and career development
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
                <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
              </div>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center p-8">
                      <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Featured Article Image</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline">{featuredPost.category}</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{featuredPost.author}</p>
                          <p className="text-sm text-gray-700">{featuredPost.authorRole}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(featuredPost.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Categories and Posts */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Category Filter */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Articles</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-600" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-700">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{post.author}</p>
                            <p className="text-xs text-gray-700">
                              {new Date(post.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get the latest articles and insights delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button>
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}