'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Search,
  GraduationCap,
  MapPin,
  Calendar,
  Award,
  ExternalLink,
  Filter,
  X
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Student {
  id: string
  username: string
  firstName: string
  lastName: string
  photo?: string
  university: string
  degree: string
  graduationYear: number
  projectsCount: number
  verificationScore: number
  skillsCount: number
  topSkills: string[]
}

export default function ExplorePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [skillSearchQuery, setSkillSearchQuery] = useState('')

  // Mock data - replace with actual API call
  const mockStudents: Student[] = [
    {
      id: '1',
      username: 'john-doe',
      firstName: 'John',
      lastName: 'Doe',
      university: 'Politecnico di Milano',
      degree: 'Computer Science',
      graduationYear: 2024,
      projectsCount: 12,
      verificationScore: 100,
      skillsCount: 15,
      topSkills: ['React', 'Python', 'Machine Learning']
    },
    {
      id: '2',
      username: 'maria-rossi',
      firstName: 'Maria',
      lastName: 'Rossi',
      university: 'Università di Bologna',
      degree: 'Data Science',
      graduationYear: 2025,
      projectsCount: 8,
      verificationScore: 95,
      skillsCount: 12,
      topSkills: ['Python', 'TensorFlow', 'SQL']
    }
  ]

  const universities = ['Politecnico di Milano', 'Università di Bologna', 'Sapienza Università di Roma']
  const years = ['2024', '2025', '2026']

  // Comprehensive skills covering technical, soft, and business competencies
  const popularSkills = [
    // Programming Languages
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin',
    'PHP', 'Ruby', 'R', 'MATLAB', 'Scala', 'Dart',

    // Web Development
    'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
    'FastAPI', 'Spring Boot', 'ASP.NET', 'HTML/CSS', 'Tailwind CSS', 'Bootstrap',

    // Mobile Development
    'React Native', 'Flutter', 'iOS Development', 'Android Development', 'SwiftUI',

    // Data Science & AI
    'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision',
    'Data Analysis', 'Statistical Modeling', 'TensorFlow', 'PyTorch', 'Scikit-learn',
    'Pandas', 'NumPy', 'Jupyter', 'Data Visualization', 'AI/ML',

    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins',
    'Terraform', 'DevOps', 'Linux', 'Cloud Architecture',

    // Databases
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Neo4j',
    'Database Design', 'Data Modeling',

    // Other Technical Skills
    'Git', 'APIs', 'REST', 'GraphQL', 'Microservices', 'System Design', 'Algorithms',
    'Data Structures', 'Security', 'Blockchain', 'IoT', 'Embedded Systems',
    'Testing', 'Agile', 'Scrum',

    // Soft Skills
    'Leadership', 'Team Collaboration', 'Communication', 'Problem Solving',
    'Critical Thinking', 'Creativity', 'Adaptability', 'Time Management',
    'Project Management', 'Presentation Skills', 'Conflict Resolution',
    'Emotional Intelligence', 'Mentoring', 'Negotiation',

    // Business & Domain Skills
    'Product Management', 'Business Analysis', 'Strategy', 'Marketing',
    'UX/UI Design', 'User Research', 'Figma', 'Adobe Creative Suite',
    'Financial Analysis', 'Accounting', 'Economics', 'Research',
    'Technical Writing', 'Documentation', 'Teaching', 'Customer Success'
  ]

  useEffect(() => {
    // TODO: Replace with actual API call with filters
    setStudents(mockStudents)
    setLoading(false)
  }, [searchQuery, selectedUniversity, selectedYear, selectedSkill])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedUniversity('')
    setSelectedYear('')
    setSelectedSkill('')
    setSkillSearchQuery('')
  }

  const hasActiveFilters = searchQuery || selectedUniversity || selectedYear || selectedSkill

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">Explore Verified Talent</h1>
              <p className="text-xl text-white/90 mb-6">
                Search through thousands of university-verified student portfolios
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, skill, or university..."
                  className="pl-12 py-6 text-lg bg-white text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="sticky top-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* University Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      University
                    </h3>
                    <div className="space-y-2">
                      {universities.map((uni) => (
                        <Button
                          key={uni}
                          variant={selectedUniversity === uni ? 'default' : 'outline'}
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => setSelectedUniversity(selectedUniversity === uni ? '' : uni)}
                        >
                          {uni}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Graduation Year Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Graduation Year
                    </h3>
                    <div className="space-y-2">
                      {years.map((year) => (
                        <Button
                          key={year}
                          variant={selectedYear === year ? 'default' : 'outline'}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedYear(selectedYear === year ? '' : year)}
                        >
                          Class of {year}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Skills ({popularSkills.length})
                    </h3>

                    {/* Skills Search */}
                    <Input
                      type="text"
                      placeholder="Search skills..."
                      className="mb-3 text-sm"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                    />

                    {/* Skills List */}
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-1">
                      {popularSkills
                        .filter(skill =>
                          skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
                        )
                        .map((skill) => (
                          <Badge
                            key={skill}
                            variant={selectedSkill === skill ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-primary hover:text-white transition-colors mr-2 mb-2 inline-flex"
                            onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      {popularSkills.filter(skill =>
                        skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No skills found matching "{skillSearchQuery}"
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading...' : `${students.length} Students Found`}
                </h2>
                {hasActiveFilters && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing filtered results
                  </p>
                )}
              </div>

              {/* Students Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading portfolios...</p>
                </div>
              ) : students.length === 0 ? (
                <Card className="p-12 text-center">
                  <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {students.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 h-full">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                              <AvatarImage src={student.photo} alt={`${student.firstName} ${student.lastName}`} />
                              <AvatarFallback className="text-lg bg-primary text-white">
                                {student.firstName[0]}{student.lastName[0]}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">
                                {student.firstName} {student.lastName}
                              </CardTitle>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3" />
                                  {student.university}
                                </div>
                                <div>{student.degree}</div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Class of {student.graduationYear}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded-lg">
                            <div>
                              <div className="text-xl font-bold text-primary">{student.projectsCount}</div>
                              <div className="text-xs text-gray-600">Projects</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-green-600">{student.verificationScore}%</div>
                              <div className="text-xs text-gray-600">Verified</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-blue-600">{student.skillsCount}</div>
                              <div className="text-xs text-gray-600">Skills</div>
                            </div>
                          </div>

                          {/* Top Skills */}
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">Top Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {student.topSkills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* View Portfolio Button */}
                          <Button className="w-full" asChild>
                            <Link href={`/students/${student.username}/public`}>
                              View Full Portfolio
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 mt-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Discovered?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of verified students and showcase your work to top companies
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register?role=student">
                Create Your Free Portfolio
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
