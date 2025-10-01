const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const config = require('../config/environment')
const { securityLogger } = require('../middleware/logging')

/**
 * Secure password reset service
 * Implements secure token-based password reset with rate limiting and monitoring
 */

class PasswordResetService {
  constructor() {
    this.redis = null
    this.tokens = new Map() // Memory fallback
    this.attempts = new Map() // Track reset attempts
    this.cleanupInterval = null
  }

  // Initialize with Redis client
  init(redisClient) {
    this.redis = redisClient
    this.startCleanup()
  }

  // Generate secure reset token
  generateResetToken() {
    return crypto.randomBytes(48).toString('hex')
  }

  // Generate short verification code (for SMS/email)
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Hash token for storage
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  // Create reset token data
  createResetData(userId, email, req = null) {
    const now = Date.now()
    return {
      userId,
      email: email.toLowerCase(),
      createdAt: now,
      expiresAt: now + this.getTokenExpiry(),
      used: false,
      attempts: 0,
      ipAddress: req ? this.getClientIP(req) : null,
      userAgent: req ? req.get('User-Agent') : null
    }
  }

  // Store reset token
  async storeResetToken(token, resetData) {
    const hashedToken = this.hashToken(token)
    const key = this.getTokenKey(hashedToken)
    const expiry = Math.floor(this.getTokenExpiry() / 1000)

    try {
      if (this.redis) {
        await this.redis.setex(key, expiry, JSON.stringify(resetData))
      } else {
        // Memory fallback
        this.tokens.set(key, resetData)
      }
      return true
    } catch (error) {
      console.error('Failed to store reset token:', error)
      return false
    }
  }

  // Retrieve reset token data
  async getResetToken(token) {
    const hashedToken = this.hashToken(token)
    const key = this.getTokenKey(hashedToken)

    try {
      if (this.redis) {
        const data = await this.redis.get(key)
        return data ? JSON.parse(data) : null
      } else {
        // Memory fallback
        const data = this.tokens.get(key)
        if (data && data.expiresAt > Date.now()) {
          return data
        }
        if (data) {
          this.tokens.delete(key) // Clean expired
        }
        return null
      }
    } catch (error) {
      console.error('Failed to retrieve reset token:', error)
      return null
    }
  }

  // Delete reset token
  async deleteResetToken(token) {
    const hashedToken = this.hashToken(token)
    const key = this.getTokenKey(hashedToken)

    try {
      if (this.redis) {
        await this.redis.del(key)
      } else {
        this.tokens.delete(key)
      }
      return true
    } catch (error) {
      console.error('Failed to delete reset token:', error)
      return false
    }
  }

  // Check rate limiting for reset requests
  async checkResetRateLimit(identifier) {
    const key = `reset_attempts:${identifier}`
    const windowMs = 60 * 60 * 1000 // 1 hour
    const maxAttempts = 3

    try {
      if (this.redis) {
        const attempts = await this.redis.incr(key)
        if (attempts === 1) {
          await this.redis.expire(key, Math.floor(windowMs / 1000))
        }
        return {
          allowed: attempts <= maxAttempts,
          attempts,
          remaining: Math.max(0, maxAttempts - attempts),
          resetTime: Date.now() + windowMs
        }
      } else {
        // Memory fallback
        const now = Date.now()
        const attemptData = this.attempts.get(key) || { count: 0, resetTime: now + windowMs }

        if (attemptData.resetTime <= now) {
          attemptData.count = 1
          attemptData.resetTime = now + windowMs
        } else {
          attemptData.count += 1
        }

        this.attempts.set(key, attemptData)

        return {
          allowed: attemptData.count <= maxAttempts,
          attempts: attemptData.count,
          remaining: Math.max(0, maxAttempts - attemptData.count),
          resetTime: attemptData.resetTime
        }
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      return { allowed: true, attempts: 0, remaining: 3 }
    }
  }

  // Request password reset
  async requestPasswordReset(email, req = null) {
    try {
      const normalizedEmail = email.toLowerCase().trim()

      // Check rate limiting
      const rateLimit = await this.checkResetRateLimit(normalizedEmail)
      if (!rateLimit.allowed) {
        securityLogger.passwordReset(req, {
          event: 'rate_limit_exceeded',
          email: normalizedEmail,
          attempts: rateLimit.attempts
        })

        return {
          success: false,
          error: 'Too many password reset requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }
      }

      // Find user by email (this would use your user database)
      const user = await this.findUserByEmail(normalizedEmail)
      if (!user) {
        // Don't reveal if email exists - return success anyway
        securityLogger.passwordReset(req, {
          event: 'reset_requested_invalid_email',
          email: normalizedEmail
        })

        return {
          success: true,
          message: 'If this email exists in our system, you will receive a password reset link.'
        }
      }

      // Generate reset token
      const resetToken = this.generateResetToken()
      const resetData = this.createResetData(user.id, normalizedEmail, req)

      // Store token
      const stored = await this.storeResetToken(resetToken, resetData)
      if (!stored) {
        return {
          success: false,
          error: 'Failed to create password reset token. Please try again.'
        }
      }

      // Send reset email (implement email service integration)
      const emailSent = await this.sendResetEmail(normalizedEmail, resetToken)
      if (!emailSent) {
        // Clean up token if email failed
        await this.deleteResetToken(resetToken)
        return {
          success: false,
          error: 'Failed to send password reset email. Please try again.'
        }
      }

      // Log successful request
      securityLogger.passwordReset(req, {
        event: 'reset_requested',
        userId: user.id,
        email: normalizedEmail
      })

      return {
        success: true,
        message: 'If this email exists in our system, you will receive a password reset link.',
        expiresIn: Math.floor(this.getTokenExpiry() / 1000 / 60) // minutes
      }
    } catch (error) {
      console.error('Password reset request failed:', error)
      return {
        success: false,
        error: 'An error occurred while processing your request. Please try again.'
      }
    }
  }

  // Verify reset token
  async verifyResetToken(token, req = null) {
    try {
      const resetData = await this.getResetToken(token)

      if (!resetData) {
        securityLogger.passwordReset(req, {
          event: 'invalid_token_used',
          token: token.substring(0, 8) + '...' // Partial token for logging
        })

        return {
          success: false,
          error: 'Invalid or expired password reset token.'
        }
      }

      if (resetData.used) {
        securityLogger.passwordReset(req, {
          event: 'used_token_reused',
          userId: resetData.userId,
          email: resetData.email
        })

        return {
          success: false,
          error: 'This password reset token has already been used.'
        }
      }

      if (resetData.expiresAt <= Date.now()) {
        await this.deleteResetToken(token)
        securityLogger.passwordReset(req, {
          event: 'expired_token_used',
          userId: resetData.userId,
          email: resetData.email
        })

        return {
          success: false,
          error: 'This password reset token has expired.'
        }
      }

      // Validate IP consistency (optional security check)
      if (config.isProduction() && resetData.ipAddress && req) {
        const currentIP = this.getClientIP(req)
        if (resetData.ipAddress !== currentIP) {
          securityLogger.passwordReset(req, {
            event: 'ip_mismatch',
            userId: resetData.userId,
            originalIP: resetData.ipAddress,
            currentIP
          })
          // Could require additional verification here
        }
      }

      return {
        success: true,
        data: {
          userId: resetData.userId,
          email: resetData.email,
          expiresAt: resetData.expiresAt
        }
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      return {
        success: false,
        error: 'Failed to verify password reset token.'
      }
    }
  }

  // Reset password
  async resetPassword(token, newPassword, req = null) {
    try {
      // Verify token first
      const verification = await this.verifyResetToken(token, req)
      if (!verification.success) {
        return verification
      }

      const { userId, email } = verification.data

      // Validate password strength
      const passwordValidation = this.validatePasswordStrength(newPassword)
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: passwordValidation.error
        }
      }

      // Hash new password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update user password (implement database update)
      const updated = await this.updateUserPassword(userId, hashedPassword)
      if (!updated) {
        return {
          success: false,
          error: 'Failed to update password. Please try again.'
        }
      }

      // Mark token as used
      const resetData = await this.getResetToken(token)
      if (resetData) {
        resetData.used = true
        resetData.usedAt = Date.now()
        await this.storeResetToken(token, resetData)
      }

      // Invalidate all user sessions
      await this.invalidateUserSessions(userId)

      // Log successful password reset
      securityLogger.passwordReset(req, {
        event: 'password_reset_successful',
        userId,
        email
      })

      // Send confirmation email
      await this.sendPasswordChangeConfirmation(email)

      return {
        success: true,
        message: 'Your password has been successfully reset. Please log in with your new password.'
      }
    } catch (error) {
      console.error('Password reset failed:', error)
      return {
        success: false,
        error: 'An error occurred while resetting your password. Please try again.'
      }
    }
  }

  // Validate password strength
  validatePasswordStrength(password) {
    const minLength = 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const errors = []

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`)
    }

    if (!hasUppercase) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!hasLowercase) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!hasNumbers) {
      errors.push('Password must contain at least one number')
    }

    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character')
    }

    return {
      valid: errors.length === 0,
      error: errors.join('. ')
    }
  }

  // Helper methods (to be implemented with your specific database/email service)
  async findUserByEmail(email) {
    // Implement database lookup
    // return await database.findUserByEmail(email)
    return null // Placeholder
  }

  async updateUserPassword(userId, hashedPassword) {
    // Implement database update
    // return await database.updateUserPassword(userId, hashedPassword)
    return true // Placeholder
  }

  async invalidateUserSessions(userId) {
    // Implement session invalidation
    // await sessionManager.deleteUserSessions(userId)
  }

  async sendResetEmail(email, token) {
    // Implement email service integration
    console.log(`Password reset email would be sent to ${email} with token ${token}`)
    return true // Placeholder
  }

  async sendPasswordChangeConfirmation(email) {
    // Implement confirmation email
    console.log(`Password change confirmation sent to ${email}`)
    return true // Placeholder
  }

  // Utility methods
  getTokenKey(hashedToken) {
    return `pwd_reset:${hashedToken}`
  }

  getTokenExpiry() {
    return 60 * 60 * 1000 // 1 hour
  }

  getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for']
    return forwarded ? forwarded.split(',')[0].trim() : req.connection.remoteAddress
  }

  // Cleanup expired tokens (memory fallback)
  startCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }

    this.cleanupInterval = setInterval(() => {
      const now = Date.now()

      // Clean expired tokens
      for (const [key, data] of this.tokens.entries()) {
        if (data.expiresAt <= now) {
          this.tokens.delete(key)
        }
      }

      // Clean expired rate limit attempts
      for (const [key, data] of this.attempts.entries()) {
        if (data.resetTime <= now) {
          this.attempts.delete(key)
        }
      }
    }, 5 * 60 * 1000) // Clean every 5 minutes
  }

  // Shutdown
  shutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Export singleton instance
const passwordResetService = new PasswordResetService()

module.exports = {
  passwordResetService,
  PasswordResetService
}