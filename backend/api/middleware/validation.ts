import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { logger } from '../utils/logger'

/**
 * Generic request validation middleware using Joi schemas
 */
export const validateRequest = (requiredFields: string[], schema?: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for required fields
      const missingFields = requiredFields.filter(field => {
        const value = req.body[field]
        return value === undefined || value === null || value === ''
      })

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          missing_fields: missingFields,
          code: 'VALIDATION_ERROR'
        })
      }

      // Apply Joi schema validation if provided
      if (schema) {
        const { error, value } = schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true
        })

        if (error) {
          const validationErrors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }))

          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            validation_errors: validationErrors,
            code: 'VALIDATION_ERROR'
          })
        }

        // Replace req.body with validated/sanitized data
        req.body = value
      }

      next()
    } catch (error: any) {
      logger.error('Validation middleware error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error during validation',
        code: 'VALIDATION_SYSTEM_ERROR'
      })
    }
  }
}

/**
 * University registration validation schema
 */
export const universityRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(200).required()
    .messages({
      'string.min': 'University name must be at least 2 characters',
      'string.max': 'University name cannot exceed 200 characters'
    }),

  domain: Joi.string().domain().required()
    .messages({
      'string.domain': 'Please provide a valid university domain (e.g., university.edu)'
    }),

  contactEmail: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid contact email address'
    }),

  adminFirstName: Joi.string().min(1).max(50).required(),
  adminLastName: Joi.string().min(1).max(50).required(),

  studentInformationSystem: Joi.string().valid(
    'canvas', 'blackboard', 'moodle', 'brightspace', 'schoology', 'custom', 'other'
  ).required()
    .messages({
      'any.only': 'Student Information System must be one of: canvas, blackboard, moodle, brightspace, schoology, custom, other'
    }),

  expectedStudentCount: Joi.number().integer().min(1).max(1000000).required()
    .messages({
      'number.min': 'Expected student count must be at least 1',
      'number.max': 'Expected student count cannot exceed 1,000,000'
    }),

  address: Joi.object({
    street: Joi.string().max(200),
    city: Joi.string().max(100),
    state: Joi.string().max(50),
    country: Joi.string().max(50),
    postalCode: Joi.string().max(20)
  }).optional(),

  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
})

/**
 * Student data validation schema
 */
export const studentDataSchema = Joi.object({
  studentId: Joi.string().min(1).max(50).required()
    .messages({
      'string.min': 'Student ID is required',
      'string.max': 'Student ID cannot exceed 50 characters'
    }),

  email: Joi.string().email().required()
    .messages({
      'string.email': 'Valid email address is required'
    }),

  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),

  program: Joi.string().min(1).max(100).required()
    .messages({
      'string.min': 'Program name is required'
    }),

  year: Joi.number().integer().min(1).max(10).required()
    .messages({
      'number.min': 'Year must be at least 1',
      'number.max': 'Year cannot exceed 10'
    }),

  status: Joi.string().valid(
    'enrolled', 'graduated', 'dropped', 'transferred', 'suspended', 'on_leave'
  ).required()
    .messages({
      'any.only': 'Status must be one of: enrolled, graduated, dropped, transferred, suspended, on_leave'
    }),

  gpa: Joi.number().min(0).max(4.0).optional(),

  enrollmentDate: Joi.date().optional(),
  expectedGraduationDate: Joi.date().optional(),

  metadata: Joi.object().optional()
})

/**
 * Bulk student sync validation schema
 */
export const bulkStudentSyncSchema = Joi.object({
  students: Joi.array().items(studentDataSchema).min(1).max(1000).required()
    .messages({
      'array.min': 'At least one student is required',
      'array.max': 'Cannot sync more than 1000 students at once'
    })
})

/**
 * Grade data validation schema
 */
export const gradeSchema = Joi.object({
  studentId: Joi.string().required(),
  courseId: Joi.string().required(),
  courseName: Joi.string().max(200).required(),

  grade: Joi.alternatives().try(
    Joi.string().valid('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'),
    Joi.number().min(0).max(100)
  ).required(),

  credits: Joi.number().min(0).max(20).required(),
  semester: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2100).required(),

  instructor: Joi.string().max(100).optional(),
  gradeDate: Joi.date().optional()
})

/**
 * Project assignment validation schema
 */
export const projectAssignmentSchema = Joi.object({
  studentId: Joi.string().required(),
  courseId: Joi.string().required(),

  projectTitle: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).max(5000).required(),

  dueDate: Joi.date().greater('now').required()
    .messages({
      'date.greater': 'Due date must be in the future'
    }),

  requirements: Joi.array().items(Joi.string()).min(1).required(),

  maxPoints: Joi.number().min(0).optional(),

  rubric: Joi.object({
    criteria: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        points: Joi.number().min(0).required()
      })
    ).optional()
  }).optional(),

  allowedFileTypes: Joi.array().items(Joi.string()).optional(),
  maxFileSize: Joi.number().min(0).optional(),

  metadata: Joi.object().optional()
})

/**
 * Project submission validation schema
 */
export const projectSubmissionSchema = Joi.object({
  studentId: Joi.string().required(),
  projectId: Joi.string().required(),

  submissionData: Joi.object({
    description: Joi.string().max(2000).optional(),
    repositoryUrl: Joi.string().uri().optional(),
    liveUrl: Joi.string().uri().optional(),
    technologies: Joi.array().items(Joi.string()).optional(),
    comments: Joi.string().max(1000).optional()
  }).required(),

  files: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string().required(),
      size: Joi.number().required(),
      content: Joi.string().required(), // base64 encoded
      checksum: Joi.string().optional()
    })
  ).max(10).optional()
    .messages({
      'array.max': 'Cannot upload more than 10 files per submission'
    })
})

/**
 * Webhook configuration validation schema
 */
export const webhookConfigSchema = Joi.object({
  events: Joi.array().items(
    Joi.string().valid(
      'student.created', 'student.updated', 'student.graduated',
      'project.assigned', 'project.submitted', 'project.graded',
      'grade.posted', 'enrollment.changed', 'course.created'
    )
  ).min(1).required()
    .messages({
      'array.min': 'At least one event type must be selected'
    }),

  endpoint_url: Joi.string().uri({ scheme: ['https'] }).required()
    .messages({
      'string.uri': 'Webhook endpoint must be a valid HTTPS URL'
    }),

  secret: Joi.string().min(16).max(128).required()
    .messages({
      'string.min': 'Webhook secret must be at least 16 characters',
      'string.max': 'Webhook secret cannot exceed 128 characters'
    }),

  retry_policy: Joi.object({
    max_attempts: Joi.number().integer().min(1).max(10).default(3),
    backoff_multiplier: Joi.number().min(1).max(10).default(2),
    initial_delay_seconds: Joi.number().min(1).max(300).default(5)
  }).optional()
})

/**
 * Privacy consent validation schema
 */
export const privacyConsentSchema = Joi.object({
  studentId: Joi.string().required(),

  consentType: Joi.string().valid(
    'data_sharing', 'profile_visibility', 'employer_contact',
    'analytics_tracking', 'marketing_communications'
  ).required(),

  granted: Joi.boolean().required(),

  metadata: Joi.object({
    ip_address: Joi.string().ip().optional(),
    user_agent: Joi.string().optional(),
    timestamp: Joi.date().optional(),
    method: Joi.string().valid('web', 'api', 'email', 'phone').optional()
  }).optional()
})

/**
 * Validate file upload data
 */
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.body.files || []

    if (!Array.isArray(files)) {
      return res.status(400).json({
        success: false,
        error: 'Files must be an array',
        code: 'INVALID_FILE_FORMAT'
      })
    }

    // Check file count
    if (files.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Cannot upload more than 10 files at once',
        code: 'TOO_MANY_FILES'
      })
    }

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.name || !file.type || !file.content) {
        return res.status(400).json({
          success: false,
          error: `File ${i + 1}: name, type, and content are required`,
          code: 'INVALID_FILE_DATA'
        })
      }

      // Check file size (max 50MB per file)
      const maxSizeBytes = 50 * 1024 * 1024
      if (file.size > maxSizeBytes) {
        return res.status(400).json({
          success: false,
          error: `File ${i + 1}: exceeds maximum size of 50MB`,
          code: 'FILE_TOO_LARGE'
        })
      }

      // Validate allowed file types
      const allowedTypes = [
        'application/pdf', 'text/plain', 'application/zip',
        'image/jpeg', 'image/png', 'image/gif',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv', 'application/json'
      ]

      if (!allowedTypes.includes(file.type)) {
        return res.status(400).json({
          success: false,
          error: `File ${i + 1}: unsupported file type '${file.type}'`,
          code: 'UNSUPPORTED_FILE_TYPE'
        })
      }

      // Validate base64 content
      try {
        Buffer.from(file.content, 'base64')
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: `File ${i + 1}: invalid base64 content`,
          code: 'INVALID_FILE_CONTENT'
        })
      }
    }

    next()
  } catch (error: any) {
    logger.error('File validation error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during file validation',
      code: 'FILE_VALIDATION_ERROR'
    })
  }
}

/**
 * Validate query parameters for pagination and filtering
 */
export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, sort, order } = req.query

    // Validate pagination
    if (page && (isNaN(Number(page)) || Number(page) < 1)) {
      return res.status(400).json({
        success: false,
        error: 'Page must be a positive integer',
        code: 'INVALID_PAGE_PARAMETER'
      })
    }

    if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 1000)) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be between 1 and 1000',
        code: 'INVALID_LIMIT_PARAMETER'
      })
    }

    // Validate sorting
    if (order && !['asc', 'desc'].includes(order as string)) {
      return res.status(400).json({
        success: false,
        error: 'Order must be "asc" or "desc"',
        code: 'INVALID_ORDER_PARAMETER'
      })
    }

    next()
  } catch (error: any) {
    logger.error('Query parameter validation error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during parameter validation',
      code: 'PARAMETER_VALIDATION_ERROR'
    })
  }
}

/**
 * Sanitize input data to prevent XSS and injection attacks
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Recursive function to sanitize object properties
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        // Basic XSS prevention
        return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                 .replace(/javascript:/gi, '')
                 .replace(/on\w+\s*=/gi, '')
                 .trim()
      }

      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject)
      }

      if (obj && typeof obj === 'object') {
        const sanitized: any = {}
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitizeObject(value)
        }
        return sanitized
      }

      return obj
    }

    // Sanitize request body
    if (req.body) {
      req.body = sanitizeObject(req.body)
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query)
    }

    next()
  } catch (error: any) {
    logger.error('Input sanitization error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during input sanitization',
      code: 'SANITIZATION_ERROR'
    })
  }
}