'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Plus,
  X,
  Clock,
  Building2,
  Users,
  BarChart3
} from 'lucide-react'

export default function AdvancedSearchPage() {
  const [searchMode, setSearchMode] = useState<'simple' | 'advanced'>('advanced')
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, name: 'ML Engineers - Bay Area', filters: 12, lastRun: '2 hours ago', newMatches: 5 },
    { id: 2, name: 'New Grad - Ivy League', filters: 8, lastRun: '1 day ago', newMatches: 12 },
    { id: 3, name: 'Senior Developers - Remote', filters: 10, lastRun: '3 days ago', newMatches: 3 }
  ])

  // University Rankings Database
  const universityRankings = {
    'Top 10': ['MIT', 'Stanford', 'Harvard', 'Caltech', 'CMU', 'Berkeley', 'Princeton', 'Yale', 'Columbia', 'Cornell'],
    'Ivy League': ['Harvard', 'Yale', 'Princeton', 'Columbia', 'Cornell', 'Brown', 'Dartmouth', 'UPenn'],
    'Top Public': ['Berkeley', 'UCLA', 'Michigan', 'UVA', 'UNC', 'Georgia Tech', 'UIUC', 'UT Austin'],
    'Top Engineering': ['MIT', 'Stanford', 'Berkeley', 'Caltech', 'CMU', 'Georgia Tech', 'UIUC', 'Purdue'],
    'Top CS Programs': ['MIT', 'Stanford', 'CMU', 'Berkeley', 'UIUC', 'Cornell', 'Georgia Tech', 'Washington'],
    'West Coast': ['Stanford', 'Berkeley', 'Caltech', 'UCLA', 'USC', 'UCSD', 'Washington', 'Oregon State'],
    'East Coast': ['MIT', 'Harvard', 'Yale', 'Princeton', 'Columbia', 'Cornell', 'NYU', 'Boston University']
  }

  // Search Filters State
  const [filters, setFilters] = useState({
    // Academic
    universities: [] as string[],
    universityGroups: [] as string[],
    minGPA: 3.0,
    maxGPA: 4.0,
    major: '',
    graduationYears: ['2024', '2025'],
    degree: 'bachelors',

    // Skills & Experience
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    experienceLevel: 'entry',
    internships: true,
    research: false,
    publications: false,

    // Location
    locations: [] as string[],
    willingToRelocate: true,
    remoteOnly: false,
    visaStatus: 'any',

    // Project & Performance
    minProjects: 1,
    minAIScore: 70,
    githubActivity: 'any',
    portfolioRequired: false,

    // Diversity & Inclusion
    diversityFilters: {
      gender: 'any',
      firstGeneration: false,
      veteran: false,
      international: false
    }
  })

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

  const handleUniversityGroupToggle = (group: string) => {
    if (filters.universityGroups.includes(group)) {
      setFilters(prev => ({
        ...prev,
        universityGroups: prev.universityGroups.filter(g => g !== group),
        universities: prev.universities.filter(u => !universityRankings[group as keyof typeof universityRankings].includes(u))
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        universityGroups: [...prev.universityGroups, group],
        universities: Array.from(new Set([...prev.universities, ...universityRankings[group as keyof typeof universityRankings]]))
      }))
    }
  }

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
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Saved Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Save className="h-5 w-5 mr-2" />
              Saved Searches
            </span>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Save Current Search
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{search.name}</h4>
                  <p className="text-sm text-gray-600">{search.filters} filters • {search.lastRun}</p>
                  {search.newMatches > 0 && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      {search.newMatches} new matches
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Bell className="h-4 w-4 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <ChevronRight className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                {/* University Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">University Groups</label>
                  <div className="space-y-2">
                    {Object.keys(universityRankings).map((group) => (
                      <label key={group} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.universityGroups.includes(group)}
                          onChange={() => handleUniversityGroupToggle(group)}
                          className="mr-2"
                        />
                        <span className="text-sm">{group}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {universityRankings[group as keyof typeof universityRankings].length}
                        </Badge>
                      </label>
                    ))}
                  </div>
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
                  <input
                    type="checkbox"
                    checked={filters.diversityFilters.firstGeneration}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      diversityFilters: { ...prev.diversityFilters, firstGeneration: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">First Generation College</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.diversityFilters.veteran}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      diversityFilters: { ...prev.diversityFilters, veteran: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Veteran Status</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.diversityFilters.international}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      diversityFilters: { ...prev.diversityFilters, international: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">International Student</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Search Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Search Summary</h3>
                  <div className="flex flex-wrap gap-2">
                    {filters.universityGroups.length > 0 && (
                      <Badge variant="outline" className="bg-white">
                        {filters.universityGroups.length} University Groups
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
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Estimated matches: <span className="font-semibold text-blue-600">347 candidates</span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Search
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Search className="h-4 w-4 mr-2" />
                    Run Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}