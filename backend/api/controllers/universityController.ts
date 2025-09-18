import { Request, Response } from 'express'
import { UniversityService } from '../services/universityService'
import { StudentService } from '../services/studentService'
import { ProjectService } from '../services/projectService'
import { AnalyticsService } from '../services/analyticsService'
import { WebhookService } from '../services/webhookService'
import { LMSIntegrationService } from '../services/lmsIntegrationService'
import { PrivacyService } from '../services/privacyService'
import { logger } from '../utils/logger'

export class UniversityController {
  private universityService: UniversityService
  private studentService: StudentService
  private projectService: ProjectService
  private analyticsService: AnalyticsService
  private webhookService: WebhookService
  private lmsIntegrationService: LMSIntegrationService
  private privacyService: PrivacyService

  constructor() {
    this.universityService = new UniversityService()
    this.studentService = new StudentService()
    this.projectService = new ProjectService()
    this.analyticsService = new AnalyticsService()
    this.webhookService = new WebhookService()
    this.lmsIntegrationService = new LMSIntegrationService()
    this.privacyService = new PrivacyService()
  }

  // ============================================================================
  // UNIVERSITY REGISTRATION & AUTHENTICATION
  // ============================================================================

  /**
   * Register a new university for API access
   */
  registerUniversity = async (req: Request, res: Response) => {
    try {
      const {
        name,
        domain,
        contactEmail,
        adminFirstName,
        adminLastName,
        studentInformationSystem,
        expectedStudentCount,
        address,
        phone
      } = req.body

      const registration = await this.universityService.registerUniversity({
        name,
        domain,
        contactEmail,
        adminFirstName,
        adminLastName,
        studentInformationSystem,
        expectedStudentCount,
        address,
        phone
      })

      logger.info(`University registration request: ${name} (${domain})`)

      res.status(201).json({
        success: true,
        message: 'University registration submitted successfully. You will receive API credentials once approved.',
        registrationId: registration.id,
        status: registration.status,
        estimatedApprovalTime: '1-2 business days'
      })
    } catch (error: any) {
      logger.error('University registration error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to register university'
      })
    }
  }

  /**
   * Get API access token for university
   */
  getAccessToken = async (req: Request, res: Response) => {
    try {
      const { universityId, apiKey } = req.body

      const tokenData = await this.universityService.generateAccessToken(universityId, apiKey)

      res.json({
        success: true,
        access_token: tokenData.accessToken,
        refresh_token: tokenData.refreshToken,
        token_type: 'Bearer',
        expires_in: tokenData.expiresIn,
        scope: tokenData.scope
      })
    } catch (error: any) {
      logger.error('Token generation error:', error)
      res.status(401).json({
        success: false,
        error: error.message || 'Failed to generate access token'
      })
    }
  }

  /**
   * Refresh university API token
   */
  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refresh_token } = req.body

      const tokenData = await this.universityService.refreshAccessToken(refresh_token)

      res.json({
        success: true,
        access_token: tokenData.accessToken,
        refresh_token: tokenData.refreshToken,
        token_type: 'Bearer',
        expires_in: tokenData.expiresIn
      })
    } catch (error: any) {
      logger.error('Token refresh error:', error)
      res.status(401).json({
        success: false,
        error: error.message || 'Failed to refresh token'
      })
    }
  }

  // ============================================================================
  // STUDENT DATA SYNCHRONIZATION
  // ============================================================================

  /**
   * Bulk sync student data from university system
   */
  syncStudents = async (req: Request, res: Response) => {
    try {
      const { students } = req.body
      const universityId = req.university?.id

      const result = await this.studentService.bulkSyncStudents(universityId, students)

      res.json({
        success: true,
        message: 'Student sync completed',
        summary: {
          total: students.length,
          created: result.created,
          updated: result.updated,
          errors: result.errors,
          skipped: result.skipped
        },
        details: result.details
      })
    } catch (error: any) {
      logger.error('Student sync error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to sync students'
      })
    }
  }

  /**
   * Create or update individual student record
   */
  upsertStudent = async (req: Request, res: Response) => {
    try {
      const studentData = req.body
      const universityId = req.university?.id

      const student = await this.studentService.upsertStudent({
        ...studentData,
        universityId
      })

      res.json({
        success: true,
        message: student.isNew ? 'Student created successfully' : 'Student updated successfully',
        student: {
          id: student.id,
          studentId: student.studentId,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          status: student.status,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt
        }
      })
    } catch (error: any) {
      logger.error('Student upsert error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create/update student'
      })
    }
  }

  /**
   * Get all students for the university
   */
  getStudents = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id
      const { page = 1, limit = 50, search, program, year, status } = req.query

      const result = await this.studentService.getUniversityStudents(universityId, {
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        program: program as string,
        year: year as string,
        status: status as string
      })

      res.json({
        success: true,
        students: result.students,
        pagination: {
          current_page: result.currentPage,
          total_pages: result.totalPages,
          total_students: result.totalStudents,
          per_page: result.perPage
        }
      })
    } catch (error: any) {
      logger.error('Get students error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve students'
      })
    }
  }

  /**
   * Get specific student data
   */
  getStudent = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const universityId = req.university?.id

      const student = await this.studentService.getStudentByUniversity(universityId, studentId)

      if (!student) {
        return res.status(404).json({
          success: false,
          error: 'Student not found'
        })
      }

      res.json({
        success: true,
        student
      })
    } catch (error: any) {
      logger.error('Get student error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve student'
      })
    }
  }

  /**
   * Update student enrollment status
   */
  updateStudentStatus = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { status, effective_date, reason } = req.body
      const universityId = req.university?.id

      const result = await this.studentService.updateStudentStatus(
        universityId,
        studentId,
        status,
        effective_date,
        reason
      )

      res.json({
        success: true,
        message: 'Student status updated successfully',
        student: result
      })
    } catch (error: any) {
      logger.error('Update student status error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update student status'
      })
    }
  }

  // ============================================================================
  // ACADEMIC RECORDS & GRADES
  // ============================================================================

  /**
   * Sync grades for students
   */
  syncGrades = async (req: Request, res: Response) => {
    try {
      const { grades } = req.body
      const universityId = req.university?.id

      const result = await this.studentService.syncGrades(universityId, grades)

      res.json({
        success: true,
        message: 'Grades synced successfully',
        summary: {
          total: grades.length,
          processed: result.processed,
          errors: result.errors
        }
      })
    } catch (error: any) {
      logger.error('Sync grades error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to sync grades'
      })
    }
  }

  /**
   * Upload official transcripts
   */
  uploadTranscripts = async (req: Request, res: Response) => {
    try {
      const { transcripts } = req.body
      const universityId = req.university?.id

      const result = await this.studentService.uploadTranscripts(universityId, transcripts)

      res.json({
        success: true,
        message: 'Transcripts uploaded successfully',
        processed: result.processed
      })
    } catch (error: any) {
      logger.error('Upload transcripts error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to upload transcripts'
      })
    }
  }

  /**
   * Get grades for a specific student
   */
  getStudentGrades = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const universityId = req.university?.id
      const { semester, year } = req.query

      const grades = await this.studentService.getStudentGrades(universityId, studentId, {
        semester: semester as string,
        year: year as string
      })

      res.json({
        success: true,
        grades
      })
    } catch (error: any) {
      logger.error('Get student grades error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve student grades'
      })
    }
  }

  /**
   * Sync course catalog with InTransparency
   */
  syncCourses = async (req: Request, res: Response) => {
    try {
      const { courses } = req.body
      const universityId = req.university?.id

      const result = await this.universityService.syncCourses(universityId, courses)

      res.json({
        success: true,
        message: 'Courses synced successfully',
        summary: result
      })
    } catch (error: any) {
      logger.error('Sync courses error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to sync courses'
      })
    }
  }

  // ============================================================================
  // PROJECT INTEGRATION
  // ============================================================================

  /**
   * Assign project to student from LMS
   */
  assignProject = async (req: Request, res: Response) => {
    try {
      const projectData = req.body
      const universityId = req.university?.id

      const project = await this.projectService.assignProjectFromUniversity({
        ...projectData,
        universityId
      })

      res.json({
        success: true,
        message: 'Project assigned successfully',
        project: {
          id: project.id,
          title: project.title,
          studentId: project.studentId,
          courseId: project.courseId,
          dueDate: project.dueDate,
          status: project.status
        }
      })
    } catch (error: any) {
      logger.error('Assign project error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to assign project'
      })
    }
  }

  /**
   * Submit project on behalf of student (from LMS integration)
   */
  submitProject = async (req: Request, res: Response) => {
    try {
      const { studentId, projectId, submissionData, files } = req.body
      const universityId = req.university?.id

      const submission = await this.projectService.submitProjectFromUniversity(
        universityId,
        studentId,
        projectId,
        submissionData,
        files
      )

      res.json({
        success: true,
        message: 'Project submitted successfully',
        submission
      })
    } catch (error: any) {
      logger.error('Submit project error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to submit project'
      })
    }
  }

  /**
   * Get all projects for a course
   */
  getCourseProjects = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params
      const universityId = req.university?.id

      const projects = await this.projectService.getCourseProjects(universityId, courseId)

      res.json({
        success: true,
        projects
      })
    } catch (error: any) {
      logger.error('Get course projects error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve course projects'
      })
    }
  }

  /**
   * Submit grade for a project
   */
  gradeProject = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params
      const { grade, feedback, gradedBy } = req.body
      const universityId = req.university?.id

      const result = await this.projectService.gradeProject(
        universityId,
        projectId,
        grade,
        feedback,
        gradedBy
      )

      res.json({
        success: true,
        message: 'Project graded successfully',
        grade: result
      })
    } catch (error: any) {
      logger.error('Grade project error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to grade project'
      })
    }
  }

  // ============================================================================
  // ANALYTICS & REPORTING
  // ============================================================================

  /**
   * Get university dashboard analytics
   */
  getDashboardAnalytics = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id
      const { timeframe = '30d' } = req.query

      const analytics = await this.analyticsService.getUniversityDashboard(
        universityId,
        timeframe as string
      )

      res.json({
        success: true,
        analytics
      })
    } catch (error: any) {
      logger.error('Get dashboard analytics error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve analytics'
      })
    }
  }

  /**
   * Get student performance analytics
   */
  getStudentPerformanceAnalytics = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id
      const { program, year, semester } = req.query

      const analytics = await this.analyticsService.getStudentPerformance(universityId, {
        program: program as string,
        year: year as string,
        semester: semester as string
      })

      res.json({
        success: true,
        analytics
      })
    } catch (error: any) {
      logger.error('Get student performance analytics error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve student performance analytics'
      })
    }
  }

  /**
   * Get employment outcome analytics
   */
  getEmploymentAnalytics = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id
      const { graduationYear, program } = req.query

      const analytics = await this.analyticsService.getEmploymentOutcomes(universityId, {
        graduationYear: graduationYear as string,
        program: program as string
      })

      res.json({
        success: true,
        analytics
      })
    } catch (error: any) {
      logger.error('Get employment analytics error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve employment analytics'
      })
    }
  }

  /**
   * Get skills gap analysis for curriculum optimization
   */
  getSkillsGapAnalysis = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id
      const { program, industry } = req.query

      const analysis = await this.analyticsService.getSkillsGapAnalysis(universityId, {
        program: program as string,
        industry: industry as string
      })

      res.json({
        success: true,
        analysis
      })
    } catch (error: any) {
      logger.error('Get skills gap analysis error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve skills gap analysis'
      })
    }
  }

  // ============================================================================
  // WEBHOOKS & REAL-TIME INTEGRATION
  // ============================================================================

  /**
   * Configure webhooks for real-time updates
   */
  configureWebhooks = async (req: Request, res: Response) => {
    try {
      const { events, endpoint_url, secret } = req.body
      const universityId = req.university?.id

      const webhook = await this.webhookService.configureWebhook(universityId, {
        events,
        endpointUrl: endpoint_url,
        secret
      })

      res.json({
        success: true,
        message: 'Webhook configured successfully',
        webhook: {
          id: webhook.id,
          events: webhook.events,
          endpoint_url: webhook.endpointUrl,
          status: webhook.status,
          created_at: webhook.createdAt
        }
      })
    } catch (error: any) {
      logger.error('Configure webhook error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to configure webhook'
      })
    }
  }

  /**
   * Test webhook endpoint
   */
  testWebhook = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id
      const { webhook_id } = req.body

      const result = await this.webhookService.testWebhook(universityId, webhook_id)

      res.json({
        success: true,
        message: 'Webhook test completed',
        result
      })
    } catch (error: any) {
      logger.error('Test webhook error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to test webhook'
      })
    }
  }

  /**
   * Get available webhook events
   */
  getWebhookEvents = async (req: Request, res: Response) => {
    try {
      const events = await this.webhookService.getAvailableEvents()

      res.json({
        success: true,
        events
      })
    } catch (error: any) {
      logger.error('Get webhook events error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve webhook events'
      })
    }
  }

  // ============================================================================
  // LMS INTEGRATION
  // ============================================================================

  /**
   * Connect to specific LMS platform
   */
  connectLMS = async (req: Request, res: Response) => {
    try {
      const { platform } = req.params
      const universityId = req.university?.id
      const credentials = req.body

      const connection = await this.lmsIntegrationService.connectLMS(
        universityId,
        platform,
        credentials
      )

      res.json({
        success: true,
        message: `Connected to ${platform} successfully`,
        connection: {
          id: connection.id,
          platform: connection.platform,
          status: connection.status,
          connected_at: connection.connectedAt
        }
      })
    } catch (error: any) {
      logger.error('Connect LMS error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to connect to LMS'
      })
    }
  }

  /**
   * Sync data from connected LMS
   */
  syncFromLMS = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id
      const { data_types, course_ids } = req.body

      const result = await this.lmsIntegrationService.syncFromLMS(universityId, {
        dataTypes: data_types,
        courseIds: course_ids
      })

      res.json({
        success: true,
        message: 'LMS sync completed',
        result
      })
    } catch (error: any) {
      logger.error('Sync from LMS error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to sync from LMS'
      })
    }
  }

  /**
   * Check LMS connection status
   */
  getLMSStatus = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id

      const status = await this.lmsIntegrationService.getConnectionStatus(universityId)

      res.json({
        success: true,
        status
      })
    } catch (error: any) {
      logger.error('Get LMS status error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve LMS status'
      })
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk import university data
   */
  bulkImport = async (req: Request, res: Response) => {
    try {
      const { data_type, data, options } = req.body
      const universityId = req.university?.id

      const result = await this.universityService.bulkImport(universityId, data_type, data, options)

      res.json({
        success: true,
        message: 'Bulk import completed',
        result
      })
    } catch (error: any) {
      logger.error('Bulk import error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to perform bulk import'
      })
    }
  }

  /**
   * Bulk export university data
   */
  bulkExport = async (req: Request, res: Response) => {
    try {
      const { data_type, format = 'json', filters } = req.query
      const universityId = req.university?.id

      const result = await this.universityService.bulkExport(universityId, {
        dataType: data_type as string,
        format: format as string,
        filters: filters ? JSON.parse(filters as string) : {}
      })

      res.json({
        success: true,
        data: result.data,
        format: result.format,
        exported_at: result.exportedAt,
        record_count: result.recordCount
      })
    } catch (error: any) {
      logger.error('Bulk export error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to perform bulk export'
      })
    }
  }

  /**
   * Get import template for bulk operations
   */
  getBulkTemplate = async (req: Request, res: Response) => {
    try {
      const { type } = req.params

      const template = await this.universityService.getBulkImportTemplate(type)

      res.json({
        success: true,
        template
      })
    } catch (error: any) {
      logger.error('Get bulk template error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve bulk template'
      })
    }
  }

  // ============================================================================
  // PRIVACY & COMPLIANCE
  // ============================================================================

  /**
   * Manage student privacy consent
   */
  managePrivacyConsent = async (req: Request, res: Response) => {
    try {
      const { studentId, consentType, granted, metadata } = req.body
      const universityId = req.university?.id

      const consent = await this.privacyService.manageConsent(universityId, {
        studentId,
        consentType,
        granted,
        metadata
      })

      res.json({
        success: true,
        message: 'Privacy consent updated successfully',
        consent
      })
    } catch (error: any) {
      logger.error('Manage privacy consent error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to manage privacy consent'
      })
    }
  }

  /**
   * Get privacy audit log
   */
  getPrivacyAuditLog = async (req: Request, res: Response) => {
    try {
      const universityId = req.university?.id
      const { student_id, start_date, end_date, action_type } = req.query

      const auditLog = await this.privacyService.getAuditLog(universityId, {
        studentId: student_id as string,
        startDate: start_date as string,
        endDate: end_date as string,
        actionType: action_type as string
      })

      res.json({
        success: true,
        audit_log: auditLog
      })
    } catch (error: any) {
      logger.error('Get privacy audit log error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to retrieve privacy audit log'
      })
    }
  }

  /**
   * Delete student data (GDPR/FERPA compliance)
   */
  deleteStudentData = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { reason, retain_anonymous_analytics = false } = req.body
      const universityId = req.university?.id

      const result = await this.privacyService.deleteStudentData(universityId, studentId, {
        reason,
        retainAnonymousAnalytics: retain_anonymous_analytics
      })

      res.json({
        success: true,
        message: 'Student data deletion completed',
        result
      })
    } catch (error: any) {
      logger.error('Delete student data error:', error)
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete student data'
      })
    }
  }
}