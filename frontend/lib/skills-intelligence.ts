/**
 * Skills Intelligence Engine
 *
 * Provides semantic skill matching, synonym resolution, transferable
 * skill detection, and proficiency scoring. Used across:
 * - AI Shortlist matching
 * - Readiness Brief task mapping
 * - Skills Timeline proficiency levels
 * - Live Skills Demand matching
 */

// --- Skill Synonyms & Adjacencies ---
// Maps canonical skill names to their variations and related skills.
// Matching uses these to understand that "React.js" = "React" = "ReactJS".

const SKILL_SYNONYMS: Record<string, string[]> = {
  // Frontend
  'react': ['react.js', 'reactjs', 'react js'],
  'vue': ['vue.js', 'vuejs', 'vue 3'],
  'angular': ['angularjs', 'angular.js'],
  'next.js': ['nextjs', 'next js', 'next'],
  'typescript': ['ts'],
  'javascript': ['js', 'ecmascript', 'es6'],
  'css': ['css3', 'cascading style sheets'],
  'html': ['html5'],
  'tailwind': ['tailwind css', 'tailwindcss'],
  // Backend
  'node.js': ['nodejs', 'node js', 'node'],
  'express': ['express.js', 'expressjs'],
  'django': ['django rest', 'drf'],
  'fastapi': ['fast api'],
  'spring': ['spring boot', 'springboot'],
  'nestjs': ['nest.js', 'nest js'],
  '.net': ['dotnet', 'asp.net', 'c#'],
  // Data & AI
  'python': ['python3', 'py'],
  'pandas': ['pd'],
  'numpy': ['np'],
  'scikit-learn': ['sklearn', 'scikit learn'],
  'tensorflow': ['tf'],
  'pytorch': ['torch'],
  'machine learning': ['ml', 'deep learning', 'dl'],
  'artificial intelligence': ['ai'],
  'data science': ['data analytics'],
  'sql': ['structured query language'],
  'postgresql': ['postgres', 'psql'],
  'mysql': ['mariadb'],
  'mongodb': ['mongo'],
  // DevOps & Cloud
  'docker': ['containerization', 'containers'],
  'kubernetes': ['k8s'],
  'aws': ['amazon web services'],
  'gcp': ['google cloud', 'google cloud platform'],
  'azure': ['microsoft azure'],
  'ci/cd': ['continuous integration', 'continuous deployment', 'cicd'],
  'terraform': ['iac', 'infrastructure as code'],
  // Engineering
  'solidworks': ['solid works'],
  'autocad': ['auto cad', 'auto-cad'],
  'ansys': ['ansys workbench'],
  'matlab': ['mat lab'],
  'simulink': ['simscape'],
  'catia': ['catia v5', 'catia v6'],
  'revit': ['autodesk revit'],
  'sap2000': ['sap 2000'],
  'labview': ['lab view'],
  'plc': ['plc programming', 'ladder logic'],
  'fea': ['finite element analysis', 'fem'],
  'cfd': ['computational fluid dynamics'],
  // Business & Finance
  'excel': ['microsoft excel', 'ms excel', 'spreadsheet'],
  'vba': ['visual basic', 'excel macros'],
  'power bi': ['powerbi', 'power-bi'],
  'tableau': ['tableau desktop'],
  'sap': ['sap erp', 'sap s/4hana'],
  'salesforce': ['sfdc', 'sf'],
  'financial modeling': ['financial analysis', 'dcf'],
  'spss': ['ibm spss'],
  'stata': ['stata se'],
  // Design
  'figma': [],
  'sketch': ['sketch app'],
  'adobe xd': ['xd'],
  'photoshop': ['adobe photoshop', 'ps'],
  'illustrator': ['adobe illustrator', 'ai'],
  'indesign': ['adobe indesign'],
  'rhino': ['rhinoceros', 'rhino 3d'],
  'blender': ['blender 3d'],
  // Project Management
  'jira': ['atlassian jira'],
  'agile': ['scrum', 'kanban'],
  'project management': ['pm', 'pmp'],
}

// Adjacent skills — skills that are closely related but not synonyms.
// If someone has skill A, they likely can learn B quickly.
const SKILL_ADJACENCIES: Record<string, string[]> = {
  'react': ['next.js', 'typescript', 'redux', 'tailwind'],
  'python': ['pandas', 'numpy', 'jupyter', 'flask', 'fastapi', 'django'],
  'node.js': ['express', 'nestjs', 'typescript', 'mongodb'],
  'java': ['spring', 'kotlin', 'gradle', 'maven'],
  'sql': ['postgresql', 'mysql', 'mongodb', 'prisma'],
  'docker': ['kubernetes', 'ci/cd', 'aws', 'terraform'],
  'solidworks': ['catia', 'inventor', 'fusion 360', 'fea', 'ansys'],
  'autocad': ['revit', 'civil 3d', 'microstation'],
  'matlab': ['simulink', 'python', 'labview', 'octave'],
  'excel': ['vba', 'power bi', 'financial modeling', 'python'],
  'power bi': ['tableau', 'sql', 'dax', 'excel'],
  'figma': ['sketch', 'adobe xd', 'prototyping', 'user research'],
  'sap': ['erp', 'abap', 'business process'],
  'r': ['spss', 'stata', 'python', 'statistics'],
}

// Transferable skills — soft/meta skills inferred from project context
const TRANSFERABLE_SKILL_PATTERNS: Array<{
  keywords: string[]
  skill: string
  category: 'leadership' | 'communication' | 'analytical' | 'technical' | 'interpersonal'
}> = [
  { keywords: ['team', 'managed', 'led', 'coordinated', 'supervised'], skill: 'Team Leadership', category: 'leadership' },
  { keywords: ['presented', 'presentation', 'pitch', 'stakeholder', 'client'], skill: 'Stakeholder Communication', category: 'communication' },
  { keywords: ['analyzed', 'analysis', 'research', 'investigated', 'evaluated'], skill: 'Analytical Thinking', category: 'analytical' },
  { keywords: ['designed', 'architected', 'planned', 'structured'], skill: 'System Design', category: 'technical' },
  { keywords: ['tested', 'validated', 'quality', 'qa', 'verified'], skill: 'Quality Assurance', category: 'technical' },
  { keywords: ['documented', 'documentation', 'report', 'wrote'], skill: 'Technical Writing', category: 'communication' },
  { keywords: ['deadline', 'schedule', 'milestone', 'sprint', 'agile'], skill: 'Project Management', category: 'leadership' },
  { keywords: ['budget', 'cost', 'financial', 'revenue', 'roi'], skill: 'Financial Awareness', category: 'analytical' },
  { keywords: ['collaborated', 'cross-functional', 'interdisciplinary', 'teamwork'], skill: 'Cross-functional Collaboration', category: 'interpersonal' },
  { keywords: ['problem', 'solved', 'solution', 'troubleshoot', 'debug', 'fixed'], skill: 'Problem Solving', category: 'analytical' },
  { keywords: ['customer', 'user', 'feedback', 'interview', 'usability'], skill: 'User-Centered Thinking', category: 'interpersonal' },
  { keywords: ['automated', 'optimized', 'improved', 'efficiency', 'performance'], skill: 'Process Optimization', category: 'technical' },
  { keywords: ['prototype', 'mvp', 'iteration', 'experiment'], skill: 'Rapid Prototyping', category: 'technical' },
  { keywords: ['compliance', 'regulation', 'standard', 'iso', 'safety'], skill: 'Regulatory Awareness', category: 'analytical' },
  { keywords: ['international', 'global', 'multicultural', 'multilingual'], skill: 'International Mindset', category: 'interpersonal' },
]

// --- Core Functions ---

/**
 * Normalize a skill name to its canonical form.
 * "ReactJS" → "react", "Solid Works" → "solidworks"
 */
export function normalizeSkill(skill: string): string {
  const lower = skill.toLowerCase().trim()

  // Check direct synonym match
  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    if (canonical === lower || synonyms.includes(lower)) {
      return canonical
    }
  }

  return lower
}

/**
 * Check if two skills are semantically equivalent.
 * "React.js" matches "ReactJS" matches "react"
 */
export function skillsMatch(skillA: string, skillB: string): boolean {
  return normalizeSkill(skillA) === normalizeSkill(skillB)
}

/**
 * Semantic skill matching — returns a match score (0-100) between
 * a candidate's skills and required skills.
 *
 * - Exact/synonym match: 100 points
 * - Adjacent skill match: 50 points
 * - No match: 0 points
 */
export function calculateSkillMatch(
  candidateSkills: string[],
  requiredSkills: string[]
): { score: number; matched: string[]; adjacent: string[]; missing: string[] } {
  if (requiredSkills.length === 0) return { score: 100, matched: [], adjacent: [], missing: [] }

  const normalizedCandidate = candidateSkills.map(s => normalizeSkill(s))
  const matched: string[] = []
  const adjacent: string[] = []
  const missing: string[] = []

  let totalScore = 0

  for (const required of requiredSkills) {
    const normalizedRequired = normalizeSkill(required)

    // Check exact/synonym match
    if (normalizedCandidate.includes(normalizedRequired)) {
      matched.push(required)
      totalScore += 100
      continue
    }

    // Check adjacency
    const adjacencies = SKILL_ADJACENCIES[normalizedRequired] || []
    const hasAdjacent = adjacencies.some(adj =>
      normalizedCandidate.includes(normalizeSkill(adj))
    )

    // Also check reverse — does any candidate skill have this as adjacent?
    const reverseAdjacent = normalizedCandidate.some(cs => {
      const adj = SKILL_ADJACENCIES[cs] || []
      return adj.some(a => normalizeSkill(a) === normalizedRequired)
    })

    if (hasAdjacent || reverseAdjacent) {
      adjacent.push(required)
      totalScore += 50
      continue
    }

    missing.push(required)
  }

  const maxScore = requiredSkills.length * 100
  const score = Math.round((totalScore / maxScore) * 100)

  return { score, matched, adjacent, missing }
}

/**
 * Detect transferable skills from project descriptions.
 * Scans text for patterns that indicate leadership, communication, etc.
 */
export function detectTransferableSkills(
  projectDescriptions: string[]
): Array<{ skill: string; category: string; confidence: number; evidence: string }> {
  const detected: Array<{ skill: string; category: string; confidence: number; evidence: string }> = []
  const seenSkills = new Set<string>()

  for (const description of projectDescriptions) {
    const lower = description.toLowerCase()

    for (const pattern of TRANSFERABLE_SKILL_PATTERNS) {
      if (seenSkills.has(pattern.skill)) continue

      const matchCount = pattern.keywords.filter(kw => lower.includes(kw)).length
      if (matchCount >= 1) {
        const confidence = Math.min(matchCount / pattern.keywords.length * 100, 100)
        if (confidence >= 20) {
          const matchedKeyword = pattern.keywords.find(kw => lower.includes(kw)) || ''
          // Find sentence containing the keyword for evidence
          const sentences = description.split(/[.!?]/)
          const evidenceSentence = sentences.find(s => s.toLowerCase().includes(matchedKeyword))

          detected.push({
            skill: pattern.skill,
            category: pattern.category,
            confidence: Math.round(confidence),
            evidence: evidenceSentence?.trim() || `Detected from project description`,
          })
          seenSkills.add(pattern.skill)
        }
      }
    }
  }

  return detected.sort((a, b) => b.confidence - a.confidence)
}

/**
 * Calculate proficiency level for a skill based on project evidence.
 *
 * Levels:
 * - exposure (1-2): used once in a simple context
 * - working (3-4): used in multiple projects
 * - proficient (5-7): used in complex projects with good scores
 * - expert (8-10): used extensively with high complexity/innovation
 */
export function calculateProficiency(
  projectCount: number,
  avgComplexity: number | null,
  avgInnovation: number | null
): { level: 'exposure' | 'working' | 'proficient' | 'expert'; score: number } {
  let score = 0

  // Project count factor (0-4 points)
  if (projectCount >= 4) score += 4
  else if (projectCount >= 3) score += 3
  else if (projectCount >= 2) score += 2
  else score += 1

  // Complexity factor (0-3 points)
  const complexity = avgComplexity || 0
  if (complexity >= 70) score += 3
  else if (complexity >= 50) score += 2
  else if (complexity >= 30) score += 1

  // Innovation factor (0-3 points)
  const innovation = avgInnovation || 0
  if (innovation >= 70) score += 3
  else if (innovation >= 50) score += 2
  else if (innovation >= 30) score += 1

  // Map to level
  let level: 'exposure' | 'working' | 'proficient' | 'expert'
  if (score >= 8) level = 'expert'
  else if (score >= 5) level = 'proficient'
  else if (score >= 3) level = 'working'
  else level = 'exposure'

  return { level, score }
}

/**
 * Get adjacent skills that a person could learn quickly.
 * "You know React — consider learning Next.js, TypeScript, Redux"
 */
export function getSuggestedSkills(currentSkills: string[]): Array<{ skill: string; reason: string }> {
  const normalized = currentSkills.map(s => normalizeSkill(s))
  const suggestions: Array<{ skill: string; reason: string }> = []
  const seen = new Set(normalized)

  for (const skill of normalized) {
    const adjacencies = SKILL_ADJACENCIES[skill]
    if (!adjacencies) continue

    for (const adj of adjacencies) {
      const normAdj = normalizeSkill(adj)
      if (!seen.has(normAdj)) {
        suggestions.push({
          skill: adj,
          reason: `Related to your ${skill} experience`,
        })
        seen.add(normAdj)
      }
    }
  }

  return suggestions.slice(0, 10)
}

/**
 * Get all synonyms and variations for a skill.
 */
export function getSkillVariations(skill: string): string[] {
  const normalized = normalizeSkill(skill)
  const entry = SKILL_SYNONYMS[normalized]
  if (!entry) return [skill]
  return [normalized, ...entry]
}
