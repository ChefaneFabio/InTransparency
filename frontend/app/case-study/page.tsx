'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Building2,
  MapPin,
  Users,
  Target,
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
  Brain,
  Search,
  Zap,
  FileText,
  ArrowRight,
  Star,
  GraduationCap,
  Briefcase,
  Database,
  BarChart3,
  Filter,
  X,
  RefreshCw
} from 'lucide-react'
import { allCandidates, type Candidate } from '@/lib/mock-candidates'

const positions = [
  {
    id: 1,
    title: 'Junior Risk Analyst',
    location: 'Milan',
    department: 'Risk Management',
    icon: BarChart3,
    color: 'bg-blue-50 border-blue-200',
    searchCriteria: {
      courses: ['Financial Risk Management', 'Econometrics', 'Corporate Finance'],
      skills: ['Python', 'R', 'Risk Assessment', 'Financial Modeling'],
      majors: ['Finance', 'Economics', 'Statistics'],
      minGPA: 27,
      location: 'Milan'
    }
  },
  {
    id: 2,
    title: 'Junior Cybersecurity Analyst',
    location: 'Rome',
    department: 'IT Security',
    icon: Database,
    color: 'bg-green-50 border-green-200',
    searchCriteria: {
      courses: ['Network Security', 'Cryptography', 'Cyber Threat Analysis'],
      skills: ['Network Security', 'Penetration Testing', 'Python', 'Linux'],
      majors: ['Computer Science', 'Cybersecurity', 'Information Technology'],
      minGPA: 27,
      location: 'Rome'
    }
  },
  {
    id: 3,
    title: 'Junior Data Scientist',
    location: 'Turin',
    department: 'Analytics & Innovation',
    icon: Brain,
    color: 'bg-purple-50 border-purple-200',
    searchCriteria: {
      courses: ['Machine Learning', 'Deep Learning', 'Big Data Analytics'],
      skills: ['Python', 'TensorFlow', 'Machine Learning', 'SQL'],
      majors: ['Data Science', 'Computer Science', 'Statistics'],
      minGPA: 27,
      location: 'Turin'
    }
  }
]

const platformBenefits = [
  {
    icon: Search,
    title: 'Precise Skill Matching',
    description: 'Search by specific courses, grades, and projects - not just keywords',
    stat: '250+ filters'
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'AI RAG analyzes course content and project relevance to job requirements',
    stat: '95% match accuracy'
  },
  {
    icon: MapPin,
    title: 'Geographic Intelligence',
    description: 'Find candidates in specific cities across Italy with location-based search',
    stat: '3 perfect matches'
  },
  {
    icon: Clock,
    title: 'Faster Hiring',
    description: 'Reduced time-to-hire from 45 days to 12 days',
    stat: '73% faster'
  }
]

export default function CaseStudyPage() {
  const [selectedPosition, setSelectedPosition] = useState(1)
  const [customCourses, setCustomCourses] = useState<string[]>([])
  const [customSkills, setCustomSkills] = useState<string[]>([])
  const [customLocation, setCustomLocation] = useState('')
  const [minGPA, setMinGPA] = useState(27)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const currentPosition = positions.find(p => p.id === selectedPosition) || positions[0]
  const PositionIcon = currentPosition.icon

  // Get active search criteria (custom or position default)
  const activeSearchCriteria = useMemo(() => {
    return {
      courses: customCourses.length > 0 ? customCourses : currentPosition.searchCriteria.courses,
      skills: customSkills.length > 0 ? customSkills : currentPosition.searchCriteria.skills,
      location: customLocation || currentPosition.searchCriteria.location,
      minGPA: minGPA
    }
  }, [customCourses, customSkills, customLocation, minGPA, currentPosition])

  // Dynamic candidate filtering
  const filteredCandidates = useMemo(() => {
    return allCandidates.filter(candidate => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(query)
        const matchesUniversity = candidate.education.some(edu => edu.university.toLowerCase().includes(query))
        if (!(matchesName || matchesUniversity)) return false
      }

      // Location filter
      if (activeSearchCriteria.location) {
        if (!candidate.location.city.toLowerCase().includes(activeSearchCriteria.location.toLowerCase())) {
          return false
        }
      }

      // GPA filter
      const hasMinGPA = candidate.education.some(edu => {
        if (!edu.maxGPA || edu.maxGPA === 0) return false
        const normalizedGPA = (edu.gpa / edu.maxGPA) * 30 // Normalize to 30 scale
        return normalizedGPA >= activeSearchCriteria.minGPA
      })
      if (!hasMinGPA) return false

      // Course filter - check if candidate took any of the required courses
      const hasCourse = candidate.education.some(edu =>
        edu.courses.some(course =>
          activeSearchCriteria.courses.some(requiredCourse =>
            course.name.toLowerCase().includes(requiredCourse.toLowerCase()) ||
            requiredCourse.toLowerCase().includes(course.name.toLowerCase())
          )
        )
      )
      if (!hasCourse) return false

      // Skills filter - check if candidate has any of the required skills
      const hasSkill = activeSearchCriteria.skills.some(skill =>
        [...candidate.skills.programming, ...candidate.skills.frameworks, ...candidate.skills.databases, ...candidate.skills.tools]
          .some(candidateSkill => candidateSkill.toLowerCase().includes(skill.toLowerCase()))
      )
      if (!hasSkill) return false

      return true
    })
  }, [searchQuery, activeSearchCriteria, allCandidates])

  // Calculate match score for a candidate
  const calculateMatchScore = useCallback((candidate: Candidate) => {
    let score = 0
    let maxScore = 0

    // Course matching (40 points)
    maxScore += 40
    const matchedCourses = candidate.education.reduce((acc, edu) => {
      return acc + edu.courses.filter(course =>
        activeSearchCriteria.courses.some(req =>
          course.name.toLowerCase().includes(req.toLowerCase()) ||
          req.toLowerCase().includes(course.name.toLowerCase())
        )
      ).length
    }, 0)
    score += Math.min(40, matchedCourses * 13)

    // Skills matching (30 points)
    maxScore += 30
    const candidateSkills = [...candidate.skills.programming, ...candidate.skills.frameworks, ...candidate.skills.databases, ...candidate.skills.tools]
    const matchedSkills = activeSearchCriteria.skills.filter(skill =>
      candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
    ).length
    score += Math.min(30, matchedSkills * 7)

    // Location match (15 points)
    maxScore += 15
    if (candidate.location.city.toLowerCase().includes(activeSearchCriteria.location.toLowerCase())) {
      score += 15
    }

    // GPA (15 points)
    maxScore += 15
    const normalizedGPA = candidate.education.length > 0 && candidate.education[0].maxGPA > 0
      ? (candidate.education[0].gpa / candidate.education[0].maxGPA) * 30
      : 0
    score += Math.min(15, Math.max(0, ((normalizedGPA - 24) / 6) * 15))

    return Math.round((score / maxScore) * 100)
  }, [activeSearchCriteria])

  // Sort candidates by match score
  const rankedCandidates = useMemo(() => {
    return filteredCandidates
      .map(candidate => ({
        candidate,
        matchScore: calculateMatchScore(candidate)
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
  }, [filteredCandidates, calculateMatchScore])

  const topCandidate = rankedCandidates.length > 0 ? rankedCandidates[0] : null

  const resetFilters = () => {
    setCustomCourses([])
    setCustomSkills([])
    setCustomLocation('')
    setMinGPA(27)
    setSearchQuery('')
  }

  const addCustomCourse = (course: string) => {
    const trimmedCourse = course.trim()
    if (trimmedCourse && !customCourses.includes(trimmedCourse)) {
      setCustomCourses([...customCourses, trimmedCourse])
    }
  }

  const addCustomSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !customSkills.includes(trimmedSkill)) {
      setCustomSkills([...customSkills, trimmedSkill])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <Building2 className="h-3 w-3 mr-1" />
              Interactive Case Study
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How a Banking Firm Found 3 Perfect Junior Candidates Across Italy
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
              A leading Italian bank needed to hire three junior specialists with very specific knowledge and skills for positions in Milan, Rome, and Turin. Instead of posting jobs and waiting for applications, they <strong>proactively searched</strong> InTransparency's candidate database and found perfect matches in just 12 days.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-800 font-medium">Positions Filled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-800 font-medium">Days to Hire</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{filteredCandidates.length}</div>
                <div className="text-sm text-gray-800 font-medium">Candidates Found</div>
              </div>
            </div>
          </div>

          {/* The Challenge */}
          <Card className="mb-16 border-2">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="h-6 w-6 mr-2 text-red-600" />
                The Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                  A leading banking firm needed to hire three junior professionals for critical roles across different Italian cities. Each position required very specific domain knowledge, relevant coursework, and practical project experience.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                    <h4 className="font-bold text-red-950 mb-2">❌ Traditional Approach Issues</h4>
                    <ul className="text-sm text-red-900 space-y-1">
                      <li>• Post jobs and wait for candidates to apply</li>
                      <li>• Sift through 500+ generic CVs manually</li>
                      <li>• No way to verify course-specific knowledge</li>
                      <li>• Passive approach - can't search for candidates</li>
                      <li>• 45+ days average time-to-hire</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-400">
                    <h4 className="font-bold text-yellow-950 mb-2">⚠️ Specific Requirements</h4>
                    <ul className="text-sm text-yellow-900 space-y-1">
                      <li>• Must have completed specific courses</li>
                      <li>• Need proven projects in banking domain</li>
                      <li>• Location-specific (Milan/Rome/Turin)</li>
                      <li>• Fluent in Italian and English</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-400">
                    <h4 className="font-bold text-green-950 mb-2">✅ InTransparency Solution</h4>
                    <ul className="text-sm text-green-900 space-y-1">
                      <li>• Proactively search for candidates (no waiting)</li>
                      <li>• Filter by specific courses and grades</li>
                      <li>• Find candidates who haven't applied yet</li>
                      <li>• Geographic mapping across Italy</li>
                      <li>• AI-powered relevance matching</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proactive Search - Game Changer */}
          <Card className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 rounded-full p-4 flex-shrink-0">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">The Game Changer: Proactive Candidate Search</h3>
                  <p className="text-gray-700 text-lg mb-4">
                    Unlike traditional job boards where companies post jobs and passively wait for applications, <strong>InTransparency lets companies actively search for and discover candidates</strong> - even those who haven't applied to their jobs yet.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-200">
                      <h4 className="font-bold text-red-900 mb-3 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Traditional Hiring (Passive & Slow)
                      </h4>
                      <ol className="text-sm text-gray-700 space-y-2">
                        <li className="flex items-start">
                          <span className="font-bold mr-2">1.</span>
                          <span>Post job opening on job boards</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">2.</span>
                          <span>Wait days/weeks for candidates to find your posting</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">3.</span>
                          <span>Hope the right candidates actually apply</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">4.</span>
                          <span>Manually review hundreds of generic CVs</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">5.</span>
                          <span>Discover most applicants don't meet requirements</span>
                        </li>
                      </ol>
                      <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
                        <p className="text-xs font-semibold text-red-800">⏰ Result: 45+ days, mostly unqualified candidates</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm border-2 border-green-400">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        InTransparency (Proactive & Fast)
                      </h4>
                      <ol className="text-sm text-gray-700 space-y-2">
                        <li className="flex items-start">
                          <span className="font-bold mr-2">1.</span>
                          <span>Search candidate database with 250+ filters</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">2.</span>
                          <span>Filter by specific courses, grades, and projects</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">3.</span>
                          <span>Find candidates instantly - no waiting for applications</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">4.</span>
                          <span>AI shows relevance scores and course-job match</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">5.</span>
                          <span>Directly reach out to pre-qualified candidates</span>
                        </li>
                      </ol>
                      <div className="mt-4 p-3 bg-green-50 rounded border border-green-300">
                        <p className="text-xs font-semibold text-green-800">⚡ Result: 12 days, perfect-fit candidates</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-purple-100 rounded-lg border-2 border-purple-400">
                    <p className="text-sm text-purple-950 font-medium">
                      <strong>For this banking firm:</strong> Instead of posting three jobs and waiting weeks for applications, they immediately searched for candidates who had taken "Financial Risk Management", "Applied Cryptography", and "Machine Learning for Finance" courses, found three perfect matches in their target cities within hours, and made offers within 12 days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Search Demo */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Try It Yourself: Search for Candidates</h2>
              <p className="text-lg text-gray-700">
                Select a position and see how InTransparency finds perfect candidates in real-time
              </p>
            </div>

            {/* Position Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                <div className="flex space-x-2">
                  {positions.map((position) => {
                    const Icon = position.icon
                    return (
                      <button
                        key={position.id}
                        onClick={() => {
                          setSelectedPosition(position.id)
                          resetFilters()
                        }}
                        className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-all ${
                          selectedPosition === position.id
                            ? position.color + ' shadow-sm text-gray-900'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <div>{position.title}</div>
                          <div className="text-xs opacity-75">{position.location}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Search Filters */}
              <div className="lg:col-span-1">
                <Card className={currentPosition.color}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Search Criteria
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-xs"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-2">Search Query</Label>
                      <Input
                        placeholder="Search by name, university..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-2">Location</Label>
                      <Input
                        placeholder={currentPosition.location}
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-2">Minimum GPA: {minGPA}/30</Label>
                      <Slider
                        value={[minGPA]}
                        onValueChange={(value) => setMinGPA(value[0])}
                        min={24}
                        max={30}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-2">Required Courses</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {activeSearchCriteria.courses.map((course, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-gray-400 text-gray-800">
                            {course}
                            {customCourses.includes(course) && (
                              <X
                                className="h-3 w-3 ml-1 cursor-pointer"
                                onClick={() => setCustomCourses(customCourses.filter(c => c !== course))}
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add custom course..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCustomCourse((e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-2">Required Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {activeSearchCriteria.skills.map((skill, idx) => (
                          <Badge key={idx} className="text-xs bg-blue-100 text-blue-900 border border-blue-300 font-semibold">
                            {skill}
                            {customSkills.includes(skill) && (
                              <X
                                className="h-3 w-3 ml-1 cursor-pointer"
                                onClick={() => setCustomSkills(customSkills.filter(s => s !== skill))}
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add custom skill..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCustomSkill((e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                        className="text-xs"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{filteredCandidates.length}</div>
                        <div className="text-sm text-gray-900 font-medium">Candidates Found</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="lg:col-span-2">
                {topCandidate ? (
                  <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="flex items-center text-green-900">
                          <Award className="h-5 w-5 mr-2" />
                          Top Match
                        </CardTitle>
                        <Badge className="bg-green-600 text-white text-lg px-4 py-1">
                          {topCandidate.matchScore}% Match
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                          <Users className="h-8 w-8 text-green-700" />
                        </div>
                        <div>
                          <div className="font-bold text-2xl text-green-900">
                            {topCandidate.candidate.firstName} {topCandidate.candidate.lastName}
                          </div>
                          <div className="text-sm text-green-800 flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            {topCandidate.candidate.education[0]?.degree} • {topCandidate.candidate.education[0]?.university}
                          </div>
                          <div className="text-sm text-green-800 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {topCandidate.candidate.location.city} • GPA: {topCandidate.candidate.education[0]?.gpa}/{topCandidate.candidate.education[0]?.maxGPA}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-green-900 mb-2">Matching Courses</div>
                        <div className="space-y-1">
                          {(topCandidate.candidate.education[0]?.courses || [])
                            .filter(course =>
                              activeSearchCriteria.courses.some(req =>
                                course.name.toLowerCase().includes(req.toLowerCase()) ||
                                req.toLowerCase().includes(course.name.toLowerCase())
                              )
                            )
                            .slice(0, 4)
                            .map((course, idx) => (
                              <div key={idx} className="bg-white p-2 rounded border border-green-200 text-xs flex justify-between items-center">
                                <span><strong>{course.code}:</strong> {course.name}</span>
                                <Badge className="bg-green-100 text-green-800 border-green-300 font-semibold">{course.grade}</Badge>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-green-900 mb-2">Matching Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {[...topCandidate.candidate.skills.programming, ...topCandidate.candidate.skills.frameworks, ...topCandidate.candidate.skills.databases]
                            .filter(skill =>
                              activeSearchCriteria.skills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
                            )
                            .slice(0, 8)
                            .map((skill, idx) => (
                              <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs font-semibold">{skill}</Badge>
                            ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-green-900 mb-2">Top Projects</div>
                        <div className="space-y-2">
                          {topCandidate.candidate.projects.slice(0, 2).map((project, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border border-green-200">
                              <div className="flex justify-between items-start mb-1">
                                <div className="font-medium text-sm text-green-900">{project.title}</div>
                                <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs font-semibold">
                                  AI: {project.aiScore}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-700 mb-2">{project.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {project.technologies.slice(0, 5).map((tech, techIdx) => (
                                  <Badge key={techIdx} variant="outline" className="text-xs">{tech}</Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Users className="h-4 w-4 mr-2" />
                          Contact Candidate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-gray-200">
                    <CardContent className="py-16 text-center">
                      <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
                      <p className="text-gray-700">Try adjusting your search criteria</p>
                    </CardContent>
                  </Card>
                )}

                {/* Other Matches */}
                {rankedCandidates.length > 1 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Strong Matches ({rankedCandidates.length - 1})</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {rankedCandidates.slice(1, 5).map((result, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCandidate(result.candidate)}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {result.candidate.firstName} {result.candidate.lastName}
                                </div>
                                <div className="text-xs text-gray-700">{result.candidate.education[0]?.university}</div>
                              </div>
                              <Badge variant="outline" className="text-xs font-medium">
                                {result.matchScore}%
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-700 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {result.candidate.location.city}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Platform Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              How InTransparency Made It Possible
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {platformBenefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-2">{benefit.stat}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-sm text-gray-700">{benefit.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Results */}
          <Card className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-blue-900">
                <TrendingUp className="h-6 w-6 mr-2" />
                Results & Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">73%</div>
                  <div className="text-sm text-gray-800 mb-1 font-medium">Faster Hiring</div>
                  <p className="text-xs text-gray-700">From 45 days to just 12 days</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                  <div className="text-sm text-gray-800 mb-1 font-medium">Average Match Score</div>
                  <p className="text-xs text-gray-700">All three candidates were perfect fits</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-2">€45K</div>
                  <div className="text-sm text-gray-800 mb-1 font-medium">Recruitment Cost Savings</div>
                  <p className="text-xs text-gray-700">Compared to traditional agency fees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Candidates?
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join leading companies using InTransparency to hire faster and smarter with AI-powered candidate matching
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/auth/register/role-selection'}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/how-it-works'}
              >
                Learn How It Works
                <Briefcase className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
