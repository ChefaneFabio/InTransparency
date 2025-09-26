'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Star, 
  MessageSquare, 
  Mail, 
  Phone,
  MapPin, 
  School, 
  Calendar,
  Code,
  Brain,
  Zap,
  Target,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  TrendingUp,
  Eye,
  Heart,
  Share,
  Download,
  Users,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Bookmark,
  Send,
  FileText,
  BarChart3
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CandidateProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [candidate, setCandidate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubject, setContactSubject] = useState('')

  useEffect(() => {
    fetchCandidate()
  }, [params.id])

  const fetchCandidate = async () => {
    try {
      setLoading(true)
      
      // Mock detailed candidate data
      const mockCandidate = {
        id: params.id,
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
        coverImage: "/api/placeholder/800/300",
        location: "San Francisco, CA",
        bio: "Passionate computer science student with a focus on AI and full-stack development. I love building innovative solutions that solve real-world problems and have experience with modern web technologies and machine learning frameworks. Currently seeking full-time opportunities for Summer 2025.",
        
        // Professional Summary
        summary: "Results-driven CS student with 3+ years of hands-on experience building scalable web applications and AI-powered solutions. Demonstrated ability to lead technical projects, mentor junior developers, and collaborate effectively in cross-functional teams. Seeking a challenging full-stack or AI engineering role where I can apply my technical skills and passion for innovation.",
        
        // Matching & Scores
        matchScore: 94,
        matchReasons: [
          "Strong proficiency in React and Node.js",
          "Excellent AI/ML project portfolio",
          "Leadership experience in technical teams",
          "Open to San Francisco location",
          "Salary expectations align with budget"
        ],
        avgInnovationScore: 87,
        projectsCount: 5,
        totalProjectViews: 1847,
        
        // Comprehensive Skills
        skills: [
          { name: "React", level: 90, category: "Frontend", yearsExperience: 3, endorsed: true },
          { name: "TypeScript", level: 85, category: "Language", yearsExperience: 2, endorsed: true },
          { name: "Node.js", level: 80, category: "Backend", yearsExperience: 2.5, endorsed: true },
          { name: "Python", level: 85, category: "Language", yearsExperience: 4, endorsed: true },
          { name: "AI/ML", level: 75, category: "Specialty", yearsExperience: 1.5, endorsed: false },
          { name: "PostgreSQL", level: 70, category: "Database", yearsExperience: 2, endorsed: true },
          { name: "AWS", level: 65, category: "Cloud", yearsExperience: 1, endorsed: false },
          { name: "Docker", level: 60, category: "DevOps", yearsExperience: 1, endorsed: false },
          { name: "Git", level: 95, category: "Tools", yearsExperience: 4, endorsed: true },
          { name: "Figma", level: 70, category: "Design", yearsExperience: 2, endorsed: false }
        ],
        
        // Detailed Projects
        projects: [
          {
            id: 1,
            title: "AI-Powered Task Management System",
            description: "A comprehensive task management application that leverages OpenAI's GPT-4 to intelligently categorize tasks, suggest priorities, and estimate completion times. Built with React, Node.js, and PostgreSQL, featuring real-time collaboration and smart notifications.",
            longDescription: "This project represents my deep dive into AI integration within web applications. The system analyzes task descriptions using natural language processing to automatically categorize work items, suggest optimal priorities based on deadlines and dependencies, and provide realistic time estimates. Key technical challenges included designing an efficient prompt engineering system, implementing real-time updates via WebSockets, and creating an intuitive interface that makes AI suggestions feel natural rather than intrusive.",
            technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "OpenAI API", "Socket.io", "Tailwind CSS", "Docker"],
            innovationScore: 92,
            complexityLevel: "Advanced",
            repositoryUrl: "https://github.com/alex/ai-task-manager",
            liveUrl: "https://ai-task-manager.vercel.app",
            images: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
            stats: { views: 487, likes: 34, stars: 23 },
            impact: "Tested with 3 student organizations, showing 40% faster project completion times and reduced scheduling conflicts.",
            challenges: ["Integrating AI responses with real-time UI updates", "Handling API rate limits gracefully", "Designing intuitive AI suggestion interfaces"],
            learnings: ["Advanced prompt engineering techniques", "Real-time system architecture", "User experience design for AI features"],
            createdAt: "2024-01-15",
            updatedAt: "2024-01-20"
          },
          {
            id: 2,
            title: "Real-time Collaboration Platform",
            description: "WebSocket-based collaborative workspace enabling real-time document editing, video calls, and project management. Supports 100+ concurrent users with conflict resolution and offline sync capabilities.",
            longDescription: "Built from scratch to understand the complexities of real-time collaborative systems. Implemented operational transformation for conflict-free document editing, integrated WebRTC for peer-to-peer video communication, and designed a sophisticated offline-first architecture with conflict resolution algorithms.",
            technologies: ["React", "Node.js", "Socket.io", "WebRTC", "MongoDB", "Redis", "Express", "JWT"],
            innovationScore: 84,
            complexityLevel: "Advanced",
            repositoryUrl: "https://github.com/alex/collab-platform",
            liveUrl: "https://collab-platform.herokuapp.com",
            images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
            stats: { views: 312, likes: 28, stars: 19 },
            impact: "Successfully handles 100+ concurrent users with <50ms latency for real-time updates.",
            challenges: ["Implementing operational transformation", "Managing WebRTC connection states", "Optimizing for mobile devices"],
            learnings: ["Real-time system design patterns", "WebRTC implementation", "Conflict resolution algorithms"],
            createdAt: "2023-11-10",
            updatedAt: "2023-12-15"
          },
          {
            id: 3,
            title: "Machine Learning Stock Predictor",
            description: "LSTM neural network model for stock price prediction with 73% accuracy. Features automated data collection, technical indicator analysis, and risk assessment visualization.",
            longDescription: "Comprehensive machine learning project exploring time series prediction using deep learning. Collected and cleaned historical stock data, engineered features from technical indicators, and implemented various model architectures. The final LSTM model incorporates attention mechanisms and achieves consistent performance across different market conditions.",
            technologies: ["Python", "TensorFlow", "Pandas", "NumPy", "Matplotlib", "Yahoo Finance API", "Jupyter"],
            innovationScore: 79,
            complexityLevel: "Intermediate",
            repositoryUrl: "https://github.com/alex/ml-stock-predictor",
            liveUrl: null,
            images: ["/api/placeholder/400/300"],
            stats: { views: 245, likes: 15, stars: 12 },
            impact: "Model demonstrates 73% accuracy on test data with proper risk management considerations.",
            challenges: ["Handling non-stationary time series data", "Preventing overfitting", "Incorporating market sentiment"],
            learnings: ["LSTM architecture design", "Financial data analysis", "Model validation techniques"],
            createdAt: "2023-09-05",
            updatedAt: "2023-10-20"
          }
        ],
        
        // Work Experience
        experience: [
          {
            title: "Software Engineering Intern",
            company: "TechStart Inc.",
            location: "San Francisco, CA",
            startDate: "2023-06-01",
            endDate: "2023-08-31",
            current: false,
            description: "Developed and maintained React components for the company's main dashboard, improving user engagement by 25%. Collaborated with senior engineers to implement new API endpoints and optimize database queries.",
            achievements: [
              "Built responsive dashboard components used by 10,000+ daily active users",
              "Reduced API response times by 40% through query optimization",
              "Mentored 2 incoming interns on React best practices"
            ],
            technologies: ["React", "Node.js", "PostgreSQL", "AWS"]
          },
          {
            title: "Full Stack Developer",
            company: "Stanford CS Department",
            location: "Stanford, CA",
            startDate: "2023-01-15",
            endDate: null,
            current: true,
            description: "Part-time developer for academic research projects. Building data visualization tools and web applications to support faculty research in computer graphics and HCI.",
            achievements: [
              "Developed interactive visualization tools for research data",
              "Maintained legacy systems supporting 5+ research projects",
              "Created automated testing pipeline reducing deployment errors by 90%"
            ],
            technologies: ["React", "D3.js", "Python", "Django", "PostgreSQL"]
          }
        ],
        
        // Education Details
        education: {
          university: "Stanford University",
          degree: "Bachelor of Science in Computer Science",
          major: "Computer Science",
          minor: "Mathematics",
          graduationYear: "2025",
          gpa: "3.8",
          coursework: [
            "Data Structures and Algorithms",
            "Machine Learning",
            "Database Systems",
            "Computer Networks",
            "Software Engineering",
            "Human-Computer Interaction",
            "Artificial Intelligence",
            "Computer Graphics"
          ],
          achievements: [
            "Dean's List (Fall 2023, Spring 2024)",
            "CS Department Honor Roll",
            "Outstanding Project Award - CS 229 (ML)"
          ]
        },
        
        // Activity & Engagement
        lastActive: "2 hours ago",
        joinedDate: "2023-09-15",
        profileViews: 234,
        recruiterViews: 43,
        responseRate: 85,
        avgResponseTime: "6 hours",
        
        // Social & Links
        socialLinks: {
          github: { url: "https://github.com/alexjohnson", verified: true },
          linkedin: { url: "https://linkedin.com/in/alexjohnson", verified: true },
          portfolio: { url: "https://alexjohnson.dev", verified: true },
          twitter: { url: "https://twitter.com/alexjohnson", verified: false }
        },
        
        // Job Preferences
        jobPreferences: {
          roles: ["Full Stack Developer", "Software Engineer", "AI Engineer"],
          locations: ["San Francisco", "Seattle", "Remote"],
          workTypes: ["Full-time", "Internship"],
          salaryRange: { min: 80000, max: 120000 },
          companySize: ["Startup", "Medium", "Large"],
          industries: ["Technology", "AI/ML", "Fintech"],
          benefits: ["Health Insurance", "Stock Options", "Learning Budget", "Remote Work"],
          startDate: "2025-06-01",
          sponsorship: false
        },
        
        // Recruiter Notes & Status
        recruiterNotes: [],
        contactHistory: [],
        applicationStatus: null,
        tags: ["High Potential", "AI Specialist", "Leadership"],
        
        // Achievements & Certifications
        achievements: [
          {
            title: "Innovation Pioneer",
            description: "Achieved 85+ innovation score on 3+ projects",
            date: "2024-01-15",
            type: "Platform Achievement"
          },
          {
            title: "Open Source Contributor",
            description: "Made significant contributions to 5+ open source projects",
            date: "2023-12-10",
            type: "Community"
          },
          {
            title: "Hackathon Winner",
            description: "1st place at Stanford TreeHacks 2024",
            date: "2024-02-18",
            type: "Competition"
          }
        ],
        
        // Analytics for Recruiter
        analytics: {
          profileViewTrend: [
            { date: "2024-01-15", views: 12 },
            { date: "2024-01-16", views: 18 },
            { date: "2024-01-17", views: 24 },
            { date: "2024-01-18", views: 31 },
            { date: "2024-01-19", views: 28 },
            { date: "2024-01-20", views: 35 }
          ],
          searchKeywords: ["React developer", "AI engineer", "Stanford student", "full stack"],
          similarCandidates: [
            { id: 2, name: "Sarah Chen", similarity: 92 },
            { id: 4, name: "Emma Wilson", similarity: 87 },
            { id: 3, name: "Michael Rodriguez", similarity: 84 }
          ]
        }
      }
      
      setCandidate(mockCandidate)
      setIsBookmarked(true) // Mock bookmark status
    } catch (error) {
      console.error('Failed to fetch candidate:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = async () => {
    setIsBookmarked(!isBookmarked)
  }

  const sendMessage = async () => {
    if (!contactMessage.trim()) return
    
    // Mock message sending
    console.log('Sending message:', { subject: contactSubject, message: contactMessage })
    setContactMessage('')
    setContactSubject('')
    setShowContactForm(false)
    
    // Update contact history
    setCandidate({
      ...candidate,
      contactHistory: [
        ...candidate.contactHistory,
        {
          date: new Date().toISOString(),
          type: 'message',
          subject: contactSubject,
          content: contactMessage,
          from: 'recruiter'
        }
      ]
    })
  }

  const getSkillsByCategory = () => {
    return candidate.skills.reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    }, {})
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h1>
        <p className="text-gray-600 mb-6">The candidate profile you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/dashboard/recruiter/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Link>
        </Button>
      </div>
    )
  }

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
          <Button
            variant="outline"
            size="sm"
            onClick={toggleBookmark}
            className={isBookmarked ? 'text-yellow-600 border-yellow-600' : ''}
          >
            <Star className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
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
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-2xl">
                {candidate.firstName[0]}{candidate.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pt-20 lg:pt-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {candidate.firstName} {candidate.lastName}
                  </h1>
                  <p className="text-lg text-gray-600">{candidate.degree}</p>
                  <p className="text-gray-500">{candidate.university} • Class of {candidate.graduationYear}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Active {candidate.lastActive}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{candidate.matchScore}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{candidate.avgInnovationScore}</div>
                    <div className="text-sm text-gray-500">Innovation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{candidate.projectsCount}</div>
                    <div className="text-sm text-gray-500">Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Reasons */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Target className="mr-2 h-5 w-5" />
            Why This Candidate Matches ({candidate.matchScore}%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {candidate.matchReasons.map((reason: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-900">{reason}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{candidate.bio}</p>
                  {candidate.summary && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Professional Summary</h4>
                      <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{candidate.email}</span>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{candidate.phone}</span>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2 pt-3 border-t">
                    {candidate.socialLinks.github.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={candidate.socialLinks.github.url} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {candidate.socialLinks.linkedin.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={candidate.socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {candidate.socialLinks.portfolio.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={candidate.socialLinks.portfolio.url} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Portfolio
                        </a>
                      </Button>
                    )}
                  </div>
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
                      <h3 className="font-semibold text-gray-900">{candidate.education.degree}</h3>
                      <p className="text-gray-600">{candidate.education.university}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                        <span>Class of {candidate.education.graduationYear}</span>
                        <span>GPA: {candidate.education.gpa}</span>
                        <span>Major: {candidate.education.major}</span>
                        {candidate.education.minor && <span>Minor: {candidate.education.minor}</span>}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Relevant Coursework</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.education.coursework.map((course: string) => (
                          <Badge key={course} variant="secondary" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Academic Achievements</h4>
                      <ul className="space-y-1">
                        {candidate.education.achievements.map((achievement: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-6">
              {candidate.projects.map((project: any) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{project.title}</span>
                          <Badge variant="outline">Score: {project.innovationScore}</Badge>
                          <Badge variant="secondary">{project.complexityLevel}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {project.description}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        {project.repositoryUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-1" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Live
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700">{project.longDescription}</p>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Impact & Results</h4>
                          <p className="text-sm text-gray-600">{project.impact}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Project Stats</h4>
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {project.stats.views} views
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {project.stats.likes} likes
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              {project.stats.stars} stars
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {project.images && project.images.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Screenshots</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {project.images.map((image: string, index: number) => (
                              <img 
                                key={index}
                                src={image} 
                                alt={`${project.title} screenshot ${index + 1}`}
                                className="w-full h-24 object-cover rounded border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Challenges</h4>
                          <ul className="space-y-1">
                            {project.challenges.map((challenge: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-600">{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Learnings</h4>
                          <ul className="space-y-1">
                            {project.learnings.map((learning: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-600">{learning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="experience" className="space-y-6">
              {candidate.experience.map((exp: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{exp.title}</CardTitle>
                        <CardDescription>
                          {exp.company} • {exp.location}
                        </CardDescription>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(exp.startDate).toLocaleDateString()} - {
                            exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()
                          }
                          {exp.current && (
                            <Badge variant="default" className="ml-2 text-xs">Current</Badge>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700">{exp.description}</p>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Achievements</h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement: string, achIndex: number) => (
                            <li key={achIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Technologies Used</h4>
                        <div className="flex flex-wrap gap-1">
                          {exp.technologies.map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-6">
              {Object.entries(getSkillsByCategory()).map(([category, skills]: [string, any]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skills.map((skill: any) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              {skill.endorsed && (
                                <Badge variant="default" className="text-xs">
                                  Endorsed
                                </Badge>
                              )}
                              <span className="text-sm text-gray-500">
                                {skill.yearsExperience} years
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Analytics</CardTitle>
                  <CardDescription>
                    Insights about this candidate's profile performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{candidate.profileViews}</div>
                      <div className="text-sm text-gray-500">Profile Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{candidate.recruiterViews}</div>
                      <div className="text-sm text-gray-500">Recruiter Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{candidate.responseRate}%</div>
                      <div className="text-sm text-gray-500">Response Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{candidate.avgResponseTime}</div>
                      <div className="text-sm text-gray-500">Avg Response</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Search Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.analytics.searchKeywords.map((keyword: string) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Similar Candidates</CardTitle>
                  <CardDescription>
                    Other candidates with similar profiles and skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidate.analytics.similarCandidates.map((similar: any) => (
                      <div key={similar.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium text-gray-900">{similar.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{similar.similarity}% similar</span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/recruiter/candidates/${similar.id}`}>
                              View
                            </Link>
                          </Button>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
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
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </CardContent>
          </Card>
          
          {/* Job Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Desired Roles</h4>
                <div className="flex flex-wrap gap-1">
                  {candidate.jobPreferences.roles.map((role: string) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Preferred Locations</h4>
                <div className="flex flex-wrap gap-1">
                  {candidate.jobPreferences.locations.map((location: string) => (
                    <Badge key={location} variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Salary Range</h4>
                <p className="text-gray-600">
                  ${candidate.jobPreferences.salaryRange.min.toLocaleString()} - ${candidate.jobPreferences.salaryRange.max.toLocaleString()}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Available From</h4>
                <p className="text-gray-600">{new Date(candidate.jobPreferences.startDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Visa Sponsorship</h4>
                <Badge variant={candidate.jobPreferences.sponsorship ? "default" : "secondary"}>
                  {candidate.jobPreferences.sponsorship ? "Required" : "Not Required"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidate.achievements.map((achievement: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.tags.map((tag: string) => (
                  <Badge key={tag} variant="default" className="text-xs">
                    {tag}
                  </Badge>
                ))}
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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                <Select value={contactSubject} onValueChange={setContactSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job_opportunity">Job Opportunity</SelectItem>
                    <SelectItem value="interview_invitation">Interview Invitation</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="project_discussion">Project Discussion</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
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
                <Button variant="outline" onClick={() => setShowContactForm(false)}>
                  Cancel
                </Button>
                <Button onClick={sendMessage} disabled={!contactMessage.trim() || !contactSubject}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}