'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { studentsApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import {
  User,
  Users,
  MapPin,
  Calendar,
  Star,
  Award,
  BookOpen,
  Code,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Eye,
  TrendingUp,
  Target,
  Building,
  GraduationCap,
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Student {
  id: string
  name: string
  avatar?: string
  title: string
  university: string
  location: string
  graduation: string
  gpa: number
  year: string
  major: string
  minor: string
  skills: Array<{
    name: string
    level: string
    years: number
  }>
  projects: Array<{
    id: number
    name: string
    description: string
    technologies: string[]
    github?: string
    demo?: string
    featured: boolean
    stars: number
    forks: number
  }>
  experience: Array<{
    company: string
    position: string
    duration: string
    description: string
    type: string
  }>
  achievements: Array<{
    title: string
    year: string
    type: string
  }>
  aiScore: number
  profileViews: number
  connections: number
  availability: string
  preferredRoles: string[]
  salaryExpectation: string
  workPreference: string
  visaStatus: string
  languages: string[]
  interests: string[]
  contact: {
    email: string
    phone: string
    linkedin: string
    github: string
    website: string
  }
  coursework: string[]
}

interface StudentPageProps {
  params: {
    id: string
  }
}

export default function StudentPage({ params }: StudentPageProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await studentsApi.getById(params.id)
        setStudent(response.data)
      } catch (err: any) {
        if (err.response?.status === 404) {
          notFound()
        } else {
          setError('Failed to load student data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading student profile...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Student</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!student) {
    notFound()
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-800'
      case 'Advanced': return 'bg-blue-100 text-blue-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Beginner': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'academic': return <GraduationCap className="h-4 w-4 text-blue-500" />
      case 'award': return <Award className="h-4 w-4 text-yellow-500" />
      case 'competition': return <Target className="h-4 w-4 text-green-500" />
      case 'publication': return <BookOpen className="h-4 w-4 text-purple-500" />
      default: return <Star className="h-4 w-4 text-gray-700" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {(student.name || '').split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{student.name}</h1>
                <p className="text-xl text-gray-600 mb-4">{student.title}</p>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    {student.university}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {student.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Class of {student.graduation}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    GPA {student.gpa}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{student.year}</Badge>
                  <Badge variant="secondary">{student.major}</Badge>
                  <Badge variant="secondary">{student.availability}</Badge>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    AI Score: {student.aiScore}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Featured Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(student.projects || []).filter((p: any) => p.featured).map((project: any) => (
                    <div key={project.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                          <p className="text-gray-600">{project.description}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(project.technologies || []).map((tech: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            {project.stars}
                          </div>
                          <div className="flex items-center">
                            <Code className="h-4 w-4 mr-1" />
                            {project.forks} forks
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {project.demo && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3 w-3 mr-1" />
                                Demo
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3 mr-1" />
                              Code
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-center">
                    <Button variant="outline" asChild>
                      <Link href={`/students/${student.id}/projects`}>
                        View All Projects ({student.projects.length})
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.skills.map((skill: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <Badge className={getSkillLevelColor(skill.level)}>
                          {skill.level}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {skill.years} {skill.years === 1 ? 'year' : 'years'} experience
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {student.experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <Badge variant="outline" className="text-xs">
                          {exp.type}
                        </Badge>
                      </div>
                      <p className="text-blue-600 font-medium mb-1">{exp.company}</p>
                      <p className="text-gray-600 text-sm mb-2">{exp.duration}</p>
                      <p className="text-gray-700 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements & Awards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.achievements.map((achievement: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getAchievementIcon(achievement.type)}
                      <div>
                        <p className="font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coursework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Relevant Coursework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.coursework.map((course: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {course}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
              </CardContent>
            </Card>

            {/* Student Details */}
            <Card>
              <CardHeader>
                <CardTitle>Student Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Major</span>
                  <span className="font-semibold">{student.major}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Minor</span>
                  <span className="font-semibold">{student.minor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">GPA</span>
                  <span className="font-semibold">{student.gpa}/4.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Graduation</span>
                  <span className="font-semibold">{student.graduation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Visa Status</span>
                  <span className="font-semibold">{student.visaStatus}</span>
                </div>
              </CardContent>
            </Card>

            {/* Career Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Career Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preferred Roles</p>
                  <div className="space-y-1">
                    {student.preferredRoles.map((role: string, index: number) => (
                      <Badge key={index} variant="outline" className="block w-fit text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Salary Range</span>
                  <span className="font-semibold text-green-600">{student.salaryExpectation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Work Preference</span>
                  <span className="font-semibold">{student.workPreference}</span>
                </div>
              </CardContent>
            </Card>

            {/* Profile Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-gray-600">Profile Views</span>
                  </div>
                  <span className="font-semibold">{student.profileViews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-gray-600">Connections</span>
                  </div>
                  <span className="font-semibold">{student.connections}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-gray-600">AI Score</span>
                  </div>
                  <span className="font-semibold text-green-600">{student.aiScore}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-600 mr-2" />
                  <a href={`mailto:${student.contact.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                    {student.contact.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-900">{student.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Linkedin className="h-4 w-4 text-gray-600 mr-2" />
                  <a href={student.contact.linkedin} className="text-sm text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center">
                  <Github className="h-4 w-4 text-gray-600 mr-2" />
                  <a href={student.contact.github} className="text-sm text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    GitHub Profile
                  </a>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-600 mr-2" />
                  <a href={student.contact.website} className="text-sm text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    Personal Website
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {student.languages.map((language: string, index: number) => (
                    <div key={index} className="text-sm text-gray-700">
                      {language}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}