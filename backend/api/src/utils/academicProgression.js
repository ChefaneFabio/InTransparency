// InTransparency Academic Progression Tracking System
// Tracks student development over time and predicts career readiness

const { db } = require('../config/database')
const CourseEquivalenceEngine = require('./courseEquivalence')

class AcademicProgressionTracker {
  constructor() {
    this.equivalenceEngine = new CourseEquivalenceEngine()
    
    // Skill development milestones
    this.skillMilestones = {
      programming: {
        beginner: { threshold: 1, evidence: ['basic_syntax', 'simple_programs'] },
        intermediate: { threshold: 2, evidence: ['data_structures', 'oop_concepts', 'algorithms'] },
        advanced: { threshold: 3, evidence: ['complex_projects', 'frameworks', 'optimization'] },
        expert: { threshold: 4, evidence: ['production_code', 'architecture', 'mentoring'] }
      },
      problem_solving: {
        basic: { threshold: 1, evidence: ['simple_algorithms', 'basic_logic'] },
        intermediate: { threshold: 2, evidence: ['algorithm_optimization', 'design_patterns'] },
        advanced: { threshold: 3, evidence: ['novel_approaches', 'system_design'] },
        expert: { threshold: 4, evidence: ['research_contributions', 'innovation'] }
      },
      communication: {
        basic: { threshold: 1, evidence: ['class_presentations', 'documentation'] },
        intermediate: { threshold: 2, evidence: ['team_projects', 'peer_collaboration'] },
        advanced: { threshold: 3, evidence: ['stakeholder_meetings', 'technical_writing'] },
        expert: { threshold: 4, evidence: ['conference_presentations', 'leadership'] }
      }
    }
    
    // Job readiness criteria
    this.jobReadinessCriteria = {
      'ML Engineer': {
        requiredSkills: ['machine_learning', 'programming', 'statistics'],
        preferredSkills: ['python', 'deep_learning', 'data_preprocessing'],
        minimumLevel: 'intermediate',
        projectRequirements: ['ml_project', 'data_analysis'],
        timelineEstimate: { junior: 0, mid: 12, senior: 36 } // months
      },
      'Full-Stack Developer': {
        requiredSkills: ['web_development', 'programming', 'database_systems'],
        preferredSkills: ['javascript', 'frameworks', 'api_design'],
        minimumLevel: 'intermediate',
        projectRequirements: ['web_application', 'backend_api'],
        timelineEstimate: { junior: 3, mid: 18, senior: 42 }
      },
      'Data Scientist': {
        requiredSkills: ['statistics', 'programming', 'data_analysis'],
        preferredSkills: ['machine_learning', 'visualization', 'business_analytics'],
        minimumLevel: 'intermediate',
        projectRequirements: ['data_analysis', 'statistical_modeling'],
        timelineEstimate: { junior: 6, mid: 24, senior: 48 }
      }
    }
  }
  
  /**
   * Analyze student's complete academic progression
   * @param {string} studentId - Student ID
   * @returns {Object} - Complete progression analysis
   */
  async analyzeStudentProgression(studentId) {
    try {
      // Get student profile and courses
      const student = await db('student_profiles')
        .join('users', 'student_profiles.user_id', 'users.id')
        .where('student_profiles.user_id', studentId)
        .first()
      
      if (!student) {
        throw new Error('Student not found')
      }
      
      // Get all courses chronologically
      const courses = await db('student_courses')
        .where('profile_id', student.id)
        .orderBy('semester')
        .orderBy('created_at')
      
      // Get projects
      const projects = await db('student_projects')
        .where('profile_id', student.id)
        .orderBy('created_at')
      
      // Analyze progression
      const yearlyProgression = this.calculateYearlyProgression(courses, projects)
      const skillEvolution = this.trackSkillEvolution(courses, projects)
      const jobReadiness = this.assessJobReadiness(courses, projects, skillEvolution)
      const careerTrajectory = this.predictCareerTrajectory(yearlyProgression, skillEvolution)
      
      return {
        student: {
          name: `${student.first_name} ${student.last_name}`,
          university: student.university,
          degree: student.degree,
          currentGPA: student.gpa
        },
        yearlyProgression,
        skillEvolution,
        jobReadiness,
        careerTrajectory,
        recommendations: this.generateRecommendations(skillEvolution, jobReadiness)
      }
    } catch (error) {
      console.error('Error analyzing progression:', error)
      throw error
    }
  }
  
  /**
   * Calculate yearly academic progression
   */
  calculateYearlyProgression(courses, projects) {
    const yearlyData = {}
    
    courses.forEach(course => {
      const year = this.extractYear(course.semester)
      if (!yearlyData[year]) {
        yearlyData[year] = {
          year,
          courses: [],
          projects: [],
          totalCredits: 0,
          weightedGrade: 0,
          skillsAcquired: new Set(),
          keyDevelopments: []
        }
      }
      
      yearlyData[year].courses.push({
        name: course.course_name,
        grade: course.grade,
        credits: course.credits || 6,
        semester: course.semester,
        professor: course.professor,
        skills: this.extractSkillsFromCourse(course.course_name)
      })
      
      yearlyData[year].totalCredits += (course.credits || 6)
      yearlyData[year].weightedGrade += course.grade * (course.credits || 6)
      
      // Add skills
      const courseSkills = this.extractSkillsFromCourse(course.course_name)
      courseSkills.forEach(skill => yearlyData[year].skillsAcquired.add(skill))
    })
    
    // Add projects to respective years
    projects.forEach(project => {
      const year = new Date(project.created_at).getFullYear()
      if (yearlyData[year]) {
        yearlyData[year].projects.push({
          title: project.title,
          description: project.description,
          technologies: JSON.parse(project.technologies || '[]'),
          outcome: project.outcome
        })
      }
    })
    
    // Calculate final metrics for each year
    Object.values(yearlyData).forEach(yearData => {
      yearData.gpa = yearData.totalCredits > 0 ? 
        yearData.weightedGrade / yearData.totalCredits : 0
      yearData.skillsAcquired = Array.from(yearData.skillsAcquired)
      yearData.careerReadiness = this.calculateYearlyReadiness(yearData)
      yearData.keyDevelopments = this.identifyKeyDevelopments(yearData)
    })
    
    return Object.values(yearlyData).sort((a, b) => a.year - b.year)
  }
  
  /**
   * Track evolution of specific skills over time
   */
  trackSkillEvolution(courses, projects) {
    const skillTimeline = {}
    
    // Track through courses
    courses.forEach((course, index) => {
      const year = this.extractYear(course.semester)
      const skills = this.extractSkillsFromCourse(course.course_name)
      
      skills.forEach(skill => {
        if (!skillTimeline[skill]) {
          skillTimeline[skill] = []
        }
        
        skillTimeline[skill].push({
          year,
          source: 'course',
          course: course.course_name,
          grade: course.grade,
          evidence: [`Completed ${course.course_name}`, `Grade: ${course.grade}/30`]
        })
      })
    })
    
    // Track through projects
    projects.forEach(project => {
      const year = new Date(project.created_at).getFullYear()
      const technologies = JSON.parse(project.technologies || '[]')
      
      technologies.forEach(tech => {
        const skill = this.mapTechnologyToSkill(tech)
        if (skill) {
          if (!skillTimeline[skill]) {
            skillTimeline[skill] = []
          }
          
          skillTimeline[skill].push({
            year,
            source: 'project',
            project: project.title,
            evidence: [project.description, project.outcome].filter(Boolean)
          })
        }
      })
    })
    
    // Calculate skill levels for each year
    const skillEvolution = {}
    Object.entries(skillTimeline).forEach(([skill, timeline]) => {
      skillEvolution[skill] = this.calculateSkillProgression(timeline)
    })
    
    return skillEvolution
  }
  
  /**
   * Assess readiness for different job roles
   */
  assessJobReadiness(courses, projects, skillEvolution) {
    const readinessScores = {}
    
    Object.entries(this.jobReadinessCriteria).forEach(([jobTitle, criteria]) => {
      const assessment = this.assessJobRoleReadiness(courses, projects, skillEvolution, criteria)
      readinessScores[jobTitle] = {
        ...assessment,
        timeline: this.estimateReadinessTimeline(assessment, criteria)
      }
    })
    
    return readinessScores
  }
  
  /**
   * Assess readiness for a specific job role
   */
  assessJobRoleReadiness(courses, projects, skillEvolution, criteria) {
    let readinessScore = 0
    const missingSkills = []
    const presentSkills = []
    
    // Check required skills
    criteria.requiredSkills.forEach(requiredSkill => {
      const hasSkill = this.hasSkill(courses, projects, requiredSkill)
      const skillLevel = this.getSkillLevel(skillEvolution, requiredSkill)
      
      if (hasSkill && skillLevel >= criteria.minimumLevel) {
        readinessScore += 30 / criteria.requiredSkills.length // 30% for required skills
        presentSkills.push({
          skill: requiredSkill,
          level: skillLevel,
          evidence: this.getSkillEvidence(courses, projects, requiredSkill)
        })
      } else {
        missingSkills.push({
          skill: requiredSkill,
          current: skillLevel || 'none',
          required: criteria.minimumLevel,
          type: 'required'
        })
      }
    })
    
    // Check preferred skills (bonus points)
    criteria.preferredSkills.forEach(preferredSkill => {
      const hasSkill = this.hasSkill(courses, projects, preferredSkill)
      if (hasSkill) {
        readinessScore += 20 / criteria.preferredSkills.length // 20% for preferred skills
        presentSkills.push({
          skill: preferredSkill,
          level: this.getSkillLevel(skillEvolution, preferredSkill),
          evidence: this.getSkillEvidence(courses, projects, preferredSkill)
        })
      }
    })
    
    // Check project requirements
    const projectScore = this.assessProjectRequirements(projects, criteria.projectRequirements)
    readinessScore += projectScore * 0.3 // 30% for projects
    
    // Experience and portfolio quality (20%)
    const portfolioScore = this.assessPortfolioQuality(projects)
    readinessScore += portfolioScore * 0.2
    
    return {
      currentMatch: Math.min(Math.round(readinessScore), 100),
      presentSkills,
      missingSkills,
      readyForLevel: this.determineReadyLevel(readinessScore),
      projectEvidence: this.getRelevantProjects(projects, criteria.projectRequirements)
    }
  }
  
  /**
   * Generate personalized recommendations
   */
  generateRecommendations(skillEvolution, jobReadiness) {
    const recommendations = []
    
    // Find the job role with highest readiness
    const topJob = Object.entries(jobReadiness)
      .sort(([,a], [,b]) => b.currentMatch - a.currentMatch)[0]
    
    if (topJob && topJob[1].currentMatch >= 70) {
      recommendations.push({
        type: 'career_ready',
        priority: 'high',
        message: `You're ready for ${topJob[0]} roles! Start applying to junior positions.`,
        action: `Search for ${topJob[0]} jobs in your area`
      })
    }
    
    // Skill gap recommendations
    Object.entries(jobReadiness).forEach(([jobTitle, readiness]) => {
      if (readiness.currentMatch >= 60 && readiness.currentMatch < 85) {
        const topMissingSkills = readiness.missingSkills
          .filter(skill => skill.type === 'required')
          .slice(0, 2)
        
        if (topMissingSkills.length > 0) {
          recommendations.push({
            type: 'skill_development',
            priority: 'medium',
            message: `To improve your ${jobTitle} readiness, focus on: ${topMissingSkills.map(s => s.skill).join(', ')}`,
            action: `Build projects demonstrating these skills`
          })
        }
      }
    })
    
    // Project portfolio recommendations
    const projectCount = Object.values(jobReadiness)
      .reduce((sum, job) => sum + job.projectEvidence.length, 0)
    
    if (projectCount < 3) {
      recommendations.push({
        type: 'portfolio_development',
        priority: 'medium',
        message: 'Build more projects to strengthen your portfolio',
        action: 'Create 2-3 projects showcasing different skills'
      })
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }
  
  // Helper methods
  extractYear(semester) {
    const match = semester.match(/(\d{4})/)
    return match ? parseInt(match[1]) : new Date().getFullYear()
  }
  
  extractSkillsFromCourse(courseName) {
    const skillFamily = this.equivalenceEngine.mapCourseToSkills(courseName)
    if (skillFamily) {
      const skillData = this.equivalenceEngine.skillDatabase[skillFamily]
      return skillData ? [...skillData.coreSkills, ...skillData.relatedSkills] : []
    }
    return []
  }
  
  mapTechnologyToSkill(technology) {
    const techMapping = {
      'Python': 'programming',
      'JavaScript': 'web_development',
      'React': 'web_development',
      'Vue': 'web_development',
      'SQL': 'database_systems',
      'TensorFlow': 'machine_learning',
      'PyTorch': 'machine_learning'
    }
    return techMapping[technology] || 'programming'
  }
  
  calculateSkillProgression(timeline) {
    const progression = []
    const yearGroups = {}
    
    // Group by year
    timeline.forEach(entry => {
      if (!yearGroups[entry.year]) {
        yearGroups[entry.year] = []
      }
      yearGroups[entry.year].push(entry)
    })
    
    // Determine skill level for each year
    Object.entries(yearGroups).forEach(([year, entries]) => {
      const level = this.determineSkillLevel(entries)
      progression.push({
        year: parseInt(year),
        level,
        evidence: entries.flatMap(e => e.evidence).slice(0, 3)
      })
    })
    
    return progression.sort((a, b) => a.year - b.year)
  }
  
  determineSkillLevel(entries) {
    // Simple heuristic: more evidence = higher level
    const totalEvidence = entries.reduce((sum, entry) => sum + entry.evidence.length, 0)
    const hasProjects = entries.some(entry => entry.source === 'project')
    const avgGrade = entries
      .filter(entry => entry.grade)
      .reduce((sum, entry, _, arr) => sum + entry.grade / arr.length, 0)
    
    if (totalEvidence >= 6 && hasProjects && avgGrade >= 28) return 'expert'
    if (totalEvidence >= 4 && hasProjects && avgGrade >= 26) return 'advanced'
    if (totalEvidence >= 2 && avgGrade >= 24) return 'intermediate'
    return 'beginner'
  }
  
  hasSkill(courses, projects, skill) {
    // Check if skill appears in courses or projects
    const courseSkills = courses.flatMap(course => this.extractSkillsFromCourse(course.course_name))
    const projectSkills = projects.flatMap(project => 
      JSON.parse(project.technologies || '[]').map(tech => this.mapTechnologyToSkill(tech))
    )
    
    return courseSkills.includes(skill) || projectSkills.includes(skill)
  }
  
  getSkillLevel(skillEvolution, skill) {
    const evolution = skillEvolution[skill]
    if (!evolution || evolution.length === 0) return null
    
    const latestEntry = evolution[evolution.length - 1]
    return latestEntry.level
  }
  
  getSkillEvidence(courses, projects, skill) {
    const evidence = []
    
    // Evidence from courses
    courses.forEach(course => {
      const courseSkills = this.extractSkillsFromCourse(course.course_name)
      if (courseSkills.includes(skill)) {
        evidence.push(`${course.course_name} (${course.grade}/30)`)
      }
    })
    
    // Evidence from projects
    projects.forEach(project => {
      const technologies = JSON.parse(project.technologies || '[]')
      const hasRelevantTech = technologies.some(tech => 
        this.mapTechnologyToSkill(tech) === skill
      )
      if (hasRelevantTech) {
        evidence.push(`Project: ${project.title}`)
      }
    })
    
    return evidence
  }
  
  assessProjectRequirements(projects, requirements) {
    let score = 0
    requirements.forEach(requirement => {
      const hasRequirement = projects.some(project => {
        const description = project.description.toLowerCase()
        const title = project.title.toLowerCase()
        return description.includes(requirement) || title.includes(requirement)
      })
      if (hasRequirement) score += 1 / requirements.length
    })
    return score
  }
  
  assessPortfolioQuality(projects) {
    let score = 0
    projects.forEach(project => {
      if (project.github_url) score += 0.2
      if (project.demo_url) score += 0.2
      if (project.outcome) score += 0.3
      if (project.description && project.description.length > 100) score += 0.1
    })
    return Math.min(score, 1)
  }
  
  determineReadyLevel(score) {
    if (score >= 85) return 'Senior'
    if (score >= 70) return 'Mid-level'
    if (score >= 55) return 'Junior'
    return 'Entry-level with development needed'
  }
  
  getRelevantProjects(projects, requirements) {
    return projects.filter(project => {
      const description = project.description.toLowerCase()
      const title = project.title.toLowerCase()
      return requirements.some(req => 
        description.includes(req.toLowerCase()) || title.includes(req.toLowerCase())
      )
    })
  }
  
  estimateReadinessTimeline(assessment, criteria) {
    const currentScore = assessment.currentMatch
    
    if (currentScore >= 85) return 'Ready now'
    if (currentScore >= 70) return 'Ready in 1-3 months with focused learning'
    if (currentScore >= 55) return 'Ready in 3-6 months with skill development'
    if (currentScore >= 40) return 'Ready in 6-12 months with significant development'
    return 'Needs 12+ months of focused development'
  }
  
  calculateYearlyReadiness(yearData) {
    // Simple heuristic based on GPA, number of courses, and projects
    let readiness = 0
    
    // GPA contribution (40%)
    readiness += (yearData.gpa / 30) * 40
    
    // Course load contribution (30%)
    const normalCourseLoad = 8 // courses per year
    readiness += Math.min(yearData.courses.length / normalCourseLoad, 1) * 30
    
    // Project contribution (30%)
    readiness += Math.min(yearData.projects.length / 2, 1) * 30
    
    return Math.round(readiness)
  }
  
  identifyKeyDevelopments(yearData) {
    const developments = []
    
    if (yearData.gpa >= 28) developments.push('High academic performance')
    if (yearData.projects.length >= 2) developments.push('Strong project portfolio')
    if (yearData.skillsAcquired.length >= 5) developments.push('Diverse skill acquisition')
    if (yearData.courses.some(c => c.grade >= 30)) developments.push('Excellence in specialized areas')
    
    return developments
  }
  
  predictCareerTrajectory(yearlyProgression, skillEvolution) {
    const trajectory = {
      trend: 'improving', // improving, stable, declining
      projectedGraduation: null,
      careerReadinessTrend: [],
      skillGrowthRate: 0,
      recommendations: []
    }
    
    // Calculate GPA trend
    if (yearlyProgression.length >= 2) {
      const recent = yearlyProgression.slice(-2)
      const gpaChange = recent[1].gpa - recent[0].gpa
      
      if (gpaChange > 1) trajectory.trend = 'rapidly_improving'
      else if (gpaChange > 0.5) trajectory.trend = 'improving'
      else if (gpaChange < -0.5) trajectory.trend = 'declining'
      else trajectory.trend = 'stable'
    }
    
    // Track career readiness over time
    trajectory.careerReadinessTrend = yearlyProgression.map(year => ({
      year: year.year,
      readiness: year.careerReadiness
    }))
    
    // Calculate skill growth rate
    const skillCounts = yearlyProgression.map(year => year.skillsAcquired.length)
    trajectory.skillGrowthRate = skillCounts.length >= 2 ? 
      skillCounts[skillCounts.length - 1] - skillCounts[0] : 0
    
    return trajectory
  }
}

module.exports = AcademicProgressionTracker