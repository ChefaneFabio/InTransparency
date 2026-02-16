'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Mail,
  School,
  Save,
  Edit3,
  Camera,
  Github,
  Globe,
  Eye,
  FileText,
  Sparkles,
  AlertCircle,
  Users,
  Briefcase
} from 'lucide-react'

interface ProfileData {
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    photo: string | null
    bio: string | null
    tagline: string | null
    university: string | null
    degree: string | null
    graduationYear: string | null
    gpa: string | null
    gpaPublic: boolean
    profilePublic: boolean
    portfolioUrl: string | null
    subscriptionTier: string
    showLocation: boolean
    showEmail: boolean
    showPhone: boolean
  }
  skills: Array<{ name: string; level: number; projectCount: number }>
  stats: {
    profileViews: number
    recruiterViews: number
    totalApplications: number
    totalProjects: number
  }
  profileCompletion: number
  completionItems: Array<{ field: string; label: string; filled: boolean }>
  projects: Array<{
    id: string
    title: string
    skills: string[]
    technologies: string[]
    views: number
    recruiterViews: number
    githubUrl: string | null
  }>
  githubUrl: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [generatingCV, setGeneratingCV] = useState(false)

  // Editable fields
  const [editBio, setEditBio] = useState('')
  const [editTagline, setEditTagline] = useState('')
  const [editPortfolioUrl, setEditPortfolioUrl] = useState('')
  const [editProfilePublic, setEditProfilePublic] = useState(false)
  const [editShowEmail, setEditShowEmail] = useState(false)
  const [editGpaPublic, setEditGpaPublic] = useState(false)

  const fetchProfile = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/dashboard/student/profile')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load profile')
        return res.json()
      })
      .then((data: ProfileData) => {
        setProfile(data)
        setEditBio(data.user.bio || '')
        setEditTagline(data.user.tagline || '')
        setEditPortfolioUrl(data.user.portfolioUrl || '')
        setEditProfilePublic(data.user.profilePublic)
        setEditShowEmail(data.user.showEmail)
        setEditGpaPublic(data.user.gpaPublic)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: editBio,
          tagline: editTagline,
          portfolioUrl: editPortfolioUrl,
          profilePublic: editProfilePublic,
          showEmail: editShowEmail,
          gpaPublic: editGpaPublic,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to save profile')
        return
      }

      setEditing(false)
      fetchProfile()
    } catch {
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const generateCV = async () => {
    if (!profile) return
    setGeneratingCV(true)
    try {
      const cvData = {
        personal: {
          name: `${profile.user.firstName || ''} ${profile.user.lastName || ''}`.trim(),
          email: profile.user.email,
          university: profile.user.university,
          degree: profile.user.degree,
          graduationYear: profile.user.graduationYear,
          gpa: profile.user.gpa,
          portfolio: profile.user.portfolioUrl,
          github: profile.githubUrl,
        },
        bio: profile.user.bio,
        skills: profile.skills,
        projects: profile.projects.map(p => ({
          title: p.title,
          skills: p.skills,
          technologies: p.technologies,
          githubUrl: p.githubUrl,
        })),
        stats: profile.stats,
      }

      const blob = new Blob([JSON.stringify(cvData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CV_${profile.user.firstName || 'student'}_${profile.user.lastName || ''}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to generate CV.')
    } finally {
      setGeneratingCV(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-32 w-full rounded-lg" />
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

  if (error || !profile) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to Load Profile</h2>
            <p className="text-muted-foreground mb-4">{error || 'Profile not found'}</p>
            <Button onClick={fetchProfile}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { user, skills, stats, profileCompletion, completionItems, projects, githubUrl } = profile

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg relative">
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={user.photo || ''} />
                <AvatarFallback className="text-2xl">
                  {(user.firstName || '?')[0]}{(user.lastName || '?')[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-card"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 pt-16 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.firstName || ''} {user.lastName || ''}
                  </h1>
                  {user.tagline && <p className="text-muted-foreground italic">{user.tagline}</p>}
                  {user.degree && user.university && (
                    <p className="text-muted-foreground">{user.degree} - {user.university}</p>
                  )}
                  {user.graduationYear && <p className="text-foreground/80 text-sm">Class of {user.graduationYear}</p>}
                </div>

                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <Button
                    variant={editing ? "default" : "outline"}
                    onClick={() => editing ? saveProfile() : setEditing(true)}
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : editing ? (
                      <Save className="mr-2 h-4 w-4" />
                    ) : (
                      <Edit3 className="mr-2 h-4 w-4" />
                    )}
                    {editing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
                  </Button>

                  {editing && (
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={generateCV}
                    disabled={generatingCV}
                  >
                    {generatingCV ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate CV
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing ? (
                    <>
                      <div>
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={editTagline}
                          onChange={(e) => setEditTagline(e.target.value)}
                          placeholder="A short description of yourself"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={4}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Tell recruiters about yourself..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="portfolio">Portfolio URL</Label>
                        <Input
                          id="portfolio"
                          value={editPortfolioUrl}
                          onChange={(e) => setEditPortfolioUrl(e.target.value)}
                          placeholder="https://yourportfolio.com"
                        />
                        {user.subscriptionTier !== 'STUDENT_PREMIUM' && (
                          <p className="text-xs text-amber-600 mt-1">Premium feature - upgrade to set a custom URL</p>
                        )}
                      </div>
                      <div className="space-y-3 border-t pt-4">
                        <h4 className="text-sm font-medium">Privacy Settings</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="profilePublic">Public Profile</Label>
                          <Switch
                            id="profilePublic"
                            checked={editProfilePublic}
                            onCheckedChange={setEditProfilePublic}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showEmail">Show Email</Label>
                          <Switch
                            id="showEmail"
                            checked={editShowEmail}
                            onCheckedChange={setEditShowEmail}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="gpaPublic">Show GPA</Label>
                          <Switch
                            id="gpaPublic"
                            checked={editGpaPublic}
                            onCheckedChange={setEditGpaPublic}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </div>

                      {user.bio && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium text-foreground mb-2">About</h4>
                          <p className="text-foreground/80 leading-relaxed">{user.bio}</p>
                        </div>
                      )}

                      {!user.bio && (
                        <div className="pt-4 border-t text-muted-foreground italic text-sm">
                          No bio yet. Click &quot;Edit Profile&quot; to add one.
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <School className="mr-2 h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.university || user.degree ? (
                    <div className="space-y-2">
                      {user.degree && <h3 className="font-semibold text-foreground">{user.degree}</h3>}
                      {user.university && <p className="text-muted-foreground">{user.university}</p>}
                      <div className="flex items-center space-x-4 text-sm text-foreground/80">
                        {user.graduationYear && <span>Class of {user.graduationYear}</span>}
                        {user.gpa && user.gpaPublic && <span>GPA: {user.gpa}</span>}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">No education info added yet.</p>
                  )}
                </CardContent>
              </Card>

              {/* Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {user.portfolioUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Portfolio
                        </a>
                      </Button>
                    )}
                    {!githubUrl && !user.portfolioUrl && (
                      <p className="text-muted-foreground italic text-sm">No links yet. Add projects with GitHub URLs to show them here.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills (derived from projects)</CardTitle>
                  <CardDescription>
                    Skills are automatically detected from your uploaded projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {skills.length > 0 ? (
                    <div className="space-y-4">
                      {skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-foreground">{skill.name}</span>
                            <span className="text-sm text-foreground/80">
                              {skill.level}% ({skill.projectCount} {skill.projectCount === 1 ? 'project' : 'projects'})
                            </span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No skills detected</h3>
                      <p className="text-muted-foreground">Upload projects to have your skills automatically analyzed.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {project.views} views
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.skills.concat(project.technologies).slice(0, 8).map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {project.recruiterViews} recruiter views
                        </span>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Github className="h-3 w-3" />
                            Source
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
                    <p className="text-muted-foreground">Upload your first project to build your portfolio.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Profile Views (30d)</span>
                <span className="font-semibold">{stats.profileViews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recruiter Views (30d)</span>
                <span className="font-semibold">{stats.recruiterViews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Projects</span>
                <span className="font-semibold">{stats.totalProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Applications</span>
                <span className="font-semibold">{stats.totalApplications}</span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Completeness</span>
                  <span>{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />

                <div className="space-y-2 text-sm mt-4">
                  {completionItems.map((item) => (
                    <div key={item.field} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${item.filled ? 'bg-green-500' : 'bg-muted-foreground/60'}`}></div>
                      <span className={item.filled ? 'text-muted-foreground' : 'text-muted-foreground/60'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                Preview Public Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={generateCV}
                disabled={generatingCV}
              >
                <FileText className="mr-2 h-4 w-4" />
                {generatingCV ? 'Generating CV...' : 'Generate Academic CV'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
