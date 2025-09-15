const express = require('express')
const router = express.Router()
const { db } = require('../config/database')
const { v4: uuidv4 } = require('uuid')
const { authMiddleware } = require('../middleware/auth')

// Student Profile Routes

// Create or update student academic profile
router.post('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const {
      university,
      degree,
      gpa,
      graduationDate,
      thesisTitle,
      thesisDescription,
      courses,
      projects,
      skills
    } = req.body

    // Check if profile already exists
    const existingProfile = await db('student_profiles')
      .where({ user_id: userId })
      .first()

    const profileData = {
      user_id: userId,
      university,
      degree,
      gpa,
      graduation_date: graduationDate,
      thesis_title: thesisTitle,
      thesis_description: thesisDescription,
      verification_status: 'pending',
      completion_percentage: calculateCompletionPercentage(req.body),
      updated_at: new Date()
    }

    let profileId
    if (existingProfile) {
      await db('student_profiles')
        .where({ user_id: userId })
        .update(profileData)
      profileId = existingProfile.id
    } else {
      profileData.id = uuidv4()
      profileData.created_at = new Date()
      await db('student_profiles').insert(profileData)
      profileId = profileData.id
    }

    // Update courses
    await db('student_courses').where({ profile_id: profileId }).del()
    if (courses && courses.length > 0) {
      const courseData = courses.map(course => ({
        id: uuidv4(),
        profile_id: profileId,
        course_name: course.name,
        grade: course.grade,
        credits: course.credits,
        semester: course.semester,
        professor: course.professor,
        created_at: new Date()
      }))
      await db('student_courses').insert(courseData)
    }

    // Update projects
    await db('student_projects').where({ profile_id: profileId }).del()
    if (projects && projects.length > 0) {
      const projectData = projects.map(project => ({
        id: uuidv4(),
        profile_id: profileId,
        title: project.title,
        description: project.description,
        technologies: JSON.stringify(project.technologies),
        github_url: project.githubUrl,
        demo_url: project.demoUrl,
        outcome: project.outcome,
        linked_courses: JSON.stringify(project.linkedCourses || []),
        created_at: new Date()
      }))
      await db('student_projects').insert(projectData)
    }

    res.json({ 
      message: 'Profile updated successfully',
      profileId,
      completionPercentage: profileData.completion_percentage
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Get student profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    
    const profile = await db('student_profiles')
      .where({ user_id: userId })
      .first()
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    // Get courses
    const courses = await db('student_courses')
      .where({ profile_id: profile.id })
      .orderBy('grade', 'desc')

    // Get projects
    const projects = await db('student_projects')
      .where({ profile_id: profile.id })
      .orderBy('created_at', 'desc')

    // Format projects
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies || '[]'),
      linkedCourses: JSON.parse(project.linked_courses || '[]')
    }))

    // Get verification status
    const verifications = await db('profile_verifications')
      .where({ profile_id: profile.id })
      .orderBy('created_at', 'desc')

    res.json({
      profile: {
        ...profile,
        courses,
        projects: formattedProjects,
        verifications
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Get job opportunities for student
router.get('/opportunities', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    
    // Get student profile and courses
    const profile = await db('student_profiles')
      .where({ user_id: userId })
      .first()
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    const courses = await db('student_courses')
      .where({ profile_id: profile.id })
    
    // Get job postings and calculate matches
    const jobs = await db('job_postings')
      .where({ status: 'active' })
      .orderBy('created_at', 'desc')
    
    const opportunities = []
    
    for (const job of jobs) {
      // Get job requirements
      const requirements = await db('job_course_requirements')
        .where({ job_id: job.id })
      
      const projectRequirements = await db('job_project_requirements')
        .where({ job_id: job.id })
      
      // Calculate match score
      const matchScore = calculateJobMatch(courses, requirements, profile)
      
      if (matchScore >= 60) { // Only show jobs with reasonable match
        opportunities.push({
          ...job,
          matchScore,
          academicRequirements: {
            courses: requirements.map(req => {
              const studentCourse = courses.find(c => 
                c.course_name.toLowerCase().includes(req.course_name.toLowerCase())
              )
              return {
                name: req.course_name,
                minGrade: req.min_grade,
                yourGrade: studentCourse ? studentCourse.grade : null,
                required: req.required
              }
            }),
            projects: projectRequirements
          }
        })
      }
    }
    
    // Sort by match score
    opportunities.sort((a, b) => b.matchScore - a.matchScore)
    
    res.json({ opportunities })
  } catch (error) {
    console.error('Get opportunities error:', error)
    res.status(500).json({ error: 'Failed to get opportunities' })
  }
})

// Express interest in a job
router.post('/opportunities/:jobId/interest', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const { jobId } = req.params
    const { message } = req.body
    
    // Check if already expressed interest
    const existing = await db('job_applications')
      .where({ user_id: userId, job_id: jobId })
      .first()
    
    if (existing) {
      return res.status(400).json({ error: 'Interest already expressed' })
    }
    
    // Create application record
    const application = {
      id: uuidv4(),
      user_id: userId,
      job_id: jobId,
      status: 'interested',
      message: message || '',
      created_at: new Date()
    }
    
    await db('job_applications').insert(application)
    
    // Notify company (in production, this would send an email/notification)
    console.log(`Student ${userId} expressed interest in job ${jobId}`)
    
    res.json({ message: 'Interest expressed successfully' })
  } catch (error) {
    console.error('Express interest error:', error)
    res.status(500).json({ error: 'Failed to express interest' })
  }
})

// Upload transcript
router.post('/transcript', authMiddleware, async (req, res) => {
  try {
    // In production, this would handle file upload to S3/storage
    const userId = req.user.id
    const { filename, fileData } = req.body
    
    const transcript = {
      id: uuidv4(),
      user_id: userId,
      filename,
      file_path: `/transcripts/${userId}/${filename}`,
      verification_status: 'pending',
      uploaded_at: new Date()
    }
    
    await db('student_transcripts').insert(transcript)
    
    res.json({ 
      message: 'Transcript uploaded successfully',
      transcriptId: transcript.id
    })
  } catch (error) {
    console.error('Transcript upload error:', error)
    res.status(500).json({ error: 'Failed to upload transcript' })
  }
})

// Helper functions
function calculateCompletionPercentage(profileData) {
  let score = 0
  const maxScore = 100
  
  // Basic info (30 points)
  if (profileData.university) score += 5
  if (profileData.degree) score += 5
  if (profileData.gpa) score += 10
  if (profileData.graduationDate) score += 5
  if (profileData.thesisTitle) score += 5
  
  // Courses (40 points)
  if (profileData.courses && profileData.courses.length >= 3) score += 20
  if (profileData.courses && profileData.courses.length >= 6) score += 10
  if (profileData.courses && profileData.courses.some(c => c.grade >= 28)) score += 10
  
  // Projects (30 points)
  if (profileData.projects && profileData.projects.length >= 1) score += 10
  if (profileData.projects && profileData.projects.length >= 3) score += 10
  if (profileData.projects && profileData.projects.some(p => p.linkedCourses && p.linkedCourses.length > 0)) score += 10
  
  return Math.min(score, maxScore)
}

function calculateJobMatch(studentCourses, jobRequirements, profile) {
  let score = 0
  let totalRequirements = jobRequirements.length
  
  if (totalRequirements === 0) return 50 // Default score if no requirements
  
  for (const requirement of jobRequirements) {
    const studentCourse = studentCourses.find(course => 
      course.course_name.toLowerCase().includes(requirement.course_name.toLowerCase()) ||
      requirement.course_name.toLowerCase().includes(course.course_name.toLowerCase())
    )
    
    if (studentCourse) {
      if (studentCourse.grade >= requirement.min_grade) {
        score += requirement.required ? 25 : 15 // Higher score for required courses
      } else {
        score += requirement.required ? 10 : 5 // Partial credit if below minimum
      }
    }
  }
  
  // Bonus for high GPA
  if (profile.gpa >= 28) score += 10
  if (profile.gpa >= 29) score += 5
  
  return Math.min(Math.round(score), 100)
}

module.exports = router