import express from 'express'
import { authenticateRecruiter, validateApiKey } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { rateLimit } from '../middleware/rateLimit'
import { RecruiterController } from '../controllers/recruiterController'

const router = express.Router()
const controller = new RecruiterController()

// Recruiter API rate limiting
const recruiterRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Higher limit for active recruitment
  message: 'Too many requests from this recruiter, please try again later.'
})

router.use(recruiterRateLimit)

// ============================================================================
// RECRUITER REGISTRATION & AUTHENTICATION
// ============================================================================

/**
 * @route POST /api/recruiter/register
 * @desc Register a new recruiter/company account
 * @access Public
 */
router.post('/register',
  validateRequest([
    'companyName',
    'recruiterEmail',
    'recruiterFirstName',
    'recruiterLastName',
    'companySize',
    'industry'
  ]),
  controller.registerRecruiter
)

/**
 * @route POST /api/recruiter/verify-company
 * @desc Verify company domain and legitimacy
 * @access Private
 */
router.post('/verify-company',
  authenticateRecruiter,
  validateRequest(['companyDomain', 'verificationMethod']),
  controller.verifyCompany
)

// ============================================================================
// STUDENT DISCOVERY & SEARCH
// ============================================================================

/**
 * @route POST /api/recruiter/students/search
 * @desc Advanced search for students across all universities
 * @access Private (requires recruiter auth)
 */
router.post('/students/search',
  authenticateRecruiter,
  validateRequest(['searchCriteria']),
  controller.searchStudents
)

/**
 * @route GET /api/recruiter/students/recommendations
 * @desc Get AI-powered student recommendations for recruiter
 * @access Private
 */
router.get('/students/recommendations',
  authenticateRecruiter,
  controller.getStudentRecommendations
)

/**
 * @route POST /api/recruiter/students/bulk-search
 * @desc Search for multiple student profiles at once
 * @access Private
 */
router.post('/students/bulk-search',
  authenticateRecruiter,
  validateRequest(['searchQueries']),
  controller.bulkSearchStudents
)

/**
 * @route GET /api/recruiter/students/filters/options
 * @desc Get available filter options for student search
 * @access Private
 */
router.get('/students/filters/options',
  authenticateRecruiter,
  controller.getSearchFilterOptions
)

/**
 * @route GET /api/recruiter/students/:studentId/profile
 * @desc View detailed student profile (if student allows)
 * @access Private
 */
router.get('/students/:studentId/profile',
  authenticateRecruiter,
  controller.viewStudentProfile
)

/**
 * @route GET /api/recruiter/students/:studentId/projects
 * @desc View student's projects and portfolio
 * @access Private
 */
router.get('/students/:studentId/projects',
  authenticateRecruiter,
  controller.viewStudentProjects
)

// ============================================================================
// STUDENT CONTACT & OUTREACH
// ============================================================================

/**
 * @route POST /api/recruiter/students/:studentId/contact
 * @desc Send initial contact message to student
 * @access Private
 */
router.post('/students/:studentId/contact',
  authenticateRecruiter,
  validateRequest(['message', 'subject', 'opportunityType']),
  controller.contactStudent
)

/**
 * @route POST /api/recruiter/students/bulk-contact
 * @desc Send personalized messages to multiple students
 * @access Private
 */
router.post('/students/bulk-contact',
  authenticateRecruiter,
  validateRequest(['studentIds', 'messageTemplate', 'personalizations']),
  controller.bulkContactStudents
)

/**
 * @route GET /api/recruiter/conversations
 * @desc Get all conversations with students
 * @access Private
 */
router.get('/conversations',
  authenticateRecruiter,
  controller.getConversations
)

/**
 * @route GET /api/recruiter/conversations/:conversationId
 * @desc Get specific conversation history
 * @access Private
 */
router.get('/conversations/:conversationId',
  authenticateRecruiter,
  controller.getConversation
)

/**
 * @route POST /api/recruiter/conversations/:conversationId/message
 * @desc Send message in existing conversation
 * @access Private
 */
router.post('/conversations/:conversationId/message',
  authenticateRecruiter,
  validateRequest(['message']),
  controller.sendMessage
)

/**
 * @route POST /api/recruiter/students/:studentId/schedule-interview
 * @desc Schedule interview with student
 * @access Private
 */
router.post('/students/:studentId/schedule-interview',
  authenticateRecruiter,
  validateRequest(['interviewType', 'proposedTimes', 'jobRole']),
  controller.scheduleInterview
)

// ============================================================================
// JOB OPPORTUNITIES MANAGEMENT
// ============================================================================

/**
 * @route POST /api/recruiter/jobs
 * @desc Create new job opportunity
 * @access Private
 */
router.post('/jobs',
  authenticateRecruiter,
  validateRequest([
    'title',
    'description',
    'requirements',
    'location',
    'jobType',
    'experienceLevel'
  ]),
  controller.createJob
)

/**
 * @route GET /api/recruiter/jobs
 * @desc Get all jobs posted by recruiter
 * @access Private
 */
router.get('/jobs',
  authenticateRecruiter,
  controller.getRecruiterJobs
)

/**
 * @route PUT /api/recruiter/jobs/:jobId
 * @desc Update job posting
 * @access Private
 */
router.put('/jobs/:jobId',
  authenticateRecruiter,
  controller.updateJob
)

/**
 * @route POST /api/recruiter/jobs/:jobId/target-students
 * @desc Target specific students for a job
 * @access Private
 */
router.post('/jobs/:jobId/target-students',
  authenticateRecruiter,
  validateRequest(['targetingCriteria']),
  controller.targetStudentsForJob
)

/**
 * @route GET /api/recruiter/jobs/:jobId/matches
 * @desc Get AI-matched students for a specific job
 * @access Private
 */
router.get('/jobs/:jobId/matches',
  authenticateRecruiter,
  controller.getJobMatches
)

/**
 * @route POST /api/recruiter/jobs/:jobId/invite-students
 * @desc Directly invite students to apply for job
 * @access Private
 */
router.post('/jobs/:jobId/invite-students',
  authenticateRecruiter,
  validateRequest(['studentIds', 'personalMessage']),
  controller.inviteStudentsToJob
)

// ============================================================================
// APPLICATION MANAGEMENT
// ============================================================================

/**
 * @route GET /api/recruiter/applications
 * @desc Get all applications for recruiter's jobs
 * @access Private
 */
router.get('/applications',
  authenticateRecruiter,
  controller.getApplications
)

/**
 * @route GET /api/recruiter/applications/:applicationId
 * @desc Get detailed application information
 * @access Private
 */
router.get('/applications/:applicationId',
  authenticateRecruiter,
  controller.getApplication
)

/**
 * @route PUT /api/recruiter/applications/:applicationId/status
 * @desc Update application status (screening, interview, offer, etc.)
 * @access Private
 */
router.put('/applications/:applicationId/status',
  authenticateRecruiter,
  validateRequest(['status', 'feedback']),
  controller.updateApplicationStatus
)

/**
 * @route POST /api/recruiter/applications/:applicationId/schedule-interview
 * @desc Schedule interview for applicant
 * @access Private
 */
router.post('/applications/:applicationId/schedule-interview',
  authenticateRecruiter,
  validateRequest(['interviewDetails']),
  controller.scheduleApplicationInterview
)

/**
 * @route POST /api/recruiter/applications/:applicationId/send-offer
 * @desc Send job offer to student
 * @access Private
 */
router.post('/applications/:applicationId/send-offer',
  authenticateRecruiter,
  validateRequest(['offerDetails']),
  controller.sendJobOffer
)

/**
 * @route POST /api/recruiter/applications/bulk-action
 * @desc Perform bulk actions on multiple applications
 * @access Private
 */
router.post('/applications/bulk-action',
  authenticateRecruiter,
  validateRequest(['applicationIds', 'action']),
  controller.bulkApplicationAction
)

// ============================================================================
// TALENT PIPELINE & SOURCING
// ============================================================================

/**
 * @route POST /api/recruiter/talent-pipeline/add-student
 * @desc Add student to talent pipeline for future opportunities
 * @access Private
 */
router.post('/talent-pipeline/add-student',
  authenticateRecruiter,
  validateRequest(['studentId', 'pipelineType', 'notes']),
  controller.addStudentToPipeline
)

/**
 * @route GET /api/recruiter/talent-pipeline
 * @desc Get all students in talent pipeline
 * @access Private
 */
router.get('/talent-pipeline',
  authenticateRecruiter,
  controller.getTalentPipeline
)

/**
 * @route POST /api/recruiter/talent-pipeline/create-campaign
 * @desc Create recruitment campaign targeting specific student segments
 * @access Private
 */
router.post('/talent-pipeline/create-campaign',
  authenticateRecruiter,
  validateRequest(['campaignName', 'targetSegment', 'message']),
  controller.createRecruitmentCampaign
)

/**
 * @route GET /api/recruiter/talent-pipeline/campaigns
 * @desc Get all recruitment campaigns
 * @access Private
 */
router.get('/talent-pipeline/campaigns',
  authenticateRecruiter,
  controller.getRecruitmentCampaigns
)

/**
 * @route POST /api/recruiter/students/:studentId/follow
 * @desc Follow student for updates (with their consent)
 * @access Private
 */
router.post('/students/:studentId/follow',
  authenticateRecruiter,
  controller.followStudent
)

/**
 * @route DELETE /api/recruiter/students/:studentId/follow
 * @desc Unfollow student
 * @access Private
 */
router.delete('/students/:studentId/follow',
  authenticateRecruiter,
  controller.unfollowStudent
)

// ============================================================================
// UNIVERSITY PARTNERSHIPS
// ============================================================================

/**
 * @route GET /api/recruiter/universities
 * @desc Get list of partner universities
 * @access Private
 */
router.get('/universities',
  authenticateRecruiter,
  controller.getPartnerUniversities
)

/**
 * @route POST /api/recruiter/universities/:universityId/partnership
 * @desc Request partnership with university
 * @access Private
 */
router.post('/universities/:universityId/partnership',
  authenticateRecruiter,
  validateRequest(['partnershipType', 'proposal']),
  controller.requestUniversityPartnership
)

/**
 * @route GET /api/recruiter/universities/:universityId/students
 * @desc Get students from specific university (if partnership exists)
 * @access Private
 */
router.get('/universities/:universityId/students',
  authenticateRecruiter,
  controller.getUniversityStudents
)

/**
 * @route POST /api/recruiter/universities/:universityId/campus-event
 * @desc Schedule campus recruitment event
 * @access Private
 */
router.post('/universities/:universityId/campus-event',
  authenticateRecruiter,
  validateRequest(['eventDetails']),
  controller.scheduleCampusEvent
)

// ============================================================================
// ANALYTICS & INSIGHTS
// ============================================================================

/**
 * @route GET /api/recruiter/analytics/dashboard
 * @desc Get recruiter dashboard analytics
 * @access Private
 */
router.get('/analytics/dashboard',
  authenticateRecruiter,
  controller.getRecruiterAnalytics
)

/**
 * @route GET /api/recruiter/analytics/sourcing-performance
 * @desc Get sourcing performance metrics
 * @access Private
 */
router.get('/analytics/sourcing-performance',
  authenticateRecruiter,
  controller.getSourcingPerformance
)

/**
 * @route GET /api/recruiter/analytics/candidate-quality
 * @desc Get candidate quality metrics
 * @access Private
 */
router.get('/analytics/candidate-quality',
  authenticateRecruiter,
  controller.getCandidateQuality
)

/**
 * @route GET /api/recruiter/analytics/market-insights
 * @desc Get talent market insights and trends
 * @access Private
 */
router.get('/analytics/market-insights',
  authenticateRecruiter,
  controller.getMarketInsights
)

/**
 * @route GET /api/recruiter/analytics/competition
 * @desc Get competitive recruitment intelligence
 * @access Private
 */
router.get('/analytics/competition',
  authenticateRecruiter,
  controller.getCompetitiveIntelligence
)

// ============================================================================
// COMPLIANCE & PRIVACY
// ============================================================================

/**
 * @route GET /api/recruiter/privacy/student-consent/:studentId
 * @desc Check student's privacy consent settings
 * @access Private
 */
router.get('/privacy/student-consent/:studentId',
  authenticateRecruiter,
  controller.checkStudentConsent
)

/**
 * @route POST /api/recruiter/privacy/request-consent
 * @desc Request additional consent from student
 * @access Private
 */
router.post('/privacy/request-consent',
  authenticateRecruiter,
  validateRequest(['studentId', 'consentType', 'reason']),
  controller.requestStudentConsent
)

/**
 * @route GET /api/recruiter/compliance/audit-log
 * @desc Get compliance audit log for recruiter actions
 * @access Private
 */
router.get('/compliance/audit-log',
  authenticateRecruiter,
  controller.getComplianceAuditLog
)

/**
 * @route POST /api/recruiter/compliance/report-issue
 * @desc Report compliance or ethical issue
 * @access Private
 */
router.post('/compliance/report-issue',
  authenticateRecruiter,
  validateRequest(['issueType', 'description']),
  controller.reportComplianceIssue
)

// ============================================================================
// INTEGRATION & AUTOMATION
// ============================================================================

/**
 * @route POST /api/recruiter/integrations/ats/connect
 * @desc Connect external ATS (Applicant Tracking System)
 * @access Private
 */
router.post('/integrations/ats/connect',
  authenticateRecruiter,
  validateRequest(['atsProvider', 'credentials']),
  controller.connectATS
)

/**
 * @route POST /api/recruiter/integrations/ats/sync
 * @desc Sync data with connected ATS
 * @access Private
 */
router.post('/integrations/ats/sync',
  authenticateRecruiter,
  controller.syncWithATS
)

/**
 * @route POST /api/recruiter/automation/create-workflow
 * @desc Create automated recruitment workflow
 * @access Private
 */
router.post('/automation/create-workflow',
  authenticateRecruiter,
  validateRequest(['workflowName', 'triggers', 'actions']),
  controller.createAutomationWorkflow
)

/**
 * @route GET /api/recruiter/automation/workflows
 * @desc Get all automation workflows
 * @access Private
 */
router.get('/automation/workflows',
  authenticateRecruiter,
  controller.getAutomationWorkflows
)

// ============================================================================
// PREMIUM FEATURES
// ============================================================================

/**
 * @route POST /api/recruiter/premium/ai-screening
 * @desc Use AI to screen student profiles
 * @access Private (Premium)
 */
router.post('/premium/ai-screening',
  authenticateRecruiter,
  validateRequest(['jobRequirements', 'candidateProfiles']),
  controller.aiScreeningService
)

/**
 * @route POST /api/recruiter/premium/talent-insights
 * @desc Get deep talent insights and predictions
 * @access Private (Premium)
 */
router.post('/premium/talent-insights',
  authenticateRecruiter,
  validateRequest(['analysisType', 'parameters']),
  controller.getTalentInsights
)

/**
 * @route POST /api/recruiter/premium/market-intelligence
 * @desc Get advanced market intelligence reports
 * @access Private (Premium)
 */
router.post('/premium/market-intelligence',
  authenticateRecruiter,
  validateRequest(['reportType', 'parameters']),
  controller.getMarketIntelligence
)

/**
 * @route GET /api/recruiter/premium/features
 * @desc Get available premium features
 * @access Private
 */
router.get('/premium/features',
  authenticateRecruiter,
  controller.getPremiumFeatures
)

export default router