'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Code, Users, TrendingUp, Sparkles, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react'

interface CourseRequirement {
  name: string
  minGrade: number
  required: boolean
}

interface ProjectRequirement {
  type: string
  technologies: string[]
  description: string
}

export default function SmartJobPosting() {
  const [jobTitle, setJobTitle] = useState('')
  const [courseRequirements, setCourseRequirements] = useState<CourseRequirement[]>([])
  const [projectRequirements, setProjectRequirements] = useState<ProjectRequirement[]>([])
  const [currentCourse, setCurrentCourse] = useState({ name: '', minGrade: 25, required: true })
  const [currentProject, setCurrentProject] = useState({ type: '', technologies: [], description: '' })
  const [matchPreview, setMatchPreview] = useState<number | null>(null)

  const addCourseRequirement = () => {
    if (currentCourse.name) {
      setCourseRequirements([...courseRequirements, { ...currentCourse }])
      setCurrentCourse({ name: '', minGrade: 25, required: true })
      updateMatchPreview()
    }
  }

  const addProjectRequirement = () => {
    if (currentProject.type) {
      setProjectRequirements([...projectRequirements, { ...currentProject }])
      setCurrentProject({ type: '', technologies: [], description: '' })
      updateMatchPreview()
    }
  }

  const updateMatchPreview = () => {
    // Simulate finding matching candidates
    const baseMatches = 50
    const courseReduction = courseRequirements.length * 10
    const projectReduction = projectRequirements.length * 5
    setMatchPreview(Math.max(5, baseMatches - courseReduction - projectReduction + Math.floor(Math.random() * 10)))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Smart Job Posting</h1>
          <p className="text-gray-600">
            Define academic requirements instead of generic experience - get matched with qualified graduates automatically
          </p>
        </div>

        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basic Info</TabsTrigger>
            <TabsTrigger value="academic">Academic Requirements</TabsTrigger>
            <TabsTrigger value="projects">Project Evidence</TabsTrigger>
            <TabsTrigger value="preview">Preview & Match</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basics">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Basic information about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., ML Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Job Type</Label>
                    <select id="type" className="w-full p-2 border rounded-md">
                      <option>Full-time</option>
                      <option>Internship</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Milan, Italy" />
                  </div>
                  <div>
                    <Label htmlFor="salary">Salary Range (EUR)</Label>
                    <Input id="salary" placeholder="e.g., 35,000 - 45,000" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and your team..."
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Requirements */}
          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Academic Requirements</CardTitle>
                <CardDescription>
                  Specify courses and grades instead of generic "3+ years experience"
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Current Requirements */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Required Courses
                  </h4>
                  {courseRequirements.length > 0 ? (
                    <div className="space-y-2">
                      {courseRequirements.map((course, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant={course.required ? "default" : "secondary"}>
                              {course.required ? "Required" : "Preferred"}
                            </Badge>
                            <span className="font-medium">{course.name}</span>
                            <span className="text-sm text-gray-600">
                              Minimum grade: {course.minGrade}/30
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCourseRequirements(courseRequirements.filter((_, idx) => idx !== i))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">No course requirements added yet</p>
                    </div>
                  )}
                </div>

                {/* Add Course Form */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add Course Requirement</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="course-name">Course Name</Label>
                      <Input
                        id="course-name"
                        placeholder="e.g., Machine Learning"
                        value={currentCourse.name}
                        onChange={(e) => setCurrentCourse({...currentCourse, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="min-grade">Minimum Grade (18-30)</Label>
                      <Input
                        id="min-grade"
                        type="number"
                        min="18"
                        max="30"
                        value={currentCourse.minGrade}
                        onChange={(e) => setCurrentCourse({...currentCourse, minGrade: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Requirement Type</Label>
                      <RadioGroup
                        value={currentCourse.required ? "required" : "preferred"}
                        onValueChange={(value) => setCurrentCourse({...currentCourse, required: value === "required"})}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="required" id="required" />
                          <label htmlFor="required" className="ml-2">Required</label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="preferred" id="preferred" />
                          <label htmlFor="preferred" className="ml-2">Preferred</label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <Button onClick={addCourseRequirement} className="mt-3">
                    <Plus className="h-4 w-4 mr-2" /> Add Course
                  </Button>
                </div>

                {/* Suggested Courses */}
                <Alert className="mt-6">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Suggested courses for {jobTitle || 'this role'}:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering'].map((course) => (
                        <Button
                          key={course}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentCourse({ name: course, minGrade: 25, required: false })}
                        >
                          + {course}
                        </Button>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Requirements */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Project Evidence</CardTitle>
                <CardDescription>
                  Specify what types of projects demonstrate required skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Current Project Requirements */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Required Project Experience
                  </h4>
                  {projectRequirements.length > 0 ? (
                    <div className="space-y-3">
                      {projectRequirements.map((project, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{project.type}</h5>
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.technologies.map((tech, j) => (
                                  <Badge key={j} variant="outline">{tech}</Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setProjectRequirements(projectRequirements.filter((_, idx) => idx !== i))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <Code className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">No project requirements added yet</p>
                    </div>
                  )}
                </div>

                {/* Add Project Form */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add Project Requirement</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="project-type">Project Type</Label>
                      <Input
                        id="project-type"
                        placeholder="e.g., Machine Learning Application"
                        value={currentProject.type}
                        onChange={(e) => setCurrentProject({...currentProject, type: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-desc">Description</Label>
                      <Textarea
                        id="project-desc"
                        placeholder="Describe what the project should demonstrate..."
                        value={currentProject.description}
                        onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Required Technologies</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Python', 'TensorFlow', 'SQL', 'React', 'Node.js', 'Docker'].map((tech) => (
                          <Button
                            key={tech}
                            variant={currentProject.technologies.includes(tech) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (currentProject.technologies.includes(tech)) {
                                setCurrentProject({
                                  ...currentProject,
                                  technologies: currentProject.technologies.filter(t => t !== tech)
                                })
                              } else {
                                setCurrentProject({
                                  ...currentProject,
                                  technologies: [...currentProject.technologies, tech]
                                })
                              }
                            }}
                          >
                            {tech}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button onClick={addProjectRequirement} className="mt-3">
                    <Plus className="h-4 w-4 mr-2" /> Add Project Requirement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview & Match */}
          <TabsContent value="preview">
            <div className="space-y-6">
              {/* Auto-Match Preview */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Auto-Match Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {matchPreview || 23}
                      </div>
                      <p className="text-sm text-gray-600">Matching Candidates</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">85%</div>
                      <p className="text-sm text-gray-600">Average Match Score</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">3</div>
                      <p className="text-sm text-gray-600">Perfect Matches</p>
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Based on your requirements, we'll automatically match and notify you when new qualifying graduates join the platform.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Job Posting Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>How Students Will See This Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{jobTitle || 'Job Title'}</h3>
                        <p className="text-gray-600">Your Company • Milan, Italy</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        95% Match
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Why you're a perfect match:</h4>
                      <div className="space-y-1">
                        {courseRequirements.slice(0, 3).map((course, i) => (
                          <div key={i} className="flex items-center text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Your {course.name} course (28/30) exceeds requirement ({course.minGrade}/30)
                          </div>
                        ))}
                        {projectRequirements.slice(0, 1).map((project, i) => (
                          <div key={i} className="flex items-center text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Your {project.type} project matches requirements
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">
                      Express Interest (Sends Your Academic Profile)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline">Save as Draft</Button>
                <div className="space-x-3">
                  <Button variant="outline">Preview Full Posting</Button>
                  <Button>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Publish & Start Matching
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}