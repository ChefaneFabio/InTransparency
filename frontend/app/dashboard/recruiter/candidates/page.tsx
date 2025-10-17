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
  Plus,
  GraduationCap,
  BookOpen,
  CheckCircle
} from 'lucide-react'

// Discipline options
const DISCIPLINES = [
  { value: 'all', label: 'All Disciplines' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'TRADES', label: 'Skilled Trades' },
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'MEDIA', label: 'Film & Media' },
  { value: 'WRITING', label: 'Writing' },
  { value: 'SOCIAL_SCIENCES', label: 'Social Sciences' },
  { value: 'ARTS', label: 'Arts' },
  { value: 'LAW', label: 'Law' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'OTHER', label: 'Other' }
]

// Grade levels
const GRADE_LEVELS = [
  { value: 'all', label: 'All Grades' },
  { value: '4.0', label: 'A (4.0)' },
  { value: '3.7', label: 'A- (3.7+)' },
  { value: '3.3', label: 'B+ (3.3+)' },
  { value: '3.0', label: 'B (3.0+)' },
  { value: '2.7', label: 'B- (2.7+)' }
]

export default function CandidatesPageEnhanced() {
  const { user } = useAuth()
  const [candidates, setCandidates] = useState<any[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [universityFilter, setUniversityFilter] = useState('all')
  const [skillFilter, setSkillFilter] = useState('all')
  const [graduationYearFilter, setGraduationYearFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('')
  const [sortBy, setSortBy] = useState('match')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchCandidates()
  }, [user])

  useEffect(() => {
    filterAndSortCandidates()
  }, [candidates, searchQuery, disciplineFilter, universityFilter, skillFilter, graduationYearFilter, locationFilter, gradeFilter, courseFilter, sortBy])

  const fetchCandidates = async () => {
    try {
      setLoading(true)

      // In production, this would call: GET /api/projects?limit=100
      // For now, using enhanced mock data with multi-discipline support
      const mockCandidates = [
        {
          id: 1,
          firstName: "Alex",
          lastName: "Johnson",
          email: "alex.johnson@stanford.edu",
          university: "Stanford University",
          degree: "B.S. Computer Science",
          major: "Computer Science",
          discipline: "TECHNOLOGY",
          graduationYear: "2025",
          gpa: "3.8",
          avatar: "/api/placeholder/120/120",
          location: "San Francisco, CA",
          bio: "Passionate CS student focused on AI and full-stack development",

          matchScore: 94,
          avgInnovationScore: 87,
          projects: 5,
          totalProjectViews: 1847,

          skills: ["React", "TypeScript", "Node.js", "Python", "AI/ML"],

          // Academic Context (NEW!)
          recentCourse: {
            name: "Advanced Web Development",
            code: "CS401",
            semester: "Fall 2024",
            grade: "A"
          },

          topProject: {
            title: "AI-Powered Task Management",
            description: "Full-stack app with GPT-4 integration",
            discipline: "TECHNOLOGY",
            courseName: "Advanced Web Development",
            courseCode: "CS401",
            grade: "A",
            universityVerified: true
          },

          lastActive: "2 hours ago",
          isBookmarked: true,
          isContacted: false
        },
        {
          id: 2,
          firstName: "Emma",
          lastName: "Rodriguez",
          email: "emma.r@nyu.edu",
          university: "NYU Stern",
          degree: "B.S. Finance",
          major: "Finance",
          discipline: "BUSINESS",
          graduationYear: "2025",
          gpa: "3.9",
          avatar: "/api/placeholder/120/120",
          location: "New York, NY",
          bio: "Finance major specializing in investment banking and financial modeling",

          matchScore: 91,
          avgInnovationScore: 88,
          projects: 4,
          totalProjectViews: 1234,

          skills: ["Financial Modeling", "Excel", "DCF Analysis", "Python", "Bloomberg Terminal"],

          recentCourse: {
            name: "Corporate Finance",
            code: "FIN401",
            semester: "Fall 2024",
            grade: "A"
          },

          topProject: {
            title: "Tesla DCF Valuation Model",
            description: "Comprehensive financial model with scenario analysis",
            discipline: "BUSINESS",
            courseName: "Corporate Finance",
            courseCode: "FIN401",
            grade: "A",
            universityVerified: true
          },

          lastActive: "1 day ago",
          isBookmarked: false,
          isContacted: false
        },
        {
          id: 3,
          firstName: "Marcus",
          lastName: "Chen",
          email: "marcus.chen@risd.edu",
          university: "RISD",
          degree: "B.F.A. Graphic Design",
          major: "Graphic Design",
          discipline: "DESIGN",
          graduationYear: "2024",
          gpa: "3.85",
          avatar: "/api/placeholder/120/120",
          location: "Providence, RI",
          bio: "UX/UI designer passionate about accessible, user-centered design",

          matchScore: 89,
          avgInnovationScore: 92,
          projects: 8,
          totalProjectViews: 2345,

          skills: ["Figma", "Adobe XD", "UX Research", "Prototyping", "Design Systems"],

          recentCourse: {
            name: "User Experience Design",
            code: "DES301",
            semester: "Spring 2024",
            grade: "A-"
          },

          topProject: {
            title: "Mental Health App UX Redesign",
            description: "Complete redesign improving engagement by 40%",
            discipline: "DESIGN",
            courseName: "User Experience Design",
            courseCode: "DES301",
            grade: "A-",
            universityVerified: true
          },

          lastActive: "3 hours ago",
          isBookmarked: true,
          isContacted: false
        },
        {
          id: 4,
          firstName: "Sarah",
          lastName: "Williams",
          email: "sarah.w@nursing.upenn.edu",
          university: "UPenn Nursing",
          degree: "B.S.N.",
          major: "Nursing",
          discipline: "HEALTHCARE",
          graduationYear: "2024",
          gpa: "3.92",
          avatar: "/api/placeholder/120/120",
          location: "Philadelphia, PA",
          bio: "Clinical nursing student focused on evidence-based practice",

          matchScore: 93,
          avgInnovationScore: 85,
          projects: 3,
          totalProjectViews: 567,

          skills: ["Clinical Assessment", "Evidence-Based Practice", "Patient Care", "Protocol Development"],

          recentCourse: {
            name: "Advanced Clinical Practice",
            code: "NURS502",
            semester: "Spring 2024",
            grade: "A-"
          },

          topProject: {
            title: "Wound Care Protocol Implementation",
            description: "Reduced healing time by 25% in 200-bed hospital",
            discipline: "HEALTHCARE",
            courseName: "Advanced Clinical Practice",
            courseCode: "NURS502",
            grade: "A-",
            universityVerified: true
          },

          lastActive: "5 hours ago",
          isBookmarked: false,
          isContacted: true
        },
        {
          id: 5,
          firstName: "David",
          lastName: "Park",
          email: "david.park@mit.edu",
          university: "MIT",
          degree: "B.S. Mechanical Engineering",
          major: "Mechanical Engineering",
          discipline: "ENGINEERING",
          graduationYear: "2025",
          gpa: "3.88",
          avatar: "/api/placeholder/120/120",
          location: "Cambridge, MA",
          bio: "Mechanical engineering student specializing in automotive systems",

          matchScore: 90,
          avgInnovationScore: 86,
          projects: 5,
          totalProjectViews: 1123,

          skills: ["SolidWorks", "CAD Design", "FEA Analysis", "MATLAB", "Manufacturing"],

          recentCourse: {
            name: "Mechanical Design",
            code: "ME401",
            semester: "Fall 2024",
            grade: "A"
          },

          topProject: {
            title: "Automotive Suspension System Design",
            description: "15% weight reduction while improving ride comfort",
            discipline: "ENGINEERING",
            courseName: "Mechanical Design",
            courseCode: "ME401",
            grade: "A",
            universityVerified: true
          },

          lastActive: "1 day ago",
          isBookmarked: false,
          isContacted: false
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
        candidate.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.major.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Discipline filter (NEW!)
    if (disciplineFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.discipline === disciplineFilter)
    }

    // Course filter (NEW!)
    if (courseFilter) {
      filtered = filtered.filter(candidate =>
        candidate.recentCourse?.name.toLowerCase().includes(courseFilter.toLowerCase()) ||
        candidate.recentCourse?.code.toLowerCase().includes(courseFilter.toLowerCase()) ||
        candidate.topProject?.courseName?.toLowerCase().includes(courseFilter.toLowerCase()) ||
        candidate.topProject?.courseCode?.toLowerCase().includes(courseFilter.toLowerCase())
      )
    }

    // Grade filter (NEW!)
    if (gradeFilter !== 'all') {
      const minGpa = parseFloat(gradeFilter)
      filtered = filtered.filter(candidate => parseFloat(candidate.gpa) >= minGpa)
    }

    // University filter
    if (universityFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.university === universityFilter)
    }

    // Skill filter
    if (skillFilter !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.skills.includes(skillFilter)
      )
    }

    // Graduation year filter
    if (graduationYearFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.graduationYear === graduationYearFilter)
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.location.includes(locationFilter)
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
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
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
      candidate.skills.forEach((skill: string) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1
      })
    })
    return Object.entries(skillCounts)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 15)
      .map(([skill]: any) => skill)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setDisciplineFilter('all')
    setUniversityFilter('all')
    setSkillFilter('all')
    setGraduationYearFilter('all')
    setLocationFilter('all')
    setGradeFilter('all')
    setCourseFilter('')
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
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Multi-Discipline Candidate Search</h1>
          <p className="text-gray-600 mt-1">
            Discover talent across all disciplines - verified through courses, grades, and projects
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">{filteredCandidates.length}</div>
              <div className="ml-2 text-sm text-gray-600">Candidates</div>
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
                {new Set(filteredCandidates.map(c => c.discipline)).size}
              </div>
              <div className="ml-2 text-sm text-gray-600">Disciplines</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredCandidates.filter(c => c.topProject?.universityVerified).length}
              </div>
              <div className="ml-2 text-sm text-gray-600">Verified</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-indigo-600">
                {candidates.filter(c => c.isBookmarked).length}
              </div>
              <div className="ml-2 text-sm text-gray-600">Bookmarked</div>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                <Input
                  placeholder="Search by name, university, skills, major..."
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

            {/* Primary Filters - NEW! Multi-Discipline Support */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {/* Discipline Filter - NEW! */}
              <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Discipline" />
                </SelectTrigger>
                <SelectContent>
                  {DISCIPLINES.map(disc => (
                    <SelectItem key={disc.value} value={disc.value}>
                      {disc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Course Search - NEW! */}
              <div className="col-span-2 relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                <Input
                  placeholder="Course (e.g., CS401, Finance)"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Grade Filter - NEW! */}
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Min GPA" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map(grade => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={universityFilter} onValueChange={setUniversityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {getUniversities().map((university) => (
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
                  {getTopSkills().map((skill) => (
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="gpa">GPA (High to Low)</SelectItem>
                  <SelectItem value="innovation">Innovation Score</SelectItem>
                  <SelectItem value="projects">Project Count</SelectItem>
                  <SelectItem value="recent">Recently Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="text-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {(disciplineFilter !== 'all' || courseFilter || gradeFilter !== 'all') && (
        <div className="flex flex-wrap gap-2">
          {disciplineFilter !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Discipline: {DISCIPLINES.find(d => d.value === disciplineFilter)?.label}
              <button
                onClick={() => setDisciplineFilter('all')}
                className="ml-2 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          )}
          {courseFilter && (
            <Badge variant="secondary" className="px-3 py-1">
              Course: {courseFilter}
              <button
                onClick={() => setCourseFilter('')}
                className="ml-2 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          )}
          {gradeFilter !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Min GPA: {gradeFilter}
              <button
                onClick={() => setGradeFilter('all')}
                className="ml-2 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      {filteredCandidates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No candidates found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more candidates.
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Header with Avatar and Match Score */}
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
                          <p className="text-sm text-gray-600">{candidate.university}</p>
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
                          className={candidate.isBookmarked ? 'text-yellow-500' : 'text-gray-600'}
                        >
                          <Star className={`h-4 w-4 ${candidate.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Discipline Badge - NEW! */}
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">
                        {DISCIPLINES.find(d => d.value === candidate.discipline)?.label}
                      </Badge>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <School className="h-4 w-4 mr-2" />
                        {candidate.degree} • {candidate.graduationYear}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <Award className="h-4 w-4 mr-2" />
                        GPA: {candidate.gpa}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <MapPin className="h-4 w-4 mr-2" />
                        {candidate.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <Code className="h-4 w-4 mr-2" />
                        {candidate.projects} projects • {candidate.avgInnovationScore} avg score
                      </div>
                    </div>

                    {/* Academic Context - NEW! */}
                    {candidate.recentCourse && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <GraduationCap className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {candidate.recentCourse.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {candidate.recentCourse.code} • {candidate.recentCourse.semester}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Grade: {candidate.recentCourse.grade}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Top Project - NEW! Shows Academic Verification */}
                    {candidate.topProject && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {candidate.topProject.title}
                          </h4>
                          {candidate.topProject.universityVerified && (
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {candidate.topProject.description}
                        </p>
                        {candidate.topProject.courseName && (
                          <div className="text-xs text-blue-600">
                            From: {candidate.topProject.courseCode} (Grade: {candidate.topProject.grade})
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bio */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{candidate.bio}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {candidate.skills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
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
                          <MessageSquare className="h-4 w-4" />
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
            // List view - similar structure but horizontal layout
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
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
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {candidate.firstName} {candidate.lastName}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {DISCIPLINES.find(d => d.value === candidate.discipline)?.label}
                                </Badge>
                                {candidate.topProject?.universityVerified && (
                                  <CheckCircle className="h-4 w-4 text-green-600" title="University Verified" />
                                )}
                              </div>
                              <p className="text-gray-600">{candidate.degree}</p>
                              <p className="text-sm text-gray-600">{candidate.university} • Class of {candidate.graduationYear}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-700 mb-3">
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
                          </div>

                          {/* Academic Context in List View */}
                          {candidate.recentCourse && (
                            <div className="bg-blue-50 rounded p-2 mb-3 inline-block">
                              <span className="text-xs text-gray-900 font-medium">
                                {candidate.recentCourse.code}: {candidate.recentCourse.name}
                              </span>
                              <span className="text-xs text-gray-600 ml-2">
                                (Grade: {candidate.recentCourse.grade})
                              </span>
                            </div>
                          )}

                          <p className="text-gray-700 mb-3 line-clamp-2">{candidate.bio}</p>

                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.slice(0, 6).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 6 && (
                              <Badge variant="secondary" className="text-xs">
                                +{candidate.skills.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-3 ml-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{candidate.matchScore}%</div>
                          <div className="text-xs text-gray-600">Match</div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(candidate.id)}
                          className={candidate.isBookmarked ? 'text-yellow-500' : 'text-gray-600'}
                        >
                          <Star className={`h-4 w-4 ${candidate.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>

                        <div className="flex flex-col space-y-2">
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/recruiter/candidates/${candidate.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
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
