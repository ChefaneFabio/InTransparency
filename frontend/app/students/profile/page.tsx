'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { GraduationCap, BookOpen, Code, Award, CheckCircle2, Upload, Link, Plus, X } from 'lucide-react'

interface Course {
  id: string
  name: string
  grade: number
  credits: number
  semester: string
  professor: string
  linkedProjects: string[]
}

interface Project {
  id: string
  title: string
  description: string
  linkedCourses: string[]
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  outcome?: string
}

export default function StudentProfileCreation() {
  const [profileCompletion, setProfileCompletion] = useState(35)
  const [courses, setCourses] = useState<Course[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({})
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({})
  const [selectedTab, setSelectedTab] = useState('academic')

  const addCourse = () => {
    if (currentCourse.name && currentCourse.grade) {
      const newCourse: Course = {
        id: Date.now().toString(),
        name: currentCourse.name || '',
        grade: currentCourse.grade || 0,
        credits: currentCourse.credits || 6,
        semester: currentCourse.semester || '',
        professor: currentCourse.professor || '',
        linkedProjects: []
      }
      setCourses([...courses, newCourse])
      setCurrentCourse({})
      updateProgress()
    }
  }

  const addProject = () => {
    if (currentProject.title && currentProject.description) {
      const newProject: Project = {
        id: Date.now().toString(),
        title: currentProject.title || '',
        description: currentProject.description || '',
        linkedCourses: currentProject.linkedCourses || [],
        technologies: currentProject.technologies || [],
        githubUrl: currentProject.githubUrl,
        demoUrl: currentProject.demoUrl,
        outcome: currentProject.outcome
      }
      setProjects([...projects, newProject])
      setCurrentProject({})
      updateProgress()
    }
  }

  const linkProjectToCourse = (courseId: string, projectId: string) => {
    setCourses(courses.map(c => 
      c.id === courseId 
        ? { ...c, linkedProjects: [...c.linkedProjects, projectId] }
        : c
    ))
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, linkedCourses: [...p.linkedCourses, courseId] }
        : p
    ))
  }

  const updateProgress = () => {
    let progress = 35 // Base for basic info
    if (courses.length >= 3) progress += 20
    if (projects.length >= 2) progress += 20
    if (courses.some(c => c.linkedProjects.length > 0)) progress += 15
    // Add more conditions for other fields
    setProfileCompletion(Math.min(progress, 100))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Academic Profile</h1>
          <p className="text-gray-600">Showcase your academic excellence to top companies</p>
          
          {/* Progress Bar */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <p className="text-xs text-gray-700 mt-2">
                Complete your profile to increase visibility to companies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="connections">Connect</TabsTrigger>
          </TabsList>

          {/* Academic Information Tab */}
          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Your university details and academic achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your university" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="polimi">Politecnico di Milano</SelectItem>
                        <SelectItem value="bocconi">Bocconi University</SelectItem>
                        <SelectItem value="sapienza">Sapienza University</SelectItem>
                        <SelectItem value="bologna">University of Bologna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="degree">Degree Program</Label>
                    <Input placeholder="e.g., Computer Engineering" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gpa">Overall GPA</Label>
                    <Input type="number" placeholder="28.5" max="30" min="18" step="0.1" />
                  </div>
                  <div>
                    <Label htmlFor="graduation">Graduation Date</Label>
                    <Input type="month" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="thesis">Thesis Title</Label>
                  <Input placeholder="e.g., Machine Learning for Healthcare Diagnosis" />
                </div>

                <div>
                  <Label htmlFor="thesis-description">Thesis Description</Label>
                  <Textarea 
                    placeholder="Describe your thesis project, methodology, and outcomes..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="transcript">Upload Transcript</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-700">PDF, JPG or PNG (max 10MB)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Top Courses</CardTitle>
                <CardDescription>
                  Add your best performing courses (minimum 3)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Course List */}
                <div className="space-y-3 mb-6">
                  {courses.map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{course.name}</h4>
                          <p className="text-sm text-gray-600">
                            Grade: {course.grade}/30 • {course.credits} credits • {course.semester}
                          </p>
                          <p className="text-sm text-gray-700">Prof. {course.professor}</p>
                          {course.linkedProjects.length > 0 && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <Link className="h-3 w-3 mr-1" />
                                {course.linkedProjects.length} linked project(s)
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCourses(courses.filter(c => c.id !== course.id))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Course Form */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add New Course</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="course-name">Course Name</Label>
                      <Input
                        id="course-name"
                        placeholder="e.g., Machine Learning"
                        value={currentCourse.name || ''}
                        onChange={(e) => setCurrentCourse({...currentCourse, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-grade">Grade (out of 30)</Label>
                      <Input
                        id="course-grade"
                        type="number"
                        placeholder="28"
                        max="30"
                        min="18"
                        value={currentCourse.grade || ''}
                        onChange={(e) => setCurrentCourse({...currentCourse, grade: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-semester">Semester</Label>
                      <Input
                        id="course-semester"
                        placeholder="Fall 2023"
                        value={currentCourse.semester || ''}
                        onChange={(e) => setCurrentCourse({...currentCourse, semester: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-professor">Professor</Label>
                      <Input
                        id="course-professor"
                        placeholder="Prof. Smith"
                        value={currentCourse.professor || ''}
                        onChange={(e) => setCurrentCourse({...currentCourse, professor: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={addCourse} className="mt-3">
                    <Plus className="h-4 w-4 mr-2" /> Add Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects Portfolio</CardTitle>
                <CardDescription>
                  Showcase projects that demonstrate your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Project List */}
                <div className="space-y-3 mb-6">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{project.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          {project.outcome && (
                            <p className="text-sm text-green-600 mt-2">
                              <CheckCircle2 className="h-3 w-3 inline mr-1" />
                              {project.outcome}
                            </p>
                          )}
                          {project.linkedCourses.length > 0 && (
                            <Badge variant="secondary" className="text-xs mt-2">
                              <BookOpen className="h-3 w-3 mr-1" />
                              Linked to {project.linkedCourses.length} course(s)
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Project Form */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add New Project</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="project-title">Project Title</Label>
                      <Input
                        id="project-title"
                        placeholder="e.g., Fraud Detection System"
                        value={currentProject.title || ''}
                        onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Describe the project, your role, and technologies used..."
                        value={currentProject.description || ''}
                        onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-outcome">Outcome/Impact</Label>
                      <Input
                        id="project-outcome"
                        placeholder="e.g., 94% accuracy, deployed in production"
                        value={currentProject.outcome || ''}
                        onChange={(e) => setCurrentProject({...currentProject, outcome: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="github-url">GitHub URL (optional)</Label>
                        <Input
                          id="github-url"
                          placeholder="https://github.com/..."
                          value={currentProject.githubUrl || ''}
                          onChange={(e) => setCurrentProject({...currentProject, githubUrl: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="demo-url">Demo URL (optional)</Label>
                        <Input
                          id="demo-url"
                          placeholder="https://..."
                          value={currentProject.demoUrl || ''}
                          onChange={(e) => setCurrentProject({...currentProject, demoUrl: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={addProject} className="mt-3">
                    <Plus className="h-4 w-4 mr-2" /> Add Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course-Project Connections Tab */}
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle>Connect Courses to Projects</CardTitle>
                <CardDescription>
                  Show how you applied course knowledge in real projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{course.name}</h4>
                          <p className="text-sm text-gray-600">Grade: {course.grade}/30</p>
                        </div>
                        <BookOpen className="h-5 w-5 text-gray-600" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Link to Projects</Label>
                        <div className="flex flex-wrap gap-2">
                          {projects.map((project) => {
                            const isLinked = course.linkedProjects.includes(project.id)
                            return (
                              <Button
                                key={project.id}
                                variant={isLinked ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  if (!isLinked) {
                                    linkProjectToCourse(course.id, project.id)
                                  }
                                }}
                              >
                                {isLinked && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {project.title}
                              </Button>
                            )
                          })}
                        </div>
                        {course.linkedProjects.length > 0 && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ Course knowledge applied in {course.linkedProjects.length} project(s)
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {courses.length === 0 && (
                    <div className="text-center py-8 text-gray-700">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                      <p>Add courses and projects first to connect them</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline">Save as Draft</Button>
          <div className="space-x-3">
            <Button variant="outline">Preview Profile</Button>
            <Button disabled={profileCompletion < 70}>
              {profileCompletion < 70 ? `Complete Profile (${profileCompletion}%)` : 'Publish Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}