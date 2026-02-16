'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Code2, Briefcase, Palette, Heart, Cog, Wrench,
  Building2, Video, FileText, Users, Sparkles,
  Scale, GraduationCap, Microscope, ArrowLeft, Plus, X, Upload, Link as LinkIcon
} from 'lucide-react'
import { TagSelector } from '@/components/forms/project/TagSelector'

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

// Discipline options with icons and descriptions
const DISCIPLINES = [
  {
    value: 'TECHNOLOGY',
    label: 'Technology',
    icon: Code2,
    description: 'Software, web apps, data science, AI/ML',
    types: ['Web Application', 'Mobile App', 'Data Analysis', 'AI/ML Project', 'API/Backend', 'DevOps', 'Open Source Contribution']
  },
  {
    value: 'BUSINESS',
    label: 'Business',
    icon: Briefcase,
    description: 'Case studies, business plans, market analysis',
    types: ['Business Plan', 'Case Study', 'Market Analysis', 'Financial Model', 'Strategy Presentation', 'Consulting Project']
  },
  {
    value: 'DESIGN',
    label: 'Design',
    icon: Palette,
    description: 'UX/UI, graphic design, product design',
    types: ['UX/UI Design', 'Graphic Design', 'Product Design', 'Brand Identity', 'Design System', 'Prototype']
  },
  {
    value: 'HEALTHCARE',
    label: 'Healthcare',
    icon: Heart,
    description: 'Clinical cases, research, patient care',
    types: ['Clinical Case Study', 'Research Project', 'Patient Care Plan', 'Health Education', 'Medical Device', 'Public Health Initiative']
  },
  {
    value: 'ENGINEERING',
    label: 'Engineering',
    icon: Cog,
    description: 'Mechanical, civil, electrical projects',
    types: ['CAD Design', 'Prototype', 'System Design', 'Circuit Design', 'Structural Analysis', 'Manufacturing Process']
  },
  {
    value: 'TRADES',
    label: 'Skilled Trades',
    icon: Wrench,
    description: 'Construction, plumbing, electrical work',
    types: ['Construction Project', 'Electrical Installation', 'Plumbing System', 'HVAC Installation', 'Renovation', 'Safety Implementation']
  },
  {
    value: 'ARCHITECTURE',
    label: 'Architecture',
    icon: Building2,
    description: 'Building design, urban planning',
    types: ['Building Design', 'Urban Planning', 'Interior Design', 'Landscape Design', '3D Rendering', 'Sustainable Design']
  },
  {
    value: 'MEDIA',
    label: 'Film & Media',
    icon: Video,
    description: 'Film, video, photography, audio',
    types: ['Short Film', 'Documentary', 'Photography Series', 'Audio Production', 'Animation', 'Video Editing']
  },
  {
    value: 'WRITING',
    label: 'Writing',
    icon: FileText,
    description: 'Articles, research, creative writing',
    types: ['Research Paper', 'Article Series', 'Creative Writing', 'Technical Writing', 'Journalism', 'Content Strategy']
  },
  {
    value: 'SOCIAL_SCIENCES',
    label: 'Social Sciences',
    icon: Users,
    description: 'Research, case studies, field work',
    types: ['Field Research', 'Case Study', 'Survey Analysis', 'Policy Analysis', 'Community Project', 'Ethnographic Study']
  },
  {
    value: 'ARTS',
    label: 'Arts',
    icon: Sparkles,
    description: 'Fine arts, performance, music',
    types: ['Art Portfolio', 'Performance', 'Musical Composition', 'Sculpture', 'Installation', 'Digital Art']
  },
  {
    value: 'LAW',
    label: 'Law',
    icon: Scale,
    description: 'Legal research, case analysis, moot court',
    types: ['Legal Research', 'Case Analysis', 'Moot Court', 'Legal Memo', 'Contract Analysis', 'Policy Brief']
  },
  {
    value: 'EDUCATION',
    label: 'Education',
    icon: GraduationCap,
    description: 'Lesson plans, teaching portfolios',
    types: ['Lesson Plan', 'Curriculum Design', 'Teaching Portfolio', 'Educational Technology', 'Assessment Design', 'Student Project']
  },
  {
    value: 'SCIENCE',
    label: 'Science',
    icon: Microscope,
    description: 'Lab work, research, experiments',
    types: ['Lab Research', 'Experiment', 'Data Analysis', 'Scientific Paper', 'Field Study', 'Literature Review']
  },
  {
    value: 'OTHER',
    label: 'Other',
    icon: FileText,
    description: 'Other academic or professional work',
    types: ['Project', 'Portfolio', 'Case Study', 'Research', 'Analysis', 'Creative Work']
  }
]

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState<'discipline' | 'details'>('discipline')
  const [loading, setLoading] = useState(false)

  // Form state
  const [discipline, setDiscipline] = useState<string>('')
  const [projectType, setProjectType] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Tech-specific
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')

  // Universal fields
  const [skills, setSkills] = useState<string[]>([])
  const [tools, setTools] = useState<string[]>([])

  // Files & Media
  const [imageUrl, setImageUrl] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [videoInput, setVideoInput] = useState('')

  // Project Context
  const [duration, setDuration] = useState('')
  const [teamSize, setTeamSize] = useState<number | ''>('')
  const [role, setRole] = useState('')
  const [client, setClient] = useState('')
  const [outcome, setOutcome] = useState('')

  // Academic Context
  const [courseName, setCourseName] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [semester, setSemester] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [grade, setGrade] = useState('')
  const [professor, setProfessor] = useState('')

  // Competencies
  const [competencies, setCompetencies] = useState<string[]>([])
  const [competencyInput, setCompetencyInput] = useState('')

  // Certifications
  const [certifications, setCertifications] = useState<string[]>([])
  const [certInput, setCertInput] = useState('')

  const handleDisciplineSelect = (disciplineValue: string) => {
    setDiscipline(disciplineValue)
    setStep('details')
  }

  const handleAddItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    inputSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      setter(prev => [...prev, value.trim()])
      inputSetter('')
    }
  }

  const handleRemoveItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement file upload to S3/Cloudflare
      // For now, we'll just save URLs and basic data

      const projectData = {
        discipline,
        projectType: projectType || undefined,
        title,
        description,
        technologies: discipline === 'TECHNOLOGY' ? technologies : [],
        githubUrl: githubUrl || undefined,
        liveUrl: liveUrl || undefined,
        skills,
        tools,
        imageUrl: imageUrl || undefined,
        images,
        videos,
        duration: duration || undefined,
        teamSize: teamSize || undefined,
        role: role || undefined,
        client: client || undefined,
        outcome: outcome || undefined,
        courseName: courseName || undefined,
        courseCode: courseCode || undefined,
        semester: semester || undefined,
        academicYear: academicYear || undefined,
        grade: grade || undefined,
        professor: professor || undefined,
        competencies,
        certifications,
        isPublic: true,
        featured: false
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      if (!response.ok) throw new Error('Failed to create project')

      router.push('/dashboard/student')
      router.refresh()
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Get selected discipline config
  const selectedDiscipline = DISCIPLINES.find(d => d.value === discipline)

  if (step === 'discipline') {
    return (
      <div className="min-h-screen bg-card p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/80 hover:text-foreground mb-6"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              New Project
            </h1>
            <p className="text-muted-foreground">
              Select your project category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISCIPLINES.map((disc) => {
              const Icon = disc.icon
              return (
                <button
                  key={disc.value}
                  onClick={() => handleDisciplineSelect(disc.value)}
                  className="border-2 border-border rounded-lg p-4 hover:border-primary hover:bg-primary/10 transition-all text-left group shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                      <Icon className="text-foreground/80 group-hover:text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {disc.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {disc.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-card py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setStep('discipline')}
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground mb-6"
        >
          <ArrowLeft size={20} />
          Change Category
        </button>

        <div className="border-2 border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            {selectedDiscipline && (
              <>
                <div className="p-2 bg-muted rounded-lg">
                  {<selectedDiscipline.icon className="text-foreground/80" size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {selectedDiscipline.label} Project
                  </h2>
                  <p className="text-sm text-muted-foreground">{selectedDiscipline.description}</p>
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Project Type *
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
              >
                <option value="">Select a project type</option>
                {selectedDiscipline?.types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Give your project a clear, descriptive title"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  placeholder="Describe what you built, the problem you solved, your approach, and the results"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                />
              </div>
            </div>

            {/* Technology-specific fields */}
            {discipline === 'TECHNOLOGY' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                  Code & Demo
                </h3>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://your-project.com"
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Technologies Used
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddItem(techInput, setTechnologies, setTechInput)
                        }
                      }}
                      placeholder="React, Python, PostgreSQL..."
                      className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(techInput, setTechnologies, setTechInput)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index, setTechnologies)}
                          className="hover:text-primary/90"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Universal Skills & Tools */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Skills & Tools
              </h3>

              <TagSelector
                items={SKILLS_LIST}
                selected={skills}
                onChange={setSkills}
                label="Skills Demonstrated"
                placeholder="Search skills..."
                color="green"
              />

              <TagSelector
                items={TOOLS_LIST}
                selected={tools}
                onChange={setTools}
                label="Tools Used"
                placeholder="Search tools..."
                color="purple"
              />
            </div>

            {/* Media & Files */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                <Upload size={20} />
                Media & Files
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Main Project Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  File upload coming soon - for now, paste an image URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Video URL (YouTube, Vimeo, etc.)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={videoInput}
                    onChange={(e) => setVideoInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddItem(videoInput, setVideos, setVideoInput)
                      }
                    }}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem(videoInput, setVideos, setVideoInput)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <span className="text-sm text-foreground/80 truncate flex-1">{video}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index, setVideos)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Context */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Project Context
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3 months, 1 semester..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Team Size
                  </label>
                  <input
                    type="number"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="1 (solo), 2, 3..."
                    min="1"
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Lead Developer, Analyst, Designer..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Client/Context
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Company X, University, Personal..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Outcome & Results
                </label>
                <textarea
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  rows={3}
                  placeholder="What was the impact? What did you achieve?"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                />
              </div>
            </div>

            {/* Academic Context */}
            <div className="space-y-4 bg-primary/10 p-5 rounded-lg border border-primary/20">
              <h3 className="text-base font-semibold text-foreground pb-2 flex items-center gap-2">
                <GraduationCap size={18} />
                Academic Context
              </h3>
              <p className="text-sm text-muted-foreground">
                Optional: Link to a course for university verification
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Financial Modeling, Machine Learning..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="FIN401, CS229..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="Fall 2024, Spring 2025..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2023-2024, 2024-2025..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Grade Received
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="A, A-, 95%, First Class..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Professor Name
                  </label>
                  <input
                    type="text"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    placeholder="Dr. Smith, Prof. Johnson..."
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Competencies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Competencies Demonstrated
              </h3>
              <p className="text-sm text-muted-foreground">
                What specific competencies did you demonstrate in this project?
              </p>

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={competencyInput}
                  onChange={(e) => setCompetencyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddItem(competencyInput, setCompetencies, setCompetencyInput)
                    }
                  }}
                  placeholder="Data Analysis, Project Management, Critical Thinking..."
                  className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                />
                <button
                  type="button"
                  onClick={() => handleAddItem(competencyInput, setCompetencies, setCompetencyInput)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {competencies.map((comp, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {comp}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index, setCompetencies)}
                      className="hover:text-indigo-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications (for healthcare, trades, technical) */}
            {['HEALTHCARE', 'TRADES', 'ENGINEERING', 'TECHNOLOGY'].includes(discipline) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                  Certifications & Credentials
                </h3>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddItem(certInput, setCertifications, setCertInput)
                      }
                    }}
                    placeholder="AWS Certified, OSHA 30, CPR Certified..."
                    className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground/60 bg-card"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem(certInput, setCertifications, setCertInput)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index, setCertifications)}
                        className="hover:text-yellow-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border-2 border-border text-foreground/80 rounded-lg hover:bg-muted font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Project...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
