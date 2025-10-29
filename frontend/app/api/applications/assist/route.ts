import { NextResponse } from 'next/server'

// Types for AI assistance
interface AssistanceRequest {
  studentId: string
  jobId: string
  jobRequirements: string[]
  studentProfile: {
    projects: Array<{ id: string; title: string; skills: string[]; description: string }>
    skills: string[]
    courses: Array<{ name: string; grade: number }>
  }
  currentFormData?: any
  assistanceType: 'project-suggestions' | 'skill-matching' | 'cover-letter-help' | 'form-validation'
}

interface AssistanceResponse {
  suggestions: {
    type: string
    title: string
    description: string
    action?: string
    data?: any
  }[]
  autoFillRecommendations?: any
  completionTips?: string[]
}

export async function POST(request: Request) {
  try {
    const body: AssistanceRequest = await request.json()

    // Validate required fields
    if (!body.studentId || !body.jobId || !body.assistanceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let response: AssistanceResponse = { suggestions: [] }

    switch (body.assistanceType) {
      case 'project-suggestions':
        response = generateProjectSuggestions(body)
        break

      case 'skill-matching':
        response = generateSkillMatching(body)
        break

      case 'cover-letter-help':
        response = generateCoverLetterHelp(body)
        break

      case 'form-validation':
        response = generateFormValidation(body)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid assistance type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      assistance: response
    })

  } catch (error) {
    console.error('Error providing assistance:', error)
    return NextResponse.json(
      { error: 'Failed to provide assistance' },
      { status: 500 }
    )
  }
}

// Generate project suggestions based on job requirements
function generateProjectSuggestions(request: AssistanceRequest): AssistanceResponse {
  const { jobRequirements, studentProfile } = request
  const suggestions = []

  // Match projects to job requirements
  for (const project of studentProfile.projects) {
    const matchingSkills = project.skills.filter(skill =>
      jobRequirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
    )

    if (matchingSkills.length > 0) {
      suggestions.push({
        type: 'project-match',
        title: `Include "${project.title}"`,
        description: `This project demonstrates ${matchingSkills.length} required skill${matchingSkills.length > 1 ? 's' : ''}: ${matchingSkills.slice(0, 3).join(', ')}`,
        action: 'add-project',
        data: { projectId: project.id, matchingSkills }
      })
    }
  }

  // If no strong matches, suggest most relevant
  if (suggestions.length === 0 && studentProfile.projects.length > 0) {
    suggestions.push({
      type: 'general-suggestion',
      title: 'Consider your strongest projects',
      description: `While none perfectly match all requirements, "${studentProfile.projects[0].title}" showcases your capabilities.`,
      action: 'review-projects'
    })
  }

  return {
    suggestions,
    completionTips: suggestions.length > 0
      ? [`Add ${Math.min(3, suggestions.length)} relevant projects to strengthen your application`]
      : ['Upload more projects to better match job requirements']
  }
}

// Generate skill matching analysis
function generateSkillMatching(request: AssistanceRequest): AssistanceResponse {
  const { jobRequirements, studentProfile } = request
  const suggestions = []

  // Identify matching skills
  const matchingSkills = studentProfile.skills.filter(skill =>
    jobRequirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  )

  // Identify missing skills
  const missingSkills = jobRequirements.filter(req =>
    !studentProfile.skills.some(skill => req.toLowerCase().includes(skill.toLowerCase()))
  )

  if (matchingSkills.length > 0) {
    suggestions.push({
      type: 'skill-match',
      title: `You have ${matchingSkills.length} matching skills`,
      description: `Highlight these in your application: ${matchingSkills.slice(0, 5).join(', ')}`,
      action: 'auto-add-skills',
      data: { skills: matchingSkills }
    })
  }

  if (missingSkills.length > 0 && missingSkills.length <= 3) {
    suggestions.push({
      type: 'skill-gap',
      title: `${missingSkills.length} skill${missingSkills.length > 1 ? 's' : ''} not in your profile`,
      description: `Consider adding projects that demonstrate: ${missingSkills.slice(0, 3).join(', ')}`,
      action: 'view-missing-skills',
      data: { missingSkills }
    })
  }

  const matchPercentage = Math.round((matchingSkills.length / jobRequirements.length) * 100)

  return {
    suggestions,
    autoFillRecommendations: {
      recommendedSkills: matchingSkills,
      matchPercentage
    },
    completionTips: [
      `You match ${matchPercentage}% of the required skills`,
      matchPercentage >= 70
        ? 'Strong match! Highlight your experience with these skills'
        : 'Consider emphasizing transferable skills and willingness to learn'
    ]
  }
}

// Generate cover letter assistance
function generateCoverLetterHelp(request: AssistanceRequest): AssistanceResponse {
  const { studentProfile, jobRequirements } = request
  const suggestions = []

  // Suggest structure
  suggestions.push({
    type: 'structure-tip',
    title: 'Effective Cover Letter Structure',
    description: '1) Opening: Why this role excites you  2) Body: 2-3 relevant projects/experiences  3) Closing: Your value proposition',
    action: 'use-template'
  })

  // Suggest content based on profile
  if (studentProfile.projects.length > 0) {
    const topProject = studentProfile.projects[0]
    suggestions.push({
      type: 'content-suggestion',
      title: 'Highlight Your Best Work',
      description: `Mention "${topProject.title}" to demonstrate ${topProject.skills.slice(0, 2).join(' and ')}`,
      data: { project: topProject }
    })
  }

  // Suggest addressing skill gaps
  const matchingSkills = studentProfile.skills.filter(skill =>
    jobRequirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  )

  if (matchingSkills.length > 0) {
    suggestions.push({
      type: 'skill-emphasis',
      title: 'Emphasize Matching Skills',
      description: `Connect your ${matchingSkills.slice(0, 3).join(', ')} experience to the role's requirements`,
      data: { skills: matchingSkills }
    })
  }

  return {
    suggestions,
    completionTips: [
      'Keep it concise (250-400 words)',
      'Show genuine interest in the company',
      'Use specific examples from your projects'
    ]
  }
}

// Validate form completeness
function generateFormValidation(request: AssistanceRequest): AssistanceResponse {
  const { currentFormData } = request
  const suggestions = []

  const requiredFields = [
    { field: 'selectedProjects', label: 'Projects', min: 1 },
    { field: 'selectedSkills', label: 'Skills', min: 3 },
    { field: 'whyThisRole', label: 'Why this role', minLength: 100 },
    { field: 'availability', label: 'Availability', minLength: 1 }
  ]

  for (const field of requiredFields) {
    const value = currentFormData?.[field.field]

    if (!value) {
      suggestions.push({
        type: 'missing-field',
        title: `${field.label} required`,
        description: `Add ${field.label.toLowerCase()} to complete your application`,
        action: `focus-${field.field}`
      })
    } else if (Array.isArray(value) && value.length < (field.min || 1)) {
      suggestions.push({
        type: 'insufficient-content',
        title: `Add more ${field.label.toLowerCase()}`,
        description: `Recommended: ${field.min} or more`,
        action: `focus-${field.field}`
      })
    } else if (typeof value === 'string' && field.minLength && value.length < field.minLength) {
      suggestions.push({
        type: 'insufficient-content',
        title: `Expand your ${field.label.toLowerCase()}`,
        description: `Current: ${value.length} characters. Recommended: ${field.minLength}+`,
        action: `focus-${field.field}`
      })
    }
  }

  const completionPercentage = Math.round(
    ((requiredFields.length - suggestions.length) / requiredFields.length) * 100
  )

  return {
    suggestions,
    completionTips: suggestions.length === 0
      ? ['Your application is complete! Ready to submit?']
      : [`${completionPercentage}% complete`, `${suggestions.length} field${suggestions.length > 1 ? 's' : ''} need attention`]
  }
}
