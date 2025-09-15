const express = require('express')
const router = express.Router()
const { db } = require('../config/database')
const { v4: uuidv4 } = require('uuid')
const { authMiddleware } = require('../middleware/auth')

// Company Routes for MVP

// Search students by academic criteria
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const {
      query,
      university,
      degree,
      minGpa,
      maxGpa,
      graduationYear,
      courses,
      skills,
      verified,
      limit = 20,
      offset = 0
    } = req.query

    let studentsQuery = db('student_profiles')
      .join('users', 'student_profiles.user_id', 'users.id')
      .select(
        'student_profiles.*',
        'users.first_name',
        'users.last_name',
        'users.email'
      )
      .where('student_profiles.verification_status', verified === 'true' ? 'verified' : 'pending')
      .andWhere('student_profiles.completion_percentage', '>=', 70)

    // Apply filters
    if (university) {
      studentsQuery = studentsQuery.whereILike('university', `%${university}%`)
    }
    
    if (degree) {
      studentsQuery = studentsQuery.whereILike('degree', `%${degree}%`)
    }
    
    if (minGpa) {
      studentsQuery = studentsQuery.where('gpa', '>=', parseFloat(minGpa))
    }
    
    if (maxGpa) {
      studentsQuery = studentsQuery.where('gpa', '<=', parseFloat(maxGpa))
    }
    
    if (graduationYear) {
      studentsQuery = studentsQuery.whereRaw(
        'EXTRACT(YEAR FROM graduation_date) = ?', 
        [parseInt(graduationYear)]
      )
    }

    const students = await studentsQuery
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .orderBy('gpa', 'desc')

    // Get courses and projects for each student
    const enrichedStudents = await Promise.all(
      students.map(async (student) => {
        const studentCourses = await db('student_courses')
          .where({ profile_id: student.id })
          .orderBy('grade', 'desc')
          .limit(5)

        const studentProjects = await db('student_projects')
          .where({ profile_id: student.id })
          .orderBy('created_at', 'desc')
          .limit(3)

        const professorEndorsements = await db('professor_endorsements')
          .where({ profile_id: student.id })
          .count('* as count')

        // Calculate match score if search query provided
        let matchScore = 100
        if (query) {
          matchScore = calculateSearchMatch(query, student, studentCourses, studentProjects)
        }

        return {
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          university: student.university,
          degree: student.degree,
          gpa: student.gpa,
          graduationDate: student.graduation_date,
          topCourses: studentCourses.map(course => ({
            name: course.course_name,
            grade: course.grade
          })),
          projects: studentProjects.length,
          skills: extractSkillsFromProjects(studentProjects),
          verified: student.verification_status === 'verified',
          professorEndorsements: parseInt(professorEndorsements[0].count),
          matchScore
        }
      })
    )

    // Sort by match score if search query provided
    if (query) {
      enrichedStudents.sort((a, b) => b.matchScore - a.matchScore)
    }

    res.json({
      candidates: enrichedStudents,
      total: students.length,
      searchAnalytics: {
        totalResults: enrichedStudents.length,
        averageGpa: enrichedStudents.reduce((sum, s) => sum + s.gpa, 0) / enrichedStudents.length,
        topUniversities: [...new Set(enrichedStudents.map(s => s.university))].slice(0, 5),
        commonSkills: getTopSkills(enrichedStudents)
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ error: 'Failed to search candidates' })
  }
})

// Get detailed candidate profile
router.get('/candidates/:candidateId', authMiddleware, async (req, res) => {
  try {
    const { candidateId } = req.params
    
    const student = await db('student_profiles')
      .join('users', 'student_profiles.user_id', 'users.id')
      .select(
        'student_profiles.*',
        'users.first_name',
        'users.last_name',
        'users.email'
      )
      .where('student_profiles.id', candidateId)
      .first()
    
    if (!student) {
      return res.status(404).json({ error: 'Candidate not found' })
    }

    // Get full academic data
    const courses = await db('student_courses')
      .where({ profile_id: candidateId })
      .orderBy('grade', 'desc')

    const projects = await db('student_projects')
      .where({ profile_id: candidateId })
      .orderBy('created_at', 'desc')

    const endorsements = await db('professor_endorsements')
      .where({ profile_id: candidateId })

    const verifications = await db('profile_verifications')
      .where({ profile_id: candidateId })
      .orderBy('verified_at', 'desc')

    // Track view (for analytics)
    await trackCandidateView(req.user.id, candidateId)

    res.json({
      candidate: {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        university: student.university,
        degree: student.degree,
        gpa: student.gpa,
        graduationDate: student.graduation_date,
        thesisTitle: student.thesis_title,
        thesisDescription: student.thesis_description,
        verificationStatus: student.verification_status,
        courses: courses.map(course => ({
          name: course.course_name,
          grade: course.grade,
          credits: course.credits,
          semester: course.semester,
          professor: course.professor
        })),
        projects: projects.map(project => ({
          title: project.title,
          description: project.description,
          technologies: JSON.parse(project.technologies || '[]'),
          githubUrl: project.github_url,
          demoUrl: project.demo_url,
          outcome: project.outcome,
          linkedCourses: JSON.parse(project.linked_courses || '[]')
        })),
        endorsements: endorsements.map(endorsement => ({
          professor: endorsement.professor_name,
          course: endorsement.course_name,
          comment: endorsement.comment,
          rating: endorsement.rating
        })),
        verifications
      }
    })
  } catch (error) {
    console.error('Get candidate error:', error)
    res.status(500).json({ error: 'Failed to get candidate details' })
  }
})

// Create smart job posting
router.post('/jobs', authMiddleware, async (req, res) => {
  try {
    const companyId = req.user.id
    const {
      title,
      description,
      location,
      salaryRange,
      jobType,
      courseRequirements,
      projectRequirements,
      autoMatch
    } = req.body

    // Create job posting
    const jobId = uuidv4()
    const job = {
      id: jobId,
      company_id: companyId,
      title,
      description,
      location,
      salary_range: salaryRange,
      job_type: jobType,
      status: 'active',
      auto_match_enabled: autoMatch || true,
      created_at: new Date()
    }

    await db('job_postings').insert(job)

    // Add course requirements
    if (courseRequirements && courseRequirements.length > 0) {
      const courseData = courseRequirements.map(course => ({
        id: uuidv4(),
        job_id: jobId,
        course_name: course.name,
        min_grade: course.minGrade,
        required: course.required,
        created_at: new Date()
      }))
      await db('job_course_requirements').insert(courseData)
    }

    // Add project requirements
    if (projectRequirements && projectRequirements.length > 0) {
      const projectData = projectRequirements.map(project => ({
        id: uuidv4(),
        job_id: jobId,
        project_type: project.type,
        description: project.description,
        technologies: JSON.stringify(project.technologies || []),
        created_at: new Date()
      }))
      await db('job_project_requirements').insert(projectData)
    }

    // Find matching candidates (for preview)
    const matchingCandidates = await findMatchingCandidates(jobId)

    res.json({
      message: 'Job posting created successfully',
      jobId,
      matchingCandidates: matchingCandidates.length,
      topMatches: matchingCandidates.slice(0, 5)
    })
  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ error: 'Failed to create job posting' })
  }
})

// Send interview invitation
router.post('/candidates/:candidateId/invite', authMiddleware, async (req, res) => {
  try {
    const companyId = req.user.id
    const { candidateId } = req.params
    const { 
      position,
      message,
      interviewType,
      proposedDates 
    } = req.body

    // Get candidate info
    const candidate = await db('student_profiles')
      .join('users', 'student_profiles.user_id', 'users.id')
      .select('users.email', 'users.first_name')
      .where('student_profiles.id', candidateId)
      .first()

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' })
    }

    // Create invitation record
    const invitationId = uuidv4()
    const invitation = {
      id: invitationId,
      company_id: companyId,
      candidate_id: candidateId,
      position,
      message,
      interview_type: interviewType,
      proposed_dates: JSON.stringify(proposedDates || []),
      status: 'sent',
      created_at: new Date()
    }

    await db('interview_invitations').insert(invitation)

    // In production, send email notification
    console.log(`Interview invitation sent to ${candidate.email} for position ${position}`)

    res.json({
      message: 'Interview invitation sent successfully',
      invitationId
    })
  } catch (error) {
    console.error('Send invitation error:', error)
    res.status(500).json({ error: 'Failed to send invitation' })
  }
})

// Get company's job postings
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    const companyId = req.user.id
    
    const jobs = await db('job_postings')
      .where({ company_id: companyId })
      .orderBy('created_at', 'desc')

    // Get metrics for each job
    const jobsWithMetrics = await Promise.all(
      jobs.map(async (job) => {
        const applications = await db('job_applications')
          .where({ job_id: job.id })
          .count('* as count')

        const views = await db('job_views')
          .where({ job_id: job.id })
          .count('* as count')

        return {
          ...job,
          applications: parseInt(applications[0].count),
          views: parseInt(views[0].count)
        }
      })
    )

    res.json({ jobs: jobsWithMetrics })
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ error: 'Failed to get job postings' })
  }
})

// Helper functions
function calculateSearchMatch(query, student, courses, projects) {
  let score = 0
  const queryTerms = query.toLowerCase().split(' ')
  
  // Match against degree
  for (const term of queryTerms) {
    if (student.degree.toLowerCase().includes(term)) {
      score += 20
    }
  }
  
  // Match against courses
  for (const course of courses) {
    for (const term of queryTerms) {
      if (course.course_name.toLowerCase().includes(term)) {
        score += 15
      }
    }
  }
  
  // Match against project technologies
  for (const project of projects) {
    const technologies = JSON.parse(project.technologies || '[]')
    for (const tech of technologies) {
      for (const term of queryTerms) {
        if (tech.toLowerCase().includes(term)) {
          score += 10
        }
      }
    }
  }
  
  return Math.min(score, 100)
}

function extractSkillsFromProjects(projects) {
  const skills = new Set()
  
  for (const project of projects) {
    const technologies = JSON.parse(project.technologies || '[]')
    technologies.forEach(tech => skills.add(tech))
  }
  
  return Array.from(skills).slice(0, 6)
}

function getTopSkills(students) {
  const skillCounts = {}
  
  students.forEach(student => {
    student.skills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
    })
  })
  
  return Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([skill]) => skill)
}

async function findMatchingCandidates(jobId) {
  // This would implement the actual matching algorithm
  // For MVP, return a simplified version
  const courseRequirements = await db('job_course_requirements')
    .where({ job_id: jobId })
  
  if (courseRequirements.length === 0) {
    return []
  }
  
  // Find students with matching courses
  const matchingStudents = await db('student_profiles')
    .join('student_courses', 'student_profiles.id', 'student_courses.profile_id')
    .whereIn('student_courses.course_name', courseRequirements.map(r => r.course_name))
    .where('student_profiles.verification_status', 'verified')
    .distinct('student_profiles.id')
    .select('student_profiles.*')
    .limit(20)
  
  return matchingStudents
}

async function trackCandidateView(companyId, candidateId) {
  try {
    await db('candidate_views').insert({
      id: uuidv4(),
      company_id: companyId,
      candidate_id: candidateId,
      viewed_at: new Date()
    })
  } catch (error) {
    console.error('Track view error:', error)
  }
}

module.exports = router