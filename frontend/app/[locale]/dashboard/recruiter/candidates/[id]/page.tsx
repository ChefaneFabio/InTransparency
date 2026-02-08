'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Mail,
  MapPin,
  School,
  Calendar,
  Eye,
  Heart,
  Send,
  AlertCircle
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Link } from '@/navigation'

interface Project {
  id: string
  title: string
  description: string | null
  technologies: string[]
  skills: string[]
  innovationScore: number | null
  complexityScore: number | null
  githubUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  views: number
  createdAt: string
}

interface Candidate {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  university: string | null
  degree: string | null
  graduationYear: number | null
  gpa: number | null
  bio: string | null
  tagline: string | null
  photo: string | null
  profilePublic: boolean
  projectCount: number
  projects: Project[]
}

export default function CandidateProfilePage() {
  const params = useParams()
  const candidateId = params.id as string

  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  useEffect(() => {
    if (!candidateId) return
    fetchCandidate()
  }, [candidateId])

  const fetchCandidate = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/dashboard/recruiter/candidates/${candidateId}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch candidate')
      }
      const data = await res.json()
      setCandidate(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = async () => {
    if (!candidate) return
    setBookmarkLoading(true)
    try {
      if (isBookmarked) {
        const res = await fetch('/api/dashboard/recruiter/saved-candidates', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: candidate.id }),
        })
        if (!res.ok) throw new Error('Failed to unsave candidate')
        setIsBookmarked(false)
      } else {
        const res = await fetch('/api/dashboard/recruiter/saved-candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: candidate.id }),
        })
        if (!res.ok) throw new Error('Failed to save candidate')
        setIsBookmarked(true)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setBookmarkLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!contactMessage.trim() || !contactSubject.trim() || !candidate) return

    // Need an email to send the message
    if (!candidate.email) {
      alert('This candidate has not made their email public. Unable to send a message.')
      return
    }

    setSendingMessage(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: candidate.id,
          recipientEmail: candidate.email,
          subject: contactSubject,
          content: contactMessage,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }
      setContactMessage('')
      setContactSubject('')
      setShowContactForm(false)
      setMessageSent(true)
      setTimeout(() => setMessageSent(false), 3000)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="relative">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="px-6 pb-6 -mt-16">
            <div className="flex items-end gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex-1 pt-20 space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !candidate) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Candidate Not Found'}
        </h1>
        <p className="text-gray-600 mb-6">The candidate profile you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/dashboard/recruiter/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Link>
        </Button>
      </div>
    )
  }

  const initials = `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`
  const allSkills = candidate.projects.reduce<string[]>((acc, project) => {
    const projectSkills = [
      ...(project.technologies || []),
      ...(project.skills || []),
    ]
    projectSkills.forEach(skill => {
      if (!acc.includes(skill)) acc.push(skill)
    })
    return acc
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/recruiter/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Link>
        </Button>

        <div className="flex items-center space-x-2">
          {messageSent && (
            <span className="text-sm text-green-600 font-medium">Message sent!</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleBookmark}
            disabled={bookmarkLoading}
            className={isBookmarked ? 'text-yellow-600 border-yellow-600' : ''}
          >
            <Star className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
          <Button size="sm" onClick={() => setShowContactForm(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg relative">
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-end space-y-4 lg:space-y-0 lg:space-x-6 -mt-20">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={candidate.photo || undefined} />
              <AvatarFallback className="text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pt-20 lg:pt-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {candidate.firstName} {candidate.lastName}
                  </h1>
                  {candidate.tagline && (
                    <p className="text-lg text-gray-600">{candidate.tagline}</p>
                  )}
                  {candidate.degree && (
                    <p className="text-gray-600">{candidate.degree}</p>
                  )}
                  {candidate.university && (
                    <p className="text-gray-700">
                      {candidate.university}
                      {candidate.graduationYear ? ` - Class of ${candidate.graduationYear}` : ''}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{candidate.projectCount}</div>
                    <div className="text-sm text-gray-700">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{allSkills.length}</div>
                    <div className="text-sm text-gray-700">Skills</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects ({candidate.projectCount})</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* About */}
              {candidate.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{candidate.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {candidate.email ? (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span>{candidate.email}</span>
                      <Button size="sm" variant="outline" onClick={() => setShowContactForm(true)}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Email is private. You can still contact this candidate through the platform.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              {(candidate.university || candidate.degree) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <School className="mr-2 h-5 w-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {candidate.degree && (
                        <h3 className="font-semibold text-gray-900">{candidate.degree}</h3>
                      )}
                      {candidate.university && (
                        <p className="text-gray-600">{candidate.university}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                        {candidate.graduationYear && (
                          <span>Class of {candidate.graduationYear}</span>
                        )}
                        {candidate.gpa !== null && (
                          <span>GPA: {candidate.gpa}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {candidate.projects.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground">No public projects yet.</p>
                  </CardContent>
                </Card>
              ) : (
                candidate.projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span>{project.title}</span>
                            {project.innovationScore !== null && (
                              <Badge variant="outline">Score: {project.innovationScore}</Badge>
                            )}
                          </CardTitle>
                          {project.description && (
                            <CardDescription className="mt-2">
                              {project.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                Code
                              </a>
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                Live
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.technologies && project.technologies.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Technologies</h4>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.skills && project.skills.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {project.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {project.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {project.imageUrl && (
                          <div>
                            <img
                              src={project.imageUrl}
                              alt={`${project.title} screenshot`}
                              className="w-full h-48 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              {allSkills.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground">No skills data available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills from Projects</CardTitle>
                    <CardDescription>
                      Technologies and skills demonstrated across {candidate.projectCount} projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setShowContactForm(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={toggleBookmark}
                disabled={bookmarkLoading}
              >
                <Star className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current text-yellow-600' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save Candidate'}
              </Button>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidate.university && (
                <div>
                  <p className="text-sm text-gray-500">University</p>
                  <p className="font-medium">{candidate.university}</p>
                </div>
              )}
              {candidate.degree && (
                <div>
                  <p className="text-sm text-gray-500">Degree</p>
                  <p className="font-medium">{candidate.degree}</p>
                </div>
              )}
              {candidate.graduationYear && (
                <div>
                  <p className="text-sm text-gray-500">Graduation Year</p>
                  <p className="font-medium">{candidate.graduationYear}</p>
                </div>
              )}
              {candidate.gpa !== null && (
                <div>
                  <p className="text-sm text-gray-500">GPA</p>
                  <p className="font-medium">{candidate.gpa}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Public Projects</p>
                <p className="font-medium">{candidate.projectCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Contact {candidate.firstName} {candidate.lastName}</CardTitle>
              <CardDescription>
                Send a personalized message to connect with this candidate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!candidate.email && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  This candidate has not made their email public. The message will be sent through the platform.
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                <Input
                  placeholder="Enter message subject..."
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
                <Textarea
                  placeholder="Write your message here..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowContactForm(false)} disabled={sendingMessage}>
                  Cancel
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!contactMessage.trim() || !contactSubject.trim() || sendingMessage}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
