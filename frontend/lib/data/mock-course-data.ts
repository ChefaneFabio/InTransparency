/**
 * Mock Course Data Service
 *
 * This simulates institutional course-level data for demo purposes.
 * When real institutional partnerships are established, this will be replaced
 * with actual API calls to institutional databases (Esse3, Moodle, etc.)
 *
 * TODO: Replace with real data source when ITS partnerships confirmed
 */

import {
  CourseRecord,
  StudentCourseSummary,
  createGradeInfo,
  COURSE_CATEGORIES,
  MarketIntelligence,
  TalentPoolStats,
  CourseCategory
} from '@/lib/types/course-data'

// Mock students with course-level data
export const MOCK_STUDENTS_WITH_COURSES = [
  {
    id: '1',
    name: 'M.R.',
    institutionId: 'its-rizzoli',
    institutionName: 'ITS Angelo Rizzoli',
    institutionType: 'its' as const,
    location: 'Brescia',
    coordinates: { lat: 45.5416, lng: 10.2118 },
    courses: [
      {
        id: 'c1',
        courseCode: 'AUTO-101',
        courseName: 'Automazione Industriale',
        courseCategory: COURSE_CATEGORIES.AUTOMATION,
        grade: createGradeInfo(9, 'its'),
        verified: true,
        semester: '2024-Spring'
      },
      {
        id: 'c2',
        courseCode: 'PLC-201',
        courseName: 'Programmazione PLC',
        courseCategory: COURSE_CATEGORIES.PLC,
        grade: createGradeInfo(10, 'its', true),
        verified: true,
        semester: '2024-Fall'
      },
      {
        id: 'c3',
        courseCode: 'ROB-150',
        courseName: 'Robotica',
        courseCategory: COURSE_CATEGORIES.ROBOTICS,
        grade: createGradeInfo(8, 'its'),
        verified: true,
        semester: '2023-Fall'
      }
    ],
    projects: [
      {
        title: 'PLC Programming for Assembly Line Automation',
        verified: true,
        tags: ['PLC', 'Siemens', 'Automation']
      }
    ],
    matchScore: 96
  },
  {
    id: '2',
    name: 'S.B.',
    institutionId: 'polimi',
    institutionName: 'Politecnico di Milano',
    institutionType: 'university' as const,
    location: 'Milano',
    coordinates: { lat: 45.4642, lng: 9.1900 },
    courses: [
      {
        id: 'c4',
        courseCode: '01NYHOD',
        courseName: 'Machine Learning',
        courseCategory: COURSE_CATEGORIES.AI_ML,
        grade: createGradeInfo(30, 'university', true),
        verified: true,
        semester: '2024-Spring'
      },
      {
        id: 'c5',
        courseCode: '01ABCDE',
        courseName: 'Algoritmi e Strutture Dati',
        courseCategory: COURSE_CATEGORIES.ALGORITHMS,
        grade: createGradeInfo(28, 'university'),
        verified: true,
        semester: '2023-Fall'
      },
      {
        id: 'c6',
        courseCode: '01DEFGH',
        courseName: 'Programmazione Web',
        courseCategory: COURSE_CATEGORIES.WEB_DEV,
        grade: createGradeInfo(29, 'university'),
        verified: true,
        semester: '2024-Fall'
      },
      {
        id: 'c7',
        courseCode: '01IJKLM',
        courseName: 'Basi di Dati',
        courseCategory: COURSE_CATEGORIES.DATABASES,
        grade: createGradeInfo(27, 'university'),
        verified: true,
        semester: '2023-Spring'
      }
    ],
    projects: [
      {
        title: 'ML-Based Trading Algorithm',
        verified: true,
        tags: ['Python', 'TensorFlow', 'ML']
      },
      {
        title: 'Full-Stack E-commerce Platform',
        verified: true,
        tags: ['React', 'Node.js', 'PostgreSQL']
      }
    ],
    matchScore: 94
  },
  {
    id: '3',
    name: 'L.V.',
    institutionId: 'its-tam',
    institutionName: 'ITS TAM Triveneto Academy',
    institutionType: 'its' as const,
    location: 'Desenzano del Garda',
    coordinates: { lat: 45.4712, lng: 10.5381 },
    courses: [
      {
        id: 'c8',
        courseCode: 'CAD-101',
        courseName: 'Disegno Tecnico Industriale',
        courseCategory: COURSE_CATEGORIES.CAD,
        grade: createGradeInfo(9, 'its'),
        verified: true,
        semester: '2024-Spring'
      },
      {
        id: 'c9',
        courseCode: 'CAD-202',
        courseName: 'CAD/CAM',
        courseCategory: COURSE_CATEGORIES.CAD,
        grade: createGradeInfo(9, 'its'),
        verified: true,
        semester: '2024-Fall'
      },
      {
        id: 'c10',
        courseCode: 'MECC-101',
        courseName: 'Meccatronica',
        courseCategory: COURSE_CATEGORIES.MECHANICS,
        grade: createGradeInfo(8, 'its'),
        verified: true,
        semester: '2023-Fall'
      }
    ],
    projects: [
      {
        title: '3D CAD Design for Automotive Parts',
        verified: true,
        tags: ['SolidWorks', 'CAD', 'Automotive']
      }
    ],
    matchScore: 91
  },
  {
    id: '4',
    name: 'G.M.',
    institutionId: 'sapienza',
    institutionName: 'Sapienza Università di Roma',
    institutionType: 'university' as const,
    location: 'Roma',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    courses: [
      {
        id: 'c11',
        courseCode: 'INF-SEC-101',
        courseName: 'Sicurezza Informatica',
        courseCategory: COURSE_CATEGORIES.CYBERSECURITY,
        grade: createGradeInfo(30, 'university', true),
        verified: true,
        semester: '2024-Spring'
      },
      {
        id: 'c12',
        courseCode: 'NET-201',
        courseName: 'Reti di Calcolatori',
        courseCategory: COURSE_CATEGORIES.NETWORKS,
        grade: createGradeInfo(29, 'university'),
        verified: true,
        semester: '2023-Fall'
      },
      {
        id: 'c13',
        courseCode: 'PROG-101',
        courseName: 'Programmazione',
        courseCategory: COURSE_CATEGORIES.PROGRAMMING,
        grade: createGradeInfo(28, 'university'),
        verified: true,
        semester: '2023-Spring'
      }
    ],
    projects: [
      {
        title: 'Network Security Monitoring System',
        verified: true,
        tags: ['Python', 'Cybersecurity', 'Networks']
      }
    ],
    matchScore: 89
  }
]

/**
 * Search students by course criteria
 * In production, this will be a database query to institutional data
 */
export function searchStudentsByCourse(filters: {
  courseCategory?: CourseCategory
  minGrade?: number  // Normalized 0-100
  institutionType?: 'its' | 'university' | 'both'
  location?: string
  radius?: number  // km
}): typeof MOCK_STUDENTS_WITH_COURSES {
  return MOCK_STUDENTS_WITH_COURSES.filter(student => {
    // Filter by institution type
    if (filters.institutionType && filters.institutionType !== 'both') {
      if (student.institutionType !== filters.institutionType) return false
    }

    // Filter by course category + grade
    if (filters.courseCategory || filters.minGrade) {
      const hasCourse = student.courses.some(course => {
        const categoryMatch = !filters.courseCategory || course.courseCategory === filters.courseCategory
        const gradeMatch = !filters.minGrade || course.grade.normalized >= filters.minGrade
        return categoryMatch && gradeMatch
      })
      if (!hasCourse) return false
    }

    // Filter by location (simplified - in production use geospatial)
    if (filters.location) {
      if (!student.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
    }

    return true
  })
}

/**
 * Get talent pool statistics
 */
export function getTalentPoolStats(filters: Parameters<typeof searchStudentsByCourse>[0]): TalentPoolStats {
  const totalCandidates = MOCK_STUDENTS_WITH_COURSES.length
  const matching = searchStudentsByCourse(filters)
  const matchingCount = matching.length

  // Geographic distribution
  const byLocation: Record<string, number> = {}
  matching.forEach(s => {
    byLocation[s.location] = (byLocation[s.location] || 0) + 1
  })

  // By institution type
  const its = matching.filter(s => s.institutionType === 'its').length
  const university = matching.filter(s => s.institutionType === 'university').length

  // Grade distribution (simplified)
  const gradeDistribution = {
    excellent: matching.filter(s => s.courses.some(c => c.grade.normalized >= 90)).length,
    veryGood: matching.filter(s => s.courses.some(c => c.grade.normalized >= 80 && c.grade.normalized < 90)).length,
    good: matching.filter(s => s.courses.some(c => c.grade.normalized >= 70 && c.grade.normalized < 80)).length,
    fair: matching.filter(s => s.courses.some(c => c.grade.normalized >= 60 && c.grade.normalized < 70)).length
  }

  return {
    totalCandidates,
    matchingFilters: matchingCount,
    matchRate: (matchingCount / totalCandidates) * 100,
    byLocation,
    byInstitutionType: { its, university },
    gradeDistribution
  }
}

/**
 * Get market intelligence for a search
 */
export function getMarketIntelligence(
  searchQuery: string,
  filters: Parameters<typeof searchStudentsByCourse>[0]
): MarketIntelligence {
  const talentPool = getTalentPoolStats(filters)

  // Mock salary data (in production, fetch from market data API)
  const salaryRange = {
    min: 28000,
    max: 45000,
    average: 35000,
    currency: 'EUR'
  }

  // Mock competition data
  const competingCompanies = Math.floor(Math.random() * 15) + 5
  const recentHires = Math.floor(Math.random() * 30) + 10

  // Generate recommendations based on filters
  const recommendations = []

  // If match rate is low, suggest expanding
  if (talentPool.matchRate < 10) {
    if (filters.minGrade && filters.minGrade > 70) {
      const expandedStats = getTalentPoolStats({ ...filters, minGrade: filters.minGrade - 10 })
      recommendations.push({
        type: 'lower_grade_threshold' as const,
        title: 'Consider lowering grade requirement',
        description: `Lowering grade threshold from ${filters.minGrade}% to ${filters.minGrade - 10}% opens more candidates`,
        impact: `+${expandedStats.matchingFilters - talentPool.matchingFilters} candidates`
      })
    }

    if (filters.location) {
      recommendations.push({
        type: 'expand_location' as const,
        title: 'Expand geographic radius',
        description: `Consider candidates from nearby cities within 50km of ${filters.location}`,
        impact: '+42 candidates (estimated)'
      })
    }
  }

  // Always suggest ITS if not filtering for it
  if (filters.institutionType !== 'its') {
    recommendations.push({
      type: 'add_related_skills' as const,
      title: 'Include ITS graduates',
      description: 'ITS students have 87% placement rate and strong hands-on skills for technical roles',
      impact: `+${talentPool.byInstitutionType.its} ITS candidates available`
    })
  }

  return {
    searchQuery,
    talentPool,
    salaryRange,
    competingCompanies,
    recentHires,
    recommendations
  }
}

/**
 * Generate AI match explanation for a candidate
 * In production, this calls OpenAI API with context
 */
export function generateMatchExplanation(
  candidate: typeof MOCK_STUDENTS_WITH_COURSES[0],
  searchCriteria: {
    role: string
    requiredSkills?: string[]
    preferredCourses?: string[]
  }
): {
  matchScore: number
  strengths: Array<{ icon: string; text: string }>
  concerns: Array<{ icon: string; text: string }>
  summary: string
} {
  const strengths = []
  const concerns = []

  // Check course matches
  const topCourse = candidate.courses.sort((a, b) => b.grade.normalized - a.grade.normalized)[0]
  if (topCourse) {
    strengths.push({
      icon: '✅',
      text: `Excellent grade in ${topCourse.courseName}: ${topCourse.grade.value}/${topCourse.grade.scale === 'its' ? '10' : '30'}${topCourse.grade.honors ? ' con lode' : ''} (${topCourse.grade.letter})`
    })
  }

  // Check projects
  if (candidate.projects.length > 0) {
    strengths.push({
      icon: '✅',
      text: `${candidate.projects.length} verified project${candidate.projects.length > 1 ? 's' : ''}: "${candidate.projects[0].title}"`
    })
  }

  // Check location (mock - in production calculate real distance)
  if (candidate.location.includes('Milano') || candidate.location.includes('Brescia')) {
    strengths.push({
      icon: '✅',
      text: `Location: ${candidate.location} - local hire reduces relocation costs`
    })
  }

  // Institution reputation
  strengths.push({
    icon: '✅',
    text: `Verified by ${candidate.institutionName} - all credentials authenticated`
  })

  // Add a mock concern for realism
  if (candidate.institutionType === 'its') {
    concerns.push({
      icon: '⚠️',
      text: 'ITS graduate - may need additional university credentials for some roles (but has strong practical skills)'
    })
  }

  const summary = `Strong match for ${searchCriteria.role}. ${strengths.length} key strengths, ${concerns.length} minor consideration${concerns.length > 1 ? 's' : ''}.`

  return {
    matchScore: candidate.matchScore,
    strengths,
    concerns,
    summary
  }
}
