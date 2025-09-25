const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Get job recommendations for a student
router.get('/jobs/:studentId', async (req, res) => {
  try {
    const student = await database.findStudentById(req.params.studentId)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found'
      })
    }

    const allJobs = await database.findAllJobs()
    const activeJobs = allJobs.filter(job => job.status === 'active')

    // Calculate match scores
    const jobMatches = activeJobs.map(job => {
      let matchScore = 0
      const reasons = []

      // Skill matching
      const studentSkills = student.skills || []
      const jobSkills = job.skills || []

      studentSkills.forEach(studentSkill => {
        const skillName = typeof studentSkill === 'object' ? studentSkill.name : studentSkill
        jobSkills.forEach(jobSkill => {
          if (jobSkill.toLowerCase().includes(skillName.toLowerCase())) {
            matchScore += 25
            reasons.push(`Skill match: ${skillName}`)
          }
        })
      })

      // Location preferences
      if (job.remote && student.workPreference === 'Remote') {
        matchScore += 15
        reasons.push('Remote work preference match')
      }

      if (job.hybrid && student.workPreference === 'Hybrid') {
        matchScore += 10
        reasons.push('Hybrid work preference match')
      }

      // Level matching
      if (student.year === 'Senior' && job.level === 'Entry-level') {
        matchScore += 15
        reasons.push('Experience level match')
      }

      // Salary expectations
      if (job.salary && student.salaryExpectation) {
        const expectedRange = student.salaryExpectation.match(/\d+/g)
        if (expectedRange && expectedRange.length >= 2) {
          const minExpected = parseInt(expectedRange[0]) * 1000
          const maxExpected = parseInt(expectedRange[1]) * 1000

          if (job.salary.min >= minExpected && job.salary.max <= maxExpected * 1.2) {
            matchScore += 20
            reasons.push('Salary range alignment')
          }
        }
      }

      // Industry/Company interest
      if (student.interests) {
        const jobIndustry = job.company?.industry || ''
        student.interests.forEach(interest => {
          if (jobIndustry.toLowerCase().includes(interest.toLowerCase())) {
            matchScore += 10
            reasons.push(`Industry interest: ${interest}`)
          }
        })
      }

      return {
        ...job,
        matchScore: Math.min(100, matchScore),
        matchReasons: reasons,
        isRecommended: matchScore >= 60
      }
    })

    // Sort by match score
    jobMatches.sort((a, b) => b.matchScore - a.matchScore)

    res.json({
      studentId: student.id,
      matches: jobMatches.slice(0, 20), // Top 20 matches
      totalJobs: activeJobs.length,
      averageMatchScore: jobMatches.reduce((sum, match) => sum + match.matchScore, 0) / jobMatches.length
    })
  } catch (error) {
    console.error('Error getting job matches:', error)
    res.status(500).json({
      error: 'Failed to get job matches',
      message: error.message
    })
  }
})

// Get candidate recommendations for a job
router.get('/candidates/:jobId', async (req, res) => {
  try {
    const job = await database.findJobById(req.params.jobId)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      })
    }

    const allStudents = await database.findAllStudents()

    // Calculate match scores for candidates
    const candidateMatches = allStudents.map(student => {
      let matchScore = 0
      const reasons = []

      // Skill matching
      const studentSkills = student.skills || []
      const jobSkills = job.skills || []

      studentSkills.forEach(studentSkill => {
        const skillName = typeof studentSkill === 'object' ? studentSkill.name : studentSkill
        jobSkills.forEach(jobSkill => {
          if (jobSkill.toLowerCase().includes(skillName.toLowerCase())) {
            matchScore += 25
            reasons.push(`Skill match: ${skillName}`)
          }
        })
      })

      // Experience level
      if (student.year === 'Senior' && job.level === 'Entry-level') {
        matchScore += 15
        reasons.push('Experience level suitable')
      }

      // GPA consideration
      if (student.gpa >= 3.5) {
        matchScore += 10
        reasons.push('High academic performance')
      }

      // AI Score
      if (student.aiScore >= 80) {
        matchScore += 15
        reasons.push('High AI compatibility score')
      }

      // Work preferences
      if ((job.remote && student.workPreference === 'Remote') ||
          (job.hybrid && student.workPreference === 'Hybrid')) {
        matchScore += 10
        reasons.push('Work preference alignment')
      }

      // Major relevance
      const jobTitle = job.title.toLowerCase()
      const studentMajor = (student.major || '').toLowerCase()

      if ((jobTitle.includes('software') || jobTitle.includes('developer')) &&
          (studentMajor.includes('computer') || studentMajor.includes('software'))) {
        matchScore += 20
        reasons.push('Relevant academic background')
      }

      return {
        ...student,
        matchScore: Math.min(100, matchScore),
        matchReasons: reasons,
        isRecommended: matchScore >= 60
      }
    })

    // Sort by match score
    candidateMatches.sort((a, b) => b.matchScore - a.matchScore)

    res.json({
      jobId: job.id,
      jobTitle: job.title,
      matches: candidateMatches.slice(0, 50), // Top 50 candidates
      totalCandidates: allStudents.length,
      averageMatchScore: candidateMatches.reduce((sum, match) => sum + match.matchScore, 0) / candidateMatches.length
    })
  } catch (error) {
    console.error('Error getting candidate matches:', error)
    res.status(500).json({
      error: 'Failed to get candidate matches',
      message: error.message
    })
  }
})

// Get mutual matches (students and jobs that match each other)
router.get('/mutual/:studentId', async (req, res) => {
  try {
    const student = await database.findStudentById(req.params.studentId)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found'
      })
    }

    // Get job recommendations for student
    const jobMatchesResponse = await this.getJobMatches(req.params.studentId)
    const jobMatches = jobMatchesResponse.matches

    // For each job, check if student is in their top candidates
    const mutualMatches = []

    for (const jobMatch of jobMatches.slice(0, 10)) {
      const candidateMatchesResponse = await this.getCandidateMatches(jobMatch.id)
      const topCandidates = candidateMatchesResponse.matches.slice(0, 20)

      const studentInTopCandidates = topCandidates.find(candidate =>
        candidate.id === parseInt(req.params.studentId)
      )

      if (studentInTopCandidates && jobMatch.matchScore >= 70 && studentInTopCandidates.matchScore >= 70) {
        mutualMatches.push({
          job: jobMatch,
          studentMatchScore: jobMatch.matchScore,
          jobMatchScore: studentInTopCandidates.matchScore,
          averageScore: (jobMatch.matchScore + studentInTopCandidates.matchScore) / 2
        })
      }
    }

    res.json({
      studentId: student.id,
      mutualMatches: mutualMatches.sort((a, b) => b.averageScore - a.averageScore),
      totalMutualMatches: mutualMatches.length
    })
  } catch (error) {
    console.error('Error getting mutual matches:', error)
    res.status(500).json({
      error: 'Failed to get mutual matches',
      message: error.message
    })
  }
})

// Helper methods
router.getJobMatches = async function(studentId) {
  // Implementation would call the job matching logic
  return { matches: [] }
}

router.getCandidateMatches = async function(jobId) {
  // Implementation would call the candidate matching logic
  return { matches: [] }
}

module.exports = router