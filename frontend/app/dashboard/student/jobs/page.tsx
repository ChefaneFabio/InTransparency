'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  MapPin, 
  Building, 
  Clock, 
  Heart, 
  Bookmark,
  ExternalLink,
  Filter,
  Star,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Target,
  Briefcase,
  Award
} from 'lucide-react'

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [salaryFilter, setSalaryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('match')

  useEffect(() => {
    fetchJobs()
  }, [user])

  useEffect(() => {
    filterAndSortJobs()
  }, [jobs, searchQuery, locationFilter, typeFilter, experienceFilter, salaryFilter, sortBy])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      // Mock job data
      const mockJobs = [
        {
          id: 1,
          title: "Full Stack Developer",
          company: "TechStart Inc.",
          location: "San Francisco, CA",
          locationType: "hybrid",
          type: "full-time",
          experience: "entry",
          salary: "$85k - $120k",
          salaryMin: 85000,
          salaryMax: 120000,
          match: 94,
          description: "Join our innovative team building the next generation of productivity tools. We're looking for a passionate full-stack developer to help shape our platform.",
          requirements: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
          skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
          logo: "/api/placeholder/40/40",
          postedDate: "2024-01-20",
          applicationDeadline: "2024-02-20",
          applicants: 127,
          isBookmarked: false,
          isApplied: false,
          matchingProjects: ["AI-Powered Task Management System"]
        },
        {
          id: 2,
          title: "AI Engineer",
          company: "InnovateLabs",
          location: "Remote",
          locationType: "remote",
          type: "full-time",
          experience: "mid",
          salary: "$90k - $130k",
          salaryMin: 90000,
          salaryMax: 130000,
          match: 91,
          description: "Help us build cutting-edge AI solutions that transform how businesses operate. Looking for someone passionate about machine learning and AI integration.",
          requirements: ["Python", "TensorFlow", "PyTorch", "API Development", "Cloud Platforms"],
          skills: ["AI Integration", "Python", "React", "API Development"],
          logo: "/api/placeholder/40/40",
          postedDate: "2024-01-18",
          applicationDeadline: "2024-02-18",
          applicants: 89,
          isBookmarked: true,
          isApplied: false,
          matchingProjects: ["AI-Powered Task Management System"]
        },
        {
          id: 3,
          title: "Frontend Developer",
          company: "DesignTech",
          location: "New York, NY",
          locationType: "onsite",
          type: "full-time",
          experience: "entry",
          salary: "$75k - $105k",
          salaryMin: 75000,
          salaryMax: 105000,
          match: 88,
          description: "Create beautiful, responsive web applications that delight users. We value clean code, attention to detail, and collaborative spirit.",
          requirements: ["React", "TypeScript", "CSS", "Figma", "Git"],
          skills: ["React", "TypeScript", "Tailwind CSS", "UI/UX"],
          logo: "/api/placeholder/40/40",
          postedDate: "2024-01-19",
          applicationDeadline: "2024-02-19",
          applicants: 156,
          isBookmarked: false,
          isApplied: true,
          matchingProjects: []
        },
        {
          id: 4,
          title: "Software Engineer Intern",
          company: "BigTech Corp",
          location: "Seattle, WA",
          locationType: "hybrid",
          type: "internship",
          experience: "entry",
          salary: "$35k - $45k",
          salaryMin: 35000,
          salaryMax: 45000,
          match: 86,
          description: "Summer internship opportunity to work on large-scale systems with mentorship from senior engineers. Perfect for students looking to gain industry experience.",
          requirements: ["Any Programming Language", "Data Structures", "Algorithms", "Problem Solving"],
          skills: ["Programming", "Problem Solving", "Teamwork"],
          logo: "/api/placeholder/40/40",
          postedDate: "2024-01-17",
          applicationDeadline: "2024-03-01",
          applicants: 892,
          isBookmarked: true,
          isApplied: false,
          matchingProjects: []
        },
        {
          id: 5,
          title: "Backend Developer",
          company: "DataFlow Systems",
          location: "Austin, TX",
          locationType: "onsite",
          type: "full-time",
          experience: "mid",
          salary: "$80k - $115k",
          salaryMin: 80000,
          salaryMax: 115000,
          match: 83,
          description: "Build robust, scalable backend systems that handle millions of requests. Work with modern technologies and be part of a growing team.",
          requirements: ["Node.js", "PostgreSQL", "Docker", "AWS", "API Design"],
          skills: ["Node.js", "PostgreSQL", "Docker", "API Development"],
          logo: "/api/placeholder/40/40",
          postedDate: "2024-01-16",
          applicationDeadline: "2024-02-16",
          applicants: 203,
          isBookmarked: false,
          isApplied: false,
          matchingProjects: ["AI-Powered Task Management System"]
        }
      ]
      setJobs(mockJobs)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortJobs = () => {
    let filtered = [...jobs]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill: any) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(job => job.locationType === locationFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter)
    }

    // Experience filter
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(job => job.experience === experienceFilter)
    }

    // Salary filter
    if (salaryFilter !== 'all') {
      const [min, max] = salaryFilter.split('-').map(Number)
      filtered = filtered.filter(job => 
        job.salaryMin >= min && (max ? job.salaryMax <= max : true)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        case 'salary':
          return b.salaryMax - a.salaryMax
        case 'company':
          return a.company.localeCompare(b.company)
        default: // match
          return b.match - a.match
      }
    })

    setFilteredJobs(filtered)
  }

  const toggleBookmark = async (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ))
  }

  const applyToJob = async (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ))
  }

  const getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case 'remote': return '🌐'
      case 'hybrid': return '🏢'
      case 'onsite': return '🏗️'
      default: return '📍'
    }
  }

  const getExperienceLevel = (experience: string) => {
    switch (experience) {
      case 'entry': return 'Entry Level'
      case 'mid': return 'Mid Level'
      case 'senior': return 'Senior Level'
      default: return 'All Levels'
    }
  }

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
    return days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Job Opportunities</h1>
            <p className="text-gray-600">Discover jobs matched to your skills and projects</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_: any, i: number) => (
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
        <p className="text-gray-600 mt-1">
          Discover positions matched to your skills and projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">{filteredJobs.length}</div>
              <div className="ml-2 text-sm text-gray-600">Available Jobs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">
                {jobs.filter(j => j.isBookmarked).length}
              </div>
              <div className="ml-2 text-sm text-gray-600">Bookmarked</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">
                {jobs.filter(j => j.isApplied).length}
              </div>
              <div className="ml-2 text-sm text-gray-600">Applied</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(jobs.reduce((acc, j) => acc + j.match, 0) / jobs.length) || 0}%
              </div>
              <div className="ml-2 text-sm text-gray-600">Avg Match</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Jobs ({filteredJobs.length})</TabsTrigger>
          <TabsTrigger value="recommended">
            Recommended ({filteredJobs.filter(j => j.match >= 85).length})
          </TabsTrigger>
          <TabsTrigger value="applied">
            Applied ({jobs.filter(j => j.isApplied).length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            Bookmarked ({jobs.filter(j => j.isBookmarked).length})
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                  <Input
                    placeholder="Search jobs, companies, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Location */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>

              {/* Job Type */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>

              {/* Experience */}
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                  <SelectItem value="company">Company Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="all" className="space-y-6">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setLocationFilter('all')
                    setTypeFilter('all')
                    setExperienceFilter('all')
                    setSalaryFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
              {filteredJobs.map((job: any) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <img 
                          src={job.logo} 
                          alt={job.company}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 font-medium">{job.company}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleBookmark(job.id)}
                                className={job.isBookmarked ? 'text-blue-600' : 'text-gray-600'}
                              >
                                <Bookmark className={`h-4 w-4 ${job.isBookmarked ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-3">
                            <span className="flex items-center">
                              <span className="mr-1">{getLocationIcon(job.locationType)}</span>
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.salary}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {getDaysAgo(job.postedDate)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {job.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.slice(0, 4).map((skill: any) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                          
                          {job.matchingProjects.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-700 mb-1">Matching your projects:</p>
                              <div className="flex flex-wrap gap-1">
                                {job.matchingProjects.map((project: any) => (
                                  <Badge key={project} variant="outline" className="text-xs">
                                    <Target className="h-3 w-3 mr-1" />
                                    {project}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-700">
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {job.applicants} applicants
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-3 ml-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{job.match}%</div>
                          <div className="text-xs text-gray-700">Match</div>
                        </div>
                        
                        {job.isApplied ? (
                          <Badge variant="default" className="text-xs">
                            Applied
                          </Badge>
                        ) : (
                          <div className="flex flex-col space-y-2">
                            <Button size="sm" onClick={() => applyToJob(job.id)}>
                              Apply Now
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            {filteredJobs?.filter((job: any) => job.match >= 85).map((job: any) => (
              <Card key={job.id} className="border-2 border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    <Badge variant="default" className="bg-blue-600">
                      Highly Recommended
                    </Badge>
                  </div>
                  {/* Same job content as above */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <img 
                        src={job.logo} 
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill: any) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-gray-700 mb-4">{job.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-700">
                          <span>{job.location}</span>
                          <span>{job.salary}</span>
                          <span>{getDaysAgo(job.postedDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{job.match}%</div>
                      <Button size="sm" className="mb-2">Apply Now</Button>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applied">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            {jobs?.filter((job: any) => job.isApplied).map((job: any) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Applied</Badge>
                      <span className="text-sm text-gray-700">
                        Applied on {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="outline">Under Review</Badge>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <img 
                      src={job.logo} 
                      alt={job.company}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <p className="text-sm text-gray-700 mt-2">{job.location} • {job.salary}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{job.match}%</div>
                      <div className="text-xs text-gray-700">Match</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookmarked">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            {jobs?.filter((job: any) => job.isBookmarked).map((job: any) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <img 
                        src={job.logo} 
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-sm text-gray-700 mt-1">{job.location} • {job.salary}</p>
                        <p className="text-gray-700 mt-3">{job.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(job.id)}
                        className="text-blue-600"
                      >
                        <Bookmark className="h-4 w-4 fill-current" />
                      </Button>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{job.match}%</div>
                        <div className="text-xs text-gray-700">Match</div>
                      </div>
                      <Button size="sm">Apply Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}