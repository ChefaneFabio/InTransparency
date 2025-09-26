'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  Eye, 
  Download,
  MapPin, 
  School, 
  Calendar,
  Code,
  Brain,
  Zap,
  Target,
  Mail,
  Phone,
  ExternalLink,
  Bookmark,
  Grid3X3,
  List,
  SortAsc,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function CandidatesPage() {
  const { user } = useAuth()
  const [candidates, setCandidates] = useState<any[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [universityFilter, setUniversityFilter] = useState('all')
  const [skillFilter, setSkillFilter] = useState('all')
  const [graduationYearFilter, setGraduationYearFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('match')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchCandidates()
  }, [user])

  useEffect(() => {
    filterAndSortCandidates()
  }, [candidates, searchQuery, universityFilter, skillFilter, graduationYearFilter, locationFilter, sortBy])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      
      // Mock comprehensive candidate data
      const mockCandidates = [
        {
          id: 1,
          firstName: "Alex",
          lastName: "Johnson",
          email: "alex.johnson@stanford.edu",
          phone: "+1 (555) 123-4567",
          university: "Stanford University",
          degree: "B.S. Computer Science",
          major: "Computer Science",
          minor: "Mathematics",
          graduationYear: "2025",
          gpa: "3.8",
          avatar: "/api/placeholder/120/120",
          location: "San Francisco, CA",
          bio: "Passionate CS student focused on AI and full-stack development. Love building innovative solutions.",
          
          // Matching & Scores
          matchScore: 94,
          avgInnovationScore: 87,
          projects: 5,
          totalProjectViews: 1847,
          
          // Skills with proficiency levels
          skills: [
            { name: "React", level: 90, category: "Frontend" },
            { name: "TypeScript", level: 85, category: "Language" },
            { name: "Node.js", level: 80, category: "Backend" },
            { name: "Python", level: 85, category: "Language" },
            { name: "AI/ML", level: 75, category: "Specialty" },
            { name: "PostgreSQL", level: 70, category: "Database" }
          ],
          
          // Projects
          topProjects: [
            {
              title: "AI-Powered Task Management",
              description: "Full-stack app with GPT-4 integration for intelligent task organization",
              technologies: ["React", "Node.js", "OpenAI API", "PostgreSQL"],
              innovationScore: 92,
              repositoryUrl: "https://github.com/alex/ai-task-manager"
            },
            {
              title: "Real-time Collaboration Platform",
              description: "WebSocket-based collaborative workspace with live editing",
              technologies: ["React", "Socket.io", "Express", "MongoDB"],
              innovationScore: 84,
              repositoryUrl: "https://github.com/alex/collab-platform"
            }
          ],
          
          // Activity & Status
          lastActive: "2 hours ago",
          joinedDate: "2023-09-15",
          profileViews: 234,
          recruiterViews: 43,
          isBookmarked: true,
          isContacted: false,
          applicationStatus: null,
          
          // Social & Links
          githubUrl: "https://github.com/alexjohnson",
          linkedinUrl: "https://linkedin.com/in/alexjohnson",
          portfolioUrl: "https://alexjohnson.dev",
          
          // Preferences
          jobPreferences: {
            roles: ["Full Stack Developer", "Software Engineer"],
            locations: ["San Francisco", "Remote"],
            salaryRange: "$80k - $120k",
            workTypes: ["Full-time", "Internship"]
          },
          
          // Achievements
          achievements: ["Innovation Pioneer", "Open Source Contributor", "Dean's List"]
        },
        {
          id: 2,
          firstName: "Sarah",
          lastName: "Chen",
          email: "sarah.chen@mit.edu",
          phone: "+1 (555) 234-5678",
          university: "MIT",
          degree: "B.S. Computer Science & AI",
          major: "Computer Science",
          minor: "Artificial Intelligence",
          graduationYear: "2024",
          gpa: "3.9",
          avatar: "/api/placeholder/120/120",
          location: "Boston, MA",
          bio: "AI researcher with expertise in machine learning and neural networks. Published researcher.",
          
          matchScore: 92,
          avgInnovationScore: 91,
          projects: 7,
          totalProjectViews: 2156,
          
          skills: [
            { name: "Python", level: 95, category: "Language" },
            { name: "TensorFlow", level: 90, category: "AI/ML" },
            { name: "PyTorch", level: 88, category: "AI/ML" },
            { name: "React", level: 75, category: "Frontend" },
            { name: "AWS", level: 80, category: "Cloud" },
            { name: "Docker", level: 70, category: "DevOps" }
          ],
          
          topProjects: [
            {
              title: "Neural Network Trading Algorithm",
              description: "Deep learning model for cryptocurrency trading with 23% ROI",
              technologies: ["Python", "TensorFlow", "Pandas", "NumPy"],
              innovationScore: 96,
              repositoryUrl: "https://github.com/sarah/neural-trading"
            },
            {
              title: "Computer Vision Medical Diagnosis",
              description: "CNN model for early detection of skin cancer from images",
              technologies: ["Python", "PyTorch", "OpenCV", "Flask"],
              innovationScore: 94,
              repositoryUrl: "https://github.com/sarah/medical-cv"
            }
          ],
          
          lastActive: "1 day ago",
          joinedDate: "2023-08-20",
          profileViews: 345,
          recruiterViews: 67,
          isBookmarked: false,
          isContacted: true,
          applicationStatus: "interview_scheduled",
          
          githubUrl: "https://github.com/sarahchen",
          linkedinUrl: "https://linkedin.com/in/sarahchen",
          portfolioUrl: "https://sarahchen.ai",
          
          jobPreferences: {
            roles: ["AI Engineer", "Machine Learning Engineer", "Research Scientist"],
            locations: ["Boston", "San Francisco", "Remote"],
            salaryRange: "$90k - $140k",
            workTypes: ["Full-time", "Research"]
          },
          
          achievements: ["Research Publication", "AI Competition Winner", "Summa Cum Laude"]
        },
        {
          id: 3,
          firstName: "Michael",
          lastName: "Rodriguez",
          email: "michael.r@berkeley.edu",
          phone: "+1 (555) 345-6789",
          university: "UC Berkeley",
          degree: "B.S. EECS",
          major: "Electrical Engineering & Computer Science",
          minor: null,
          graduationYear: "2025",
          gpa: "3.7",
          avatar: "/api/placeholder/120/120",
          location: "Berkeley, CA",
          bio: "Backend systems enthusiast with experience in distributed systems and cloud architecture.",
          
          matchScore: 89,
          avgInnovationScore: 83,
          projects: 4,
          totalProjectViews: 932,
          
          skills: [
            { name: "Java", level: 92, category: "Language" },
            { name: "Spring Boot", level: 88, category: "Backend" },
            { name: "PostgreSQL", level: 85, category: "Database" },
            { name: "Docker", level: 82, category: "DevOps" },
            { name: "Kubernetes", level: 75, category: "DevOps" },
            { name: "AWS", level: 80, category: "Cloud" }
          ],
          
          topProjects: [
            {
              title: "Distributed Systems Monitor",
              description: "Real-time monitoring platform for microservices with auto-scaling",
              technologies: ["Java", "Spring Boot", "Kafka", "Redis", "Docker"],
              innovationScore: 86,
              repositoryUrl: "https://github.com/michael/systems-monitor"
            },
            {
              title: "E-commerce Backend API",
              description: "Scalable REST API handling 10k+ requests/minute with 99.9% uptime",
              technologies: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
              innovationScore: 81,
              repositoryUrl: "https://github.com/michael/ecommerce-api"
            }
          ],
          
          lastActive: "3 hours ago",
          joinedDate: "2023-10-02",
          profileViews: 178,
          recruiterViews: 29,
          isBookmarked: true,
          isContacted: false,
          applicationStatus: null,
          
          githubUrl: "https://github.com/michaelr",
          linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
          portfolioUrl: "https://michaelr.dev",
          
          jobPreferences: {
            roles: ["Backend Engineer", "Systems Engineer", "DevOps Engineer"],
            locations: ["San Francisco", "Seattle", "Remote"],
            salaryRange: "$75k - $115k",
            workTypes: ["Full-time", "Internship"]
          },
          
          achievements: ["System Architecture Award", "Hackathon Winner", "Open Source Maintainer"]
        },
        {
          id: 4,
          firstName: "Emma",
          lastName: "Wilson",
          email: "emma.wilson@caltech.edu",
          phone: "+1 (555) 456-7890",
          university: "Caltech",
          degree: "B.S. Computer Science",
          major: "Computer Science",
          minor: "Applied Mathematics",
          graduationYear: "2024",
          gpa: "3.95",
          avatar: "/api/placeholder/120/120",
          location: "Pasadena, CA",
          bio: "Frontend specialist and UX enthusiast. Passionate about creating beautiful, accessible user experiences.",
          
          matchScore: 87,
          avgInnovationScore: 89,
          projects: 6,
          totalProjectViews: 1456,
          
          skills: [
            { name: "React", level: 95, category: "Frontend" },
            { name: "TypeScript", level: 90, category: "Language" },
            { name: "Next.js", level: 88, category: "Frontend" },
            { name: "Tailwind CSS", level: 92, category: "Styling" },
            { name: "Figma", level: 85, category: "Design" },
            { name: "Node.js", level: 75, category: "Backend" }
          ],
          
          topProjects: [
            {
              title: "Accessible Design System",
              description: "Comprehensive React component library with WCAG 2.1 AA compliance",
              technologies: ["React", "TypeScript", "Storybook", "Jest"],
              innovationScore: 91,
              repositoryUrl: "https://github.com/emma/accessible-components"
            },
            {
              title: "Data Visualization Dashboard",
              description: "Interactive dashboard for complex dataset exploration with D3.js",
              technologies: ["React", "D3.js", "TypeScript", "Python"],
              innovationScore: 88,
              repositoryUrl: "https://github.com/emma/data-viz-dashboard"
            }
          ],
          
          lastActive: "5 hours ago",
          joinedDate: "2023-09-10",
          profileViews: 298,
          recruiterViews: 52,
          isBookmarked: false,
          isContacted: false,
          applicationStatus: null,
          
          githubUrl: "https://github.com/emmawilson",
          linkedinUrl: "https://linkedin.com/in/emmawilson",
          portfolioUrl: "https://emmawilson.design",
          
          jobPreferences: {
            roles: ["Frontend Engineer", "UI/UX Developer", "Product Engineer"],
            locations: ["Los Angeles", "San Francisco", "Remote"],
            salaryRange: "$80k - $125k",
            workTypes: ["Full-time"]
          },
          
          achievements: ["Design Excellence Award", "Accessibility Champion", "Tech Conference Speaker"]
        }
      ]
      
      setCandidates(mockCandidates)
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCandidates = () => {
    let filtered = [...candidates]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some((skill: any) => skill.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.topProjects.some((project: any) => 
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.technologies.some((tech: any) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    }

    // University filter
    if (universityFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.university === universityFilter)
    }

    // Skill filter
    if (skillFilter !== 'all') {
      filtered = filtered.filter(candidate => 
        candidate.skills.some((skill: any) => skill.name === skillFilter)
      )
    }

    // Graduation year filter
    if (graduationYearFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.graduationYear === graduationYearFilter)
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(candidate => 
        candidate.location.includes(locationFilter) ||
        candidate.jobPreferences.locations.some((loc: any) => loc.includes(locationFilter))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case 'university':
          return a.university.localeCompare(b.university)
        case 'gpa':
          return parseFloat(b.gpa) - parseFloat(a.gpa)
        case 'innovation':
          return b.avgInnovationScore - a.avgInnovationScore
        case 'projects':
          return b.projects - a.projects
        case 'recent':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        default: // match
          return b.matchScore - a.matchScore
      }
    })

    setFilteredCandidates(filtered)
  }

  const toggleBookmark = async (candidateId: number) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, isBookmarked: !candidate.isBookmarked }
        : candidate
    ))
  }

  const contactCandidate = async (candidateId: number) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, isContacted: true }
        : candidate
    ))
  }

  const getUniversities = () => {
    const universities = Array.from(new Set(candidates.map(c => c.university)))
    return universities.sort()
  }

  const getTopSkills = () => {
    const skillCounts: any = {}
    candidates.forEach((candidate: any) => {
      candidate.skills.forEach((skill: any) => {
        skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1
      })
    })
    return Object.entries(skillCounts)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 10)
      .map(([skill]: any) => skill)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Candidate Search</h1>
            <p className="text-gray-600">Find and connect with top university talent</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_: any, i: number) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Search</h1>
          <p className="text-gray-600 mt-1">
            Discover and connect with talented students from top universities
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/recruiter/saved-candidates">
              <Bookmark className="mr-2 h-4 w-4" />
              Saved ({candidates.filter(c => c.isBookmarked).length})
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/recruiter/post-job">
              <Plus className="mr-2 h-4 w-4" />
              Post Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">{filteredCandidates.length}</div>
              <div className="ml-2 text-sm text-gray-600">Candidates Found</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(filteredCandidates.reduce((acc, c) => acc + c.matchScore, 0) / filteredCandidates.length) || 0}%
              </div>
              <div className="ml-2 text-sm text-gray-600">Avg Match</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">
                {candidates.filter(c => c.isBookmarked).length}
              </div>
              <div className="ml-2 text-sm text-gray-600">Bookmarked</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">
                {candidates.filter(c => c.isContacted).length}
              </div>
              <div className="ml-2 text-sm text-gray-600">Contacted</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, university, skills, or projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Select value={universityFilter} onValueChange={setUniversityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {getUniversities().map((university: any) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {getTopSkills().map((skill: any) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={graduationYearFilter} onValueChange={setGraduationYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Graduation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="Boston">Boston</SelectItem>
                  <SelectItem value="Seattle">Seattle</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="gpa">GPA</SelectItem>
                  <SelectItem value="innovation">Innovation Score</SelectItem>
                  <SelectItem value="projects">Project Count</SelectItem>
                  <SelectItem value="recent">Recently Joined</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setUniversityFilter('all')
                  setSkillFilter('all')
                  setGraduationYearFilter('all')
                  setLocationFilter('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredCandidates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No candidates found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more candidates.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setUniversityFilter('all')
                setSkillFilter('all')
                setGraduationYearFilter('all')
                setLocationFilter('all')
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate: any) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{candidate.university}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-lg font-bold text-blue-600">
                          {candidate.matchScore}%
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(candidate.id)}
                          className={candidate.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
                        >
                          <Star className={`h-4 w-4 ${candidate.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <School className="h-4 w-4 mr-2" />
                        {candidate.degree} • Class of {candidate.graduationYear}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {candidate.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Zap className="h-4 w-4 mr-2" />
                        {candidate.avgInnovationScore} avg innovation • {candidate.projects} projects
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{candidate.bio}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {candidate.skills.slice(0, 3).map((skill: any) => (
                        <Badge key={skill.name} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/dashboard/recruiter/candidates/${candidate.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => contactCandidate(candidate.id)}
                        disabled={candidate.isContacted}
                      >
                        {candidate.isContacted ? (
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contacted
                          </div>
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCandidates.map((candidate: any) => (
                <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="text-lg">
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {candidate.firstName} {candidate.lastName}
                              </h3>
                              <p className="text-gray-600">{candidate.degree}</p>
                              <p className="text-sm text-gray-500">{candidate.university} • Class of {candidate.graduationYear}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {candidate.location}
                            </span>
                            <span className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              GPA: {candidate.gpa}
                            </span>
                            <span className="flex items-center">
                              <Code className="h-4 w-4 mr-1" />
                              {candidate.projects} projects
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {candidate.profileViews} views
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2">{candidate.bio}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {candidate.skills.slice(0, 6).map((skill: any) => (
                              <Badge key={skill.name} variant="secondary" className="text-xs">
                                {skill.name} ({skill.level}%)
                              </Badge>
                            ))}
                            {candidate.skills.length > 6 && (
                              <Badge variant="secondary" className="text-xs">
                                +{candidate.skills.length - 6} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {candidate.topProjects.slice(0, 2).map((project: any, index: number) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 text-sm mb-1">{project.title}</h4>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    Score: {project.innovationScore}
                                  </Badge>
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
                                    <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-3 ml-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{candidate.matchScore}%</div>
                          <div className="text-xs text-gray-500">Match Score</div>
                          <div className="text-sm font-medium text-green-600 mt-1">
                            {candidate.avgInnovationScore} Innovation
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(candidate.id)}
                            className={candidate.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
                          >
                            <Star className={`h-4 w-4 ${candidate.isBookmarked ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/recruiter/candidates/${candidate.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Profile
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => contactCandidate(candidate.id)}
                            disabled={candidate.isContacted}
                          >
                            {candidate.isContacted ? (
                              <>
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Contacted
                              </>
                            ) : (
                              <>
                                <Mail className="h-4 w-4 mr-1" />
                                Contact
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}