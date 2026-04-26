/**
 * AI Analysis System for Multi-Discipline Projects
 *
 * This module provides discipline-specific AI analysis for student projects.
 * Each discipline has custom scoring criteria and evaluation methods.
 *
 * Integrates with Claude (Anthropic) for intelligent project analysis.
 */

import { anthropic, AI_MODEL } from './openai-shared'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type Discipline =
  | 'TECHNOLOGY'
  | 'BUSINESS'
  | 'DESIGN'
  | 'HEALTHCARE'
  | 'ENGINEERING'
  | 'TRADES'
  | 'ARCHITECTURE'
  | 'MEDIA'
  | 'WRITING'
  | 'SOCIAL_SCIENCES'
  | 'ARTS'
  | 'LAW'
  | 'EDUCATION'
  | 'SCIENCE'
  | 'OTHER'

export interface ProjectData {
  title: string
  description: string
  discipline: Discipline
  projectType?: string

  // Universal fields
  skills?: string[]
  tools?: string[]
  competencies?: string[]

  // Academic context
  courseName?: string
  courseCode?: string
  grade?: string
  professor?: string

  // Technology-specific
  technologies?: string[]
  githubUrl?: string
  liveUrl?: string

  // Files (with URLs for multimodal analysis)
  files?: {
    fileType: string
    fileName: string
    fileSize: number
    fileUrl: string
    mimeType: string
  }[]

  // Additional context
  duration?: string
  teamSize?: number
  role?: string
  outcome?: string
  certifications?: string[]
}

export interface RatedSkill {
  name: string
  score: number
  evidence: string
}

export interface AnalysisResult {
  // Overall scores (0-100)
  innovationScore: number
  complexityScore: number
  relevanceScore: number
  qualityScore: number
  overallScore: number

  // Discipline-specific insights
  strengths: string[]
  improvements: string[]
  highlights: string[]

  // Detailed breakdown
  technicalDepth?: number
  practicalApplication?: number
  professionalRelevance?: number

  // AI-generated summary
  summary: string

  // Competencies detected/validated — each with a proficiency score
  // (technical / hard skills: programming languages, frameworks, tools)
  detectedCompetencies: RatedSkill[]

  // Soft skills inferred from project context (interpersonal, behavioral)
  softSkills: RatedSkill[]

  // Optional typed buckets — added 2026-04-26 for transversal categorization
  // alignment with the recruiter job-posting flow. When the project context
  // makes them inferable, populate; otherwise leave empty.
  designSkills?: RatedSkill[]    // UX research, prototyping, visual design
  domainKnowledge?: RatedSkill[] // industry/domain expertise (manufacturing, fintech, healthcare)
  languages?: RatedSkill[]       // spoken languages with optional CEFR (Italian B2, English C1)

  // Recommendations
  recommendations: string[]
}

// ============================================================================
// MAIN ANALYSIS ROUTER
// ============================================================================

/**
 * Analyze a project based on its discipline
 * Routes to appropriate discipline-specific analyzer
 */
export async function analyzeProject(project: ProjectData): Promise<AnalysisResult> {
  console.log(`Analyzing ${project.discipline} project: ${project.title}`)

  // Route to discipline-specific analyzer
  switch (project.discipline) {
    case 'TECHNOLOGY':
      return analyzeTechnologyProject(project)
    case 'BUSINESS':
      return analyzeBusinessProject(project)
    case 'DESIGN':
      return analyzeDesignProject(project)
    case 'HEALTHCARE':
      return analyzeHealthcareProject(project)
    case 'ENGINEERING':
      return analyzeEngineeringProject(project)
    case 'TRADES':
      return analyzeTradesProject(project)
    case 'ARCHITECTURE':
      return analyzeArchitectureProject(project)
    case 'MEDIA':
      return analyzeMediaProject(project)
    case 'WRITING':
      return analyzeWritingProject(project)
    case 'SOCIAL_SCIENCES':
      return analyzeSocialSciencesProject(project)
    case 'ARTS':
      return analyzeArtsProject(project)
    case 'LAW':
      return analyzeLawProject(project)
    case 'EDUCATION':
      return analyzeEducationProject(project)
    case 'SCIENCE':
      return analyzeScienceProject(project)
    default:
      return analyzeGenericProject(project)
  }
}

// ============================================================================
// TECHNOLOGY - Code Complexity & Innovation Analysis
// ============================================================================

export async function analyzeTechnologyProject(project: ProjectData): Promise<AnalysisResult> {
  const prompt = `Analyze this technology project:

Title: ${project.title}
Description: ${project.description}
Technologies: ${project.technologies?.join(', ') || 'Not specified'}
Project Type: ${project.projectType || 'Not specified'}
Course: ${project.courseName || 'Not specified'} (${project.courseCode || 'N/A'})
Grade: ${project.grade || 'Not specified'}
Duration: ${project.duration || 'Not specified'}
Team Size: ${project.teamSize || 'Not specified'}
GitHub URL: ${project.githubUrl || 'Not provided'}
Live URL: ${project.liveUrl || 'Not provided'}

Evaluate this project on:
1. **Technical Complexity**: Architecture, algorithms, data structures (0-100)
2. **Innovation**: Novelty, creativity, problem-solving approach (0-100)
3. **Code Quality**: Best practices, testing, documentation (0-100)
4. **Practical Relevance**: Real-world applicability, user value (0-100)
5. **Technical Stack**: Appropriate tech choices, modern practices (0-100)

Provide:
- 3 key strengths
- 3 areas for improvement
- 2 standout highlights
- 3-5 detected competencies with a proficiency score (0-100) and brief evidence
- 3-5 soft skills (e.g., Teamwork, Leadership, Communication, Time Management, Problem Solving, Adaptability) inferred from team size, role, duration, outcome, and description — each with score (0-100) and evidence
- 2 recommendations for advancement
- Brief summary (2-3 sentences)

Return JSON format:
{
  "complexityScore": 0-100,
  "innovationScore": 0-100,
  "qualityScore": 0-100,
  "relevanceScore": 0-100,
  "technicalDepth": 0-100,
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "...", "..."],
  "highlights": ["...", "..."],
  "detectedCompetencies": [{"name": "...", "score": 0-100, "evidence": "..."}],
  "softSkills": [{"name": "...", "score": 0-100, "evidence": "..."}],
  "recommendations": ["...", "..."],
  "summary": "..."
}`

  try {
    const analysis = await callClaude(prompt, project.files)
    return {
      ...analysis,
      overallScore: calculateOverallScore({
        innovation: analysis.innovationScore,
        complexity: analysis.complexityScore,
        quality: analysis.qualityScore,
        relevance: analysis.relevanceScore
      }),
      practicalApplication: analysis.relevanceScore,
      professionalRelevance: analysis.relevanceScore
    }
  } catch (error) {
    console.error('AI analysis failed, using heuristic fallback:', error)
    return heuristicTechnologyAnalysis(project)
  }
}

/**
 * Heuristic fallback for Technology projects (when AI unavailable)
 */
function heuristicTechnologyAnalysis(project: ProjectData): AnalysisResult {
  const techCount = project.technologies?.length || 0
  const hasGithub = !!project.githubUrl
  const hasLive = !!project.liveUrl
  const hasGoodGrade = project.grade && ['A', 'A-', 'A+'].includes(project.grade)

  const complexityScore = Math.min(100,
    40 + (techCount * 10) + (hasGithub ? 20 : 0) + (hasLive ? 15 : 0)
  )

  const innovationScore = Math.min(100,
    50 + (techCount * 8) + (hasLive ? 20 : 0) + (hasGoodGrade ? 15 : 0)
  )

  const qualityScore = Math.min(100,
    45 + (hasGithub ? 25 : 0) + (hasGoodGrade ? 20 : 0) + (techCount * 5)
  )

  const relevanceScore = Math.min(100,
    50 + (hasLive ? 25 : 0) + (techCount * 5) + (hasGoodGrade ? 10 : 0)
  )

  return {
    complexityScore,
    innovationScore,
    qualityScore,
    relevanceScore,
    overallScore: calculateOverallScore({
      innovation: innovationScore,
      complexity: complexityScore,
      quality: qualityScore,
      relevance: relevanceScore
    }),
    technicalDepth: complexityScore,
    practicalApplication: relevanceScore,
    professionalRelevance: relevanceScore,
    strengths: [
      `Uses ${techCount} technologies demonstrating versatility`,
      hasGithub ? 'Code available on GitHub for verification' : 'Structured technical implementation',
      hasLive ? 'Live deployment shows production readiness' : 'Complete project documentation'
    ],
    improvements: [
      'Consider adding automated testing',
      'Enhance documentation with architecture diagrams',
      'Implement CI/CD pipeline'
    ],
    highlights: [
      `${project.projectType || 'Software'} project with practical application`,
      `Achieved ${project.grade || 'strong'} academic performance`
    ],
    summary: `${project.projectType || 'Technology'} project demonstrating proficiency in ${project.technologies?.slice(0, 3).join(', ') || 'modern technologies'}. ${hasLive ? 'Successfully deployed to production. ' : ''}Shows solid technical foundation and practical implementation skills.`,
    detectedCompetencies: toRatedCompetencies([
      ...project.technologies?.slice(0, 3) || [],
      'Software Development',
      'Problem Solving',
      ...(hasGithub ? ['Version Control'] : [])
    ], 75),
    softSkills: inferSoftSkills(project),
    recommendations: [
      'Consider open-sourcing the project for community feedback',
      'Add performance metrics and optimization analysis'
    ]
  }
}

// ============================================================================
// BUSINESS - Financial Rigor & Analysis Quality
// ============================================================================

export async function analyzeBusinessProject(project: ProjectData): Promise<AnalysisResult> {
  const prompt = `Analyze this business project:

Title: ${project.title}
Description: ${project.description}
Project Type: ${project.projectType || 'Not specified'}
Skills: ${project.skills?.join(', ') || 'Not specified'}
Tools: ${project.tools?.join(', ') || 'Not specified'}
Course: ${project.courseName || 'Not specified'} (${project.courseCode || 'N/A'})
Grade: ${project.grade || 'Not specified'}
Duration: ${project.duration || 'Not specified'}
Outcome: ${project.outcome || 'Not specified'}

Evaluate this project on:
1. **Analytical Rigor**: Methodology, data analysis, financial modeling (0-100)
2. **Business Acumen**: Strategic thinking, market understanding (0-100)
3. **Quantitative Skills**: Financial calculations, statistical analysis (0-100)
4. **Professional Quality**: Presentation, documentation, insights (0-100)
5. **Practical Relevance**: Real-world applicability, business impact (0-100)

Provide:
- 3 key strengths
- 3 areas for improvement
- 2 standout highlights
- 3-5 detected competencies with a proficiency score (0-100) and brief evidence
- 3-5 soft skills (e.g., Teamwork, Leadership, Communication, Time Management, Problem Solving) inferred from context — each with score (0-100) and evidence
- 2 recommendations
- Brief summary (2-3 sentences)

Return JSON with: complexityScore, innovationScore, qualityScore, relevanceScore, strengths, improvements, highlights, detectedCompetencies (array of {name, score, evidence}), softSkills (array of {name, score, evidence}), recommendations, summary.`

  try {
    const analysis = await callClaude(prompt, project.files)
    return {
      ...analysis,
      overallScore: calculateOverallScore({
        innovation: analysis.innovationScore,
        complexity: analysis.complexityScore,
        quality: analysis.qualityScore,
        relevance: analysis.relevanceScore
      })
    }
  } catch (error) {
    return heuristicBusinessAnalysis(project)
  }
}

function heuristicBusinessAnalysis(project: ProjectData): AnalysisResult {
  const hasFinancialTools = project.tools?.some(t =>
    t.toLowerCase().includes('excel') ||
    t.toLowerCase().includes('bloomberg') ||
    t.toLowerCase().includes('tableau')
  )

  const hasQuantSkills = project.skills?.some(s =>
    s.toLowerCase().includes('financial') ||
    s.toLowerCase().includes('analysis') ||
    s.toLowerCase().includes('modeling')
  )

  const hasGoodGrade = project.grade && ['A', 'A-', 'A+'].includes(project.grade)

  const complexityScore = Math.min(100,
    50 + (hasFinancialTools ? 20 : 0) + (hasQuantSkills ? 20 : 0) + (hasGoodGrade ? 10 : 0)
  )

  const innovationScore = Math.min(100,
    55 + (hasQuantSkills ? 20 : 0) + (hasGoodGrade ? 15 : 0) + (project.outcome ? 10 : 0)
  )

  return {
    complexityScore,
    innovationScore,
    qualityScore: complexityScore + 5,
    relevanceScore: innovationScore + 5,
    overallScore: Math.round((complexityScore + innovationScore) / 2) + 5,
    technicalDepth: complexityScore,
    practicalApplication: innovationScore,
    professionalRelevance: innovationScore + 10,
    strengths: [
      'Demonstrates strong analytical thinking',
      hasFinancialTools ? 'Uses industry-standard tools' : 'Structured business approach',
      'Clear business insights and recommendations'
    ],
    improvements: [
      'Consider including sensitivity analysis',
      'Add more visual data representations',
      'Include competitive benchmark analysis'
    ],
    highlights: [
      `${project.projectType || 'Business'} project with practical application`,
      hasGoodGrade ? `Achieved ${project.grade} demonstrating excellence` : 'Strong academic foundation'
    ],
    summary: `${project.projectType || 'Business'} project demonstrating strong analytical and quantitative skills. ${hasFinancialTools ? 'Uses professional tools and methodologies. ' : ''}Shows clear business acumen and practical application of concepts.`,
    detectedCompetencies: toRatedCompetencies([
      ...(project.skills?.slice(0, 3) || []),
      'Business Analysis',
      'Critical Thinking',
      ...(hasQuantSkills ? ['Quantitative Analysis'] : [])
    ], 70),
    softSkills: inferSoftSkills(project),
    recommendations: [
      'Expand analysis to include more real-world scenarios',
      'Consider presenting findings to industry professionals'
    ]
  }
}

// ============================================================================
// DESIGN - Visual Quality & User Experience Assessment
// ============================================================================

export async function analyzeDesignProject(project: ProjectData): Promise<AnalysisResult> {
  const prompt = `Analyze this design project:

Title: ${project.title}
Description: ${project.description}
Project Type: ${project.projectType || 'Not specified'}
Skills: ${project.skills?.join(', ') || 'Not specified'}
Tools: ${project.tools?.join(', ') || 'Not specified'}
Course: ${project.courseName || 'Not specified'}
Grade: ${project.grade || 'Not specified'}
Team Size: ${project.teamSize || 'Individual'}
Outcome: ${project.outcome || 'Not specified'}

Evaluate this project on:
1. **Design Quality**: Aesthetics, visual hierarchy, typography, color theory (0-100)
2. **User Experience**: Usability, accessibility, user research, interaction design (0-100)
3. **Creativity**: Innovation, originality, problem-solving approach (0-100)
4. **Process Maturity**: Research, iteration, testing, documentation (0-100)
5. **Professional Relevance**: Portfolio quality, real-world impact (0-100)

Provide:
- 3 key strengths
- 3 areas for improvement
- 2 standout highlights
- 3-5 detected competencies with a proficiency score (0-100) and brief evidence
- 3-5 soft skills inferred from context — each with score (0-100) and evidence
- 2 recommendations
- Brief summary (2-3 sentences)

Return JSON with: complexityScore, innovationScore, qualityScore, relevanceScore, strengths, improvements, highlights, detectedCompetencies (array of {name, score, evidence}), softSkills (array of {name, score, evidence}), recommendations, summary.`

  try {
    const analysis = await callClaude(prompt, project.files)
    return {
      ...analysis,
      overallScore: calculateOverallScore({
        innovation: analysis.innovationScore,
        complexity: analysis.complexityScore,
        quality: analysis.qualityScore,
        relevance: analysis.relevanceScore
      })
    }
  } catch (error) {
    return heuristicDesignAnalysis(project)
  }
}

function heuristicDesignAnalysis(project: ProjectData): AnalysisResult {
  const hasDesignTools = project.tools?.some(t =>
    t.toLowerCase().includes('figma') ||
    t.toLowerCase().includes('adobe') ||
    t.toLowerCase().includes('sketch')
  )

  const hasUXSkills = project.skills?.some(s =>
    s.toLowerCase().includes('ux') ||
    s.toLowerCase().includes('user') ||
    s.toLowerCase().includes('research')
  )

  const hasGoodGrade = project.grade && ['A', 'A-', 'A+'].includes(project.grade)

  const qualityScore = Math.min(100,
    55 + (hasDesignTools ? 20 : 0) + (hasUXSkills ? 15 : 0) + (hasGoodGrade ? 10 : 0)
  )

  const innovationScore = Math.min(100,
    60 + (hasUXSkills ? 15 : 0) + (hasGoodGrade ? 15 : 0) + (project.outcome ? 10 : 0)
  )

  return {
    complexityScore: qualityScore - 5,
    innovationScore,
    qualityScore,
    relevanceScore: innovationScore + 5,
    overallScore: Math.round((qualityScore + innovationScore) / 2) + 5,
    technicalDepth: qualityScore,
    practicalApplication: innovationScore,
    professionalRelevance: innovationScore + 10,
    strengths: [
      'Strong visual design sensibility',
      hasUXSkills ? 'User-centered design approach' : 'Attention to detail and aesthetics',
      'Professional presentation and documentation'
    ],
    improvements: [
      'Include more user testing iterations',
      'Add accessibility considerations',
      'Document design system decisions'
    ],
    highlights: [
      `${project.projectType || 'Design'} project with strong visual impact`,
      project.outcome || 'Demonstrates design thinking process'
    ],
    summary: `${project.projectType || 'Design'} project showcasing strong visual design and ${hasUXSkills ? 'user experience' : 'creative'} skills. ${hasDesignTools ? 'Uses industry-standard tools. ' : ''}Portfolio-ready work with clear design rationale.`,
    detectedCompetencies: toRatedCompetencies([
      ...(project.skills?.slice(0, 3) || []),
      'Visual Design',
      'Design Thinking',
      ...(hasUXSkills ? ['User Research'] : ['Creative Problem Solving'])
    ], 72),
    softSkills: inferSoftSkills(project),
    recommendations: [
      'Consider conducting A/B testing on design variations',
      'Build case study with full design process documentation'
    ]
  }
}

// ============================================================================
// HEALTHCARE - Clinical Reasoning & Evidence-Based Practice
// ============================================================================

export async function analyzeHealthcareProject(project: ProjectData): Promise<AnalysisResult> {
  const prompt = `Analyze this healthcare project:

Title: ${project.title}
Description: ${project.description}
Project Type: ${project.projectType || 'Not specified'}
Skills: ${project.skills?.join(', ') || 'Not specified'}
Course: ${project.courseName || 'Not specified'}
Grade: ${project.grade || 'Not specified'}
Certifications: ${project.certifications?.join(', ') || 'None listed'}
Outcome: ${project.outcome || 'Not specified'}

Evaluate this project on:
1. **Clinical Reasoning**: Assessment, diagnosis, treatment planning (0-100)
2. **Evidence-Based Practice**: Research quality, literature review, methodology (0-100)
3. **Patient-Centered Care**: Patient outcomes, safety, quality improvement (0-100)
4. **Professional Standards**: Documentation, ethics, compliance (0-100)
5. **Practical Impact**: Real-world application, measurable outcomes (0-100)

Provide:
- 3 key strengths
- 3 areas for improvement
- 2 standout highlights
- 3-5 detected competencies with a proficiency score (0-100) and brief evidence
- 3-5 soft skills inferred from context — each with score (0-100) and evidence
- 2 recommendations
- Brief summary (2-3 sentences)

Return JSON with: complexityScore, innovationScore, qualityScore, relevanceScore, strengths, improvements, highlights, detectedCompetencies (array of {name, score, evidence}), softSkills (array of {name, score, evidence}), recommendations, summary.`

  try {
    const analysis = await callClaude(prompt, project.files)
    return {
      ...analysis,
      overallScore: calculateOverallScore({
        innovation: analysis.innovationScore,
        complexity: analysis.complexityScore,
        quality: analysis.qualityScore,
        relevance: analysis.relevanceScore
      })
    }
  } catch (error) {
    return heuristicHealthcareAnalysis(project)
  }
}

function heuristicHealthcareAnalysis(project: ProjectData): AnalysisResult {
  const hasCertifications = (project.certifications?.length || 0) > 0
  const hasEvidenceBased = project.description.toLowerCase().includes('evidence') ||
                          project.description.toLowerCase().includes('research') ||
                          project.description.toLowerCase().includes('protocol')

  const hasOutcomes = !!project.outcome
  const hasGoodGrade = project.grade && ['A', 'A-', 'A+'].includes(project.grade)

  const complexityScore = Math.min(100,
    55 + (hasEvidenceBased ? 20 : 0) + (hasOutcomes ? 15 : 0) + (hasGoodGrade ? 10 : 0)
  )

  const qualityScore = Math.min(100,
    60 + (hasCertifications ? 20 : 0) + (hasEvidenceBased ? 15 : 0) + (hasGoodGrade ? 5 : 0)
  )

  return {
    complexityScore,
    innovationScore: complexityScore,
    qualityScore,
    relevanceScore: qualityScore + 5,
    overallScore: Math.round((complexityScore + qualityScore) / 2) + 10,
    technicalDepth: complexityScore,
    practicalApplication: qualityScore,
    professionalRelevance: qualityScore + 10,
    strengths: [
      hasEvidenceBased ? 'Evidence-based approach with research foundation' : 'Strong clinical reasoning',
      hasCertifications ? 'Professional certifications validate expertise' : 'Comprehensive patient-centered care',
      'Clear documentation and professional standards'
    ],
    improvements: [
      'Include more quantitative outcome measures',
      'Expand literature review scope',
      'Add quality improvement metrics'
    ],
    highlights: [
      project.outcome || 'Demonstrates clinical competency',
      hasCertifications ? `Holds ${project.certifications?.length} professional certification(s)` : 'Patient safety focus'
    ],
    summary: `${project.projectType || 'Healthcare'} project demonstrating strong clinical reasoning and ${hasEvidenceBased ? 'evidence-based practice' : 'patient-centered care'}. ${hasOutcomes ? 'Achieved measurable positive outcomes. ' : ''}Shows professional competency and commitment to quality care.`,
    detectedCompetencies: toRatedCompetencies([
      ...(project.skills?.slice(0, 3) || []),
      'Clinical Assessment',
      'Professional Ethics',
      ...(hasEvidenceBased ? ['Evidence-Based Practice'] : ['Patient Care'])
    ], 72),
    softSkills: inferSoftSkills(project),
    recommendations: [
      'Consider publishing findings in professional journal',
      'Present at healthcare conference or grand rounds'
    ]
  }
}

// ============================================================================
// ENGINEERING - Technical Complexity & Design Analysis
// ============================================================================

export async function analyzeEngineeringProject(project: ProjectData): Promise<AnalysisResult> {
  const prompt = `Analyze this engineering project:

Title: ${project.title}
Description: ${project.description}
Project Type: ${project.projectType || 'Not specified'}
Skills: ${project.skills?.join(', ') || 'Not specified'}
Tools: ${project.tools?.join(', ') || 'Not specified'}
Course: ${project.courseName || 'Not specified'}
Grade: ${project.grade || 'Not specified'}
Certifications: ${project.certifications?.join(', ') || 'None'}
Outcome: ${project.outcome || 'Not specified'}

Evaluate this project on:
1. **Technical Complexity**: Engineering principles, calculations, simulations (0-100)
2. **Design Quality**: CAD work, specifications, optimization (0-100)
3. **Innovation**: Novel solutions, creativity, problem-solving (0-100)
4. **Practical Feasibility**: Manufacturability, cost, real-world constraints (0-100)
5. **Professional Standards**: Documentation, safety, compliance (0-100)

Provide:
- 3 key strengths
- 3 areas for improvement
- 2 standout highlights
- 3-5 detected competencies with a proficiency score (0-100) and brief evidence
- 3-5 soft skills inferred from context — each with score (0-100) and evidence
- 2 recommendations
- Brief summary (2-3 sentences)

Return JSON with: complexityScore, innovationScore, qualityScore, relevanceScore, strengths, improvements, highlights, detectedCompetencies (array of {name, score, evidence}), softSkills (array of {name, score, evidence}), recommendations, summary.`

  try {
    const analysis = await callClaude(prompt, project.files)
    return {
      ...analysis,
      overallScore: calculateOverallScore({
        innovation: analysis.innovationScore,
        complexity: analysis.complexityScore,
        quality: analysis.qualityScore,
        relevance: analysis.relevanceScore
      })
    }
  } catch (error) {
    return heuristicEngineeringAnalysis(project)
  }
}

function heuristicEngineeringAnalysis(project: ProjectData): AnalysisResult {
  const hasCADTools = project.tools?.some(t =>
    t.toLowerCase().includes('solidworks') ||
    t.toLowerCase().includes('autocad') ||
    t.toLowerCase().includes('ansys') ||
    t.toLowerCase().includes('matlab')
  )

  const hasSimulation = project.description.toLowerCase().includes('simulation') ||
                       project.description.toLowerCase().includes('fea') ||
                       project.description.toLowerCase().includes('analysis')

  const hasOptimization = project.description.toLowerCase().includes('optim') ||
                         project.outcome?.toLowerCase().includes('improve')

  const hasGoodGrade = project.grade && ['A', 'A-', 'A+'].includes(project.grade)

  const complexityScore = Math.min(100,
    50 + (hasCADTools ? 20 : 0) + (hasSimulation ? 20 : 0) + (hasGoodGrade ? 10 : 0)
  )

  const innovationScore = Math.min(100,
    55 + (hasOptimization ? 20 : 0) + (hasSimulation ? 15 : 0) + (hasGoodGrade ? 10 : 0)
  )

  return {
    complexityScore,
    innovationScore,
    qualityScore: complexityScore + 5,
    relevanceScore: innovationScore + 5,
    overallScore: Math.round((complexityScore + innovationScore) / 2) + 10,
    technicalDepth: complexityScore,
    practicalApplication: innovationScore,
    professionalRelevance: innovationScore + 10,
    strengths: [
      hasCADTools ? 'Professional-grade CAD and analysis tools' : 'Strong engineering fundamentals',
      hasSimulation ? 'Comprehensive simulation and validation' : 'Practical design approach',
      'Clear technical documentation'
    ],
    improvements: [
      'Include more design iterations',
      'Add cost analysis and manufacturing considerations',
      'Expand testing and validation'
    ],
    highlights: [
      project.outcome || 'Demonstrates engineering design process',
      hasOptimization ? 'Includes optimization and performance improvement' : 'Technically sound solution'
    ],
    summary: `${project.projectType || 'Engineering'} project demonstrating strong technical skills and ${hasSimulation ? 'advanced analysis capabilities' : 'practical design thinking'}. ${hasCADTools ? 'Uses industry-standard tools. ' : ''}Shows solid engineering fundamentals and professional approach.`,
    detectedCompetencies: toRatedCompetencies([
      ...(project.skills?.slice(0, 3) || []),
      'Engineering Design',
      'Technical Analysis',
      ...(hasCADTools ? ['CAD Modeling'] : ['Problem Solving'])
    ], 73),
    softSkills: inferSoftSkills(project),
    recommendations: [
      'Consider entering design in engineering competition',
      'Prototype and test physical implementation'
    ]
  }
}

// ============================================================================
// ADDITIONAL DISCIPLINES (Simplified Analyzers)
// ============================================================================

export async function analyzeTradesProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 60,
    baseInnovation: 55,
    focusAreas: ['Technical Skill', 'Safety Compliance', 'Professional Standards'],
    keyCompetencies: ['Technical Expertise', 'Code Compliance', 'Safety Protocols']
  })
}

export async function analyzeArchitectureProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 65,
    baseInnovation: 70,
    focusAreas: ['Design Quality', 'Structural Integrity', 'Sustainability'],
    keyCompetencies: ['Architectural Design', 'Building Systems', 'Site Planning']
  })
}

export async function analyzeMediaProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 60,
    baseInnovation: 75,
    focusAreas: ['Creative Vision', 'Production Quality', 'Storytelling'],
    keyCompetencies: ['Video Production', 'Creative Direction', 'Post-Production']
  })
}

export async function analyzeWritingProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 55,
    baseInnovation: 65,
    focusAreas: ['Writing Quality', 'Research Depth', 'Critical Analysis'],
    keyCompetencies: ['Research Methodology', 'Academic Writing', 'Critical Thinking']
  })
}

export async function analyzeSocialSciencesProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 60,
    baseInnovation: 60,
    focusAreas: ['Research Methodology', 'Data Analysis', 'Theoretical Framework'],
    keyCompetencies: ['Research Design', 'Statistical Analysis', 'Critical Thinking']
  })
}

export async function analyzeArtsProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 55,
    baseInnovation: 80,
    focusAreas: ['Creative Expression', 'Technical Skill', 'Artistic Vision'],
    keyCompetencies: ['Artistic Technique', 'Creative Vision', 'Visual Communication']
  })
}

export async function analyzeLawProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 70,
    baseInnovation: 60,
    focusAreas: ['Legal Analysis', 'Research Quality', 'Argumentation'],
    keyCompetencies: ['Legal Research', 'Critical Analysis', 'Written Advocacy']
  })
}

export async function analyzeEducationProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 55,
    baseInnovation: 65,
    focusAreas: ['Pedagogical Approach', 'Student Outcomes', 'Assessment Design'],
    keyCompetencies: ['Instructional Design', 'Assessment', 'Classroom Management']
  })
}

export async function analyzeScienceProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 65,
    baseInnovation: 70,
    focusAreas: ['Scientific Method', 'Experimental Design', 'Data Analysis'],
    keyCompetencies: ['Research Methodology', 'Data Analysis', 'Scientific Writing']
  })
}

export async function analyzeGenericProject(project: ProjectData): Promise<AnalysisResult> {
  return createHeuristicAnalysis(project, {
    baseComplexity: 50,
    baseInnovation: 50,
    focusAreas: ['Project Execution', 'Academic Quality', 'Practical Application'],
    keyCompetencies: ['Project Management', 'Critical Thinking', 'Problem Solving']
  })
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate heuristic soft skills from project metadata
 */
function inferSoftSkills(project: ProjectData): RatedSkill[] {
  const skills: RatedSkill[] = []
  const desc = (project.description || '').toLowerCase()

  if (project.teamSize && project.teamSize > 1) {
    skills.push({
      name: 'Teamwork',
      score: Math.min(100, 60 + project.teamSize * 5),
      evidence: `Collaborated in a team of ${project.teamSize} members`
    })
    skills.push({
      name: 'Collaboration',
      score: Math.min(100, 55 + project.teamSize * 5),
      evidence: 'Multi-member team project requiring coordination'
    })
  }

  const role = (project.role || '').toLowerCase()
  if (role.includes('lead') || role.includes('manager') || role.includes('captain') || role.includes('director')) {
    skills.push({
      name: 'Leadership',
      score: 75,
      evidence: `Held leadership role: ${project.role}`
    })
  }

  if (project.duration) {
    skills.push({
      name: 'Time Management',
      score: 65,
      evidence: `Managed project timeline over ${project.duration}`
    })
  }

  if (project.outcome) {
    skills.push({
      name: 'Problem Solving',
      score: 70,
      evidence: `Achieved measurable outcome: ${project.outcome.slice(0, 80)}`
    })
  }

  if (desc.includes('present') || desc.includes('pitch') || desc.includes('demo')) {
    skills.push({
      name: 'Communication',
      score: 70,
      evidence: 'Project involved presentation or demonstration'
    })
  }

  if (desc.includes('adapt') || desc.includes('pivot') || desc.includes('change') || desc.includes('iterati')) {
    skills.push({
      name: 'Adaptability',
      score: 65,
      evidence: 'Project required adapting to changing requirements'
    })
  }

  // Always include at least 2 soft skills
  if (skills.length === 0) {
    skills.push(
      { name: 'Critical Thinking', score: 60, evidence: 'Demonstrated through project analysis and execution' },
      { name: 'Self-Management', score: 60, evidence: 'Completed project independently' }
    )
  } else if (skills.length === 1) {
    skills.push({ name: 'Critical Thinking', score: 60, evidence: 'Demonstrated through project analysis and execution' })
  }

  return skills
}

/**
 * Convert string competencies to rated skills for heuristic fallbacks
 */
function toRatedCompetencies(names: string[], baseScore: number): RatedSkill[] {
  return names.map((name, i) => ({
    name,
    score: Math.max(50, baseScore - i * 5),
    evidence: `Identified from project context`
  }))
}

/**
 * Fetch a file from URL and return as Buffer + base64.
 */
async function fetchFileBuffer(url: string): Promise<{ buffer: Buffer; base64: string; mediaType: string } | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const mediaType = response.headers.get('content-type') || 'application/octet-stream'
    return { buffer, base64, mediaType }
  } catch (error) {
    console.error(`[AI Analysis] Failed to fetch file: ${url}`, error)
    return null
  }
}

/**
 * Extract text from a Word document (.docx) using mammoth.
 */
async function extractWordText(buffer: Buffer): Promise<string | null> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value.trim() || null
  } catch (error) {
    console.error('[AI Analysis] Failed to extract Word text:', error)
    return null
  }
}

/**
 * Extract text from an Excel spreadsheet (.xlsx/.xls) using xlsx.
 */
function extractExcelText(buffer: Buffer): string | null {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheets: string[] = []
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      const csv = XLSX.utils.sheet_to_csv(sheet)
      if (csv.trim()) {
        sheets.push(`--- Sheet: ${sheetName} ---\n${csv}`)
      }
    }
    const text = sheets.join('\n\n')
    // Limit to ~8000 chars to avoid overwhelming the prompt
    return text.length > 8000 ? text.substring(0, 8000) + '\n... (truncated)' : text
  } catch (error) {
    console.error('[AI Analysis] Failed to extract Excel text:', error)
    return null
  }
}

/**
 * Build multimodal content blocks from project files.
 * Supports: images (vision), PDFs (document), and text extraction descriptions for other types.
 */
async function buildFileContentBlocks(files: ProjectData['files']): Promise<{ blocks: any[]; descriptions: string[] }> {
  const blocks: any[] = []
  const descriptions: string[] = []

  if (!files || files.length === 0) return { blocks, descriptions }

  for (const file of files) {
    try {
      const mime = file.mimeType.toLowerCase()

      // Images — send as vision content for Claude to analyze visually
      if (mime.startsWith('image/') && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mime)) {
        const fileData = await fetchFileBuffer(file.fileUrl)
        if (fileData) {
          blocks.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: fileData.mediaType,
              data: fileData.base64,
            },
          })
          blocks.push({
            type: 'text',
            text: `[Uploaded image: ${file.fileName}]`,
          })
        } else {
          descriptions.push(`Image file: ${file.fileName} (could not be loaded for analysis)`)
        }
      }
      // PDFs — send as document content for Claude to read
      else if (mime === 'application/pdf') {
        const fileData = await fetchFileBuffer(file.fileUrl)
        if (fileData) {
          blocks.push({
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: fileData.base64,
            },
          })
          blocks.push({
            type: 'text',
            text: `[Uploaded PDF document: ${file.fileName}]`,
          })
        } else {
          descriptions.push(`PDF document: ${file.fileName} (could not be loaded for analysis)`)
        }
      }
      // Word documents — extract full text with mammoth
      else if (mime.includes('wordprocessingml') || mime.includes('msword') || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const fileData = await fetchFileBuffer(file.fileUrl)
        if (fileData) {
          const text = await extractWordText(fileData.buffer)
          if (text) {
            const truncated = text.length > 8000 ? text.substring(0, 8000) + '\n... (truncated)' : text
            descriptions.push(`\n--- Word Document: ${file.fileName} ---\n${truncated}\n--- End of ${file.fileName} ---`)
          } else {
            descriptions.push(`Word document: ${file.fileName} (${Math.round(file.fileSize / 1024)}KB) — text extraction failed`)
          }
        } else {
          descriptions.push(`Word document: ${file.fileName} (could not be loaded)`)
        }
      }
      // Excel spreadsheets — extract all sheets as CSV text
      else if (mime.includes('spreadsheetml') || mime.includes('ms-excel')) {
        const fileData = await fetchFileBuffer(file.fileUrl)
        if (fileData) {
          const text = extractExcelText(fileData.buffer)
          if (text) {
            descriptions.push(`\n--- Excel Spreadsheet: ${file.fileName} ---\n${text}\n--- End of ${file.fileName} ---`)
          } else {
            descriptions.push(`Excel spreadsheet: ${file.fileName} (${Math.round(file.fileSize / 1024)}KB) — data extraction failed`)
          }
        } else {
          descriptions.push(`Excel spreadsheet: ${file.fileName} (could not be loaded)`)
        }
      }
      // Video files — metadata only (video content cannot be sent to the text API)
      else if (mime.startsWith('video/')) {
        const sizeMB = Math.round(file.fileSize / (1024 * 1024))
        descriptions.push(`Video file: ${file.fileName} (${sizeMB}MB, ${mime}) — Note: video content cannot be analyzed directly. The student has included a video demo/presentation for this project.`)
      }
      // Other files
      else {
        descriptions.push(`Attached file: ${file.fileName} (${mime}, ${Math.round(file.fileSize / 1024)}KB)`)
      }
    } catch (error) {
      console.error(`[AI Analysis] Error processing file ${file.fileName}:`, error)
      descriptions.push(`File: ${file.fileName} — failed to process for analysis`)
    }
  }

  return { blocks, descriptions }
}

/**
 * Call Claude API for intelligent analysis — supports multimodal content (images, PDFs, text).
 */
async function callClaude(prompt: string, files?: ProjectData['files']): Promise<any> {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured')
  }

  // Build multimodal content blocks from files
  const { blocks: fileBlocks, descriptions: fileDescriptions } = await buildFileContentBlocks(files)

  // Add file descriptions to the prompt text
  let enrichedPrompt = prompt
  if (fileDescriptions.length > 0) {
    enrichedPrompt += `\n\nAttached Files:\n${fileDescriptions.join('\n')}`
  }
  if (fileBlocks.length > 0) {
    enrichedPrompt += `\n\nThe following files have been attached for visual/document analysis. Please examine them carefully and incorporate your findings into the evaluation.`
  }

  // Build content array: text prompt + file content blocks
  const content: any[] = [
    { type: 'text', text: enrichedPrompt },
    ...fileBlocks,
  ]

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 2500,
    system: 'You are an expert academic project evaluator with deep knowledge across multiple disciplines. Analyze projects objectively and provide constructive feedback. When files (images, PDFs, documents) are attached, examine them thoroughly and incorporate specific observations into your evaluation. Always return valid JSON only, with no markdown formatting or code fences. For detectedCompetencies and softSkills, return arrays of objects with {name, score (0-100), evidence} format.',
    messages: [
      {
        role: 'user',
        content,
      },
    ],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') return null

  // Strip any markdown code fences if present
  let text = textBlock.text.trim()
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }

  return JSON.parse(text)
}

/**
 * Calculate overall score from component scores
 */
function calculateOverallScore(scores: {
  innovation: number
  complexity: number
  quality: number
  relevance: number
}): number {
  // Weighted average: innovation 30%, complexity 25%, quality 25%, relevance 20%
  return Math.round(
    scores.innovation * 0.30 +
    scores.complexity * 0.25 +
    scores.quality * 0.25 +
    scores.relevance * 0.20
  )
}

/**
 * Create heuristic analysis for disciplines without custom logic
 */
function createHeuristicAnalysis(
  project: ProjectData,
  config: {
    baseComplexity: number
    baseInnovation: number
    focusAreas: string[]
    keyCompetencies: string[]
  }
): AnalysisResult {
  const hasGoodGrade = project.grade && ['A', 'A-', 'A+'].includes(project.grade)
  const hasOutcome = !!project.outcome
  const skillCount = project.skills?.length || 0

  const complexityBoost = (hasGoodGrade ? 10 : 0) + (skillCount * 3)
  const innovationBoost = (hasOutcome ? 15 : 0) + (hasGoodGrade ? 10 : 0)

  const complexityScore = Math.min(100, config.baseComplexity + complexityBoost)
  const innovationScore = Math.min(100, config.baseInnovation + innovationBoost)
  const qualityScore = Math.min(100, (complexityScore + innovationScore) / 2 + 5)
  const relevanceScore = Math.min(100, innovationScore + 5)

  return {
    complexityScore,
    innovationScore,
    qualityScore,
    relevanceScore,
    overallScore: calculateOverallScore({
      innovation: innovationScore,
      complexity: complexityScore,
      quality: qualityScore,
      relevance: relevanceScore
    }),
    technicalDepth: complexityScore,
    practicalApplication: relevanceScore,
    professionalRelevance: relevanceScore + 5,
    strengths: [
      `Strong foundation in ${config.focusAreas[0].toLowerCase()}`,
      hasGoodGrade ? `Excellent academic performance (${project.grade})` : 'Solid academic execution',
      `Demonstrates ${config.focusAreas[1].toLowerCase()}`
    ],
    improvements: [
      `Enhance ${config.focusAreas[2].toLowerCase()}`,
      'Include more detailed documentation',
      'Add measurable outcomes and impact metrics'
    ],
    highlights: [
      project.outcome || `${project.projectType || 'Project'} with practical application`,
      `Completed in ${project.courseName || 'academic setting'}`
    ],
    summary: `${project.projectType || project.discipline} project demonstrating competency in ${config.focusAreas[0].toLowerCase()} and ${config.focusAreas[1].toLowerCase()}. Shows academic rigor and practical application of concepts.`,
    detectedCompetencies: toRatedCompetencies([
      ...(project.skills?.slice(0, 2) || []),
      ...config.keyCompetencies.slice(0, 3)
    ], 68),
    softSkills: inferSoftSkills(project),
    recommendations: [
      'Consider expanding scope to include additional challenges',
      'Document lessons learned and best practices'
    ]
  }
}

// ============================================================================
// BATCH ANALYSIS
// ============================================================================

/**
 * Analyze multiple projects in batch
 * Useful for re-analyzing existing projects or bulk imports
 */
export async function analyzeBatchProjects(
  projects: ProjectData[],
  options: {
    onProgress?: (completed: number, total: number) => void
    concurrency?: number
  } = {}
): Promise<Map<string, AnalysisResult>> {
  const { onProgress, concurrency = 3 } = options
  const results = new Map<string, AnalysisResult>()

  let completed = 0
  const batches = chunkArray(projects, concurrency)

  for (const batch of batches) {
    const batchPromises = batch.map(async (project) => {
      try {
        const analysis = await analyzeProject(project)
        results.set(project.title, analysis)
        completed++
        if (onProgress) {
          onProgress(completed, projects.length)
        }
      } catch (error) {
        console.error(`Failed to analyze project: ${project.title}`, error)
      }
    })

    await Promise.all(batchPromises)
  }

  return results
}

/**
 * Utility: Chunk array into smaller arrays
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  analyzeProject,
  analyzeBatchProjects,

  // Discipline-specific analyzers
  analyzeTechnologyProject,
  analyzeBusinessProject,
  analyzeDesignProject,
  analyzeHealthcareProject,
  analyzeEngineeringProject,
  analyzeTradesProject,
  analyzeArchitectureProject,
  analyzeMediaProject,
  analyzeWritingProject,
  analyzeSocialSciencesProject,
  analyzeArtsProject,
  analyzeLawProject,
  analyzeEducationProject,
  analyzeScienceProject,
  analyzeGenericProject
}
