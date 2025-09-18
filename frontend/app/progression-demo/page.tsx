'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Brain, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Calendar, 
  Award,
  Target,
  Zap,
  Star,
  ArrowRight,
  GraduationCap
} from 'lucide-react'

export default function ProgressionDemo() {
  const [selectedStudent, setSelectedStudent] = useState('sofia')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [progressionView, setProgressionView] = useState('timeline')

  // Course Equivalence Data
  const courseEquivalenceDB = {
    "Machine Learning": {
      coreSkills: ["supervised_learning", "unsupervised_learning", "neural_networks", "model_evaluation"],
      equivalentCourses: [
        {
          name: "Artificial Intelligence",
          university: "Various",
          similarity: 95,
          skillOverlap: ["supervised_learning", "neural_networks", "optimization"]
        },
        {
          name: "Statistical Learning",
          university: "Bocconi",
          similarity: 90,
          skillOverlap: ["supervised_learning", "model_evaluation", "statistics"]
        },
        {
          name: "Intelligenza Artificiale",
          university: "Statale Milano",
          similarity: 95,
          skillOverlap: ["supervised_learning", "unsupervised_learning", "neural_networks"]
        },
        {
          name: "Data Mining",
          university: "Various",
          similarity: 80,
          skillOverlap: ["unsupervised_learning", "pattern_recognition", "data_preprocessing"]
        }
      ],
      jobsRequiring: [
        {
          title: "ML Engineer at DeepMind",
          company: "DeepMind",
          location: "London",
          match: 95,
          salary: "€60,000-80,000",
          additionalRequirements: ["Python Programming", "Linear Algebra"]
        },
        {
          title: "Data Scientist at Bending Spoons",
          company: "Bending Spoons",
          location: "Milano",
          match: 88,
          salary: "€45,000-60,000",
          additionalRequirements: ["Statistics", "Database Systems"]
        }
      ]
    },
    "Web Development": {
      coreSkills: ["html_css", "javascript", "responsive_design", "api_integration"],
      equivalentCourses: [
        {
          name: "Client-Side Programming",
          university: "Various",
          similarity: 92,
          skillOverlap: ["javascript", "html_css", "dom_manipulation"]
        },
        {
          name: "Frontend Development",
          university: "Various",
          similarity: 95,
          skillOverlap: ["html_css", "javascript", "responsive_design", "frameworks"]
        },
        {
          name: "Internet Programming",
          university: "Various",
          similarity: 85,
          skillOverlap: ["javascript", "api_integration", "web_protocols"]
        }
      ],
      jobsRequiring: [
        {
          title: "Frontend Developer at Satispay",
          company: "Satispay",
          location: "Milano",
          match: 90,
          salary: "€35,000-50,000",
          additionalRequirements: ["React/Vue", "Version Control"]
        }
      ]
    }
  }

  // Student Progression Data
  const studentProgressions = {
    sofia: {
      name: "Sofia Romano",
      university: "Politecnico Milano",
      degree: "Computer Engineering",
      currentYear: "Y4 (Final)",
      
      yearlyProgression: [
        {
          year: "Y1",
          semester: "2021-2022",
          courses: [
            { name: "Programming Fundamentals", grade: 24, skills: ["basic_programming", "problem_solving"] },
            { name: "Mathematics I", grade: 22, skills: ["calculus", "algebra"], retaken: true },
            { name: "Mathematics I (Retake)", grade: 26, skills: ["calculus", "algebra"] },
            { name: "Physics", grade: 26, skills: ["analytical_thinking"] }
          ],
          gpa: 24.5,
          keyDevelopments: ["Struggled with theoretical subjects", "Improved through retakes", "Found study methods that work"],
          careerReadiness: 20,
          projects: []
        },
        {
          year: "Y2", 
          semester: "2022-2023",
          courses: [
            { name: "Data Structures", grade: 29, skills: ["algorithms", "optimization", "advanced_programming"] },
            { name: "Database Systems", grade: 28, skills: ["sql", "data_modeling", "system_design"] },
            { name: "Object-Oriented Programming", grade: 27, skills: ["oop", "software_design"] },
            { name: "Computer Networks", grade: 25, skills: ["networking", "protocols"] }
          ],
          gpa: 27.25,
          keyDevelopments: ["Found passion for programming", "Started building projects", "Improved significantly in technical subjects"],
          careerReadiness: 60,
          projects: [
            { title: "Library Management System", description: "Built with Java and MySQL", technologies: ["Java", "MySQL"] }
          ]
        },
        {
          year: "Y3",
          semester: "2023-2024",
          courses: [
            { name: "Machine Learning", grade: 30, skills: ["ml_algorithms", "python", "data_analysis", "research"] },
            { name: "Software Engineering", grade: 25, skills: ["team_collaboration", "version_control", "testing"] },
            { name: "Human-Computer Interaction", grade: 28, skills: ["ui_design", "user_research"] },
            { name: "Advanced Algorithms", grade: 29, skills: ["algorithm_design", "complexity_analysis"] }
          ],
          gpa: 28.0,
          keyDevelopments: ["Specialized in ML", "Built thesis-quality project", "Industry recognition", "Professor endorsements"],
          careerReadiness: 85,
          projects: [
            { title: "Fraud Detection System", description: "ML-based fraud detection for banks", technologies: ["Python", "TensorFlow", "SQL"], outcome: "94% accuracy, implemented by local bank" },
            { title: "Healthcare Dashboard", description: "Patient data visualization", technologies: ["React", "D3.js", "Node.js"] }
          ]
        },
        {
          year: "Y4",
          semester: "2024-2025",
          courses: [
            { name: "Thesis Project", grade: "In Progress", skills: ["research", "independent_work", "stakeholder_management"] }
          ],
          gpa: 27.8,
          keyDevelopments: ["Thesis deployed in production", "Professor recommendations", "Conference presentation"],
          careerReadiness: 95,
          projects: [
            { title: "AI-Powered Medical Diagnosis", description: "Final thesis project", technologies: ["Python", "PyTorch", "FastAPI"], outcome: "Deployed at local hospital, 15% diagnostic improvement" }
          ]
        }
      ],

      skillEvolution: {
        programming: [
          { year: "Y1", level: "Beginner", evidence: ["Basic syntax", "Simple programs"] },
          { year: "Y2", level: "Intermediate", evidence: ["Data structures", "OOP concepts", "Database integration"] },
          { year: "Y3", level: "Advanced", evidence: ["Complex ML projects", "Full-stack applications", "Production code"] },
          { year: "Y4", level: "Expert", evidence: ["Hospital deployment", "Performance optimization", "Code architecture"] }
        ],
        problemSolving: [
          { year: "Y1", level: "Basic", evidence: ["Simple algorithms"] },
          { year: "Y2", level: "Intermediate", evidence: ["Algorithm optimization", "System design basics"] },
          { year: "Y3", level: "Advanced", evidence: ["Novel ML approaches", "Complex system integration"] },
          { year: "Y4", level: "Expert", evidence: ["Real-world problem solving", "Stakeholder requirement analysis"] }
        ],
        communication: [
          { year: "Y1", level: "Basic", evidence: ["Class presentations"] },
          { year: "Y2", level: "Intermediate", evidence: ["Team projects", "Peer collaboration"] },
          { year: "Y3", level: "Advanced", evidence: ["Stakeholder meetings", "Technical documentation"] },
          { year: "Y4", level: "Expert", evidence: ["Conference presentation", "Medical staff training"] }
        ]
      },

      jobReadiness: {
        "ML Engineer": {
          currentMatch: 95,
          presentSkills: [
            { skill: "Machine Learning", level: "Expert", evidence: ["ML course: 30/30", "Fraud detection project", "Medical AI system"] },
            { skill: "Python Programming", level: "Expert", evidence: ["Multiple projects", "Production code", "Performance optimization"] },
            { skill: "Data Analysis", level: "Advanced", evidence: ["Statistical analysis", "Model evaluation", "A/B testing"] }
          ],
          missingSkills: [
            { skill: "MLOps", current: "basic", required: "intermediate", type: "preferred" },
            { skill: "Cloud Platforms", current: "none", required: "basic", type: "preferred" }
          ],
          readyForLevel: "Junior to Mid-level",
          timeline: "Ready now",
          projectEvidence: [
            { title: "Fraud Detection System", relevance: "Direct ML application" },
            { title: "Medical AI Diagnosis", relevance: "Advanced ML + real deployment" }
          ]
        },
        "Full-Stack Developer": {
          currentMatch: 75,
          presentSkills: [
            { skill: "Programming", level: "Expert", evidence: ["Multiple languages", "Complex projects"] },
            { skill: "Database Systems", level: "Advanced", evidence: ["DB course: 28/30", "Multiple DB projects"] },
            { skill: "Frontend Development", level: "Intermediate", evidence: ["React projects", "UI/UX understanding"] }
          ],
          missingSkills: [
            { skill: "Backend Frameworks", current: "basic", required: "intermediate", type: "required" },
            { skill: "DevOps", current: "none", required: "basic", type: "preferred" },
            { skill: "API Design", current: "basic", required: "intermediate", type: "required" }
          ],
          readyForLevel: "Junior",
          timeline: "Ready in 3-6 months with focused backend learning",
          projectEvidence: [
            { title: "Healthcare Dashboard", relevance: "Full-stack application" },
            { title: "Library Management System", relevance: "Backend + database" }
          ]
        },
        "Data Scientist": {
          currentMatch: 88,
          presentSkills: [
            { skill: "Statistics", level: "Advanced", evidence: ["Statistical analysis", "Model validation"] },
            { skill: "Python", level: "Expert", evidence: ["Data analysis projects", "ML implementations"] },
            { skill: "Machine Learning", level: "Expert", evidence: ["Advanced ML projects", "Production deployment"] }
          ],
          missingSkills: [
            { skill: "Business Analytics", current: "basic", required: "intermediate", type: "preferred" },
            { skill: "Data Visualization", current: "intermediate", required: "advanced", type: "preferred" }
          ],
          readyForLevel: "Junior to Mid-level",
          timeline: "Ready now",
          projectEvidence: [
            { title: "Fraud Detection System", relevance: "Data analysis + ML" },
            { title: "Medical AI Diagnosis", relevance: "Statistical modeling + validation" }
          ]
        }
      }
    }
  }

  const currentStudent = studentProgressions[selectedStudent as keyof typeof studentProgressions]

  // Course Equivalence Component
  const CourseEquivalenceDemo = () => {
    const [equivalences, setEquivalences] = useState<any[]>([])
    const [matchingJobs, setMatchingJobs] = useState<any[]>([])

    const handleCourseSelect = (courseName: string) => {
      setSelectedCourse(courseName)
      const courseData = courseEquivalenceDB[courseName as keyof typeof courseEquivalenceDB]
      if (courseData) {
        setEquivalences(courseData.equivalentCourses)
        setMatchingJobs(courseData.jobsRequiring)
      }
    }

    return (
      <div className="space-y-6">
        {/* Course Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Course Equivalence Algorithm
            </CardTitle>
            <CardDescription>
              See how courses from different universities are matched based on skills and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select a course to see equivalences:</label>
              <select 
                className="w-full border rounded-lg p-3"
                value={selectedCourse}
                onChange={(e) => handleCourseSelect(e.target.value)}
              >
                <option value="">Choose a course...</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Web Development">Web Development</option>
              </select>
            </div>

            {selectedCourse && (
              <div className="space-y-6">
                {/* Equivalent Courses */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Equivalent Courses Across Universities
                  </h3>
                  <div className="grid gap-3">
                    {equivalences.map((equiv, idx) => (
                      <div key={idx} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-medium">{equiv.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{equiv.university}</p>
                          <div className="flex flex-wrap gap-1">
                            {equiv.skillOverlap.map((skill: string, skillIdx: number) => (
                              <Badge key={skillIdx} variant="secondary" className="text-xs">
                                {skill.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-2xl font-bold ${
                            equiv.similarity >= 90 ? 'text-green-600' : 
                            equiv.similarity >= 80 ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            {equiv.similarity}%
                          </div>
                          <div className="text-sm text-gray-500">similarity</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matching Jobs */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Jobs Requiring This Course
                  </h3>
                  <div className="grid gap-3">
                    {matchingJobs.map((job, idx) => (
                      <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-gray-600">{job.company} • {job.location}</p>
                            <p className="text-sm text-green-600 font-medium">{job.salary}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {job.match}% match
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Additional requirements:</strong> {job.additionalRequirements.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Academic Progression Component
  const AcademicProgressionDemo = () => {
    return (
      <div className="space-y-6">
        {/* Student Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{currentStudent.name}</h3>
                <p className="text-gray-600">{currentStudent.degree} • {currentStudent.university}</p>
                <p className="text-sm text-gray-500">{currentStudent.currentYear} • Overall GPA: {currentStudent.yearlyProgression[currentStudent.yearlyProgression.length - 1].gpa}/30</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {currentStudent.yearlyProgression[currentStudent.yearlyProgression.length - 1].careerReadiness}%
                </div>
                <div className="text-sm text-gray-600">Career Ready</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              progressionView === 'timeline' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setProgressionView('timeline')}
          >
            Academic Timeline
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              progressionView === 'skills' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setProgressionView('skills')}
          >
            Skill Evolution
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              progressionView === 'readiness' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setProgressionView('readiness')}
          >
            Job Readiness
          </button>
        </div>

        {/* Timeline View */}
        {progressionView === 'timeline' && (
          <div className="space-y-6">
            {currentStudent.yearlyProgression.map((year: any, idx: number) => (
              <Card key={idx} className="relative">
                <div className="absolute -left-4 top-6 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
                  <span className="text-white text-sm font-bold">{idx + 1}</span>
                </div>
                {idx < currentStudent.yearlyProgression.length - 1 && (
                  <div className="absolute -left-4 top-14 w-0.5 h-full bg-blue-200 z-0"></div>
                )}
                
                <CardContent className="pt-6 ml-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{year.year} - {year.semester}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">GPA: {year.gpa}/30</span>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{year.careerReadiness}% Career Ready</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Courses Completed</h4>
                      <div className="space-y-2">
                        {year.courses.map((course: any, courseIdx: number) => (
                          <div key={courseIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <div>
                              <span className="font-medium">{course.name}</span>
                              {course.retaken && <span className="text-red-500 text-xs ml-2">(Retaken)</span>}
                            </div>
                            <Badge variant={course.grade >= 28 ? 'default' : course.grade >= 24 ? 'secondary' : 'outline'}>
                              {course.grade}/30
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Projects & Developments</h4>
                      {year.projects.length > 0 && (
                        <div className="mb-3">
                          {year.projects.map((project: any, projIdx: number) => (
                            <div key={projIdx} className="p-2 bg-green-50 rounded text-sm mb-2">
                              <div className="font-medium">{project.title}</div>
                              <div className="text-gray-600">{project.description}</div>
                              {project.outcome && (
                                <div className="text-green-700 text-xs mt-1">
                                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                                  {project.outcome}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-1">
                        {year.keyDevelopments.map((dev: string, devIdx: number) => (
                          <div key={devIdx} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{dev}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Skills Evolution View */}
        {progressionView === 'skills' && (
          <div className="space-y-6">
            {Object.entries(currentStudent.skillEvolution).map(([skillName, evolution]) => (
              <Card key={skillName}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {skillName.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(evolution as any[]).map((stage: any, idx: number) => {
                      const isActive = idx === (evolution as any[]).length - 1
                      const levelColors = {
                        'Beginner': 'bg-red-100 text-red-800 border-red-200',
                        'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        'Advanced': 'bg-blue-100 text-blue-800 border-blue-200',
                        'Expert': 'bg-green-100 text-green-800 border-green-200'
                      }
                      
                      return (
                        <div key={idx} className={`text-center p-4 rounded-lg border-2 ${
                          isActive ? 'ring-2 ring-blue-500' : ''
                        } ${levelColors[stage.level as keyof typeof levelColors] || 'bg-gray-100'}`}>
                          <div className="mb-2">
                            <div className="text-sm font-medium text-gray-600 mb-1">{stage.year}</div>
                            <div className="text-lg font-bold">{stage.level}</div>
                          </div>
                          <div className="text-xs space-y-1">
                            {stage.evidence.map((ev: string, evIdx: number) => (
                              <div key={evIdx} className="truncate">{ev}</div>
                            ))}
                          </div>
                          {isActive && (
                            <div className="mt-2">
                              <Badge className="bg-blue-600">Current Level</Badge>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Job Readiness View */}
        {progressionView === 'readiness' && (
          <div className="space-y-4">
            {Object.entries(currentStudent.jobReadiness).map(([jobTitle, readiness]) => (
              <Card key={jobTitle} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      {jobTitle}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`text-3xl font-bold ${
                        (readiness as any).currentMatch >= 85 ? 'text-green-600' :
                        (readiness as any).currentMatch >= 70 ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {(readiness as any).currentMatch}%
                      </div>
                      <div className="text-sm text-gray-500">Ready</div>
                    </div>
                  </div>
                  <CardDescription>{(readiness as any).timeline}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Present Skills */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Skills You Have
                      </h4>
                      <div className="space-y-2">
                        {(readiness as any).presentSkills.map((skill: any, idx: number) => (
                          <div key={idx} className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{skill.skill}</span>
                              <Badge className="bg-green-100 text-green-800">{skill.level}</Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              Evidence: {skill.evidence.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        Areas for Development
                      </h4>
                      <div className="space-y-2">
                        {(readiness as any).missingSkills.map((skill: any, idx: number) => (
                          <div key={idx} className="p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{skill.skill}</span>
                              <Badge variant="outline" className="text-orange-800">
                                {skill.type}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              Need: {skill.required} level (currently {skill.current})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project Evidence */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      Relevant Project Experience
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {(readiness as any).projectEvidence.map((project: any, idx: number) => (
                        <div key={idx} className="p-3 bg-purple-50 rounded-lg">
                          <div className="font-medium text-sm">{project.title}</div>
                          <div className="text-xs text-purple-700 mt-1">{project.relevance}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t">
                    {(readiness as any).currentMatch >= 85 ? (
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Start Applying for {jobTitle} Roles
                      </Button>
                    ) : (readiness as any).currentMatch >= 70 ? (
                      <Button variant="outline" className="w-full">
                        <Target className="w-4 h-4 mr-2" />
                        Focus on Missing Skills
                      </Button>
                    ) : (
                      <Button variant="secondary" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Plan Development Path
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            InTransparency: Course Equivalence & Academic Progression
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Smart algorithms for matching courses across universities and tracking student development over time
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="equivalence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="equivalence" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Course Equivalence
            </TabsTrigger>
            <TabsTrigger value="progression" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Academic Progression
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equivalence">
            <CourseEquivalenceDemo />
          </TabsContent>

          <TabsContent value="progression">
            <AcademicProgressionDemo />
          </TabsContent>
        </Tabs>

        {/* Key Features Summary */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">How the Algorithms Work</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                InTransparency uses advanced algorithms to create the most intelligent academic-career matching platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Course Equivalence Algorithm
                </h3>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>• <strong>Semantic Analysis:</strong> AI understands course content regardless of naming</li>
                  <li>• <strong>Skill Mapping:</strong> Maps courses to specific technical skills</li>
                  <li>• <strong>University Calibration:</strong> Accounts for different university standards</li>
                  <li>• <strong>Project Evidence:</strong> Considers how students applied course knowledge</li>
                  <li>• <strong>Continuous Learning:</strong> Improves accuracy based on hiring outcomes</li>
                </ul>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Academic Progression System
                </h3>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>• <strong>Trajectory Analysis:</strong> Tracks academic improvement over time</li>
                  <li>• <strong>Skill Evolution:</strong> Maps how abilities develop through coursework</li>
                  <li>• <strong>Context Awareness:</strong> Considers personal circumstances affecting performance</li>
                  <li>• <strong>Readiness Prediction:</strong> Forecasts job readiness for different roles</li>
                  <li>• <strong>Gap Analysis:</strong> Identifies specific skills needed for career goals</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}