'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  School, 
  Briefcase,
  Save,
  Edit3,
  Camera,
  Github,
  Linkedin,
  Globe,
  Award,
  Code,
  BookOpen,
  Target,
  TrendingUp,
  Star,
  Zap,
  Brain,
  Users,
  Eye,
  Download
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      // Mock profile data
      const mockProfile = {
        id: user?.id,
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex.johnson@university.edu",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        bio: "Passionate computer science student with a focus on AI and full-stack development. I love building innovative solutions that solve real-world problems and have experience with modern web technologies and machine learning frameworks.",
        avatar: "/api/placeholder/120/120",
        university: "Stanford University",
        degree: "Bachelor of Science in Computer Science",
        graduationYear: "2025",
        gpa: "3.8",
        major: "Computer Science",
        minor: "Mathematics",
        
        // Social Links
        githubUrl: "https://github.com/alexjohnson",
        linkedinUrl: "https://linkedin.com/in/alexjohnson",
        portfolioUrl: "https://alexjohnson.dev",
        
        // Skills & Preferences
        skills: [
          { name: "React", level: 90, category: "Frontend" },
          { name: "TypeScript", level: 85, category: "Language" },
          { name: "Node.js", level: 80, category: "Backend" },
          { name: "Python", level: 85, category: "Language" },
          { name: "PostgreSQL", level: 75, category: "Database" },
          { name: "AWS", level: 70, category: "Cloud" },
          { name: "Docker", level: 65, category: "DevOps" },
          { name: "Machine Learning", level: 75, category: "AI" },
          { name: "TensorFlow", level: 70, category: "AI" },
          { name: "Git", level: 95, category: "Tools" }
        ],
        
        interests: ["Artificial Intelligence", "Web Development", "Open Source", "Startups", "Gaming"],
        jobPreferences: {
          roles: ["Full Stack Developer", "Software Engineer", "AI Engineer"],
          locations: ["San Francisco", "Remote", "New York"],
          salaryMin: 80000,
          salaryMax: 120000,
          workTypes: ["Full-time", "Internship"],
          companySize: ["Startup", "Medium", "Large"]
        },
        
        // Statistics
        stats: {
          profileViews: 234,
          projectViews: 1847,
          recruiterViews: 43,
          averageInnovationScore: 87,
          totalProjects: 5,
          githubContributions: 423,
          endorsements: 12
        },
        
        // Recent Activity
        recentActivity: [
          { type: "project", action: "updated", target: "AI Task Manager", date: "2 hours ago" },
          { type: "profile", action: "viewed", target: "Google Recruiter", date: "1 day ago" },
          { type: "skill", action: "endorsed", target: "React", date: "2 days ago" },
          { type: "job", action: "applied", target: "Software Engineer at TechStart", date: "3 days ago" }
        ],
        
        // Achievements
        achievements: [
          { 
            title: "Innovation Pioneer", 
            description: "Achieved 85+ innovation score on 3+ projects",
            icon: "🚀",
            date: "2024-01-15"
          },
          { 
            title: "Tech Polyglot", 
            description: "Demonstrated proficiency in 5+ programming languages",
            icon: "💻",
            date: "2024-01-10"
          },
          { 
            title: "Community Builder", 
            description: "Open source contributions to 10+ repositories",
            icon: "👥",
            date: "2024-01-05"
          }
        ]
      }
      
      setProfile(mockProfile)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEditing(false)
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const getSkillColor = (level: number) => {
    if (level >= 90) return "bg-green-500"
    if (level >= 75) return "bg-blue-500"
    if (level >= 60) return "bg-yellow-500"
    return "bg-gray-500"
  }

  const getSkillsByCategory = () => {
    const categories = profile.skills.reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    }, {})
    return categories
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
        <p className="text-gray-600">Unable to load profile information.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg relative">
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
        </div>
        
        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">
                  {profile.firstName[0]}{profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-white"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 pt-16 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-600">{profile.degree} • {profile.university}</p>
                  <p className="text-gray-500 text-sm">Class of {profile.graduationYear}</p>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <Button 
                    variant={editing ? "default" : "outline"}
                    onClick={() => editing ? saveProfile() : setEditing(true)}
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Edit3 className="mr-2 h-4 w-4" />
                    )}
                    {editing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                  
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Resume
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={4}
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{profile.location}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-2">About</h4>
                        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                      </div>
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
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{profile.degree}</h3>
                      <p className="text-gray-600">{profile.university}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                        <span>Class of {profile.graduationYear}</span>
                        <span>GPA: {profile.gpa}</span>
                        <span>Major: {profile.major}</span>
                        {profile.minor && <span>Minor: {profile.minor}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={profile.githubUrl}
                          onChange={(e) => setProfile({...profile, githubUrl: e.target.value})}
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={profile.linkedinUrl}
                          onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="portfolio">Portfolio</Label>
                        <Input
                          id="portfolio"
                          value={profile.portfolioUrl}
                          onChange={(e) => setProfile({...profile, portfolioUrl: e.target.value})}
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      {profile.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {profile.linkedinUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 h-4 w-4" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {profile.portfolioUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                            <Globe className="mr-2 h-4 w-4" />
                            Portfolio
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-6">
              {/* Skills by Category */}
              {Object.entries(getSkillsByCategory()).map(([category, skills]: [string, any]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skills.map((skill: any) => (
                        <div key={skill.name}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">{skill.name}</span>
                            <span className="text-sm text-gray-500">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest: string) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              {/* Job Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Preferences</CardTitle>
                  <CardDescription>
                    Help us find the perfect opportunities for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Desired Roles</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.jobPreferences.roles.map((role: string) => (
                        <Badge key={role} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Preferred Locations</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.jobPreferences.locations.map((location: string) => (
                        <Badge key={location} variant="outline">
                          <MapPin className="mr-1 h-3 w-3" />
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Salary Range</Label>
                    <p className="text-gray-600 mt-1">
                      ${profile.jobPreferences.salaryMin.toLocaleString()} - ${profile.jobPreferences.salaryMax.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Work Types</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.jobPreferences.workTypes.map((type: string) => (
                        <Badge key={type} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Company Size</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.jobPreferences.companySize.map((size: string) => (
                        <Badge key={size} variant="outline">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.recentActivity.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 pb-3 border-b last:border-b-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {activity.action} <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.achievements.map((achievement: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-semibold">{profile.stats.profileViews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Project Views</span>
                <span className="font-semibold">{profile.stats.projectViews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recruiter Views</span>
                <span className="font-semibold">{profile.stats.recruiterViews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Innovation Score</span>
                <span className="font-semibold text-blue-600">{profile.stats.averageInnovationScore}</span>
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
                  <span>Profile Completeness</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Basic information complete</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Skills added</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Add more projects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-400">Add portfolio projects</span>
                  </div>
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
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" />
                Update Job Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}