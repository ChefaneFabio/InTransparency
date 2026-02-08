// ============================================
// Types & Interfaces
// ============================================

export interface SkillScore {
  name: string
  level: number // 0-100
  confidence: number // 0-1
  category: string // "technical", "soft_skills", "tools", "frameworks", "languages"
  projectCount: number
  evidence: string[]
}

export interface SkillGap {
  skill: string
  currentLevel: number // 0-100, 0 means not learned
  targetLevel: number // market expected level
  demand: number // 0-100 market demand score
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedHours: number
  impact: number // how much closing this gap improves hireability
  category: string
}

export interface ProjectIdea {
  id: string
  title: string
  description: string
  skills: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  discipline: string
  type: string
}

export interface CareerPath {
  title: string
  matchScore: number // 0-100
  description: string
  missingSkills: string[]
  presentSkills: string[]
  averageSalary?: string
  demandTrend: 'rising' | 'stable' | 'declining'
}

export interface RoadmapMilestone {
  id: string
  title: string
  description: string
  skills: string[]
  weekNumber: number
  duration: number // in weeks
  type: 'learn' | 'build' | 'certify' | 'apply'
  completed: boolean
}

export interface SkillPathData {
  hireabilityScore: number
  currentSkills: SkillScore[]
  skillGaps: SkillGap[]
  projectIdeas: ProjectIdea[]
  careerPaths: CareerPath[]
  roadmap: RoadmapMilestone[]
  challenges: ProjectIdea[]
  generatedAt: string
  expiresAt: string
}

export interface SkillPathResponse {
  data: SkillPathData | null
  tierLimits: {
    tier: string
    maxGaps: number
    maxProjectIdeas: number
    maxCareerPaths: number
    hasRoadmap: boolean
    hasChallenges: boolean
    refreshCooldown: number // minutes
  }
  isLimited: boolean
}

// ============================================
// Heuristic Fallback Logic (used server-side)
// ============================================

interface ProjectForAnalysis {
  id: string
  title: string
  description: string
  discipline: string
  technologies: string[]
  skills: string[]
  tools: string[]
  complexityScore: number | null
  innovationScore: number | null
  marketRelevance: number | null
}

interface JobForAnalysis {
  requiredSkills: string[]
  preferredSkills: string[]
  title: string
}

interface SoftSkillData {
  communication?: number
  teamwork?: number
  leadership?: number
  problemSolving?: number
  adaptability?: number
  emotionalIntelligence?: number
  timeManagement?: number
  conflictResolution?: number
}

export function calculateHireabilityScore(
  skillScores: SkillScore[],
  skillGaps: SkillGap[],
  projectCount: number,
  softSkillData: SoftSkillData | null
): number {
  if (skillScores.length === 0 && projectCount === 0) return 0

  // Skill coverage: how well does student cover in-demand skills
  const avgSkillLevel = skillScores.length > 0
    ? skillScores.reduce((sum, s) => sum + s.level, 0) / skillScores.length
    : 0

  // Gap severity: fewer critical gaps = higher score
  const criticalGaps = skillGaps.filter(g => g.priority === 'critical').length
  const highGaps = skillGaps.filter(g => g.priority === 'high').length
  const gapPenalty = Math.min(40, criticalGaps * 10 + highGaps * 5)

  // Project diversity bonus
  const projectBonus = Math.min(20, projectCount * 4)

  // Soft skills bonus
  const softSkillBonus = softSkillData
    ? Math.min(15, Object.values(softSkillData).reduce((sum, v) => sum + (v || 0), 0) / Object.keys(softSkillData).length / 100 * 15)
    : 0

  const rawScore = avgSkillLevel * 0.5 + projectBonus + softSkillBonus - gapPenalty
  return Math.max(0, Math.min(100, Math.round(rawScore)))
}

export function buildSkillScoresFromProjects(
  projects: ProjectForAnalysis[]
): SkillScore[] {
  const skillMap = new Map<string, { count: number; projects: string[]; totalComplexity: number }>()

  for (const project of projects) {
    const allSkills = [...project.technologies, ...project.skills, ...project.tools]
    const uniqueSkills = Array.from(new Set(allSkills.map(s => s.toLowerCase().trim())))

    for (const skill of uniqueSkills) {
      if (!skill) continue
      const existing = skillMap.get(skill) || { count: 0, projects: [], totalComplexity: 0 }
      existing.count++
      existing.projects.push(project.title)
      existing.totalComplexity += project.complexityScore || 50
      skillMap.set(skill, existing)
    }
  }

  return Array.from(skillMap.entries())
    .map(([name, data]) => {
      const avgComplexity = data.totalComplexity / data.count
      // Level based on usage frequency weighted by project complexity
      const level = Math.min(100, Math.round(
        20 + (data.count * 15) + (avgComplexity / 100 * 30)
      ))
      const confidence = Math.min(1, data.count / 5) // Max confidence at 5+ projects

      return {
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
        level,
        confidence,
        category: categorizeSkill(name),
        projectCount: data.count,
        evidence: data.projects.slice(0, 3),
      }
    })
    .sort((a, b) => b.level - a.level)
}

export function identifySkillGaps(
  currentSkills: SkillScore[],
  marketDemand: Map<string, number>, // skill -> demand score 0-100
  competencyDemand: Map<string, number> // from Competency.industryDemand
): SkillGap[] {
  const gaps: SkillGap[] = []
  const currentSkillMap = new Map(currentSkills.map(s => [s.name.toLowerCase(), s]))

  // Check all market demanded skills
  for (const [skill, demand] of Array.from(marketDemand.entries())) {
    const current = currentSkillMap.get(skill.toLowerCase())
    const currentLevel = current?.level || 0
    const targetLevel = Math.min(100, demand + 20) // Target slightly above demand

    if (currentLevel < targetLevel - 15) { // At least 15 points gap
      const gapSize = targetLevel - currentLevel
      const impact = Math.round(demand * (gapSize / 100))

      gaps.push({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        currentLevel,
        targetLevel,
        demand,
        priority: impact > 60 ? 'critical' : impact > 40 ? 'high' : impact > 20 ? 'medium' : 'low',
        estimatedHours: Math.round(gapSize * 0.8), // Rough estimate
        impact,
        category: categorizeSkill(skill),
      })
    }
  }

  // Also check competency-based demand
  for (const [skill, demand] of Array.from(competencyDemand.entries())) {
    const alreadyIncluded = gaps.some(g => g.skill.toLowerCase() === skill.toLowerCase())
    if (alreadyIncluded) continue

    const current = currentSkillMap.get(skill.toLowerCase())
    const currentLevel = current?.level || 0
    const targetLevel = Math.min(100, demand + 20)

    if (currentLevel < targetLevel - 15 && demand > 40) {
      const gapSize = targetLevel - currentLevel
      const impact = Math.round(demand * (gapSize / 100))

      gaps.push({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        currentLevel,
        targetLevel,
        demand,
        priority: impact > 60 ? 'critical' : impact > 40 ? 'high' : impact > 20 ? 'medium' : 'low',
        estimatedHours: Math.round(gapSize * 0.8),
        impact,
        category: categorizeSkill(skill),
      })
    }
  }

  return gaps.sort((a, b) => b.impact - a.impact)
}

export function generateProjectIdeas(
  gaps: SkillGap[],
  discipline: string
): ProjectIdea[] {
  const topGaps = gaps.slice(0, 8)
  const ideas: ProjectIdea[] = []

  const templates = getProjectTemplates(discipline)

  for (let i = 0; i < Math.min(topGaps.length, templates.length); i++) {
    const gap = topGaps[i]
    const template = templates[i]

    ideas.push({
      id: `idea-${i}`,
      title: template.title.replace('{skill}', gap.skill),
      description: template.description.replace('{skill}', gap.skill),
      skills: [gap.skill, ...template.extraSkills].slice(0, 4),
      difficulty: gap.currentLevel < 30 ? 'beginner' : gap.currentLevel < 60 ? 'intermediate' : 'advanced',
      estimatedHours: template.hours,
      discipline,
      type: template.type,
    })
  }

  return ideas
}

export function buildCareerPaths(
  currentSkills: SkillScore[],
  jobs: JobForAnalysis[]
): CareerPath[] {
  // Group jobs by title similarity and aggregate required skills
  const careerMap = new Map<string, { titles: string[]; requiredSkills: Set<string>; preferredSkills: Set<string> }>()

  for (const job of jobs) {
    const normalizedTitle = normalizeJobTitle(job.title)
    const existing = careerMap.get(normalizedTitle) || {
      titles: [],
      requiredSkills: new Set<string>(),
      preferredSkills: new Set<string>(),
    }
    existing.titles.push(job.title)
    job.requiredSkills.forEach(s => existing.requiredSkills.add(s.toLowerCase()))
    job.preferredSkills.forEach(s => existing.preferredSkills.add(s.toLowerCase()))
    careerMap.set(normalizedTitle, existing)
  }

  const currentSkillNames = new Set(currentSkills.map(s => s.name.toLowerCase()))

  return Array.from(careerMap.entries())
    .map(([title, data]) => {
      const allRequired = Array.from(data.requiredSkills)
      const presentSkills = allRequired.filter(s => currentSkillNames.has(s))
      const missingSkills = allRequired.filter(s => !currentSkillNames.has(s))

      const matchScore = allRequired.length > 0
        ? Math.round((presentSkills.length / allRequired.length) * 100)
        : 50

      return {
        title: data.titles[0], // Use first actual title
        matchScore,
        description: `Based on ${data.titles.length} job listing${data.titles.length > 1 ? 's' : ''}`,
        missingSkills: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).slice(0, 5),
        presentSkills: presentSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).slice(0, 5),
        demandTrend: data.titles.length >= 3 ? 'rising' as const : data.titles.length >= 2 ? 'stable' as const : 'stable' as const,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10)
}

export function buildRoadmap(gaps: SkillGap[]): RoadmapMilestone[] {
  const milestones: RoadmapMilestone[] = []
  let weekOffset = 1

  const sortedGaps = [...gaps]
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .slice(0, 8)

  for (let i = 0; i < sortedGaps.length; i++) {
    const gap = sortedGaps[i]
    const durationWeeks = Math.max(1, Math.ceil(gap.estimatedHours / 10)) // ~10 hours/week

    // Learning milestone
    milestones.push({
      id: `learn-${i}`,
      title: `Learn ${gap.skill}`,
      description: `Study ${gap.skill} fundamentals and best practices`,
      skills: [gap.skill],
      weekNumber: weekOffset,
      duration: Math.ceil(durationWeeks * 0.6),
      type: 'learn',
      completed: false,
    })

    // Build milestone
    milestones.push({
      id: `build-${i}`,
      title: `Build with ${gap.skill}`,
      description: `Create a project demonstrating ${gap.skill} proficiency`,
      skills: [gap.skill],
      weekNumber: weekOffset + Math.ceil(durationWeeks * 0.6),
      duration: Math.ceil(durationWeeks * 0.4),
      type: 'build',
      completed: false,
    })

    weekOffset += durationWeeks + 1
  }

  return milestones
}

// ============================================
// Utility Functions
// ============================================

function categorizeSkill(skill: string): string {
  const s = skill.toLowerCase()

  const languages = ['python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'r', 'matlab', 'sql', 'html', 'css']
  const frameworks = ['react', 'angular', 'vue', 'next.js', 'nextjs', 'express', 'django', 'flask', 'spring', 'rails', 'laravel', '.net', 'fastapi', 'tailwind', 'bootstrap']
  const tools = ['git', 'docker', 'kubernetes', 'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'solidworks', 'autocad', 'excel', 'tableau', 'power bi', 'jira']
  const cloud = ['aws', 'azure', 'gcp', 'google cloud', 'firebase', 'heroku', 'vercel', 'netlify']
  const databases = ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'sqlite', 'prisma']

  if (languages.some(l => s.includes(l))) return 'languages'
  if (frameworks.some(f => s.includes(f))) return 'frameworks'
  if (cloud.some(c => s.includes(c))) return 'cloud'
  if (databases.some(d => s.includes(d))) return 'databases'
  if (tools.some(t => s.includes(t))) return 'tools'

  return 'technical'
}

function normalizeJobTitle(title: string): string {
  const normalized = title.toLowerCase()
    .replace(/\b(senior|junior|lead|principal|staff|intern|mid-level|entry-level)\b/g, '')
    .replace(/\b(i|ii|iii|iv|v)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return normalized
}

function getProjectTemplates(discipline: string): Array<{ title: string; description: string; extraSkills: string[]; hours: number; type: string }> {
  const baseTemplates = [
    { title: '{skill} Portfolio Project', description: 'Build a showcase project demonstrating your {skill} abilities with real-world application', extraSkills: ['Problem Solving', 'Documentation'], hours: 40, type: 'portfolio' },
    { title: '{skill} Dashboard App', description: 'Create an interactive dashboard using {skill} to visualize and analyze data', extraSkills: ['Data Visualization', 'UI Design'], hours: 30, type: 'web_app' },
    { title: '{skill} API Service', description: 'Design and implement a REST API service leveraging {skill}', extraSkills: ['API Design', 'Testing'], hours: 25, type: 'backend' },
    { title: '{skill} Automation Tool', description: 'Build a tool that automates common tasks using {skill}', extraSkills: ['Scripting', 'CI/CD'], hours: 20, type: 'tool' },
    { title: '{skill} Open Source Contribution', description: 'Contribute to an open source project that uses {skill}', extraSkills: ['Git', 'Collaboration'], hours: 15, type: 'open_source' },
    { title: '{skill} Case Study', description: 'Analyze a real-world problem and propose a solution using {skill}', extraSkills: ['Research', 'Analysis'], hours: 20, type: 'case_study' },
    { title: '{skill} Mobile App', description: 'Create a mobile application that demonstrates {skill} proficiency', extraSkills: ['Mobile Development', 'UX Design'], hours: 35, type: 'mobile' },
    { title: '{skill} Integration Project', description: 'Build a project that integrates {skill} with other technologies in your stack', extraSkills: ['System Design', 'Integration'], hours: 30, type: 'integration' },
  ]

  // Adjust for discipline
  if (discipline === 'BUSINESS') {
    return [
      { title: '{skill} Financial Model', description: 'Build a comprehensive financial model using {skill}', extraSkills: ['Excel', 'Financial Analysis'], hours: 30, type: 'model' },
      { title: '{skill} Market Analysis', description: 'Conduct market research and analysis with {skill}', extraSkills: ['Research', 'Presentation'], hours: 25, type: 'research' },
      { title: '{skill} Business Plan', description: 'Create a business plan leveraging {skill} methodologies', extraSkills: ['Strategy', 'Communication'], hours: 35, type: 'plan' },
      ...baseTemplates.slice(0, 5),
    ]
  }

  if (discipline === 'DESIGN') {
    return [
      { title: '{skill} Design System', description: 'Create a comprehensive design system using {skill}', extraSkills: ['UI Design', 'Documentation'], hours: 35, type: 'design_system' },
      { title: '{skill} UX Case Study', description: 'Conduct user research and create a UX case study with {skill}', extraSkills: ['User Research', 'Prototyping'], hours: 30, type: 'case_study' },
      { title: '{skill} Brand Identity', description: 'Design a complete brand identity package using {skill}', extraSkills: ['Typography', 'Color Theory'], hours: 25, type: 'branding' },
      ...baseTemplates.slice(0, 5),
    ]
  }

  return baseTemplates
}

export function getMarketDemandFromJobs(jobs: JobForAnalysis[]): Map<string, number> {
  const skillCounts = new Map<string, number>()
  const totalJobs = jobs.length || 1

  for (const job of jobs) {
    const allSkills = [...job.requiredSkills, ...job.preferredSkills]
    for (const skill of allSkills) {
      const normalized = skill.toLowerCase().trim()
      if (!normalized) continue
      skillCounts.set(normalized, (skillCounts.get(normalized) || 0) + 1)
    }
  }

  // Convert counts to demand scores (0-100)
  const demandScores = new Map<string, number>()
  for (const [skill, count] of Array.from(skillCounts.entries())) {
    const score = Math.min(100, Math.round((count / totalJobs) * 200)) // normalize
    demandScores.set(skill, score)
  }

  return demandScores
}
