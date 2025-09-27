'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Reply,
  Search,
  Filter,
  Plus,
  Star,
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  Lightbulb,
  HelpCircle
} from 'lucide-react'

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'All Posts', count: 156 },
    { id: 'general', name: 'General Discussion', count: 45 },
    { id: 'students', name: 'Student Tips', count: 38 },
    { id: 'recruiters', name: 'Recruiter Insights', count: 28 },
    { id: 'technical', name: 'Technical Support', count: 25 },
    { id: 'feature-requests', name: 'Feature Requests', count: 20 }
  ]

  const stats = [
    { label: 'Community Members', value: 'Growing', icon: Users },
    { label: 'Posts This Month', value: 'Active', icon: MessageSquare },
    { label: 'Questions Answered', value: 'Daily', icon: HelpCircle },
    { label: 'Expert Contributors', value: 'Available', icon: Award }
  ]

  const featuredPosts = [
    {
      id: 1,
      title: 'How I improved my AI analysis score by 40 points',
      author: 'Sarah Chen',
      authorRole: 'CS Student',
      category: 'Student Tips',
      replies: 23,
      likes: 89,
      timeAgo: '2 hours ago',
      featured: true,
      excerpt: 'Sharing my journey and the specific techniques I used to optimize my project portfolio...'
    },
    {
      id: 2,
      title: 'What recruiters really look for in student projects',
      author: 'Mike Rodriguez',
      authorRole: 'Senior Recruiter at TechCorp',
      category: 'Recruiter Insights',
      replies: 45,
      likes: 156,
      timeAgo: '4 hours ago',
      featured: true,
      excerpt: 'From 5+ years of hiring developers, here are the key things that catch my attention...'
    }
  ]

  const posts = [
    {
      id: 3,
      title: 'Best practices for organizing large coding projects?',
      author: 'Alex Kim',
      authorRole: 'Software Engineering Student',
      category: 'General Discussion',
      replies: 12,
      likes: 34,
      timeAgo: '6 hours ago',
      excerpt: 'I\'m working on a complex web application and wondering about best practices for project structure...'
    },
    {
      id: 4,
      title: 'GitHub integration not syncing - anyone else?',
      author: 'Jennifer Liu',
      authorRole: 'Data Science Student',
      category: 'Technical Support',
      replies: 8,
      likes: 15,
      timeAgo: '8 hours ago',
      excerpt: 'My GitHub repositories aren\'t showing up in my profile. Has anyone experienced this issue?'
    },
    {
      id: 5,
      title: 'Feature Request: Dark mode for the platform',
      author: 'David Park',
      authorRole: 'Computer Science Student',
      category: 'Feature Requests',
      replies: 31,
      likes: 78,
      timeAgo: '12 hours ago',
      excerpt: 'Would love to see a dark mode option for those late-night coding sessions. Anyone else interested?'
    },
    {
      id: 6,
      title: 'How to write compelling project descriptions',
      author: 'Emily Johnson',
      authorRole: 'Technical Writer',
      category: 'Student Tips',
      replies: 19,
      likes: 56,
      timeAgo: '1 day ago',
      excerpt: 'Tips from a technical writer on how to make your project descriptions stand out to recruiters...'
    }
  ]

  const experts = [
    {
      name: 'Dr. Sarah Wilson',
      title: 'AI Research Lead',
      company: 'InTransparency',
      posts: 42,
      reputation: 2850,
      specialties: ['AI Analysis', 'Code Quality']
    },
    {
      name: 'Mike Rodriguez',
      title: 'Senior Technical Recruiter',
      company: 'TechCorp',
      posts: 38,
      reputation: 2340,
      specialties: ['Recruiting', 'Career Advice']
    },
    {
      name: 'Prof. James Chen',
      title: 'Computer Science Professor',
      company: 'Stanford University',
      posts: 29,
      reputation: 1920,
      specialties: ['Education', 'Project Guidance']
    }
  ]

  const events = [
    {
      title: 'Weekly Office Hours with InTransparency Team',
      date: 'Every Friday, 2:00 PM PST',
      type: 'Recurring',
      participants: 45
    },
    {
      title: 'Portfolio Review Session',
      date: 'March 15, 2024, 3:00 PM PST',
      type: 'Workshop',
      participants: 28
    },
    {
      title: 'Recruiter AMA: Tech Industry Trends',
      date: 'March 22, 2024, 1:00 PM PST',
      type: 'AMA',
      participants: 67
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
              InTransparency Community
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect, learn, and grow with students, recruiters, and industry experts
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Plus className="h-5 w-5 mr-2" />
                Start a Discussion
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Browse Topics
              </Button>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <Icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors ${
                              selectedCategory === category.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-sm">{category.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {category.count}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Contributors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Expert Contributors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {experts.map((expert, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {expert.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm">{expert.name}</p>
                              <p className="text-xs text-gray-600">{expert.title}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-700">{expert.posts} posts</span>
                                <span className="text-xs text-gray-700">•</span>
                                <span className="text-xs text-gray-700">{expert.reputation} rep</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {events.map((event, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{event.date}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                              <span className="text-xs text-gray-700">{event.participants} joining</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>

                {/* Featured Posts */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Discussions</h2>
                  <div className="space-y-4">
                    {featuredPosts.map((post) => (
                      <Card key={post.id} className="border-l-4 border-yellow-400">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                            <span className="text-sm text-gray-700">{post.timeAgo}</span>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600">
                            {post.title}
                          </h3>

                          <p className="text-gray-600 mb-4">{post.excerpt}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-600">
                                    {post.author.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{post.author}</p>
                                  <p className="text-xs text-gray-600">{post.authorRole}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-700">
                              <div className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {post.likes}
                              </div>
                              <div className="flex items-center">
                                <Reply className="h-4 w-4 mr-1" />
                                {post.replies}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Regular Posts */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Discussions</h2>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="outline">{post.category}</Badge>
                            <span className="text-sm text-gray-700">{post.timeAgo}</span>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                            {post.title}
                          </h3>

                          <p className="text-gray-600 mb-4">{post.excerpt}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {post.author.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{post.author}</p>
                                <p className="text-xs text-gray-600">{post.authorRole}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-700">
                              <div className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {post.likes}
                              </div>
                              <div className="flex items-center">
                                <Reply className="h-4 w-4 mr-1" />
                                {post.replies}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Guidelines CTA */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join the Conversation
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Be part of a supportive community where everyone learns and grows together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Create Your First Post
              </Button>
              <Button size="lg" variant="outline">
                Read Community Guidelines
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}