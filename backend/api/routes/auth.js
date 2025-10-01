const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const database = require('../database/Database')
const config = require('../config/environment')
const { authenticate } = require('../middleware/auth')
const { validateInput, preventSQLInjection, rateLimit } = require('../middleware/validation')
const { passwordResetService } = require('../services/passwordReset')
const router = express.Router()

// Input validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    })
  }
  next()
}

// Validation rules for registration
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage('First name is required (max 50 characters)'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage('Last name is required (max 50 characters)'),
  body('role')
    .isIn(['student', 'company', 'university'])
    .withMessage('Invalid role specified')
]

// Validation rules for login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

// Register new user with validation
router.post('/register',
  rateLimit('ip'),
  preventSQLInjection,
  validateRegistration,
  handleValidationErrors,
  async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      university,
      company,
      department,
      graduationYear,
      major
    } = req.body

    // Create user
    const user = await database.createUser({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim().toLowerCase(),
      password,
      role,
      university,
      company,
      department,
      graduationYear: graduationYear ? parseInt(graduationYear) : null,
      major: major?.trim()
    })

    // Generate token
    const token = user.generateToken()

    // Return user data (password excluded by toJSON)
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        token
      }
    })
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Registration error:', error.message)
    }

    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Login user with validation
router.post('/login',
  rateLimit('ip'),
  preventSQLInjection,
  validateLogin,
  handleValidationErrors,
  async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }

    // Find user by email
    const user = await database.findUserByEmail(email.trim().toLowerCase())
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password)
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Generate token
    const token = user.generateToken()

    // Update last login
    await database.updateUser(user.id, { 
      lastLoginAt: new Date() 
    })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    })
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Login error:', error.message)
    }

    res.status(500).json({
      success: false,
      error: 'Login failed'
    })
  }
})

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user
    
    // Get user stats
    const stats = await database.getUserStats(user.id)
    
    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        stats
      }
    })
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Get user error:', error.message)
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get user information'
    })
  }
})

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.userId
    const updates = req.body

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.id
    delete updates.email
    delete updates.password
    delete updates.role
    delete updates.createdAt

    const updatedUser = await database.updateUser(userId, updates)
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    })
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Update profile error:', error.message)
    }

    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Logout (client-side token removal, but we can blacklist tokens if needed)
router.post('/logout', authenticate, async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just send a success response
    
    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Logout error:', error.message)
    }

    res.status(500).json({
      success: false,
      error: 'Logout failed'
    })
  }
})

// Verify email (placeholder - would require email service integration)
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body
    
    // In a real implementation, you would verify the email token
    // For now, return success
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Email verification error:', error.message)
    }

    res.status(400).json({
      success: false,
      error: 'Email verification failed'
    })
  }
})

// Request password reset
router.post('/forgot-password',
  rateLimit('ip'),
  preventSQLInjection,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email } = req.body
      const result = await passwordResetService.requestPasswordReset(email, req)

      const statusCode = result.success ? 200 : 400
      res.status(statusCode).json(result)
    } catch (error) {
      if (config.isDevelopment()) {
        console.error('Password reset error:', error.message)
      }

      res.status(500).json({
        success: false,
        error: 'Password reset failed'
      })
    }
  }
)

// Verify password reset token
router.post('/verify-reset-token',
  rateLimit('ip'),
  preventSQLInjection,
  [
    body('token')
      .isLength({ min: 32 })
      .withMessage('Invalid token format')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { token } = req.body
      const result = await passwordResetService.verifyResetToken(token, req)

      const statusCode = result.success ? 200 : 400
      res.status(statusCode).json(result)
    } catch (error) {
      if (config.isDevelopment()) {
        console.error('Token verification error:', error.message)
      }

      res.status(500).json({
        success: false,
        error: 'Token verification failed'
      })
    }
  }
)

// Reset password with token
router.post('/reset-password',
  rateLimit('ip'),
  preventSQLInjection,
  [
    body('token')
      .isLength({ min: 32 })
      .withMessage('Invalid token format'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { token, password } = req.body
      const result = await passwordResetService.resetPassword(token, password, req)

      const statusCode = result.success ? 200 : 400
      res.status(statusCode).json(result)
    } catch (error) {
      if (config.isDevelopment()) {
        console.error('Password reset error:', error.message)
      }

      res.status(500).json({
        success: false,
        error: 'Password reset failed'
      })
    }
  }
)

module.exports = router