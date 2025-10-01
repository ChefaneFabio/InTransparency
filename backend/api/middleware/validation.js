const InputValidator = require('../utils/validation')
const config = require('../config/environment')

/**
 * Middleware for input validation and sanitization
 */

// Generic validation middleware
const validateInput = (rules) => {
  return (req, res, next) => {
    const errors = []
    const sanitizedData = {}

    // Validate body
    if (rules.body) {
      for (const field in rules.body) {
        const rule = rules.body[field]
        const value = req.body[field]

        const result = validateField(field, value, rule)
        if (!result.isValid) {
          errors.push({ field, message: result.error })
        } else {
          sanitizedData[field] = result.value !== undefined ? result.value : value
        }
      }

      // Replace body with sanitized data
      req.body = { ...req.body, ...sanitizedData }
    }

    // Validate query parameters
    if (rules.query) {
      for (const field in rules.query) {
        const rule = rules.query[field]
        const value = req.query[field]

        const result = validateField(field, value, rule)
        if (!result.isValid) {
          errors.push({ field: `query.${field}`, message: result.error })
        } else if (result.value !== undefined) {
          req.query[field] = result.value
        }
      }
    }

    // Validate URL parameters
    if (rules.params) {
      for (const field in rules.params) {
        const rule = rules.params[field]
        const value = req.params[field]

        const result = validateField(field, value, rule)
        if (!result.isValid) {
          errors.push({ field: `params.${field}`, message: result.error })
        } else if (result.value !== undefined) {
          req.params[field] = result.value
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors
      })
    }

    next()
  }
}

// Validate individual field based on rules
function validateField(field, value, rule) {
  // Check if field is required
  if (rule.required && !value) {
    return { isValid: false, error: `${field} is required` }
  }

  // If field is optional and not provided, skip validation
  if (!rule.required && !value) {
    return { isValid: true }
  }

  // Apply type-specific validation
  switch (rule.type) {
    case 'email':
      return InputValidator.validateEmail(value)

    case 'password':
      return InputValidator.validatePassword(value)

    case 'string':
      const sanitized = InputValidator.sanitizeString(value, {
        maxLength: rule.maxLength,
        stripHtml: rule.stripHtml !== false,
        escape: rule.escape
      })

      if (rule.minLength && sanitized.length < rule.minLength) {
        return { isValid: false, error: `${field} must be at least ${rule.minLength} characters` }
      }

      if (rule.pattern && !new RegExp(rule.pattern).test(sanitized)) {
        return { isValid: false, error: `${field} format is invalid` }
      }

      if (rule.enum && !rule.enum.includes(sanitized)) {
        return { isValid: false, error: `${field} must be one of: ${rule.enum.join(', ')}` }
      }

      return { isValid: true, value: sanitized }

    case 'number':
      return InputValidator.validateNumber(value, {
        min: rule.min,
        max: rule.max,
        integer: rule.integer
      })

    case 'boolean':
      const boolValue = value === 'true' || value === true
      return { isValid: true, value: boolValue }

    case 'date':
      return InputValidator.validateDate(value, {
        minDate: rule.minDate,
        maxDate: rule.maxDate
      })

    case 'url':
      return InputValidator.validateURL(value, {
        protocols: rule.protocols
      })

    case 'phone':
      return InputValidator.validatePhone(value, rule.locale)

    case 'array':
      if (!Array.isArray(value)) {
        return { isValid: false, error: `${field} must be an array` }
      }

      if (rule.minItems && value.length < rule.minItems) {
        return { isValid: false, error: `${field} must have at least ${rule.minItems} items` }
      }

      if (rule.maxItems && value.length > rule.maxItems) {
        return { isValid: false, error: `${field} must have no more than ${rule.maxItems} items` }
      }

      // Validate each item if item rules are provided
      if (rule.items) {
        const sanitizedArray = []
        for (const item of value) {
          const itemResult = validateField(`${field} item`, item, rule.items)
          if (!itemResult.isValid) {
            return itemResult
          }
          sanitizedArray.push(itemResult.value !== undefined ? itemResult.value : item)
        }
        return { isValid: true, value: sanitizedArray }
      }

      return { isValid: true }

    case 'object':
      if (typeof value !== 'object' || value === null) {
        return { isValid: false, error: `${field} must be an object` }
      }

      const sanitizedObject = InputValidator.sanitizeObject(value, {
        stripHtml: true
      })

      return { isValid: true, value: sanitizedObject }

    default:
      return { isValid: true, value }
  }
}

// Middleware to prevent SQL injection
const preventSQLInjection = (req, res, next) => {
  const checkValue = (value) => {
    if (typeof value === 'string' && !InputValidator.checkSQLInjection(value)) {
      return false
    }
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (!checkValue(value[key])) {
          return false
        }
      }
    }
    return true
  }

  // Check all input sources
  const sources = [req.body, req.query, req.params]
  for (const source of sources) {
    if (source && !checkValue(source)) {
      if (config.isDevelopment()) {
        console.error('SQL injection attempt detected:', req.ip)
      }
      return res.status(400).json({
        success: false,
        error: 'Invalid characters detected in input'
      })
    }
  }

  next()
}

// File upload validation middleware
const validateFileUpload = (options = {}) => {
  return (req, res, next) => {
    if (!req.files && !req.file) {
      if (options.required) {
        return res.status(400).json({
          success: false,
          error: 'File upload is required'
        })
      }
      return next()
    }

    const files = req.files || [req.file]
    const errors = []

    for (const file of files) {
      if (!file) continue

      const result = InputValidator.validateFile(file, {
        maxSize: options.maxSize,
        allowedTypes: options.allowedTypes,
        allowedExtensions: options.allowedExtensions
      })

      if (!result.isValid) {
        errors.push(result.error)
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'File validation failed',
        errors
      })
    }

    next()
  }
}

// Rate limiting middleware
const rateLimiter = InputValidator.createRateLimiter(5, 60000) // 5 attempts per minute

const rateLimit = (identifier = 'ip') => {
  return (req, res, next) => {
    const id = identifier === 'ip' ? req.ip : req.user?.id || req.ip

    const result = rateLimiter.check(id)

    if (!result.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: Math.ceil(result.retryAfter / 1000)
      })
    }

    next()
  }
}

module.exports = {
  validateInput,
  preventSQLInjection,
  validateFileUpload,
  rateLimit
}