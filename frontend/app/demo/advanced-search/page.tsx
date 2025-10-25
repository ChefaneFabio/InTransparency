'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { motion } from 'framer-motion'

type DemoType = 'student' | 'company' | 'university'

// Mock data
const mockJobs = [
  { id: '1', title: 'Frontend Developer', company: 'TechStartup', location: 'Milan, IT', salary: '€35,000 - €45,000', type: 'Full-time', match: 94, posted: '2 days ago', applicants: 45 },
  { id: '2', title: 'Junior Software Engineer', company: 'InnovateCo', location: 'Remote', salary: '€30,000 - €40,000', type: 'Full-time', match: 89, posted: '1 week ago', applicants: 120 },
  { id: '101', title: 'Stage Curriculare - Software Development', company: 'Microsoft Italia', location: 'Milan, IT', salary: '€800/month', type: 'Internship', duration: '6 months', match: 96, posted: '3 days ago', applicants: 89, validForDegree: true },
  { id: '102', title: 'Tirocinio Data Science', company: 'IBM Rome', location: 'Rome, IT', salary: '€900/month', type: 'Internship', duration: '6 months', match: 93, posted: '5 days ago', applicants: 67, validForDegree: true },
  { id: '3', title: 'React Developer', company: 'StartupHub', location: 'Rome, IT', salary: '€32,000 - €42,000', type: 'Full-time', match: 87, posted: '1 week ago', applicants: 78 },
]

const mockCandidates = [
  { id: '1', initials: 'M.R.', university: 'Politecnico di Milano', major: 'Cybersecurity', gpa: 30, skills: ['Network Security', 'Python', 'Cryptography'], softSkills: ['Problem-solving', 'Teamwork'], match: 96, available: true },
  { id: '2', initials: 'S.B.', university: 'Sapienza Roma', major: 'Computer Science', gpa: 29, skills: ['Cybersecurity', 'Linux', 'Ethical Hacking'], softSkills: ['Leadership', 'Communication'], match: 92, available: true },
  { id: '3', initials: 'L.V.', university: 'Politecnico di Torino', major: 'Software Engineering', gpa: 29, skills: ['Network Security', 'Java', 'Cloud'], softSkills: ['Analytical', 'Detail-oriented'], match: 89, available: true },
]

const universities = [
  'Politecnico di Milano',
  'Sapienza Roma',
  'Università di Bologna',
  'Politecnico di Torino',
  'Università degli Studi di Padova',
  'Università degli Studi di Firenze'
]

const cities = ['Milan', 'Rome', 'Turin', 'Florence', 'Bologna', 'Naples']

const majors = [
  'Computer Science',
  'Software Engineering',
  'Data Science',
  'Cybersecurity',
  'Artificial Intelligence',
  'Information Systems'
]

const skills = [
  'JavaScript', 'React', 'Python', 'Java', 'Node.js',
  'TypeScript', 'SQL', 'AWS', 'Docker', 'Kubernetes'
]

export default function AdvancedSearchPage() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('student')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  // Student filters
  const [jobType, setJobType] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100000])

  // Company filters
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [gpaMin, setGpaMin] = useState(24)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const demoConfig = {
    student: {
      title: 'Advanced Job Search',
      subtitle: 'Filter by location, salary, type, and more',
      color: 'from-teal-600 to-blue-600',
      icon: GraduationCap,
      results: mockJobs,
      totalCount: '5,240'
    },
    company: {
      title: 'Advanced Candidate Search',
      subtitle: 'Filter by university, skills, GPA, and more',
      color: 'from-blue-600 to-purple-600',
      icon: Building2,
      results: mockCandidates,
      totalCount: '12,847'
    },
    university: {
      title: 'Advanced Search Hub',
      subtitle: 'Search students and opportunities',
      color: 'from-indigo-600 to-purple-600',
      icon: Users,
      results: mockJobs,
      totalCount: '8,934'
    }
  }

  const config = demoConfig[activeDemo]
  const Icon = config.icon

  const toggleFilter = (arr: string[], value: string, setter: (val: string[]) => void) => {
    if (arr.includes(value)) {
      setter(arr.filter(v => v !== value))
    } else {
      setter([...arr, value])
    }
  }

  const clearAllFilters = () => {
    setJobType([])
    setSelectedCities([])
    setSalaryRange([0, 100000])
    setSelectedUniversities([])
    setSelectedMajors([])
    setGpaMin(24)
    setSelectedSkills([])
    setSearchQuery('')
  }

  const activeFiltersCount = jobType.length + selectedCities.length +
    selectedUniversities.length + selectedMajors.length + selectedSkills.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  InTransparency
                </span>
                <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-300">DEMO</Badge>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/demo/ai-search">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Search
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button className={`bg-gradient-to-r ${config.color}`} asChild>
                <Link href="/auth/register/role-selection">Register Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-full px-6 py-2 mb-4">
            <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-blue-900">Advanced Search - Filter & Find Exactly What You Need</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {config.totalCount} Verified Results
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use filters to narrow down and find your perfect match. No AI needed - just traditional search.
          </p>
        </div>

        {/* Demo Selector */}
        <Tabs value={activeDemo} onValueChange={(v) => setActiveDemo(v as DemoType)} className="mb-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Student Demo
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Demo
            </TabsTrigger>
            <TabsTrigger value="university" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              University Demo
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeDemo === 'student'
                      ? 'Search by job title, company, or keywords...'
                      : activeDemo === 'company'
                      ? 'Search by skills, major, or university...'
                      : 'Search students or jobs...'
                  }
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white">{activeFiltersCount}</Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-4"
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Student Filters */}
                  {activeDemo === 'student' && (
                    <>
                      {/* Job Type */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Job Type
                        </h3>
                        <div className="space-y-2">
                          {['Full-time', 'Internship', 'Part-time', 'Remote'].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={jobType.includes(type)}
                                onChange={() => toggleFilter(jobType, type, setJobType)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </h3>
                        <div className="space-y-2">
                          {cities.map((city) => (
                            <label key={city} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedCities.includes(city)}
                                onChange={() => toggleFilter(selectedCities, city, setSelectedCities)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{city}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Salary Range */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Salary Range
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          €{salaryRange[0].toLocaleString()} - €{salaryRange[1].toLocaleString()}
                        </p>
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="5000"
                          value={salaryRange[1]}
                          onChange={(e) => setSalaryRange([0, parseInt(e.target.value)])}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  {/* Company Filters */}
                  {activeDemo === 'company' && (
                    <>
                      {/* University */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          University
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {universities.map((uni) => (
                            <label key={uni} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedUniversities.includes(uni)}
                                onChange={() => toggleFilter(selectedUniversities, uni, setSelectedUniversities)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{uni}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Major */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Major
                        </h3>
                        <div className="space-y-2">
                          {majors.map((major) => (
                            <label key={major} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedMajors.includes(major)}
                                onChange={() => toggleFilter(selectedMajors, major, setSelectedMajors)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{major}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* GPA */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Minimum GPA
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{gpaMin}/30</p>
                        <input
                          type="range"
                          min="18"
                          max="30"
                          value={gpaMin}
                          onChange={(e) => setGpaMin(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Skills
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {skills.map((skill) => (
                            <label key={skill} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedSkills.includes(skill)}
                                onChange={() => toggleFilter(selectedSkills, skill, setSelectedSkills)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{skill}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-bold text-gray-900">{config.results.length}</span> results found
                {activeFiltersCount > 0 && ` with ${activeFiltersCount} filters applied`}
              </p>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Sort by: Most Recent
              </Button>
            </div>

            <div className="space-y-4">
              {config.results.map((result: any) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      {/* Job Result */}
                      {result.title && (
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center text-white font-bold`}>
                                {result.company[0]}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{result.title}</h3>
                                <p className="text-gray-600 mb-2">{result.company}</p>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {result.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    {result.salary}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {result.posted}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className="bg-blue-100 text-blue-800">{result.type}</Badge>
                                  {result.validForDegree && (
                                    <Badge className="bg-purple-100 text-purple-800">✓ Valid for Degree</Badge>
                                  )}
                                  {result.duration && (
                                    <Badge className="bg-gray-100 text-gray-800">{result.duration}</Badge>
                                  )}
                                  <Badge className="bg-gray-100 text-gray-700">{result.applicants} applicants</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end justify-between">
                            <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
                              {result.match}% Match
                            </Badge>
                            <Button className={`bg-gradient-to-r ${config.color}`}>
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Candidate Result */}
                      {result.initials && (
                        <div className="flex justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                              {result.initials}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">Contact Locked</h3>
                                <Badge className="bg-green-100 text-green-800 text-xs">Available</Badge>
                              </div>
                              <p className="text-gray-600 mb-2">{result.university}</p>
                              <p className="text-sm text-gray-700 mb-3">
                                <strong>Major:</strong> {result.major} • <strong>GPA:</strong> {result.gpa}/30
                              </p>
                              <div className="mb-2">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Technical Skills:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.skills.map((skill: string) => (
                                    <Badge key={skill} className="bg-blue-100 text-blue-800 text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Soft Skills:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.softSkills.map((skill: string) => (
                                    <Badge key={skill} className="bg-purple-100 text-purple-800 text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end justify-between">
                            <Badge className="bg-green-100 text-green-800 text-base px-3 py-1 mb-2">
                              {result.match}% Match
                            </Badge>
                            <Button className={`bg-gradient-to-r ${config.color}`}>
                              Unlock for €10
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Showing {config.results.length} of {config.totalCount} results
              </p>
              <Button variant="outline" size="lg" className="px-8">
                Load More Results
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Register free to see all results and apply
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
