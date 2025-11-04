'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, GraduationCap, Award, Code, BookOpen, MapPin, Building2, Calendar, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'

interface StudentCandidate {
  id: string
  name: string
  university: string
  degree: string
  gpa: number
  graduationDate: string
  topCourses: Array<{name: string; grade: number}>
  projects: number
  skills: string[]
  verified: boolean
  professorEndorsements: number
  matchScore: number
}

export default function CompanySearchInterface() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [gpaRange, setGpaRange] = useState([25, 30])
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  
  // Mock search results
  const mockResults: StudentCandidate[] = [
    {
      id: '1',
      name: 'Sofia Romano',
      university: 'Politecnico di Milano',
      degree: 'Computer Engineering',
      gpa: 29.2,
      graduationDate: 'July 2024',
      topCourses: [
        { name: 'Machine Learning', grade: 30 },
        { name: 'Database Systems', grade: 29 },
        { name: 'Software Engineering', grade: 30 }
      ],
      projects: 4,
      skills: ['Python', 'TensorFlow', 'SQL', 'React'],
      verified: true,
      professorEndorsements: 2,
      matchScore: 95
    },
    {
      id: '2',
      name: 'Marco Bianchi',
      university: 'Bocconi University',
      degree: 'Data Science',
      gpa: 28.5,
      graduationDate: 'June 2024',
      topCourses: [
        { name: 'Statistical Learning', grade: 29 },
        { name: 'Big Data Analytics', grade: 28 },
        { name: 'Python Programming', grade: 30 }
      ],
      projects: 3,
      skills: ['Python', 'R', 'Spark', 'Machine Learning'],
      verified: true,
      professorEndorsements: 1,
      matchScore: 88
    },
    {
      id: '3',
      name: 'Elena Rossi',
      university: 'Sapienza University',
      degree: 'Computer Science',
      gpa: 27.8,
      graduationDate: 'September 2024',
      topCourses: [
        { name: 'Algorithms', grade: 28 },
        { name: 'Web Development', grade: 27 },
        { name: 'Cloud Computing', grade: 29 }
      ],
      projects: 5,
      skills: ['JavaScript', 'Node.js', 'AWS', 'Docker'],
      verified: false,
      professorEndorsements: 0,
      matchScore: 82
    }
  ]

  const handleNaturalSearch = () => {
    // AI interprets the natural language query
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Academic Talent</h1>
          <p className="text-gray-600">Find graduates based on verified academic performance and real projects</p>
        </div>

        {/* Natural Language Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-600" />
                <Input
                  className="pl-10 h-12 text-lg"
                  placeholder='Try: "Python developer with ML background and healthcare projects"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" onClick={handleNaturalSearch}>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Search
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* AI Interpretation */}
            {searchQuery && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Sparkles className="inline h-4 w-4 mr-1" />
                  AI Understanding: Looking for <Badge variant="secondary">Computer Engineering</Badge> graduates with
                  <Badge variant="secondary" className="ml-1">Python</Badge>
                  <Badge variant="secondary" className="ml-1">Machine Learning</Badge> skills and
                  <Badge variant="secondary" className="ml-1">Healthcare</Badge> project experience
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* GPA Range */}
                <div>
                  <Label>GPA Range (18-30)</Label>
                  <div className="mt-3 px-2">
                    <Slider
                      value={gpaRange}
                      onValueChange={setGpaRange}
                      max={30}
                      min={18}
                      step={0.5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{gpaRange[0]}</span>
                      <span>{gpaRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Universities */}
                <div>
                  <Label>Universities</Label>
                  <div className="mt-3 space-y-2">
                    {['Politecnico di Milano', 'Bocconi', 'Sapienza'].map((uni) => (
                      <div key={uni} className="flex items-center">
                        <Checkbox
                          id={uni}
                          checked={selectedUniversities.includes(uni)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUniversities([...selectedUniversities, uni])
                            } else {
                              setSelectedUniversities(selectedUniversities.filter(u => u !== uni))
                            }
                          }}
                        />
                        <label htmlFor={uni} className="ml-2 text-sm cursor-pointer">
                          {uni}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Courses */}
                <div>
                  <Label>Must Have Courses</Label>
                  <div className="mt-3 space-y-2">
                    {['Machine Learning', 'Database Systems', 'Algorithms'].map((course) => (
                      <div key={course} className="flex items-center">
                        <Checkbox id={course} />
                        <label htmlFor={course} className="ml-2 text-sm cursor-pointer">
                          {course} (min 25/30)
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowFilters(false)}>Cancel</Button>
                <Button>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Found {mockResults.length} matching candidates</h2>
            <select className="border rounded-md px-3 py-2">
              <option>Sort by: Best Match</option>
              <option>Sort by: GPA (High to Low)</option>
              <option>Sort by: Recent Graduates</option>
              <option>Sort by: Most Projects</option>
            </select>
          </div>

          {mockResults.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{candidate.name}</h3>
                          {candidate.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-blue-600">
                            {candidate.matchScore}% Match
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {candidate.university}
                          </span>
                          <span className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            {candidate.degree}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {candidate.graduationDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{candidate.gpa}/30</div>
                        <div className="text-sm text-gray-600">GPA</div>
                      </div>
                    </div>

                    {/* Top Courses */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Top Courses:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {candidate.topCourses.map((course, i) => (
                          <Badge key={i} variant="secondary">
                            {course.name}: {course.grade}/30
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Skills & Projects */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">Skills from Projects:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{candidate.projects}</div>
                        <div className="text-sm text-gray-600">Projects</div>
                        {candidate.professorEndorsements > 0 && (
                          <Badge className="mt-1" variant="secondary">
                            {candidate.professorEndorsements} Prof. Endorsements
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Button className="ml-4" size="lg">
                    View Profile
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Candidates
          </Button>
        </div>
      </div>
    </div>
  )
}