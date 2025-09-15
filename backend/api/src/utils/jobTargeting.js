// InTransparency Job Targeting Algorithm
// Academic + Geographic Precision Targeting

const { db } = require('../config/database')

/**
 * Determines which students should see a specific job posting
 * Based on academic relevance + geographic feasibility
 */
class JobTargetingEngine {
  
  /**
   * Calculate if a job should be visible to a student
   * @param {Object} job - Job posting details
   * @param {Object} student - Student profile
   * @returns {Object} - Visibility decision with score and reasoning
   */
  static determineJobVisibility(job, student) {
    const academicMatch = this.calculateAcademicRelevance(job, student)
    const geographicMatch = this.calculateGeographicRelevance(job, student)
    const experienceMatch = this.calculateExperienceRelevance(job, student)
    
    const overallScore = {
      academic: academicMatch.score,
      geographic: geographicMatch.score,
      experience: experienceMatch.score,
      overall: (academicMatch.score * 0.5 + geographicMatch.score * 0.3 + experienceMatch.score * 0.2)
    }
    
    // Job is visible only if ALL criteria are met
    const isVisible = (
      academicMatch.score >= 70 &&   // Must have relevant academic background
      geographicMatch.score >= 60 && // Must be geographically feasible
      experienceMatch.score >= 50    // Must have some relevant experience/projects
    )
    
    return {
      visible: isVisible,
      scores: overallScore,
      reasoning: {
        academic: academicMatch.reasoning,
        geographic: geographicMatch.reasoning,
        experience: experienceMatch.reasoning
      },
      improvements: this.suggestImprovements(academicMatch, geographicMatch, experienceMatch)
    }
  }
  
  /**
   * Calculate academic relevance score
   */
  static calculateAcademicRelevance(job, student) {
    let score = 0
    const reasoning = []
    
    // Field of Study Match (40 points)
    const studentDegree = student.degree.toLowerCase()
    const requiredFields = job.academic_requirements?.fields_of_study || []
    
    for (const field of requiredFields) {
      if (studentDegree.includes(field.toLowerCase())) {
        score += 40
        reasoning.push(`✓ Degree matches required field: ${field}`)
        break
      }
    }
    
    // Course Match (30 points)
    const studentCourses = student.courses || []
    const requiredCourses = job.academic_requirements?.required_courses || []
    
    let courseMatches = 0
    for (const requiredCourse of requiredCourses) {
      const matchingCourse = studentCourses.find(course => 
        course.course_name.toLowerCase().includes(requiredCourse.toLowerCase()) ||
        requiredCourse.toLowerCase().includes(course.course_name.toLowerCase())
      )
      
      if (matchingCourse) {
        courseMatches++
        score += 30 / requiredCourses.length
        reasoning.push(`✓ Completed course: ${matchingCourse.course_name} (${matchingCourse.grade}/30)`)
      }
    }
    
    // Project Relevance (30 points)
    const studentProjects = student.projects || []
    const requiredProjectTypes = job.academic_requirements?.project_experience || []
    
    let projectMatches = 0
    for (const projectType of requiredProjectTypes) {
      const relevantProject = studentProjects.find(project => {
        const projectText = `${project.title} ${project.description}`.toLowerCase()
        return projectText.includes(projectType.toLowerCase())
      })
      
      if (relevantProject) {
        projectMatches++
        score += 30 / requiredProjectTypes.length
        reasoning.push(`✓ Relevant project: ${relevantProject.title}`)
      }
    }
    
    if (score < 70) {
      reasoning.push(`⚠ Academic match too low (${Math.round(score)}/100) - need stronger field/course/project alignment`)
    }
    
    return { score: Math.min(score, 100), reasoning }
  }
  
  /**
   * Calculate geographic feasibility score
   */
  static calculateGeographicRelevance(job, student) {
    let score = 0
    const reasoning = []
    
    const jobLocation = job.location
    const studentLocation = student.location || student.university_location
    const distance = this.calculateDistance(jobLocation, studentLocation)
    
    // Distance-based scoring
    if (distance <= 20) {
      score += 100
      reasoning.push(`✓ Excellent location match: ${distance}km from job`)
    } else if (distance <= 50) {
      score += 80
      reasoning.push(`✓ Good location match: ${distance}km (reasonable commute)`)
    } else if (distance <= 100) {
      score += 60
      reasoning.push(`◐ Moderate distance: ${distance}km (requires commitment)`)
    } else {
      score += 30
      reasoning.push(`⚠ Long distance: ${distance}km (relocation needed)`)
    }
    
    // Relocation willingness
    const willingToRelocate = student.preferences?.willing_to_relocate
    const interestedCities = student.preferences?.interested_cities || []
    
    if (distance > 50) {
      if (willingToRelocate || interestedCities.includes(jobLocation)) {
        score += 20
        reasoning.push(`✓ Open to relocation or interested in ${jobLocation}`)
      } else {
        score -= 30
        reasoning.push(`⚠ Long distance without relocation interest`)
      }
    }
    
    // Remote work options
    if (job.remote_options && job.remote_options !== 'none') {
      if (student.preferences?.remote_work_interest) {
        score += 15
        reasoning.push(`✓ Remote options available (${job.remote_options})`)
      }
    }
    
    return { score: Math.min(Math.max(score, 0), 100), reasoning }
  }
  
  /**
   * Calculate experience/project relevance
   */
  static calculateExperienceRelevance(job, student) {
    let score = 0
    const reasoning = []
    
    const requiredSkills = job.academic_requirements?.skills_required || []
    const studentProjects = student.projects || []
    
    // Extract skills from student projects
    const studentSkills = new Set()
    studentProjects.forEach(project => {
      const technologies = project.technologies || []
      technologies.forEach(tech => studentSkills.add(tech.toLowerCase()))
    })
    
    // Skills match scoring
    let skillMatches = 0
    for (const skill of requiredSkills) {
      if (studentSkills.has(skill.toLowerCase())) {
        skillMatches++
        score += 80 / requiredSkills.length
        reasoning.push(`✓ Has required skill: ${skill}`)
      }
    }
    
    // Project quality bonus
    const qualityProjects = studentProjects.filter(project => 
      project.github_url || project.demo_url || project.outcome
    )
    
    if (qualityProjects.length >= 2) {
      score += 20
      reasoning.push(`✓ Multiple quality projects with demos/outcomes`)
    } else if (qualityProjects.length >= 1) {
      score += 10
      reasoning.push(`✓ At least one quality project with evidence`)
    }
    
    if (score < 50) {
      reasoning.push(`⚠ Limited relevant experience - consider building projects with required skills`)
    }
    
    return { score: Math.min(score, 100), reasoning }
  }
  
  /**
   * Suggest improvements for students who don't match
   */
  static suggestImprovements(academic, geographic, experience) {
    const suggestions = []
    
    if (academic.score < 70) {
      suggestions.push("Consider taking additional courses in the required field")
      suggestions.push("Build projects that demonstrate skills from your coursework")
    }
    
    if (geographic.score < 60) {
      suggestions.push("Consider updating location preferences if interested in this area")
      suggestions.push("Look for similar roles in your preferred geographic area")
    }
    
    if (experience.score < 50) {
      suggestions.push("Build projects using the required technologies")
      suggestions.push("Add GitHub repositories and demo links to strengthen your portfolio")
    }
    
    return suggestions
  }
  
  /**
   * Calculate distance between two cities (simplified)
   */
  static calculateDistance(city1, city2) {
    // In production, this would use a real geocoding service
    const cityDistances = {
      'Milano-Torino': 140,
      'Milano-Roma': 480,
      'Milano-Firenze': 250,
      'Torino-Milano': 140,
      'Roma-Milano': 480,
      'Firenze-Milano': 250,
      // Add more city pairs as needed
    }
    
    const key1 = `${city1}-${city2}`
    const key2 = `${city2}-${city1}`
    
    return cityDistances[key1] || cityDistances[key2] || 200 // Default distance
  }
  
  /**
   * Find all students who should see a specific job
   */
  static async findTargetedStudents(jobId) {
    try {
      // Get job details with requirements
      const job = await db('job_postings')
        .leftJoin('job_course_requirements', 'job_postings.id', 'job_course_requirements.job_id')
        .where('job_postings.id', jobId)
        .first()
      
      if (!job) return []
      
      // Get all students with complete profiles
      const students = await db('student_profiles')
        .join('users', 'student_profiles.user_id', 'users.id')
        .where('student_profiles.completion_percentage', '>=', 70)
        .where('student_profiles.verification_status', '!=', 'rejected')
        .select(
          'student_profiles.*',
          'users.first_name',
          'users.last_name',
          'users.email'
        )
      
      const targetedStudents = []
      
      for (const student of students) {
        // Get student's courses and projects
        const courses = await db('student_courses')
          .where('profile_id', student.id)
        
        const projects = await db('student_projects')
          .where('profile_id', student.id)
        
        // Enhanced student object
        const enrichedStudent = {
          ...student,
          courses,
          projects: projects.map(p => ({
            ...p,
            technologies: JSON.parse(p.technologies || '[]')
          }))
        }
        
        // Check if job should be visible to this student
        const targeting = this.determineJobVisibility(job, enrichedStudent)
        
        if (targeting.visible) {
          targetedStudents.push({
            student: enrichedStudent,
            matchScore: targeting.scores.overall,
            reasoning: targeting.reasoning
          })
        }
      }
      
      // Sort by match score
      return targetedStudents.sort((a, b) => b.matchScore - a.matchScore)
      
    } catch (error) {
      console.error('Error finding targeted students:', error)
      return []
    }
  }
  
  /**
   * Get visibility statistics for a job posting
   */
  static async getJobVisibilityStats(jobId) {
    try {
      const targetedStudents = await this.findTargetedStudents(jobId)
      
      // Group by university
      const universityBreakdown = {}
      targetedStudents.forEach(item => {
        const uni = item.student.university
        if (!universityBreakdown[uni]) {
          universityBreakdown[uni] = 0
        }
        universityBreakdown[uni]++
      })
      
      // Group by degree
      const degreeBreakdown = {}
      targetedStudents.forEach(item => {
        const degree = item.student.degree
        if (!degreeBreakdown[degree]) {
          degreeBreakdown[degree] = 0
        }
        degreeBreakdown[degree]++
      })
      
      return {
        totalReach: targetedStudents.length,
        averageMatchScore: targetedStudents.length > 0 
          ? targetedStudents.reduce((sum, item) => sum + item.matchScore, 0) / targetedStudents.length 
          : 0,
        universityBreakdown,
        degreeBreakdown,
        topMatches: targetedStudents.slice(0, 10).map(item => ({
          name: `${item.student.first_name} ${item.student.last_name}`,
          university: item.student.university,
          degree: item.student.degree,
          matchScore: Math.round(item.matchScore)
        }))
      }
    } catch (error) {
      console.error('Error getting visibility stats:', error)
      return { totalReach: 0, averageMatchScore: 0, universityBreakdown: {}, degreeBreakdown: {}, topMatches: [] }
    }
  }
}

module.exports = JobTargetingEngine