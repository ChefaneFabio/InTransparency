/**
 * Course-Level Data Types
 *
 * This schema reflects the data structure we need from ITS/University institutions.
 * Currently uses MOCK data for demo purposes.
 * When institutions provide real data, we'll plug it into this same schema.
 */

// Grade scale by institution type
export type GradeScale = 'its' | 'university'

export interface GradeInfo {
  value: number           // Raw grade (e.g., 9, 28)
  scale: GradeScale       // 'its' (1-10) or 'university' (18-30)
  normalized: number      // Normalized to 0-100 for comparisons
  letter?: string         // Optional letter grade (A, B, C for international display)
  honors?: boolean        // 30 e lode, or 10 con lode
}

export interface CourseRecord {
  id: string
  studentId: string

  // Course info
  courseCode: string           // e.g., "01ABCDE" (Politecnico), "AUTO-101" (ITS)
  courseName: string           // e.g., "Automazione Industriale", "Machine Learning"
  courseCategory: string       // Standardized category (see COURSE_CATEGORIES)
  credits: number              // CFU or equivalent

  // Grade
  grade: GradeInfo

  // Verification
  institutionId: string
  institutionName: string
  verified: boolean
  verifiedAt: Date
  verifiedBy?: string          // Institution official who verified

  // Metadata
  semester: string             // e.g., "2023-Fall", "2024-Spring"
  academicYear: string         // e.g., "2023/2024"
}

// Standardized course categories for cross-institution search
export const COURSE_CATEGORIES = {
  // Tech/IT
  PROGRAMMING: 'Programming',
  WEB_DEV: 'Web Development',
  DATABASES: 'Databases',
  ALGORITHMS: 'Algorithms & Data Structures',
  AI_ML: 'AI & Machine Learning',
  CYBERSECURITY: 'Cybersecurity',
  NETWORKS: 'Computer Networks',

  // Engineering
  AUTOMATION: 'Automation & Control',
  PLC: 'PLC Programming',
  CAD: 'CAD/CAM Design',
  MECHANICS: 'Mechanics',
  ELECTRONICS: 'Electronics',
  ROBOTICS: 'Robotics',

  // Business
  ACCOUNTING: 'Accounting',
  FINANCE: 'Finance',
  MARKETING: 'Marketing',
  ECONOMICS: 'Economics',
  STATISTICS: 'Statistics',

  // Other
  PROJECT_MGMT: 'Project Management',
  COMMUNICATION: 'Communication',
  LANGUAGES: 'Foreign Languages'
} as const

export type CourseCategory = typeof COURSE_CATEGORIES[keyof typeof COURSE_CATEGORIES]

// Course name → standardized category mapping
// This will be expanded with real institutional course catalogs
export const COURSE_MAPPINGS: Record<string, CourseCategory> = {
  // Italian ITS courses
  'Automazione Industriale': COURSE_CATEGORIES.AUTOMATION,
  'Programmazione PLC': COURSE_CATEGORIES.PLC,
  'Disegno Tecnico Industriale': COURSE_CATEGORIES.CAD,
  'CAD/CAM': COURSE_CATEGORIES.CAD,
  'Robotica': COURSE_CATEGORIES.ROBOTICS,
  'Elettronica': COURSE_CATEGORIES.ELECTRONICS,
  'Meccatronica': COURSE_CATEGORIES.MECHANICS,

  // Italian University courses
  'Programmazione': COURSE_CATEGORIES.PROGRAMMING,
  'Programmazione Web': COURSE_CATEGORIES.WEB_DEV,
  'Applicazioni Internet': COURSE_CATEGORIES.WEB_DEV,
  'Basi di Dati': COURSE_CATEGORIES.DATABASES,
  'Algoritmi e Strutture Dati': COURSE_CATEGORIES.ALGORITHMS,
  'Machine Learning': COURSE_CATEGORIES.AI_ML,
  'Apprendimento Automatico': COURSE_CATEGORIES.AI_ML,
  'Intelligenza Artificiale': COURSE_CATEGORIES.AI_ML,
  'Sicurezza Informatica': COURSE_CATEGORIES.CYBERSECURITY,
  'Network Security': COURSE_CATEGORIES.CYBERSECURITY,
  'Reti di Calcolatori': COURSE_CATEGORIES.NETWORKS,
  'Statistica': COURSE_CATEGORIES.STATISTICS,
  'Economia Aziendale': COURSE_CATEGORIES.ECONOMICS,
  'Contabilità': COURSE_CATEGORIES.ACCOUNTING,
  'Marketing': COURSE_CATEGORIES.MARKETING
}

// Helper functions for grade normalization
export function normalizeGrade(grade: number, scale: GradeScale): number {
  if (scale === 'its') {
    // ITS: 6-10 scale (6 = pass, 10 = perfect)
    return ((grade - 6) / 4) * 100
  } else {
    // University: 18-30 scale (18 = pass, 30 = perfect)
    return ((grade - 18) / 12) * 100
  }
}

export function gradeToLetter(normalized: number): string {
  if (normalized >= 90) return 'A+'
  if (normalized >= 85) return 'A'
  if (normalized >= 80) return 'A-'
  if (normalized >= 75) return 'B+'
  if (normalized >= 70) return 'B'
  if (normalized >= 65) return 'B-'
  if (normalized >= 60) return 'C+'
  return 'C'
}

export function createGradeInfo(value: number, scale: GradeScale, honors: boolean = false): GradeInfo {
  const normalized = normalizeGrade(value, scale)
  return {
    value,
    scale,
    normalized,
    letter: gradeToLetter(normalized),
    honors
  }
}

// Student course summary (for search/filtering)
export interface StudentCourseSummary {
  studentId: string
  totalCourses: number
  averageGrade: GradeInfo

  // Courses by category
  coursesByCategory: Record<CourseCategory, CourseRecord[]>

  // Top performing categories
  strongCategories: Array<{
    category: CourseCategory
    averageGrade: number
    courseCount: number
  }>

  // Verification status
  verifiedCourseCount: number
  verificationRate: number  // % of courses verified
}

// Market intelligence types
export interface TalentPoolStats {
  totalCandidates: number
  matchingFilters: number
  matchRate: number  // % matching

  // Geographic distribution
  byLocation: Record<string, number>

  // By institution type
  byInstitutionType: {
    its: number
    university: number
  }

  // Grade distribution
  gradeDistribution: {
    excellent: number    // ≥90%
    veryGood: number     // 80-89%
    good: number         // 70-79%
    fair: number         // 60-69%
  }
}

export interface MarketIntelligence {
  searchQuery: string
  talentPool: TalentPoolStats

  // Salary insights
  salaryRange: {
    min: number
    max: number
    average: number
    currency: string
  }

  // Competition
  competingCompanies: number
  recentHires: number  // in last 30 days in this category

  // Recommendations
  recommendations: Array<{
    type: 'expand_location' | 'lower_grade_threshold' | 'add_related_skills' | 'timing'
    title: string
    description: string
    impact: string  // e.g., "+45 candidates"
  }>
}
