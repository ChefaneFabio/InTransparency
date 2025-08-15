const validator = require('validator')

class ValidationService {
  // Main validation function
  validateInput(data, rules) {
    const errors = {}
    let isValid = true

    for (const field in rules) {
      const value = data[field]
      const fieldRules = rules[field].split('|')

      for (const rule of fieldRules) {
        const [ruleName, ruleValue] = rule.split(':')
        const error = this.validateField(field, value, ruleName, ruleValue)
        
        if (error) {
          errors[field] = error
          isValid = false
          break // Stop at first error for this field
        }
      }
    }

    return {
      valid: isValid,
      errors
    }
  }

  // Validate individual field
  validateField(fieldName, value, ruleName, ruleValue) {
    switch (ruleName) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return `${this.formatFieldName(fieldName)} is required`
        }
        break

      case 'email':
        if (value && !validator.isEmail(value)) {
          return `${this.formatFieldName(fieldName)} must be a valid email address`
        }
        break

      case 'min':
        const minLength = parseInt(ruleValue)
        if (value && value.length < minLength) {
          return `${this.formatFieldName(fieldName)} must be at least ${minLength} characters`
        }
        break

      case 'max':
        const maxLength = parseInt(ruleValue)
        if (value && value.length > maxLength) {
          return `${this.formatFieldName(fieldName)} must not exceed ${maxLength} characters`
        }
        break

      case 'minValue':
        const minValue = parseFloat(ruleValue)
        if (value !== undefined && parseFloat(value) < minValue) {
          return `${this.formatFieldName(fieldName)} must be at least ${minValue}`
        }
        break

      case 'maxValue':
        const maxValue = parseFloat(ruleValue)
        if (value !== undefined && parseFloat(value) > maxValue) {
          return `${this.formatFieldName(fieldName)} must not exceed ${maxValue}`
        }
        break

      case 'numeric':
        if (value && !validator.isNumeric(value.toString())) {
          return `${this.formatFieldName(fieldName)} must be a number`
        }
        break

      case 'alpha':
        if (value && !validator.isAlpha(value)) {
          return `${this.formatFieldName(fieldName)} must contain only letters`
        }
        break

      case 'alphanumeric':
        if (value && !validator.isAlphanumeric(value)) {
          return `${this.formatFieldName(fieldName)} must contain only letters and numbers`
        }
        break

      case 'url':
        if (value && !validator.isURL(value)) {
          return `${this.formatFieldName(fieldName)} must be a valid URL`
        }
        break

      case 'in':
        const allowedValues = ruleValue.split(',')
        if (value && !allowedValues.includes(value)) {
          return `${this.formatFieldName(fieldName)} must be one of: ${allowedValues.join(', ')}`
        }
        break

      case 'array':
        if (value && !Array.isArray(value)) {
          return `${this.formatFieldName(fieldName)} must be an array`
        }
        break

      case 'boolean':
        if (value !== undefined && typeof value !== 'boolean') {
          return `${this.formatFieldName(fieldName)} must be true or false`
        }
        break

      case 'date':
        if (value && !validator.isISO8601(value)) {
          return `${this.formatFieldName(fieldName)} must be a valid date`
        }
        break

      case 'uuid':
        if (value && !validator.isUUID(value)) {
          return `${this.formatFieldName(fieldName)} must be a valid UUID`
        }
        break

      case 'password':
        if (value) {
          const passwordErrors = this.validatePassword(value)
          if (passwordErrors.length > 0) {
            return `${this.formatFieldName(fieldName)}: ${passwordErrors.join(', ')}`
          }
        }
        break

      case 'phone':
        if (value && !validator.isMobilePhone(value)) {
          return `${this.formatFieldName(fieldName)} must be a valid phone number`
        }
        break

      case 'json':
        if (value) {
          try {
            JSON.parse(value)
          } catch (error) {
            return `${this.formatFieldName(fieldName)} must be valid JSON`
          }
        }
        break

      case 'file':
        if (value && typeof value !== 'object') {
          return `${this.formatFieldName(fieldName)} must be a valid file`
        }
        break

      case 'image':
        if (value && value.mimetype && !value.mimetype.startsWith('image/')) {
          return `${this.formatFieldName(fieldName)} must be an image file`
        }
        break

      default:
        // Unknown rule, skip validation
        break
    }

    return null
  }

  // Validate password strength
  validatePassword(password) {
    const errors = []

    if (password.length < 8) {
      errors.push('must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('must contain at least one special character')
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ]

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('is too common, please choose a stronger password')
    }

    return errors
  }

  // Format field name for error messages
  formatFieldName(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  // Sanitize input data
  sanitizeInput(data) {
    const sanitized = {}

    for (const key in data) {
      let value = data[key]

      if (typeof value === 'string') {
        // Trim whitespace
        value = value.trim()
        
        // Escape HTML entities
        value = validator.escape(value)
        
        // Remove null bytes
        value = value.replace(/\0/g, '')
      }

      sanitized[key] = value
    }

    return sanitized
  }

  // Validate file upload
  validateFileUpload(file, options = {}) {
    const errors = []
    const {
      allowedTypes = [],
      maxSize = 10 * 1024 * 1024, // 10MB default
      minSize = 0
    } = options

    if (!file) {
      errors.push('No file provided')
      return errors
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must not exceed ${this.formatFileSize(maxSize)}`)
    }

    if (file.size < minSize) {
      errors.push(`File size must be at least ${this.formatFileSize(minSize)}`)
    }

    // Check file type
    if (allowedTypes.length > 0) {
      const fileType = file.mimetype || ''
      const isAllowed = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.slice(0, -1))
        }
        return fileType === type
      })

      if (!isAllowed) {
        errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
      }
    }

    // Check filename
    if (file.originalname) {
      // Check for dangerous file extensions
      const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com']
      const fileExtension = file.originalname.toLowerCase().split('.').pop()
      
      if (dangerousExtensions.includes(`.${fileExtension}`)) {
        errors.push('File type is not allowed for security reasons')
      }
    }

    return errors
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Validate array of items
  validateArray(array, itemRules) {
    const errors = []

    if (!Array.isArray(array)) {
      return ['Must be an array']
    }

    array.forEach((item, index) => {
      const validation = this.validateInput(item, itemRules)
      if (!validation.valid) {
        errors.push(`Item ${index + 1}: ${Object.values(validation.errors).join(', ')}`)
      }
    })

    return errors
  }

  // Custom validation rules
  addCustomRule(ruleName, validatorFunction) {
    this.customRules = this.customRules || {}
    this.customRules[ruleName] = validatorFunction
  }

  // Check if value matches custom rule
  validateCustomRule(value, ruleName, ruleValue) {
    if (this.customRules && this.customRules[ruleName]) {
      return this.customRules[ruleName](value, ruleValue)
    }
    return null
  }
}

// Create singleton instance
const validationService = new ValidationService()

// Export main functions
module.exports = {
  validateInput: validationService.validateInput.bind(validationService),
  validateField: validationService.validateField.bind(validationService),
  validatePassword: validationService.validatePassword.bind(validationService),
  sanitizeInput: validationService.sanitizeInput.bind(validationService),
  validateFileUpload: validationService.validateFileUpload.bind(validationService),
  validateArray: validationService.validateArray.bind(validationService),
  formatFileSize: validationService.formatFileSize.bind(validationService),
  addCustomRule: validationService.addCustomRule.bind(validationService)
}