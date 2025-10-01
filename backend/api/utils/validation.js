const validator = require('validator')
const xss = require('xss')

/**
 * Comprehensive input validation and sanitization utilities
 */

// Custom XSS options for stricter sanitization
const xssOptions = {
  whiteList: {}, // No HTML tags allowed
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
}

class InputValidator {
  /**
   * Sanitize string input to prevent XSS
   */
  static sanitizeString(input, options = {}) {
    if (!input) return ''

    let sanitized = String(input).trim()

    // Remove XSS attempts
    sanitized = xss(sanitized, xssOptions)

    // Additional sanitization
    if (options.stripHtml) {
      sanitized = validator.stripLow(sanitized)
    }

    if (options.escape) {
      sanitized = validator.escape(sanitized)
    }

    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength)
    }

    return sanitized
  }

  /**
   * Validate and sanitize email
   */
  static validateEmail(email) {
    if (!email) {
      return { isValid: false, error: 'Email is required' }
    }

    const normalized = validator.normalizeEmail(email, {
      all_lowercase: true,
      gmail_remove_dots: false,
      gmail_remove_subaddress: false
    })

    if (!validator.isEmail(normalized)) {
      return { isValid: false, error: 'Invalid email format' }
    }

    // Additional checks for suspicious patterns
    const suspiciousPatterns = [
      /[<>]/,
      /javascript:/i,
      /on\w+=/i
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(normalized)) {
        return { isValid: false, error: 'Email contains invalid characters' }
      }
    }

    return { isValid: true, value: normalized }
  }

  /**
   * Validate password strength
   */
  static validatePassword(password) {
    if (!password) {
      return { isValid: false, error: 'Password is required' }
    }

    const errors = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '12345678', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', '1234567890'
    ]

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common')
    }

    if (errors.length > 0) {
      return { isValid: false, error: errors.join('. ') }
    }

    return { isValid: true }
  }

  /**
   * Validate URL
   */
  static validateURL(url, options = {}) {
    if (!url) {
      return { isValid: false, error: 'URL is required' }
    }

    const urlOptions = {
      protocols: options.protocols || ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
      allow_fragments: false,
      allow_query_components: true
    }

    if (!validator.isURL(url, urlOptions)) {
      return { isValid: false, error: 'Invalid URL format' }
    }

    // Check for suspicious patterns
    if (url.toLowerCase().includes('javascript:') ||
        url.toLowerCase().includes('data:')) {
      return { isValid: false, error: 'URL contains invalid protocol' }
    }

    return { isValid: true, value: url }
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone, locale = 'en-US') {
    if (!phone) {
      return { isValid: false, error: 'Phone number is required' }
    }

    const cleaned = phone.replace(/[\s\-\(\)]/g, '')

    if (!validator.isMobilePhone(cleaned, locale)) {
      return { isValid: false, error: 'Invalid phone number format' }
    }

    return { isValid: true, value: cleaned }
  }

  /**
   * Validate and sanitize numeric input
   */
  static validateNumber(input, options = {}) {
    const num = Number(input)

    if (isNaN(num)) {
      return { isValid: false, error: 'Must be a valid number' }
    }

    if (options.min !== undefined && num < options.min) {
      return { isValid: false, error: `Must be at least ${options.min}` }
    }

    if (options.max !== undefined && num > options.max) {
      return { isValid: false, error: `Must be no more than ${options.max}` }
    }

    if (options.integer && !Number.isInteger(num)) {
      return { isValid: false, error: 'Must be a whole number' }
    }

    return { isValid: true, value: num }
  }

  /**
   * Validate date
   */
  static validateDate(date, options = {}) {
    if (!date) {
      return { isValid: false, error: 'Date is required' }
    }

    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: 'Invalid date format' }
    }

    if (options.minDate && dateObj < new Date(options.minDate)) {
      return { isValid: false, error: `Date must be after ${options.minDate}` }
    }

    if (options.maxDate && dateObj > new Date(options.maxDate)) {
      return { isValid: false, error: `Date must be before ${options.maxDate}` }
    }

    return { isValid: true, value: dateObj.toISOString() }
  }

  /**
   * Validate file upload
   */
  static validateFile(file, options = {}) {
    if (!file) {
      return { isValid: false, error: 'File is required' }
    }

    const errors = []

    // Check file size
    const maxSize = options.maxSize || 10 * 1024 * 1024 // 10MB default
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`)
    }

    // Check file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const fileType = file.mimetype || file.type
      if (!options.allowedTypes.includes(fileType)) {
        errors.push(`File type must be one of: ${options.allowedTypes.join(', ')}`)
      }
    }

    // Check file extension
    if (options.allowedExtensions && options.allowedExtensions.length > 0) {
      const fileName = file.originalname || file.name
      const extension = fileName.split('.').pop().toLowerCase()
      if (!options.allowedExtensions.includes(extension)) {
        errors.push(`File extension must be one of: ${options.allowedExtensions.join(', ')}`)
      }
    }

    if (errors.length > 0) {
      return { isValid: false, error: errors.join('. ') }
    }

    return { isValid: true }
  }

  /**
   * Sanitize object recursively
   */
  static sanitizeObject(obj, options = {}) {
    if (!obj || typeof obj !== 'object') {
      return obj
    }

    const sanitized = Array.isArray(obj) ? [] : {}

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]

        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value, options)
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeObject(value, options)
        } else {
          sanitized[key] = value
        }
      }
    }

    return sanitized
  }

  /**
   * Validate against SQL injection patterns
   */
  static checkSQLInjection(input) {
    if (!input) return true

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
      /(--|\||;|\/\*|\*\/)/g,
      /(\bOR\b\s*\d+\s*=\s*\d+)/gi,
      /(\bAND\b\s*\d+\s*=\s*\d+)/gi,
      /(\'|\"|`|\\)/g
    ]

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        return false
      }
    }

    return true
  }

  /**
   * Rate limit check (to be used with Redis or similar)
   */
  static createRateLimiter(maxAttempts = 5, windowMs = 60000) {
    const attempts = new Map()

    return {
      check: (identifier) => {
        const now = Date.now()
        const userAttempts = attempts.get(identifier) || []

        // Clean old attempts
        const recentAttempts = userAttempts.filter(
          timestamp => now - timestamp < windowMs
        )

        if (recentAttempts.length >= maxAttempts) {
          return {
            allowed: false,
            retryAfter: windowMs - (now - recentAttempts[0])
          }
        }

        recentAttempts.push(now)
        attempts.set(identifier, recentAttempts)

        return { allowed: true }
      },
      reset: (identifier) => {
        attempts.delete(identifier)
      }
    }
  }
}

module.exports = InputValidator