'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CourseFilters } from '@/components/search/CourseFilters'
import {
  searchStudentsByCourse,
  MOCK_STUDENTS_WITH_COURSES,
  generateMatchExplanation
} from '@/lib/data/mock-course-data'
import { CourseCategory, COURSE_CATEGORIES } from '@/lib/types/course-data'
import {
  GraduationCap,
  MapPin,
  Award,
  Code,
  MessageSquare,
  Sparkles,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

export default function CourseSearchPage() {
  const [filters, setFilters] = useState<{
    courseCategory?: CourseCategory
    minGrade?: number
    institutionType?: 'its' | 'university' | 'both'
    location?: string
    radius?: number
  }>({
    institutionType: 'both'
  })
  const [results, setResults] = useState(MOCK_STUDENTS_WITH_COURSES)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  const handleApplyFilters = () => {
    const filtered = searchStudentsByCourse(filters)
    setResults(filtered)
  }

  const getSelectedCandidateData = () => {
    if (!selectedCandidate) return null
    return results.find(c => c.id === selectedCandidate)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Course-Level Search
          </h1>
          <p className="text-gray-600 mt-2">
            Filter candidates by verified course grades from institutions (ITS & Universities)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CourseFilters
              filters={filters}
              onChange={setFilters}
              onApply={handleApplyFilters}
              resultCount={results.length}
            />

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Search Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Candidates</span>
                  <span className="font-semibold">{MOCK_STUDENTS_WITH_COURSES.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Matching Filters</span>
                  <span className="font-semibold text-primary">{results.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Match Rate</span>
                  <span className="font-semibold text-green-600">
                    {Math.round((results.length / MOCK_STUDENTS_WITH_COURSES.length) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {results.length} Candidate{results.length !== 1 ? 's' : ''} Found
              </h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/recruiter/market-intelligence">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Market Intelligence
                </Link>
              </Button>
            </div>

            {results.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={() => {
                  setFilters({ institutionType: 'both' })
                  setResults(MOCK_STUDENTS_WITH_COURSES)
                }}>
                  Reset Filters
                </Button>
              </Card>
            ) : (
              results.map((candidate) => {
                const explanation = generateMatchExplanation(candidate, {
                  role: filters.courseCategory || 'Technical Role',
                  requiredSkills: candidate.courses.map(c => c.courseCategory)
                })
                const isExpanded = selectedCandidate === candidate.id

                return (
                  <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-secondary text-white">
                              {candidate.name}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{candidate.name}</h3>
                              {candidate.institutionType === 'its' ? (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  🔧 ITS
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                  🎓 University
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {candidate.institutionName}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {candidate.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {candidate.matchScore}%
                          </div>
                          <div className="text-xs text-gray-600">Match Score</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Top Courses */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          Top Verified Courses
                        </h4>
                        <div className="space-y-2">
                          {candidate.courses
                            .sort((a, b) => b.grade.normalized - a.grade.normalized)
                            .slice(0, 3)
                            .map((course) => (
                              <div
                                key={course.id}
                                className="flex items-center justify-between text-sm bg-gray-50 rounded p-2"
                              >
                                <span className="font-medium">{course.courseName}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant={course.grade.honors ? 'default' : 'secondary'}>
                                    {course.grade.value}/{course.grade.scale === 'its' ? '10' : '30'}
                                    {course.grade.honors && ' 🏆'}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {course.grade.letter}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* AI Match Explanation */}
                      {isExpanded && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Why This Match? (AI Analysis)
                          </h4>

                          {/* Strengths */}
                          <div className="space-y-2 mb-4">
                            {explanation.strengths.map((strength, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-lg">{strength.icon}</span>
                                <span className="text-gray-700">{strength.text}</span>
                              </div>
                            ))}
                          </div>

                          {/* Concerns */}
                          {explanation.concerns.length > 0 && (
                            <div className="space-y-2 bg-orange-50 rounded p-3">
                              <h5 className="text-sm font-semibold text-orange-900">Considerations:</h5>
                              {explanation.concerns.map((concern, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                  <span className="text-lg">{concern.icon}</span>
                                  <span className="text-orange-700">{concern.text}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Full Course List */}
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold mb-2">All Verified Courses:</h5>
                            <div className="grid grid-cols-1 gap-2">
                              {candidate.courses.map((course) => (
                                <div
                                  key={course.id}
                                  className="text-xs bg-white border rounded p-2 flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-medium">{course.courseName}</div>
                                    <div className="text-gray-500">{course.semester}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">
                                      {course.grade.value}/{course.grade.scale === 'its' ? '10' : '30'}
                                    </div>
                                    <div className="text-gray-500">{course.grade.letter}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {candidate.projects.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Code className="h-4 w-4 text-primary" />
                            Verified Projects
                          </h4>
                          <div className="space-y-1">
                            {candidate.projects.map((project, i) => (
                              <div key={i} className="text-sm flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{project.title}</span>
                                <div className="flex gap-1">
                                  {project.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t">
                        <Button
                          variant={isExpanded ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCandidate(isExpanded ? null : candidate.id)}
                        >
                          {isExpanded ? 'Hide Details' : 'See Full Analysis'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact (€10)
                        </Button>
                        <Button size="sm" className="ml-auto">
                          View Full Profile
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
