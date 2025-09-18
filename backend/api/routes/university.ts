import express from 'express'
import { authenticateUniversity, validateApiKey } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { rateLimit } from '../middleware/rateLimit'
import { UniversityController } from '../controllers/universityController'

const router = express.Router()
const controller = new UniversityController()

// University API rate limiting
const universityRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each university to 1000 requests per windowMs
  message: 'Too many requests from this university, please try again later.'
})

// Apply rate limiting and authentication to all university routes
router.use(universityRateLimit)

// ============================================================================
// UNIVERSITY REGISTRATION & AUTHENTICATION
// ============================================================================

/**
 * @route POST /api/university/register
 * @desc Register a new university for API access
 * @access Public (but requires admin approval)
 */
router.post('/register',
  validateRequest([
    'name',
    'domain',
    'contactEmail',
    'adminFirstName',
    'adminLastName',
    'studentInformationSystem', // LMS type: canvas, blackboard, moodle, custom
    'expectedStudentCount'
  ]),
  controller.registerUniversity
)

/**
 * @route POST /api/university/auth/token
 * @desc Get API access token for university
 * @access Private (requires API key)
 */
router.post('/auth/token',
  validateApiKey,
  controller.getAccessToken
)

/**
 * @route POST /api/university/auth/refresh
 * @desc Refresh university API token
 * @access Private (requires valid refresh token)
 */
router.post('/auth/refresh',
  controller.refreshToken
)

// ============================================================================
// STUDENT DATA SYNCHRONIZATION
// ============================================================================

/**
 * @route POST /api/university/students/sync
 * @desc Bulk sync student data from university system
 * @access Private (requires university auth)
 */
router.post('/students/sync',
  authenticateUniversity,
  validateRequest(['students']),
  controller.syncStudents
)

/**
 * @route POST /api/university/students/upsert
 * @desc Create or update individual student record
 * @access Private (requires university auth)
 */
router.post('/students/upsert',
  authenticateUniversity,
  validateRequest([
    'studentId',
    'email',
    'firstName',
    'lastName',
    'program',
    'year',
    'status'
  ]),
  controller.upsertStudent
)

/**
 * @route GET /api/university/students
 * @desc Get all students for the university
 * @access Private (requires university auth)
 */
router.get('/students',
  authenticateUniversity,
  controller.getStudents
)

/**
 * @route GET /api/university/students/:studentId
 * @desc Get specific student data
 * @access Private (requires university auth)
 */
router.get('/students/:studentId',
  authenticateUniversity,
  controller.getStudent
)

/**
 * @route PUT /api/university/students/:studentId/status
 * @desc Update student enrollment status
 * @access Private (requires university auth)
 */
router.put('/students/:studentId/status',
  authenticateUniversity,
  validateRequest(['status', 'effective_date']),
  controller.updateStudentStatus
)

// ============================================================================
// ACADEMIC RECORDS & GRADES
// ============================================================================

/**
 * @route POST /api/university/grades/sync
 * @desc Sync grades for students
 * @access Private (requires university auth)
 */
router.post('/grades/sync',
  authenticateUniversity,
  validateRequest(['grades']),
  controller.syncGrades
)

/**
 * @route POST /api/university/transcripts/upload
 * @desc Upload official transcripts
 * @access Private (requires university auth)
 */
router.post('/transcripts/upload',
  authenticateUniversity,
  controller.uploadTranscripts
)

/**
 * @route GET /api/university/grades/:studentId
 * @desc Get grades for a specific student
 * @access Private (requires university auth)
 */
router.get('/grades/:studentId',
  authenticateUniversity,
  controller.getStudentGrades
)

/**
 * @route POST /api/university/courses/sync
 * @desc Sync course catalog with InTransparency
 * @access Private (requires university auth)
 */
router.post('/courses/sync',
  authenticateUniversity,
  validateRequest(['courses']),
  controller.syncCourses
)

// ============================================================================
// PROJECT INTEGRATION
// ============================================================================

/**
 * @route POST /api/university/projects/assign
 * @desc Assign project to student from LMS
 * @access Private (requires university auth)
 */
router.post('/projects/assign',
  authenticateUniversity,
  validateRequest([
    'studentId',
    'courseId',
    'projectTitle',
    'description',
    'dueDate',
    'requirements'
  ]),
  controller.assignProject
)

/**
 * @route POST /api/university/projects/submit
 * @desc Submit project on behalf of student (from LMS integration)
 * @access Private (requires university auth)
 */
router.post('/projects/submit',
  authenticateUniversity,
  validateRequest([
    'studentId',
    'projectId',
    'submissionData',
    'files'
  ]),
  controller.submitProject
)

/**
 * @route GET /api/university/projects/:courseId
 * @desc Get all projects for a course
 * @access Private (requires university auth)
 */
router.get('/projects/:courseId',
  authenticateUniversity,
  controller.getCourseProjects
)

/**
 * @route POST /api/university/projects/:projectId/grade
 * @desc Submit grade for a project
 * @access Private (requires university auth)
 */
router.post('/projects/:projectId/grade',
  authenticateUniversity,
  validateRequest(['grade', 'feedback', 'gradedBy']),
  controller.gradeProject
)

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * @route GET /api/university/analytics/dashboard
 * @desc Get university dashboard analytics
 * @access Private (requires university auth)
 */
router.get('/analytics/dashboard',
  authenticateUniversity,
  controller.getDashboardAnalytics
)

/**
 * @route GET /api/university/analytics/students/performance
 * @desc Get student performance analytics
 * @access Private (requires university auth)
 */
router.get('/analytics/students/performance',
  authenticateUniversity,
  controller.getStudentPerformanceAnalytics
)

/**
 * @route GET /api/university/analytics/employment
 * @desc Get employment outcome analytics
 * @access Private (requires university auth)
 */
router.get('/analytics/employment',
  authenticateUniversity,
  controller.getEmploymentAnalytics
)

/**
 * @route GET /api/university/analytics/skills-gap
 * @desc Get skills gap analysis for curriculum optimization
 * @access Private (requires university auth)
 */
router.get('/analytics/skills-gap',
  authenticateUniversity,
  controller.getSkillsGapAnalysis
)

// ============================================================================
// WEBHOOKS & REAL-TIME INTEGRATION
// ============================================================================

/**
 * @route POST /api/university/webhooks/configure
 * @desc Configure webhooks for real-time updates
 * @access Private (requires university auth)
 */
router.post('/webhooks/configure',
  authenticateUniversity,
  validateRequest(['events', 'endpoint_url', 'secret']),
  controller.configureWebhooks
)

/**
 * @route POST /api/university/webhooks/test
 * @desc Test webhook endpoint
 * @access Private (requires university auth)
 */
router.post('/webhooks/test',
  authenticateUniversity,
  controller.testWebhook
)

/**
 * @route GET /api/university/webhooks/events
 * @desc Get available webhook events
 * @access Private (requires university auth)
 */
router.get('/webhooks/events',
  authenticateUniversity,
  controller.getWebhookEvents
)

// ============================================================================
// LMS INTEGRATION ENDPOINTS
// ============================================================================

/**
 * @route GET /api/university/lms/connect/:platform
 * @desc Connect to specific LMS platform (Canvas, Blackboard, etc.)
 * @access Private (requires university auth)
 */
router.get('/lms/connect/:platform',
  authenticateUniversity,
  controller.connectLMS
)

/**
 * @route POST /api/university/lms/sync
 * @desc Sync data from connected LMS
 * @access Private (requires university auth)
 */
router.post('/lms/sync',
  authenticateUniversity,
  controller.syncFromLMS
)

/**
 * @route GET /api/university/lms/status
 * @desc Check LMS connection status
 * @access Private (requires university auth)
 */
router.get('/lms/status',
  authenticateUniversity,
  controller.getLMSStatus
)

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * @route POST /api/university/bulk/import
 * @desc Bulk import university data (CSV/JSON)
 * @access Private (requires university auth)
 */
router.post('/bulk/import',
  authenticateUniversity,
  controller.bulkImport
)

/**
 * @route GET /api/university/bulk/export
 * @desc Bulk export university data
 * @access Private (requires university auth)
 */
router.get('/bulk/export',
  authenticateUniversity,
  controller.bulkExport
)

/**
 * @route GET /api/university/bulk/template/:type
 * @desc Get import template for bulk operations
 * @access Private (requires university auth)
 */
router.get('/bulk/template/:type',
  authenticateUniversity,
  controller.getBulkTemplate
)

// ============================================================================
// PRIVACY & COMPLIANCE
// ============================================================================

/**
 * @route POST /api/university/privacy/consent
 * @desc Manage student privacy consent
 * @access Private (requires university auth)
 */
router.post('/privacy/consent',
  authenticateUniversity,
  validateRequest(['studentId', 'consentType', 'granted']),
  controller.managePrivacyConsent
)

/**
 * @route GET /api/university/privacy/audit
 * @desc Get privacy audit log
 * @access Private (requires university auth)
 */
router.get('/privacy/audit',
  authenticateUniversity,
  controller.getPrivacyAuditLog
)

/**
 * @route DELETE /api/university/students/:studentId/data
 * @desc Delete student data (GDPR/FERPA compliance)
 * @access Private (requires university auth)
 */
router.delete('/students/:studentId/data',
  authenticateUniversity,
  controller.deleteStudentData
)

export default router