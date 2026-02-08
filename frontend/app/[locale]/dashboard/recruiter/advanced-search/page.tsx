'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search,
  Filter,
  Save,
  Bell,
  Download,
  TrendingUp,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  Briefcase,
  Code,
  Brain,
  Target,
  Star,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Clock,
  Building2,
  Users,
  BarChart3,
  AlertCircle,
  Eye,
  MessageCircle,
  CheckCircle2
} from 'lucide-react'

interface StudentProject {
  id: string
  title: string
  technologies: string[]
  innovationScore: number | null
}

interface Student {
  id: string
  name: string
  initials: string
  email: string
  university: string | null
  degree: string | null
  graduationYear: string | null
  gpa: number | null
  bio: string | null
  tagline: string | null
  photo: string | null
  projectCount: number
  topProjects: StudentProject[]
}

interface SearchResponse {
  students: Student[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function AdvancedSearchPage() {
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  // Save search state
  const [saveSearchName, setSaveSearchName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [savingSearch, setSavingSearch] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // Skill Categories
  const skillCategories = {
    'Programming Languages': ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust', 'TypeScript', 'Swift'],
    'Web Technologies': ['React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Spring Boot', 'GraphQL'],
    'Data & AI': ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Spark', 'Hadoop'],
    'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    'Databases': ['SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Cassandra'],
    'Mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift UI', 'Kotlin']
  }

  // Major Fields
  const majorFields = [
    'Computer Science',
    'Software Engineering',
    'Data Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Electrical Engineering',
    'Computer Engineering',
    'Information Systems',
    'Mathematics',
    'Statistics',
    'Physics',
    'Cybersecurity'
  ]

  // Location Groups
  const locationGroups = {
    'Tech Hubs': ['San Francisco Bay Area', 'Seattle', 'Austin', 'New York', 'Boston'],
    'Major Cities': ['Los Angeles', 'Chicago', 'Denver', 'Atlanta', 'Miami', 'Phoenix'],
    'Emerging Tech': ['Raleigh-Durham', 'Salt Lake City', 'Pittsburgh', 'Portland', 'Nashville'],
    'International': ['Toronto', 'London', 'Berlin', 'Singapore', 'Tokyo', 'Tel Aviv']
  }

  // Search Filters State
  const [filters, setFilters] = useState({
    // Academic
    university: '',
    minGPA: 3.0,
    maxGPA: 4.0,
    major: '',
    graduationYears: ['2024', '2025'] as string[],

    // Skills & Experience
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    minProjects: 1,
    minAIScore: 70,
    githubActivity: 'any',
    portfolioRequired: false,
    experienceLevel: 'entry',
    internships: true,
    research: false,
    publications: false,

    // Location
    locations: [] as string[],
    willingToRelocate: true,
    remoteOnly: false,
  })

  const handleSkillToggle = (skill: string, type: 'required' | 'preferred') => {
    const key = type === 'required' ? 'requiredSkills' : 'preferredSkills'
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(skill)
        ? prev[key].filter(s => s !== skill)
        : [...prev[key], skill]
    }))
  }

  const handleLocationToggle = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }))
  }

  const runSearch = useCallback(async (page = 1) => {
    setSearchLoading(true)
    setSearchError(null)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()

      // Academic filters
      if (filters.university) params.set('university', filters.university)
      if (filters.major) params.set('major', filters.major)
      if (filters.minGPA > 0) params.set('gpaMin', String(filters.minGPA))
      if (filters.graduationYears.length === 1) {
        params.set('graduationYear', filters.graduationYears[0])
      }

      // Skills
      const allSkills = [...filters.requiredSkills, ...filters.preferredSkills]
      if (allSkills.length > 0) params.set('skills', allSkills.join(','))

      // Projects
      if (filters.minProjects > 0) params.set('minProjects', String(filters.minProjects))

      // Location
      if (filters.locations.length > 0) params.set('location', filters.locations[0])

      params.set('page', String(page))
      params.set('limit', '20')

      const res = await fetch(`/api/dashboard/recruiter/search/students?${params.toString()}`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Search failed (${res.status})`)
      }

      const data: SearchResponse = await res.json()
      setSearchResults(data.students)
      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
      setTotalResults(data.total)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Failed to run search')
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [filters])

  const handleSaveSearch = async () => {
    if (!saveSearchName.trim()) return
    setSavingSearch(true)
    setSaveSuccess(null)

    try {
      const res = await fetch('/api/dashboard/recruiter/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: saveSearchName.trim(),
          filters: {
            university: filters.university || undefined,
            major: filters.major || undefined,
            gpaMin: filters.minGPA > 0 ? String(filters.minGPA) : undefined,
            graduationYear: filters.graduationYears.length === 1 ? filters.graduationYears[0] : undefined,
            skills: [...filters.requiredSkills, ...filters.preferredSkills].join(',') || undefined,
            minProjects: filters.minProjects > 0 ? String(filters.minProjects) : undefined,
            location: filters.locations.length > 0 ? filters.locations[0] : undefined,
          },
          alertsEnabled: false,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to save search')
      }

      setSaveSuccess(`Search "${saveSearchName}" saved successfully!`)
      setSaveSearchName('')
      setTimeout(() => {
        setShowSaveDialog(false)
        setSaveSuccess(null)
      }, 2000)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save search')
    } finally {
      setSavingSearch(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      runSearch(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Talent Search</h1>
          <p className="text-gray-600 mt-2">
            Find the perfect candidates with precision filters and AI-powered matching
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button onClick={() => runSearch(1)} disabled={searchLoading}>
            <Search className="h-4 w-4 mr-2" />
            {searchLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Academic Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Academic Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* University text input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">University</label>
                  <Input
                    placeholder="Search universities..."
                    value={filters.university}
                    onChange={(e) => setFilters(prev => ({ ...prev, university: e.target.value }))}
                  />
                </div>

                {/* GPA Range */}
                <div>
                  <label className="text-sm font-medium">GPA Range</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      value={filters.minGPA}
                      onChange={(e) => setFilters(prev => ({ ...prev, minGPA: parseFloat(e.target.value) }))}
                      className="w-20 px-2 py-1 border rounded"
                    />
                    <span className="text-gray-700">to</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      value={filters.maxGPA}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxGPA: parseFloat(e.target.value) }))}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </div>
                </div>

                {/* Major */}
                <div>
                  <label className="text-sm font-medium">Major/Field of Study</label>
                  <select
                    value={filters.major}
                    onChange={(e) => setFilters(prev => ({ ...prev, major: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Majors</option>
                    {majorFields.map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="text-sm font-medium">Graduation Year</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['2023', '2024', '2025', '2026'].map(year => (
                      <label key={year} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.graduationYears.includes(year)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, graduationYears: [...prev.graduationYears, year] }))
                            } else {
                              setFilters(prev => ({ ...prev, graduationYears: prev.graduationYears.filter(y => y !== year) }))
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{year}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Academic Filters */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Additional Criteria</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.research}
                        onChange={(e) => setFilters(prev => ({ ...prev, research: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Research Experience</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.publications}
                        onChange={(e) => setFilters(prev => ({ ...prev, publications: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Published Papers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.internships}
                        onChange={(e) => setFilters(prev => ({ ...prev, internships: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Internship Experience</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(locationGroups).map(([group, locations]) => (
                  <div key={group}>
                    <h4 className="text-sm font-medium mb-2">{group}</h4>
                    <div className="space-y-1">
                      {(locations || []).slice(0, 3).map(location => (
                        <label key={location} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={filters.locations.includes(location)}
                            onChange={() => handleLocationToggle(location)}
                            className="mr-2"
                          />
                          <span>{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.willingToRelocate}
                      onChange={(e) => setFilters(prev => ({ ...prev, willingToRelocate: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Willing to Relocate</span>
                  </label>
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={filters.remoteOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, remoteOnly: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Remote Only</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills and Results Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(skillCategories).map(([category, skills]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-sm font-medium mb-3">{category}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {skills.map(skill => {
                      const isRequired = filters.requiredSkills.includes(skill)
                      const isPreferred = filters.preferredSkills.includes(skill)
                      return (
                        <div key={skill} className="relative">
                          <button
                            onClick={() => handleSkillToggle(skill, isRequired ? 'required' : 'preferred')}
                            className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                              isRequired
                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                : isPreferred
                                ? 'bg-green-50 border-green-300 text-green-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {skill}
                          </button>
                          {(isRequired || isPreferred) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setFilters(prev => ({
                                  ...prev,
                                  requiredSkills: prev.requiredSkills.filter(s => s !== skill),
                                  preferredSkills: prev.preferredSkills.filter(s => s !== skill)
                                }))
                              }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                          {isRequired && (
                            <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs bg-blue-600">
                              Required
                            </Badge>
                          )}
                          {isPreferred && (
                            <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs bg-green-600">
                              Preferred
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">{filters.requiredSkills.length}</span> required,{' '}
                  <span className="font-medium text-green-600">{filters.preferredSkills.length}</span> preferred skills
                </div>
                <Button variant="outline" size="sm">
                  Add Custom Skill
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project & Performance Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Minimum AI Score</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minAIScore}
                      onChange={(e) => setFilters(prev => ({ ...prev, minAIScore: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">{filters.minAIScore}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Minimum Projects</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={filters.minProjects}
                      onChange={(e) => setFilters(prev => ({ ...prev, minProjects: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">{filters.minProjects}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">GitHub Activity</label>
                  <select
                    value={filters.githubActivity}
                    onChange={(e) => setFilters(prev => ({ ...prev, githubActivity: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="any">Any Activity</option>
                    <option value="active">Active (Weekly)</option>
                    <option value="moderate">Moderate (Monthly)</option>
                    <option value="low">Low (Quarterly)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Experience Level</label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior (1-2 years)</option>
                    <option value="mid">Mid-Level (3-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.portfolioRequired}
                    onChange={(e) => setFilters(prev => ({ ...prev, portfolioRequired: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Portfolio/Personal Website Required</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Diversity & Inclusion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Diversity & Inclusion (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                These filters help promote diverse hiring practices. All information is self-reported and optional.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">First Generation College</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Veteran Status</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">International Student</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Search Summary & Actions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Search Summary</h3>
                  <div className="flex flex-wrap gap-2">
                    {filters.university && (
                      <Badge variant="outline" className="bg-white">
                        University: {filters.university}
                      </Badge>
                    )}
                    {filters.requiredSkills.length > 0 && (
                      <Badge variant="outline" className="bg-white">
                        {filters.requiredSkills.length} Required Skills
                      </Badge>
                    )}
                    {filters.locations.length > 0 && (
                      <Badge variant="outline" className="bg-white">
                        {filters.locations.length} Locations
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-white">
                      GPA {filters.minGPA} - {filters.maxGPA}
                    </Badge>
                    {filters.minProjects > 0 && (
                      <Badge variant="outline" className="bg-white">
                        Min {filters.minProjects} Projects
                      </Badge>
                    )}
                  </div>
                  {hasSearched && (
                    <p className="text-sm text-gray-600 mt-3">
                      Found: <span className="font-semibold text-blue-600">{totalResults} candidates</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Search
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => runSearch(1)}
                    disabled={searchLoading}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {searchLoading ? 'Searching...' : 'Run Search'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Search Dialog */}
          {showSaveDialog && (
            <Card className="border-blue-200">
              <CardContent className="p-6">
                {saveSuccess ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{saveSuccess}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Label htmlFor="searchName">Search Name</Label>
                      <Input
                        id="searchName"
                        placeholder="e.g., ML Engineers - Bay Area"
                        value={saveSearchName}
                        onChange={(e) => setSaveSearchName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveSearch()}
                      />
                    </div>
                    <Button onClick={handleSaveSearch} disabled={savingSearch || !saveSearchName.trim()}>
                      {savingSearch ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error state */}
          {searchError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Search failed</p>
                  <p className="text-sm text-red-600">{searchError}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => runSearch(currentPage)}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading state */}
          {searchLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-2 pt-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-14" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Search Results */}
          {!searchLoading && searchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Search Results ({totalResults} candidate{totalResults !== 1 ? 's' : ''})
                </h2>
              </div>

              {searchResults.map(student => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.initials}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>{student.university || 'University not specified'}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.degree || 'Degree N/A'} {student.graduationYear ? `- Class of ${student.graduationYear}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {student.projectCount} project{student.projectCount !== 1 ? 's' : ''}
                        </Badge>
                        {student.gpa !== null && (
                          <Badge variant="outline">
                            GPA: {student.gpa}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {student.bio && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{student.bio}</p>
                    )}

                    {student.topProjects.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Top Projects:</p>
                        <div className="flex flex-wrap gap-2">
                          {student.topProjects.map(project => (
                            <div key={project.id} className="flex items-center space-x-1">
                              <Badge variant="secondary" className="text-xs">
                                {project.title}
                              </Badge>
                              {project.innovationScore !== null && (
                                <span className="text-xs text-green-600">{project.innovationScore}/10</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* No results state */}
          {!searchLoading && hasSearched && searchResults.length === 0 && !searchError && (
            <Card className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more results
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
