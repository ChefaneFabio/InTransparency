'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Star,
  Code,
  Award,
  TrendingUp,
  ExternalLink,
  Share2,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Sparkles,
  Target
} from 'lucide-react'
import Link from 'next/link'

// Mock data - in production, fetch from API based on username
const mockStudentData = {
  username: 'alexjohnson',
  firstName: 'Alex',
  lastName: 'Johnson',
  fullName: 'Alex Johnson',
  email: 'alex.johnson@mit.edu',
  photo: '/api/placeholder/200/200',
  tagline: 'Full-Stack Developer | AI Enthusiast | MIT CS \'25',
  bio: 'Passionate about building AI-powered applications that solve real-world problems. Experienced in React, Node.js, Python, and machine learning. Looking for opportunities in AI/ML and full-stack development.',
  university: 'Massachusetts Institute of Technology',
  degree: 'B.S. Computer Science',
  graduationYear: '2025',
  location: 'Cambridge, MA',
  gpa: '3.8',
  gpaPublic: true,

  careerReadinessScore: 87,

  stats: {
    totalProjects: 8,
    profileViews: 1247,
    recruiterViews: 34,
    jobMatches: 23
  },

  skills: [
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'Python', level: 88, category: 'Backend' },
    { name: 'TypeScript', level: 82, category: 'Frontend' },
    { name: 'Machine Learning', level: 75, category: 'AI/ML' },
    { name: 'PostgreSQL', level: 70, category: 'Database' },
    { name: 'Docker', level: 65, category: 'DevOps' },
    { name: 'AWS', level: 60, category: 'Cloud' }
  ],

  projects: [
    {
      id: '1',
      title: 'AI-Powered Resume Analyzer',
      description: 'Built a machine learning model that analyzes resumes and provides feedback on improvements. Used NLP to extract skills and match with job descriptions.',
      technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL'],
      category: 'AI/ML',
      githubUrl: 'https://github.com/alexjohnson/resume-analyzer',
      liveUrl: 'https://resume-ai.example.com',
      imageUrl: '/api/placeholder/600/400',
      aiAnalysis: {
        complexityScore: 87,
        innovationScore: 82,
        marketRelevance: 9
      },
      featured: true
    },
    {
      id: '2',
      title: 'Real-Time Collaboration Platform',
      description: 'Developed a real-time document collaboration tool similar to Google Docs using WebSockets and operational transformation.',
      technologies: ['React', 'Socket.io', 'MongoDB', 'Express'],
      category: 'Web Development',
      githubUrl: 'https://github.com/alexjohnson/collab-platform',
      liveUrl: 'https://collab.example.com',
      imageUrl: '/api/placeholder/600/400',
      aiAnalysis: {
        complexityScore: 78,
        innovationScore: 75,
        marketRelevance: 8
      },
      featured: true
    },
    {
      id: '3',
      title: 'E-Commerce Analytics Dashboard',
      description: 'Created an analytics dashboard for e-commerce businesses with real-time data visualization and predictive analytics.',
      technologies: ['React', 'D3.js', 'Python', 'Flask', 'Redis'],
      category: 'Data Visualization',
      githubUrl: 'https://github.com/alexjohnson/ecommerce-analytics',
      imageUrl: '/api/placeholder/600/400',
      aiAnalysis: {
        complexityScore: 72,
        innovationScore: 68,
        marketRelevance: 8
      },
      featured: false
    }
  ],

  education: [
    {
      institution: 'Massachusetts Institute of Technology',
      degree: 'B.S. Computer Science',
      startYear: '2021',
      endYear: '2025',
      gpa: '3.8',
      achievements: [
        'Dean\'s List (All Semesters)',
        'MIT AI Lab Research Assistant',
        'Hackathon Winner - MIT Blueprint 2024'
      ]
    }
  ],

  socialLinks: {
    github: 'https://github.com/alexjohnson',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    portfolio: 'https://alexjohnson.dev'
  }
}

export default function PublicPortfolioPage() {
  const params = useParams()
  const username = params?.username as string

  // In production, fetch student data based on username
  const student = mockStudentData
  const isOwner = false // Check if viewing own profile

  const portfolioUrl = `https://intransparency.com/students/${username}/public`

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`, '_blank')
  }

  const shareOnTwitter = () => {
    const text = `Check out ${student.fullName}'s portfolio on InTransparency!`
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(portfolioUrl)}&text=${encodeURIComponent(text)}`, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(portfolioUrl)
    alert('Portfolio link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Avatar */}
                  <Avatar className="w-40 h-40 border-4 border-white shadow-xl">
                    <AvatarImage src={student.photo} alt={student.fullName} />
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {student.firstName[0]}{student.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {student.fullName}
                    </h1>
                    <p className="text-xl text-gray-700 mb-4">
                      {student.tagline}
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 mb-6">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {student.university}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Class of {student.graduationYear}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {student.location}
                      </div>
                      {student.gpaPublic && (
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          GPA: {student.gpa}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {!isOwner && (
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" size="lg">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact {student.firstName}
                        </Button>
                      )}

                      {student.socialLinks.github && (
                        <Button variant="outline" asChild>
                          <a href={student.socialLinks.github} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                          </a>
                        </Button>
                      )}

                      {student.socialLinks.linkedin && (
                        <Button variant="outline" asChild>
                          <a href={student.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 h-4 w-4" />
                            LinkedIn
                          </a>
                        </Button>
                      )}

                      <Button variant="outline" onClick={shareOnLinkedIn}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 md:w-64">
                    <div className="bg-white rounded-lg p-4 text-center shadow-md">
                      <div className="text-3xl font-bold text-blue-600">{student.stats.profileViews}</div>
                      <div className="text-xs text-gray-600">Profile Views</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-md">
                      <div className="text-3xl font-bold text-purple-600">{student.stats.recruiterViews}</div>
                      <div className="text-xs text-gray-600">Recruiter Views</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-md">
                      <div className="text-3xl font-bold text-green-600">{student.stats.totalProjects}</div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-md">
                      <div className="text-3xl font-bold text-orange-600">{student.stats.jobMatches}</div>
                      <div className="text-xs text-gray-600">Job Matches</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* About Section */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{student.bio}</p>
              </CardContent>
            </Card>
          </section>

          {/* Career Readiness Score */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-900">
                  <Target className="h-5 w-5 mr-2" />
                  Career Readiness Score
                </CardTitle>
                <CardDescription className="text-green-700">
                  Based on AI analysis of projects, skills, and education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-bold text-green-600">{student.careerReadinessScore}%</span>
                  <Badge className="bg-green-600 text-white">Top 15% at {student.university}</Badge>
                </div>
                <Progress value={student.careerReadinessScore} className="h-4" />
                <p className="text-sm text-green-700 mt-3">
                  This score indicates strong potential for success in technical roles, based on project complexity, skill diversity, and academic performance.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Featured Projects */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <Code className="h-8 w-8 mr-3 text-blue-600" />
                Featured Projects
              </h2>
              <Button variant="outline" asChild>
                <Link href={`/students/${username}/projects`}>
                  View All Projects
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {student.projects.filter(p => p.featured).map(project => (
                <Card key={project.id} className="hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-blue-600 shadow-lg">
                        Complexity: {project.aiAnalysis?.complexityScore}/100
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 5).map(tech => (
                          <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-blue-600">{project.aiAnalysis?.complexityScore}</div>
                        <div className="text-xs text-blue-700">Complexity</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-purple-600">{project.aiAnalysis?.innovationScore}</div>
                        <div className="text-xs text-purple-700">Innovation</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-green-600">{project.aiAnalysis?.marketRelevance}/10</div>
                        <div className="text-xs text-green-700">Market Fit</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Skills & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.skills.map(skill => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <Badge variant="secondary">{skill.category}</Badge>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA Section for Visitors */}
          {!isOwner && (
            <section className="mb-12">
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
                <CardContent className="p-12 text-center">
                  <h2 className="text-4xl font-bold mb-4">
                    Build Your Own Portfolio
                  </h2>
                  <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Join {student.firstName} and thousands of other students on InTransparency.
                    Showcase your projects, get discovered by recruiters, and land your dream job.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                      <Link href="/auth/register/student">
                        Create Free Portfolio
                        <Star className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                      <Link href="/how-it-works">
                        Learn More
                      </Link>
                    </Button>
                  </div>
                  <p className="text-sm text-blue-200 mt-6">
                    ✓ 100% Free for Students  ✓ AI-Powered Analysis  ✓ Get Discovered by Top Companies
                  </p>

                  {/* Powered by InTransparency */}
                  <div className="mt-8 pt-8 border-t border-white/20">
                    <p className="text-sm text-blue-100">
                      Powered by <a href="/" className="text-white font-bold hover:underline">InTransparency</a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Share Section */}
          <section>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share This Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button onClick={shareOnLinkedIn} className="bg-[#0077B5] hover:bg-[#006399] text-white">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Share on LinkedIn
                  </Button>
                  <Button onClick={shareOnTwitter} className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share on Twitter
                  </Button>
                  <Button onClick={copyLink} variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
