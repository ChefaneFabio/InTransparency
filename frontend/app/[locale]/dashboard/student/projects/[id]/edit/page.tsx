'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { TagSelector } from '@/components/forms/project/TagSelector'
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Plus,
  X
} from 'lucide-react'

const SKILLS_LIST = [
  'Data Analysis', 'Problem Solving', 'Critical Thinking', 'Research', 'Statistical Analysis',
  'Written Communication', 'Presentation', 'Public Speaking', 'Technical Writing',
  'Project Management', 'Team Leadership', 'Time Management', 'Agile/Scrum', 'Strategic Planning',
  'Programming', 'Database Management', 'Data Visualization', 'Machine Learning', 'Web Development',
  'UX Design', 'UI Design', 'Graphic Design', 'Product Design', 'Prototyping',
  'Collaboration', 'Creativity', 'Adaptability', 'Attention to Detail', 'Decision Making',
  'Negotiation', 'Customer Service', 'Marketing', 'Financial Analysis', 'Quality Assurance',
  'Business Development',
]

const TOOLS_LIST = [
  'Microsoft Excel', 'Microsoft Word', 'Microsoft PowerPoint', 'Google Sheets', 'Google Docs',
  'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Adobe Premiere Pro',
  'Canva', 'Sketch', 'AutoCAD', 'SolidWorks', 'MATLAB', 'Revit', 'SketchUp', 'Blender',
  'Tableau', 'Power BI', 'SPSS', 'R Studio', 'Jupyter Notebook', 'Google Analytics',
  'Jira', 'Trello', 'Asana', 'Notion', 'Monday.com', 'Slack', 'Microsoft Teams',
  'VS Code', 'Git', 'GitHub', 'Docker', 'Postman',
  'SAP', 'Salesforce', 'HubSpot', 'Miro', 'Airtable', 'Zoom',
  'WordPress', 'Shopify', 'Final Cut Pro',
]

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [projectType, setProjectType] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [tools, setTools] = useState<string[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [duration, setDuration] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [role, setRole] = useState('')
  const [client, setClient] = useState('')
  const [outcome, setOutcome] = useState('')
  const [courseName, setCourseName] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [semester, setSemester] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [grade, setGrade] = useState('')
  const [professor, setProfessor] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [imageInput, setImageInput] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch project')
        return
      }

      const p = data.project
      setTitle(p.title || '')
      setDescription(p.description || '')
      setDiscipline(p.discipline || '')
      setProjectType(p.projectType || '')
      setTechnologies(p.technologies || [])
      setSkills(p.skills || [])
      setTools(p.tools || [])
      setGithubUrl(p.githubUrl || '')
      setLiveUrl(p.liveUrl || '')
      setDuration(p.duration || '')
      setTeamSize(p.teamSize != null ? String(p.teamSize) : '')
      setRole(p.role || '')
      setClient(p.client || '')
      setOutcome(p.outcome || '')
      setCourseName(p.courseName || '')
      setCourseCode(p.courseCode || '')
      setSemester(p.semester || '')
      setAcademicYear(p.academicYear || '')
      setGrade(p.grade || '')
      setProfessor(p.professor || '')
      setIsPublic(p.isPublic ?? true)
      setImages(p.images || [])
    } catch (err) {
      console.error('Failed to fetch project:', err)
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const markChanged = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSaveStatus('saving')

    try {
      const body: any = {
        title,
        description,
        projectType: projectType || null,
        technologies,
        skills,
        tools,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        duration: duration || null,
        teamSize: teamSize ? parseInt(teamSize, 10) : null,
        role: role || null,
        client: client || null,
        outcome: outcome || null,
        courseName: courseName || null,
        courseCode: courseCode || null,
        semester: semester || null,
        academicYear: academicYear || null,
        grade: grade || null,
        professor: professor || null,
        isPublic,
        images,
      }

      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setSaveStatus('saved')
        setHasUnsavedChanges(false)
        setTimeout(() => {
          router.push(`/dashboard/student/projects/${params.id}`)
        }, 1500)
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update project')
      }
    } catch (err: any) {
      console.error('Project update error:', err)
      setSaveStatus('error')
      setError(err.message || 'Failed to update project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTech = () => {
    const trimmed = techInput.trim()
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed])
      setTechInput('')
      markChanged()
    }
  }

  const removeTech = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech))
    markChanged()
  }

  const addImage = () => {
    const trimmed = imageInput.trim()
    if (trimmed && !images.includes(trimmed)) {
      setImages([...images, trimmed])
      setImageInput('')
      markChanged()
    }
  }

  const removeImage = (url: string) => {
    setImages(images.filter(i => i !== url))
    markChanged()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="space-y-6">
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error && !title) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {error === 'Access denied' ? 'Access Denied' : 'Project Not Found'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {error === 'Access denied'
            ? 'You don\'t have permission to edit this project.'
            : 'The project you\'re trying to edit doesn\'t exist.'}
        </p>
        <Button asChild>
          <Link href="/dashboard/student/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  if (saveStatus === 'saved') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Project Updated Successfully!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your changes have been saved. Redirecting to the project page...
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href={`/dashboard/student/projects/${params.id}`}>
                  View Project
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/student/projects">
                  Back to Projects
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/student/projects/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
            {discipline && (
              <Badge variant="outline" className="mt-1">
                {discipline.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>
        </div>

        {saveStatus === 'error' && (
          <span className="text-sm text-red-600">Save failed. Please try again.</span>
        )}
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Make sure to save before leaving.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); markChanged() }}
                required
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); markChanged() }}
                required
                rows={5}
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Project Type</label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => { setProjectType(e.target.value); markChanged() }}
                placeholder="e.g., Web Application, Case Study, Research Paper"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-foreground/80">Public</label>
              <button
                type="button"
                onClick={() => { setIsPublic(!isPublic); markChanged() }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublic ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-muted-foreground">
                {isPublic ? 'Visible to everyone' : 'Only visible to you'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Technologies (for tech projects) */}
        <Card>
          <CardHeader>
            <CardTitle>Technologies</CardTitle>
            <CardDescription>Add the technology stack used in your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTech()
                  }
                }}
                placeholder="e.g., React, Python, PostgreSQL"
                className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
              <Button type="button" variant="outline" onClick={addTech} disabled={!techInput.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TagSelector
              items={SKILLS_LIST}
              selected={skills}
              onChange={(v) => { setSkills(v); markChanged() }}
              label="Skills"
              placeholder="Search skills..."
              color="green"
            />
            <TagSelector
              items={TOOLS_LIST}
              selected={tools}
              onChange={(v) => { setTools(v); markChanged() }}
              label="Tools"
              placeholder="Search tools..."
              color="purple"
            />
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => { setGithubUrl(e.target.value); markChanged() }}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Live URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => { setLiveUrl(e.target.value); markChanged() }}
                placeholder="https://..."
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Context */}
        <Card>
          <CardHeader>
            <CardTitle>Project Context</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => { setDuration(e.target.value); markChanged() }}
                placeholder="e.g., 3 months"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Team Size</label>
              <input
                type="number"
                value={teamSize}
                onChange={(e) => { setTeamSize(e.target.value); markChanged() }}
                min="1"
                placeholder="e.g., 4"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Your Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => { setRole(e.target.value); markChanged() }}
                placeholder="e.g., Lead Developer"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Client</label>
              <input
                type="text"
                value={client}
                onChange={(e) => { setClient(e.target.value); markChanged() }}
                placeholder="e.g., University, Company X"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground/80 mb-1">Outcome</label>
              <textarea
                value={outcome}
                onChange={(e) => { setOutcome(e.target.value); markChanged() }}
                rows={3}
                placeholder="Describe the results achieved..."
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Context */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Context</CardTitle>
            <CardDescription>Optional - fill in if this is a course-based project</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Course Name</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => { setCourseName(e.target.value); markChanged() }}
                placeholder="e.g., Financial Modeling 401"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Course Code</label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => { setCourseCode(e.target.value); markChanged() }}
                placeholder="e.g., FIN401"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => { setSemester(e.target.value); markChanged() }}
                placeholder="e.g., Fall 2024"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => { setAcademicYear(e.target.value); markChanged() }}
                placeholder="e.g., 2023-2024"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Grade</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => { setGrade(e.target.value); markChanged() }}
                placeholder="e.g., A, 95%"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Professor</label>
              <input
                type="text"
                value={professor}
                onChange={(e) => { setProfessor(e.target.value); markChanged() }}
                placeholder="Professor name"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Add image URLs for project screenshots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative group aspect-video bg-muted rounded-lg overflow-hidden">
                    <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addImage()
                  }
                }}
                placeholder="Paste image URL..."
                className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-card"
              />
              <Button type="button" variant="outline" onClick={addImage} disabled={!imageInput.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/student/projects/${params.id}`}>
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
